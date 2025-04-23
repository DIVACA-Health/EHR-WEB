'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import Studentrecords from './studentrecords';
import Nursequeuemanagement from './nursequeuemanagement';
import Dashboard from './dashboard';
import { useRouter } from 'next/navigation';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Studentrecords />;
      case 'queue':
        return <Nursequeuemanagement />;
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='bg-white w-[77%] ml-[23%] h-screen overflow-y-auto flex flex-col items-center'>
        <Topbar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
        <div className='w-full h-[92%]'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
