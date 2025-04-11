"use client" ;
import { useState } from "react";
import Logopicture from "../comp/logopicture";
import SelectableNumbers from "./selectednumbers";
import Link from "next/link";
import CountdownTimer from "./countdowntimer";


const forgotpasswordauthentication = () => {

  return (
    <div className="w-full h-[100vh] bg-white  flex justify-between text-black font-normal">
        <Logopicture/>
        <div className="w-[55%] h-[100vh] m-auto flex flex-col items-center justify-center">
            <Link href="/login" className=" w-7/10">
                <div className=" flex gap-1 items-center cursor-pointer">
                    <img src="/image/back.png" className=" h-[20] w-[20px]" />
                    <button>Back</button>
                </div>
            </Link>
            <div className=" h-8/10 w-[75%] flex flex-col  justify-center">
                <div className="mb-[12px] text-center">
                    <h1 className="text-2xl text-center font-bold">Enter OTP</h1>
                </div>
                <div className="mb-[25px] text-center w-full flex flex-col items-center justify-center">
                    <h4 className="text-sm ">To reset your password, enter the OTP sent to your email address </h4>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-4 mb-3">
                    <SelectableNumbers/>
                    <div className="flex gap-1">
                        <h4>Didn't get the code?</h4>
                        <h4>resend in:</h4>
                        <CountdownTimer/>
                    </div>
                </div>

                <Link href="/changepassword">
                  <div className="w-full h-12 text-white text-sm bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border-1 cursor-pointer mt-3">
                    <button type="submit">Confirm OTP</button>
                  </div>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default forgotpasswordauthentication;
