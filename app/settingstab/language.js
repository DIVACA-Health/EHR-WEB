import React from 'react'

const language = () => {
  return (
    <div className='w-full h-fit border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A] '>
      <div className='h-[60px] flex items-center pl-5 border-b-[0.8px] border-[#EBEBEB] rounded-t-[12px]'>
        <h1>Language & regional preferences</h1>
      </div>
      <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5] m-auto'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Language</h1>
            <h1 className='text-[#898989] text-xs'>Select your preferred language for the interface</h1>
          </div>
          <div className='flex items-center h-1/2 w-[388px] border-[1px] border-[#D0D5DD] rounded-[12px] pr-2'>
            <select className='w-full h-full pl-3 outline-none'>
              <option>English</option>
              <option>Africans</option>
              <option>Yoruba</option>
            </select>
          </div>
      </div>
      <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5] m-auto'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Time zone</h1>
            <h1 className='text-[#898989] text-xs'>Set your local time zone for accurate scheduling</h1>
          </div>
          <div className='flex items-center h-1/2 w-[388px] border-[1px] border-[#D0D5DD] rounded-[12px] pr-2'>
            <select className='w-full h-full pl-3 outline-none'>
              <option>(UTC +1.00) West African Time</option>
              <option>(UTC +1.00) West African Time</option>
              <option>(UTC +1.00) West African Time</option>
            </select>
          </div>
      </div>
      <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5] m-auto'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Date format</h1>
            <h1 className='text-[#898989] text-xs'>Choose how dates are displayed</h1>
          </div>
          <div className='flex items-center h-1/2 w-[388px] border-[1px] border-[#D0D5DD] rounded-[12px] pr-2'>
            <input type='date' className='w-full h-full outline-none pl-3'></input>
          </div>
      </div>
    </div>
  )
}

export default language