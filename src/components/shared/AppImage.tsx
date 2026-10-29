import Image from 'next/image';
import { assetUrl, isExternalImage } from '@/lib/assets';

interface AppImageProps {
  /** Path as stored in the database ("assets/images/...") or a full URL. */
  src: string | null | undefined;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

/**
 * next/image with the site's conventions: database paths are mapped to /public/images, and
 * images that cannot be optimised (SVG illustrations, externally hosted photos) are served as is.
 * width and height only reserve the aspect ratio; the CSS class decides the rendered size.
 */
export function AppImage({ src, alt = '', width, height, className, priority = false }: AppImageProps) {
  const url = assetUrl(src);
  const unoptimized = isExternalImage(url) || url.endsWith('.svg');

  return <Image src={url} alt={alt} width={width} height={height} className={className} priority={priority} unoptimized={unoptimized} />;
}
