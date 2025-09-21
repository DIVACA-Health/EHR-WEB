'use client';
import React, { useState, useEffect, useRef } from 'react';
import nurseprescription from './nurseprescription';

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
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [instructionsText, setInstructionsText] = useState('');

  // Sidebar state for health issue
  const [showPrescriptionSidebar, setShowPrescriptionSidebar] = useState(false);

  // Collapsible sections for sidebar
  const [openTestSection, setOpenTestSection] = useState(true);
  const [openDoctorSection, setOpenDoctorSection] = useState(true);

  // Form fields for sidebar
  const [test, setTest] = useState('');
  const [labResultFile, setLabResultFile] = useState(null);
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: ''
  });
  const [diagnosis, setDiagnosis] = useState('');
  const [description, setDescription] = useState('');
  const [possibleCause, setPossibleCause] = useState('');
  const [medications, setMedications] = useState([
    { medication: '', dosage: '', frequency: '', instructions: '' }
  ]);
  const [followUp, setFollowUp] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [type, setType] = useState('EMERGENCY');
  const [isSavingHealthIssue, setIsSavingHealthIssue] = useState(false);

  // Medication handlers
  const handleMedicationChange = (idx, field, value) => {
    setMedications(prev =>
      prev.map((med, i) => (i === idx ? { ...med, [field]: value } : med))
    );
  };
  const addMedication = () => setMedications(prev => [...prev, { medication: '', dosage: '', frequency: '', instructions: '' }]);
  const removeMedication = idx => setMedications(prev => prev.filter((_, i) => i !== idx));

  // File upload (not sent in payload, just for UI)
  const handleLabResultChange = (e) => {
    setLabResultFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetchWithAuth(`/api/v1/health-records/student/${studentId}/summary`);
        const data = await res.json();
        setSummary(data.data || null);
      } catch (err) {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [studentId]);

  const handleRowClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setShowSidebar(true);
  };

  // Helper to format date as "YYYY-MM-DD" or a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handler for saving new health issue

const handleNewHealthIssueSubmit = async (e) => {
  e.preventDefault();
  setIsSavingHealthIssue(true);
  try {
    const token = localStorage.getItem('access_token');
    const payload = {
      studentId,
      type: type || '', // always present
      testResults: [
        {
          testType: test || '',
          result: description || '',
          normalRange: possibleCause || ''
        }
      ],
      vitalSigns: {
        bloodPressure: vitalSigns.bloodPressure || '',
        heartRate: vitalSigns.heartRate ? Number(vitalSigns.heartRate) : '',
        temperature: vitalSigns.temperature ? Number(vitalSigns.temperature) : ''
      },
      diagnosis: diagnosis || '',
      medications: medications.length > 0 ? medications.map(med => ({
        medication: med.medication || '',
        dosage: med.dosage || '',
        frequency: med.frequency || '',
        instructions: med.instructions || ''
      })) : [{
        medication: '',
        dosage: '',
        frequency: '',
        instructions: ''
      }],
      followUpDate: followUpDate || ''
    };
    const res = await fetch('/api/v1/health-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setShowPrescriptionSidebar(false);
      setTest('');
      setLabResultFile(null);
      setVitalSigns({ bloodPressure: '', heartRate: '', temperature: '' });
      setDiagnosis('');
      setDescription('');
      setPossibleCause('');
      setMedications([{ medication: '', dosage: '', frequency: '', instructions: '' }]);
      setFollowUp('');
      setNotes('');
      setFollowUpDate('');
      setType('EMERGENCY');
    } else {
      alert('Failed to save health issue');
    }
  } catch (err) {
    alert('Error saving health issue');
  } finally {
    setIsSavingHealthIssue(false);
  }
};

  const getTodayDate = () => {
  const d = new Date();
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
        {/* <button
          className="bg-blue-600 flex gap-[8px] w-fit h-[44px] px-2 items-center justify-center text-white rounded-[8px]"
          onClick={() => setShowPrescriptionSidebar(true)}
        >
          <img src="/image/Plus.png" alt="icon" width={25} height={25} />
          <h1 className="text-[14px]">Record Health issue</h1>
        </button> */}
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
                    className="odd:bg-white even:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(activity)}
                  >
                    <td className="px-6 py-4 text-center">{getTodayDate(activity.date)}</td>
                    <td className="px-6 py-4 text-center">{activity.recordedBy?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">{activity.diagnosis || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      {summary.currentMedications && summary.currentMedications[0]?.instructions || 'N/A'}
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
                            onClick={() => {/* handleForwardFiles(activity.id); */}}
                            className='w-full text-left px-4 py-1 hover:bg-gray-100'
                          >
                            Forward patient files
                          </button>
                          <button
                            onClick={() => {/* handleRemoveFromQueue(activity.id); */}}
                            className='w-full text-left px-4 py-1 text-red-600 hover:bg-red-50'
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
            ) : null}
          </tbody>
        </table>

        {showSidebar && selectedDiagnosis && (
          <div
            className="fixed inset-0 z-40 bg-[#0C162F99]"
            onClick={() => setShowSidebar(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex  justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
                <div className='flex flex-col gap-2'>
                  <h2>Date : {selectedDiagnosis ? formatDate(selectedDiagnosis.date) : ''}</h2>
                  <h2> Doctor : Dr. {selectedDiagnosis ? selectedDiagnosis.recordedBy.name : ''}</h2>
                </div>
                <button onClick={() => setShowSidebar(false)} className="text-xl">
                  ×
                </button>
              </div>

              {/* Main Content */}
              <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] ">
                <div className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px] shadow sm">
                  {/* Header */}
                  <div
                    className="px-4 py-3 cursor-pointer flex justify-between rounded-[8px] items-center bg-[rgba(243,246,255,1)]"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="font-medium text-sm">Diagnosis details</span>
                    <span className="text-lg transform transition-transform duration-300 ">
                      {isOpen ? '▾' : '▸'}
                    </span>
                  </div>
                  {/* Collapsible content */}
                  {isOpen && (
                    <div className="divide-y text-sm pl-4 pr-4 pt-2 pb-2 rounded-b-[12px]">
                      <div className="flex justify-between px-4 py-3">
                        <span>Test</span>
                        <span className="text-gray-700 font-medium">{selectedDiagnosis.diagnosis || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span>Blood Pressure</span>
                        <span className="text-gray-700 font-medium">{selectedDiagnosis.type || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span>Heart rate</span>
                        <span className="text-gray-700 font-medium">{formatDate(selectedDiagnosis.date)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span>Lab result</span>
                        <span className="text-gray-700 font-medium">{formatDate(selectedDiagnosis.date)}</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Medication details */}
                <div className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px] shadow-sm">
                  <div className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] rounded-b-[5px] items-center bg-[rgba(243,246,255,1)]" onClick={() => setIsOpen1(!isOpen1)}>
                    <span className="font-medium text-sm">Medication details</span>
                    <span className="text-lg transform transition-transform duration-300">
                      {isOpen1 ? '▾' : '▸'}
                    </span>
                  </div>
                    {isOpen1 && (
                      <div className="divide-y text-sm pl-4 pr-4 pt-2 pb-2 rounded-b-[8px]">
                        {summary?.currentMedications && summary.currentMedications.length > 0 ? (
                          (() => {
                            const med = summary.currentMedications[0];
                            return (
                              <div>
                                <div className="flex justify-between px-4 py-3">
                                  <span>Diagnosis</span>
                                  <span className="text-gray-700 font-medium">{med.diagnosis || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 w-[97%]">
                                  <span className="flex justify-between px-4 py-3">Description</span>
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
                                <div className="flex justify-between px-4 py-3">
                                  <span>Possible cause</span>
                                  <span className="text-gray-700 font-medium">{med.medication || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3">
                                  <span>Medication</span>
                                  <span className="text-gray-700 font-medium">{med.medication || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3">
                                  <span>Dosage</span>
                                  <span className="text-gray-700 font-medium">{med.dosage || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3">
                                  <span>Follow up</span>
                                  <span className="text-gray-700 font-medium">{med.medication || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3">
                                  <span>Notes</span>
                                  <span className="text-gray-700 font-medium">{med.instructions || 'N/A'}</span>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="px-4 py-3 text-gray-500">No medication details available.</div>
                        )}
                      </div>
                    )}
                </div>
              </div>
              {/* Footer */}
              <div className='min-h-[8%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-t-sm'>
                <button
                  type='submit'
                  className="bg-blue-600 text-white py-2 px-4 rounded w-4/10"
                >
                  Download Health Records
                </button>
              </div>
            </div>
          </div>
        )}

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
              <h2 className="text-lg font-semibold mb-4 text-center">Description</h2>
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

        {/* Sidebar for creating a new health issue */}
        {showPrescriptionSidebar && (
          <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowPrescriptionSidebar(false)}>
            <div
              className="absolute right-0 top-0 h-full w-[55%] bg-[#FBFBFB] shadow-lg z-50 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold">Record health issue</h2>
                <button onClick={() => setShowPrescriptionSidebar(false)} className="text-xl">×</button>
              </div>
              <form
                className="flex-1 overflow-y-auto flex flex-col pl-7 pr-7 gap-[18px] py-4"
                onSubmit={handleNewHealthIssueSubmit}
              >
                {/* Collapsible: Test & vitals results */}
                <div className="border-b pb-4  mb-5 mt-3">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setOpenTestSection((v) => !v)}
                  >
                    <h3 className="font-medium text-lg mb-2">Test & vitals results</h3>
                    <span className="text-lg">{openTestSection ? '▾' : '▸'}</span>
                  </div>
                  {openTestSection && (
                    <>
                      <label className="block mb-1 text-sm">Test</label>
                      <input
                        type="text"
                        placeholder="Enter test carried out"
                        className="w-full bg-[#FFFFFF] outline-none border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-black mb-3"
                        value={test}
                        onChange={e => setTest(e.target.value)}
                      />
                      <label className="block mb-1 text-sm">Lab results</label>
                      <div className="flex items-center gap-3 mb-3">
                        <label className="flex flex-col items-center justify-center w-full h-[48px] border border-dashed border-[#D0D5DD] rounded-[12px] cursor-pointer bg-[#F9FAFB]">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleLabResultChange}
                          />
                          <span className="text-[#3B6FED] text-sm flex items-center gap-2">
                            <img src="/image/Cloudupload.png" alt="upload" className="w-5 h-5" />
                            {labResultFile ? labResultFile.name : 'Upload lab result'}
                          </span>
                        </label>
                      </div>

                    </>
                  )}
                </div>

                {/* Collapsible: Doctor's notes & treatment plan */}
                <div className="border-b pb-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setOpenDoctorSection((v) => !v)}
                  >
                    <h3 className="font-medium text-lg mb-4">Doctor's notes & treatment plan</h3>
                    <span className="text-lg">{openDoctorSection ? '▾' : '▸'}</span>
                  </div>
                  {openDoctorSection && (
                    <>
                      <label className="block mb-1 text-sm">Diagnosis</label>
                      <input
                        type="text"
                        placeholder="Enter diagnosis"
                        className="w-full bg-[#FFFFFF] outline-none border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-black mb-3"
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                      />
                      <label className="block mb-1 text-sm">Description</label>
                      <input
                        type="text"
                        placeholder="Enter diagnosis description"
                        className="w-full bg-[#FFFFFF] outline-none border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-black mb-3"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                      />
                      <label className="block mb-1 text-sm">Possible cause</label>
                      <input
                        type="text"
                        placeholder="Enter possible cause"
                        className="w-full bg-[#FFFFFF] outline-none border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-black mb-3"
                        value={possibleCause}
                        onChange={e => setPossibleCause(e.target.value)}
                      />
                      <label className="flex items-center justify-between mb-1 text-sm">
                        Medication
                          <button
                            type="button"
                            className="flex gap-2 text-[#3B6FED] items-center"
                            onClick={addMedication}
                          >
                            <img src="/image/Plus{BLUE}.png" width={24} height={24} alt="icon" />
                            Add medication
                          </button>
                      </label>
                      {medications.map((med, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-3 relative ">
                          <input
                            type="text"
                            placeholder="Enter medication"
                            className="w-full bg-[#FFFFFF] outline-none border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-black"
                            value={med.medication}
                            onChange={e => handleMedicationChange(idx, 'medication', e.target.value)}
                          />

                          {medications.length > 1 && (
                            <button
                              type="button"
                              className="absolute right-[-30px] text-red-500"
                              onClick={() => removeMedication(idx)}
                            >×</button>
                          )}
                        </div>
                      ))}
                      <label className="block mb-1 text-sm">Dosage</label>
                      <input
                        type="text"
                        placeholder="Enter medication dosage"
                        className="w-full bg-[#FFFFFF] outline-none border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-black mb-3"
                        value={medications[0]?.dosage}
                        onChange={e => handleMedicationChange(0, 'dosage', e.target.value)}
                      />
                      <label className="block mb-1 text-sm">Follow-up</label>
                      <input
                        type="text"
                        placeholder="Give a follow-up"
                        className="w-full bg-[#FFFFFF] outline-none border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-black mb-3"
                        value={followUp}
                        onChange={e => setFollowUp(e.target.value)}
                      />
                      <label className="block mb-1 text-sm">Notes</label>
                      <input
                        type="text"
                        placeholder="Give notes if needed"
                        className="w-full bg-[#FFFFFF] outline-none border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 mb-3 shadow-xs text-black"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                      />
                    </>
                  )}
                </div>

                <div className='min-h-[8%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-t-sm mt-4'>
                  <button
                    type='submit'
                    className="bg-[#6C5DD3] text-white py-2 px-6 rounded w-fit mt-3 text-[16px] font-medium"
                    disabled={isSavingHealthIssue}
                  >
                    {isSavingHealthIssue ? 'Saving...' : 'Save health issue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default NurseHealthHistory;