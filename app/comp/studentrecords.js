import React from 'react'
import UserTable from './usertable'

const studentrecords = () => {
  return (
    <div className='w-[100%]  flex flex-col items-center'>
        <div className='flex w-[95%] h-[70px] justify-between items-center '>
            <div className='w-[75%] text-start'>
              <h3 className='text-2xl font-bold text-black'>Student records</h3>
            </div>
            <div className='flex gap-2 w-[172px] items-center justify-center h-[44px] border-[1px] border-black rounded-[8px] cursor-pointer'>
              <img src='/image/document-download.png' alt='download' className='h-[20px] w-[20px]' />
              <h3 className='font-medium'>Download list</h3>
            </div>
        </div>
        <div className='h-[166px] w-[95%] bg-blue-950 text-white rounded-xl flex items-center justify-center mt-5 relative bg-cover bg-center' style={{ backgroundImage: "url('/image/Pattern.png')",}}>
          <div className='absolute inset-0 bg-black opacity-85 rounded-xl'></div> 
          <div className='relative z-10'>
            <div className='min-h-6/10 min-w-4/10 flex items-center justify-center'>
                <div className='flex flex-col items-center'>
                  <h2 className='text-xl'>Total Students</h2>
                  <div>
                    <h1 className='text-3xl'>320</h1>
                  </div>
                </div>
                <div className='h-15 flex items-center gap-1 ml-6 '>
                  <img src='/image/Vector (2).png' alt='img' width={22} height={22}/>
                  <h2 className='text-green-600'>1.55% from last semester</h2>
                </div>
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