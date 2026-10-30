# Source photographs

This folder keeps the original downloaded photographs used to generate the optimized WebP files in `public/images`.

Metadata, source URLs and rights notes live in `image-sources.json`; a readable report is generated at `docs/IMAGE_SOURCES.md`.

Hero outputs with mode `phone-cutout` use a rounded-rectangle mask to isolate one device from a two-phone official product image and save it on a transparent RGBA canvas. The `isolate_rect` coordinates are source-image pixels; update them if you replace the source photo.

Run `npm run images:prepare` after changing any source file. These are third-party demo assets, not actual F-Ex Store photos.
