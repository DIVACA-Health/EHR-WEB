"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Logopicture from "../comp/logopicture";
import SelectableNumbers from "./selectednumbers";
import Link from "next/link";
import CountdownTimer from "./countdowntimer";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // ✅ Import toast

const ForgotPasswordAuthentication = () => {
  const [otp, setOtp] = useState("");
  const [timerDone, setTimerDone] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleOtpSubmit = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/verify-reset-otp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      toast.success("OTP successfully verified!");
      router.push(`/changepassword?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error.message || "An error occurred while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    setTimerDone(false);
    setTimerKey((prev) => prev + 1);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/forgot-password/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast.success("OTP has been resent to your email.");
    } catch (error) {
      toast.error(error.message || "An error occurred while resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-white flex justify-between text-black font-normal">
      <Logopicture />
      <div className="w-[55%] h-[100vh] m-auto flex flex-col items-center justify-center">
        <Link href="/login" className="w-7/10">
          <div className="flex gap-3 items-center cursor-pointer">
            <img src="/image/back.png" className="h-[12px] w-[18px]" alt="Back" />
            <button>Back</button>
          </div>
        </Link>
        
        <div className="h-8/10 w-[75%] flex flex-col justify-center">
          <div className="mb-[12px] text-center">
            <h1 className="text-2xl font-bold">Enter OTP</h1>
          </div>
          <div className="mb-[25px] text-center w-full flex flex-col items-center justify-center">
            <h4 className="text-sm">
              To reset your password, enter the OTP sent to <b>{email}</b>
            </h4>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-4 mb-3">
            <SelectableNumbers setVerificationCode={setOtp} otp={otp} />

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

          <div className="w-full h-12 text-white text-sm bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border cursor-pointer mt-3">
            <button type="submit" onClick={handleOtpSubmit} disabled={loading}>
              {loading ? "Verifying..." : "Confirm OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordAuthentication;
