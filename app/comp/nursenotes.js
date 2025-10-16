'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { downloadNotePDF } from '../utils/downloadhelper';

const sampleTags = [
  'Follow-up', 'Malaria', 'Medications', 'Typhoid', 'Admitted', 'Discharged',
];

const tagColors = ['#1E40AF', '#059669', '#D97706', '#EAB308', '#A855F7', '#EF4444'];
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


export default function NoteManager({ studentId }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [tags, setTags] = useState([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [selectedColor, setSelectedColor] = useState(tagColors[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isForwarding, setIsForwarding] = useState(false);
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [description, setDescription] = useState("");
  const [possibleCause, setPossibleCause] = useState("");
  const [healthRecords, setHealthRecords] = useState(null);
  const [healthRecordsLoading, setHealthRecordsLoading] = useState(true);
  const [isHealthOpen, setIsHealthOpen] = useState(null);

  const [expandedPair, setExpandedPair] = useState(null);
  const [showExpandedSidebar, setShowExpandedSidebar] = useState(false);
  const [expandedNurseOpen, setExpandedNurseOpen] = useState(true);
  const [expandedDoctorOpen, setExpandedDoctorOpen] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState('nurse');
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [instructionsText, setInstructionsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`/api/v1/notes/${studentId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setNotes(Array.isArray(data) ? data : (data.data || []));
        } else {
          setNotes([]);
        }
      } catch (err) {
        setNotes([]);
      }
    };
    if (studentId) fetchNotes();
  }, [studentId]);

  const handleSavenurseNote = async () => {
    if (!noteTitle.trim() || !noteBody.trim()) return;

    setIsSaving(true);

    const payload = {
      title: noteTitle.trim(),
      content: noteBody.trim(),
      tags: selectedTags.map(t => t.toLowerCase()),
      studentId: Number(studentId),
      noteType: "NURSE_NOTE"
    };

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/v1/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

    if (res.ok) {
      const fetchNotes = async () => {
        try {
          const res = await fetch(`/api/v1/notes/${studentId}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (res.ok) {
            const data = await res.json();
            setNotes(Array.isArray(data) ? data : (data.data || []));
          }
        } catch {}
      };
      await fetchNotes();
      toast.success('Note saved successfully!'); // Add this line
      setNoteTitle('');
      setNoteBody('');
      setTags([]);
      setSelectedTags([]);
      setShowSidebar(false);
      setShowTagSelector(false);
      setSelectedTag('');
      setCustomTag('');
      setSelectedNoteType('nurse');
    } else {
      toast.error('Failed to save note');
    }
    } catch (err) {
      toast.error('Error saving note');
    } finally {
      setIsSaving(false);
    }
  };

    const handleSavedoctorNote = async () => {
    if (!noteTitle.trim() || !noteBody.trim()) return;

    setIsSaving(true);

    const payload = {
      title: noteTitle.trim(),
      content: noteBody.trim(),
      tags: selectedTags.map(t => t.toLowerCase()),
      studentId: Number(studentId),
      noteType: "DOCTOR_NOTE",
      nurseNoteId: 1
    };

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/v1/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

    if (res.ok) {
      const fetchNotes = async () => {
        try {
          const res = await fetch(`/api/v1/notes/${studentId}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (res.ok) {
            const data = await res.json();
            setNotes(Array.isArray(data) ? data : (data.data || []));
          }
        } catch {}
      };
      await fetchNotes();
      toast.success('Note saved successfully!'); // Add this line
      setNoteTitle('');
      setNoteBody('');
      setTags([]);
      setSelectedTags([]);
      setShowSidebar(false);
      setShowTagSelector(false);
      setSelectedTag('');
      setCustomTag('');
      setSelectedNoteType('nurse');
    } else {
      toast.error('Failed to save note');
    }
    } catch (err) {
      toast.error('Error saving note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveprescription = async (e) => {
    e.preventDefault(); // prevent form reload
    setIsSaving(true);

    const payload = {
      studentId: studentId, // make sure you pass this prop
      medication,
      dosage,
      instructions,
      nurseNoteId: 1
    };

    try {
      const res = await fetchWithAuth("/api/v1/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save prescription");

      const data = await res.json();
      console.log("Saved successfully:", data);
      // Optionally reset form
      setMedication("");
      setDosage("");
      setInstructions("");
      toast.success('Prescription saved Succesfully!');
    } catch (err) {
      console.error(err);
      toast.success('Failed to save prescription!');
    } finally {
      setIsSaving(false);
    }
  };

  
  const handleSaveHealthRecord = async (e) => {
    e.preventDefault(); // prevent form reload
    setIsSaving(true);

    const payload = {
      studentId: studentId, // make sure you pass this prop
      diagnosis,
      description,
      possibleCause,
      nurseNoteId: 1
    };

    try {
      const res = await fetchWithAuth("/api/v1/health-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save health record");

      const data = await res.json();
      console.log("Saved successfully:", data);
      toast.success('Health record saved successfully!');
      
      // Reset form
      setDiagnosis("");
      setDescription("");
      setPossibleCause("");
    } catch (err) {
      console.error(err);
      toast.error('Failed to save health record');
    } finally {
      setIsSaving(false);
    }
  };


  const handleAddTag = () => {
    if (selectedTag && !selectedTags.includes(selectedTag)) {
      setSelectedTags([...selectedTags, selectedTag]);
    }
    setSelectedTag('');
    setShowTagSelector(false);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags([...selectedTags, customTag]);
      setCustomTag('');
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getTodayDate = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

const handleForwardFiles = async (id) => {
  setIsForwarding(true);
  try {
    const res = await fetchWithAuth(`/api/v1/queue/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: "Forwarded to doctor" }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      // Only show error if it's not already forwarded
      if (errorText.includes('already forwarded') || errorText.includes('already in status')) {
        toast.error('Patient is already forwarded to doctor.');
      } else {
        toast.error(`Failed to forward files: ${errorText}`);
      }
      setIsForwarding(false);
      return;
    }

    // Only show success if status actually changed
    const data = await res.json();
    if (data.status === "Forwarded to doctor" && data.updated) {
      toast.success('Files forwarded successfully');
    } else if (data.status === "Forwarded to doctor") {
      toast('Patient is already forwarded to doctor.');
    }

    setMenuUser && setMenuUser(null);
    await fetchQueueData && fetchQueueData();
  } catch (err) {
    console.error('Failed to forward files:', err);
    toast.error('An error occurred while forwarding files.');
  } finally {
    setIsForwarding(false);
  }
};

  const nurseNotes = notes.filter(n => n.creator && n.creator.role === 'nurse');
  const doctorNotes = notes.filter(n => n.creator && n.creator.role === 'doctor');

// Create proper note pairs - each nurse note should have a corresponding doctor note slot
const createNotePairs = () => {
  const pairs = [];
  const usedDoctorNotes = new Set(); // Track which doctor notes have been used
  
  // For each nurse note, try to find the CLOSEST doctor note that was created AFTER it
  nurseNotes.forEach(nurseNote => {
    let bestMatch = null;
    let smallestTimeDiff = Infinity;
    
    // Find the doctor note with the smallest time difference that came AFTER the nurse note
    doctorNotes.forEach(doctorNote => {
      // Skip if this doctor note is already paired
      if (usedDoctorNotes.has(doctorNote.id)) return;
      
      // Match by same student
      if (doctorNote.studentId !== nurseNote.studentId) return;
      
      const nurseTime = new Date(nurseNote.createdAt);
      const doctorTime = new Date(doctorNote.createdAt);
      
      // Only consider doctor notes created AFTER the nurse note (doctor responding to nurse)
      if (doctorTime <= nurseTime) return;
      
      const timeDifference = doctorTime - nurseTime; // Positive value since doctor note is after
      
      // Only consider notes within 24 hours AND find the closest one
      if (timeDifference <= (24 * 60 * 60 * 1000) && timeDifference < smallestTimeDiff) {
        bestMatch = doctorNote;
        smallestTimeDiff = timeDifference;
      }
    });
    
    // If we found a matching doctor note, mark it as used
    if (bestMatch) {
      usedDoctorNotes.add(bestMatch.id);
    }
    
    pairs.push({
      nurse: nurseNote,
      doctor: bestMatch || null // null if no doctor note exists yet
    });
  });
  
  // Handle orphaned doctor notes (doctor notes without corresponding nurse notes)
  doctorNotes.forEach(doctorNote => {
    if (!usedDoctorNotes.has(doctorNote.id)) {
      pairs.push({
        nurse: null,
        doctor: doctorNote
      });
    }
  });
  
  // Sort pairs by nurse note creation time (newest first) to show latest notes first
  pairs.sort((a, b) => {
    if (!a.nurse) return 1; // orphaned doctor notes go to end
    if (!b.nurse) return -1;
    return new Date(b.nurse.createdAt) - new Date(a.nurse.createdAt);
  });
  
  return pairs;
};

  const notePairs = createNotePairs();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
    }
  }, [user]);
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


      useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        setHealthRecordsLoading(true);
        const res = await fetchWithAuth(`/api/v1/health-records/student/${studentId}/summary`);
        const data = await res.json();
        setHealthRecords(data.data);
      } catch (err) {
        console.error('Error fetching health records:', err);
        setHealthRecords(null);
      } finally {
        setHealthRecordsLoading(false);
      }
    };
    if (studentId) {
      fetchHealthRecords();
    }
  }, [studentId]);

  const renderNoteTypeContent = () => {
    if (!user) return null;
    if (user.role === 'doctor') {
      switch (selectedNoteType) {
        case 'nurse':
          return (
            <div className='h-full p-6'>
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF]">
              <div
                className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                onClick={() => setExpandedNurseOpen(open => !open)}
              >
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1">{expandedPair?.nurse?.title}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>
                      {expandedPair?.nurse?.creator && expandedPair.nurse.creator.role === 'nurse'
                        ? `Nurse ${expandedPair.nurse.creator.firstName} ${expandedPair.nurse.creator.lastName}`
                        : 'Nurse —'}
                    </span>
                    {expandedPair?.nurse?.createdAt && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{formatDate(expandedPair.nurse.createdAt)}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTime(expandedPair.nurse.createdAt)}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-lg">
                  {expandedNurseOpen ? '▾' : '▸'}
                </span>
              </div>
              {expandedNurseOpen && (
                <div className="pt-3 bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                  <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                    <span className="font-medium text-xs text-gray-500">Tags:</span>
                    {(expandedPair?.nurse?.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-[#D1D5DB] bg-[#F3F6FF] text-[#1E40AF]"
                        style={{
                          borderColor: tagColors[i % tagColors.length],
                          color: tagColors[i % tagColors.length],
                          background: "#F3F6FF"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-line mt-4 px-5">
                    {expandedPair?.nurse?.content || expandedPair?.nurse?.body}
                  </div>
                  <div className="flex justify-end mt-4 mb-1 border-t-[0.8px] border-t-gray-300 w-fullrounded-b-xl ">
                    <button onClick={() => downloadNotePDF(expandedPair?.nurse, 'nurse', formatDate, formatTime)} className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm">
                      <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                      Download note
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>
          );
        case 'nurseexpand':
          return (
            <div className='h-full p-6'>
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF]">
              <div
                className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                onClick={() => setExpandedNurseOpen(open => !open)}
              >
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1">{expandedPair?.nurse?.title}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>
                      {expandedPair?.nurse?.creator && expandedPair.nurse.creator.role === 'nurse'
                        ? `Nurse ${expandedPair.nurse.creator.firstName} ${expandedPair.nurse.creator.lastName}`
                        : 'Nurse —'}
                    </span>
                    {expandedPair?.nurse?.createdAt && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{formatDate(expandedPair.nurse.createdAt)}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTime(expandedPair.nurse.createdAt)}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-lg">
                  {expandedNurseOpen ? '▾' : '▸'}
                </span>
              </div>
              {expandedNurseOpen && (
                <div className="pt-3 bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                  <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                    <span className="font-medium text-xs text-gray-500">Tags:</span>
                    {(expandedPair?.nurse?.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-[#D1D5DB] bg-[#F3F6FF] text-[#1E40AF]"
                        style={{
                          borderColor: tagColors[i % tagColors.length],
                          color: tagColors[i % tagColors.length],
                          background: "#F3F6FF"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-line mt-4 px-5">
                    {expandedPair?.nurse?.content || expandedPair?.nurse?.body}
                  </div>
                  <div className="flex justify-end mt-4 mb-1 border-t-[0.8px] border-t-gray-300 w-fullrounded-b-xl ">
                    <button onClick={() => downloadNotePDF(expandedPair?.nurse, 'nurse', formatDate, formatTime)} className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm">
                      <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                      Download note
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>
          );
        case 'doctor':
          return (
            <div className='h-full flex flex-col'>
              {/* Scrollable content area */}
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                {/* Note Title */}
                <div className='w-full mb-5'>
                  <label className='text-sm text-[#898989] font-light block mb-1'>Title</label>
                  <input
                    type='text'
                    placeholder="Enter note title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className='h-[44px] border w-full rounded-[10px] bg-white outline-none border-gray-300 pl-3 text-[15px] text-medium'
                  />
                </div>

                {/* Tags Section */}
                <div className='mb-0'>
                  <div className='flex items-center gap-3 justify-start'>
                    <h1 className='text-sm font-light text-[#898989] mb-2'>Tags :</h1>
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {selectedTags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 h-[30px] rounded-full text-xs flex items-center gap-1"
                          style={{ backgroundColor: tagColors[i % tagColors.length], color: '#fff' }}
                        >
                          {tag}
                          <button onClick={() => removeTag(tag)} className="ml-1 text-white">×</button>
                        </span>
                      ))}
                      <button
                        className="flex gap-1 items-center px-3 py-1 border-[0.8px] border-[#626262] rounded-[24px] text-xs text-gray-700 bg-[#EBEBEB]"
                        onClick={() => setShowTagSelector(!showTagSelector)}
                        type="button"
                      >
                        <img src="/image/smallPlus.png" className='w-[16px] h-[18px]'/> Add tag
                      </button>
                    </div>
                  </div>

                  {/* Tag Selector */}
                  {showTagSelector && (
                    <div className="p-4 bg-[#FFFFFF] border rounded max-w-md shadow mb-3">
                      <label className="block mb-2 font-medium">Tags:</label>
                      <input
                        type="text"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        placeholder="Enter a health / patient tag (eg. Malaria)"
                        className="w-full border border-gray-300 px-3 py-1 rounded outline-blue-600 mb-2"
                      />
                      <div className="flex gap-2 mb-2">
                        {tagColors.map(color => (
                          <button
                            key={color}
                            type="button"
                            className={`w-5 h-5 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-white'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCustomTag}
                        className="mb-2 px-2 py-1 border rounded-[12px] text-sm border-[#EBEBEB]"
                      >
                        Choose tag color
                      </button>
                      <div>
                        {sampleTags.map((tag) => (
                          <div
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`cursor-pointer px-3 py-2 border-b-[0.6px] border-[#EBEBEB] flex items-center ${
                              selectedTags.includes(tag) ? 'bg-blue-100' : ''
                            }`}
                          >
                            {tag}
                            {selectedTags.includes(tag) && <span className="ml-2 text-blue-600">✔</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Textarea with lined background */}
                <div className='w-full min-h-[40vh]'>
                  <div className="w-full min-h-[40vh] bg-white relative border-none">
                    {/* Lined background */}
                    <div 
                      className="absolute inset-0 border-none pointer-events-none" 
                      style={{ 
                        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 24px, #d1d5db 24px, #d1d5db 25px)",
                        backgroundSize: "100% 25px"
                      }} 
                    />
                    {/* Textarea */}
                    <div className="relative z-10 w-full min-h-[40vh]">
                      <textarea
                        className="w-full min-h-[40vh] resize-none bg-transparent outline-none border-none px-2 py-1 leading-[25px] text-[15px]"
                        value={noteBody}
                        onChange={(e) => setNoteBody(e.target.value)}
                        style={{ lineHeight: '25px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed footer button */}
              <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'>
                <button
                  onClick={handleSavedoctorNote}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save note'}
                </button>
              </div>
            </div>
          );
        case 'doctorexpand':
          if (!expandedPair?.doctor) {
            return (
              <div className="flex flex-col gap-2 items-center justify-center h-[70%] p-8">
                <img src="/image/nodoctors.png" alt="No Doctor's note" className="mx-auto mb-2 h-[80px] w-[80px]"  />
                <div className="font-semibold text-gray-800 text-lg mb-1">No Doctor's note yet</div>
                <div className="text-xs text-gray-500 text-center mb-6">No doctor's notes have been recorded.</div>
                        {user && (
                          <button
                            className='bg-blue-600 flex gap-[8px] h-[40px] px-4 items-center justify-center text-white rounded-[8px] hover:bg-blue-700'
                            onClick={() => {
                              setShowSidebar(true);
                              setShowExpandedSidebar(false);
                              setSelectedNoteType(user.role === 'doctor' ? 'doctor' : 'nurse');
                            }}
                          >
                            <img src='/image/Pluswhite.png' alt='icon' width={18} height={18} />
                            <h1 className='text-[14px]'>Add Note</h1>
                          </button>
                        )}
                {/* <button
                  className="bg-blue-600 hover:bg-blue-700 text-white h-[48px] w-[316px] font-medium rounded-[8px] py-1 px-3 flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => handleForwardFiles(studentId)}
                  disabled={isForwarding}
                >
                  {isForwarding ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                      Forwarding...
                    </>
                  ) : (
                    <>
                      <img src='/image/Up-Right.png' alt='arrow' className='w-[22px] h-[22px]' />
                      Forward patient to Doctor
                    </>
                  )}
                </button> */}
              </div>
            );
          }               
          return (
            <div className='h-[70%] p-6'>
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF] ">
                <div
                  className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                  onClick={() => setExpandedDoctorOpen(open => !open)}
                >
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">
                      {expandedPair?.doctor ? expandedPair.doctor.title : '-----'}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        {expandedPair?.doctor
                          ? `Dr. ${expandedPair.doctor.creator.firstName} ${expandedPair.doctor.creator.lastName}`
                          : 'Doctor —'}
                      </span>
                      {expandedPair?.doctor && expandedPair.doctor.createdAt ? (
                        <>
                          <span className="mx-1">•</span>
                          <span>{formatDate(expandedPair.doctor.createdAt)}</span>
                          <span className="mx-1">•</span>
                          <span>{formatTime(expandedPair.doctor.createdAt)}</span>
                        </>
                      ) : (
                        <>
                          <span className="mx-1">•</span>
                          <span>--</span>
                          <span className="mx-1">•</span>
                          <span>--</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-lg">
                    {expandedDoctorOpen ? '▾' : '▸'}
                  </span>
                </div>
                {expandedDoctorOpen && (
                  <div className="pt-3 bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                    <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                      <span className="font-medium text-xs text-gray-500">Tags:</span>
                      {(expandedPair?.doctor && expandedPair.doctor.tags && expandedPair.doctor.tags.length > 0) ? (
                        expandedPair.doctor.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-semibold border border-[#D1D5DB] bg-[#F3F6FF] text-[#1E40AF]"
                            style={{
                              borderColor: tagColors[i % tagColors.length],
                              color: tagColors[i % tagColors.length],
                              background: "#F3F6FF"
                            }}
                          >
                            {tag}
                          </span>
                                                  ))
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-line mt-4 px-5">
                      {expandedPair?.doctor
                        ? expandedPair.doctor.content
                        : (
                          <div className="flex flex-col items-center justify-center py-6 h-full">
                            <img src="/image/notes-empty.png" alt="No Doctor's note" className="mx-auto mb-2" style={{ width: 40, height: 40 }} />
                            <div className="font-semibold text-gray-700 text-base mb-1">No Doctor's note yet</div>
                            <div className="text-xs text-gray-500 text-center">No doctor's notes have been recorded.</div>
                          </div>
                        )
                      }
                    </div>
                    <div className="flex justify-end mt-4 w-full rounded-b-xl border-t-[0.8px] border-t-gray-300">
                      <div className="flex justify-end  mb-1  w-full rounded-b-xl">
                        <button onClick={() => downloadNotePDF(expandedPair?.doctor, 'doctor', formatDate, formatTime)} className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm">
                          <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                          Download note
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
          case 'health':
          return (
            <div className='h-full flex flex-col '>
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                <form method='post' className='flex flex-col gap-3 text-[#898989]'>
                  <div className='flex flex-col gap-2 '>
                    <label className='text-[#898989]'>Diagnosis</label>
                    <input type='text' placeholder='Enter diagnosis' value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'></input>
                  </div>
                  <div className='flex flex-col gap-2 '>
                    <label className='text-[#898989]'>Description</label>
                    <input type='text' placeholder='Enter diagnosis description'  value={description}  onChange={(e) => setDescription(e.target.value)}  className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'></input>
                  </div>
                  <div className='flex flex-col gap-2 '>
                    <label className='text-[#898989]'>Possible cause</label>
                    <input type='text' placeholder='Enter possible cause' value={possibleCause} onChange={(e) => setPossibleCause(e.target.value)} className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'></input>
                  </div>
                </form>
              </div>
              {/* Fixed footer button */}
              <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'>
                <button
                  onClick={handleSaveHealthRecord}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Health Issue'}
                </button>
              </div>
            </div>
          );
          case 'healthexpanded':
            return (
              <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] py-5">
                {healthRecordsLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-gray-500">Loading health records...</span>
                  </div>
                ) : !healthRecords || healthRecords.recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <img src="/image/nodoctors.png" alt="No health records" className="mx-auto mb-2 h-[110px] w-[110px]" />
                    <div className="font-semibold text-gray-800 text-lg mb-1">No Health Records</div>
                    <div className="text-xs text-gray-500 text-center">No health records have been recorded for this student.</div>
                  </div>
                ) : (
                  <>
                    {/* Recent Activity */}
                    {healthRecords.recentActivity.map((record, idx) => (
                      <div key={idx} className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                        <div
                          className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                          onClick={() => setIsHealthOpen(isHealthOpen === idx ? null : idx)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{record.diagnosis}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(record.date)} • {record.recordedBy.name}
                            </span>
                          </div>
                          <span className="text-lg transform transition-transform duration-300">
                            {isHealthOpen === idx ? '▾' : '▸'}
                          </span>
                        </div>

                        {isHealthOpen === idx && (
                          <div className="text-sm pl-4 pr-4 pt-2 pb-2 rounded-b-[8px] bg-white">
                            <div className="border-b last:border-b-0">
                              <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                                <span className="text-gray-700">Diagnosis</span>
                                <span className="font-medium text-gray-900">
                                  {record.diagnosis || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                                <span className="text-gray-700">Description</span>
                                {record.description ? (
                                  <button
                                    className="text-blue-600 font-medium hover:underline"
                                    type="button"
                                    onClick={() => {
                                      setDescriptionText(record.description);
                                      setShowDescriptionModal(true);
                                    }}
                                  >
                                    View
                                  </button>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </div>
                              <div className="flex justify-between  py-3 ">
                                <span className="text-gray-700 mb-2">Possible Cause</span>
                                <span className="font-medium text-gray-900 text-sm">
                                  {record.possibleCause || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          case 'prescription':
          return (
            <div className='h-full flex flex-col' >
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
              <form method='post' className='flex flex-col gap-3 text-[#898989]'>
                <div className='flex flex-col gap-2 '>
                  <div className='flex items-center justify-between'>
                    <label className='text-[#898989]' >Medication</label>
                    <button className='flex gap-1 items-center justify-center cursor-pointer'>
                      <img src="/image/Plus{BLUE}.png" alt='plus' className='h-[24px] w-[24px]'/>
                      <h2 className='text-[#3B6FED]'>Add medication</h2>
                    </button>
                  </div>
                  <input type='text' placeholder='Enter medication' value={medication} onChange={(e) => setMedication(e.target.value)} className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'></input>
                </div>
                <div className='flex flex-col gap-2 '>
                  <label className='text-[#898989]'>Dosage</label>
                  <input type='text' placeholder='Enter medication dosage' value={dosage} onChange={(e) => setDosage(e.target.value)}  className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'></input>
                </div>
                <div className='flex flex-col gap-2 '>
                  <label className='text-[#898989]'>Instructions</label>
                  <input type='text' placeholder='Give instructions for medication' value={instructions} onChange={(e) => setInstructions(e.target.value)} className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'></input>
                </div>
              </form>
              </div>
              {/* Fixed footer button */}
              <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'>
                <button
                  onClick={handleSaveprescription}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Prescription'}
                </button>
              </div>
            </div>
          );
          case 'prescriptionexpanded':
          return (
              <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] py-5">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-gray-500">Loading prescriptions...</span>
                  </div>
                ) : prescriptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <img src="/image/nodoctors.png" alt="No prescriptions" className="mx-auto mb-2 h-[110px] w-[110px]" />
                    <div className="font-semibold text-gray-800 text-lg mb-1">No Prescriptions</div>
                    <div className="text-xs text-gray-500 text-center">No prescriptions have been recorded for this student.</div>
                  </div>
                ) : (
                  prescriptions.map((prescription, idx) => (
                    <div key={idx} className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                      <div
                        className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                        onClick={() => setIsOpen1(isOpen1 === idx ? null : idx)}
                      >
                        <span className="font-medium text-sm">Prescription details {idx + 1} </span>
                        <span className="text-lg transform transition-transform duration-300">
                          {isOpen1 === idx ? '▾' : '▸'}
                        </span>
                      </div>

                      {isOpen1 === idx && (
                        <div className="text-sm pl-4 pr-4 pt-2 pb-2 rounded-b-[8px] bg-white">
                          <div className="border-b last:border-b-0">
                            <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                              <span className="text-gray-700">Medication</span>
                              <span className="font-medium text-gray-900">
                                {prescription.medication || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                              <span className="text-gray-700">Dosage</span>
                              <span className="font-medium text-gray-900">
                                {prescription.dosage || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 ">
                              <span className="text-gray-700">Instructions</span>
                              {prescription.instructions ? (
                                <button
                                  className="text-blue-600 font-medium hover:underline"
                                  type="button"
                                  onClick={() => {
                                    setInstructionsText(prescription.instructions);
                                    setShowInstructionsModal(true);
                                  }}
                                >
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                              <span className="text-gray-700">Medication 2</span>
                              <span className="font-medium text-gray-900">
                                {prescription.medication || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                              <span className="text-gray-700">Dosage</span>
                              <span className="font-medium text-gray-900">
                                {prescription.dosage || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 ">
                              <span className="text-gray-700">Instructions</span>
                              {prescription.instructions ? (
                                <button
                                  className="text-blue-600 font-medium hover:underline"
                                  type="button"
                                  onClick={() => {
                                    setInstructionsText(prescription.instructions);
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
                  ))
                )}
              </div>
          );
        default:
          return null;
      }
    }
    if (user.role === 'nurse') {
      switch (selectedNoteType) {
        case 'nurse':
          return (
            <div className='h-full flex flex-col'>
              {/* Scrollable content area */}
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                {/* Note Title */}
                <div className='w-full mb-5'>
                  <label className='text-sm font-light text-[#898989] block mb-1'>Title</label>
                  <input
                    type='text'
                    placeholder="Enter note title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className='h-[44px] border w-full rounded-[10px] bg-white outline-none border-gray-300 pl-3 text-[15px] text-medium'
                  />
                </div>

                {/* Tags Section */}
                <div className='mb-0'>
                  <div className='flex items-center gap-3 justify-start'>
                    <h1 className='text-sm font-light text-[#898989] mb-2'>Tags :</h1>
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {selectedTags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 h-[30px] rounded-full text-xs flex items-center gap-1"
                          style={{ backgroundColor: tagColors[i % tagColors.length], color: '#fff' }}
                        >
                          {tag}
                          <button onClick={() => removeTag(tag)} className="ml-1 text-white">×</button>
                        </span>
                      ))}
                      <button
                        className="flex gap-1 items-center px-3 py-1 border-[0.8px] border-[#626262] rounded-[24px] text-xs text-gray-700 bg-[#EBEBEB]"
                        onClick={() => setShowTagSelector(!showTagSelector)}
                        type="button"
                      >
                        <img src="/image/smallPlus.png" className='w-[16px] h-[18px]'/> Add tag
                      </button>
                    </div>
                  </div>

                  {/* Tag Selector */}
                  {showTagSelector && (
                    <div className="p-4 bg-[#FFFFFF] border rounded max-w-md shadow mb-3">
                      <label className="block mb-2 font-medium">Tags:</label>
                      <input
                        type="text"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        placeholder="Enter a health / patient tag (eg. Malaria)"
                        className="w-full border border-gray-300 px-3 py-1 rounded outline-blue-600 mb-2"
                      />
                      <div className="flex gap-2 mb-2">
                        {tagColors.map(color => (
                          <button
                            key={color}
                            type="button"
                            className={`w-5 h-5 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-white'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCustomTag}
                        className="mb-2 px-2 py-1 border rounded-[12px] text-sm border-[#EBEBEB]"
                      >
                        Choose tag color
                      </button>
                      <div>
                        {sampleTags.map((tag) => (
                          <div
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`cursor-pointer px-3 py-2 border-b-[0.6px] border-[#EBEBEB] flex items-center ${
                              selectedTags.includes(tag) ? 'bg-blue-100' : ''
                            }`}
                          >
                            {tag}
                            {selectedTags.includes(tag) && <span className="ml-2 text-blue-600">✔</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Textarea with lined background */}
                <div className='w-full min-h-[40vh]'>
                  <div className="w-full min-h-[40vh] bg-white relative border-none">
                    {/* Lined background */}
                    <div 
                      className="absolute inset-0 border-none pointer-events-none" 
                      style={{ 
                        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 24px, #d1d5db 24px, #d1d5db 25px)",
                        backgroundSize: "100% 25px"
                      }} 
                    />
                    {/* Textarea */}
                    <div className="relative z-10 w-full min-h-[40vh]">
                      <textarea
                        className="w-full min-h-[40vh] resize-none bg-transparent outline-none border-none px-2 py-1 leading-[25px] text-[15px]"
                        value={noteBody}
                        onChange={(e) => setNoteBody(e.target.value)}
                        style={{ lineHeight: '25px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed footer button */}
              <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'>
                <button
                  onClick={handleSavenurseNote}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save note'}
                </button>
              </div>
            </div>
          );
        case 'nurseexpand':
          return (
            <div className='h-full p-6'>
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF]">
              <div
                className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                onClick={() => setExpandedNurseOpen(open => !open)}
              >
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1">{expandedPair?.nurse?.title}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>
                      {expandedPair?.nurse?.creator && expandedPair.nurse.creator.role === 'nurse'
                        ? `Nurse ${expandedPair.nurse.creator.firstName} ${expandedPair.nurse.creator.lastName}`
                        : 'Nurse —'}
                    </span>
                    {expandedPair?.nurse?.createdAt && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{formatDate(expandedPair.nurse.createdAt)}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTime(expandedPair.nurse.createdAt)}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-lg">
                  {expandedNurseOpen ? '▾' : '▸'}
                </span>
              </div>
              {expandedNurseOpen && (
                <div className="pt-3 bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                  <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                    <span className="font-medium text-xs text-gray-500">Tags:</span>
                    {(expandedPair?.nurse?.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-[#D1D5DB] bg-[#F3F6FF] text-[#1E40AF]"
                        style={{
                          borderColor: tagColors[i % tagColors.length],
                          color: tagColors[i % tagColors.length],
                          background: "#F3F6FF"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-line mt-4 px-5">
                    {expandedPair?.nurse?.content || expandedPair?.nurse?.body}
                  </div>
                  <div className="flex justify-end mt-4 mb-1 border-t-[0.8px] border-t-gray-300 w-fullrounded-b-xl ">
                    <button onClick={() => downloadNotePDF(expandedPair?.nurse, 'nurse', formatDate, formatTime)} className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm">
                      <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                      Download note
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>
          );
        case 'doctor':
          if (!expandedPair?.doctor) {
            return (
              <div className="flex flex-col items-center justify-center h-[70%] p-8">
                <img src="/image/nodoctors.png" alt="No Doctor's note" className="mx-auto mb-2 h-[110px] w-[110px]"  />
                <div className="font-semibold text-gray-800 text-lg mb-1">No Doctor's note yet</div>
                <div className="text-xs text-gray-500 text-center mb-6">No doctor's notes have been recorded.</div>
                {/* <button
                  className="bg-blue-600 hover:bg-blue-700 text-white h-[48px] w-[316px] font-medium rounded-[8px] py-1 px-3 flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => handleForwardFiles(studentId)}
                  disabled={isForwarding}
                >
                  {isForwarding ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                      Forwarding...
                    </>
                  ) : (
                    <>
                      <img src='/image/Up-Right.png' alt='arrow' className='w-[22px] h-[22px]' />
                      Forward patient to Doctor
                    </>
                  )}
                </button> */}
              </div>
            );
          }
          return (
            <div className='h-[70%] p-6'>
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF] ">
                <div
                  className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                  onClick={() => setExpandedDoctorOpen(open => !open)}
                >
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">
                      {expandedPair?.doctor ? expandedPair.doctor.title : '-----'}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        {expandedPair?.doctor
                          ? `Dr. ${expandedPair.doctor.creator.firstName} ${expandedPair.doctor.creator.lastName}`
                          : 'Doctor —'}
                      </span>
                      {expandedPair?.doctor && expandedPair.doctor.createdAt ? (
                        <>
                          <span className="mx-1">•</span>
                          <span>{formatDate(expandedPair.doctor.createdAt)}</span>
                          <span className="mx-1">•</span>
                          <span>{formatTime(expandedPair.doctor.createdAt)}</span>
                        </>
                      ) : (
                        <>
                          <span className="mx-1">•</span>
                          <span>--</span>
                          <span className="mx-1">•</span>
                          <span>--</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-lg">
                    {expandedDoctorOpen ? '▾' : '▸'}
                  </span>
                </div>
                {expandedDoctorOpen && (
                  <div className="pt-3 bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                    <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                      <span className="font-medium text-xs text-gray-500">Tags:</span>
                      {(expandedPair?.doctor && expandedPair.doctor.tags && expandedPair.doctor.tags.length > 0) ? (
                        expandedPair.doctor.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-semibold border border-[#D1D5DB] bg-[#F3F6FF] text-[#1E40AF]"
                            style={{
                              borderColor: tagColors[i % tagColors.length],
                              color: tagColors[i % tagColors.length],
                              background: "#F3F6FF"
                            }}
                          >
                            {tag}
                          </span>
                                                  ))
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-line mt-4 px-5">
                      {expandedPair?.doctor
                        ? expandedPair.doctor.content
                        : (
                          <div className="flex flex-col items-center justify-center py-6 h-full">
                            <img src="/image/notes-empty.png" alt="No Doctor's note" className="mx-auto mb-2" style={{ width: 40, height: 40 }} />
                            <div className="font-semibold text-gray-700 text-base mb-1">No Doctor's note yet</div>
                            <div className="text-xs text-gray-500 text-center">No doctor's notes have been recorded.</div>
                          </div>
                        )
                      }
                    </div>
                    <div className="flex justify-end mt-4 w-full rounded-b-xl border-t-[0.8px] border-t-gray-300">
                      <div className="flex justify-end  mb-1  w-full rounded-b-xl">
                        <button onClick={() => downloadNotePDF(expandedPair?.doctor, 'doctor', formatDate, formatTime)} className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm">
                          <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                          Download note
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        case 'doctorexpand':
          if (!expandedPair?.doctor) {
            return (
              <div className="flex flex-col items-center justify-center h-[70%] p-8">
                <img src="/image/nodoctors.png" alt="No Doctor's note" className="mx-auto mb-2 h-[110px] w-[110px]"  />
                <div className="font-semibold text-gray-800 text-lg mb-1">No Doctor's note yet</div>
                <div className="text-xs text-gray-500 text-center mb-6">No doctor's notes have been recorded.</div>
                {/* <button
                  className="bg-blue-600 hover:bg-blue-700 text-white h-[48px] w-[316px] font-medium rounded-[8px] py-1 px-3 flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => handleForwardFiles(studentId)}
                  disabled={isForwarding}
                >
                  {isForwarding ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                      Forwarding...
                    </>
                  ) : (
                    <>
                      <img src='/image/Up-Right.png' alt='arrow' className='w-[22px] h-[22px]' />
                      Forward patient to Doctor
                    </>
                  )}
                </button> */}
              </div>
            );
          }
          return (
            <div className='h-[70%] p-6'>
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF] ">
                <div
                  className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                  onClick={() => setExpandedDoctorOpen(open => !open)}
                >
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">
                      {expandedPair?.doctor ? expandedPair.doctor.title : '-----'}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        {expandedPair?.doctor
                          ? `Dr. ${expandedPair.doctor.creator.firstName} ${expandedPair.doctor.creator.lastName}`
                          : 'Doctor —'}
                      </span>
                      {expandedPair?.doctor && expandedPair.doctor.createdAt ? (
                        <>
                          <span className="mx-1">•</span>
                          <span>{formatDate(expandedPair.doctor.createdAt)}</span>
                          <span className="mx-1">•</span>
                          <span>{formatTime(expandedPair.doctor.createdAt)}</span>
                        </>
                      ) : (
                        <>
                          <span className="mx-1">•</span>
                          <span>--</span>
                          <span className="mx-1">•</span>
                          <span>--</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-lg">
                    {expandedDoctorOpen ? '▾' : '▸'}
                  </span>
                </div>
                {expandedDoctorOpen && (
                  <div className="pt-3 bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                    <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                      <span className="font-medium text-xs text-gray-500">Tags:</span>
                      {(expandedPair?.doctor && expandedPair.doctor.tags && expandedPair.doctor.tags.length > 0) ? (
                        expandedPair.doctor.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-semibold border border-[#D1D5DB] bg-[#F3F6FF] text-[#1E40AF]"
                            style={{
                              borderColor: tagColors[i % tagColors.length],
                              color: tagColors[i % tagColors.length],
                              background: "#F3F6FF"
                            }}
                          >
                            {tag}
                          </span>
                      ))
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-line mt-4 px-5">
                      {expandedPair?.doctor
                        ? expandedPair.doctor.content
                        : (
                          <div className="flex flex-col items-center justify-center py-6 h-full">
                            <img src="/image/notes-empty.png" alt="No Doctor's note" className="mx-auto mb-2" style={{ width: 40, height: 40 }} />
                            <div className="font-semibold text-gray-700 text-base mb-1">No Doctor's note yet</div>
                            <div className="text-xs text-gray-500 text-center">No doctor's notes have been recorded.</div>
                          </div>
                        )
                      }
                    </div>
                    <div className="flex justify-end mt-4 w-full rounded-b-xl border-t-[0.8px] border-t-gray-300">
                      <div className="flex justify-end  mb-1  w-full rounded-b-xl">
                        <button onClick={() => downloadNotePDF(expandedPair?.doctor, 'doctor', formatDate, formatTime)} className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm">
                          <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                          Download note
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ); 
          case 'health':
          return (
             <div className='h-full flex flex-col '>
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                <form method='post' className='flex flex-col gap-3 text-[#898989]'>
                  <div className='flex flex-col gap-2 '>
                    <label className='text-[#898989]'>Diagnosis</label>
                    <input type='text' disabled placeholder='Enter diagnosis' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                  </div>
                  <div className='flex flex-col gap-2 '>
                    <label className='text-[#898989]'>Description</label>
                    <input type='text' disabled placeholder='Enter diagnosis description' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                  </div>
                  <div className='flex flex-col gap-2 '>
                    <label className='text-[#898989]'>Possible cause</label>
                    <input type='text' disabled placeholder='Enter possible cause' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                  </div>
                </form>
              </div>
              {/* Fixed footer button */}
              <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'>
                {/* <button
                  onClick={handleSaveHealthRecord}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save note'}
                </button> */}
              </div>
            </div>
          );
          case 'healthexpanded':
            return (
              <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] py-5">
                {healthRecordsLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-gray-500">Loading health records...</span>
                  </div>
                ) : !healthRecords || healthRecords.recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <img src="/image/nodoctors.png" alt="No health records" className="mx-auto mb-2 h-[110px] w-[110px]" />
                    <div className="font-semibold text-gray-800 text-lg mb-1">No Health Records</div>
                    <div className="text-xs text-gray-500 text-center">No health records have been recorded for this student.</div>
                  </div>
                ) : (
                  <>
                    {/* Recent Activity */}
                    {healthRecords.recentActivity.map((record, idx) => (
                      <div key={idx} className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                        <div
                          className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                          onClick={() => setIsHealthOpen(isHealthOpen === idx ? null : idx)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{record.diagnosis}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(record.date)} • {record.recordedBy.name}
                            </span>
                          </div>
                          <span className="text-lg transform transition-transform duration-300">
                            {isHealthOpen === idx ? '▾' : '▸'}
                          </span>
                        </div>

                        {isHealthOpen === idx && (
                          <div className="text-sm pl-4 pr-4 pt-2 pb-2 rounded-b-[8px] bg-white">
                            <div className="border-b last:border-b-0">
                              <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                                <span className="text-gray-700">Diagnosis</span>
                                <span className="font-medium text-gray-900">
                                  {record.diagnosis || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                                <span className="text-gray-700">Description</span>
                                {record.description ? (
                                  <button
                                    className="text-blue-600 font-medium hover:underline"
                                    type="button"
                                    onClick={() => {
                                      setDescriptionText(record.description);
                                      setShowDescriptionModal(true);
                                    }}
                                  >
                                    View
                                  </button>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </div>
                              <div className="flex justify-between py-3 ">
                                <span className="text-gray-700 mb-2">Possible Cause</span>
                                <span className="font-medium text-gray-900 text-sm">
                                  {record.possibleCause || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          case 'prescription':
          return (
            <div className='h-full flex flex-col' >
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
              <form method='post' className='flex flex-col gap-3 text-[#898989]'>
                <div className='flex flex-col gap-2 '>
                  <div className='flex items-center justify-between'>
                    <label className='text-[#898989]'>Medication</label>
                    <button className='flex gap-1 items-center justify-center cursor-pointer'>
                      <img src="/image/Plus{BLUE}.png" alt='plus' className='h-[24px] w-[24px]'/>
                      <h2 className='text-[#3B6FED]'>Add medication</h2>
                    </button>
                  </div>
                  <input type='text' disabled placeholder='Enter medication' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                </div>
                <div className='flex flex-col gap-2 '>
                  <label className='text-[#898989]'>Dosage</label>
                  <input type='text' disabled placeholder='Enter medication dosage' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                </div>
                <div className='flex flex-col gap-2 '>
                  <label className='text-[#898989]'>Instructions</label>
                  <input type='text' disabled placeholder='Give instructions for medication' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                </div>
              </form>
            </div>
              {/* Fixed footer button */}
              <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'>
                {/* <button
                  onClick={handleSaveprescription}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save note'}
                </button> */}
              </div>
            </div>
          );
          case 'prescriptionexpanded':
          return (
              <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] py-5">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-gray-500">Loading prescriptions...</span>
                  </div>
                ) : prescriptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <img src="/image/nodoctors.png" alt="No prescriptions" className="mx-auto mb-2 h-[110px] w-[110px]" />
                    <div className="font-semibold text-gray-800 text-lg mb-1">No Prescriptions</div>
                    <div className="text-xs text-gray-500 text-center">No prescriptions have been recorded for this student.</div>
                  </div>
                ) : (
                  prescriptions.map((prescription, idx) => (
                    <div key={idx} className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                      <div
                        className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                        onClick={() => setIsOpen1(isOpen1 === idx ? null : idx)}
                      >
                        <span className="font-medium text-sm">Prescription details {idx + 1} </span>
                        <span className="text-lg transform transition-transform duration-300">
                          {isOpen1 === idx ? '▾' : '▸'}
                        </span>
                      </div>

                      {isOpen1 === idx && (
                        <div className="text-sm pl-4 pr-4 pt-2 pb-2 rounded-b-[8px] bg-white">
                          <div className="border-b last:border-b-0">
                            <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                              <span className="text-gray-700">Medication</span>
                              <span className="font-medium text-gray-900">
                                {prescription.medication || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                              <span className="text-gray-700">Dosage</span>
                              <span className="font-medium text-gray-900">
                                {prescription.dosage || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 ">
                              <span className="text-gray-700">Instructions</span>
                              {prescription.instructions ? (
                                <button
                                  className="text-blue-600 font-medium hover:underline"
                                  type="button"
                                  onClick={() => {
                                    setInstructionsText(prescription.instructions);
                                    setShowInstructionsModal(true);
                                  }}
                                >
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                              <span className="text-gray-700">Medication 2</span>
                              <span className="font-medium text-gray-900">
                                {prescription.medication || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                              <span className="text-gray-700">Dosage</span>
                              <span className="font-medium text-gray-900">
                                {prescription.dosage || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 ">
                              <span className="text-gray-700">Instructions</span>
                              {prescription.instructions ? (
                                <button
                                  className="text-blue-600 font-medium hover:underline"
                                  type="button"
                                  onClick={() => {
                                    setInstructionsText(prescription.instructions);
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
                  ))
                )}
              </div>
          );
        default:
          return null;
      }
    }
    return null;
  };



  return (
    <div className='w-full flex flex-col h-fit rounded-xl border-gray-200 border-[0.8px] shadow-sm relative'>
      <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-xs mb-4 rounded-t-[12px]'>
        <div className='flex gap-3 items-center'>
          <img src='/image/notesicon.png' alt='icon' height={36} width={36} />
          <h1 className='font-medium text-lg'>Notes</h1>
        </div>
        {/* Add Note button in header */}
          {user && user.role === 'nurse' && (
            <button
              className='bg-blue-600 flex gap-[8px] h-[40px] px-4 items-center justify-center text-white rounded-[8px] hover:bg-blue-700'
              onClick={() => {
                setShowSidebar(true);
                setSelectedNoteType('nurse');
              }}
            >
              <img src='/image/Pluswhite.png' alt='icon' width={18} height={18} />
              <h1 className='text-[14px]'>Add Note</h1>
            </button>
          )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-10 p-3 items-stretch">
          {/* Show template if both nurse and doctor notes are empty */}
          {notePairs.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col gap-3 h-full w-1/2 col-span-2">
              {/* Nurse Note Empty Template */}
              <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-full  mb-4">
                <div className="flex items-start justify-between rounded-t-xl bg-[#E5FFEA] px-5 py-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">-----</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Nurse —</span>
                      <span className="mx-1">•</span>
                      <span>--</span>
                      <span className="mx-1">•</span>
                      <span>--</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 pt-3 pb-4 flex-1 flex flex-col items-center justify-center">
                  <img src="/image/nodoctors.png" alt="No Nurse's note" className="mx-auto mb-2" height={55} width={55} />
                  <div className="font-semibold text-gray-700 text-base mb-1">No Nurse's note yet</div>
                  <div className="text-xs text-gray-500 text-center">No nurse's notes have been recorded.</div>
                </div>
              </div>
              {/* Doctor Note Empty Template */}
              <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-full">
                <div className="flex items-start justify-between rounded-t-xl bg-[#F3F6FF] px-5 py-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">-----</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Doctor —</span>
                      <span className="mx-1">•</span>
                      <span>--</span>
                      <span className="mx-1">•</span>
                      <span>--</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 pt-3 pb-4 flex-1 flex flex-col items-center justify-center">
                  <img src="/image/nodoctors.png" alt="No Doctor's note" className="mx-auto mb-2" height={55} width={55} />
                  <div className="font-semibold text-gray-700 text-base mb-1">No Doctor's note yet</div>
                  <div className="text-xs text-gray-500 text-center">No doctor's notes have been recorded.</div>
                </div>
              </div>
            </div>
          )}
          {notePairs.map((pair, index) => {
            // Skip pairs that don't have a nurse note (orphaned doctor notes)
            if (!pair.nurse) return null;
            
            const nurseNote = pair.nurse;
            const doctorNoteForCard = pair.doctor;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col gap-3 h-full"
            >
              <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-full">
                <div className="flex items-start justify-between rounded-t-xl bg-[#E5FFEA] px-5 py-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">{nurseNote.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        {nurseNote.creator && nurseNote.creator.role === 'nurse'
                          ? `Nurse ${nurseNote.creator.firstName} ${nurseNote.creator.lastName}`
                          : 'Nurse —'}
                      </span>
                      {nurseNote.createdAt && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{getTodayDate(nurseNote.createdAt)}</span>
                          <span className="mx-1">•</span>
                          <span>{formatTime(nurseNote.createdAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => downloadNotePDF(nurseNote, 'nurse', formatDate, formatTime)} className="p-1 hover:bg-gray-200 rounded" title="Copy">
                      <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Open"
                      onClick={() => {
                        setExpandedPair({ nurse: nurseNote, doctor: doctorNoteForCard });
                        setShowExpandedSidebar(true);
                        setSelectedNoteType('nurseexpand');
                        setExpandedNurseOpen(true);
                        setExpandedDoctorOpen(false);
                      }}
                    >
                      <img src="/image/Expand.png" alt="expand" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="px-5 pt-3 pb-4 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-2 items-center">
                    <span className="font-medium text-xs text-gray-500">Tags:</span>
                    {(nurseNote.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-[#D1D5DB] bg-[#F3F6FF] text-[#1E40AF]"
                        style={{
                          borderColor: tagColors[i % tagColors.length],
                          color: tagColors[i % tagColors.length],
                          background: "#F3F6FF"
                        }}
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-700 flex-1 break-words   ">{nurseNote.content || nurseNote.body}</div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-full">
                <div className="flex items-start justify-between rounded-t-xl bg-[#F3F6FF] px-5 py-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">
                      {doctorNoteForCard ? doctorNoteForCard.title : '-----'}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        {doctorNoteForCard
                          ? `Dr. ${doctorNoteForCard.creator.firstName} ${doctorNoteForCard.creator.lastName}`
                          : 'Doctor —'}
                      </span>
                      {doctorNoteForCard && doctorNoteForCard.createdAt ? (
                        <>
                          <span className="mx-1">•</span>
                          <span>{getTodayDate(doctorNoteForCard.createdAt)}</span>
                          <span className="mx-1">•</span>
                          <span>{formatTime(doctorNoteForCard.createdAt)}</span>
                        </>
                      ) : (
                        <>
                          <span className="mx-1">•</span>
                          <span>--</span>
                          <span className="mx-1">•</span>
                          <span>--</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => downloadNotePDF(doctorNoteForCard, 'doctor', formatDate, formatTime)} className="p-1 hover:bg-gray-200 rounded" title="Copy">
                      <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Open"
                      onClick={() => {
                        setExpandedPair({ nurse: nurseNote, doctor: doctorNoteForCard });
                        setShowExpandedSidebar(true);
                        setSelectedNoteType('doctorexpand'); 
                        setExpandedNurseOpen(false);
                        setExpandedDoctorOpen(true);
                      }}
                    >
                      <img src="/image/Expand.png" alt="expand" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="px-5 pt-3 pb-4 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-2 items-center">
                    <span className="font-medium text-xs text-gray-500">Tags:</span>
                    {(doctorNoteForCard && doctorNoteForCard.tags && doctorNoteForCard.tags.length > 0) ? (
                      doctorNoteForCard.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-semibold border border-[#D1D5DB] bg-[#F3F6FF] text-[#1E40AF]"
                          style={{
                            borderColor: tagColors[i % tagColors.length],
                            color: tagColors[i % tagColors.length],
                            background: "#F3F6FF"
                          }}
                        >
                          {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 flex-1 break-words">
                    {doctorNoteForCard ? doctorNoteForCard.content : (
                      <div className="flex flex-col gap-2 items-center justify-center py-6 h-full">
                        <img src="/image/nodoctors.png" alt="No Doctor's note" className="mx-auto mb-2" height={55} width={55} />
                        <div className="font-semibold text-gray-700 text-base mb-1">No Doctor's note yet</div>
                        <div className="text-xs text-gray-500 text-center">No doctor's notes have been recorded.</div>
                        {user && user.role === 'doctor' && (
                          <button
                            className='bg-blue-600 flex gap-[8px] h-[40px] px-4 items-center justify-center text-white rounded-[8px] hover:bg-blue-700'
                            onClick={() => {
                              setShowSidebar(true);
                              setSelectedNoteType('doctor');
                            }}
                          >
                            <img src='/image/Pluswhite.png' alt='icon' width={18} height={18} />
                            <h1 className='text-[14px]'>Add Note</h1>
                          </button>
                        )}
                      </div>
                      
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Regular Add Note Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowSidebar(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-[60%] bg-white shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold">Add new note</h2>
              <button onClick={() => setShowSidebar(false)} className="text-xl">
                <img src='/image/exiticon.png' alt='exit' className='w-[28px] h-[28px]'/>
              </button>
            </div>
            <div className=' h-[56px] mt-5 mb-5 rounded-[12px] w-[95%] m-auto bg-[#FAFAFC] border-1px border-[#EBEBEB] flex items-center justify-between gap-1 p-2'>
              <div
                className={`w-1/4  h-full  flex items-center justify-center cursor-pointer ${selectedNoteType === 'nurse' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('nurse')}
              >
                <h3>Nurse's note</h3>
              </div>
              <div
                className={`w-1/4 h-full  flex items-center justify-center cursor-pointer ${selectedNoteType === 'doctor' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('doctor')}
              >
                <h3>Doctor's note</h3>
              </div>
              <div
                className={`w-1/4 h-full  flex items-center justify-center cursor-pointer ${selectedNoteType === 'health' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('health')}
              >
                <h3>Health issue</h3>
              </div>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'prescription' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('prescription')}
              >
                <h3>Prescription</h3>
              </div>
            </div>
            <div className=' h-[70%]'>
              {renderNoteTypeContent()}
            </div>
          </div>
        </div>
      )}

      {/* Expanded Note Sidebar */}
      {showExpandedSidebar && (
        <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowExpandedSidebar(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-[60%] bg-white shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold">View Notes</h2>
              <button onClick={() => setShowExpandedSidebar(false)} className="text-xl">
                <img src='/image/exiticon.png' alt='exit' className='w-[28px] h-[28px]'/>
              </button>
            </div>
            <div className=' h-[56px] mt-5 mb-5 rounded-[12px] w-[95%] m-auto bg-[#FAFAFC] border-1px border-[#EBEBEB] flex items-center justify-between gap-1 p-2'>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'nurseexpand' ? 'bg-white rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('nurseexpand')}
              >
                <h3>Nurse's note</h3>
              </div>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'doctorexpand' ? 'bg-white rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('doctorexpand')}
              >
                <h3>Doctor's note</h3>
              </div>
              <div
                className={`w-1/4 h-full  flex items-center justify-center cursor-pointer ${selectedNoteType === 'healthexpanded' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('healthexpanded')}
              >
                <h3>Health issue</h3>
              </div>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'prescriptionexpanded' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('prescriptionexpanded')}
              >
                <h3>Prescription</h3>
              </div>
            </div>
            <div className=' h-full'>
              {renderNoteTypeContent()}
            </div>
          </div>
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
          
          {/* Description Modal */}
          {showDescriptionModal && (
            <div className="fixed inset-0 z-50 bg-[#0C162F99] bg-opacity-50 flex items-center justify-center" onClick={() => setShowInstructionsModal(false)}>
              <div className="bg-white rounded-[12px]  max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <div className='border-[1px] rounded-t-[12px]  border-[#F0F2F5]  flex items-center justify-center p-4'>
                  <h3 className="text-lg font-semibold ">Description</h3>
                </div>
                <p className="text-gray-700 mb-4 py-5 px-3 ">{descriptionText}</p>
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
          )}
        </div>
        
      )}
    </div>
  );
}                