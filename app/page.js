"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logopicture from "./comp/logopicture";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  return (
    <>
      <div className="w-full h-[100vh] bg-white  flex justify-between">
        <Logopicture/>
        <div className="w-[55%] h-[100vh] flex justify-center items-center ">
          <div className=" w-4/5 h-full  flex justify-center items-center">
            <div className="flex flex-col w-[90%] text-black  ">
              <div className="flex flex-col gap-1 mb-2  left">
                <h2 className="text-3xl text-black font-extrabold">Create account</h2>
                <h4 className="text-sm">Set up your account to experience a seamless health record system.</h4>
              </div>
              <form method="post" className="flex flex-col gap-3 w-full ">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-l">First Name</label>
                  <input className="w-full h-11 pl-3 border border-black rounded-xl" type="text" placeholder="Enter first name" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-l">Last Name</label>
                  <input className="w-full h-11 pl-3 border border-black rounded-xl" type="text" placeholder="Enter Last name" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-l">Email Address</label>
                  <input className="w-full h-11 pl-3 border border-black rounded-xl" type="email" placeholder="Email Address" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-l">Phone Number</label>
                  <div className="relative w-full h-11 pl-3 border border-black rounded-xl flex items-center">
                    <div className="flex gap-1 w-1/5">
                      <img src="/image/flag.png" alt="" width={22} height={22} />
                      <h3 className="font-semibold tracking-widest">+234</h3>
                    </div>
                    <input className="h-11 w-4/5 rounded-r-xl no-spinner pl-3 tracking-wider" type="number" placeholder="80 000 000 00" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-l">Role</label>
                 <select className="w-full h-11 pl-3 pr-3 border border-black rounded-xl ">
                  <option className="text-gray-400">Select Role</option>
                  <option>Doctor</option>
                  <option>Nurse</option>
                  <option>Health Attendant</option>
                 </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-l">Create Password</label>
                  <div className="relative w-full ">
                    <input className="w-full h-11 pl-3 border border-black rounded-xl" type={showPassword ? "text" : "password"} placeholder="Enter password" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-l">Confirm Password</label>
                  <div className="relative w-full ">
                    <input className="w-full h-11 pl-3 border border-black rounded-xl" type={showPassword1 ? "text" : "password"} placeholder="Confirm password" required />
                    <button type="button" onClick={() => setShowPassword1(!showPassword1)} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                      {showPassword1 ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
                <Link href="/authentication">
                  <div className="w-full h-12 text-white bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border-1 cursor-pointer mt-3">
                    <button type="submit">Create Account</button>
                  </div>
                </Link>
              </form>
              <div className="flex gap-1.5 mt-3 text-center justify-center items-center ">
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

