import { h } from "preact";
import * as styles from "./related-grid-item.scss";

const DEFAULT_IMAGE_WIDTH = 174;
const DEFAULT_IMAGE_HEIGHT = 98;
const DEFAULT_DESCRIPTION_HEIGHT = 98;

interface RelatedGridItemProps {
  width?: number;
  imageHeight?: number;
  descriptionHeight?: number;
  thumbnailUrl?: string;
  duration?: number;
  description?: string;
}

const RelatedGridItem = ({
  width = DEFAULT_IMAGE_WIDTH,
  imageHeight = DEFAULT_IMAGE_HEIGHT,
  descriptionHeight = DEFAULT_DESCRIPTION_HEIGHT,
  thumbnailUrl
}: RelatedGridItemProps) => {
  const fullThumbnailUrl = `${thumbnailUrl}/width/${width}/height/${imageHeight}`;
  return (
    <div
      className={styles.relatedGridItem}
      style={{ width, height: imageHeight + descriptionHeight }}
    >
      <img src={fullThumbnailUrl} style={{ width, height: imageHeight }} />
    </div>
  );
};

RelatedGridItem.displayName = "RelatedGrid";

export default RelatedGridItem;
