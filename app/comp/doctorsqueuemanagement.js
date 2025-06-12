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
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const router = useRouter();

  const handleRowClick = async (userId) => {
    if (!userId) {
      toast.error('Invalid user ID. Cannot navigate to the page.');
      return;
    }

    const checkUrl = `/api/v1/queue/${userId}/current`;
    const navigateUrl = `/queue1/${userId}`; // Updated to point to real route

    try {
      const res = await fetchWithAuth(checkUrl, { method: 'HEAD' });

      if (res.ok) {
        router.push(navigateUrl); // Navigate to the actual frontend route
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

        const transformed = result.map((item) => ({
          name: `${item.personalInfo.firstName} ${item.personalInfo.lastName}`,
          divacaId: item.student.id, // or item.student.matricNumber if you want the matric number here
          matricNumber: item.student.matricNumber || 'N/A',
          status: item.queueInfo.status,
          lastVisit: new Date(item.queueInfo.timeAdded).toLocaleDateString(),
          avatar: item.personalInfo.avatar || '/image/profileimg.png',
          queueId: item.queueInfo.id, // <-- Add this if you need to PATCH/PUT status later
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

  useEffect(() => {
    if (selectedStatus.toLowerCase() === 'all') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.status.toLowerCase() === selectedStatus.toLowerCase()));
    }
  }, [selectedStatus, data]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.menu-container')) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // Added for mobile
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const statusCounts = {
    all: data.length,
    waiting: data.filter((item) => item.status === 'Waiting').length,
    forwarded: data.filter((item) => item.status === 'Forwarded to doctor').length,
    consultation: data.filter((item) => item.status === 'In consultation').length,
    returned: data.filter((item) => item.status === 'Returned to health attendant').length,
    emergency: data.filter((item) => item.status === 'Emergency').length,
  };

  const statusOptions = [
    { label: `All (${statusCounts.all})`, value: 'All' },
    { label: `Waiting (${statusCounts.waiting})`, value: 'Waiting' },
    { label: `Forwarded to doctor (${statusCounts.forwarded})`, value: 'Forwarded to doctor' },
    { label: `In consultation (${statusCounts.consultation})`, value: 'In consultation' },
    { label: `Returned to health attendant (${statusCounts.returned})`, value: 'Returned to health attendant' },
    { label: `Emergency (${statusCounts.emergency})`, value: 'Emergency' },
  ];

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

      <div className="overflow-x-auto bg-white shadow rounded mt-4">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">S/N</th>
              <th className="px-4 py-3">Full Name1</th>
              <th className="px-4 py-3">Divaca ID</th>
              <th className="px-4 py-3">Matric No.</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Visit</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center">Loading...</td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((user, idx) => (
                <tr key={user.divacaId} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 flex items-center gap-3 cursor-pointer" onClick={() => handleRowClick(user.divacaId)}>
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    {user.name}
                  </td>
                  <td className="px-4 py-3">{user.divacaId}</td>
                  <td className="px-4 py-3">{user.matricNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      user.status === 'Waiting' ? 'bg-[#FFF5E3] text-[#E99633] border-[0.8px] border-[#E99633]' :
                      user.status === 'In consultation' ? 'bg-[#F2F6FF] text-[#3B6FED] border-[0.8px] border-[#3B6FED]' :
                      user.status === 'Forwarded to doctor' ? 'bg-[#ECFFF0] text-[#218838] border-[0.8px] border-[#218838]' :
                      user.status === 'Emergency' ? 'bg-[#ECFFF0] text-[#e24312] border-[0.8px] border-[#e24312]' :
                      user.status === 'Returned to health attendant' ? 'bg-[#EBE7FF] text-[#2000C2] border-[0.8px] border-[#2000C2]' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user.lastVisit}</td>
                  <td className="relative p-3 text-lg menu-container">
                    <button
                      onClick={() => setOpenMenuIndex((prev) => (prev === idx ? null : idx))}
                      className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                    >
                      <img src="/image/More circle.png" alt="More options" width={20} height={20} />
                    </button>
                    {openMenuIndex === idx && (
                      <div className="absolute right-0 top-0 w-62 z-10 bg-white shadow-md rounded-xl border border-gray-200">
                        <button
                          onClick={() => toast.success(`${user.name} added to patient queue`)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-center items-center cursor-pointer"
                        >
                          Add to patient queue
                        </button>
                      </div>
                    )}
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
  );
}
