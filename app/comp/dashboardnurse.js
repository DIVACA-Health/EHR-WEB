import React from 'react'


const dashboard = () => {
  return (
    <div className='h-full  w-[95%] flex flex-col m-auto'> 
        <div className='w-full min-h-[80px] mb-5 flex items-center justify-between text-black  '>
            <div className='w-[30%]'>
                <h2 className='font-bold text-2xl'>Dashboard</h2>
            </div>
            <div className=' flex justify-between items-center gap-1 h-full w-auto'>
                <div className='flex gap-1.5 w-[154px] items-center justify-center h-[50%] border-[1px] border-blue-600 cursor-pointer rounded-[8px]'>
                    <img src='/image/Calendar.png' alt='download' className='h-[20px] w-[20px]' />
                    <h3 className='text-sm font-medium text-[#3B6FED]'>This month</h3>
                </div>
                <div className='flex gap-1.5 bg-blue-600 w-[170px] items-center text-white justify-center h-[50%] cursor-pointer border-none rounded-[8px]'>
                    <img src='/image/Vector.png' alt='download' className='h-[20px] w-[20px]' />
                    <h3 className='text-sm text-medium'>Download report</h3>
                </div>
            </div>
        </div>
        <div className='h-full  w-full m-auto flex   gap-4'>
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

    </div>
  )
}

export default dashboard