'use client';
import React, { useState, useEffect } from 'react';

const sampleTags = [
  'Follow-up', 'Malaria', 'Medications', 'Typhoid', 'Admitted', 'Discharged',
];

const tagColors = ['#1E40AF', '#059669', '#D97706', '#EAB308', '#A855F7', '#EF4444'];

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

  // For expanded note sidebar (pair: nurse & doctor)
  const [expandedPair, setExpandedPair] = useState(null);
  const [showExpandedSidebar, setShowExpandedSidebar] = useState(false);

  // For collapsible cards in expanded sidebar
  const [expandedNurseOpen, setExpandedNurseOpen] = useState(true);
  const [expandedDoctorOpen, setExpandedDoctorOpen] = useState(false);

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
      } else {
        alert('Failed to save note');
      }
    } catch (err) {
      alert('Error saving note');
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

  const nurseNotes = notes.filter(n => n.creator && n.creator.role === 'nurse');
  const doctorNotes = notes.filter(n => n.creator && n.creator.role === 'doctor');

  return (
    <div className='w-full flex flex-col h-fit rounded-xl border-gray-200 border-[0.8px] shadow-sm relative'>
      {/* Header */}
      <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-xs mb-4 rounded-t-[12px]'>
        <div className='flex gap-3 items-center'>
          <img src='/image/notesicon.png' alt='icon' height={36} width={36} />
          <h1 className='font-medium text-lg'>Notes</h1>
        </div>
        <button
          className='bg-blue-600 flex gap-[8px] w-[175px] h-[44px] items-center justify-center text-white rounded-[8px]'
          onClick={() => setShowSidebar(true)}
        >
          <img src='/image/Plus.png' alt='icon' width={25} height={25} />
          <h1 className='text-[16px]'>Add new Note</h1>
        </button>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-10 p-3 items-stretch">
        {nurseNotes.map((nurseNote, index) => {
          const doctorNoteForCard = doctorNotes[index];
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col gap-3 h-full"
            >
              {/* Nurse Note Section */}
              <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-full">
                {/* Header */}
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
                          <span>{formatDate(nurseNote.createdAt)}</span>
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
                {/* Tags and Content */}
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
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-700 flex-1">{nurseNote.content || nurseNote.body}</div>
                </div>
              </div>
              {/* Doctor Note Section */}
              <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-full">
                {/* Header */}
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
                          <span>{formatDate(doctorNoteForCard.createdAt)}</span>
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
                {/* Tags and Content */}
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
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 flex-1">
                    {doctorNoteForCard ? doctorNoteForCard.content : (
                      <div className="flex flex-col items-center justify-center py-6 h-full">
                        <img src="/image/notes-empty.png" alt="No Doctor's note" className="mx-auto mb-2" style={{ width: 40, height: 40 }} />
                        <div className="font-semibold text-gray-700 text-base mb-1">No Doctor’s note yet</div>
                        <div className="text-xs text-gray-500 text-center">No doctor’s notes have been recorded.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Note Sidebar (shows both nurse & doctor note for the card) */}
      {showExpandedSidebar && expandedPair && (
        <div className="fixed inset-0 z-50 bg-[#0C162F99]" onClick={() => setShowExpandedSidebar(false)}>
          <div
            className="absolute right-0 top-0 h-full w-[60%] bg-white shadow-lg z-50 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold">Note details</h2>
              <button onClick={() => setShowExpandedSidebar(false)} className="text-xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* Nurse Note Card */}
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF]">
                {/* Header */}
                <div
                  className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                  onClick={() => setExpandedNurseOpen(open => !open)}
                >
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">{expandedPair.nurse.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        {expandedPair.nurse.creator && expandedPair.nurse.creator.role === 'nurse'
                          ? `Nurse ${expandedPair.nurse.creator.firstName} ${expandedPair.nurse.creator.lastName}`
                          : 'Nurse —'}
                      </span>
                      {expandedPair.nurse.createdAt && (
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
                {/* Body */}
                {expandedNurseOpen && (
                  <div className=" pt-3  bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                    <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                      <span className="font-medium text-xs text-gray-500">Tags:</span>
                      {(expandedPair.nurse.tags || []).map((tag, i) => (
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
                      {expandedPair.nurse.content || expandedPair.nurse.body}
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

              {/* Doctor Note Card */}
              <div className="rounded-xl border border-gray-200 bg-[#F3F6FF]">
                {/* Header */}
                <div
                  className="flex justify-between items-center px-5 py-4 rounded-t-xl cursor-pointer"
                  onClick={() => setExpandedDoctorOpen(open => !open)}
                >
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">
                      {expandedPair.doctor ? expandedPair.doctor.title : '-----'}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        {expandedPair.doctor
                          ? `Dr. ${expandedPair.doctor.creator.firstName} ${expandedPair.doctor.creator.lastName}`
                          : 'Doctor —'}
                      </span>
                      {expandedPair.doctor && expandedPair.doctor.createdAt ? (
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
                {/* Body */}
                {expandedDoctorOpen && (
                  <div className=" pt-3  bg-[#FFFFFF] border-[0.8px] border-[#EBEBEB] rounded-b-xl">
                    <div className="flex flex-wrap gap-2 mb-2 items-center px-5">
                      <span className="font-medium text-xs text-gray-500">Tags:</span>
                      {(expandedPair.doctor && expandedPair.doctor.tags && expandedPair.doctor.tags.length > 0) ? (
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
                      {expandedPair.doctor
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
          </div>
        </div>
      )}

      {/* Sidebar Form */}
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

            <div className='min-h-[15%] pl-6 pr-6'>
              <div className='w-full h-[72px] mb-3'>
                <label className='text-sm font-medium block mb-1'>Title</label>
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
            </div>

            <div className='h-[60%] mt-5 pl-6 pr-6 w-full'>
              <div className="w-full h-[55vh] bg-white relative border-none text-[14px] leading-6">
                <div className="absolute inset-0 border-none" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #d1d5db 24px)" }} />
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
            <div className='min-h-[9%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-sm'>
              <button
                onClick={handleSaveNote}
                className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}