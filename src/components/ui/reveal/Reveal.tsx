import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

interface Props {
  children: React.ReactNode;
  threshold?: number;
}

export const Reveal: React.FC<Props> = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [threshold]);

  return (
    <div ref={domRef} className={styles.reveal_box} data-visible={isVisible}>
      {children}
    </div>
  );
};
