import React from 'react';

interface ResponsiveMediaProps {
  altText: string;
  images: string[];
  className?: string;
  style: React.CSSProperties;
}

export default function ResponsiveMedia({
  altText,
  images,
  className,
  style,
}: ResponsiveMediaProps) {
  if (images.some((i) => /\.(webm|mp4)$/.test(i))) {
    let poster = images.find((i) => /\.webp$/.test(i));
    if (typeof poster === 'undefined')
      poster = images.find((i) => /\.jpe?g$/.test(i));
    return (
      <video
        autoPlay
        loop
        muted
        poster={poster}
        className={className}
        style={style}
      >
        {images
          .filter((i) => /\.(webm|mp4)$/.test(i))
          .map((i, ind) => (
            <source
              key={ind}
              src={i}
              type={`video/${i.substr(i.lastIndexOf('.') + 1)}`}
            />
          ))}
        {altText}
      </video>
    );
  } else {
    const imgs = images.slice(
      images.findIndex((i) => /\.(jpe?g|png|webp|svg)$/.test(i))
    );
    return (
      <picture className={className} style={style}>
        {imgs.slice(0, -1).map((i, ind) => (
          <source
            key={ind}
            srcSet={i}
            type={`image/${i.substr(i.lastIndexOf('.') + 1)}`}
          />
        ))}
        <img alt={altText} src={imgs[imgs.length - 1]} />
      </picture>
    );
  }
}
