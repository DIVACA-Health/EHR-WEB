'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/comp/sidebar';
import Topbar from '@/app/comp/topbar';
import Studentrecords from '@/app/comp/studentrecords';
import Doctorqueuemanagement from '@/app/comp/doctorsqueuemanagement';
import Dashboard from '@/app/comp/dashboarddoctor';
import { useRouter } from 'next/navigation';
import Doctoruserinfo from '@/app/comp/doctoruserinfo';
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
        <Doctoruserinfo/>
      );
    }
  
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Studentrecords />;
      case 'queue':
        return <Doctorqueuemanagement />;
      case 'settings':
        return <Settings/>;
      default:
        return null;
    }
  };
  

  return (
    <div className='flex text-black h-screen'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='bg-white w-full ml-[280px] h-screen overflow-y-auto flex flex-col items-center'>
        <Topbar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
        <div className='w-full h-[92%]'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default queueDetailPage;
