'use client';

import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className='bg-[rgba(12,22,47,1)] w-[280px] h-screen fixed top-0 left-0 flex flex-col gap-[75px]'>
      <div className='min-h-[15%] flex items-center justify-center w-[70%]'>
        <img src='/image/DHLOGO.png' alt='logo' className='w-[100px] h-[35px]' />
      </div>
      <div className='min-h-[75%] flex justify-center'>
        <div className='w-[85%] min-h-full'>
          <nav className='flex flex-col gap-3 text-white'>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '/image/Category.png' },
              { id: 'students', label: 'Student records', icon: '/image/Document.png' },
              { id: 'queue', label: 'Queue management', icon: '/image/Users.png' },
              { id: 'settings', label: 'Settings', icon: '/image/Settings.png' },
            ].map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex gap-2 items-center rounded-xl p-3 cursor-pointer transition-colors duration-200 ${
                  activeTab === tab.id ? 'bg-blue-100' : 'hover:bg-blue-100'
                }`}
              >
                <img src={tab.icon} alt={tab.label} className='h-[22px] w-[20px]' />
                <h2
                  className={`w-[80%] h-full ${
                    activeTab === tab.id ? 'text-blue-600 font-normal' : 'text-sm'
                  }`}
                >
                  {tab.label}
                </h2>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
