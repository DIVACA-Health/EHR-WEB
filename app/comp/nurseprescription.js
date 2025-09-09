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

const nurseprescription = ({ studentId }) => {
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
        setPrescriptions([]);
      } finally {
        setLoading(false); 
      }
    };
    fetchPrescriptions();
  }, [studentId]);

  const handleRowClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowSidebar(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className=' border-[rgba(235,235,235,1)] shadow-sm rounded-t-[12px]'>
        <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] rounded-t-[12px] border-[rgba(235,235,235,1)] shadow-xs   '>
            <div className='flex gap-3 items-center'>
                <img src='/image/Frame 1261158734.png' alt='icon' height={36} width={36} />
                <h1 className='font-medium text-lg'>Prescription history</h1>
            </div>
        </div>
        <div className="overflow-x-auto  border border-gray-200 ">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr className="text-[12px] font-normal">
                <th className="px-4 py-4 text-center">Date of visit</th>
                <th className="px-4 py-4 text-center">Last dose date</th>
                <th className="px-4 py-4 text-center">Prescribed by</th>
                <th className="px-4 py-4 text-center">Medication 1</th>
                <th className="px-4 py-4 text-center">Dosage</th>
                <th className="px-4 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-[14px]">
              {prescriptions.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <img src="/image/empty-state.png" alt="No data" className="w-20 h-20 mb-2 opacity-60" />
                      <span className="text-lg font-medium">No Presciption History available</span>
                      <span className="text-sm text-gray-400">There are no prescriptions or health records for this student yet.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                prescriptions.map((item, index) => (
                  <tr
                    key={item.id}
                    className="odd:bg-white even:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="px-6 py-4 text-center">{formatDate(item.prescribedDate)}</td>
                    <td className="px-6 py-4 text-center">{item.expiryDate ? formatDate(item.expiryDate) : 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      {item.doctor
                        ? `Dr ${item.doctor.firstName} ${item.doctor.lastName}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.medications && item.medications.length > 0
                        ? item.medications[0].medication
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.medications && item.medications.length > 0
                        ? item.medications[0].dosage
                        : 'N/A'}
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
                            onClick={() => {
                              // handleForwardFiles(item.id);
                            }}
                            className='w-full text-left px-4 py-1 hover:bg-gray-100'
                          >
                            Forward patient files
                          </button>
                          <button
                            onClick={() => {
                              // handleRemoveFromQueue(item.id);
                            }}
                            className='w-full text-left px-4 py-1 text-red-600 hover:bg-red-50'
                          >
                            Remove from queue
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {showSidebar && selectedPrescription && (
            <div
              className="fixed inset-0 z-40 bg-[#0C162F99]"
              onClick={() => setShowSidebar(false)}
            >
              <div
                className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-5 border-gray-200 shadow-sm">
                  <div className='flex flex-col w-auto'>
                    <div className='w-full flex justify-between gap-[17px]'>
                      <h2>Date of Visit: {formatDate(selectedPrescription.prescribedDate)}</h2>
                      <h2>Last dose date: {selectedPrescription.expiryDate ? formatDate(selectedPrescription.expiryDate) : 'N/A'}</h2>
                    </div>
                    <h2>
                      Prescribed by: {selectedPrescription.doctor ? `Dr ${selectedPrescription.doctor.firstName} ${selectedPrescription.doctor.lastName}` : 'N/A'}
                    </h2>
                  </div>
                  <button onClick={() => setShowSidebar(false)} className="text-xl">
                    ×
                  </button>
                </div>
                <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] ">
                  <div className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                    {/* Prescription details header */}
                    <div
                      className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] rounded-b-[5px] items-center bg-[rgba(243,246,255,1)]"
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
                        {selectedPrescription.medications && selectedPrescription.medications.length > 0 ? (
                          selectedPrescription.medications.map((med, idx) => (
                            <div key={idx} className="border-b last:border-b-0">
                              <div className="flex justify-between items-center py-3">
                                <span className="text-gray-700">Medication {idx + 1}</span>
                                <span className="font-medium text-gray-900">{med.medication || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center py-3">
                                <span className="text-gray-700">Dosage</span>
                                <span className="font-medium text-gray-900">{med.dosage || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center py-3">
                                <span className="text-gray-700">Instructions</span>
                                {med.instructions ? (
                                  <button
                                    className="text-blue-600 font-medium hover:underline"
                                    type="button"
                                    onClick={() => {
                                      setInstructionsText(med.instructions);
                                      setShowInstructionsModal(true);
                                    }}
                                  >
                                    View
                                  </button>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </div>
                              <div className="flex justify-between items-center py-3">
                                <span className="text-gray-700">Medication 2 </span>
                                <span className="font-medium text-gray-900">{med.medication || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center py-3">
                                <span className="text-gray-700">Dosage 2</span>
                                <span className="font-medium text-gray-900">{med.dosage || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center py-3">
                                <span className="text-gray-700">Instructions 2</span>
                                {med.instructions ? (
                                  <button
                                    className="text-blue-600 font-medium hover:underline"
                                    type="button"
                                    onClick={() => {
                                      setInstructionsText(med.instructions);
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
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500">No medication details available.</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                </div>
                {/* Footer */}
                <div className='min-h-[7%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-t-sm'>
                  <button
                    type='submit'
                    className="bg-blue-600 text-white py-2 px-4 rounded w-4/10 "
                  >
                    Download Health Records
                  </button>
                </div>

                {/* Instructions Modal */}
                {showInstructionsModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C162F99]" onClick={() => setShowInstructionsModal(false)}>
                    <div
                      className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700"
                        onClick={() => setShowInstructionsModal(false)}
                      >
                        ×
                      </button>
                      <h2 className="text-lg font-semibold mb-4 text-center">Instructions</h2>
                      <div className="mb-6 whitespace-pre-line text-gray-700 text-center">{instructionsText}</div>
                      <div className="flex justify-center">
                        <button
                          className="bg-blue-600 text-white px-6 py-2 rounded"
                          onClick={() => setShowInstructionsModal(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
    </div>
  )
}

export default nurseprescription