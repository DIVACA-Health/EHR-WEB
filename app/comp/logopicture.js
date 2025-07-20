'use client';

import React, { useState, useEffect } from "react";

const slides = [
  {
    headline: "Seamless Digital Health Records",
    subtext: "Easily manage patient data with a secure, paperless system.",
    image: "/image/slide.png",
  },
  {
    headline: "Fast & Efficient Workflows",
    subtext: "Automate patient queues and streamline medical processes.",
    image: "/image/slide2.png",
  },
  {
    headline: "For Doctors & Healthcare Professionals",
    subtext: "Enhance patient care with structured medical records and quick access to history.",
    image: "/image/slide3.png",
  },
];

const Logopicture = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 400); // fade out before changing
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, current]);

  return (
    <div className="w-[43%] h-[98%] rounded-2xl m-auto flex items-center justify-center bg-container relative bg-cover bg-center" style={{ backgroundImage: "url('/image/RIGHTIMAGE.png')" }}>
      <div className="absolute inset-0 bg-[rgba(20,37,79,0.8)] rounded-2xl z-10"></div>
      <div className="relative z-20 p-4 text-white h-full w-full flex items-center justify-center">
        <div className="min-h-[90%] w-[100%] flex flex-col justify-between">
          <img src="/image/DHLOGO.png" alt="logo" width={164} height={56} className="ml-5 mt-[-30px]" />
          <div className="w-full ">
            <div className={`mb-8 flex flex-col text-center gap-3 transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
              <h2 className="text-[27px] font-medium">{slides[current].headline}</h2>
              <h4 className="text-sm">{slides[current].subtext}</h4>
            </div>
            <div className={`flex justify-center items-center transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
              <img src={slides[current].image} alt="slider" width={88} height={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logopicture;