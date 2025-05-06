'use client';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Authorization token is missing.');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

const QueueManagement = () => {
  const [queue, setQueue] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionIndex, setActiveActionIndex] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  const itemsPerPage = 10;
  const actionButtonRefs = useRef({});
  const dropdownRefs = useRef({});

  const fetchQueue = async () => {
    try {
      const res = await fetchWithAuth('/api/v1/queue/');
      if (!res.ok) throw new Error('Failed to fetch queue');
      const result = await res.json();
      setQueue(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error('Failed to load queue:', err);
      toast.error('Failed to load queue');
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleClickOutside = (event) => {
    const buttonRefs = Object.values(actionButtonRefs.current);
    const dropdowns = Object.values(dropdownRefs.current);
  
    const clickedOutsideAll = buttonRefs.every(
      (ref, i) =>
        (!ref || !ref.contains(event.target)) &&
        (!dropdowns[i] || !dropdowns[i].contains(event.target))
    );
  
    if (clickedOutsideAll) {
      setActiveActionIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddToQueue = async () => {
    if (!formData.firstName || !formData.lastName) {
      setFormError('Please fill in all the fields.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const capitalizeName = (name) =>
      name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    const formattedFirstName = capitalizeName(formData.firstName);
    const formattedLastName = capitalizeName(formData.lastName);

    try {
      const res = await fetchWithAuth('/api/v1/queue', {
        method: 'POST',
        body: JSON.stringify({
          firstName: formattedFirstName,
          lastName: formattedLastName,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error(`Failed to add to queue: ${errorText}`);
        setIsSubmitting(false);
        return;
      }

      setFormData({ firstName: '', lastName: '' });
      setFormError('');
      setShowModal(false);
      toast.success('Added to queue successfully!');
      fetchQueue();
    } catch (err) {
      console.error('Failed to add to queue:', err);
      toast.error('An error occurred while adding to the queue.');
    } finally {
      setIsSubmitting(false);
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
      setActiveActionIndex(null);
      fetchQueue();
    } catch (err) {
      console.error('Failed to remove from queue:', err);
      toast.error('An error occurred while removing from queue.', { id: toastId });
    }
  };

  const handlePageClick = (page) => setCurrentPage(page);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQueue = Array.isArray(queue) ? queue.slice(startIndex, startIndex + itemsPerPage) : [];
  const totalPages = Math.ceil(queue.length / itemsPerPage);
  const isFormValid = formData.firstName && formData.lastName;

  return (
    <div className='p-6 w-full h-full m-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Queue management</h2>
        <button
          onClick={() => setShowModal(true)}
          className='bg-blue-600 text-white w-[174px] h-[44px] rounded-[8px] hover:bg-blue-700 flex items-center justify-center gap-3'
        >
          <img src='/image/whiteplus.png' height={20} width={20}/>
          <h1 className='text-[14px]'>
            Add to queue
          </h1>
        </button>
      </div>

      {/* Display loading spinner if data is being fetched */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <div className='overflow-x-auto  rounded-xl border-[0.8px] border-[#E4E4E4] bg-[#FFFFFF] '>
          <table className='min-w-full table-auto text-sm'>
            <thead>
              <tr className='border-b'>
                <th className=' p-4  text-center'>S/N</th>
                <th className=' text-center p-4'>First name</th>
                <th className=' text-center p-4'>Last name</th>
                <th className=' text-center p-4'>Time</th>
                <th className='text-center p-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQueue.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#FAFAFA]' : ''}`}>
                  <td className='p-4  text-center'>{startIndex + index + 1}</td> 
                  <td className='p-4 text-center'>{item.firstName}</td>
                  <td className='p-4  text-center'>{item.lastName}</td>
                  <td className='p-4 text-center'>
                    {new Date(item.timeAdded).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }).toUpperCase()}
                  </td>
                  <td className='p-4 relative flex justify-center items-center'>
                    <button
                      onClick={() => setActiveActionIndex((prev) => (prev === index ? null : index))}
                      className='text-gray-700 hover:text-black p-1 cursor-pointer rounded-full'
                      ref={(el) => (actionButtonRefs.current[index] = el)}
                    >
                      <img src="/image/More circle.png" alt="img" height={20} width={20}/>
                    </button>

                    {activeActionIndex === index && (
                      <div
                        ref={(el) => (dropdownRefs.current[index] = el)}
                        className='absolute top-0 right-0 bg-white shadow-lg rounded-lg w-48 z-10'
                      >
                        <button
                          onClick={() => {
                            setActiveActionIndex(null);
                            toast.success('Files forwarded successfully');
                          }}
                          className='w-full text-left px-4 py-1 hover:bg-gray-100'
                        >
                          Forward patient files
                        </button>
                        <button
                          onClick={() => handleRemoveFromQueue(item.id)}
                          className='w-full text-left px-4 py-1 text-red-600 hover:bg-red-50'
                        >
                          Remove from queue
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className='mt-4 flex justify-between items-center text-sm text-gray-600 mb-5'>
        <button
          onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
           className="h-[36px] w-[100px] border-[#D3D3D3] shadow-xs border-[1px] cursor-pointer rounded-[8px] bg-white"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className='flex gap-1'>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageClick(i + 1)}
              className={`px-3 py-1 border rounded-md ${currentPage === i + 1 ? 'bg-[#EBEBEB] text-[#242424]' : 'bg-[#FAFAFA] text-gray-600'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
           className="h-[36px] w-[100px] border-[#D3D3D3] shadow-xs border-[1px] cursor-pointer rounded-[8px] bg-white"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-[#0C162F99] flex items-center justify-center z-50'>
          <div className='bg-white rounded-[12px] w-[80%] md:w-[500px]'>
            <div className='h-[64px] w-full border-b-[0.8px] border-[#F0F2F5] rounded-t-[12px] flex items-center pl-6' >
              <h2 className='text-lg font-bold '>Add to Queue</h2>
            </div>
            <div className='h-[190px] w-[90%] m-auto flex flex-col items-center justify-center '>
              <label className=' w-full mb-1 mt-2 font-medium text-[14px]'>
                First Name
              </label>
              <input
                type='text'
                placeholder='First name'
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className='w-full mb-3 p-2 border-[1px] rounded-[12px] border-[#D0D5DD] h-[52px] outline-none'
              />
              <label className=' w-full mb-1 mt-1 font-medium text-[14px]'>
                Last Name
              </label>
              <input
                type='text'
                placeholder='Last name'
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className='w-full mb-3 p-2 border-[1px] rounded-[12px] border-[#D0D5DD] h-[52px] outline-none'
              />
            </div>
            {formError && <p className='text-red-600 text-sm'>{formError}</p>}
            <div className='flex justify-end items-center gap-3 pr-4  h-[55px] rounded-b-[12px] border-t-[0.8px] border-[#F0F2F5] '>
              <button
                onClick={() => setShowModal(false)}
                className='h-[70%] p-2 text-sm w-[60px] rounded-[8px] text-gray-600 bg-gray-100 '
              >
                Cancel
              </button>
              <button
                onClick={handleAddToQueue}
                disabled={!isFormValid || isSubmitting}
                className={`h-[70%] w-[190px] p-2 text-sm text-white rounded-[8px] ${isFormValid && !isSubmitting ? 'bg-[#3B6FED]' : 'bg-gray-400'}`}
              >
                {isSubmitting ? 'Adding...' : 'Add to queue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueManagement;
