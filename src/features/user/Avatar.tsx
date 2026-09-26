import styles from "./index.module.scss";

type AvatarSize = "s" | "m" | "l" | "xl";

interface AvatarProps {
  name?: string;
  size?: AvatarSize;
}

export const Avatar = ({ name, size = "m" }: AvatarProps) => {
  const avatarLetter = name?.trim().charAt(0).toUpperCase();

  return (
    <div className={styles.avatar} data-size={size}>
      {avatarLetter}
    </div>
  );
};
