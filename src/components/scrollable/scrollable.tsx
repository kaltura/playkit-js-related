import {ComponentChildren} from 'preact';
import {useState, useRef} from 'preact/hooks';
import * as styles from './scrollable.scss';

const SCROLL_BAR_TIMEOUT = 250;

const Scrollable = ({children}: {children: ComponentChildren}) => {
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
      ref.current.scrollTop += e.deltaY;
      handleScroll();
    }
  };

  return (
    <div className={`${styles.scrollable} ${scrolling ? styles.scrolling : ''}`} ref={ref} onScroll={handleScroll} onWheel={handleWheel}>
      {children}
    </div>
  );
};

export {Scrollable};
