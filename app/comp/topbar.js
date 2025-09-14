'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Topbar = ({ showDropdown, setShowDropdown }) => {
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className='w-full h-[8%] bg-[#FFFFFF] flex items-center justify-center border border-[rgba(240,242,245,1)] shadow-xs shadow-gray-100'>
      <div className='h-[70%] w-[95%] flex items-center justify-between'>
        <div className='border border-[rgba(240,242,245,1)] rounded-[7px] h-[40px] w-[45%] pl-2 flex items-center'>
          <img src='/image/Search.png' alt='search' className='h-[17px] w-[17px]' />
          <input
            type='search'
            placeholder='Search for anything...'
            className='h-full w-[90%] pl-3 rounded-r-xl text-black outline-none'
          />
        </div>
        <div className='w-[123px] h-full flex items-center relative ' ref={dropdownRef} >
          <div className='border-r border-black w-[40%] h-[80%] flex items-center justify-center cursor-pointer'>
            <img src='/image/Bell.png' alt='notification' className='h-[20px] w-[16px]' />
          </div>
              <div className='h-[90%] w-[60%] flex gap-2 px-2  items-center justify-end relative '>
                <img
                  src='/image/profileimg.png'
                  alt='profile'
                  className='cursor-pointer h-[41px] w-[41px]'
                  onClick={() => setShowDropdown((prev) => !prev)}
                />
                <img
                  src='/image/dropdownprofile.png'
                  alt='profile'
                  className='cursor-pointer h-[4px] w-[9px]'
                  onClick={() => setShowDropdown((prev) => !prev)}
                />
                {showDropdown && (
                  <div className='absolute top-full right-0 mt-2 w-40 bg-white shadow-md rounded-md z-50'>
                    <button
                      onClick={() => {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("user");
                        router.push('/login');
                      }}
                      className='w-full text-left px-4 py-2 hover:bg-gray-100 text-sm'
                    >
                      Sign out
                    </button>
                    <button className='w-full text-left px-4 py-2 hover:bg-gray-100 text-sm'>
                      Option 2
                    </button>
                  </div>
                )}
              </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
