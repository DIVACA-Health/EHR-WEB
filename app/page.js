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
      <div className="w-full h-[100vh] bg-white  flex justify-between">
        <div className="w-[43%] h-[98%] rounded-2xl m-auto flex items-center justify-center bg-container relative bg-cover bg-center " style={{ backgroundImage: "url('/image/RIGHTIMAGE.png')" }}>
          <div className="absolute inset-0 bg-[rgba(20,37,79,0.8)] rounded-2xl z-10"></div>
          <div className="relative z-20 p-4 text-white h-full w-full flex items-center justify-center">
            <div className=" min-h-[90%] w-[85%] flex flex-col justify-between " >
              <img src="/image/DHLOGO.png" alt="logo"  width={164} height={56}/>
              <div>
                <div className=" mb-8 flex flex-col text-center gap-3">
                  <h2 className="text-2xl font-bold">Your Data, Always Protected</h2>
                  <h4 className="text-sm">Keep patient records safe with built-in security and seamless access controls.</h4>
                </div>
                <div className="flex justify-center items-center">
                  <img src="/image/slide.png" alt="slider" width={88} height={10} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[55%] h-[100vh] flex justify-center items-center ">
          <div className=" w-4/5 h-full  flex justify-center items-center">
            <div className="flex flex-col w-[90%] text-black  ">
              <div className="flex flex-col gap-1 mb-2 mt-3 left">
                <h2 className="text-3xl text-black font-extrabold">Create account</h2>
                <h4 className="text-sm">Set up your account to experience a seamless health record system.</h4>
              </div>
              <form method="post" className="flex flex-col gap-4 w-full ">
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
                <div className="w-full h-12 text-white bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border-1 cursor-pointer mt-5">
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

