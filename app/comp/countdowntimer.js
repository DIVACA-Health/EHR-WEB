import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ duration = 60, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete && onComplete(); // call onComplete if provided
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    setFormattedTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
  }, [timeLeft]);

  return (
    <div className="text-center text-blue-400">
      <p>{formattedTime}</p>
    </div>
  );
};

export default CountdownTimer;
