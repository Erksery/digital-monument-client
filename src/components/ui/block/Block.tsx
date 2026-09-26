import type { CSSProperties, ReactNode } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

interface BlockProps {
  title: string;
  style?: CSSProperties;
  children?: ReactNode;
  className?: string;
}

export const Block = ({ title, style, className, children }: BlockProps) => {
  return (
    <div className={clsx(styles.block_container, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.line_left} />
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.line_right} />
      </div>

      {children}
    </div>
  );
};
