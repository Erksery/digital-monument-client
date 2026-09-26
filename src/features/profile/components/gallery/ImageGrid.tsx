import { Appear } from "@/components/ui/appear/Appear";
import styles from "./index.module.scss";

interface ImageGridProps {
  images: string[];
}

export const ImageGrid = ({ images }: ImageGridProps) => {
  return (
    <div className={styles.masonry}>
      {images.map((item, index) => (
        <Appear>
          <div key={item} className={styles.masonry_item}>
            <img src={item} alt="" />
          </div>
        </Appear>
      ))}
    </div>
  );
};
