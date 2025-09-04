'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import Studentrecords from './studentrecords';
import Nursequeuemanagement from './nursequeuemanagement';
import Dashboard from './dashboardnurse';
import { useRouter } from 'next/navigation';
import Settings  from './settings';

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
        return (<Settings/>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex text-black h-screen'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='bg-[#FBFBFB] w-full ml-[280px] h-screen overflow-y-auto flex flex-col items-center'>
        <Topbar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
        <div className='w-full h-[92%]'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
