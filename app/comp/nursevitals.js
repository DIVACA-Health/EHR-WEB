import React, { useState } from 'react';
import Nursevitalstable from './nursevitalstable'

const nursevitals = () => {
    const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div>
        <div className='border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-sm rounded-[12px]'>
            <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-xs mb-4 rounded-t-[12px] '>
                <div className='flex gap-3 items-center'>
                    <img src='/image/vitalsicon.png' alt='icon' height={36} width={36} />
                    <h1 className='font-medium text-lg'>Vitals</h1>
                </div>
                <button className='bg-blue-600 flex gap-[8px] w-[175px] h-[44px] items-center justify-center text-white rounded-[8px]'onClick={() => setShowSidebar(true)}><img src='/image/Plus.png' alt='icon' width={25} height={25} /><h1 className='text-[14px]'>Record New vitals</h1></button>
            </div>
            <div className='flex gap-3 p-4'>
                <div className='h-[175px] w-1/4 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2'>
                    <img src='/image/heartbeat.png' alt='img' width={32} height={32}/>
                    <h2 className='text-[14px]'>Heart Rate</h2>
                    <h2 className='text-[25px] font-medium'>89<span className='text-[14px] font-extralight'>bpm</span></h2>
                    <h2 className='text-[14px] font-extralight'>Heart Rate is Normal</h2>
                </div>
                <div className='h-[175px] w-1/4 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2'>
                    <img src='/image/pressure.png' alt='img' width={32} height={32}/>
                    <h2 className='text-[14px]'>Blood pressure</h2>
                    <h2 className='text-[25px] font-medium'>120/80<span className='text-[14px] font-extralight'>mmHg</span></h2>
                    <h2 className='text-[14px] font-extralight'>Blood pressure is Stable</h2>
                </div>
                <div className='h-[175px] w-1/4 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2'>
                    <img src='/image/temperature.png' alt='img' width={32} height={32}/>
                    <h2 className='text-[14px]'>Temperature</h2>
                    <h2 className='text-[25px] font-medium'>98.6<span className='text-[14px] font-extralight'>(°C )</span></h2>
                    <h2 className='text-[14px] font-extralight'>Temperature is Normal</h2>
                </div>
                <div className='h-[175px] w-1/4 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2'>
                    <img src='/image/weight.png' alt='img' width={32} height={32}/>
                    <h2 className='text-[14px]'>Weight</h2>
                    <h2 className='text-[25px] font-medium'>70<span className='text-[14px] font-extralight'>kg</span></h2>
                    <h2 className='text-[14px] font-extralight'>Weight is Healthy</h2>
                </div>
            </div>
        </div>
        <div className='mt-5 flex flex-col gap-3'>
            <h1 className='text-[18px] text-[rgba(59,59,59,1)] font-normal' >Vitals History</h1>
            <div className='w-full h-auto mb-10'>
                <Nursevitalstable/>
            </div>
        </div>
        {showSidebar && (
        <div className="fixed inset-0 bg-amber-100 bg-opacity-20 z-40" onClick={() => setShowSidebar(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold">Record New Vitals</h2>
              <button onClick={() => setShowSidebar(false)} className="text-xl">×</button>
            </div>
            <form className='min-h-[81%] flex flex-col   pl-7 pr-7 gap-[14px]'>
                <div className='flex h-[75px] flex-col justify-between '>
                    <label className='text-[13px] text-[rgba(137,137,137,1)]'>Heart rate (bpm)</label>
                    <input type='text' placeholder='89' className='h-[52px] w-full pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none'></input>
                </div>
                <div className='flex h-[75px] flex-col justify-between '>
                    <label className='text-[13px] text-[rgba(137,137,137,1)]'>Blood pressure (mmHg)</label>
                    <input type='text' placeholder='Enter blood pressure' className='h-[45px] w-full pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none'></input>
                </div>
                <div className='flex h-[75px] flex-col justify-between '>
                    <label className='text-[13px] text-[rgba(137,137,137,1)]'>Temperature (°C )</label>
                    <input type='text' placeholder='Enter temperature' className='h-[45px] w-full pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none'></input>
                </div>
                <div className='flex h-[75px] flex-col justify-between '>
                    <label className='text-[13px] text-[rgba(137,137,137,1)]'>Weight (kg)</label>
                    <input type='text' placeholder='Enter weight' className='h-[45px] w-full pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none'></input>
                </div>
                <div className='flex h-[75px] flex-col justify-between '>
                    <label className='text-[13px] text-[rgba(137,137,137,1)]'>Date</label>
                    <input type='text' value='18-04-2025' readOnly className='h-[45px] w-full pl-2 rounded-[12px] bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none'></input>
                </div>
                <div className='flex h-[75px] flex-col justify-between '>
                    <label className='text-[13px] text-[rgba(137,137,137,1)]'>Recorded by</label>
                    <input type='text' value="Nurse Titi Martins" readOnly className='h-[45px] w-full pl-2 rounded-[12px] bg-[rgba(239,239,239,1)]  border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none'></input>
                </div>
            </form>
            {/* Footer Save Button */}
            <div className='min-h-[8%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-t-sm'>
              <button
              type='submit'
                className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
              >
                Save Vitals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default nursevitals