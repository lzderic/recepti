import React from "react";

type NextImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
};

const Image = ({ src, alt, width, height, className, fill, ...rest }: NextImageProps) => {
  const resolvedWidth = fill ? undefined : width;
  const resolvedHeight = fill ? undefined : height;

  // Note: <img> is used here as a mock for Storybook, not for production. In production, use <Image /> from next/image for optimization.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={resolvedWidth}
      height={resolvedHeight}
      className={className}
      {...(rest as unknown as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
};

export default Image;
