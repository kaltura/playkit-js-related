import { useEffect, useState } from "preact/hooks";

const useCountDown = (start: number) => {
  const [counter, setCounter] = useState(start);
  useEffect(() => {
    if (counter === 0) {
      return;
    }
    setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);
  }, [counter]);
  return counter;
};

const CountdownText = ({ seconds }: { seconds: number }) => {
  const timeLeft = useCountDown(seconds);
  return <span>{timeLeft}</span>;
};

export { CountdownText };
