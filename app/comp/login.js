"use client" ;
import Logopicture from "../comp/logopicture";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";


const login = () => {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full h-[100vh] bg-white  flex justify-between text-black font-normal">
        <Logopicture/>
        <div className="w-[55%] h-[100vh] m-auto flex flex-col items-center justify-center">
            <div className="h-8/10 w-[60%] flex flex-col justify-center">
                <div>
                    <h1 className="text-3xl font-bold mb-[12px]">Welcome back</h1>
                </div>
                <div>
                    <h4 className="mb-[40px] text-sm">Your work, your data - always accessible</h4>
                </div>
                <div className="flex flex-col gap-1 mb-[22px]">
                  <label className="font-normal text-l">Email Address</label>
                  <input className="w-full h-11 pl-3 border border-black rounded-xl" type="email" placeholder="Email Address" />
                </div>
                <div className="flex flex-col gap-1 mb-[40px]">
                  <label className="font-normal text-l">Create Password</label>
                  <div className="relative w-full mb-[8px] ">
                    <input className="w-full h-11 pl-3 border border-black rounded-xl" type={showPassword ? "text" : "password"} placeholder="Enter password" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  <Link href="/forgotpassword">
                    <div className="w-full flex items-end justify-end cursor-pointer">
                        <button>Forgot password?</button>
                    </div>
                  </Link>

                </div>
                <Link href="/">
                  <div className="w-full h-12 text-white bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border-1 cursor-pointer mt-3">
                    <button type="submit">Log in</button>
                  </div>
                </Link>
                <div className="flex gap-1.5 mt-3 text-center justify-center items-center ">
                    <h2>Already have an account?</h2>
                    <Link href="/">
                        <span className="text-blue-600 cursor-pointer">Sign In</span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default login;
