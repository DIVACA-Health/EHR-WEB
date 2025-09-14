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
  const [collapsed, setCollapsed] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  // This handler will navigate to doctorsdashboard with the correct tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/doctorsdashboard?tab=${tab}`);
  };

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
    <div className="flex text-black h-screen">
      {/* Sidebar receives collapsed + toggle */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main content adjusts margin based on collapsed */}
      <div
        className={`bg-[#FBFBFB] w-full h-screen overflow-y-auto flex flex-col items-center transition-all duration-300 ${
          collapsed ? 'ml-[80px]' : 'ml-[280px]'
        }`}
      >
        <Topbar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
        <div className="w-full h-[92%]">{renderContent()}</div>
      </div>
    </div>
  );
};

export default queueDetailPage;