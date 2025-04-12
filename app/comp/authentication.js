"use client" ;
import { useState } from "react";
import Logopicture from "../comp/logopicture";
import SelectableNumbers from "./selectednumbers";
import Modal from "./modal";
import Link from "next/link";
import CountdownTimer from "./countdowntimer";

const authentication = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full h-[100vh] bg-white  flex justify-between text-black font-normal">
        <Logopicture/>
        <div className="w-[55%] h-[100vh] m-auto flex flex-col items-center justify-center ">
            <div className=" w-[70%] h-[70%] flex flex-col ">
                <Link href="/">
                    <div className="mb-25 flex gap-1 items-center cursor-pointer">
                        <img src="/image/back.png" className=" h-[20] w-[20px]" />
                        <button>Back</button>
                    </div>
                </Link>
                <div className="flex flex-col justify-between gap-3  h-[40%] items-center mb-20">
                    <h1 className="text-3xl font-semibold">Verify email address</h1>
                    <h4 className=" text-center">Kindly input the 4-digit code sent to your <span className="text-blue-400">zarades@gmail.com</span> </h4>
                    <SelectableNumbers/>
                    <div className="flex gap-0.5">
                        <h4>Didn't get the code?</h4>
                        <h4>resend in:</h4>
                        <CountdownTimer/>
                    </div>
                </div>
                <div className="w-full h-[45px]">
                    <button type="submit" onClick={() => setIsModalOpen(true)} className="h-full w-full bg-blue-600 text-white font-normal text-center border-2 border-white rounded-2xl cursor-pointer">Verify email address</button>
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </div>
    </div>
  )
}

export default authentication;
