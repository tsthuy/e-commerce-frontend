import { memo, useMemo, useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import { Fullscreen, Thumbnails } from 'yet-another-react-lightbox/plugins';

import { Button } from '~/components/common';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';

interface ImageWithSource {
  url: string;
  isDefault: boolean;
  source: 'product' | 'variant';
  variantId?: string;
  alt: string;
}

interface ProductImageGalleryProps {
  allImages: ImageWithSource[];
  currentMainImage?: string;
  productName: string;
  onImageSelect: (imageUrl: string) => void;
}

export const ProductImageGallery = memo<ProductImageGalleryProps>(({ allImages, currentMainImage, onImageSelect }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Find the index of current main image for lightbox
  const currentImageIndex = allImages.findIndex((img) => img.url === currentMainImage);
  const displayIndex = currentImageIndex >= 0 ? currentImageIndex : 0;

  // Prepare slides for lightbox (all images)
  const lightboxSlides = useMemo(() => {
    return allImages.map((image) => ({
      src: image.url,
      alt: image.alt,
      description: `${image.source === 'variant' ? 'Variant Image' : 'Product Image'} - ${image.alt}`
    }));
  }, [allImages]);

  const handleThumbnailClick = (imageUrl: string): void => {
    onImageSelect(imageUrl);
  };

  const handleMainImageClick = (): void => {
    setLightboxOpen(true);
  };

  const handlePrevious = (): void => {
    const currentIndex = allImages.findIndex((img) => img.url === currentMainImage);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
    onImageSelect(allImages[newIndex].url);
  };

  const handleNext = (): void => {
    const currentIndex = allImages.findIndex((img) => img.url === currentMainImage);
    const newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
    onImageSelect(allImages[newIndex].url);
  };

  if (!allImages.length) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-100">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const currentImage = allImages.find((img) => img.url === currentMainImage) || allImages[0];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <button className="h-full w-full cursor-zoom-in focus:outline-none" type="button" onClick={handleMainImageClick}>
          <img alt={currentImage.alt} className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105" src={currentImage.url} />
        </button>

        {/* Navigation arrows for main image */}
        {allImages.length > 1 && (
          <>
            <Button className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 p-0 hover:bg-white" size="sm" variant="secondary" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 p-0 hover:bg-white" size="sm" variant="secondary" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image source indicator */}
        <div className="absolute bottom-2 left-2">
          <span className={`rounded px-2 py-1 text-xs font-medium text-white ${currentImage.source === 'variant' ? 'bg-blue-500' : 'bg-gray-500'}`}>
            {currentImage.source === 'variant' ? 'Variant' : 'Product'}
          </span>
        </div>
      </div>

      {/* Thumbnail Grid */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {allImages.map((image, index) => (
            <button
              key={`${image.source}-${image.variantId || 'product'}-${index}`}
              type="button"
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all hover:border-primary ${
                image.url === currentMainImage ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
              }`}
              onClick={() => handleThumbnailClick(image.url)}
            >
              <img alt={image.alt} className="h-full w-full object-cover" src={image.url} />

              {/* Indicator for variant images */}
              {image.source === 'variant' && <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-blue-500"></div>}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        carousel={{ finite: allImages.length <= 1 }}
        close={() => setLightboxOpen(false)}
        index={displayIndex}
        open={lightboxOpen}
        plugins={[Fullscreen, Thumbnails]}
        slides={lightboxSlides}
        styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' } }}
        on={{
          view: ({ index: lightboxIndex }) => {
            // When user navigates in lightbox, update main image
            if (allImages[lightboxIndex]) {
              onImageSelect(allImages[lightboxIndex].url);
            }
          }
        }}
        thumbnails={{
          position: 'bottom',
          width: 120,
          height: 80,
          border: 2,
          borderRadius: 4,
          padding: 4,
          gap: 16,
          showToggle: true
        }}
      />
    </div>
  );
});
