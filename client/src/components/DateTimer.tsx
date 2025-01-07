import { useEffect, useState } from "react";

interface DateTimerProps {
  date: string | number | Date;
}

const DateTimer = ({ date }: DateTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const getCurrentTimeLeft = () => {
    const expiresIn = new Date(date).getTime() - new Date().getTime();
    return Math.round(expiresIn / 1000);
  };

  useEffect(() => {
    let intervalId = 0;
    const findTimeLeft = () => {
      const timeLeft = getCurrentTimeLeft();
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        setTimeLeft(0);
      } else {
        setTimeLeft(timeLeft);
      }
    };
    const currentTimeLeft = getCurrentTimeLeft();
    intervalId = currentTimeLeft > 0 ? setInterval(findTimeLeft, 1000) : 0;
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (timeLeft <= 0) {
    return <div>Expired</div>;
  }

  return <div>{timeLeft}</div>;
};

export default DateTimer;
