import React, { useState } from 'react';

export default function NoteManager() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [tags, setTags] = useState([]);

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return;
    const newNote = { title: noteTitle.trim(), tags };
    setNotes([...notes, newNote]);
    setNoteTitle('');
    setTags([]);
    setShowSidebar(false);
  };

  return (
    <div className=' w-full flex flex-col h-fit rounded-xl border relative '>
      {/* Header */}
        <div className='h-[70px]  w-full  flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-[rgba(235, 235, 235, 1)] mb-4'>
            <div className='flex gap-3 items-center'>
                <div>
                    <img src='/image/usericon.png' alt='icon' height={36} width={36}/>
                </div> 
                <div>
                    <h1 className='font-medium text-lg'>Notes</h1>
                </div>
            </div>
            <div className='bg-blue-600 flex gap-[8px] w-[175px] h-[44px] items-center justify-center text-white rounded-[8px]' onClick={() => setShowSidebar(true)} >
                <div>
                    <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                </div>
                <div>
                    <h1 className='text-[16px]'>Add new Note</h1>
                </div>
            </div>
        </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
        {notes.map((note, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{note.title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {note.tags.map((tag, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Form */}
      {showSidebar && (
        <div className="fixed inset-0 bg-amber-100 bg-opacity-20 z-40" onClick={() => setShowSidebar(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-[60%] bg-white shadow-lg z-50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add new note</h2>
              <button onClick={() => setShowSidebar(false)} className="text-xl">×</button>
            </div>

            <div className=' w-full h-[72px] flex justify-between flex-col'>
                <label>
                    <h2 className='text-[14px] font-medium'>Title</h2>
                </label>
                <input type='text'  placeholder="Enter note title" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} className='h-[44px] border w-9/10 rounded-[12px] bg-white outline-none border-gray-300 pl-3 text-[15px] text-medium' ></input>
            </div>


            <TagInput tags={tags} setTags={setTags} />

            <button 
              onClick={handleSaveNote}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded w-full"
            >
              Save note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// TagInput sub-component
function TagInput({ tags, setTags }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const newTag = input.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setInput('');
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">
            {tag} 
            <button onClick={() => removeTag(index)} className="ml-1">×</button>
          </span>
        ))}
      </div>
      <input 
        type="text"
        placeholder="Add tag"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTag()}
        className="w-full border px-2 py-1 rounded"
      />
    </div>
  );
}



<div >

</div>