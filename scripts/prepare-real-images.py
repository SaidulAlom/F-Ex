"""Generate optimized local WebP photographs from the bundled source assets.

Usage from the project root:

    python3 scripts/prepare-real-images.py

Requires Pillow. The script is optional at runtime: the generated WebP files are
already committed under public/images. Re-run it only if you replace any source
file in assets/source-images or change a crop in assets/image-sources.json.

Outputs with mode "phone-cutout" become transparent RGBA WebP assets containing
only one real phone, used by the frame-free hero. Outputs with mode
"isolated-phone" keep the older gradient-backed compositing for reference. The
`isolate_rect` coordinates are in source-image pixels, so update them if the
underlying source photograph changes.
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps
except ImportError as exc:  # pragma: no cover - developer convenience only
    raise SystemExit("Pillow is required: pip install Pillow") from exc

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets" / "image-sources.json"
SOURCE_DIR = ROOT / "assets" / "source-images"


def load_manifest() -> dict:
    with MANIFEST.open(encoding="utf-8") as handle:
        return json.load(handle)


def source_index(manifest: dict) -> dict[str, dict]:
    return {item["file"]: item for item in manifest["sources"]}


def flatten_image(image: Image.Image) -> Image.Image:
    """Composite transparency onto white so WebP output has no surprise alpha."""
    image = ImageOps.exif_transpose(image)
    has_alpha = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )
    if has_alpha:
        rgba = image.convert("RGBA")
        background = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        background.alpha_composite(rgba)
        return background.convert("RGB")
    return image.convert("RGB")


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    clean = value.lstrip("#")
    if len(clean) != 6:
        raise ValueError(f"Expected a 6-digit hex colour, got {value}")
    return tuple(int(clean[index : index + 2], 16) for index in (0, 2, 4))


def resize_image(
    image: Image.Image,
    size: tuple[int, int],
    mode: str,
    background: str = "#FFFFFF",
) -> Image.Image:
    if mode == "cover":
        return ImageOps.fit(
            image,
            size,
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
    return ImageOps.pad(
        image,
        size,
        method=Image.Resampling.LANCZOS,
        color=hex_to_rgb(background),
        centering=(0.5, 0.5),
    )


def masked_phone(image: Image.Image, output: dict) -> Image.Image:
    """Isolate one device from a transparent two-phone product photograph."""
    image = image.convert("RGBA")
    rect = output.get("isolate_rect")
    if rect:
        mask = Image.new("L", image.size, 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle(
            tuple(rect),
            radius=int(output.get("radius", 32)),
            fill=255,
        )
        mask = mask.filter(ImageFilter.GaussianBlur(1.5))
        image.putalpha(ImageChops.multiply(image.getchannel("A"), mask))
    bbox = image.getchannel("A").getbbox()
    if bbox:
        image = image.crop(bbox)
    return image


def phone_cutout_image(
    image: Image.Image,
    size: tuple[int, int],
    output: dict,
) -> Image.Image:
    """Return a transparent canvas containing only the isolated phone."""
    phone = masked_phone(image, output)
    target_w, target_h = size
    scale = min(
        (target_w * 0.96) / phone.width,
        (target_h * 0.96) / phone.height,
    )
    phone = phone.resize(
        (
            max(1, int(phone.width * scale)),
            max(1, int(phone.height * scale)),
        ),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    x = (target_w - phone.width) // 2
    y = (target_h - phone.height) // 2
    canvas.alpha_composite(phone, (x, y))
    return canvas


def isolated_phone_image(
    image: Image.Image,
    size: tuple[int, int],
    output: dict,
) -> Image.Image:
    """Older gradient-backed hero treatment, kept for reference."""
    image = masked_phone(image, output)
    target_w, target_h = size
    max_h = int(target_h * 0.93)
    max_w = int(target_w * 0.88)
    scale = min(max_w / image.width, max_h / image.height)
    phone = image.resize(
        (
            max(1, int(image.width * scale)),
            max(1, int(image.height * scale)),
        ),
        Image.Resampling.LANCZOS,
    )

    colours = output.get("background", ["#0B1220", "#1E40AF"])
    if not isinstance(colours, list) or len(colours) != 2:
        raise ValueError("isolated-phone background must be [top, bottom] hex colours")
    top = hex_to_rgb(colours[0])
    bottom = hex_to_rgb(colours[1])

    canvas = Image.new("RGB", size)
    gradient = ImageDraw.Draw(canvas)
    for y in range(target_h):
        t = y / max(1, target_h - 1)
        colour = tuple(
            int(top[index] + (bottom[index] - top[index]) * t)
            for index in range(3)
        )
        gradient.line([(0, y), (target_w, y)], fill=colour)

    glow = hex_to_rgb(output.get("glow", "#38BDF8"))
    glow_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    centre_x = target_w // 2
    centre_y = int(target_h * 0.52)
    max_radius = int(target_w * 0.62)
    for step in range(10, 0, -1):
        radius = int(max_radius * step / 10)
        alpha = int(18 * step / 10)
        glow_draw.ellipse(
            [
                centre_x - radius,
                centre_y - radius,
                centre_x + radius,
                centre_y + radius,
            ],
            fill=(*glow, alpha),
        )
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(70))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), glow_layer).convert("RGB")

    x = (target_w - phone.width) // 2
    y = (target_h - phone.height) // 2

    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    black = Image.new("RGBA", phone.size, (0, 0, 0, 255))
    black.putalpha(
        phone.getchannel("A")
        .filter(ImageFilter.GaussianBlur(28))
        .point(lambda alpha: int(alpha * 0.55))
    )
    shadow.alpha_composite(black, (x + 10, y + 18))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow).convert("RGB")
    canvas.paste(phone, (x, y), phone)
    return canvas


def remove_legacy_placeholders() -> None:
    shutil.rmtree(ROOT / "public" / "images" / "placeholders", ignore_errors=True)
    for folder in ("banners", "branches"):
        for path in (ROOT / "public" / "images" / folder).glob("*.svg"):
            path.unlink()
    legacy_script = ROOT / "scripts" / "generate-placeholders.py"
    if legacy_script.exists():
        legacy_script.unlink()


def write_source_docs(manifest: dict, sources: dict[str, dict]) -> None:
    lines = [
        "# Image sources & usage rights",
        "",
        manifest["notice"],
        "",
        f"**Source photographs:** {len(manifest['sources'])}  ",
        f"**Optimized WebP outputs:** {len(manifest['outputs'])}  ",
        "**Optimization:** Pillow → WebP quality 84, responsive target sizes, white padding for product photos and transparent single-phone cutouts for the frame-free hero.",
        "",
        "| Output | Used for | Source | Source page | Rights note |",
        "|---|---|---|---|---|",
    ]
    for output in manifest["outputs"]:
        source = sources[output["source"]]
        lines.append(
            "| `{target}` | {used_for} | {title} | <{url}> | {rights} |".format(
                target=output["target"],
                used_for=output["used_for"],
                title=source["title"].replace("|", "\\|"),
                url=source["url"],
                rights=source["rights"].replace("|", "\\|"),
            )
        )
    lines += [
        "",
        "## Important",
        "",
        "- These photos are bundled for a realistic demo only and are not actual F-Ex Store inventory or premises.",
        "- The hero shows two frame-free, transparent single-phone cutouts from official product photographs. There are no device frames, lifestyle scenes or hands.",
        "- Several sources are official manufacturer/retailer product images. Their appearance here does not imply endorsement or a commercial reuse licence.",
        "- Unsplash and Pexels items are stock photos; follow the licence shown on each source page and add attribution where required.",
        "- Before production, upload F-Ex Store's own product/branch photos to Cloudinary through the admin panel and remove these third-party demo assets.",
        "- To regenerate the local WebP files after replacing a source asset, run `npm run images:prepare`. If you replace a hero source, update its `isolate_rect` in `assets/image-sources.json` first.",
        "",
    ]
    (ROOT / "docs" / "IMAGE_SOURCES.md").write_text("\n".join(lines), encoding="utf-8")

    (ROOT / "assets" / "README.md").write_text(
        "# Source photographs\n\n"
        "This folder keeps the original downloaded photographs used to generate the optimized WebP files in `public/images`.\n\n"
        "Metadata, source URLs and rights notes live in `image-sources.json`; a readable report is generated at `docs/IMAGE_SOURCES.md`.\n\n"
        "Hero outputs with mode `phone-cutout` use a rounded-rectangle mask to isolate one device from a two-phone official product image and save it on a transparent RGBA canvas. "
        "The `isolate_rect` coordinates are source-image pixels; update them if you replace the source photo.\n\n"
        "Run `npm run images:prepare` after changing any source file. These are third-party demo assets, not actual F-Ex Store photos.\n",
        encoding="utf-8",
    )

    (ROOT / "public" / "images" / "README.md").write_text(
        "# Real image assets\n\n"
        "Product, branch, banner and hero photographs are optimized WebP files generated from `assets/source-images`.\n\n"
        "The hero contains two transparent single-phone cutouts with no surrounding device frames.\n\n"
        "The only SVG left here is `fex-logo.svg`, which is a vector brand mark rather than a placeholder photograph.\n\n"
        "See `docs/IMAGE_SOURCES.md` for source URLs and rights notes. Replace bundled third-party photos with F-Ex Store's own licensed Cloudinary photos before launch.\n",
        encoding="utf-8",
    )


def main() -> None:
    manifest = load_manifest()
    sources = source_index(manifest)
    remove_legacy_placeholders()

    for output in manifest["outputs"]:
        source_path = SOURCE_DIR / output["source"]
        if not source_path.exists():
            raise SystemExit(f"Missing source image: {source_path}")
        target_path = ROOT / output["target"]
        target_path.parent.mkdir(parents=True, exist_ok=True)
        mode = output.get("mode", "pad")

        with Image.open(source_path) as opened:
            if mode == "phone-cutout":
                image = ImageOps.exif_transpose(opened).convert("RGBA")
                result = phone_cutout_image(
                    image,
                    tuple(output["size"]),
                    output,
                )
            elif mode == "isolated-phone":
                image = ImageOps.exif_transpose(opened).convert("RGBA")
                result = isolated_phone_image(
                    image,
                    tuple(output["size"]),
                    output,
                )
            else:
                image = flatten_image(opened)
                result = resize_image(
                    image,
                    tuple(output["size"]),
                    mode,
                    output.get("background", "#FFFFFF"),
                )
            result.save(target_path, "WEBP", quality=84, method=6)
        print(f"{source_path.relative_to(ROOT)} → {target_path.relative_to(ROOT)}")

    write_source_docs(manifest, sources)
    print(f"Generated {len(manifest['outputs'])} optimized images and docs/IMAGE_SOURCES.md.")


if __name__ == "__main__":
    main()
