export function BranchMap({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <iframe
      src={src}
      title={`Google Map for ${title}`}
      className={`map-frame ${className || ''}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen={false}
      aria-label={`Map showing ${title}`}
    />
  );
}
