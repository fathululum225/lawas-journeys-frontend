interface SkeletonsProps {
  count: number;
  /** Modifier from components.css: skeleton--card (default), skeleton--tile, skeleton--row. */
  variant?: 'card' | 'tile' | 'row';
}

/** Placeholder blocks shown while a section is loading. */
export function Skeletons({ count, variant = 'card' }: SkeletonsProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`skeleton skeleton--${variant}`} aria-hidden="true" />
      ))}
    </>
  );
}
