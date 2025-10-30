'use client';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

// Map allergy types to image URLs or imports
const allergyTypeImages = {
  Medication: '/image/Group 39895.png',
  Nuts: '/image/Group 39894.png',
  Food: '/image/Group 39894 copy.png',
  Environment: '/image/Group 398941.png',
  Other: '/image/Group 398942.png'
};

const allergyTypes = [
  { label: 'Select allergy type', value: '', img: allergyTypeImages.Medication },
  { label: 'Medication', value: 'Medication', img: allergyTypeImages.Medication },
  { label: 'Nuts', value: 'Nuts', img: allergyTypeImages.Nuts },
  { label: 'Food', value: 'Food', img: allergyTypeImages.Food },
  { label: 'Environment', value: 'Environment', img: allergyTypeImages.Environment },
];

const nurseallergies = ({ studentId }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [allergyType, setAllergyType] = useState('');
  const [allergyName, setAllergyName] = useState('');
  const [severityLevel, setSeverityLevel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    allergyType: '',
    allergyName: '',
    severityLevel: '',
  });

  // For custom allergy type
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [customAllergyType, setCustomAllergyType] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // For custom severity dropdown
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);

  // Ref for the form
  const formRef = useRef(null);

  // For view sidebar
  const [showViewSidebar, setShowViewSidebar] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState(null);

  // Fetch allergies from API (extracted so other handlers can call it)
  const fetchAllergies = async () => {
    if (!studentId) return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/v1/allergies/getAllAllergies?studentId=${studentId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-cache',
      });
      if (res.ok) {
        const result = await res.json();
        setAllergies(Array.isArray(result.data) ? result.data : []);
      } else {
        setAllergies([]);
      }
    } catch (err) {
      console.error('fetchAllergies error', err);
      setAllergies([]);
    }
  };

  useEffect(() => {
    if (studentId) fetchAllergies();
  }, [studentId]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation with user feedback
    const missing = [];
    if (!allergyType) missing.push('Allergy type');
    if (!allergyName || !String(allergyName).trim()) missing.push('Allergy name');
    if (!severityLevel) missing.push('Severity level');

    if (missing.length > 0) {
      toast.error(`Please provide: ${missing.join(', ')}`);
      return;
    }

    setIsSaving(true);
    const payload = {
      allergyType,
      allergyName,
      severityLevel,
    };
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/v1/allergies/${studentId}/addAllergy/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success('Allergy saved');
        setShowSidebar(false);
        setAllergyType('');
        setAllergyName('');
        setSeverityLevel('');
        setCustomAllergyType('');
        setIsAddingCustom(false);
        await fetchAllergies(); // refresh list immediately
      } else {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          if (json?.message) toast.error(json.message);
          else toast.error(text || 'Failed to save allergy');
        } catch {
          toast.error(text || 'Failed to save allergy');
        }
      }
    } catch (err) {
      console.error('save allergy error', err);
      toast.error('Error saving allergy');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for severity color
  const getSeverityClass = (level) => {
    if (level === 'Mild') return 'border-gray-200 text-gray-700 bg-white';
    if (level === 'Moderate') return 'border-gray-200 text-gray-700 bg-white';
    if (level === 'Severe') return 'border-gray-200 text-gray-700 bg-white';
    return 'border-gray-200 text-gray-700 bg-white';
  };
  const getSeverityPillClass = (level) => {
    if (level === 'Mild') return 'border-[#2A9D8F] bg-[#E2FFFB] text-[#2A9D8F]';
    if (level === 'Moderate') return 'border-[#FCBF49] bg-[#FFF8EB] text-[#FCBF49]';
    if (level === 'Severe') return 'border-[#FF4040] bg-[#FEF0F0] text-[#FF4040]';
    return 'border-gray-300 bg-gray-100 text-gray-700';
  };

  // Get image for allergy type
  const getAllergyTypeImage = (type) => allergyTypeImages[type] || allergyTypeImages.Other;

  // Dropdown logic
  const handleTypeSelect = (type) => {
    if (type.value === 'Other') {
      setIsAddingCustom(true);
      setShowTypeDropdown(true); // keep dropdown open so user can type
      setAllergyType(''); // don't set placeholder 'Other' as final value
    } else {
      setAllergyType(type.value);
      setShowTypeDropdown(false);
      setCustomAllergyType('');
      setIsAddingCustom(false);
    }
  };

  const handleAddCustomAllergy = () => {
    if (customAllergyType.trim()) {
      setAllergyType(customAllergyType.trim()); // use actual custom value
      setShowTypeDropdown(false);
      setCustomAllergyType('');
      setIsAddingCustom(false);
    }
  };

  // Click outside handler for severity dropdown
  useEffect(() => {
    if (!showSeverityDropdown) return;
    const handleClick = (e) => {
      if (!e.target.closest('.severity-dropdown')) setShowSeverityDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSeverityDropdown]);

  // Handler for external submit button
  const handleExternalSubmit = () => {
    if (formRef.current) {
      // requestSubmit is modern; fallback to submit()
      if (typeof formRef.current.requestSubmit === 'function') formRef.current.requestSubmit();
      else formRef.current.submit();
    }
  };

  // Handler for allergy row click
  const handleRowClick = (allergy) => {
    // ensure we're in view mode when opening
    setIsEditing(false);
    setEditData({
      allergyType: allergy.allergyType || '',
      allergyName: allergy.allergyName || '',
      severityLevel: allergy.severityLevel || '',
    });
    setSelectedAllergy(allergy);
    setShowViewSidebar(true);
  };

  return (
    <div className='border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-sm rounded-[12px]'>
      <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-[#F0F2F5] shadow-sm mb-4 rounded-t-[12px] '>
        <div className='flex gap-3 items-center'>
          <img src='/image/allergiesicon.png' alt='icon' height={36} width={36} />
          <h1 className='font-medium text-lg'>Allergies</h1>
        </div>
        <button
          className='bg-blue-600 flex gap-[8px] w-[195px] h-[44px] items-center justify-center text-white rounded-[8px]'
          onClick={() => {
            setAllergyType('');
            setAllergyName('');
            setSeverityLevel('');
            setCustomAllergyType('');
            setIsAddingCustom(false);
            setShowSidebar(true);
          }}
        >
          <img src='/image/whitePlus1.png' alt='icon' width={25} height={25} />
          <h1 className='text-[14px]'>Record new allergy</h1>
        </button>
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <div className='w-[95%] m-auto flex flex-wrap justify-between gap-5'>
          {allergies.length > 0 ? (
            allergies.map((allergy, idx) => (
              <div
                key={allergy.id || idx}
                className={`flex items-center justify-between pl-4 pr-4 h-[65px] w-[45%] border-[1.5px] rounded-[12px] bg-white ${getSeverityClass(allergy.severityLevel)}`}
                onClick={() => handleRowClick(allergy)}
                style={{ cursor: 'pointer' }}
              >
                <div className='flex items-center gap-2'>
                  <img
                    src={getAllergyTypeImage(allergy.allergyType)}
                    alt={allergy.allergyType}
                    width={24}
                    height={24}
                    style={{ objectFit: 'contain' }}
                  />
                  <h1 className='font-medium'>{allergy.allergyName}</h1>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 border-[1.5px] rounded-[12px] text-xs font-semibold ${getSeverityPillClass(
                      allergy.severityLevel
                    )}`}
                  >
                    {allergy.severityLevel}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className='w-full text-center py-10 text-gray-500 font-medium'>
              No created allergies for this patient
            </div>
          )}
        </div>
      </div>

      {showSidebar && (
        <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowSidebar(false)}>
          <div
            className="absolute right-0 top-0 h-full w-[55%] bg-[#FBFBFB] shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] bg-white mb-8 border-[#FFFFFF] shadow-xs">
              <h2 className="text-xl font-semibold">Record new allergy</h2>
              <button onClick={() => setShowSidebar(false)} className="w-[28px] h-[28px]">
                <img src='/image/exiticon.png' alt='exit'></img>
              </button>
            </div>
            <form
              ref={formRef}
              className='min-h-[75%] flex flex-col pl-7 pr-7 gap-[14px]'
              onSubmit={handleSubmit}
            >
              <div className='flex flex-col gap-2 font-light text-[#898989]'>
                <label>Allergy type</label>
                {/* Custom dropdown */}
                <div className="relative w-[90%]">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full bg-white border-[1px] border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-[#898989] focus:outline-none"
                    onClick={() => setShowTypeDropdown((prev) => !prev)}
                  >
                    <span className="flex items-center gap-2">
                      {allergyType
                        ? <>
                            <img
                              src={getAllergyTypeImage(allergyType)}
                              alt={allergyType}
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                            <span>{allergyType}</span>
                          </>
                        : isAddingCustom && customAllergyType
                          ? <>
                              <img
                                src={getAllergyTypeImage('Other')}
                                alt="Other"
                                width={20}
                                height={20}
                                className="object-contain"
                              />
                              <span>{customAllergyType}</span>
                            </>
                          : 'Select allergy type'}
                    </span>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path d="M7 10l5 5 5-5" stroke="#898989" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {showTypeDropdown && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-[#D0D5DD] rounded-[12px] shadow-lg max-h-64 overflow-y-auto">
                      {allergyTypes.map(type => (
                        <div
                          key={type.value}
                          className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#E5EDFF] ${allergyType === type.value && type.value !== 'Other' ? 'bg-[#EEF4FF]' : ''}`}
                          onClick={() => handleTypeSelect(type)}
                        >
                          <img src={type.img} alt={type.label} width={20} height={20} className="object-contain" />
                          <span>{type.label}</span>
                          {allergyType === type.value && type.value !== 'Other' && (
                            <svg className="ml-auto" width="18" height="18" fill="none" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" stroke="#3B6FED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      ))}
                      
                      {/* Custom input as a regular option */}
                      <div className="flex flex-col gap-2 px-4 py-3 border-t border-[#D0D5DD]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <div className='flex gap-2'>
                            <img src={getAllergyTypeImage('Other')} alt="Other" width={20} height={20} className="object-contain" />
                            <h2>Others</h2>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter custom allergy type"
                            className="flex-1 border-[1px] border-gray-300 rounded-[8px] px-2 py-1 h-[36px] focus:outline-none focus:border-blue-500"
                            value={customAllergyType}
                            onChange={e => setCustomAllergyType(e.target.value)}
                          />
                        </div>
                        <div className='w-full flex items-end justify-end'>
                          <button
                            type="button"
                            className="bg-[#3B6FED] w-fit hover:bg-[#E5EDFF] text-white px-4 py-1.5 rounded-[8px] text-sm font-medium "
                            disabled={!customAllergyType.trim()}
                            onClick={handleAddCustomAllergy}
                          >
                            Add custom allergy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Show selected type below dropdown */}
                {allergyType && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={getAllergyTypeImage(allergyType === 'Other' ? 'Other' : allergyType)}
                      alt={allergyType}
                      width={24}
                      height={24}
                      style={{ objectFit: 'contain' }}
                    />
                    <span className="text-sm">
                      {allergyType}
                    </span>
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-2 font-light text-[#898989]'>
                <label>Allergy name</label>
                <input
                  type='text'
                  placeholder='Enter allergy name'
                  className='w-[90%] bg-[#FFFFFF] outline-none border-[1px] border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-black'
                  value={allergyName}
                  onChange={e => setAllergyName(e.target.value)}
                  required
                />
              </div>
                <div className='flex flex-col gap-2 font-light text-[#898989]'>
                <label>Severity level</label>
                {/* Custom severity dropdown */}
                <div className="relative w-[90%] severity-dropdown">
                    <button
                    type="button"
                    className="flex items-center justify-between w-full bg-white border-[1px] border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 shadow-xs text-[#898989] focus:outline-none"
                    onClick={() => setShowSeverityDropdown((prev) => !prev)}
                    >
                    <span>
                        {severityLevel
                        ? <span className={`px-3 py-1 border-[1.5px] rounded-[12px] text-xs font-semibold ${
                            severityLevel === 'Mild'
                                ? 'border-green-300 bg-green-100 text-green-600'
                                : severityLevel === 'Moderate'
                                ? 'border-amber-300 bg-amber-100 text-amber-600'
                                : severityLevel === 'Severe'
                                ? 'border-red-300 bg-red-100 text-red-600'
                                : ''
                            }`}>{severityLevel}</span>
                        : 'Select severity level'}
                    </span>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5" stroke="#898989" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    </button>
                    {showSeverityDropdown && (
                    <div
                        className="absolute left-0 right-0 z-50 mt-1 bg-white border border-[#D0D5DD] rounded-[12px] shadow-lg"
                        style={{ minWidth: '100%', maxWidth: '100%' }}
                    >
                        <div
                        className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${!severityLevel ? 'bg-[#EEF4FF] text-[#3B6FED]' : ''}`}
                        onClick={() => {
                            setSeverityLevel('');
                            setShowSeverityDropdown(false);
                        }}
                        >
                        Select severity level
                        { !severityLevel && (
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" stroke="#3B6FED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                        </div>
                        {['Mild', 'Moderate', 'Severe'].map(level => (
                        <div
                            key={level}
                            className="flex items-center gap-2 rounded-[12px] px-4 py-2 cursor-pointer hover:bg-[#EEF4FF]"
                            onClick={() => {
                            setSeverityLevel(level);
                            setShowSeverityDropdown(false);
                            }}
                        >
                            <span className={`px-3 py-1 border-[1.5px] rounded-[12px] text-xs font-semibold ${
                            level === 'Mild'
                                ? 'border-green-300 bg-green-100 text-green-600'
                                : level === 'Moderate'
                                ? 'border-amber-300 bg-amber-100 text-amber-600'
                                : level === 'Severe'
                                ? 'border-red-300 bg-red-100 text-red-600'
                                : ''
                            }`}>{level}</span>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>
            </form>
            <div className='min-h-[8%] w-full flex justify-end items-center border-t-[1px] pr-6 border-[#F0F2F5] shadow-t-xs'>
              <button
                type='button'
                className="bg-blue-600 text-white py-2 px-4 rounded w-fit"
                disabled={isSaving}
                onClick={handleExternalSubmit}
              >
                {isSaving ? 'Saving...' : 'Save new allergy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Allergy Sidebar */}
      {showViewSidebar && selectedAllergy && (
        <div className="fixed inset-0 z-50 bg-[#0C162F99]" onClick={() => { setShowViewSidebar(false); setIsEditing(false); setSelectedAllergy(null); }}>
          <div
            className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold">Allergy</h2>
              <button onClick={() => { setShowViewSidebar(false); setIsEditing(false); setSelectedAllergy(null); }} className="text-xl">×</button>
            </div>
            <div className="flex-1 flex flex-col gap-6 p-8 bg-[#FAFAFA]">
              {!isEditing ? (
                <>
                  {/* ==== View Mode ==== */}
                  <div>
                    <label className="block mb-2 text-sm text-gray-600">Allergy type</label>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-[12px] px-4 py-3">
                      <img
                        src={getAllergyTypeImage(selectedAllergy.allergyType)}
                        alt={selectedAllergy.allergyType}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="font-medium">{selectedAllergy.allergyType}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-600">Allergy name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-200 rounded-[12px] px-4 py-3"
                      value={selectedAllergy.allergyName}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-600">Severity level</label>
                    <span
                      className={`inline-block px-4 py-2 border rounded-[12px] text-base font-semibold ${
                        getSeverityPillClass(selectedAllergy.severityLevel)
                      }`}
                    >
                      {selectedAllergy.severityLevel}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* ==== Edit Mode ==== */}
                  <div className="flex flex-col gap-2 font-light text-[#898989]">
                    <label>Allergy type</label>
                    {/* Reuse your existing dropdown UI from add form */}
                    <div className="relative w-full">
                      <button
                        type="button"
                        className="flex items-center justify-between w-full bg-white border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 text-[#898989]"
                        onClick={() => setShowTypeDropdown((prev) => !prev)}
                      >
                        <span className="flex items-center gap-2">
                          {editData.allergyType || 'Select allergy type'}
                        </span>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5" stroke="#898989" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      {showTypeDropdown && (
                        <div className="absolute mt-1 bg-white border border-[#D0D5DD] rounded-[12px] shadow-lg w-full z-50">
                          {allergyTypes.map(type => (
                            <div
                              key={type.value}
                              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#E5EDFF]"
                              onClick={() => {
                                setEditData(prev => ({ ...prev, allergyType: type.value }));
                                setShowTypeDropdown(false);
                              }}
                            >
                              <img src={type.img} alt={type.label} width={20} height={20} />
                              <span>{type.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 font-light text-[#898989]">
                    <label>Allergy name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-200 rounded-[12px] px-4 py-3"
                      value={editData.allergyName}
                      onChange={(e) => setEditData(prev => ({ ...prev, allergyName: e.target.value }))}
                    />
                  </div>

                  <div className="flex flex-col gap-2 font-light text-[#898989]">
                    <label>Severity level</label>
                    <div className="relative w-full severity-dropdown">
                      <button
                        type="button"
                        className="flex items-center justify-between w-full bg-white border border-[#D0D5DD] h-[40px] rounded-[12px] pl-3 pr-3 text-[#898989]"
                        onClick={() => setShowSeverityDropdown((prev) => !prev)}
                      >
                        <span>{editData.severityLevel || 'Select severity level'}</span>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5" stroke="#898989" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      {showSeverityDropdown && (
                        <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-[#D0D5DD] rounded-[12px] shadow-lg">
                          {['Mild', 'Moderate', 'Severe'].map(level => (
                            <div
                              key={level}
                              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#EEF4FF]"
                              onClick={() => {
                                setEditData(prev => ({ ...prev, severityLevel: level }));
                                setShowSeverityDropdown(false);
                              }}
                            >
                              <span>{level}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 px-8 py-4 bg-white">
              <button
                className="border border-red-500 text-red-600 px-6 py-2 rounded hover:bg-red-50"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('access_token');
                    const res = await fetch(`/api/v1/allergies/${selectedAllergy.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    if (res.ok) {
                      toast.success('Allergy deleted successfully');
                      // close and reset view/edit state
                      setShowViewSidebar(false);
                      setIsEditing(false);
                      setSelectedAllergy(null);
                      await fetchAllergies();
                    } else {
                      toast.error('Failed to delete allergy');
                    }
                  } catch (err) {
                    console.error('delete allergy error', err);
                    toast.error('Error deleting allergy');
                  }
                }}
              >
                Delete allergy
              </button>

              {!isEditing ? (
                <button
                  className="bg-[#6C5DD3] text-white px-6 py-2 rounded"
                  onClick={() => {
                    setIsEditing(true);
                    setEditData({
                      allergyType: selectedAllergy.allergyType,
                      allergyName: selectedAllergy.allergyName,
                      severityLevel: selectedAllergy.severityLevel,
                    });
                  }}
                >
                  Edit allergy
                </button>
              ) : (
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('access_token');
                      const res = await fetch(`/api/v1/allergies/${selectedAllergy.id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify(editData),
                      });
                      if (res.ok) {
                        toast.success('Allergy updated successfully');
                        setShowViewSidebar(false);
                        setIsEditing(false);
                        await fetchAllergies();
                      } else {
                        toast.error('Failed to update allergy');
                      }
                    } catch (err) {
                      console.error('update allergy error', err);
                      toast.error('Error updating allergy');
                    }
                  }}
                >
                  Save changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default nurseallergies;