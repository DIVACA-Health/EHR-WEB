'use client';

import { useEffect, useState, useRef } from "react";
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
 // Clone to log response body
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

export default function NurseQueueManagement() {
   const [selectedStatus, setSelectedStatus] = useState('All');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Floating menu state
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [menuUser, setMenuUser] = useState(null);

  const router = useRouter();
  const tableContainerRef = useRef(null);

  const handleRowClick = async (studentId) => {
    if (!studentId) {
      toast.error('Invalid user ID. Cannot navigate to the page.');
      return;
    }

    const checkUrl = `/api/v1/queue/${studentId}/current`;
    const navigateUrl = `/queue1/${studentId}`;

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
        if (!res.ok) throw new Error("Failed to fetch medical overview queue data");

        const result = await res.json();
        const transformed = result.data.map((item) => ({
          firstname: item.personalInfo.firstName,
          lastname: item.personalInfo.lastName,
          divacaId: item.queueInfo.id,
          matricNumber: item.student.matricNumber || 'N/A',
          status: item.queueInfo.status,
          studentId: item.student.id || "N/A",
          lastVisit: item.queueInfo.timeAdded
            ? item.queueInfo.timeAdded
            : '',
          avatar: '/image/profileimg.png',
        }));

        setData(transformed);
        setLoading(false);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') console.error(err);
        toast.error('Failed to fetch medical overview data');
        setLoading(false);
      }
    };

    fetchQueueData();
  }, []);

useEffect(() => {
  if (selectedStatus.toLowerCase() === 'all') {
    setFilteredData(
      data.filter(item =>
        ['Forwarded to doctor', 'In consultation', 'Emergency'].includes(item.status)
      )
    );
  } else {
    setFilteredData(
      data.filter(item => item.status.toLowerCase() === selectedStatus.toLowerCase())
    );
  }
}, [selectedStatus, data]);

  // Close floating menu on click outside
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

 const statusCounts = {
    forwarded: data.filter((item) => item.status === 'Forwarded to doctor').length,
    consultation: data.filter((item) => item.status === 'In consultation').length,
    emergency: data.filter((item) => item.status === 'Emergency').length,
  };

  statusCounts.all = statusCounts.forwarded + statusCounts.consultation + statusCounts.emergency;

  const statusOptions = [
    { label: `All (${statusCounts.all})`, value: 'All' },
    { label: `Forwarded to doctor (${statusCounts.forwarded})`, value: 'Forwarded to doctor' },
    { label: `In consultation (${statusCounts.consultation})`, value: 'In consultation' },
    { label: `Emergency (${statusCounts.emergency})`, value: 'Emergency' },
  ];


    const handlestartconsultation = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/v1/queue/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: "In consultation" }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error(`Failed to forward files: ${errorText}`);
        return;
      }

      toast.success('Consultation started successfully');
      setMenuUser(null);

      
      router.push(`/queue1/${menuUser.studentId}?section=notes`);
    } catch (err) {
      console.error('Failed to start consultation:', err);
      toast.error('An error occurred while forwarding files.');
    }
  };
  
     const handleendconsultation = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/v1/queue/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: "Returned to health attendant" }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error(`Failed to end consultation: ${errorText}`);
        return;
      }

      toast.success('consultation ended succesfully');
      setMenuUser(null);
      // Optionally refetch data here
    } catch (err) {
      console.error('Failed to forward files:', err);
      toast.error('An error occurred while forwarding files.');
    }
  };

  const sortedRows = [...filteredData].sort((a, b) => {
  // Emergency status always on top
  if (a.status === 'Emergency' && b.status !== 'Emergency') return -1;
  if (b.status === 'Emergency' && a.status !== 'Emergency') return 1;
  // Otherwise, sort by lastVisit (descending)
  const aTime = new Date(a.lastVisit).getTime();
  const bTime = new Date(b.lastVisit).getTime();
  return bTime - aTime;
});


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

  // Format time as "h:mm AM/PM"
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };


  return (
    <div className="p-4">
      <div className='flex justify-between items-center mb-[18px] mt-[20px]'>
        <h2 className='text-xl font-bold'>Queue management</h2>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap border-b-[1px] border-[#EBEBEB]">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`px-3 py-1 rounded text-sm font-extralight ${
              selectedStatus === option.value
                ? 'bg-transparent border-b-[2px] rounded-none border-b-[#3B6FED] text-[#3B6FED]'
                : 'bg-transparent text-[#898989]'
            }`}
            onClick={() => setSelectedStatus(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-[16px] mt-8 relative border border-[#E5E7EB]" ref={tableContainerRef}>
        <table className="w-full text-sm text-center border-collapse">
          <thead className="bg-white border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 font-bold text-[#6B7280]">S/N</th>
              <th className="px-4 py-3 font-bold text-[#6B7280]">First name</th>
              <th className="px-4 py-3 font-bold text-[#6B7280]">Last name</th>
              <th className="px-4 py-3 font-bold text-[#6B7280]">Time in</th>
              <th className="px-4 py-3 font-bold text-[#6B7280]">Status</th>
              <th className="px-4 py-3 font-bold text-[#6B7280]">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center">Loading...</td>
              </tr>
            ) : sortedRows.length > 0 ? (
              sortedRows.map((user, idx) => (
                <tr
                  key={user.divacaId}
                  className={idx % 2 === 0 ? "bg-[#FAFAFA] cursor-pointer" : "bg-white cursor-pointer"}
                  style={{ borderBottom: '1px solid #E5E7EB' }}
                  onClick={e => {
                    // Prevent row click if the action button (menu) is clicked
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
                      user.status === 'Admitted' ? 'bg-[#FFEBEB] text-[#FF4040] border-[#FF4040]' :
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
      {/* Floating Action Menu - OUTSIDE the table container */}
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
        >
          <button
            onClick={() => { handleRowClick(menuUser.studentId); setMenuUser(null); }}
            className="w-full text-left px-5 py-2 hover:bg-[#F0F2F5] text-[#141414] text-sm font-normal transition-colors"
            style={{ border: 'none', background: 'none' }}
          >
            View health record
          </button>
          {/* Conditionally render the consultation button */}
          {menuUser.status !== 'In consultation' ? (
            <button
              onClick={() => { handlestartconsultation(menuUser.studentId); setMenuUser(null); }}
              className="w-full text-left px-5 py-2 text-[#3B6FED] hover:bg-[#F0F2F5]  text-sm font-normal transition-colors"
              style={{ border: 'none', background: 'none' }}
            >
              Start Consultation
            </button>
          ) : (
            <button
              onClick={() => { handleendconsultation(menuUser.studentId); setMenuUser(null); }}
              className="w-full text-left px-5 py-2 hover:bg-[#F0F2F5] text-[#141414] text-sm font-normal transition-colors"
              style={{ border: 'none', background: 'none' }}
            >
              Complete Consultation
            </button>
          )}
        </div>
      )}

    </div>
  );
}
