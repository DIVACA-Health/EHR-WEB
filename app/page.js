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
        <div className="w-[55%] h-full  flex justify-center items-center ">
            <div className=" w-[65%] h-[95%]  flex flex-col items-center justify-center">
                <div className=" h-auto w-full text-black mb-3">
                  <h3 className="text-2xl">Create Account</h3>
                  <h4 className="text-[12px] text-rgba[(98, 98, 98, 1)]">Set up your account to experience a seamless health record system.</h4>
                </div>
                <div className=" w-full h-auto text-black">
                  <form method="post" className="flex flex-col gap-2 w-full ">
                    <div className="flex flex-col gap-0.5 ">
                      <label className=" text-sm">First Name</label>
                      <input className="w-full h-8 pl-3  border-black border-[1px] rounded-[7px] shadow-sm shadow-gray-600 outline-none" type="text" placeholder="Enter first name" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className=" text-sm">Last Name</label>
                      <input className="w-full h-8 pl-3 border-black border-[1px] rounded-[7px] shadow-sm shadow-gray-600 outline-none" type="text" placeholder="Enter Last name" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className="text-sm">Email Address</label>
                      <input className="w-full h-8 pl-3  border-black border-[1px] rounded-[7px] shadow-sm shadow-gray-600 outline-none" type="email" placeholder="Email Address" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className=" text-sm">Phone Number</label>
                      <div className="relative w-full h-8 pl-3 border-[1px]  border-black rounded-[7px] outline-none items-center flex shadow-sm shadow-gray-600">
                        <div className="flex gap-0.5 w-1/5">
                          <img src="/image/flag.png" alt="" width={22} height={22} />
                          <h3 className="font-semibold tracking-widest">+234</h3>
                        </div>
                        <input className="h-8 w-4/5 rounded-r-xl no-spinner pl-3 tracking-wider outline-none" type="number" placeholder="80 000 000 00" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className=" text-sm ">Role</label>
                    <select className="w-full h-8 pl-3 pr-3  border-black border-[1px] rounded-[7px]  shadow-sm shadow-gray-600 outline-none cursor-pointer">
                      <option className="text-gray-400">Select Role</option>
                      <option>Doctor</option>
                      <option>Nurse</option>
                      <option>Health Attendant</option>
                    </select>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className=" text-sm">Create Password</label>
                      <div className="relative w-full ">
                        <input className="w-full h-8 pl-3  border-black border-[1px] rounded-[7px] shadow-sm shadow-gray-600 outline-none" type={showPassword ? "text" : "password"} placeholder="Enter password" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-500 hover:text-gray-700">
                          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className=" text-sm">Confirm Password</label>
                      <div className="relative w-full flex items-center  ">
                        <input className="w-full h-8 pl-3  border-black border-[1px] rounded-[7px] shadow-sm shadow-gray-600 outline-none" type={showPassword1 ? "text" : "password"} placeholder="Confirm password" required />
                        <button type="button" onClick={() => setShowPassword1(!showPassword1)} className="absolute right-3 top-2 text-gray-500 hover:text-gray-700">
                          {showPassword1 ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </div>
                    <Link href="/authentication">
                      <div className="w-full h-10 text-white text-sm bg-blue-600 flex items-center border-[1px] border-blue-950 justify-center rounded-[7px] shadow-b-sm shadow-gray-600  cursor-pointer mt-2">
                        <button type="submit">Create Account</button>
                      </div>
                    </Link>
                  </form>
                  <div className="flex text-sm gap-0.5 mt-1 text-center justify-center items-center  ">
                    <h2>Already have an account?</h2>
                    <Link href="/login">
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

