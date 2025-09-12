'use client';
import React, { useState } from 'react';

const connectivity = () => {
    const [isOn, setIsOn] = useState(true);
    const [isOn1, setIsOn1] = useState(true);
    const [isOn2, setIsOn2] = useState(true);
    const [isOn3, setIsOn3] = useState(true);
  
    const toggleSwitch = () => setIsOn(!isOn);
    const toggleSwitch1 = () => setIsOn1(!isOn1);
    const toggleSwitch2 = () => setIsOn2(!isOn2);
    const toggleSwitch3 = () => setIsOn3(!isOn3);




  return (
    <div className='w-full h-fit bg-[#FFFFFF] border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A]'>
    <div className='h-[60px] flex items-center pl-5 border-b-[0.8px] border-[#EBEBEB] rounded-t-[12px]'>
      <h1 className="text-16px font-semibold">Connectivity settings</h1>
    </div>

    <div className='flex flex-col items-center justify-center'>
      {/* Toggle Section */}
      <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5]'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-sm text-[#141414] font-normal'>Enable automatic offline mode</h1>
          <h1 className='text-[#898989] text-xs'>Automatically switch to offline mode when internet connection</h1>
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

      <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5]'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-sm text-[#141414] font-normal'>Show time since last successful sync</h1>
          <h1 className='text-[#898989] text-xs'>Display the timestamp of when data was last synchronized with server</h1>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm'>{isOn1 ? 'On' : 'Off'}</span>
          <button
            onClick={toggleSwitch1}
            className={`w-12 h-6 flex items-center bg-blue-500 rounded-full p-1 duration-300 ${
              isOn1 ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
          </button>
        </div>
      </div>

      <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5]'>
        <div className='flex flex-col gap-2 '>
          <div className='flex gap-2 items-center'>
            <h1 className='text-sm text-[#141414] font-normal'>Sync data now</h1>
            <div className='bg-[#ECFFF0] border-[1px] border-[#218838] h-[24px] w-[181px] flex items-center justify-center rounded-[24px]'>
              <h1 className='text-xs text-[#218838]'>Last sync: Today, 10:42 AM</h1>
            </div>
          </div>
          <h1 className='text-[#898989] text-xs'>Manually synchronize all pending changes with the server</h1>
        </div>
        <div className='flex w-[122px] h-[40px] bg-[#3B6FED] items-center justify-center text-white rounded-[8px] gap-2 cursor-pointer'>
          <img src='/image/sync.png' alt='img' width={14} height={14}/>
          <h1 className='text-sm'>Sync now</h1>
        </div>
      </div>

      <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5]'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-sm text-[#141414] font-normal'>Data encryption for offline cache</h1>
          <h1 className='text-[#898989] text-xs'>Enable encryption for data stored locally when working offline</h1>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm'>{isOn3 ? 'On' : 'Off'}</span>
          <button
            onClick={toggleSwitch3}
            className={`w-12 h-6 flex items-center bg-blue-500 rounded-full p-1 duration-300 ${
              isOn3 ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default connectivity