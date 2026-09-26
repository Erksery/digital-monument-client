import type { ReactNode } from "react";
import styles from "./index.module.scss";

interface AppearProps {
  children?: ReactNode;
}

export const Appear = ({ children }: AppearProps) => {
  return <div className={styles.appear_container}>{children}</div>;
};
