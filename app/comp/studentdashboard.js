"use client";
import React, { useState } from 'react';
import Studentrecords from './studentrecords';
import QueueManagement from './queuemanagement';
import Dashboard from './dashboard';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
            <Dashboard/>
        );
      case 'students':
        return <Studentrecords/>;
      case 'queue':
        return (
            <QueueManagement/>
        );
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

  return (
    <div className='flex text-black h-screen'>
      {/* Sidebar: Fixed to the left */}
      <div className='bg-[rgba(12,22,47,1)] w-[20%] h-screen fixed top-0 left-0 flex flex-col gap-[75px]'>
        <div className='min-h-[15%] flex items-center justify-center w-[70%] bg-red-600]'>
          <img src='/image/DHLOGO.png' alt='logo' className='w-[100px] h-[35px]' />
        </div>
        <div className='min-h-[75%] flex justify-center'>
          <div className='w-[85%] min-h-full'>
            <nav className='flex flex-col gap-3 text-white'>
              <div
                onClick={() => setActiveTab('dashboard')}
                className={`flex gap-2 items-center rounded-xl p-3 cursor-pointer transition-colors duration-200
                ${activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                <img src='/image/Category.png' alt='dashboard' className='h-full w-[20%]' />
                <h2 className='w-[80%] h-full'>Dashboard</h2>
              </div>

              <div
                onClick={() => setActiveTab('students')}
                className={`flex gap-2 items-center rounded-xl p-3 cursor-pointer transition-colors duration-200
                ${activeTab === 'students' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                <img src='/image/Document.png' alt='student records' className='h-full w-[20%]' />
                <h2 className='w-[80%] h-full'>Student records</h2>
              </div>

              <div
                onClick={() => setActiveTab('queue')}
                className={`flex gap-2 items-center rounded-xl p-3 cursor-pointer transition-colors duration-200
                ${activeTab === 'queue' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                <img src='/image/Users.png' alt='queue' className='h-full w-[20%]' />
                <h2 className='w-[80%] h-full'>Queue management</h2>
              </div>

              <div
                onClick={() => setActiveTab('settings')}
                className={`flex gap-2 items-center rounded-xl p-3 cursor-pointer transition-colors duration-200
                ${activeTab === 'settings' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                <img src='/image/Settings.png' alt='settings' className='h-1/2 w-[20%]' />
                <h2 className='w-[80%] h-full'>Settings</h2>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content: Offset for fixed sidebar */}
      <div className='bg-white w-[80%] ml-[20%] h-screen overflow-y-auto flex flex-col items-center gap-2'>
        {/* Top Bar */}
        <div className='w-full h-[10%] flex items-center justify-center border-b-[2px] border-black'>
          <div className='h-[70%] w-[95%] flex items-center justify-between'>
            <div className='border-[2px] border-black h-[80%] w-[50%] flex items-center rounded-xl'>
              <img src='/image/Search.png' alt='search' className='h-[70%] w-[6%] pl-1' />
              <input
                type='search'
                placeholder='Search for anything...'
                className='h-[80%] w-[90%] pl-3 rounded-r-xl text-black outline-transparent'
              />
            </div>
            <div className='w-[15%] h-full flex items-center'>
              <div className='border-r-black w-1/2 h-[80%] flex items-center'>
                <img src='/image/Bell.png' alt='notification' className='h-[90%]' />
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

        {/* Content Renderer */}
        <div className='w-full'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
