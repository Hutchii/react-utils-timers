import { useEffect, useMemo, useRef, useState } from "react";

const useTimer = (delay: number = 10) => {
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<any>(null);

  const start = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentTime((p) => p! + 1);
    }, delay);
  };

  const pause = () => clearInterval(intervalRef.current);

  const stop = () => {
    setCurrentTime(0);
    clearInterval(intervalRef.current);
  };

  let time =
    new Date(currentTime * 60 * delay).toISOString().substring(14, 22) || 0;

  return { time, start, pause, stop };
};

const useCountdownTimer = ({
  time,
  onTimeEnd,
}: {
  time: number;
  onTimeEnd?: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        onTimeEnd && onTimeEnd();
        return;
      }
      setTimeLeft((p) => p - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [onTimeEnd, timeLeft]);

  let timeFormatted = `${String(Math.trunc(timeLeft / 60)).padStart(
    2,
    "0"
  )}:${String(timeLeft % 60).padStart(2, "0")}`;

  return { time: timeFormatted };
};

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const CountdownTimer = ({ deadline = new Date().toString() }) => {
  const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline]);
  const [time, setTime] = useState(parsedDeadline - Date.now());

  useEffect(() => {
    const interval = setInterval(
      () => setTime(parsedDeadline - Date.now()),
      1000
    );

    return () => clearInterval(interval);
  }, [parsedDeadline]);

  return (
    <div>
      {Object.entries({
        Days: time / DAY,
        Hours: (time / HOUR) % 24,
        Minutes: (time / MINUTE) % 60,
        Seconds: (time / SECOND) % 60,
      }).map(([label, value]) => (
        <div key={label}>
          <p>{`${Math.floor(value)}`.padStart(2, "0")}</p>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};
