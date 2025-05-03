import React, { useState } from 'react';

const sampleTags = [
  { label: "Follow-up", color: "blue" },
  { label: "Malaria", color: "blue" },
  { label: "Medications", color: "blue" },
  { label: "Typhoid", color: "blue" },
  { label: "Admitted", color: "red" },
  { label: "Cough", color: "blue" },
  { label: "Discharged", color: "green" },
];

export default function NoteManager() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [tags, setTags] = useState([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return;
    const newNote = { title: noteTitle.trim(), tags, body: noteBody.trim() };
    setNotes([...notes, newNote]);
    setNoteTitle('');
    setNoteBody('');
    setTags([]);
    setShowSidebar(false);
    setShowTagSelector(false);
    setSelectedTag('');
  };


  

  const handleAddTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
    setSelectedTag('');
    setShowTagSelector(false);
  };

  return (
    <div className='w-full flex flex-col h-fit rounded-xl border-gray-200 border-[0.8px] shadow-sm relative'>
      {/* Header */}
      <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-sm mb-4'>
        <div className='flex gap-3 items-center'>
          <img src='/image/usericon.png' alt='icon' height={36} width={36} />
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
          <div key={index} className="bg-white  rounded shadow">
            <div className=' flex bg-[rgba(243,246,255,1)] w-full border-[0.8px] border-[rgba(243,246,255,1)] shadow-b-sm  p-3 rounded-t '>
                <div className='flex flex-col gap-2'>
                    <h3 className="font-semibold text-lg">{note.title}</h3>
                    <h3>nurse :</h3>
                </div>
                <div></div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 pl-4 pt-2">
                <h1>Tags :</h1>
              {note.tags.map((tag, i) => {
                const tagInfo = sampleTags.find((t) => t.label === tag);
                const color = tagInfo?.color || "gray";
                return (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs text-white bg-${color}-500`}
                  >
                 {tag}
                  </span>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-gray-700 p-4">{note.body}</p>
          </div>
        ))}
      </div>

      {/* Sidebar Form */}
      {showSidebar && (
        <div className="fixed inset-0 bg-amber-100 bg-opacity-20 z-40" onClick={() => setShowSidebar(false)}>
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

              {/* Selected Tags */}
              <div className='mb-3'>
                <h1 className='text-sm font-medium mb-2'>Tags:</h1>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {tags.map((tag, i) => {
                    const tagInfo = sampleTags.find((t) => t.label === tag);
                    const color = tagInfo?.color || "gray";
                    return (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-xs text-white bg-${color}-500`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>

                {/* Add Tag Button */}
                <div
                  className='flex bg-gray-100 rounded-2xl w-[103px] p-1.5 items-center justify-center gap-1 border-[0.8px] border-[rgba(98, 98, 98, 1)] cursor-pointer'
                  onClick={() => setShowTagSelector(true)}
                >
                  <img src='/image/Plus.png' alt='img' height={16} width={16}/>
                  <h1 className='text-[12px]'>Add Tag</h1>
                </div>

                {/* Tag Selector */}
                {showTagSelector && (
                  <div className='mt-3 flex gap-2 items-center'>
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className='border border-gray-300 rounded px-3 py-1 text-sm'
                    >
                      <option value="">Select a tag</option>
                      {sampleTags.map(tag => (
                        <option key={tag.label} value={tag.label}>{tag.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddTag}
                      className='bg-blue-600 text-white px-3 py-1 rounded text-sm'
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Lined Textarea (not saved) */}
            <div className='h-[58%] pl-6 pr-6 w-full'>
              <div className="w-full h-[55vh] bg-white relative border-none text-[14px] leading-6">
                <div className="absolute inset-0 border-none" style={{ backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #d1d5db 24px)` }} />
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

            {/* Footer Save Button */}
            <div className='min-h-[8%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-sm'>
              <button
                onClick={handleSaveNote}
                className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
              >
                Save note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
