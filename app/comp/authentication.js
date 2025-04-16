"use client";

import { useState } from "react";
import Logopicture from "../comp/logopicture";
import SelectableNumbers from "./selectednumbers";
import Modal from "./modal";
import Link from "next/link";
import CountdownTimer from "./countdowntimer";
import { useSearchParams } from "next/navigation";

const Authentication = () => {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email");

  const [email, setEmail] = useState(emailFromQuery || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");

  const resendVerificationCode = async () => {
    try {
      const res = await fetch("api/v1/auth/request-email-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Verification request failed");

      alert("Verification code sent!");
      setTimerDone(false);
      setTimerKey((prev) => prev + 1);
    } catch (error) {
      console.error("Verification Error:", error);
      alert(error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/v1/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Email verification failed");

      alert("Email successfully verified!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Verification Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-white flex justify-between text-black font-normal">
      <Logopicture />
      <div className="w-[55%] h-[100vh] m-auto flex flex-col items-center justify-center">
        <div className="w-[70%] h-[70%] flex flex-col">
          <Link href="/">
            <div className="mb-25 flex gap-1 items-center cursor-pointer">
              <img src="/image/back.png" className="h-[20] w-[20px]" />
              <button>Back</button>
            </div>
          </Link>

          <div className="flex flex-col justify-between gap-3 h-[40%] items-center mb-20">
            <h1 className="text-3xl font-semibold">Verify email address</h1>
            <h4 className="text-center">
              Kindly input the 4-digit code sent to your{" "}
              <span className="text-blue-400">{email}</span>
            </h4>

            <SelectableNumbers setVerificationCode={setVerificationCode} />

            <div className="flex gap-1 items-center text-sm">
              <h4>Didn't get the code?</h4>
              {timerDone ? (
                <button
                  onClick={resendVerificationCode}
                  className="text-blue-500 underline ml-1"
                >
                  Resend
                </button>
              ) : (
                <>
                  <h4>Resend in:</h4>
                  <CountdownTimer
                    key={timerKey}
                    duration={30}
                    onComplete={() => setTimerDone(true)}
                  />
                </>
              )}
            </div>
          </div>

          <div className="w-full h-[45px]">
            <button
              type="submit"
              onClick={handleSubmit}
              className="h-full w-full bg-blue-600 text-white font-normal text-center border-2 border-white rounded-2xl cursor-pointer"
            >
              Verify email address
            </button>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Authentication;
