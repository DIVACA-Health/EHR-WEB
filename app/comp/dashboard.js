import React, { useEffect, useState } from 'react'
import StudentVisitsChart from './studentvisitchart'
import HealthComplaintChart from './healthcomplaintchart'

const dashboard = () => {
  const [summary, setSummary] = useState({
    totalVisits: 0,
    averageWaitingTime: 'No data',
    mostFrequentComplaint: 'No data',
    peakHours: 'No data'
  });

  useEffect(() => {
    fetch('/api/v1/dashboard/analytics')
      .then(res => res.json())
      .then(data => {
        if (data?.data?.summary) {
          setSummary(data.data.summary);
        }
      });
  }, []);

  return (
    <div className='h-full  w-[95%] flex flex-col m-auto '> 
      <div className='w-full min-h-[80px] mb-5 flex items-center justify-between text-black  '>
        <div className='w-[30%]'>
          <h2 className='font-bold text-2xl'>Dashboard</h2>
        </div>
        <div className=' flex justify-between items-center gap-1 h-full w-auto'>
          <div className='flex gap-1.5 w-[154px] items-center justify-center h-[50%] border-[1px] border-blue-600 cursor-pointer rounded-[8px]'>
            <img src='/image/Calendar.png' alt='download' className='h-[20px] w-[20px]' />
            <h3 className='text-sm font-medium text-blue-600'>This month</h3>
          </div>
          <div className='flex gap-1.5 bg-blue-600 w-[170px] items-center text-white justify-center h-[50%] cursor-pointer border-none rounded-[8px]'>
            <img src='/image/Vector.png' alt='download' className='h-[20px] w-[20px]' />
            <h3 className='text-sm text-medium'>Download report</h3>
          </div>
        </div>
      </div>
      <div className='h-full  w-full m-auto flex items-center  gap-4'>
        <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
          <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#3B6FED] m-auto rounded-r-[8px]'></div>
          <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2  '>
            <h2 className='font-extralight text-[14px] text-[#898989]'>Total Visits</h2>
            <h2 className='font-medium  text-xl'>{summary.totalVisits}</h2>
          </div>
          <div className='h-full w-2/10  flex items-center justify-center pr-1'>
            <img src='/image/visitlogo.png' alt='img' width={32} height={32}/>
          </div>
        </div>
        <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
          <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#F7A752] m-auto rounded-r-[8px]'></div>
          <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2 '> 
            <h2 className='font-extralight text-[14px] text-[#898989]'>Average waiting time</h2>
            <h2 className='font-medium  text-xl'>{summary.averageWaitingTime}</h2>
          </div>
          <div className='h-full w-2/10  flex items-center justify-center pr-1'>
            <img src='/image/waitinglogo.png' alt='img' width={32} height={32}/>
          </div>
        </div>
        <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]' >
          <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#7C3AED] m-auto rounded-r-[8px]'></div>
          <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-1' >
            <h2 className='font-extralight text-[14px] text-[#898989]'>Most frequent complaint</h2>
            <h2 className='font-medium text-xl'>{summary.mostFrequentComplaint}</h2>
          </div>
          <div className='h-full w-2/10  flex items-center justify-center pr-1'>
            <img src='/image/frequentlogo.png' alt='img' width={32} height={32}/>
          </div>
        </div>
        <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
          <div className='w-[1.2%] ml-0 pl-0 h-6/10 bg-[#E63946] m-auto rounded-r-[8px]'></div>
          <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2 ' >
            <h2 className='font-extralight text-[14px] text-[#898989]'>Peak hours</h2>
            <h2 className='font-medium  text-xl'>{summary.peakHours}</h2>
          </div>
          <div className='h-full w-2/10  flex items-center justify-center pr-1'>
            <img src='/image/peaklogo.png' alt='img' width={32} height={32}/>
          </div>
        </div>
      </div>
      {/* ...existing chart code... */}
      <div className='mt-10  min-w-full  flex flex-col '>
        <div className='min-h-[15%] w-full border border-[rgba(240,242,245,1)]  rounded-t-xl flex items-center'>
          <h2 className=" font-semibold  ml-[24px] pt-4 pb-4">Student visits over time</h2>
        </div>
        <div className='h-[85%] w-full'>
          <StudentVisitsChart/>
        </div>
      </div>
      <div className='mt-10 min-w-full  flex flex-col mb-10 pb-20'>
        <div className='min-h-[15%] w-full border border-[rgba(240,242,245,1)]  rounded-t-xl flex items-center'>
          <h2 className=" font-semibold  ml-[24px] pt-4 pb-4">Most common health complaints</h2>
        </div>
        <div className='h-[85%] w-full'>
          <HealthComplaintChart/>
        </div>
      </div>
    </div>
  )
}

export default dashboard