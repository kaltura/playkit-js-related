import {useState, useRef, useLayoutEffect, useMemo} from 'preact/hooks';

import * as styles from './multiline-text.scss';

interface MultilineTextProps {
  text: string;
  lineHeight: number;
  lines: number;
}

/**
 * Displays text truncated to a set number of lines, with an ellipsis in case of overflow.
 *
 * @param {object} props Component props.
 * @param {string} props.text Text to be displayed.
 * @param {number} props.lineHeight Line height for a single line of text.
 * @param {number} props.lines Max number of visible lines.
 */

const MultilineText = ({text, lineHeight, lines}: MultilineTextProps) => {
  const [minLength, setMinLength] = useState(0);
  const [maxLength, setMaxLength] = useState(text.length);
  const [finalizedText, setFinalizedText] = useState(text);
  const [isTextFinalized, setIsTextFinalized] = useState(false);

  const ref = useRef<any>(null);
  const cutoffHeight = lineHeight * lines;

  const currentLength = useMemo(() => {
    return Math.floor((minLength + maxLength) / 2);
  }, [minLength, maxLength]);

  useLayoutEffect(() => {
    if (isTextFinalized) return;

    const clientHeight = ref.current.clientHeight;

    // test again with a shorter text
    if (clientHeight > cutoffHeight) {
      setMaxLength(currentLength - 1);
    } else if (minLength === text.length) {
      // no need to truncate
      setIsTextFinalized(true);
    } else if (minLength >= maxLength) {
      // this is the longest text that can fit within the line limit
      setFinalizedText(`${text.slice(0, maxLength)}`);
      setIsTextFinalized(true);
    } else {
      // test again with a longer text
      setMinLength(currentLength + 1);
    }
  }, [isTextFinalized, cutoffHeight, minLength, text, maxLength, currentLength]);

  return (
    <div style={{'-webkit-line-clamp': lines}} className={styles.multilineText}>
      <div ref={ref}>{isTextFinalized ? finalizedText : text.slice(0, currentLength)}</div>
    </div>
  );
};

export {MultilineText};
