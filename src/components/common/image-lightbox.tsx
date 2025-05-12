import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { ScanSearchIcon } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import { Fullscreen, Thumbnails } from 'yet-another-react-lightbox/plugins';

import { cn } from '~/libs';

import { Tooltip } from './tooltip';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';

type ImageLightboxProps = {
  src: string;
  alt?: string;
  className?: string;
  classNameInner?: string;
  placeholder?: string;
  handleClick?: () => void;
  isFull?: boolean;
};

export const ImageLightbox = memo(({ src, alt, placeholder, className, classNameInner, handleClick, isFull }: ImageLightboxProps) => {
  const [index, setIndex] = useState<number>(-1);

  const images = useMemo(() => [{ src, alt }], [src, alt]);

  const handleOnClick = useCallback(() => {
    setIndex(0);
    handleClick?.();
  }, [handleClick]);

  useEffect(() => {
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 200);
  }, []);

  return (
    <>
      <Tooltip content={placeholder ?? 'Quick view'}>
        <div className={cn('group relative flex flex-shrink-0 cursor-pointer', { 'h-full w-full': isFull })} onClick={handleOnClick}>
          <img alt={alt} className={cn(className)} src={src} />
          <div className={cn('invisible absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-sm transition-all group-hover:visible group-hover:opacity-100', classNameInner)}>
            <ScanSearchIcon className="size-7" />
          </div>
        </div>
      </Tooltip>

      <Lightbox
        carousel={{ finite: images.length <= 1 }}
        close={() => setIndex(-1)}
        index={index}
        open={index >= 0}
        plugins={[Fullscreen, Thumbnails]}
        slides={images}
        styles={{ container: { backgroundColor: '#fff' } }}
        captions={{
          showToggle: true,
          descriptionTextAlign: 'end'
        }}
        render={{
          buttonPrev: images.length <= 1 ? (): null | undefined => null : undefined,
          buttonNext: images.length <= 1 ? (): null | undefined => null : undefined
        }}
      />
    </>
  );
});
