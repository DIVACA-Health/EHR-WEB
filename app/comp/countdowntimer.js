import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute = 60 seconds
  const [formattedTime, setFormattedTime] = useState('1:00');

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop timer when it reaches 0

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Clear the timer on component unmount
  }, [timeLeft]);

  useEffect(() => {
    // Update formatted time when `timeLeft` changes
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    setFormattedTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
  }, [timeLeft]);

  return (
    <div className="text-center text-blue-300">
      <p>{formattedTime}</p>
    </div>
  );
};

export default CountdownTimer;
