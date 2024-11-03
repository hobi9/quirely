type Props = {
  src: string;
  defaultSrc: string;
  alt?: string;
  className?: string;
};

const ImageWithDefault = ({ src, defaultSrc, alt, className }: Props) => {
  return <img src={src || defaultSrc} alt={alt} className={className} />;
};

export default ImageWithDefault;
