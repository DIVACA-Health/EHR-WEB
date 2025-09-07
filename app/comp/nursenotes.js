'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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

  const [expandedPair, setExpandedPair] = useState(null);
  const [showExpandedSidebar, setShowExpandedSidebar] = useState(false);
  const [expandedNurseOpen, setExpandedNurseOpen] = useState(true);
  const [expandedDoctorOpen, setExpandedDoctorOpen] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState('nurse');

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

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteBody.trim()) return;

    setIsSaving(true);

    const payload = {
      title: noteTitle.trim(),
      content: noteBody.trim(),
      tags: selectedTags.map(t => t.toLowerCase()),
      studentId: Number(studentId),
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('User role:', user.role);
    }
  }, [user]);

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
                    <button className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm">
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
            <div className=' h-full'>
              <div className='p-6 h-[70%]'>
                <div className='w-full h-[72px] mb-3'>
                <label className='text-sm font-medium block mb-1'>Note Title</label>
                <input
                  type='text'
                  placeholder="Enter note title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className='h-[44px] border w-full rounded-[10px] bg-white outline-none border-gray-300 pl-3 text-[15px] text-medium'
                />
              </div>
              <div className='mb-3'>
                <h1 className='text-sm font-medium mb-2'>Tags:</h1>
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
                    className="flex items-center px-2 py-1 border rounded-full text-xs text-gray-700 bg-gray-100"
                    onClick={() => setShowTagSelector(!showTagSelector)}
                    type="button"
                  >
                    <span className="mr-1">＋</span> Add tag
                  </button>
                </div>
                {showTagSelector && (
                  <div className="p-4 border rounded max-w-md bg-white shadow">
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
                      className="mb-2 px-2 py-1 border rounded text-sm"
                    >
                      Add tag
                    </button>
                    <div>
                      {sampleTags.map((tag) => (
                        <div
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`cursor-pointer px-3 py-2 border-b flex items-center ${
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
              <div className='h-[90%] mt-5 pl-3 pr-3 w-full'>
                <div className="w-full h-[80%] bg-white relative border-none text-[14px] leading-5">
                  <div className="absolute inset-0 border-none" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #d1d5db 25px)" }} />
                  <div className="relative z-10 h-full border-none">
                    <textarea
                      className="w-full h-full resize-none bg-transparent outline-none border-none"
                      placeholder="Write your note here..."
                      value={noteBody}
                      onChange={(e) => setNoteBody(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              </div>
              <div className='min-h-[10%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-sm'>
                <button
                  onClick={handleSaveNote}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save note'}
                </button>
              </div>
            </div>
          );
          case 'health':
          return (
            <div className='h-full '>
              <div className='h-[70%] p-6 '>
                <form method='post' className='flex flex-col gap-3'>
                  <div className='flex flex-col gap-2 '>
                    <label>Diagnosis</label>
                    <input type='text' placeholder='Enter diagnosis' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px]'></input>
                  </div>
                  <div className='flex flex-col gap-2 '>
                    <label>Description</label>
                    <input type='text' placeholder='Enter diagnosis description' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px]'></input>
                  </div>
                  <div className='flex flex-col gap-2 '>
                    <label>Possible cause</label>
                    <input type='text' placeholder='Enter possible cause' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px]'></input>
                  </div>
                </form>
              </div>
              <div className='min-h-[10%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-sm'>
                <button
                  onClick={handleSaveNote}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Issue'}
                </button>
              </div>
            </div>
          );
          case 'prescription':
          return (
            <div className='h-full' >
              <div className='h-[70%] p-6'>
              <form method='post' className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2 '>
                  <label>Medication</label>
                  <input type='text' placeholder='Enter medication' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px]'></input>
                </div>
                <div className='flex flex-col gap-2 '>
                  <label>Dosage</label>
                  <input type='text' placeholder='Enter medication dosage' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px]'></input>
                </div>
                <div className='flex flex-col gap-2 '>
                  <label>Instructions</label>
                  <input type='text' placeholder='Give instructions for medication' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#FFFFFF] rounded-[12px]'></input>
                </div>
              </form>
            </div>
            <div className='min-h-[10%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-sm'>
                <button
                  onClick={handleSaveNote}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Prescription'}
                </button>
            </div>
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
            <div className=' h-full'>
              <div className='p-6 h-[70%]'>
                <div className='w-full h-[72px] mb-3'>
                <label className='text-sm font-medium block mb-1'>Nurse Note Title</label>
                <input
                  type='text'
                  placeholder="Enter note title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className='h-[44px] border w-full rounded-[10px] bg-white outline-none border-gray-300 pl-3 text-[15px] text-medium'
                />
              </div>
              <div className='mb-3'>
                <h1 className='text-sm font-medium mb-2'>Tags:</h1>
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
                    className="flex items-center px-2 py-1 border rounded-full text-xs text-gray-700 bg-gray-100"
                    onClick={() => setShowTagSelector(!showTagSelector)}
                    type="button"
                  >
                    <span className="mr-1">＋</span> Add tag
                  </button>
                </div>
                {showTagSelector && (
                  <div className="p-4 border rounded max-w-md bg-white shadow">
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
                      className="mb-2 px-2 py-1 border rounded text-sm"
                    >
                      Add tag
                    </button>
                    <div>
                      {sampleTags.map((tag) => (
                        <div
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`cursor-pointer px-3 py-2 border-b flex items-center ${
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
              <div className='h-[90%] mt-5 pl-3 pr-3 w-full'>
                <div className="w-full h-[80%] bg-white relative border-none text-[14px] leading-5">
                  <div className="absolute inset-0 border-none" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #d1d5db 25px)" }} />
                  <div className="relative z-10 h-full border-none">
                    <textarea
                      className="w-full h-full resize-none bg-transparent outline-none border-none"
                      placeholder="Write your note here..."
                      value={noteBody}
                      onChange={(e) => setNoteBody(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              </div>
              <div className='min-h-[10%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-sm'>
                <button
                  onClick={handleSaveNote}
                  className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save note'}
                </button>
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
                <button
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
                </button>
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
                            <div className="font-semibold text-gray-700 text-base mb-1">No Doctor’s note yet</div>
                            <div className="text-xs text-gray-500 text-center">No doctor’s notes have been recorded.</div>
                          </div>
                        )
                      }
                    </div>
                    <div className="flex justify-end mt-4 w-full rounded-b-xl border-t-[0.8px] border-t-gray-300">
                      <div className="flex justify-end  mb-1  w-full rounded-b-xl">
                        <button className="flex items-center gap-2 px-4 py-2 mr-5 mt-2 rounded bg-[#E5EFFF] text-[#1E40AF] font-medium text-sm">
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
             <div className='h-full '>
              <div className='h-[70%] p-6 '>
                <form method='post' className='flex flex-col gap-3'>
                  <div className='flex flex-col gap-2 '>
                    <label>Diagnosis</label>
                    <input type='text' disabled placeholder='Enter diagnosis' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                  </div>
                  <div className='flex flex-col gap-2 '>
                    <label>Description</label>
                    <input type='text' disabled placeholder='Enter diagnosis description' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                  </div>
                  <div className='flex flex-col gap-2 '>
                    <label>Possible cause</label>
                    <input type='text' disabled placeholder='Enter possible cause' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                  </div>
                </form>
              </div>
              <div className='min-h-[10%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-sm'>
              </div>
            </div>
          );
          case 'prescription':
          return (
            <div className='h-full' >
              <div className='h-[70%] p-6'>
              <form method='post' className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2 '>
                  <label>Medication</label>
                  <input type='text' disabled placeholder='Enter medication' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                </div>
                <div className='flex flex-col gap-2 '>
                  <label>Dosage</label>
                  <input type='text' disabled placeholder='Enter medication dosage' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                </div>
                <div className='flex flex-col gap-2 '>
                  <label>Instructions</label>
                  <input type='text' disabled placeholder='Give instructions for medication' className='pl-3 h-[52px] w-full border-[1px] border-[#D0D5DD] bg-[#EFEFEF] rounded-[12px]'></input>
                </div>
              </form>
            </div>
            <div className='min-h-[10%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-sm'>
            </div>
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-10 p-3 items-stretch">
          {/* Show template if both nurse and doctor notes are empty */}
          {nurseNotes.length === 0 && doctorNotes.length === 0 && (
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
                  <div className="font-semibold text-gray-700 text-base mb-1">No Nurse’s note yet</div>
                  <div className="text-xs text-gray-500 text-center">No nurse’s notes have been recorded.</div>
                  {user?.role === 'nurse' && (
                    <div className='h-10 w-full flex items-center justify-center mt-3'>
                      <button
                        className='bg-blue-600 flex gap-[8px] w-[128px] h-full items-center justify-center text-white rounded-[8px]'
                        onClick={() => setShowSidebar(true)}
                      >
                        <img src='/image/Pluswhite.png' alt='icon' width={18} height={18} />
                        <h1 className='text-[16px]'>Add Note</h1>
                      </button>
                    </div>
                  )}
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
                  <div className="font-semibold text-gray-700 text-base mb-1">No Doctor’s note yet</div>
                  <div className="text-xs text-gray-500 text-center">No doctor’s notes have been recorded.</div>
                  {user?.role === 'doctor' && (
                    <div className='h-10 w-full flex items-center justify-center mt-3'>
                      <button
                        className='bg-blue-600 flex gap-[8px] w-[128px] h-full items-center justify-center text-white rounded-[8px]'
                        onClick={() => setShowSidebar(true)}
                      >
                        <img src='/image/Pluswhite.png' alt='icon' width={18} height={18} />
                        <h1 className='text-[16px]'>Add Note</h1>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        {nurseNotes.map((nurseNote, index) => {
          const doctorNoteForCard = doctorNotes[index];
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
                    <button className="p-1 hover:bg-gray-200 rounded" title="Copy">
                      <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Open"
                      onClick={() => {
                        setExpandedPair({ nurse: nurseNote, doctor: doctorNoteForCard });
                        setShowExpandedSidebar(true);
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
                  <div className="text-sm text-gray-700 flex-1">{nurseNote.content || nurseNote.body}</div>
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
                    <button className="p-1 hover:bg-gray-200 rounded" title="Copy">
                      <img src="/image/Downloadnote.png" alt="download" className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Open"
                      onClick={() => {
                        setExpandedPair({ nurse: nurseNote, doctor: doctorNoteForCard });
                        setShowExpandedSidebar(true);
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
                  <div className="text-sm text-gray-700 flex-1">
                    {doctorNoteForCard ? doctorNoteForCard.content : (
                      <div className="flex flex-col items-center justify-center py-6 h-full">
                        <img src="/image/nodoctors.png" alt="No Doctor's note" className="mx-auto mb-2" height={55} width={55} />
                        <div className="font-semibold text-gray-700 text-base mb-1">No Doctor’s note yet</div>
                        <div className="text-xs text-gray-500 text-center">No doctor’s notes have been recorded.</div>
                        {user?.role !== 'nurse' && (
                          <div className=' h-10 w-full flex items-center justify-center mt-3'>
                            <button
                              className='bg-blue-600 flex gap-[8px] w-[128px] h-full items-center justify-center text-white rounded-[8px]'
                              onClick={() => setShowSidebar(true)}
                            >
                              <img src='/image/Pluswhite.png' alt='icon' width={18} height={18} />
                              <h1 className='text-[16px]'>Add Note</h1>
                            </button>
                          </div>
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
      {showSidebar && (
        <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowSidebar(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-[60%] bg-white shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold">Add new note</h2>
              <button onClick={() => setShowSidebar(false)} className="text-xl">×</button>
            </div>
            <div className=' h-[56px] mt-5 mb-5 rounded-[12px] w-[95%] m-auto bg-[#FAFAFC] border-1px border-[#EBEBEB] flex items-center justify-between gap-1 p-2'>
              <div
                className={`w-1/4  h-full  flex items-center justify-center cursor-pointer ${selectedNoteType === 'nurse' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB]' : ''}`}
                onClick={() => setSelectedNoteType('nurse')}
              >
                <h3>Nurse's note</h3>
              </div>
              <div
                className={`w-1/4 h-full  flex items-center justify-center cursor-pointer ${selectedNoteType === 'doctor' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB]' : ''}`}
                onClick={() => setSelectedNoteType('doctor')}
              >
                <h3>Doctor's note</h3>
              </div>
              <div
                className={`w-1/4 h-full  flex items-center justify-center cursor-pointer ${selectedNoteType === 'health' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB]' : ''}`}
                onClick={() => setSelectedNoteType('health')}
              >
                <h3>Health issue</h3>
              </div>
              <div
                className={`w-1/4 h-full flex items-center justify-center cursor-pointer ${selectedNoteType === 'prescription' ? ' rounded-[8px] shadow-xs shadow-[#B4B4B41F] border-1 border-[#EBEBEB]' : ''}`}
                onClick={() => setSelectedNoteType('prescription')}
              >
                <h3>Prescription</h3>
              </div>
            </div>
            <div className=' h-full'>
              {renderNoteTypeContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}