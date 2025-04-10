import React from 'react'
import StudentVisitsChart from './studentvisitchart'
import HealthComplaintChart from './healthcomplaintchart'

const dashboard = () => {
  return (
    <div className='h-full  w-[95%] flex flex-col m-auto'> 
        <div className='w-full min-h-[80px] mb-5 flex items-center justify-between text-black  '>
            <div className='w-[30%]'>
                <h2 className='font-bold text-2xl'>Dashboard</h2>
            </div>
            <div className=' flex justify-between items-center gap-1.5 h-full w-[35%]'>
                <div className='flex gap-1.5 w-[45%] items-center justify-center h-[50%] border-[2px] border-blue-600 rounded'>
                    <img src='/image/document-download.png' alt='download' className='h-1/2 w-[20px]' />
                    <h3 className='text-sm'>This month</h3>
                </div>
                <div className='flex gap-1.5 bg-blue-600 w-[55%] items-center text-white justify-center h-[50%] border-[1px] border-black rounded'>
                    <img src='/image/document-download.png' alt='download' className='h-1/2 w-[20px]' />
                    <h3 className='text-sm'>Download report</h3>
                </div>
            </div>
        </div>
        <div className='h-full  w-full m-auto flex items-center  gap-4'>
            <div className='h-[114px]  w-[25%] flex  rounded  border-[1px] border-black  shadow-gray-700 shadow-b-2xl'>
                <div className='h-6/10 w-8/10 flex flex-col m-auto justify-between pl-2 border-l-[2px] border-l-blue-600 '>
                    <h2 className='font-light text-sm text-gray-600'>Total Visits</h2>
                    <h2 className='font-bold text-2xl'>550</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='' alt='img'/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex  rounded border-[1px] border-black  shadow-gray-700 shadow-b-2xl '>
                <div className='h-6/10 w-8/10 flex flex-col m-auto justify-between pl-2 border-l-[2px] border-l-blue-600 '>
                    <h2 className='font-light text-sm text-gray-600'>Average waiting time</h2>
                    <h2 className='font-bold text-2xl'>10 mins</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='' alt='img'/>
                </div>
            </div>
            <div className='h-[114px]  w-[25%] flex  rounded border-[1px] border-black  shadow-gray-700 shadow-b-2xl '>
                <div className='h-6/10 w-8/10 flex flex-col m-auto justify-between pl-2 border-l-[2px] border-l-blue-600 '>
                    <h2 className='font-light text-sm text-gray-600'>Most frequent complaint</h2>
                    <h2 className='font-bold text-2xl'>Maleria</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='' alt='img'/>
                </div>
            </div>
            <div className='h-[114px]  w-[25%] flex  rounded border-[1px] border-black  shadow-gray-700 shadow-b-2xl '>
                <div className='h-6/10 w-8/10 flex flex-col m-auto justify-between pl-2 border-l-[2px] border-l-blue-600 '>
                    <h2 className='font-light text-sm text-gray-600'>Peak hours</h2>
                    <h2 className='font-bold text-2xl'>11am - 2pm </h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='' alt='img'/>
                </div>
            </div>
        </div>
        <div className='mt-10 min-w-full bg-gray-50 flex items-center justify-center'>
            <StudentVisitsChart/>
        </div>
        <div className='mt-10 min-w-full bg-gray-50 flex items-center justify-center mb-20'>
            <HealthComplaintChart/>
        </div>
    </div>
  )
}

export default dashboard