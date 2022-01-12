import {useState, useRef, useLayoutEffect} from 'preact/hooks';

interface MultilineTextProps {
  text: string;
  lineHeight: number;
  lines: number;
}

/**
 * Text container with multiline ellipsis.
 * Workaround for line-clamp property which isn't supported by IE11.
 */
const MultilineText = ({text, lineHeight, lines}: MultilineTextProps) => {
  const [minLength, setMinLength] = useState(0);
  const [maxLength, setMaxLength] = useState(text.length);
  const [finalizedText, setFinalizedText] = useState(text);
  const [isTextFinalized, setIsTextFinalized] = useState(false);

  const ref = useRef(null);
  const cutoffHeight = lineHeight * lines;

  const getCurrentLength = () => Math.floor((minLength + maxLength) / 2);

  useLayoutEffect(() => {
    if (isTextFinalized) return;

    // @ts-ignore
    const clientHeight = ref.current.clientHeight;

    // test again with a shorter text
    if (clientHeight > cutoffHeight) {
      setMaxLength(getCurrentLength() - 1);
    } else {
      // no need to truncate
      if (minLength === text.length) {
        setIsTextFinalized(true);
      }
      // this is the longest text that can fit within the line limit
      else if (minLength >= maxLength) {
        setFinalizedText(`${text.slice(0, maxLength - 4)}...`);
        setIsTextFinalized(true);
      }
      // test again with a longer text
      else {
        setMinLength(getCurrentLength() + 1);
      }
    }
  });

  return (
    <div>
      <div ref={ref}>{isTextFinalized ? finalizedText : text.slice(0, getCurrentLength())}</div>
    </div>
  );
};

export {MultilineText};
