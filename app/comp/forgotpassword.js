"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logopicture from "../comp/logopicture";
import Link from "next/link";
import { toast } from "react-hot-toast"; // ✅ import toast

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required.");
      return;
    }

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
        throw new Error(data.message || "Password reset failed");
      }

      toast.success("OTP sent successfully!");
      router.push(`/forgotpasswordauthentication?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Password Reset Error:", error);
      toast.error(error.message || "An error occurred while resetting the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-white flex justify-between text-black font-normal">
      <Logopicture />
      <div className="w-[55%] h-[100vh] m-auto flex flex-col items-center justify-center">
        <Link href="/login" className="w-7/10">
          <div className="flex gap-1 items-center cursor-pointer">
            <img src="/image/back.png" className="h-[20px] w-[20px]" alt="Back" />
            <button>Back</button>
          </div>
        </Link>

        <div className="h-8/10 w-7/10 flex flex-col justify-center">
          <div className="mb-[12px] text-center">
            <h1 className="text-2xl font-bold">Forgot password</h1>
          </div>
          <div className="mb-[20px] text-center w-full flex flex-col items-center justify-center">
            <h4 className="text-sm">
              That’s okay, it happens! Enter your registered email address to get an OTP to reset your password.
            </h4>
          </div>

          <div className="h-[43px] w-full flex items-center justify-center mb-[20px]">
            <input
              type="email"
              placeholder="Enter email address"
              className="w-8/10 h-full border border-black rounded-xl pl-3 outline-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full h-12 text-white text-sm bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border cursor-pointer mt-3">
            <button type="submit" onClick={handlePasswordReset} disabled={loading}>
              {loading ? "Sending..." : "Reset password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
