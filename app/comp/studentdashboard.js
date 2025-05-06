'use client';

import React, { useState, useEffect, useRef } from 'react';
import Studentrecords from './studentrecords';
import QueueManagement from './queuemanagement';
import Dashboard from './dashboard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // ✅ Access token protection
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // If token is missing, redirect to login page
    if (!token) {
      router.push("/login");
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Studentrecords />;
      case 'queue':
        return <QueueManagement />;
      case 'settings':
        return (
          <div className='text-center p-10 w-full'>
            <h1 className='text-2xl font-bold'>Settings Section</h1>
          </div>
        );
      default:
        return null;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='flex text-black h-screen'>
      {/* Sidebar */}
      <div className='bg-[rgba(12,22,47,1)] w-[23%] h-screen fixed top-0 left-0 flex flex-col gap-[75px]'>
        <div className='min-h-[15%] flex items-center justify-center w-[70%]'>
          <img src='/image/DHLOGO.png' alt='logo' className='w-[100px] h-[35px]' />
        </div>
        <div className='min-h-[75%] flex justify-center'>
          <div className='w-[85%] min-h-full'>
            <nav className='flex flex-col gap-3 text-white'>
              <div
                onClick={() => setActiveTab('dashboard')}
                className={`flex gap-2 items-center rounded-[8px] p-3 cursor-pointer transition-colors duration-200 ${
                  activeTab === 'dashboard' ? 'bg-[#D8E2FB]' : 'hover:bg-[#D8E2FB]'
                }`}
              >
                <img src='/image/Category.png' alt='dashboard' className='h-[22px] w-[20px]' />
                <h2 className={`w-[80%] h-full ${activeTab === 'dashboard' ? 'text-blue-600 font-normal' : 'text-sm'}`}>
                  Dashboard
                </h2>
              </div>

              <div
                onClick={() => setActiveTab('students')}
                className={`flex gap-2 items-center rounded-[8px] p-3 cursor-pointer transition-colors duration-200 ${
                  activeTab === 'students' ? 'bg-[#D8E2FB]' : 'hover:bg-[#D8E2FB]'
                }`}
              >
                <img src='/image/Document.png' alt='student records' className='h-[22px] w-[20px]' />
                <h2 className={`w-[80%] h-full ${activeTab === 'students' ? 'text-blue-600 font-normal' : 'text-sm'}`}>
                  Student records
                </h2>
              </div>

              <div
                onClick={() => setActiveTab('queue')}
                className={`flex gap-2 items-center rounded-[8px] p-3 cursor-pointer transition-colors duration-200 ${
                  activeTab === 'queue' ? 'bg-[#D8E2FB]' : 'hover:bg-[#D8E2FB]'
                }`}
              >
                <img src='/image/Users.png' alt='queue' className='h-[22px] w-[20px]' />
                <h2 className={`w-[80%] h-full text-sm ${activeTab === 'queue' ? 'text-blue-600 font-normal' : 'text-sm'}`}>
                  Queue management
                </h2>
              </div>

              <div
                onClick={() => setActiveTab('settings')}
                className={`flex gap-2 items-center rounded-[8px] p-3 cursor-pointer transition-colors duration-200 ${
                  activeTab === 'settings' ? 'bg-[#D8E2FB]' : 'hover:bg-[#D8E2FB]'
                }`}
              >
                <img src='/image/Settings.png' alt='settings' className='h-[22px] w-[20px]' />
                <h2 className={`w-[80%] h-full ${activeTab === 'settings' ? 'text-blue-600 font-normal' : 'text-sm'}`}>
                  Settings
                </h2>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-white w-[77%] ml-[23%] h-screen overflow-y-auto flex flex-col items-center '>
        {/* Top Bar */}
        <div className='w-full h-[8%] flex items-center justify-center border border-[rgba(240,242,245,1)] shadow-sm shadow-gray-200'>
          <div className='h-[70%] w-[95%] flex items-center justify-between'>
            <div className='border border-[rgba(240,242,245,1)] rounded-[7px] h-[40px] w-[45%] pl-2 flex items-center'>
              <img src='/image/Search.png' alt='search' className='h-[17px] w-[17px]' />
              <input
                type='search'
                placeholder='Search for anything...'
                className='h-full w-[90%] pl-3 rounded-r-xl text-black outline-none'
              />
            </div>
            <div className='w-[15%] h-full flex items-center relative' ref={dropdownRef}>
              <div className='border-r border-black w-1/2 h-[80%] flex items-center justify-center cursor-pointer'>
                <img src='/image/Bell.png' alt='notification' className='h-[20px] w-[16px]' />
              </div>
              <div className='h-[90%] w-1/2 flex items-center justify-end relative'>
                <img
                  src='/image/profileimg.png'
                  alt='profile'
                  className='cursor-pointer h-[41px] w-[41px]'
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

        {/* Rendered Tab Content */}
        <div className='w-full h-[92%] '>{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
