import { h } from "preact";
import { useState, useRef, useLayoutEffect } from "preact/hooks";

interface MultilineTextProps {
  text: string;
  lineHeight: number;
  lines: number;
}

/**
 * Text container with multiline ellipsis.
 * Workaround for line-clamp property which isn't supported by IE11.
 */
const MultilineText = ({ text, lineHeight, lines }: MultilineTextProps) => {
  const [lengthMin, setLengthMin] = useState(0);
  const [lengthMax, setLengthMax] = useState(text.length);
  const [finalizedText, setFinalizedText] = useState(text);
  const [isTextFinalized, setIsTextFinalized] = useState(false);

  const ref = useRef(null);
  const cutoffHeight = lineHeight * lines;

  const getCurrentLength = () => Math.floor((lengthMin + lengthMax) / 2);

  useLayoutEffect(() => {
    if (isTextFinalized) return;

    // @ts-ignore
    const clientHeight = ref.current.clientHeight;

    // test again with a shorter text
    if (clientHeight > cutoffHeight) {
      setLengthMax(getCurrentLength() - 1);
    } else {
      // no need to truncate
      if (lengthMin === text.length) {
        setIsTextFinalized(true);
      }
      // this is the longest text that can fit within the line limit
      else if (lengthMin >= lengthMax) {
        setFinalizedText(`${text.slice(0, lengthMin - 5)}...`);
        setIsTextFinalized(true);
      }
      // test again with a longer text
      else {
        setLengthMin(getCurrentLength() + 1);
      }
    }
  });

  return (
    <div>
      <div ref={ref}>
        {isTextFinalized ? finalizedText : text.slice(0, getCurrentLength())}
      </div>
    </div>
  );
};

export default MultilineText;
