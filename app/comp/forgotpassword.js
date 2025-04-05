"use client" ;
import { useState } from "react";
import Logopicture from "../comp/logopicture";
import SelectableNumbers from "./selectednumbers";
import Modal from "./modal";
import Link from "next/link";


const forgotpassword = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full h-[100vh] bg-white  flex justify-between text-black font-normal">
        <Logopicture/>
        <div className="w-[55%] h-[100vh] m-auto flex flex-col items-center justify-center">
            <div className=" h-8/10 w-7/10">
                <Link href="/login">
                    <div className="mb-[28px] flex gap-1 items-center cursor-pointer">
                        <img src="/image/back.png" className=" h-[20] w-[20px]" />
                        <button>Back</button>
                    </div>
                </Link>
                <div className="mb-[12px] text-center">
                    <h1 className="text-2xl text-center font-bold">Forgot password</h1>
                </div>
                <div className="mb-[40px] text-center w-full flex flex-col items-center justify-center">
                    <h4 className="text-sm">That’s okay, it happens! Enter your registered email address to get an OTP to reset your password</h4>
                </div>
                <div className="h-[43px] w-full flex items-center justify-center mb-[40px]">
                    <input type="email" placeholder="Enter email address" className="w-8/10 h-full border-1 border-black rounded-xl pl-3"></input>
                </div>
                <Link href="/forgotpasswordauthentication">
                  <div className="w-full h-12 text-white text-sm bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border-1 cursor-pointer mt-3">
                    <button type="submit">Reset password</button>
                  </div>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default forgotpassword;
