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
      console.log('Request URL:', url);
      console.log('Request Headers:', headers);
      const res = await fetch(url, { ...options, headers });
      console.log('Response Status:', res.status);
      console.log('Response Body:', await res.clone().text()); // Clone to log response body
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
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

      const handleRowClick = async (userId) => {
        if (!userId) {
          toast.error('Invalid user ID. Cannot navigate to the page.');
          return;
        }
    
        const checkUrl = `/api/v1/queue/${userId}/current`;
        const navigateUrl = `/queue/${userId}`; // Updated to point to real route
    
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
            const res = await fetchWithAuth('/api/v1/queue/');
            if (!res.ok) throw new Error("Failed to fetch queue data");
            const result = await res.json();
    
            const transformed = result.map((item) => ({
              name: `${item.firstName} ${item.lastName}`,
              divacaId: item.userId,
              matricNumber: item.studentId || 'N/A',
              status: item.status,
              lastVisit: new Date(item.timeAdded).toLocaleDateString(),
              avatar: item.avatar || '/image/avatar.png',
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


  return (
    <div className='h-fit  w-full flex flex-col  items-center justify-center'> 
    <div className='w-[95%] h-full flex flex-col mt-3'>
        <div className='w-full min-h-[80px] mb-5 flex items-center justify-between text-black  '>
            <div className='w-[30%]'>
                <h2 className='font-bold text-xl'>Dashboard</h2>
            </div>
            <div className=' flex justify-between items-center gap-2 h-full w-auto'>
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
        <div className='h-[114px]  w-full  flex gap-4 mb-10'>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#F7A752] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2  '>
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Patients in waiting</h2>
                    <h2 className='font-medium  text-xl'>15</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/Frame 1261158598@2x.png' alt='img' width={32} height={32}/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#3B6FED] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2 '> 
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Vitals logged today</h2>
                    <h2 className='font-medium  text-xl'>9</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/Frame 1261158733.png' alt='img' width={32} height={32}/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]' >
                <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#7C3AED] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-1' >
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Patients forwarded to doctor</h2>
                    <h2 className='font-medium text-xl'>10</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/Frame 1261158598.png' alt='img' width={32} height={32}/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                <div className='w-[1.2%] ml-0 pl-0 h-6/10 bg-[#E63946] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2 ' >
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Emergency alerts triggered</h2>
                    <h2 className='font-medium  text-xl'>1</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/warning.png' alt='img' width={32} height={32}/>
                </div>
            </div>
        </div>
        <div className='h-fit w-full mb-5 rounded-[12px]'>
            <div className='w-full  h-[12%] mb-3 flex items-center justify-between rounded-t-[12px]'>
                <div className='ml-1'>
                    <h2 className="text-xl font-medium">Patient Queue List (Waiting)</h2>
                </div>
                <div className='text-[#3B6FED] flex items-center gap-1 mr-4'>
                    <h2>view  all</h2>
                    <img src='/image/rightarrow.png' alt='img' height={9} width={16}/>
                </div>
            </div>
            <table className="w-full text-sm text-left rounded-[12px]  border-[#E4E4E4] border-collapse  shadow-xs ">
                            <thead className="bg-gray-100 rounded-t-[12px]">
                                <tr className="rounded-t-[12px]">
                                <th className="px-4 py-3 ">S/N</th>
                                <th className="px-4 py-3">Full Name</th>
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
                                    <td colSpan="7" className="px-4 py-6 text-center ">Loading...</td>
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
                                        user.status === 'In consultation' ? 'bg-blue-200 text-blue-800' :
                                        user.status === 'Forwarded to doctor' ? 'bg-blue-200 text-pink-800' :
                                        user.status === 'Emergency' ? 'bg-blue-200 text-red-800' :
                                        user.status === 'Returned to health attendant' ? 'bg-green-200 text-green-800' :
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
        <div className='h-fit w-full mb-5 rounded-[12px]'>
            <div className='w-full mb-3 h-[15%] flex items-center justify-between rounded-t-[12px]'>
                <div className='ml-1'>
                    <h2 className="text-xl font-medium">Pending Referrals</h2>
                </div>
                <div className='text-[#3B6FED] flex items-center gap-1 mr-4'>
                    <h2>view  all</h2>
                    <img src='/image/rightarrow.png' alt='img' height={9} width={16}/>
                </div>
            </div>
            <table className="w-full text-sm text-left rounded-[12px]  border-[#E4E4E4] border-collapse  shadow-xs ">
                            <thead className="bg-gray-100 rounded-t-[12px]">
                                <tr className="rounded-t-[12px]">
                                <th className="px-4 py-3 ">S/N</th>
                                <th className="px-4 py-3">Full Name</th>
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
                                    <td colSpan="7" className="px-4 py-6 text-center ">Loading...</td>
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
                                        user.status === 'In consultation' ? 'bg-blue-200 text-blue-800' :
                                        user.status === 'Forwarded to doctor' ? 'bg-blue-200 text-pink-800' :
                                        user.status === 'Emergency' ? 'bg-blue-200 text-red-800' :
                                        user.status === 'Returned to health attendant' ? 'bg-green-200 text-green-800' :
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
        <div className=' h-fit w-full mb-10 rounded-[12px]'>
            <div className='w-full h-[12%] flex items-center justify-between rounded-t-[12px] mb-3'>
                <div className='ml-1'>
                    <h2 className="text-xl font-medium">Recent interactions</h2>
                </div>
                <div className='text-[#3B6FED] flex items-center gap-1 mr-4'>
                    <h2>view  all</h2>
                    <img src='/image/rightarrow.png' alt='img' height={9} width={16}/>
                </div>
            </div>
            <table className="w-full text-sm text-left rounded-[12px]  border-[#E4E4E4] border-collapse  shadow-xs ">
                            <thead className="bg-gray-100 rounded-t-[12px]">
                                <tr className="rounded-t-[12px]">
                                <th className="px-4 py-3 ">S/N</th>
                                <th className="px-4 py-3">Full Name</th>
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
                                    <td colSpan="7" className="px-4 py-6 text-center ">Loading...</td>
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
                                        user.status === 'In consultation' ? 'bg-blue-200 text-blue-800' :
                                        user.status === 'Forwarded to doctor' ? 'bg-blue-200 text-pink-800' :
                                        user.status === 'Emergency' ? 'bg-blue-200 text-red-800' :
                                        user.status === 'Returned to health attendant' ? 'bg-green-200 text-green-800' :
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

    </div>
  )
}

export default dashboard