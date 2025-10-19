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
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [selectedColor, setSelectedColor] = useState(tagColors[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [description, setDescription] = useState("");
  const [possibleCause, setPossibleCause] = useState("");

  const [expandedPair, setExpandedPair] = useState(null);
  const [showExpandedSidebar, setShowExpandedSidebar] = useState(false);
  const [expandedNurseOpen, setExpandedNurseOpen] = useState(true);
  const [expandedDoctorOpen, setExpandedDoctorOpen] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState('nurse');
  const [isOpen1, setIsOpen1] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [instructionsText, setInstructionsText] = useState('');
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');
  const [isHealthOpen, setIsHealthOpen] = useState(null);
  const [medications, setMedications] = useState([
  { medication: '', dosage: '', instructions: '' }
  ]);
  
  // New state for linked records
  const [linkedRecords, setLinkedRecords] = useState({});
  const [currentNurseNoteId, setCurrentNurseNoteId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch linked records for a nurse note
  const fetchLinkedRecords = async (nurseNoteId) => {
    try {
      const res = await fetchWithAuth(`/api/v1/notes/nurse-note/${nurseNoteId}/linked-records`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching linked records:', err);
      return null;
    }
  };

  // Fetch notes and their linked records
  useEffect(() => {
    const fetchNotesAndLinkedRecords = async () => {
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
          const notesArray = Array.isArray(data) ? data : (data.data || []);
          setNotes(notesArray);
          
          // Fetch linked records for all nurse notes
          const nurseNotes = notesArray.filter(n => n.creator && n.creator.role === 'nurse');
          const linkedRecordsMap = {};
          
          for (const note of nurseNotes) {
            const linked = await fetchLinkedRecords(note.id);
            if (linked) {
              linkedRecordsMap[note.id] = linked;
            }
          }
          
          setLinkedRecords(linkedRecordsMap);
        } else {
          setNotes([]);
        }
      } catch (err) {
        setNotes([]);
      }
    };
    
    if (studentId) fetchNotesAndLinkedRecords();
  }, [studentId]);

    // Add handler to add new medication
  const handleAddMedication = () => {
    setMedications([...medications, { medication: '', dosage: '', instructions: '' }]);
  };

  // Add handler to remove medication
  const handleRemoveMedication = (index) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = medications.map((med, i) => {
      if (i === index) {
        return { ...med, [field]: value };
      }
      return med;
    });
    setMedications(updatedMedications);
  };

  const handleSavenurseNote = async () => {
    if (!noteTitle.trim() || !noteBody.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

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
        const createdNote = await res.json();
        
        // Refresh notes list
        const fetchRes = await fetch(`/api/v1/notes/${studentId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          const notesArray = Array.isArray(data) ? data : (data.data || []);
          setNotes(notesArray);
          
          // Fetch linked records for the new note
          const linked = await fetchLinkedRecords(createdNote.id);
          if (linked) {
            setLinkedRecords(prev => ({...prev, [createdNote.id]: linked}));
          }
        }
        
        toast.success('Note saved successfully!');
        setNoteTitle('');
        setNoteBody('');
        setSelectedTags([]);
        setShowSidebar(false);
        setShowTagSelector(false);
        setCustomTag('');
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
    if (!noteTitle.trim() || !noteBody.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (!currentNurseNoteId) {
      toast.error('Nurse note ID is required');
      return;
    }

    setIsSaving(true);

    const payload = {
      title: noteTitle.trim(),
      content: noteBody.trim(),
      tags: selectedTags.map(t => t.toLowerCase()),
      studentId: Number(studentId),
      noteType: "DOCTOR_NOTE",
      nurseNoteId: currentNurseNoteId
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
        // Refresh linked records
        const linked = await fetchLinkedRecords(currentNurseNoteId);
        if (linked) {
          setLinkedRecords(prev => ({...prev, [currentNurseNoteId]: linked}));
        }
        
        toast.success('Note saved successfully!');
        setNoteTitle('');
        setNoteBody('');
        setSelectedTags([]);
        setShowTagSelector(false);
        setCustomTag('');
        setSelectedNoteType('health')
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
    e.preventDefault();
    
    if (!currentNurseNoteId) {
      toast.error('Nurse note ID is required');
      return;
    }
    
    // Validate at least one medication has data
    const hasValidMedication = medications.some(
      med => med.medication.trim() || med.dosage.trim() || med.instructions.trim()
    );
    
    if (!hasValidMedication) {
      toast.error('Please fill in at least one medication');
      return;
    }
    
    setIsSaving(true);

    try {
      // Save each medication separately
      for (const med of medications) {
        if (med.medication.trim() || med.dosage.trim() || med.instructions.trim()) {
          const payload = {
            studentId: studentId,
            medication: med.medication,
            dosage: med.dosage,
            instructions: med.instructions,
            nurseNoteId: currentNurseNoteId
          };

          const res = await fetchWithAuth("/api/v1/prescriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) throw new Error("Failed to save prescription");
        }
      }

      // Refresh linked records
      const linked = await fetchLinkedRecords(currentNurseNoteId);
      if (linked) {
        setLinkedRecords(prev => ({...prev, [currentNurseNoteId]: linked}));
      }

      toast.success('Prescription(s) saved successfully!');
      setMedications([{ medication: '', dosage: '', instructions: '' }]);
      setShowSidebar(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save prescription!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHealthRecord = async (e) => {
    e.preventDefault();
    
    if (!currentNurseNoteId) {
      toast.error('Nurse note ID is required');
      return;
    }
    
    setIsSaving(true);

    const payload = {
      studentId: studentId,
      diagnosis,
      description,
      possibleCause,
      nurseNoteId: currentNurseNoteId
    };

    try {
      const res = await fetchWithAuth("/api/v1/health-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save health record");

      // Refresh linked records
      const linked = await fetchLinkedRecords(currentNurseNoteId);
      if (linked) {
        setLinkedRecords(prev => ({...prev, [currentNurseNoteId]: linked}));
      }

      toast.success('Health record saved successfully!');
      setDiagnosis("");
      setDescription("");
      setPossibleCause("");
      setSelectedNoteType('prescription');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save health record');
    } finally {
      setIsSaving(false);
    }
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

  const getTodayDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const nurseNotes = notes.filter(n => n.creator && n.creator.role === 'nurse');

  const renderNoteTypeContent = () => {
    if (!user) return null;

    if (user.role === 'doctor') {
      switch (selectedNoteType) {
        case 'nurse':
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
                        {expandedPair?.nurse?.creator
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
                  <span className="text-lg">{expandedNurseOpen ? '▾' : '▸'}</span>
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
                      {expandedPair?.nurse?.content}
                    </div>
                    <div className="flex justify-end mt-4 mb-1 border-t-[0.8px] border-t-gray-300 w-full rounded-b-xl">
                      <button 
                        onClick={() => downloadNotePDF(expandedPair?.nurse, 'nurse', formatDate, formatTime)} 
                        className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm"
                      >
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
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                <div className='w-full mb-5'>
                  <label className='text-sm text-[#898989] font-light block mb-1'>Title</label>
                  <input
                    type='text'
                    placeholder="Enter note title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className='h-[44px] border w-full rounded-[10px] bg-white outline-none border-gray-300 pl-3 text-[15px]'
                  />
                </div>

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
                        <img src="/image/smallPlus.png" className='w-[16px] h-[18px]' alt="plus" /> Add tag
                      </button>
                    </div>
                  </div>

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

                <div className='w-full min-h-[40vh]'>
                  <div className="w-full min-h-[40vh] bg-white relative border-none">
                    <div 
                      className="absolute inset-0 border-none pointer-events-none" 
                      style={{ 
                        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 24px, #d1d5db 24px, #d1d5db 25px)",
                        backgroundSize: "100% 25px"
                      }} 
                    />
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
          const doctorNotes = expandedPair?.doctorNotes || [];
          if (doctorNotes.length === 0) {
            return (
              <div className="flex flex-col gap-2 items-center justify-center h-[70%] p-8">
                <img src="/image/nodoctors.png" alt="No Doctor's note" className="mx-auto mb-2 h-[80px] w-[80px]" />
                <div className="font-semibold text-gray-800 text-lg mb-1">No Doctor's note yet</div>
                <div className="text-xs text-gray-500 text-center mb-6">No doctor's notes have been recorded.</div>
                {user && (
                  <button
                    className='bg-blue-600 flex gap-[8px] h-[40px] px-4 items-center justify-center text-white rounded-[8px] hover:bg-blue-700'
                    onClick={() => {
                      setShowSidebar(true);
                      setShowExpandedSidebar(false);
                      setSelectedNoteType('doctor');
                      setCurrentNurseNoteId(expandedPair?.nurse?.id);
                    }}
                  >
                    <img src='/image/Pluswhite.png' alt='icon' width={18} height={18} />
                    <h1 className='text-[14px]'>Add Note</h1>
                  </button>
                )}
              </div>
            );
          }

          return (
            <div className='h-[70%] p-6'>
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF]">
                <div
                  className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                  onClick={() => setExpandedDoctorOpen(open => !open)}
                >
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">{doctorNotes[0].title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Dr. {doctorNotes[0].creator.firstName} {doctorNotes[0].creator.lastName}</span>
                      <span className="mx-1">•</span>
                      <span>{formatDate(doctorNotes[0].createdAt)}</span>
                      <span className="mx-1">•</span>
                      <span>{formatTime(doctorNotes[0].createdAt)}</span>
                    </div>
                  </div>
                  <span className="text-lg">{expandedDoctorOpen ? '▾' : '▸'}</span>
                </div>
                {expandedDoctorOpen && (
                  <div className="pt-3 bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                    <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                      <span className="font-medium text-xs text-gray-500">Tags:</span>
                      {(doctorNotes[0].tags || []).map((tag, i) => (
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
                      {doctorNotes[0].content}
                    </div>
                    <div className="flex justify-end mt-4 w-full rounded-b-xl border-t-[0.8px] border-t-gray-300">
                      <button 
                        onClick={() => downloadNotePDF(doctorNotes[0], 'doctor', formatDate, formatTime)} 
                        className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm"
                      >
                        <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                        Download note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case 'health':
          return (
            <div className='h-full flex flex-col'>
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                <form className='flex flex-col gap-3 text-[#898989]'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#898989]'>Diagnosis</label>
                    <input 
                      type='text' 
                      placeholder='Enter diagnosis' 
                      value={diagnosis} 
                      onChange={(e) => setDiagnosis(e.target.value)} 
                      className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#898989]'>Description</label>
                    <input 
                      type='text' 
                      placeholder='Enter diagnosis description' 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#898989]'>Possible cause</label>
                    <input 
                      type='text' 
                      placeholder='Enter possible cause' 
                      value={possibleCause} 
                      onChange={(e) => setPossibleCause(e.target.value)} 
                      className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                    />
                  </div>
                </form>
              </div>
              <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'>
                <button
                  onClick={handleSaveHealthRecord}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-fit"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Health Issue'}
                </button>
              </div>
            </div>
          );

        case 'healthexpanded':
          const healthRecords = expandedPair?.healthRecords || [];
          return (
            <div className="h-full flex flex-col pl-7 pr-7 gap-[14px] py-5">
              {healthRecords.length === 0 ? (
                <div className='h-[75%] flex flex-col gap-10 '>
                  <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                    <form className='flex flex-col gap-3 text-[#898989]'>
                      <div className='flex flex-col gap-2'>
                        <label className='text-[#898989]'>Diagnosis</label>
                        <input 
                          type='text' 
                          placeholder='Enter diagnosis' 
                          value={diagnosis} 
                          onChange={(e) => setDiagnosis(e.target.value)} 
                          className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                        />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <label className='text-[#898989]'>Description</label>
                        <input 
                          type='text' 
                          placeholder='Enter diagnosis description' 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                        />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <label className='text-[#898989]'>Possible cause</label>
                        <input 
                          type='text' 
                          placeholder='Enter possible cause' 
                          value={possibleCause} 
                          onChange={(e) => setPossibleCause(e.target.value)} 
                          className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                        />
                      </div>
                    </form>
                  </div>
                  <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'>
                    <button
                      onClick={handleSaveHealthRecord}
                      className="bg-blue-600 text-white py-2 px-4 rounded w-fit mt-5"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Health Issue'}
                    </button>
                  </div>
                </div>
              ) : (
                healthRecords.map((record, idx) => (
                  <div key={idx} className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                    <div
                      className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                      onClick={() => setIsHealthOpen(isHealthOpen === idx ? null : idx)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{record.diagnosis}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(record.createdAt)} • {record.medicalStaff?.firstName} {record.medicalStaff?.lastName}
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
                            <span className="font-medium text-gray-900">{record.diagnosis || 'N/A'}</span>
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
                          <div className="flex justify-between py-3">
                            <span className="text-gray-700 mb-2">Possible Cause</span>
                            <span className="font-medium text-gray-900 text-sm">{record.possibleCause || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          );

        case 'prescription':
          return (
            <div className='h-full flex flex-col'>
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
              <form className='flex flex-col gap-3 text-[#898989]'>
                {medications.map((med, index) => (
                  <div key={index} className='border-b border-gray-200 pb-4 mb-4 last:border-b-0'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex justify-between items-center'>
                        <label className='text-[#898989]'>
                          Medication {index > 0 ? index + 1 : ''}
                        </label>
                        <div className='flex gap-3 items-center'>
                          {index === medications.length - 1 && (
                            <div 
                              className='flex gap-2 cursor-pointer' 
                              onClick={handleAddMedication}
                            >
                              <img src="/image/Plus{BLUE}.png" alt='plus img' className='h-[20px] w-[20px]'/>
                              <h2 className='text-[#3B6FED]'>Add medication</h2>
                            </div>
                          )}
                          {medications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMedication(index)}
                              className='text-red-500 text-xl hover:text-red-700'
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                      <input 
                        type='text' 
                        placeholder='Enter medication' 
                        value={med.medication} 
                        onChange={(e) => handleMedicationChange(index, 'medication', e.target.value)} 
                        className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                      />
                    </div>
                    <div className='flex flex-col gap-2 mt-3'>
                      <label className='text-[#898989]'>
                        Dosage {index > 0 ? index + 1 : ''}
                      </label>
                      <input 
                        type='text' 
                        placeholder='Enter medication dosage' 
                        value={med.dosage} 
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} 
                        className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                      />
                    </div>
                    <div className='flex flex-col gap-2 mt-3'>
                      <label className='text-[#898989]'>
                        Instructions {index > 0 ? index + 1 : ''}
                      </label>
                      <input 
                        type='text' 
                        placeholder='Give instructions for medication' 
                        value={med.instructions} 
                        onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)} 
                        className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                      />
                    </div>
                  </div>
                ))}
              </form>
              </div>
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
          const prescriptions = expandedPair?.prescriptions || [];
          return (
            <div className="h-full flex flex-col pl-7 pr-7  py-5">
              {prescriptions.length === 0 ? (
                <div className='h-[75%]  flex flex-col gap-10 '>
                  <div className='flex-1  overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                    <form className='flex flex-col gap-3 text-[#898989]'>
                      {medications.map((med, index) => (
                        <div key={index} className='border-b border-gray-200 pb-4 mb-4 last:border-b-0'>
                          <div className='flex flex-col gap-2'>
                            <div className='flex justify-between items-center'>
                              <label className='text-[#898989]'>
                                Medication {index > 0 ? index + 1 : ''}
                              </label>
                              <div className='flex gap-3 items-center'>
                                {index === medications.length - 1 && (
                                  <div 
                                    className='flex gap-2 cursor-pointer' 
                                    onClick={handleAddMedication}
                                  >
                                    <img src="/image/Plus{BLUE}.png" alt='plus img' className='h-[20px] w-[20px]'/>
                                    <h2 className='text-[#3B6FED]'>Add medication</h2>
                                  </div>
                                )}
                                {medications.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMedication(index)}
                                    className='text-red-500 text-xl hover:text-red-700'
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                            <input 
                              type='text' 
                              placeholder='Enter medication' 
                              value={med.medication} 
                              onChange={(e) => handleMedicationChange(index, 'medication', e.target.value)} 
                              className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                            />
                          </div>
                          <div className='flex flex-col gap-2 mt-3'>
                            <label className='text-[#898989]'>
                              Dosage {index > 0 ? index + 1 : ''}
                            </label>
                            <input 
                              type='text' 
                              placeholder='Enter medication dosage' 
                              value={med.dosage} 
                              onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} 
                              className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                            />
                          </div>
                          <div className='flex flex-col gap-2 mt-3'>
                            <label className='text-[#898989]'>
                              Instructions {index > 0 ? index + 1 : ''}
                            </label>
                            <input 
                              type='text' 
                              placeholder='Give instructions for medication' 
                              value={med.instructions} 
                              onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)} 
                              className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px] outline-none'
                            />
                          </div>
                        </div>
                      ))}
                    </form>
                  </div>
                  <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'>
                    <button
                      onClick={handleSaveprescription}
                      className="bg-blue-600 text-white py-2 px-4 mt-5 rounded fit"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Prescription'}
                    </button>
                  </div>
                </div>
              ) : (
                prescriptions.map((prescription, idx) => (
                  <div key={idx} className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                    <div
                      className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                      onClick={() => setIsOpen1(isOpen1 === idx ? null : idx)}
                    >
                      <span className="font-medium text-sm">Prescription details {idx + 1}</span>
                      <span className="text-lg transform transition-transform duration-300">
                        {isOpen1 === idx ? '▾' : '▸'}
                      </span>
                    </div>

                    {isOpen1 === idx && (
                      <div className="text-sm pl-4 pr-4 pt-2 pb-2 rounded-b-[8px] bg-white">
                        <div className="border-b last:border-b-0">
                          <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                            <span className="text-gray-700">Medication</span>
                            <span className="font-medium text-gray-900">{prescription.medication || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                            <span className="text-gray-700">Dosage</span>
                            <span className="font-medium text-gray-900">{prescription.dosage || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
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

    // Nurse role
    if (user.role === 'nurse') {
      switch (selectedNoteType) {
        case 'nurse':
          return (
            <div className='h-full flex flex-col'>
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                <div className='w-full mb-5'>
                  <label className='text-sm font-light text-[#898989] block mb-1'>Title</label>
                  <input
                    type='text'
                    placeholder="Enter note title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className='h-[44px] border w-full rounded-[10px] bg-white outline-none border-gray-300 pl-3 text-[15px]'
                  />
                </div>

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
                        <img src="/image/smallPlus.png" className='w-[16px] h-[18px]' alt="plus" /> Add tag
                      </button>
                    </div>
                  </div>

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

                <div className='w-full min-h-[40vh]'>
                  <div className="w-full min-h-[40vh] bg-white relative border-none">
                    <div 
                      className="absolute inset-0 border-none pointer-events-none" 
                      style={{ 
                        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 24px, #d1d5db 24px, #d1d5db 25px)",
                        backgroundSize: "100% 25px"
                      }} 
                    />
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
                        {expandedPair?.nurse?.creator
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
                  <span className="text-lg">{expandedNurseOpen ? '▾' : '▸'}</span>
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
                      {expandedPair?.nurse?.content}
                    </div>
                    <div className="flex justify-end mt-4 mb-1 border-t-[0.8px] border-t-gray-300 w-full rounded-b-xl">
                      <button 
                        onClick={() => downloadNotePDF(expandedPair?.nurse, 'nurse', formatDate, formatTime)} 
                        className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm"
                      >
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
        case 'doctorexpand':
          const nurseDocNotes = expandedPair?.doctorNotes || [];
          if (nurseDocNotes.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center h-[70%] p-8">
                <img src="/image/nodoctors.png" alt="No Doctor's note" className="mx-auto mb-2 h-[110px] w-[110px]" />
                <div className="font-semibold text-gray-800 text-lg mb-1">No Doctor's note yet</div>
                <div className="text-xs text-gray-500 text-center mb-6">No doctor's notes have been recorded.</div>
              </div>
            );
          }

          return (
            <div className='h-[70%] p-6'>
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF]">
                <div
                  className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                  onClick={() => setExpandedDoctorOpen(open => !open)}
                >
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">{nurseDocNotes[0].title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Dr. {nurseDocNotes[0].creator.firstName} {nurseDocNotes[0].creator.lastName}</span>
                      <span className="mx-1">•</span>
                      <span>{formatDate(nurseDocNotes[0].createdAt)}</span>
                      <span className="mx-1">•</span>
                      <span>{formatTime(nurseDocNotes[0].createdAt)}</span>
                    </div>
                  </div>
                  <span className="text-lg">{expandedDoctorOpen ? '▾' : '▸'}</span>
                </div>
                {expandedDoctorOpen && (
                  <div className="pt-3 bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                    <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                      <span className="font-medium text-xs text-gray-500">Tags:</span>
                      {(nurseDocNotes[0].tags || []).map((tag, i) => (
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
                      {nurseDocNotes[0].content}
                    </div>
                    <div className="flex justify-end mt-4 w-full rounded-b-xl border-t-[0.8px] border-t-gray-300">
                      <button 
                        onClick={() => downloadNotePDF(nurseDocNotes[0], 'doctor', formatDate, formatTime)} 
                        className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm"
                      >
                        <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                        Download note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case 'health':
          return (
            <div className='h-full flex flex-col'>
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                <form className='flex flex-col gap-3 text-[#898989]'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#898989]'>Diagnosis</label>
                    <input type='text' disabled placeholder='Enter diagnosis' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]' />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#898989]'>Description</label>
                    <input type='text' disabled placeholder='Enter diagnosis description' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]' />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#898989]'>Possible cause</label>
                    <input type='text' disabled placeholder='Enter possible cause' className='pl-3 h-[52px] w-full border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]' />
                  </div>
                </form>
              </div>
              <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'></div>
            </div>
          );

        case 'healthexpanded':
          const nurseHealthRecords = expandedPair?.healthRecords || [];
          return (
            <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] py-5">
              {nurseHealthRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <img src="/image/nodoctors.png" alt="No health records" className="mx-auto mb-2 h-[110px] w-[110px]" />
                  <div className="font-semibold text-gray-800 text-lg mb-1">No Health Records</div>
                  <div className="text-xs text-gray-500 text-center">No health records have been recorded for this student.</div>
                </div>
              ) : (
                nurseHealthRecords.map((record, idx) => (
                  <div key={idx} className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                    <div
                      className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                      onClick={() => setIsHealthOpen(isHealthOpen === idx ? null : idx)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{record.diagnosis}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(record.createdAt)} • {record.medicalStaff?.firstName} {record.medicalStaff?.lastName}
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
                            <span className="font-medium text-gray-900">{record.diagnosis || 'N/A'}</span>
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
                          <div className="flex justify-between py-3">
                            <span className="text-gray-700 mb-2">Possible Cause</span>
                            <span className="font-medium text-gray-900 text-sm">{record.possibleCause || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          );

        case 'prescription':
          return (
            <div className='h-full flex flex-col'>
              <div className='flex-1 overflow-y-auto pt-6 pb-4 pl-6 pr-6'>
                <form className='flex flex-col gap-3 text-[#898989]'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                      <label className='text-[#898989]'>Medication</label>
                      <div className='flex gap-2'>
                        <img src="/image/Plus{BLUE}.png" alt='plus img' className='h-[20px] w-[20]'/>
                        <h2 className='text-[#3B6FED]'>Add medication</h2>
                      </div>
                    </div>
                    <input type='text' disabled placeholder='Enter medication' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]' />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#898989]'>Dosage</label>
                    <input type='text' disabled placeholder='Enter medication dosage' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]' />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#898989]'>Instructions</label>
                    <input type='text' disabled placeholder='Give instructions for medication' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]' />
                  </div>
                </form>
              </div>
              <div className='min-h-[10%] bg-white w-full flex justify-end items-center border-t-[1px] pr-6 border-t-gray-200 shadow-t-sm'></div>
            </div>
          );

        case 'prescriptionexpanded':
          const nursePrescriptions = expandedPair?.prescriptions || [];
          return (
            <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] py-5">
              {nursePrescriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <img src="/image/nodoctors.png" alt="No prescriptions" className="mx-auto mb-2 h-[110px] w-[110px]" />
                  <div className="font-semibold text-gray-800 text-lg mb-1">No Prescriptions</div>
                  <div className="text-xs text-gray-500 text-center">No prescriptions have been recorded for this student.</div>
                </div>
              ) : (
                nursePrescriptions.map((prescription, idx) => (
                  <div key={idx} className="w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                    <div
                      className="px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] items-center bg-[rgba(243,246,255,1)]"
                      onClick={() => setIsOpen1(isOpen1 === idx ? null : idx)}
                    >
                      <span className="font-medium text-sm">Prescription details {idx + 1}</span>
                      <span className="text-lg transform transition-transform duration-300">
                        {isOpen1 === idx ? '▾' : '▸'}
                      </span>
                    </div>

                    {isOpen1 === idx && (
                      <div className="text-sm pl-4 pr-4 pt-2 pb-2 rounded-b-[8px] bg-white">
                        <div className="border-b last:border-b-0">
                          <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                            <span className="text-gray-700">Medication</span>
                            <span className="font-medium text-gray-900">{prescription.medication || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b-[#EBEBEB] border-b-[0.8px]">
                            <span className="text-gray-700">Dosage</span>
                            <span className="font-medium text-gray-900">{prescription.dosage || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
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
        {nurseNotes.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col gap-3 h-full w-1/2 col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-full mb-4">
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

        {nurseNotes.map((nurseNote, index) => {
          const linked = linkedRecords[nurseNote.id] || {};
          const doctorNotes = linked.doctorNotes || [];
          const healthRecords = linked.healthRecords || [];
          const prescriptions = linked.prescriptions || [];

          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col gap-3 h-full"
            >
              {/* Nurse Note Card */}
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
                    <button 
                      onClick={() => downloadNotePDF(nurseNote, 'nurse', formatDate, formatTime)} 
                      className="p-1 hover:bg-gray-200 rounded" 
                      title="Download"
                    >
                      <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Open"
                      onClick={() => {
                        setExpandedPair({ 
                          nurse: nurseNote, 
                          doctorNotes: doctorNotes,
                          healthRecords: healthRecords,
                          prescriptions: prescriptions
                        });
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
                  <div className="text-sm text-gray-700 flex-1 break-words">{nurseNote.content}</div>
                </div>
              </div>

              {/* Doctor Note Card */}
              <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-full">
                <div className="flex items-start justify-between rounded-t-xl bg-[#F3F6FF] px-5 py-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">
                      {doctorNotes[0] ? doctorNotes[0].title : '-----'}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        {doctorNotes[0]
                          ? `Dr. ${doctorNotes[0].creator.firstName} ${doctorNotes[0].creator.lastName}`
                          : 'Doctor —'}
                      </span>
                      {doctorNotes[0]?.createdAt ? (
                        <>
                          <span className="mx-1">•</span>
                          <span>{getTodayDate(doctorNotes[0].createdAt)}</span>
                          <span className="mx-1">•</span>
                          <span>{formatTime(doctorNotes[0].createdAt)}</span>
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
                    <button 
                      onClick={() => downloadNotePDF(doctorNotes[0], 'doctor', formatDate, formatTime)} 
                      className="p-1 hover:bg-gray-200 rounded" 
                      title="Download"
                    >
                      <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Open"
                      onClick={() => {
                        setExpandedPair({ 
                          nurse: nurseNote, 
                          doctorNotes: doctorNotes,
                          healthRecords: healthRecords,
                          prescriptions: prescriptions
                        });
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
                    {(doctorNotes[0]?.tags || []).map((tag, i) => (
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
                  <div className="text-sm text-gray-700 flex-1 break-words">
                    {doctorNotes[0] ? doctorNotes[0].content : (
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
                              setCurrentNurseNoteId(nurseNote.id);
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
            <div className='h-[56px] mt-5 mb-5 rounded-[12px] w-[95%] m-auto bg-[#FAFAFC] border-1px border-[#EBEBEB] flex items-center justify-between gap-1 p-2'>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'nurse' ? 'rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('nurse')}
              >
                <h3>Nurse's note</h3>
              </div>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'doctor' ? 'rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('doctor')}
              >
                <h3>Doctor's note</h3>
              </div>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'health' ? 'rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('health')}
              >
                <h3>Health issue</h3>
              </div>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'prescription' ? 'rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('prescription')}
              >
                <h3>Prescription</h3>
              </div>
            </div>
            <div className='h-[70%]'>
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
            <div className='h-[56px] mt-5 mb-5 rounded-[12px] w-[95%] m-auto bg-[#FAFAFC] border-1px border-[#EBEBEB] flex items-center justify-between gap-1 p-2'>
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
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'healthexpanded' ? 'rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('healthexpanded')}
              >
                <h3>Health issue</h3>
              </div>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'prescriptionexpanded' ? 'rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB] text-[#0072C3]' : ''}`}
                onClick={() => setSelectedNoteType('prescriptionexpanded')}
              >
                <h3>Prescription</h3>
              </div>
            </div>
            <div className='h-full'>
              {renderNoteTypeContent()}
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 bg-[#0C162F99] flex items-center justify-center" onClick={() => setShowInstructionsModal(false)}>
          <div className=' w-[400px] flex items-center flex-col'>
            <div className=' w-[480px] h-10 flex items-center justify-end'>
              <img src='/image/exiticon.png' alt='Exiticon' className='h-[28px] w-[28px]'/>
            </div>
            <div className="bg-white rounded-[12px] max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className='border-[1px] rounded-t-[12px] border-[#F0F2F5] flex items-center justify-center p-4'>
                <h3 className="text-lg font-semibold">Instructions</h3>
              </div>
              <p className="text-gray-700 mb-4 py-5 px-3">{instructionsText}</p>
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
        </div>
      )}

      {/* Description Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0 z-50 bg-[#0C162F99] flex items-center justify-center" onClick={() => setShowDescriptionModal(false)}>
          <div className=' w-[400px]  flex items-center flex-col'>
            <div className='w-[480px]  h-10 flex items-center justify-end'>
              <img src='/image/exiticon.png' alt='Exiticon' className='h-[28px]  w-[28px]'/>
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
  );
}