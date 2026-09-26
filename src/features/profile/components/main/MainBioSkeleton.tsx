import { Skeleton } from "@mantine/core";
import clsx from "clsx";
import styles from "./index.module.scss";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";

export const MainBioSkeleton = () => {
  return (
    <AppWrapper>
      <div className={styles.root_container}>
        <div className={styles.avatar_container}>
          <Skeleton
            width="100%"
            height="100%"
            circle
            className={styles.skeleton_element}
          />
        </div>

        <h2 className={styles.name}>
          <Skeleton
            height="100%"
            radius="lg"
            className={styles.name_skeleton}
          />
        </h2>

        <div className={styles.timeline_container}>
          <Skeleton
            height={16}
            radius="sm"
            className={clsx(
              styles.skeleton_element,
              styles.timeline_date_skeleton,
            )}
          />

          <div className={clsx(styles.line, styles.line_right)} />

          <Skeleton
            height={22}
            radius="sm"
            className={clsx(
              styles.skeleton_element,
              styles.timeline_text_skeleton,
            )}
          />

          <div className={clsx(styles.line, styles.line_left)} />

          <Skeleton
            height={16}
            radius="sm"
            className={clsx(
              styles.skeleton_element,
              styles.timeline_date_skeleton,
            )}
          />
        </div>
      </div>
    </AppWrapper>
  );
};
