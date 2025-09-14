'use client';

import React, { useState } from 'react';

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {

  return (
    <div
      className={`bg-[rgba(12,22,47,1)] h-screen fixed top-0 left-0 flex flex-col justify-between transition-[width] duration-300 ${
        collapsed ? 'w-[80px]' : 'w-[280px]'
      }`}
    >
      {/* Logo & Collapse Button */}
      <div className={`flex  min-h-[15%] items-center justify-between m-auto w-[80%] ${collapsed ? 'justify-center' : ''}`}>
        {/* Show full logo when expanded, small icon when collapsed */}
        {!collapsed ? (
          <img
            src="/image/DHLOGO.png"
            alt="logo"
            className="transition-all duration-300 w-[100px]  h-[35px] opacity-100"
          />
        ) : (
          <div className="w-[35px] h-[35px]  flex items-center justify-center  rounded-full">
            <img src="/image/navlogo.png" alt="logo" className="w-[30px] h-[30px]" />
          </div>
        )}

        <img
          src={collapsed ? "/image/extend.png" : "/image/reduce.png"}
          alt="toggle sidebar"
          className="h-[25px] w-[25px] cursor-pointer "
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col items-center flex-grow mt-10">
        <nav className="flex flex-col gap-3 text-white w-full px-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '/image/Category.png', iconBlue: '/image/Category(blue).png', w: 20, h: 20  },
            { id: 'students', label: 'Student records', icon: '/image/Document.png', iconBlue: '/image/Document(blue).png' , w: 20, h: 20 },
            { id: 'queue', label: 'Queue management', icon: '/image/Users.png', iconBlue: '/image/Users(blue).png', w: 20, h: 20  },
            { id: 'settings', label: 'Settings', icon: '/image/Settings.png', iconBlue: '/image/Settings(blue).png' , w: 20, h: 20 },
            ].map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center rounded-xl p-3 cursor-pointer transition-colors duration-200 
                  ${activeTab === tab.id ? 'bg-blue-100' : 'hover:bg-blue-100'} 
                  ${collapsed ? 'justify-center gap-0' : 'justify-start gap-2'}
                `}
              >
                {/* Both icons in DOM, just toggle visibility */}
                <img
                  src={tab.icon}
                  alt={tab.label}
                  style={{ width: `${tab.w}px`, height: `${tab.h}px` }}
                  className={`${activeTab === tab.id ? 'hidden' : 'block'}`}
                />
                <img
                  src={tab.iconBlue}
                  alt={tab.label}
                  style={{ width: `${tab.w}px`, height: `${tab.h}px` }}
                  className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
                />

                {/* Hide label if collapsed */}
                {!collapsed && (
                  <h2
                    className={`w-[80%] h-full ${
                      activeTab === tab.id ? 'text-blue-600 font-semibold' : 'text-sm'
                    }`}
                  >
                    {tab.label}
                  </h2>
                )}
              </div>
            ))}
        </nav>
      </div>

      {/* Bottom Logo / Badge */}
      {/* <div className="mb-4 flex justify-center">
        <img
          src="/image/university.png"
          alt="university"
          className={`transition-all duration-300 ${collapsed ? 'w-10 h-10' : 'w-[140px] h-[40px]'}`}
        />
      </div> */}
    </div>
  );
};

export default Sidebar;
