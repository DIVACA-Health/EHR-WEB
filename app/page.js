"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  return (
    <>
      <div className="min-w-full min-h-screen bg-[linear-gradient(359.87deg,_#3B6FED_-22.88%,_#FFFFFF_63.81%)] flex items-center justify-center">
        <div className="w-4/10 min-h-[80vh] bg-white mt-5 mb-5 rounded-2xl shadow-[0px_10px_20px_0px_rgba(22,37,74,0.16)]">
          <div className="w-1/4 h-16 p-2  flex items-center justify-center mb-1 m-auto text-black">
            <img src="/image/LOGO.png" alt="LOGO" width={200} height={200} />
          </div>
          <div className="h-full w-full flex justify-center">
            <div className="flex flex-col w-4/5 text-black font-normal">
              <div className="flex flex-col gap-1 mb-2 text-center">
                <h2 className="text-3xl text-black font-extrabold">Create account</h2>
                <h4>Input your correct details to have access</h4>
              </div>
              <form method="post" className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1">
                  <label>First Name</label>
                  <input className="w-full h-10 pl-3 border border-black rounded-xl" type="text" placeholder="Enter first name" />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Last Name</label>
                  <input className="w-full h-10 pl-3 border border-black rounded-xl" type="text" placeholder="Enter Last name" />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Email Address</label>
                  <input className="w-full h-10 pl-3 border border-black rounded-xl" type="email" placeholder="Email Address" />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Phone Number</label>
                  <div className="relative w-full h-11 pl-3 border border-black rounded-xl flex items-center">
                    <div className="flex gap-1 w-1/5">
                      <img src="/image/flag.png" alt="" width={22} height={22} />
                      <h3 className="font-semibold tracking-widest">+234</h3>
                    </div>
                    <input className="h-full w-4/5 rounded-r-xl no-spinner pl-3 tracking-wider" type="number" placeholder="80 000 000 00" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label>Create Password</label>
                  <div className="relative w-full ">
                    <input className="w-full h-10 pl-3 border border-black rounded-xl" type={showPassword ? "text" : "password"} placeholder="Enter password" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label>Confirm Password</label>
                  <div className="relative w-full ">
                    <input className="w-full h-10 pl-3 border border-black rounded-xl" type={showPassword1 ? "text" : "password"} placeholder="Confirm password" required />
                    <button type="button" onClick={() => setShowPassword1(!showPassword1)} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                      {showPassword1 ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
                <div className="w-full h-12 text-white bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border-1 cursor-pointer ">
                  <button type="submit">Create Account</button>
                </div>
              </form>
              <div className="flex gap-2 mt-3 text-center justify-center items-center mb-5">
                <h2>Already have an account?</h2>
                <Link href="/">
                  <span className="text-blue-600 cursor-pointer">Log In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

