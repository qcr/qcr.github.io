export default function LazyImage({images, className, style}) {
  // TODO actually handle the case when we have two images (i.e. low-res then
  // high-res... we only handle image then video at the moment...)
  // Expects a list of images in the order to be loaded (we should drop out any
  // undefined entries as the first step
  const cleanImages = images.filter(Boolean);

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
        src={cleanImages[cleanImages.length - 1]}
        className={className}
        style={style}
        key={cleanImages[cleanImages.length - 1]}
      />
    );
  }
}
