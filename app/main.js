import React from 'react'

const main = () => {
  return (
    <div className='bg-white w-full height-fit pl-5 pr-5 pt-3 pb-3'>
        <div className='h-fit rounded-[48px] bg-[#F0F5FF] pl-5 pr-5 pt-3 pb-20'>
            <div className='flex items-center justify-between pl-5 pr-5 mt-4'>
                <div>
                    <img src='/image/DHSVG1.png' alt='logo' className='w-[108px] h-[37px]'/>
                </div>
                <div className='w-[252px]'>
                    <nav className='flex items-center justify-between text-[#626262] w-full'>
                        <h1>Home</h1>
                        <h1>About us</h1>
                        <h1>Contact us</h1>
                    </nav>
                </div>
                
                    <button className='bg-[#3B6FED] border-[1px] border-[#3B6FED] rounded-[8px] w-[188px] h-[48px]'>
                        <h1 className=''>Explore Campus Care</h1>
                    </button>
            </div>
            <div className='flex items-center justify-between h-[70%] w-full pl-5 pr-10 mt-[77px]  '>
                <div className='w-[55%] h-full text-black flex flex-col gap-10 justify-center '>
                    <div className='w-[202px] h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                        <img src='/image/HeartRate.png' alt='IMG' className='w-[20px] h-[20px]' />
                        <h3 className='text-xs'>SMART HEALTH SOLUTION</h3>
                    </div>
                    <h1 className='text-[50px] '>Reimagining healthcare <br></br>starting from the campus</h1>
                    <h3>DIVACA Health empowers schools, Institutions and hospitals with digital records,<br></br> reliable infrastructure, and better health for all.</h3>
                    <div className='flex w-[432px] justify-between'>
                        <button className='bg-[#3B6FED] border-[1px] border-[#3B6FED] rounded-[8px] w-[210px] h-[48px]'>
                            <h1 className='text-white'>Explore Campus Care</h1>
                        </button>
                        <button className='bg-white border-[1px] border-[#3B6FED] rounded-[8px] w-[210px] h-[48px]'>
                            <h1 className='text-[#3B6FED]'>Explore Campus Care</h1>
                        </button>
                    </div>
                </div>
                <div className='w-[45%] h-full  flex justify-center items-center'>
                    <img src='/image/Group1171276095.png' alt='IMG' className='w-[90%] h-full'/>
                </div>
            </div>
        </div>
        <div className='h-[60vh]  w-full pl-15 pr-15 pt-10 pb-10 flex justify-between mt-10'>
            <div className='w-1/2 flex flex-col gap-3 justify-center text-black'>
                <div className='w-fit px-3 h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                    <img src='/image/usersblue.png' alt='IMG' className='w-[20px] h-[20px]' />
                    <h3 className='text-xs'>OUR INVESTORS & PARTNERS</h3>
                </div>
                <h1 className='text-[50px] font-bold '>Built by DIVACA Tech</h1>
                <h3>DIVACA Health empowers schools, Institutions and hospitals with <br></br> digital records, reliable infrastructure, and better health for all.</h3>
            </div>
            <div className='w-1/2 '> 
                <img src='/image/Frame1261158844.png' alt='IMG' className='h-full w-[100%]'/>
            </div>
        </div>
        <div className='h-[1491px] w-full bg-[#14254F] rounded-[48px] mt-15 flex flex-col items-center pt-10 gap-8'>
            <div>
                <img/>
                <h4>OUR PLANS</h4>
            </div>
            <h1>Explore our Plans</h1>
            <h2>DIVACA Health empowers schools, Institutions and hospitals with <br></br> digital records, reliable infrastructure, and better health for all.</h2>
            <div>
            <div className='w-1/2 bg-white h-[500px]'>
                <div className='bg-red-500 w-1/2 h-full'>
                    <div className=''></div>
                </div>

            </div>
        </div>
        </div>

    </div>
  )
}

export default main