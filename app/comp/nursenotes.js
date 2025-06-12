import React, { useEffect, useState } from 'react';

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

  // Fetch notes from API when component mounts or studentId changes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`https://ehr-backend-4vx2.onrender.com/api/v1/notes/${studentId}`, {
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

  // Send note to API and update notes from API after save
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
      const res = await fetch('/api/v1/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Refetch notes from API after successful save
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-10 p-3">
        {notes.map((note, index) => (
          <div key={index} className="bg-white rounded shadow">
            <div className='flex bg-[rgba(243,246,255,1)] w-full border-[0.8px] border-[rgba(243,246,255,1)] shadow-b-sm p-3 rounded-t'>
              <div className='flex flex-col gap-2'>
                <h3 className="font-semibold text-lg">{note.title}</h3>
                <h3>nurse :</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 pl-4 pt-2">
              <h1>Tags :</h1>
              {(note.tags || []).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs text-white bg-blue-500"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-700 p-4">{note.content || note.body}</p>
          </div>
        ))}
      </div>

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

            <div className='h-[58%] pl-6 pr-6 w-full'>
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

            <div className='min-h-[8%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-sm'>
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