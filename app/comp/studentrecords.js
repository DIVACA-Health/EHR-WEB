import React from 'react'
import UserTable from './usertable'

const studentrecords = () => {
  return (
    <div className='w-[100%] h-auto flex flex-col items-center'>
        <div className='flex w-[95%] h-[70px] justify-between items-center '>
            <div className='w-[75%] text-start'>
              <h3 className='text-2xl font-bold text-black'>Student records</h3>
            </div>
            <div className='flex gap-1.5 w-[25%] items-center justify-center h-[70%] border-[1px] border-black rounded-xl'>
              <img src='/image/document-download.png' alt='download' className='h-1/2 w-[20px]' />
              <h3>Download list</h3>
            </div>
        </div>
        <div className='h-[166px] w-[95%] bg-blue-950 text-white rounded-xl flex items-center justify-center mt-5'>
            <div className='min-h-6/10 min-w-4/10 flex items-center justify-center'>
              <div className='flex flex-col items-center'>
                <h2 className='text-xl'>Total Students</h2>
                <div>
                  <h1 className='text-3xl'>320</h1>
                </div>
              </div>
              <div className='h-15 flex items-end ml-6'>
                <h2>Percentage</h2>
              </div>
            </div>
        </div>
        <div className='mt-3 w-[100%]'>
            <UserTable/>
        </div>
        
    </div>
  )
}

export default studentrecords