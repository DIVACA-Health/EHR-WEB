'use client';
import React, { useState } from 'react';

const Notification = () => {
  const [isOn, setIsOn] = useState(true);
  const [isOn1, setIsOn1] = useState(true);
  const [isOn2, setIsOn2] = useState(true);
  const [isOn3, setIsOn3] = useState(true);

  const toggleSwitch = () => setIsOn(!isOn);
  const toggleSwitch1 = () => setIsOn1(!isOn1);
  const toggleSwitch2 = () => setIsOn2(!isOn2);
  const toggleSwitch3 = () => setIsOn3(!isOn3);

  return (
    <div className='w-full h-fit border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A]'>
      <div className='h-[60px] flex items-center pl-5 border-b-[0.8px] border-[#EBEBEB] rounded-t-[12px]'>
        <h1>Notification preferences</h1>
      </div>

      <div className='flex flex-col items-center justify-center'>
        {/* Toggle Section */}
        <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5]'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Appointment updates</h1>
            <h1 className='text-[#898989] text-xs'>Stay informed about upcoming or changed appointments.</h1>
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
            <h1 className='text-sm text-[#141414] font-normal'>Emergency alerts</h1>
            <h1 className='text-[#898989] text-xs'>Get notified instantly in case of health emergencies.</h1>
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
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Queue notifications</h1>
            <h1 className='text-[#898989] text-xs'>Track patient spots and wait time in the clinic queue.</h1>
          </div>
          <div className='flex items-center space-x-2'>
            <span className='text-sm'>{isOn2 ? 'On' : 'Off'}</span>
            <button
              onClick={toggleSwitch2}
              className={`w-12 h-6 flex items-center bg-blue-500 rounded-full p-1 duration-300 ${
                isOn2 ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
          </div>
        </div>

        <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5]'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>System announcements</h1>
            <h1 className='text-[#898989] text-xs'>Receive important updates about Divaca Health services.</h1>
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
  );
};

export default Notification;
