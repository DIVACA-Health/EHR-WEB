'use client';
import React, { useState, useEffect, useRef } from 'react';

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

const NurseHealthHistory = ({ studentId }) => {
  const [summary, setSummary] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [activeActionIndex, setActiveActionIndex] = useState(null);
  const actionButtonRefs = useRef({});
  const dropdownRefs = useRef({});
  const [loading, setLoading] = useState(true);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');
  const [showCauseModal, setShowCauseModal] = useState(false);
  const [causeText, setCauseText] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetchWithAuth(`/api/v1/health-records/student/${studentId}/summary`);
        const data = await res.json();
        console.log('API Response:', data); // Debug log
        setSummary(data.data || null);
      } catch (err) {
        console.error('Error fetching summary:', err);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) {
      fetchSummary();
    }
  }, [studentId]);

  const handleRowClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setShowSidebar(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTodayDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className='border-[rgba(235,235,235,1)] shadow-sm rounded-t-[12px]'>
      <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] rounded-t-[12px] border-[rgba(235,235,235,1)] shadow-xs'>
        <div className='flex gap-3 items-center'>
          <img src='/image/healthicon.png' alt='icon' height={36} width={36} />
          <h1 className='font-medium text-lg'>Health history</h1>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-left rounded-[8px]">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-[12px] font-normal">
              <th className="px-4 py-4 text-center">Date</th>
              <th className="px-4 py-4 text-center">Doctor</th>
              <th className="px-4 py-4 text-center">Diagnosis</th>
              <th className="px-4 py-4 text-center">Status</th>
              <th className="px-4 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[14px]">
            {summary && summary.recentActivity && summary.recentActivity.length > 0 ? (
              <>
                {summary.recentActivity.map((activity, index) => (
                  <tr
                    key={activity.id}
                    className="odd:bg-white even:bg-gray-50 cursor-pointer hover:bg-blue-50"
                    onClick={() => handleRowClick(activity)}
                  >
                    <td className="px-6 py-4 text-center">{getTodayDate(activity.date)}</td>
                    <td className="px-6 py-4 text-center">{activity.recordedBy?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">{activity.diagnosis || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'RESOLVED'
                            ? 'bg-green-100 text-green-700'
                            : activity.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {activity.status || 'N/A'}
                      </span>
                    </td>
                    <td className='p-4 relative flex justify-center items-center'>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setActiveActionIndex((prev) => (prev === index ? null : index));
                        }}
                        className='text-gray-700 hover:text-black p-1 cursor-pointer rounded-full'
                        ref={(el) => (actionButtonRefs.current[index] = el)}
                      >
                        <img src="/image/More circle.png" alt="img" height={20} width={20}/>
                      </button>
                      {activeActionIndex === index && (
                        <div
                          ref={(el) => (dropdownRefs.current[index] = el)}
                          className='absolute top-0 right-0 bg-white shadow-lg rounded-lg w-48 z-10 text-left'
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {/* handleForwardFiles */}}
                            className='w-full text-left px-4 py-2 hover:bg-gray-100'
                          >
                            Forward patient files
                          </button>
                          <button
                            onClick={() => {/* handleRemoveFromQueue */}}
                            className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50'
                          >
                            Remove from queue
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            ) : !loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <img src="/image/empty-state.png" alt="No data" className="w-20 h-20 mb-2 opacity-60" />
                    <span className="text-lg font-medium">No health history available</span>
                    <span className="text-sm text-gray-400">There are no health records for this student yet.</span>
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Sidebar for viewing selected diagnosis */}
        {showSidebar && selectedDiagnosis && (
          <div
            className="fixed inset-0 z-40 bg-[#0C162F99]"
            onClick={() => setShowSidebar(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm sticky top-0 bg-white z-10">
                <div className='flex flex-col gap-2'>
                  <h2 className="text-lg font-semibold">{selectedDiagnosis.diagnosis}</h2>
                  <div className="text-sm text-gray-600">
                    <p>Date: {formatDate(selectedDiagnosis.date)}</p>
                    <p>Doctor: {selectedDiagnosis.recordedBy?.name || 'N/A'}</p>
                  </div>
                </div>
                <button onClick={() => setShowSidebar(false)} className="text-2xl text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>

              {/* Main Content */}
              <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] pb-6">
                {/* Diagnosis Details */}
                <div className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                  <div
                    className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="font-medium text-sm">Diagnosis details</span>
                    <span className="text-lg transform transition-transform duration-300">
                      {isOpen ? '▾' : '▸'}
                    </span>
                  </div>
                  {isOpen && (
                    <div className="text-sm bg-white rounded-b-[8px]">
                      <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                        <span className="text-gray-700">Diagnosis</span>
                        <span className="font-medium text-gray-900">{selectedDiagnosis.diagnosis || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                        <span className="text-gray-700">Description</span>
                        {selectedDiagnosis.description ? (
                          <button
                            className="text-blue-600 font-medium hover:underline"
                            type="button"
                            onClick={() => {
                              setDescriptionText(selectedDiagnosis.description);
                              setShowDescriptionModal(true);
                            }}
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                        <span className="text-gray-700">Possible Cause</span>
                        {selectedDiagnosis.possibleCause ? (
                          <button
                            className="text-blue-600 font-medium hover:underline"
                            type="button"
                            onClick={() => {
                              setCauseText(selectedDiagnosis.possibleCause);
                              setShowCauseModal(true);
                            }}
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                      <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                        <span className="text-gray-700">Status</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedDiagnosis.status === 'RESOLVED'
                              ? 'bg-green-100 text-green-700'
                              : selectedDiagnosis.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {selectedDiagnosis.status || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-gray-700">Date</span>
                        <span className="font-medium text-gray-900">{formatDate(selectedDiagnosis.date)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recorded By Section */}
                <div className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                  <div
                    className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                    onClick={() => setIsOpen1(!isOpen1)}
                  >
                    <span className="font-medium text-sm">Recorded by</span>
                    <span className="text-lg transform transition-transform duration-300">
                      {isOpen1 ? '▾' : '▸'}
                    </span>
                  </div>
                  {isOpen1 && (
                    <div className="text-sm bg-white rounded-b-[8px]">
                      <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                        <span className="text-gray-700">Name</span>
                        <span className="font-medium text-gray-900">
                          {selectedDiagnosis.recordedBy?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-gray-700">Role</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {selectedDiagnosis.recordedBy?.role || 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className='min-h-[8%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-t-sm sticky bottom-0 bg-white'>
                <button
                  type='button'
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Download Health Records
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Description Modal */}
        {showDescriptionModal && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" 
            onClick={() => setShowDescriptionModal(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full relative" 
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDescriptionModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
              >
                ✕
              </button>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-center mb-6">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 text-left whitespace-pre-line">
                  {descriptionText}
                </p>
                <button 
                  onClick={() => setShowDescriptionModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Possible Cause Modal */}
        {showCauseModal && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" 
            onClick={() => setShowCauseModal(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full relative" 
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCauseModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
              >
                ✕
              </button>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-center mb-6">Possible Cause</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 text-left whitespace-pre-line">
                  {causeText}
                </p>
                <button 
                  onClick={() => setShowCauseModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseHealthHistory;