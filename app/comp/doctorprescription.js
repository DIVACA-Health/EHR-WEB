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
      throw new Error('Unauthorized: Invalid or expired token.');
    }
    return res;
  } catch (error) {
    throw error;
  }
};

const DoctorPrescription = ({ studentId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const [activeActionIndex, setActiveActionIndex] = useState(null);
  const actionButtonRefs = useRef({});
  const dropdownRefs = useRef({});
  const [loading, setLoading] = useState(true);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [instructionsText, setInstructionsText] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetchWithAuth(`/api/v1/prescriptions/student/${studentId}`);
        const data = await res.json();
        setPrescriptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [studentId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionIndex !== null) {
        const dropdown = dropdownRefs.current[activeActionIndex];
        const button = actionButtonRefs.current[activeActionIndex];
        if (
          dropdown &&
          !dropdown.contains(event.target) &&
          button &&
          !button.contains(event.target)
        ) {
          setActiveActionIndex(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeActionIndex]);

  const handleRowClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowSidebar(true);
    setIsOpen1(true); // Open prescription details by default
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="border-[rgba(235,235,235,1)] shadow-sm rounded-t-[12px]">
      <div className="h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] rounded-t-[12px] border-[rgba(235,235,235,1)] shadow-xs">
        <div className="flex gap-3 items-center">
          <img src="/image/Frame 1261158734.png" alt="icon" height={36} width={36} />
          <h1 className="font-medium text-lg">Prescription history</h1>
        </div>
      </div>
      <div className="overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-[12px] font-normal">
              <th className="px-4 py-4 text-center">Date of visit</th>
              <th className="px-4 py-4 text-center">Last dose date</th>
              <th className="px-4 py-4 text-center">Prescribed by</th>
              <th className="px-4 py-4 text-center">Medication</th>
              <th className="px-4 py-4 text-center">Dosage</th>
              <th className="px-4 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[14px]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  Loading prescriptions...
                </td>
              </tr>
            ) : prescriptions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <img src="/image/empty-state.png" alt="No data" className="w-20 h-20 mb-2 opacity-60" />
                    <span className="text-lg font-medium">No Prescription History available</span>
                    <span className="text-sm text-gray-400">
                      There are no prescriptions or health records for this student yet.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              prescriptions.map((item, index) => (
                <tr
                  key={item.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  <td className="px-6 py-4 text-center">{formatDate(item.prescribedDate)}</td>
                  <td className="px-6 py-4 text-center">
                    {item.expiryDate ? formatDate(item.expiryDate) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.doctor ? `Dr ${item.doctor.firstName} ${item.doctor.lastName}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">{item.medication || 'N/A'}</td>
                  <td className="px-6 py-4 text-center">{item.dosage || 'N/A'}</td>
                  <td className="p-4 relative">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionIndex((prev) => (prev === index ? null : index));
                        }}
                        className="text-gray-700 hover:text-black p-1 cursor-pointer rounded-full hover:bg-gray-100"
                        ref={(el) => (actionButtonRefs.current[index] = el)}
                      >
                        <img src="/image/More circle.png" alt="img" height={20} width={20} />
                      </button>
                      {activeActionIndex === index && (
                        <div
                          ref={(el) => (dropdownRefs.current[index] = el)}
                          className="absolute top-full right-4 mt-1 bg-white shadow-lg rounded-lg w-48 z-10 text-left border border-gray-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleRowClick(item)}
                            className="w-full text-left px-4 py-3  hover:bg-red-50 rounded-b-lg"
                          >
                            View Prescription
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Sidebar */}
        {showSidebar && selectedPrescription && (
          <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowSidebar(false)}>
            <div
              className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 py-4 border-b-[1px] border-gray-200 shadow-sm">
                <div className="flex flex-col w-auto gap-2">
                  <div className="w-full flex justify-between gap-[17px]">
                    <h2 className="font-medium">
                      Date of Visit: {formatDate(selectedPrescription.prescribedDate)}
                    </h2>
                    <h2 className="font-medium">
                      Last dose date:{' '}
                      {selectedPrescription.expiryDate
                        ? formatDate(selectedPrescription.expiryDate)
                        : 'N/A'}
                    </h2>
                  </div>
                  <h2 className="text-gray-700">
                    Prescribed by:{' '}
                    {selectedPrescription.doctor
                      ? `Dr ${selectedPrescription.doctor.firstName} ${selectedPrescription.doctor.lastName}`
                      : 'N/A'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-3xl text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] py-5">
                <div className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                  {/* Prescription details header */}
                  <div
                    className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                    onClick={() => setIsOpen1(!isOpen1)}
                  >
                    <span className="font-medium text-sm">Prescription details</span>
                    <span className="text-lg transform transition-transform duration-300">
                      {isOpen1 ? '▾' : '▸'}
                    </span>
                  </div>

                  {/* Collapsible content */}
                  {isOpen1 && (
                    <div className="text-sm pl-4 pr-4 pt-2 pb-2 rounded-b-[8px] bg-white">
                      <div className="border-b last:border-b-0">
                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-700">Medication</span>
                          <span className="font-medium text-gray-900">
                            {selectedPrescription.medication || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-700">Dosage</span>
                          <span className="font-medium text-gray-900">
                            {selectedPrescription.dosage || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-700">Instructions</span>
                          {selectedPrescription.instructions ? (
                            <button
                              className="text-blue-600 font-medium hover:underline"
                              type="button"
                              onClick={() => {
                                setInstructionsText(selectedPrescription.instructions);
                                setShowInstructionsModal(true);
                              }}
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="min-h-[7%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-t-sm py-3">
                <button
                  type="button"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={() => {
                    console.log('Download health records for:', selectedPrescription.id);
                  }}
                >
                  Download Health Records
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Modal */}
          {showInstructionsModal && (
            <div className="fixed inset-0 z-50 bg-[#0C162F99] bg-opacity-50 flex items-center justify-center" onClick={() => setShowInstructionsModal(false)}>
              <div className="bg-white rounded-[12px]  max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <div className='border-[1px] rounded-t-[12px]  border-[#F0F2F5]  flex items-center justify-center p-4'>
                  <h3 className="text-lg font-semibold ">Instructions</h3>
                </div>
                <p className="text-gray-700 mb-4 py-5 px-3 ">{instructionsText}</p>
                <div className='border-[1px] rounded-b-[12px] border-[#F0F2F5] bg-white flex items-center justify-end p-4'>
                  <button 
                    onClick={() => setShowInstructionsModal(false)}
                    className="bg-blue-600 text-white px-10 py-2 rounded-[8px] hover:bg-blue-700"
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

export default DoctorPrescription;