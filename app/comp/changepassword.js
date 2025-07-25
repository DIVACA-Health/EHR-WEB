"use client";

import { useState } from "react";
import Logopicture from "../comp/logopicture";
import Modal1 from "./modal1";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const ChangePassword = () => {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [newPassword, setnewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("resetToken");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      toast.error("Please fill in both fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!resetToken) {
      toast.error("Missing reset token. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/reset-password/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, newPassword, confirmNewPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password reset failed.");
      }

      toast.success("Password reset successfully!");
      setIsModal1Open(true);
    } catch (error) {
      toast.error(error.message || "An error occurred.");
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

        <div className="h-8/10 w-7/10 flex flex-col justify-center">
          <div className="mb-[10px] text-center">
            <h1 className="text-2xl font-bold">Forgot password</h1>
          </div>
          <div className="mb-[50px] text-center w-full flex flex-col items-center justify-center">
            <h4 className="text-sm">Set a strong password to protect your account</h4>
          </div>

          <div className="mb-[35px] flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm">Create new Password</label>
              <div className="relative w-full">
                <input
                  className="w-full h-11 pl-3 border border-gray-200 rounded-[7px] shadow-sm shadow-gray-300 outline-none"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  value={newPassword}
                  onChange={(e) => setnewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm">Confirm new Password</label>
              <div className="relative w-full">
                <input
                  className="w-full h-11 pl-3 border border-gray-200 rounded-[7px] shadow-sm shadow-gray-300 outline-none"
                  type={showPassword1 ? "text" : "password"}
                  placeholder="Confirm password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setconfirmNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword1 ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full h-12 text-white text-sm bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border-1 cursor-pointer mt-3">
            <button
              type="submit"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </div>

          <Modal1 isOpen={isModal1Open} onClose={() => setIsModal1Open(false)} />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
