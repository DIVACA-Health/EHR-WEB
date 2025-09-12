'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";

const security = () => {
  const [isOn, setIsOn] = useState(true);
  const toggleSwitch = () => setIsOn(!isOn);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState(""); 
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");// State to hold password



  return (
    <div className='flex flex-col gap-7 h-fit w-95% items-center justify-center'>
    <div className='w-full bg-[#FFFFFF] h-fit border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A]'>
    <div className='h-[60px] flex items-center pl-5 border-b-[0.8px] border-[#EBEBEB] rounded-t-[12px]'>
      <h1 className="text-16px font-semibold">Two-factor authentication</h1>
    </div>

    <div className='flex flex-col items-center justify-center'>
      {/* Toggle Section */}
      <div className='h-[75px]  w-[95%] flex justify-between items-center '>
        <div className='flex flex-col gap-2'>
          <h1 className='text-[16px] text-[#141414] font-normal'>Two-factor authentication</h1>
          <h1 className='text-[#898989] font-light text-[14px]'>Add an extra layer of security to your account by requiring a verification code during login.</h1>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm'>{isOn ? 'On' : 'Off'}</span>
          <button
            onClick={toggleSwitch}
            className={`w-12 h-6 flex items-center bg-blue-500 rounded-full p-1 duration-300 ${
              isOn ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
          </button>
        </div>
      </div>
    </div>
    </div>
    <div className='w-full bg-[#FFFFFF] h-fit border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A] mb-[30px]'>
    <div className='h-[60px] flex items-center pl-5 border-b-[0.8px] border-[#EBEBEB] rounded-t-[12px]'>
      <h1 className="text-16px font-semibold">Password</h1>
    </div>
    <div className='flex flex-col items-center justify-center'>
      <div className='h-[75px] w-[95%] flex justify-between items-center'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-sm text-[#141414] font-normal'>Change password</h1>
          <h1 className='text-[#898989] text-[14px]'>Easily update your password here to keep your account secure.</h1>
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-[10px] w-[95%] m-auto">
            <label className="font-normal text-sm">Current password</label>
            <div className="relative w-full mb-[8px]">
              <input
                className="w-full h-11 pl-3 border-[1px] border-[#EDEDED] rounded-[7px]  outline-none shadow-xs shadow-[#1018280D]"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Current password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
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
      <div className="flex flex-col gap-1 mb-[10px]  w-[95%] m-auto">
            <label className="font-normal text-sm">New password</label>
            <div className="relative w-full mb-[8px]">
              <input
                className="w-full h-11 pl-3 border-[1px] border-[#EDEDED] rounded-[7px]  outline-none shadow-xs shadow-[#1018280D]"
                type={showPassword ? "text" : "password"}
                placeholder="Enter New password"
                required
                value={password1}
                onChange={(e) => setPassword1(e.target.value)} // Update password state
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
      <div className="flex flex-col gap-1 mb-[20px]  w-[95%] m-auto ">
            <label className="font-normal text-sm">Confirm new password</label>
            <div className="relative w-full mb-[8px]">
              <input
                className="w-full h-11 pl-3 border-[1px] border-[#EDEDED] rounded-[7px]  outline-none shadow-xs shadow-[#1018280D]"
                type={showPassword2 ? "text" : "password"}
                placeholder="Confirm New password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)} // Update password state
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword2 ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
      </div>
      <div className=' w-[95%] m-auto h-[48px] flex justify-end items-center mb-[30px]'>
        <button className='h-[48px] text-white cursor-pointer w-[360px] bg-[#23343B99] rounded-[8px] border-[1px] border-[#23343B99] shadow-xs shadow-[#1018280D]'>Update Password</button>
      </div>
    </div>
    </div>
    </div>

  )
}

export default security