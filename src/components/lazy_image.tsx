import React from 'react';

interface LazyImageProps {
  images: (string | undefined)[];
  className?: string;
  style: React.CSSProperties;
}

export default function LazyImage({images, className, style}: LazyImageProps) {
  // TODO actually handle the case when we have two images (i.e. low-res then
  // high-res... we only handle image then video at the moment...)
  // Expects a list of images in the order to be loaded (we should drop out any
  // undefined entries as the first step
  const cleanImages = images.filter((x) => x !== undefined) as string[];

  // TODO should handle videos in general... not just webm
  if (cleanImages[cleanImages.length - 1].endsWith('.webm')) {
    return (
      <video
        autoPlay
        loop
        muted
        poster={cleanImages[0]}
        className={className}
        style={style}
        key={cleanImages[0]}
      >
        <source src={cleanImages[cleanImages.length - 1]} type="video/webm" />
      </video>
    );
  } else {
    return (
      <img
        alt=""
        src={cleanImages[cleanImages.length - 1]}
        className={className}
        style={style}
        key={cleanImages[cleanImages.length - 1]}
      />
    );
  }
}
