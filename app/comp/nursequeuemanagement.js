'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NurseQueueManagement() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleRowClick = (userId) => {
    router.push(`/queue/${userId}`);
  };

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const res = await fetch('/api/queue');
        const result = await res.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch queue data');
        setLoading(false);
      }
    };

    fetchQueueData();
  }, []);

  useEffect(() => {
    if (selectedStatus === 'All') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.status === selectedStatus));
    }
  }, [selectedStatus, data]);

  const statusCounts = {
    all: data.length,
    waiting: data.filter((item) => item.status === 'Waiting').length,
    consultation: data.filter((item) => item.status === 'In consultation').length,
    returned: data.filter((item) => item.status === 'Returned to health attendant').length,
  };

  const statusOptions = [
    { label: `All (${statusCounts.all})`, value: 'All' },
    { label: `Waiting (${statusCounts.waiting})`, value: 'Waiting' },
    { label: `In consultation (${statusCounts.consultation})`, value: 'In consultation' },
    { label: `Returned to health attendant (${statusCounts.returned})`, value: 'Returned to health attendant' },
  ];

  return (
    <div className="p-4">
      <div className='flex justify-between items-center mb-[18px] mt-[20px]'>
        <h2 className='text-xl font-bold'>Queue management</h2>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-4 flex-wrap border-b-[1px] border-[rgba(235, 235, 235, 1)]">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`px-4 py-1 rounded text-sm font-medium ${
              selectedStatus === option.value
                ? 'bg-transparent border-b-[2px] rounded-none border-e-blue-400 text-blue-400'
                : 'bg-transparent text-gray-700'
            }`}
            onClick={() => setSelectedStatus(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto bg-white shadow rounded mt-4">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Divaca ID</th>
              <th className="px-4 py-3">Matric No.</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((user, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleRowClick(user.divacaId)}
                  className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {user.name}
                  </td>
                  <td className="px-4 py-3">{user.divacaId}</td>
                  <td className="px-4 py-3">{user.matricNumber}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.status === 'Waiting'
                          ? 'bg-yellow-200 text-yellow-800'
                          : user.status === 'In consultation'
                          ? 'bg-blue-200 text-blue-800'
                          : user.status === 'Returned to health attendant'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user.lastVisit}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
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
