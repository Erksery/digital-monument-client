import React from "react";
import styles from "./index.module.scss";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | any;
  alt: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill";
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio,
  objectFit = "cover",
  className = "",
  ...props
}) => {
  const imageSrc = typeof src === "object" ? src.src : src;

  return (
    <div className={`${styles.wrapper} ${className}`} style={{ aspectRatio }}>
      {/* Плейсхолдер теперь просто фоновый элемент, который перекрывается картинкой */}
      <div className={styles.placeholder} aria-hidden="true" />

      <img
        src={imageSrc}
        alt={alt}
        className={styles.image}
        style={{ objectFit }}
        loading="lazy"
        decoding="async" // Позволяет браузеру не блокировать поток при декодировании
        onLoad={(e) => (e.currentTarget.style.opacity = "1")} // Минимальный JS inline
        {...props}
      />
    </div>
  );
};
