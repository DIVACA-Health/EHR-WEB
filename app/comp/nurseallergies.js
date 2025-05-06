import React, { useState } from 'react';

const nurseallergies = () => {
    const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className='border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-sm rounded-[12px]'>
        <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-xs mb-4 rounded-t-[12px] '>
            <div className='flex gap-3 items-center'>
                <img src='/image/allergiesicon.png' alt='icon' height={36} width={36} />
                <h1 className='font-medium text-lg'>Allergies</h1>
            </div>
            <button className='bg-blue-600 flex gap-[8px] w-[195px] h-[44px] items-center justify-center text-white rounded-[8px]'onClick={() => setShowSidebar(true)}><img src='/image/Plus.png' alt='icon' width={25} height={25} /><h1 className='text-[14px]'>Record New Allergy</h1></button>
        </div>
        <div className='flex flex-col p-4 gap-4'>
            <div className='w-[95%] m-auto flex gap-5'>
                <div className='flex justify-between pl-4 pr-4 h-[65px] items-center w-[50%] border-[1px] border-[rgba(235,235,235,1)] rounded-[12px]'>
                    <div className='h-5/10 flex items-center gap-2'>
                        <img src='/image/Group 39895.png' alt='img' />
                        <h1>Penicillin</h1>
                    </div>
                    <div className='h-5/10'>
                        <div>
                            <h1 className='p-1 border-[0.8px] border-amber-400 rounded-[12px] bg-amber-400 text-amber-700'>Moderate</h1>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between pl-4 pr-4 h-[65px] items-center w-[50%] border-[1px] border-[rgba(235,235,235,1)] rounded-[12px]'>
                    <div className='h-5/10 flex items-center gap-2'>
                        <img src='/image/Group 39895.png' alt='img' />
                        <h1>Penicillin</h1>
                    </div>
                    <div className='h-5/10'>
                        <div>
                            <h1 className='p-1 border-[0.8px] border-amber-400 rounded-[12px] bg-amber-400 text-amber-700'>Moderate</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-[95%] m-auto flex gap-5'>
                <div className='flex justify-between pl-4 pr-4 h-[65px] items-center w-[50%] border-[1px] border-[rgba(235,235,235,1)] rounded-[12px]'>
                    <div className='h-5/10 flex items-center gap-2'>
                        <img src='/image/Group 39895.png' alt='img' />
                        <h1>Penicillin</h1>
                    </div>
                    <div className='h-5/10'>
                        <div>
                            <h1 className='p-1 border-[0.8px] border-amber-400 rounded-[12px] bg-amber-400 text-amber-700'>Moderate</h1>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between pl-4 pr-4 h-[65px] items-center w-[50%] border-[1px] border-[rgba(235,235,235,1)] rounded-[12px]'>
                    <div className='h-5/10 flex items-center gap-2'>
                        <img src='/image/Group 39895.png' alt='img' />
                        <h1>Peanuts</h1>
                    </div>
                    <div className='h-5/10'>
                        <div>
                            <h1 className='p-1 border-[0.8px] border-green-400 rounded-[12px] bg-green-400 text-green-700'>Mild</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {showSidebar && (
        <div className="fixed inset-0 bg-amber-100 bg-opacity-20 z-40" onClick={() => setShowSidebar(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold">Record New Allergies</h2>
              <button onClick={() => setShowSidebar(false)} className="text-xl">×</button>
            </div>
            <form className='min-h-[81%] flex flex-col   pl-7 pr-7 gap-[14px]'>

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

export default nurseallergies