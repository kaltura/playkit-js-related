import {useEffect, useState} from 'preact/hooks';

const useCountDown = (start: number, onDone: () => void) => {
  const [counter, setCounter] = useState(start);
  useEffect(() => {
    if (counter === 0) {
      if (onDone) {
        onDone();
      }
      return;
    }
    setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);
  }, [counter, onDone]);
  return counter;
};

const Countdown = ({seconds, onDone}: {seconds: number; onDone: () => void}) => {
  const timeLeft = useCountDown(seconds, onDone);
  return <span>{timeLeft}</span>;
};

export {Countdown};
