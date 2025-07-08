'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/comp/sidebar';
import Topbar from '@/app/comp/topbar';
import Studentrecords from '@/app/comp/studentrecords';
import Nursequeuemanagement from '@/app/comp/nursequeuemanagement';
import Dashboard from '@/app/comp/dashboardnurse';
import { useRouter } from 'next/navigation';
import Nurseuserinfo from '@/app/comp/nurseuserinfo';
import Settings from '@/app/comp/settings';

const queueDetailPage = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  const renderContent = () => {
    if (!activeTab) {
      return (
        <Nurseuserinfo/>
      );
    }
  
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Studentrecords />;
      case 'queue':
        return <Nursequeuemanagement />;
      case 'settings':
        return <Settings/>;
      default:
        return null;
    }
  };
  

  return (
    <div className='flex text-black h-screen'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='w-full ml-[280px] h-screen overflow-y-auto flex flex-col items-center bg-white'>
        <Topbar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
        <div className='w-full h-[92%]'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default queueDetailPage;
