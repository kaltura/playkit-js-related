import {ComponentChildren} from 'preact';
import {useState, useRef, useMemo} from 'preact/hooks';
import * as styles from './scrollable.scss';

const SCROLL_BAR_TIMEOUT = 250;

/**
 * displays a scrollbar according to dimensions and child components
 *
 * @param {object} props component props
 * @param {ComponentChildren} props.children child components
 * @param {boolean} props.isVertical whether the scroll is vertical or horizontal
 * @returns {*} scrollable component
 */
const Scrollable = ({children, isVertical}: {children: ComponentChildren; isVertical: boolean}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false);
  const [scrollTimeoutId, setScrollTimeoutId] = useState(-1);

  const handleScroll = () => {
    clearTimeout(scrollTimeoutId);
    setScrolling(true);
    setScrollTimeoutId(
      window.setTimeout(() => {
        setScrolling(false);
      }, SCROLL_BAR_TIMEOUT)
    );
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (ref?.current) {
      ref.current.scrollLeft += e.deltaY;
      handleScroll();
    }
  };

  const scrollableParams = useMemo(() => (isVertical ? {onScroll: handleScroll} : {onWheel: handleWheel, ref}), [isVertical]);

  return (
    <div
      className={`${styles.scrollable} ${scrolling ? styles.scrolling : ''} ${isVertical ? styles.vertical : styles.horizontal}`}
      {...scrollableParams}>
      {children}
    </div>
  );
};

export {Scrollable};
