'use client';

import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Authorization token is missing.');
      throw new Error('Authorization token is missing.');
    }
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };
  
    try {
      const res = await fetch(url, { ...options, headers });
      if (res.status === 401) {
        console.error('Unauthorized: Invalid or expired token.');
        throw new Error('Unauthorized: Invalid or expired token.');
      }
      return res;
    } catch (error) {
      console.error('Error in fetchWithAuth:', error);
      throw error;
    }
};

const dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [menuUser, setMenuUser] = useState(null);
    const router = useRouter();
    const [data, setData] = useState([]);

    const handleRowClick = async (userId) => {
        if (!userId) {
          toast.error('Invalid user ID. Cannot navigate to the page.');
          return;
        }
    
        const checkUrl = `/api/v1/queue/${userId}/current`;
        const navigateUrl = `/queue/${userId}`;
    
        try {
          const res = await fetchWithAuth(checkUrl, { method: 'HEAD' });
    
          if (res.ok) {
            router.push(navigateUrl);
          } else if (res.status === 401) {
            toast.error('Unauthorized: Please log in again.');
            router.push('/login');
          } else {
            toast.error('The requested page does not exist.');
          }
        } catch (error) {
          toast.error('Failed to validate the page. Please try again.');
        }
    };

    useEffect(() => {
        const fetchQueueData = async () => {
          try {
            const res = await fetchWithAuth('/api/v1/queue/medical-overview');
            if (!res.ok) throw new Error("Failed to fetch queue data");
            const result = await res.json();
            const items = Array.isArray(result) ? result : result.data;
            const transformed = (items || []).map((item) => ({
              firstname: item.personalInfo.firstName,
              lastname: item.personalInfo.lastName,
              name: `${item.personalInfo.firstName} ${item.personalInfo.lastName}`,
              divacaId: item.queueInfo.id,
              matricNumber: item.student.matricNumber || 'N/A',
              status: item.queueInfo.status,
              studentId: item.student.id || "N/A",
              lastVisit: item.queueInfo.timeAdded ? item.queueInfo.timeAdded : '',
              avatar: '/image/profileimg.png',
            }));
            setData(transformed);
            setLoading(false);
          } catch (err) {
            if (process.env.NODE_ENV === 'development') console.error(err);
            toast.error('Failed to fetch queue data');
            setLoading(false);
          }
        };
        fetchQueueData();
    }, []);

    // Table filters
    const waitingData = data.filter(item => item.status === 'Waiting');
    const referralsData = data.filter(item => item.status === 'Emergency' || item.status === 'forwarded to doctor');
    const recentData = [...data].sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));

    // Floating menu click outside logic
    useEffect(() => {
        const handleClickOutside = (e) => {
          if (!e.target.closest('.floating-menu')) {
            setMenuUser(null);
          }
        };
        if (menuUser) {
          document.addEventListener("mousedown", handleClickOutside);
          document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [menuUser]);

    const formatTime = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

    // Floating menu positioning
const handleMenuButtonClick = (e, user) => {
  const btnRect = e.currentTarget.getBoundingClientRect();
  const menuHeight = 220; // Approximate height of your menu in px (adjust if needed)
  const spaceBelow = window.innerHeight - btnRect.bottom;
  let top = btnRect.bottom + 4;
  if (spaceBelow < menuHeight) {
    // Not enough space below, show above
    top = btnRect.top - menuHeight - 4;
    if (top < 0) top = 8; // Prevent offscreen top
  }
  setMenuPosition({
    top,
    left: btnRect.left,
  });
  setMenuUser(user);
};

    const handleForwardFiles = async (id) => {
      try {
        const res = await fetchWithAuth(`/api/v1/queue/${id}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: "Forwarded to Doctor" }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          toast.error(`Failed to forward files: ${errorText}`);
          return;
        }

        toast.success('Files forwarded successfully');
        setMenuUser(null);
        // Optionally refetch data here
      } catch (err) {
        console.error('Failed to forward files:', err);
        toast.error('An error occurred while forwarding files.');
      }
    };

    const handleemergency = async (id) => {
      try {
        const res = await fetchWithAuth(`/api/v1/queue/${id}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: "Emergency" }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          toast.error(`Failed to change status to Emergency: ${errorText}`);
          return;
        }

        toast.success('Emergency patient added');
        setMenuUser(null);
        // Optionally refetch data here
      } catch (err) {
        console.error('Failed to forward files:', err);
        toast.error('An error occurred while forwarding files.');
      }
    };

    const handleRemoveFromQueue = async (id) => {
      const toastId = toast.loading('Removing from queue...');
      try {
        const res = await fetchWithAuth(`/api/v1/queue/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to remove from queue');

        toast.success('Removed from queue', { id: toastId });
        setMenuUser(null);
        // Optionally refetch data here
      } catch (err) {
        console.error('Failed to remove from queue:', err);
        toast.error('An error occurred while removing from queue.', { id: toastId });
      }
    };

    return (
      <div className='h-fit w-full flex flex-col items-center justify-center'> 
        <div className='w-[95%] h-full flex flex-col mt-3'>
          <div className='w-full min-h-[80px] mb-5 flex items-center justify-between text-black'>
            <div className='w-[30%]'>
              <h2 className='font-bold text-xl'>Dashboard</h2>
            </div>
            <div className='flex justify-between items-center gap-2 h-full w-auto'>
              <div className='flex gap-1.5 w-[154px] items-center justify-center h-[44px] border-[1px] border-blue-600 cursor-pointer rounded-[8px]'>
                <img src='/image/Calendar.png' alt='download' className='h-[20px] w-[20px]' />
                <h3 className='text-sm font-medium text-[#3B6FED]'>This month</h3>
              </div>
              <div className='flex gap-1.5 bg-blue-600 w-[177px] items-center text-white justify-center h-[44px] cursor-pointer border-none rounded-[8px]'>
                <img src='/image/Vector.png' alt='download' className='h-[20px] w-[20px]' />
                <h3 className='text-sm text-medium'>Download report</h3>
              </div>
            </div>
          </div>
          <div className='h-[114px] w-full flex gap-4 mb-10'>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
              <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#F7A752] m-auto rounded-r-[8px]'></div>
              <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2'>
                <h2 className='font-extralight text-[14px] text-[#898989]'>Patients in waiting</h2>
                <h2 className='font-medium text-xl'>15</h2>
              </div>
              <div className='h-full w-2/10 flex items-center justify-center pr-1'>
                <img src='/image/Frame 1261158598@2x.png' alt='img' width={32} height={32}/>
              </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
              <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#3B6FED] m-auto rounded-r-[8px]'></div>
              <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2'> 
                <h2 className='font-extralight text-[14px] text-[#898989]'>Vitals logged today</h2>
                <h2 className='font-medium text-xl'>9</h2>
              </div>
              <div className='h-full w-2/10 flex items-center justify-center pr-1'>
                <img src='/image/Frame 1261158733.png' alt='img' width={32} height={32}/>
              </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
              <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#7C3AED] m-auto rounded-r-[8px]'></div>
              <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-1'>
                <h2 className='font-extralight text-[14px] text-[#898989]'>Patients forwarded to doctor</h2>
                <h2 className='font-medium text-xl'>10</h2>
              </div>
              <div className='h-full w-2/10 flex items-center justify-center pr-1'>
                <img src='/image/Frame 1261158598.png' alt='img' width={32} height={32}/>
              </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
              <div className='w-[1.2%] ml-0 pl-0 h-6/10 bg-[#E63946] m-auto rounded-r-[8px]'></div>
              <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2'>
                <h2 className='font-extralight text-[14px] text-[#898989]'>Emergency alerts triggered</h2>
                <h2 className='font-medium text-xl'>1</h2>
              </div>
              <div className='h-full w-2/10 flex items-center justify-center pr-1'>
                <img src='/image/warning.png' alt='img' width={32} height={32}/>
              </div>
            </div>
          </div>
          {/* Patient Queue List (Waiting) */}
          <div className='h-fit w-full mb-5 rounded-[12px]'>
            <div className='w-full h-[12%] mb-3 flex items-center justify-between rounded-t-[12px]'>
              <div className='ml-1'>
                <h2 className="text-xl font-medium">Patient Queue List (Waiting)</h2>
              </div>
              <div className='text-[#3B6FED] flex items-center gap-1 mr-4'>
                <h2>View all</h2>
                <img src='/image/rightarrow.png' alt='img' height={9} width={16}/>
              </div>
            </div>
            <div className="overflow-x-auto bg-white shadow rounded-[16px] mt-4 relative border border-[#E5E7EB]">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">S/N</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">First name</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Last name</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Time in</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Status</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center">Loading...</td>
                    </tr>
                  ) : waitingData.length > 0 ? (
                    waitingData.map((user, idx) => (
                      <tr
                        key={user.divacaId}
                        className={idx % 2 === 0 ? "bg-[#FAFAFA] cursor-pointer" : "bg-white cursor-pointer"}
                        style={{ borderBottom: '1px solid #E5E7EB' }}
                        onClick={e => {
                          if (
                            e.target.closest('.action-menu-btn') ||
                            e.target.closest('.floating-menu')
                          ) return;
                          handleRowClick(user.studentId);
                        }}
                      >
                        <td className="px-4 py-3">{idx + 1}</td>
                        <td className="px-4 py-3">{user.firstname}</td>
                        <td className="px-4 py-3">{user.lastname}</td>
                        <td className="px-4 py-3">{formatTime(user.lastVisit)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 text-xs rounded-full border ${
                            user.status === 'Waiting' ? 'bg-[#FFF5E3] text-[#E99633] border-[#E99633]' :
                            user.status === 'In consultation' ? 'bg-[#F2F6FF] text-[#3B6FED] border-[#3B6FED]' :
                            user.status === 'Forwarded to doctor' ? 'bg-[#ECFFF0] text-[#218838] border-[#218838]' :
                            user.status === 'Emergency' ? 'bg-[#FFF0EC] text-[#e24312] border-[#e24312]' :
                            user.status === 'Returned to health attendant' ? 'bg-[#EBE7FF] text-[#2000C2] border-[#2000C2]' :
                            'bg-gray-200 text-gray-800 border-gray-300'
                          }`}>
                            {user.status === 'Returned to health attendant' ? 'Returned to attendant' : user.status}
                          </span>
                        </td>
                        <td className="relative p-3 text-lg" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={e => { e.stopPropagation(); handleMenuButtonClick(e, user); }}
                            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer action-menu-btn"
                          >
                            <img src="/image/More circle.png" alt="More options" width={20} height={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                        No queue data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pending Referrals */}
          <div className='h-fit w-full mb-5 rounded-[12px]'>
            <div className='w-full mb-3 h-[15%] flex items-center justify-between rounded-t-[12px]'>
              <div className='ml-1'>
                <h2 className="text-xl font-medium">Pending Referrals</h2>
              </div>
              <div className='text-[#3B6FED] flex items-center gap-1 mr-4'>
                <h2>View all</h2>
                <img src='/image/rightarrow.png' alt='img' height={9} width={16}/>
              </div>
            </div>
            <div className="overflow-x-auto bg-white shadow rounded-[16px] mt-4 relative border border-[#E5E7EB]">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">S/N</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">First name</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Last name</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Time in</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Status</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center">Loading...</td>
                    </tr>
                  ) : referralsData.length > 0 ? (
                    referralsData.map((user, idx) => (
                      <tr
                        key={user.divacaId}
                        className={idx % 2 === 0 ? "bg-[#FAFAFA] cursor-pointer" : "bg-white cursor-pointer"}
                        style={{ borderBottom: '1px solid #E5E7EB' }}
                        onClick={e => {
                          if (
                            e.target.closest('.action-menu-btn') ||
                            e.target.closest('.floating-menu')
                          ) return;
                          handleRowClick(user.studentId);
                        }}
                      >
                        <td className="px-4 py-3">{idx + 1}</td>
                        <td className="px-4 py-3">{user.firstname}</td>
                        <td className="px-4 py-3">{user.lastname}</td>
                        <td className="px-4 py-3">{formatTime(user.lastVisit)}</td>
                        <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full border ${
                      user.status === 'Waiting' ? 'bg-[#FFF5E3] text-[#E99633] border-[#E99633]' :
                      user.status === 'In consultation' ? 'bg-[#F2F6FF] text-[#3B6FED] border-[#3B6FED]' :
                      user.status === 'Forwarded to doctor' ? 'bg-[#ECFFF0] text-[#218838] border-[#218838]' :
                      user.status === 'Emergency' ? 'bg-[#FFF0EC] text-[#e24312] border-[#e24312]' :
                      user.status === 'Returned to health attendant' ? 'bg-[#EBE7FF] text-[#2000C2] border-[#2000C2]' :
                      'bg-gray-200 text-gray-800 border-gray-300'
                    }`}>
                      {user.status === 'Returned to health attendant' ? 'Returned to attendant' : user.status}
                    </span>
                        </td>
                        <td className="relative p-3 text-lg" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={e => { e.stopPropagation(); handleMenuButtonClick(e, user); }}
                            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer action-menu-btn"
                          >
                            <img src="/image/More circle.png" alt="More options" width={20} height={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                        No queue data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Recent Interactions */}
          <div className='h-fit w-full mb-10 rounded-[12px]'>
            <div className='w-full h-[12%] flex items-center justify-between rounded-t-[12px] mb-3'>
              <div className='ml-1'>
                <h2 className="text-xl font-medium">Recent interactions</h2>
              </div>
              <div className='text-[#3B6FED] flex items-center gap-1 mr-4'>
                <h2>View all</h2>
                <img src='/image/rightarrow.png' alt='img' height={9} width={16}/>
              </div>
            </div>
            <div className="overflow-x-auto bg-white shadow rounded-[16px] mt-4 relative border border-[#E5E7EB]">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">S/N</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">First name</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Last name</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Date</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Status</th>
                    <th className="px-4 py-3 font-normal text-[#6B7280]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center">Loading...</td>
                    </tr>
                  ) : recentData.length > 0 ? (
                    recentData.map((user, idx) => (
                      <tr
                        key={user.divacaId}
                        className={idx % 2 === 0 ? "bg-[#FAFAFA] cursor-pointer" : "bg-white cursor-pointer"}
                        style={{ borderBottom: '1px solid #E5E7EB' }}
                        onClick={e => {
                          if (
                            e.target.closest('.action-menu-btn') ||
                            e.target.closest('.floating-menu')
                          ) return;
                          handleRowClick(user.studentId);
                        }}
                      >
                        <td className="px-4 py-3">{idx + 1}</td>
                        <td className="px-4 py-3">{user.firstname}</td>
                        <td className="px-4 py-3">{user.lastname}</td>
                        <td className="px-4 py-3">{formatDate(user.lastVisit)}</td>
                        <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full border ${
                      user.status === 'Waiting' ? 'bg-[#FFF5E3] text-[#E99633] border-[#E99633]' :
                      user.status === 'In consultation' ? 'bg-[#F2F6FF] text-[#3B6FED] border-[#3B6FED]' :
                      user.status === 'Forwarded to doctor' ? 'bg-[#ECFFF0] text-[#218838] border-[#218838]' :
                      user.status === 'Emergency' ? 'bg-[#FFF0EC] text-[#e24312] border-[#e24312]' :
                      user.status === 'Returned to health attendant' ? 'bg-[#EBE7FF] text-[#2000C2] border-[#2000C2]' :
                      'bg-gray-200 text-gray-800 border-gray-300'
                    }`}>
                      {user.status === 'Returned to health attendant' ? 'Returned to attendant' : user.status}
                    </span>
                        </td>
                        <td className="relative p-3 text-lg" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={e => { e.stopPropagation(); handleMenuButtonClick(e, user); }}
                            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer action-menu-btn"
                          >
                            <img src="/image/More circle.png" alt="More options" width={20} height={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                        No queue data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Floating menu rendered ONCE here */}
        {menuUser && (
          <div
            className="floating-menu bg-white shadow-lg rounded-lg border border-gray-200 py-2"
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left - 90,
              minWidth: 160,
              zIndex: 1000,
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => { handleRowClick(menuUser.studentId); setMenuUser(null); }}
              className="w-full text-left px-5 py-2 hover:bg-[#F0F2F5] text-[#141414] text-sm font-normal transition-colors"
              style={{ border: 'none', background: 'none' }}
            >
              View health record
            </button>
            <button
              onClick={() => { handleRowClick(menuUser.studentId); setMenuUser(null); }}
              className="w-full text-left px-5 py-2 hover:bg-[#F0F2F5] text-[#141414] text-sm font-normal transition-colors"
              style={{ border: 'none', background: 'none' }}
            >
              Record vitals
            </button>
            <button
              onClick={() => { handleForwardFiles(menuUser.divacaId); setMenuUser(null); }}
              className="w-full text-left px-5 py-2 hover:bg-[#F0F2F5] text-[#141414] text-sm font-normal transition-colors"
              style={{ border: 'none', background: 'none' }}
            >
              Forward patient files
            </button>
            <button
              onClick={() => { handleemergency(menuUser.divacaId); setMenuUser(null); }}
              className="w-full text-left px-5 py-2 hover:bg-[#F0F2F5] text-[#E24312] text-sm font-normal transition-colors"
              style={{ border: 'none', background: 'none' }}
            >
              Flag as emergency
            </button>
            <button
              onClick={() => { handleRemoveFromQueue(menuUser.divacaId); setMenuUser(null); }}
              className="w-full text-left px-5 py-2 hover:bg-[#F0F2F5] text-[#E24312] text-sm font-normal transition-colors"
              style={{ border: 'none', background: 'none' }}
            >
              Remove from queue
            </button>
          </div>
        )}
      </div>
    );
};

export default dashboard;