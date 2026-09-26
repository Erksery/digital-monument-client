import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./index.module.scss";

interface LineProps {
  text?: string;
  className?: string;
  threshold?: number;
}

export const Line = ({ text, className, threshold = 0.5 }: LineProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={containerRef}
      className={clsx(styles.container, className)}
      data-visible={isVisible}
    >
      {text && <p className={styles.text}>{text}</p>}
      <div className={styles.solid_line}></div>
    </div>
  );
};
