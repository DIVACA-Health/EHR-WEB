import React, { useState, useEffect, useRef } from 'react';



const dashboard = () => {
  return (
    <div className='h-fit  w-full flex flex-col  items-center justify-center'> 
    <div className='w-[95%] h-full flex flex-col mt-3'>
        <div className='w-full min-h-[80px] mb-5 flex items-center justify-between text-black  '>
            <div className='w-[30%]'>
                <h2 className='font-bold text-xl'>Dashboard</h2>
            </div>
            <div className=' flex justify-between items-center gap-2 h-full w-auto'>
                <div className='flex gap-1.5 w-[154px] items-center justify-center h-[44px] border-[1px] border-blue-600 cursor-pointer rounded-[8px]'>
                    <img src='/image/Calendar.png' alt='download' className='h-[20px] w-[20px]' />
                    <h3 className='text-sm font-medium text-[#3B6FED]'>This month</h3>
                </div>
                <div className='flex gap-1.5 bg-blue-600 w-[177px] items-center text-white justify-center h-[44px] cursor-pointer border-none rounded-[8px]'>
                    <img src='/image/Vector.png' alt='download' className='h-[20px] w-[20px]' />
                    <h3 className='text-sm text-medium'>Download report</h3>
                </div>
            </div>
        </div>
        <div className='h-[114px]  w-full  flex gap-4 mb-10'>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#F7A752] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2  '>
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Patients in waiting</h2>
                    <h2 className='font-medium  text-xl'>15</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/Frame 1261158598@2x.png' alt='img' width={32} height={32}/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#3B6FED] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2 '> 
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Vitals logged today</h2>
                    <h2 className='font-medium  text-xl'>9</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/Frame 1261158733.png' alt='img' width={32} height={32}/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]' >
                <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#7C3AED] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-1' >
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Patients forwarded to doctor</h2>
                    <h2 className='font-medium text-xl'>10</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/Frame 1261158598.png' alt='img' width={32} height={32}/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                <div className='w-[1.2%] ml-0 pl-0 h-6/10 bg-[#E63946] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2 ' >
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Emergency alerts triggered</h2>
                    <h2 className='font-medium  text-xl'>1</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/warning.png' alt='img' width={32} height={32}/>
                </div>
            </div>
        </div>
        <div className='bg-red-500 h-[432px] w-full mb-5 rounded-[12px]'>
            <div className='w-full bg-blue-500 h-[12%] flex items-center justify-between rounded-t-[12px]'>
                <div className='ml-3'>
                    <h2>Patient Queue List</h2>
                </div>
                <div className='text-[#3B6FED] flex items-center gap-1 mr-4'>
                    <h2>view  all</h2>
                    <img src='/image/rightarrow.png' alt='img' height={9} width={16}/>
                </div>
            </div>
        </div>
        <div className='h-[158px] w-full  rounded-[12px] mb-10'>
            <div className='w-full  h-[30%] flex  tems-center justify-between rounded-t-[12px]'>
                <div className='ml-2'>
                    <h2 className='text-xl font-medium'>Personal Performance Summary</h2>
                </div>
            </div>
            <div className='h-[70%] w-full  flex gap-4 mb-10'>
                    <div className='h-full w-[33%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                        <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#F7A752] m-auto rounded-r-[8px]'></div>
                        <div className='h-6/10 w-[95%] flex flex-col m-auto justify-between pl-2  '>
                            <h2 className='font-extralight text-[14px] text-[#898989]'>Patients seen today</h2>
                            <h2 className='font-medium  text-xl'>25</h2>
                        </div>
                        {/* <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                            <img src='/image/Frame 1261158598@2x.png' alt='img' width={32} height={32}/>
                        </div> */}
                    </div>
                    <div className='h-full w-[33%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                        <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#3B6FED] m-auto rounded-r-[8px]'></div>
                        <div className='h-6/10 w-[95%] flex flex-col m-auto justify-between pl-2 '> 
                            <h2 className='font-extralight text-[14px] text-[#898989]'>Avg consultation time</h2>
                            <h2 className='font-medium  text-xl'>18 mins</h2>
                        </div>
                        {/* <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                            <img src='/image/Frame 1261158733.png' alt='img' width={32} height={32}/>
                        </div> */}
                    </div>
                    <div className='h-full w-[33%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]' >
                        <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#7C3AED] m-auto rounded-r-[8px]'></div>
                        <div className='h-6/10 w-[95%] flex flex-col m-auto justify-between pl-1' >
                            <h2 className='font-extralight text-[14px] text-[#898989]'>Prescriptions issued</h2>
                            <h2 className='font-medium text-xl'>5</h2>
                        </div>
                        {/* <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                            <img src='/image/Frame 1261158598.png' alt='img' width={32} height={32}/>
                        </div> */}
                    </div>
                </div>
        </div>

    </div>

    </div>
  )
}

export default dashboard