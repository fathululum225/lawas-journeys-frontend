'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { Icon } from './Icon';

interface CarouselProps {
  children: ReactNode;
  /** Modifier from components.css: carousel--3, carousel--4 (columns per view on desktop). */
  columns?: 3 | 4;
}

const EDGE_TOLERANCE = 8;

/**
 * CSS scroll-snap track with one arrow button. The button is hidden when everything already
 * fits, and flips to "previous" once the end of the track is reached.
 */
export function Carousel({ children, columns }: CarouselProps) {
  const { t } = useI18n();
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const refresh = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setHasOverflow(track.scrollWidth - track.clientWidth > EDGE_TOLERANCE);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - EDGE_TOLERANCE);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    refresh();
    window.addEventListener('resize', refresh);
    const observer = new ResizeObserver(refresh);
    observer.observe(track);

    return () => {
      window.removeEventListener('resize', refresh);
      observer.disconnect();
    };
  }, [refresh]);

  const handleClick = () => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({ left: atEnd ? -track.scrollWidth : track.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className={cn('carousel', columns && `carousel--${columns}`)}>
      <div className="carousel__track" id={trackId} ref={trackRef} onScroll={refresh}>{children}</div>
      <button
        className={cn('carousel__button', atEnd && 'is-reversed')}
        type="button"
        hidden={!hasOverflow}
        aria-controls={trackId}
        aria-label={atEnd ? t('common.previous') : t('common.next')}
        onClick={handleClick}
      >
        <Icon name="chevron-right" size={20} />
      </button>
    </div>
  );
}
