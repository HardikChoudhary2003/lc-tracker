import React, { useState, useEffect } from 'react';

const calculateTimeLeft = (targetDate) => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    // Contest has started or passed
    timeLeft = null;
  }

  return timeLeft;
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    // Exit early if the target date is invalid or already passed initially
    if (!targetDate || !calculateTimeLeft(targetDate)) {
      setTimeLeft(null);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Clear timeout if the component is unmounted or targetDate changes
    return () => clearTimeout(timer);
  }); // Re-run effect every second implicitly due to state update triggering re-render

  if (!timeLeft) {
    return <span className="text-sm text-green-600 dark:text-green-400">Started!</span>;
  }

  // Format the output string
  const timerComponents = [];
  if (timeLeft.days > 0) timerComponents.push(`${timeLeft.days}d`);
  if (timeLeft.hours > 0 || timeLeft.days > 0) timerComponents.push(`${String(timeLeft.hours).padStart(2, '0')}h`);
  timerComponents.push(`${String(timeLeft.minutes).padStart(2, '0')}m`);
  timerComponents.push(`${String(timeLeft.seconds).padStart(2, '0')}s`);

  return (
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Starts in {timerComponents.join(' ')}
    </span>
  );
};

export default CountdownTimer;
