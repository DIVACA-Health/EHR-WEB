import React from 'react'

const accessibility = () => {
  return (
  <div className='flex flex-col gap-7 '>
      <div className='w-full h-fit border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A] '>
        <div className='h-[60px] flex items-center pl-5 border-b-[0.8px] border-[#EBEBEB] rounded-t-[12px]'>
          <h1>Keyboard Functions</h1>
        </div>
        <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5] m-auto  '>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Navigate through clickable elements</h1>
          </div>
          <div className='flex items-center gap-2'>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[89px]'>
              <h1>Tab / Shift</h1>
            </div>
            +
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[45px]'>
              <h1>Tab</h1>
            </div>
          </div>
        </div>
        <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5] m-auto  '>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Select or activate a focused element</h1>
          </div>
          <div className='flex items-center gap-2'>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[56px]'>
              <h1>Enter</h1>
            </div>
          </div>
        </div>
        <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5] m-auto  '>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Close modals or dropdowns</h1>
          </div>
          <div className='flex items-center gap-2'>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[45px]'>
              <h1>Esc</h1>
            </div>
          </div>
        </div>
        <div className='h-[75px] w-[95%] flex justify-between items-center  m-auto '>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Navigate within menus, tables, or dropdown lists</h1>
          </div>
          <div className='flex items-center gap-2'>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[38px]'>
              <img src='/image/uparrow.png' alt='img' width={8} height={14}/>
            </div>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[38px]'>
              <img src='/image/downarrow.png' alt='img' width={8} height={14}/>
            </div>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[38px]'>
              <img src='/image/leftarrow.png' alt='img' width={14} height={14}/>
            </div>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[38px]'>
              <img src='/image/rightarrow copy.png' alt='img' width={14} height={14}/>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-fit border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A] mb-10'>
        <div className='h-[60px] flex items-center pl-5 border-b-[0.8px] border-[#EBEBEB] rounded-t-[12px] shadow-xs'>
          <h1>Shortcut Keys</h1>
        </div>
        <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5] m-auto  '>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Open patient search</h1>
          </div>
          <div className='flex items-center gap-2'>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[53px]'>
              <h1>Cntrl</h1>
            </div>
            +
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[35px]'>
              <h1>P</h1>
            </div>
          </div>
        </div>
        <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5] m-auto  '>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>Dashboard</h1>
          </div>
          <div className='flex items-center gap-2'>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[53px]'>
              <h1>Cntrl</h1>
            </div>
            +
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[35px]'>
              <h1>D</h1>
            </div>
          </div>
        </div>
        <div className='h-[75px] w-[95%] flex justify-between items-center border-b-[1px] border-[#F0F2F5] m-auto  '>
          <div className='flex flex-col gap-2'>
            <h1 className='text-sm text-[#141414] font-normal'>New record</h1>
          </div>
          <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[53px]'>
            <h1>Cntrl</h1>
            </div>
            +
            <div className=' border-[#3B3B3B] border-[2px] rounded-[2px] flex items-center justify-center h-[36px] w-[35px]'>
              <h1>N</h1>
            </div>
          </div>
          </div>
        </div>
      </div>
  </div>

  )
}

export default accessibility