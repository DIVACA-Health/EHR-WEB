import React from 'react'
import UserTable from './usertable';

const studentdashboard = () => {
  return (
    <div className='flex text-black '>
        <div className=' bg-[rgba(12,22,47,1)] min-w-[20%] min-h-[100vh]  flex flex-col justify-between '>
            <div className='min-h-[10%] flex items-center justify-center w-[80%]'>
                <img src='/image/DHLOGO.png' alt='image' className='w-[50%] h-[50%]'/>
            </div>
            <div className=' min-h-[75%] flex justify-center'>
                <div className=' w-[85%] min-h-full'>
                    <nav className='flex flex-col gap-3 text-white'>
                        <div className='flex gap-2 items-center rounded-xl  p-3 hover:bg-blue-700'>
                            <img src='/image/Category.png' alt='image' className='h-full w-[20%]'/>
                            <h2 className='w-[80%] h-full '>Dashboard</h2>
                        </div>
                        <div className='flex gap-2 items-center rounded-xl  p-3 hover:bg-blue-700'>
                            <img src='/image/Document.png' alt='image' className='h-full w-[20%]'/>
                            <h2 className='w-[80%] h-full '>Student records</h2>
                        </div>
                        <div className='flex gap-2 items-center rounded-xl  p-3 hover:bg-blue-700 '>
                            <img src='/image/Users.png' alt='image' className='h-full w-[20%]'/>
                            <h2 className='w-[80%] h-full'>Queue management</h2>
                        </div>
                        <div className='flex gap-2 items-center rounded-xl  p-3 hover:bg-blue-700'>
                            <img src='/image/Settings.png' alt='image' className='h-1/2 w-[20%]'/>
                            <h2 className='w-[80%] h-full '>Settings</h2>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
        <div className='bg-white min-w-[80%] min-h-[100vh] flex flex-col items-center gap-2'>
            <div className=' w-full h-[10%] flex items-center justify-center border-b-[2px] border-black '>
                <div className='  h-[70%] w-[95%] flex items-center justify-between  '>
                    <div className=' border-[2px] border-black  h-[80%] w-[50%] flex items-center rounded-xl'>
                        <img src="image/Search.png" alt = "img" className=' h-[70%] w-[6%] pl-1'/>
                        <input type='search' placeholder='Search for anything...' className=' h-[80%] w-[90%] pl-3 rounded-r-xl text-black outline-transparent'></input>
                    </div>
                    <div className='w-[15%] h-full flex items-center'>
                        <div className='border-r-black w-1/2 h-[80%] flex items-center'>
                            <img src='/image/Bell.png' alt='notification' className='h-[90%]'/>
                        </div>
                        <div className='h-[90%] w-1/2 flex items-center justify-between'>
                            <img src='/image/profileimg.png' alt='profile' className='h-full' />
                            <select>
                                <option></option>
                                <option>1</option>
                                <option>2</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex  w-[95%] h-[10%] justify-between items-center'>
                <div className='w-[75%] text-start '>
                    <h3 className='text-2xl font-bold text-black'>
                        Student records
                    </h3>
                </div>
                <div className='flex gap-1.5 w-[25%] items-center justify-center h-[70%] border-[1px] border-black rounded-xl'>
                    <img src='/image/document-download.png' alt='img' className='h-1/2 w-[20px]'/>
                    <h3>Download list</h3>
                </div>
            </div>
            <div className='min-h-[18%] w-[95%] bg-blue-950 text-white rounded-xl flex  items-center justify-center'>
                <div className='min-h-6/10 min-w-4/10  flex items-center justify-center'>
                    <div className=' flex flex-col items-center '>
                        <h2 className='text-xl'>Total Students</h2>
                        <div>
                            <h1 className='text-3xl'>320</h1>
                        </div>
                    </div>
                    <div className='h-15 flex items-end '>
                        <h2>Percentage</h2>
                    </div>
                </div>
            </div>
            <div className=' w-[100%]'>
                <UserTable/>
            </div>
            


        </div>
    </div>
  )
}

export default studentdashboard;