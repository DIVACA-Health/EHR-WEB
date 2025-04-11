'use client';
import React, { useState, useEffect } from 'react';

const QueueManagement = () => {
  const [queue, setQueue] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', time: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionIndex, setActiveActionIndex] = useState(null);
  const [formError, setFormError] = useState('');
  const itemsPerPage = 10;

  // Fetch mock data on load
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch('/api/queue');
        const data = await res.json();
        setQueue(data);
      } catch (err) {
        console.error('Failed to load queue:', err);
      }
    };

    fetchQueue();
  }, []);

  const handleAddToQueue = () => {
    // Validate if all fields are filled
    if (!formData.firstName || !formData.lastName || !formData.time) {
      setFormError('Please fill in all the fields.');
      return;
    }

    const formattedTime = formatTime(formData.time);
    setQueue(prev => [...prev, { ...formData, time: formattedTime }]);
    setFormData({ firstName: '', lastName: '', time: '' });
    setFormError('');
    setShowModal(false);
  };

  // Time formatting to include AM/PM
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Pagination: Calculate start and end index based on currentPage
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQueue = queue.slice(startIndex, startIndex + itemsPerPage);

  // Handle next and previous page changes
  const handleNextPage = () => {
    if (currentPage * itemsPerPage < queue.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(queue.length / itemsPerPage);

  const isFormValid = formData.firstName && formData.lastName && formData.time;

  return (
    <div className='p-6 w-full'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Queue management</h2>
        <button
          onClick={() => setShowModal(true)}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
          + Add to queue
        </button>
      </div>

      <div className='overflow-x-auto bg-white rounded-xl border border-gray-300'>
        <table className='min-w-full table-auto text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='text-left p-4'>S/N</th>
              <th className='text-left p-4'>First name</th>
              <th className='text-left p-4'>Last name</th>
              <th className='text-left p-4'>Time</th>
              <th className='text-left p-4'>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedQueue.map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                <td className='p-4'>{startIndex + index + 1}</td>
                <td className='p-4'>{item.firstName}</td>
                <td className='p-4'>{item.lastName}</td>
                <td className='p-4'>{item.time}</td>
                <td className='p-4 relative'>
                  <button
                    onClick={() =>
                      setActiveActionIndex((prev) => (prev === index ? null : index))
                    }
                    className='text-gray-700 hover:text-black p-1 rounded-full'
                  >
                    ⋮
                  </button>

                  {activeActionIndex === index && (
                    <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg w-48 z-10">
                      <button
                        onClick={() => {
                          // Add logic to forward patient files here
                          setActiveActionIndex(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Forward patient files
                      </button>
                      <button
                        onClick={() => {
                          const updatedQueue = queue.filter((_, i) => startIndex + i !== startIndex + index);
                          setQueue(updatedQueue);
                          setActiveActionIndex(null);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
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

      {/* Pagination */}
      <div className='mt-4 flex justify-between items-center text-sm text-gray-600'>
        <button
          onClick={handlePreviousPage}
          className='px-3 py-1 border rounded-md'
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className='flex gap-1'>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          className='px-3 py-1 border rounded-md'
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-[rgba(220,224,235,0.8)]  flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-xl w-[90%] md:w-[400px]'>
            <h2 className='text-lg font-bold mb-4'>Add to Queue</h2>
            <input
              type='text'
              placeholder='First name'
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className='w-full mb-3 p-2 border rounded'
            />
            <input
              type='text'
              placeholder='Last name'
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className='w-full mb-3 p-2 border rounded'
            />
            <input
              type='time'
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className='w-full mb-3 p-2 border rounded'
            />
            {/* Show error message */}
            {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
            <div className='flex justify-between mt-4'>
              <button
                onClick={handleAddToQueue}
                className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
                disabled={!isFormValid} // Disable the button if the form is not valid
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueManagement;
