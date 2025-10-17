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
    const [vitalsData, setVitalsData] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
    recorder: { firstName: '', lastName: '' }, 
  });

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

    const fetchVitals = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found!');
      return;
    }

    try {
      const response = await fetch(`/api/v1/vitals/student/${studentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data && data.length > 0) {
        const vitals = data[0];
        setVitalsData({
          heartRate: vitals.heartRate,
          bloodPressure: vitals.bloodPressure,
          temperature: vitals.temperature,
          weight: vitals.weight,
          respiratoryRate: vitals.respiratoryRate,
          oxygenSaturation: vitals.oxygenSaturation,
          recorder: vitals.recorder || { firstName: '', lastName: '' }, // Set recorder from API
        });
      } else {
        setVitalsData({
          heartRate: '',
          bloodPressure: '',
          temperature: '',
          respiratoryRate: '',
          oxygenSaturation: '',
          weight: '',
          recorder: { firstName: '', lastName: '' },
        });
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [studentId]);

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
              <th className="px-4 py-4 text-center">Notes</th>
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
                    <td className="px-6 py-4 text-center text-ellipsis truncate max-w-[250px] ">{activity.description || 'N/A'}</td>
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
                          className="absolute top-full right-4 mt-1 bg-white shadow-lg rounded-lg w-48 z-10 text-left border border-gray-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleRowClick(activity)}
                            className="w-full text-left px-4 py-3  hover:bg-red-50 rounded-b-lg"
                          >
                            View Health Issue
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
              <div className="flex justify-between items-center min-h-[10%] py-4 pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm sticky top-0 bg-[#FFFFFF] z-10">
                <div className='flex flex-col '>
                  <div className="text-sm text-gray-600 gap-2 flex flex-col">
                    <p>Date of visit: {formatDate(selectedDiagnosis.date)}</p>
                    <p>Doctor: {selectedDiagnosis.recordedBy?.name || 'N/A'}</p>
                  </div>
                </div>
                <button onClick={() => setShowSidebar(false)} className="text-2xl text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>

              {/* Main Content */}
              <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] pb-6">
                {/* VITALS Section */}
                <div className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                  <div
                    className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                    onClick={() => setIsOpen1(!isOpen1)}
                  >
                    <span className="font-medium text-sm">Vitals results</span>
                    <span className="text-lg transform transition-transform duration-300">
                      {isOpen1 ? '▾' : '▸'}
                    </span>
                  </div>
                  {isOpen1 && (
                    <div className="text-sm bg-white rounded-b-[8px]">
                      <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                        <span className="text-gray-700">Heart rate</span>
                        <span className="font-medium text-gray-900">
                          {vitalsData.heartRate || '--'}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                        <span className="text-gray-700">Blood pressure</span>
                        <span className="font-medium text-gray-900">
                          {vitalsData.bloodPressure || '--'}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                        <span className="text-gray-700">Temperature</span>
                        <span className="font-medium text-gray-900">
                          {vitalsData.temperature || '--'}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                        <span className="text-gray-700">Respiratory rate</span>
                        <span className="font-medium text-gray-900">
                          {vitalsData.respiratoryRate || '--'}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3  border-gray-200">
                        <span className="text-gray-700">Oxygen saturation</span>
                        <span className="font-medium text-gray-900">
                          {vitalsData.oxygenSaturation || '--'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {/* HEALTH ISSUE Details */}
                <div className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                  <div
                    className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="font-medium text-sm">Health issue</span>
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
                      <div className="flex justify-between items-center px-4 py-3  border-gray-200">
                        <span className="text-gray-700">Possible Cause</span>
                        <span className="font-medium text-gray-900">{selectedDiagnosis.possibleCause || 'N/A'}</span>
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
        <div className="fixed inset-0 z-50 bg-[#0C162F99] flex items-center justify-center" onClick={() => setShowDescriptionModal(false)}>
          <div className=' w-4/10 flex items-center flex-col'>
            <div className=' w-full h-10 flex items-center justify-end'>
              <img src='/image/exiticon.png' alt='Exiticon' className='h-[28px] w-[28px]'/>
            </div>
            <div className="bg-white rounded-[12px] max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className='border-[1px] rounded-t-[12px] border-[#F0F2F5] flex items-center justify-center p-4'>
                <h3 className="text-lg font-semibold">Description</h3>
              </div>
              <p className="text-gray-700 mb-4 py-5 px-3">{descriptionText}</p>
              <div className='border-[1px] rounded-b-[12px] border-[#F0F2F5] bg-white flex items-center justify-end p-4'>
                <button 
                  onClick={() => setShowDescriptionModal(false)}
                  className="bg-blue-600 text-white px-10 py-2 rounded-[8px] hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default NurseHealthHistory;
