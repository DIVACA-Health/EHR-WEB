'use client';

import React, { useState, useEffect, useRef } from 'react';
import Studentrecords from './studentrecords';
import QueueManagement from './queuemanagement';
import Dashboard from './dashboard';
import Settings from './settings';
import Sidebar from './sidebar';
import Topbar from './topbar';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const StudentDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Access token protection
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Update tab in URL and route when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/studentdashboard?tab=${tab}`);
  };

  // Listen for URL changes (e.g. browser navigation)
  useEffect(() => {
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
        return <QueueManagement searchTerm={searchTerm} />;
      case 'settings':
        return <Settings />;
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
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className='bg-[#FBFBFB] w-full ml-[280px] h-screen overflow-y-auto flex flex-col items-center'>
        <Topbar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
        <div className='w-full h-[92%]'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;