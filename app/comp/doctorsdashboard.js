'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import Studentrecords from './studentrecords';
import Doctorqueuemanagement from './doctorsqueuemanagement';
import Dashboard from './dashboarddoctor';
import { useRouter, useSearchParams } from 'next/navigation';
import Settings  from './settings';

const StudentDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Update tab in URL and route when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/doctorsdashboard?tab=${tab}`); // always go to dashboard route
  };

  useEffect(() => {
    // Listen for URL changes (e.g. browser navigation)
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Studentrecords />;
      case 'queue':
        return <Doctorqueuemanagement />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className='flex text-black h-screen'>
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className='w-full ml-[280px] h-screen overflow-y-auto flex flex-col items-center bg-[#FBFBFB]'>
        <Topbar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
        <div className='w-full h-[92%]'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;