'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nursevitalstable from './nursevitalstable'
import Nursevitals from './nursevitals';

const QueueDetailPage = () => {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [vitals, setVitals] = useState([]);
  const [selectedVital, setSelectedVital] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const fullName = user?.name || '';
    const [firstName, ...rest] = fullName.trim().split(' ');
    const lastName = rest.join(' ');
    const sampleTags = [
        { label: "Follow-up", color: "blue" },
        { label: "Malaria", color: "blue" },
        { label: "Medications", color: "blue" },
        { label: "Typhoid", color: "blue" },
        { label: "Admitted", color: "red" },
        { label: "Cough", color: "blue" },
        { label: "Discharged", color: "green" },
    ];
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


  useEffect(() => {
    const fetchVitals = async () => {
      const res = await fetch('/api/vitals');
      const data = await res.json();
      setVitals(data);
    };
    fetchVitals();
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/queue', { cache: 'no-store' });
      const data = await res.json();
      const foundUser = data.find(item => item.divacaId === params.id);
      setUser(foundUser);
    };

    fetchUser();
  }, [params.id]);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'personal', label: 'Personal information' },
    { key: 'notes', label: 'Notes' },
    { key: 'vitals', label: 'Vitals' },
    { key: 'allergies', label: 'Allergies' },
    { key: 'health', label: 'Health history' },
    { key: 'prescriptions', label: 'Prescription history' },
  ];

  const handleRowClick = (vital) => {
    setSelectedVital(vital);
    setShowSidebar(true);
  };


  return (
    <div className='w-[95%] m-auto mt-6'>
    <h1 className=' mb-4 text-[12px] font-light'> Queue management - Student Health Record </h1>
      <h1 className='text-xl font-medium mb-5'>Student Health Record</h1>
      {/* Tabs */}
      <div className='flex space-x-6 border-b border-gray-300 mb-4 text-sm font-extralight'>
        {tabs.map(tab => (
          <div
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`pb-2 cursor-pointer pl-2 pr-2 ${
              activeSection === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className='bg-white   text-sm'>
        {!user ? (
          <div>Loading user...</div>
        ) : (
          <>
            {activeSection === 'overview' && (
              <div className='space-y-4 pt-4'>
                {/* Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Box 1 - Vitals */}
                  <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#EBEBEB] shadow shadow-[#C6C6C61A] h-[300px]">
                    <div className=' min-h-[84px] w-[90%] flex gap-4'>
                        <div className='w-[30%] h-full'>
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full"/>
                        </div>
                        <div className='flex flex-col gap-1 h-full w-fit'>
                            <h1>{user.name}</h1>
                            <h1>ID : {user.divacaId}</h1>
                            <span className={` flex text-center px-2 py-1 text-[9px] font-bold rounded-xl w-fit ${
                        user.status === 'Waiting'
                          ? 'bg-yellow-200 text-yellow-800'
                          : user.status === 'In consultation'
                          ? 'bg-blue-200 text-blue-800'
                          : user.status === 'Returned to health attendant'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                            {user.status} </span>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-5 mt-4 '>
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-xs text-[#919191] font-extralight'>Matric Number</h1>
                            <h1 className='text-xs text-[#141414] font-semibold' >{user.matricNumber}</h1>
                        </div>
                        <div className=' w-[55%] flex flex-col gap-1'>
                            <h1 className='text-xs text-[#919191] font-extralight'>Phone number</h1>
                            <h1 className='text-xs text-[#141414] font-semibold'>{user.phoneNumber}</h1>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-5 mt-5 '>
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-xs text-[#919191] font-extralight'>Date of birth</h1>
                            <h1 className='text-xs text-[#141414] font-semibold'>{user.matricNumber}</h1>
                        </div>
                        <div className=' w-[55%] flex flex-col gap-1'>
                            <h1 className='text-xs text-[#919191] font-extralight'>Email</h1>
                            <h1 className='text-xs text-[#141414] font-semibold'>{user.email}</h1>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-4 mt-3 '>
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-xs text-[#919191] font-extralight'>Age</h1>
                            <h1 className='text-xs text-[#141414] font-semibold'>{user.age}</h1>
                        </div>
                        <div className=' w-[55%] flex flex-col gap-1'>
                            <h1 className='text-xs text-[#919191] font-extralight'>Address</h1>
                            <h1 className='text-xs text-[#141414] font-semibold'>{user.phoneNumber}</h1>
                        </div>
                    </div>

                  </div>

                  {/* Box 2 - Vitals */}
                  <div className="bg-[#FFFFFF] rounded-xl border border-[#EBEBEB] shadow shadow-[#C6C6C61A] h-fit ">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-between items-center w-full h-14 '>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame 1261158733.png' alt='img' height={38} width={38} />
                                <h2 className='text-[14px]'>Vitals</h2>
                            </div>
                            <div>
                                <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center mb-2'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Heart rate (bpm)</h1>
                                <h1>{user.age}</h1>
                            </div>
                            <div className='flex flex-col gap-1 w-[55%]'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Blood pressure (mmHg)</h1>
                                <h1>{user.age}</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Temperature (°C)</h1>
                                <h1>{user.age}</h1>
                            </div>
                            <div className='flex flex-col gap-1 w-[55%]'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Weight (kg)</h1>
                                <h1>{user.age}</h1>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Box 3 - Health History */}
                  <div className="bg-[#FFFFFF] rounded-xl border border-[#EBEBEB] shadow shadow-[#C6C6C61A] h-fit">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-between items-center w-full h-14'>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame 1261158733 (1).png' alt='img' height={38} width={38} />
                                <h2 className='text-[14px]'>Notes / Documents</h2>
                            </div>
                            <div>
                                <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center mb-2 border-b-[1px] border-b-black h-14'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr Michael Ekene</h1>
                                <h1 className='text-xs'>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-sm'>14-09-2024</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr Michael Ekene</h1>
                                <h1 className='text-xs'>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-sm'>14-09-2024</h1>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Box 4 - Prescriptions */}
                  <div className="bg-[#FFFFFF] rounded-xl border border-[#EBEBEB] shadow shadow-[#C6C6C61A] h-fit">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-start items-center w-full h-14'>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame 1261158733 (1).png' alt='img' height={38} width={38} />
                                <h2 className='text-[14px]'>Health history</h2>
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center mb-2 border-b-[1px] border-b-black h-10'>
                            <div>
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr Michael Ekene</h1>
                            </div>
                            <div className='w-[50%] flex justify-end '>
                                <h1 className='text-sm'>14-09-2024</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2 h-10'>
                            <div>
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr Michael Ekene</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-sm'>14-09-2024</h1>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Box 5 - Allergies */}
                  <div className="bg-[#FFFFFF] rounded-xl border border-[#EBEBEB] shadow shadow-[#C6C6C61A] h-fit -mt-[120px]">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-between items-center w-full h-14'>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame 1261158733 (2).png' alt='img' height={38} width={38} />
                                <h2 className='text-[14px]'>Prescription history</h2>
                            </div>
                            <div>
                                <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center mb-2 border-b-[1px] border-b-black h-14'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr Michael Ekene</h1>
                                <h1 className='text-xs'>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-xs'>14-09-2024</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2 h-10'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr Michael Ekene</h1>
                                <h1 className='text-xs'>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-xs'>14-09-2024</h1>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Box 6 - Basic Info */}
                  <div className="bg-[#FFFFFF] rounded-xl border border-[#EBEBEB] shadow shadow-[#C6C6C61A] h-fit -mt-[100px]">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow-xs shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-between items-center w-full h-14'>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame1261158733(3).png' alt='img' height={38} width={38} />
                                <h2 className='text-[14px]'>Allergies</h2>
                            </div>
                            <div>
                                <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center w-full  h-10 border-b-[1px] border-b-black'>
                            <div className='text-xs text-[#919191] font-extralight'>Ibuprofen</div>
                            <div className='w-[30%] flex justify-end'>
                                <div className='rounded-xl bg-green-200 h-fit w-fit  border-[1px] border-black'>
                                    <h1 className='text-xs pl-1 pr-1'>Mild</h1>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between items-center w-full h-10 border-b-[1px] border-b-black'>
                            <div className='text-xs text-[#919191] font-extralight'>Ibuprofen</div>
                            <div className='w-[30%] flex justify-end'>
                                <div className='rounded-xl bg-green-200 h-fit w-fit  border-[1px] border-black'>
                                    <h1 className='text-xs pl-1 pr-1'>Mild</h1>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between items-center w-full  h-10 '>
                            <div className='text-xs text-[#919191] font-extralight'>Penicillin</div>
                            <div className='w-[30%] flex justify-end'>
                                <div className='rounded-xl bg-red-200 h-fit w-fit  border-[1px] border-black'>
                                    <h1 className='text-xs pl-1 pr-1'>Severe</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'personal' && (
              <div className=' w-full flex flex-col h-fit rounded-[12px] border-[1px] border-[rgba(235,235,235,1)] shadow-sm shadow-[rgba(198,198,198,0.1)] '>
                <div className='h-[70px]  w-full rounded-t-[12px] flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-b-[rgba(235,235,235,1)] mb-4 shadow-b shadow-xs'>
                    <div className='flex gap-3 items-center'>
                        <div>
                            <img src='/image/usericon.png' alt='icon' height={36} width={36}/>
                        </div> 
                        <div>
                            <h1 className='font-medium text-lg'>Personal information</h1>
                        </div>
                    </div>
                    <div>
                        <span className={` flex text-center px-2 py-1 text-xs rounded-xl w-fit ${
                            user.status === 'Waiting'
                            ? 'bg-yellow-200 text-yellow-800'
                            : user.status === 'In consultation'
                            ? 'bg-blue-200 text-blue-800'
                            : user.status === 'Returned to health attendant'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                        >
                                {user.status} </span>
                    </div>
                </div>
                <div className='w-[95%] m-auto h-fit flex gap-5 mb-5'>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>First Name</h1>
                        </label>
                        <input type="text" value={firstName} readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Last Name</h1>
                        </label>
                        <input type="text" value={lastName}readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                </div>
                <div className='w-[95%] m-auto h-fit flex gap-5 mb-5'>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Divaca ID</h1>
                        </label>
                        <input type="text" value={user.divacaId} readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Matric number</h1>
                        </label>
                        <input type="text" value={user.matricNumber} readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                </div>
                <div className='w-[95%] m-auto h-fit flex gap-5 mb-5'>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Phone number</h1>
                        </label>
                        <input type="text" value="This is not editable" readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Email address</h1>
                        </label>
                        <input type="text" value={user.email} readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                </div>
                <div className='w-[95%] m-auto h-fit flex gap-5 mb-5'>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Date of birth</h1>
                        </label>
                        <input type="text" value="This is not editable" readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Age</h1>
                        </label>
                        <input type="text" value={user.age} readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                </div>
                <div className='w-[95%] m-auto h-fit flex gap-5 mb-5'>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Address</h1>
                        </label>
                        <input type="text" value="This is not editable" readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Emergency contact</h1>
                        </label>
                        <input type="text" value="This is not editable" readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                </div>

              </div>
            )}

            {activeSection === 'notes' && (
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
            )}

            {activeSection === 'vitals' && (
                    <Nursevitals/>
            )}

            {activeSection === 'allergies' && (
                    <div className='border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-sm rounded-[12px]'>
                    <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-xs mb-4 rounded-t-[12px] '>
                        <div className='flex gap-3 items-center'>
                            <img src='/image/allergiesicon.png' alt='icon' height={36} width={36} />
                            <h1 className='font-medium text-lg'>Allergies</h1>
                        </div>
                        <button className='bg-blue-600 flex gap-[8px] w-[195px] h-[44px] items-center justify-center text-white rounded-[8px]'onClick={() => setShowSidebar(true)}><img src='/image/Plus.png' alt='icon' width={25} height={25} /><h1 className='text-[14px]'>Record New Allergy</h1></button>
                    </div>
                    <div className='flex flex-col p-4 gap-4'>
                        <div className='w-[95%] m-auto flex gap-5'>
                            <div className='flex justify-between pl-4 pr-4 h-[65px] items-center w-[50%] border-[1px] border-[rgba(235,235,235,1)] rounded-[12px]'>
                                <div className='h-5/10 flex items-center gap-2'>
                                    <img src='/image/Group 39895.png' alt='img' />
                                    <h1>Penicillin</h1>
                                </div>
                                <div className='h-5/10'>
                                    <div>
                                        <h1 className='p-1 border-[0.8px] border-amber-400 rounded-[12px] bg-amber-400 text-amber-700'>Moderate</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between pl-4 pr-4 h-[65px] items-center w-[50%] border-[1px] border-[rgba(235,235,235,1)] rounded-[12px]'>
                                <div className='h-5/10 flex items-center gap-2'>
                                    <img src='/image/Group 39895.png' alt='img' />
                                    <h1>Penicillin</h1>
                                </div>
                                <div className='h-5/10'>
                                    <div>
                                        <h1 className='p-1 border-[0.8px] border-amber-400 rounded-[12px] bg-amber-400 text-amber-700'>Moderate</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-[95%] m-auto flex gap-5'>
                            <div className='flex justify-between pl-4 pr-4 h-[65px] items-center w-[50%] border-[1px] border-[rgba(235,235,235,1)] rounded-[12px]'>
                                <div className='h-5/10 flex items-center gap-2'>
                                    <img src='/image/Group 39895.png' alt='img' />
                                    <h1>Penicillin</h1>
                                </div>
                                <div className='h-5/10'>
                                    <div>
                                        <h1 className='p-1 border-[0.8px] border-amber-400 rounded-[12px] bg-amber-400 text-amber-700'>Moderate</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between pl-4 pr-4 h-[65px] items-center w-[50%] border-[1px] border-[rgba(235,235,235,1)] rounded-[12px]'>
                                <div className='h-5/10 flex items-center gap-2'>
                                    <img src='/image/Group 39895.png' alt='img' />
                                    <h1>Peanuts</h1>
                                </div>
                                <div className='h-5/10'>
                                    <div>
                                        <h1 className='p-1 border-[0.8px] border-green-400 rounded-[12px] bg-green-400 text-green-700'>Mild</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showSidebar && (
                    <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowSidebar(false)}>
                      <div 
                        className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
                          <h2 className="text-xl font-semibold">Record New Allergies</h2>
                          <button onClick={() => setShowSidebar(false)} className="text-xl">×</button>
                        </div>
                        <form className='min-h-[81%] flex flex-col   pl-7 pr-7 gap-[14px]'>
            
                        </form>
                        {/* Footer Save Button */}
                        <div className='min-h-[8%] w-full flex justify-end items-center border-t-[1px] pr-6 border-gray-200 shadow-t-sm'>
                          <button
                          type='submit'
                            className="bg-blue-600 text-white py-2 px-4 rounded w-2/10"
                          >
                            Save Vitals
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            )}

            {activeSection === 'health' && (
                    <div className='border-[rgba(235,235,235,1)] shadow-sm rounded-t-[12px]'>
                    <div className='h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] rounded-t-[12px] border-[rgba(235,235,235,1)] shadow-xs'>
                      <div className='flex gap-3 items-center'>
                        <img src='/image/healthicon.png' alt='icon' height={36} width={36} />
                        <h1 className='font-medium text-lg'>Allergies</h1>
                      </div>
                      <button
                        className='bg-blue-600 flex gap-[8px] w-[195px] h-[44px] items-center justify-center text-white rounded-[8px]'
                        onClick={() => {
                          setSelectedVital(null);
                          setShowSidebar(true);
                        }}
                      >
                        <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                        <h1 className='text-[14px]'>Record New Allergies</h1>
                      </button>
                    </div>
              
                    <div className="overflow-x-auto border border-gray-200">
                      <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr className="text-[12px] font-normal">
                            <th className="px-4 py-4 text-center">Date</th>
                            <th className="px-4 py-4 text-center">Heart rate (bpm)</th>
                            <th className="px-4 py-4 text-center">Blood pressure (mmHg)</th>
                            <th className="px-4 py-4 text-center">Temperature (°C)</th>
                            <th className="px-4 py-4 text-center">Weight (kg)</th>
                            <th className="px-4 py-4 text-center">Recorded by</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-[14px]">
                          {vitals.map((vital, index) => (
                            <tr
                              key={index}
                              className="odd:bg-white even:bg-gray-50 cursor-pointer"
                              onClick={() => handleRowClick(vital)}
                            >
                              <td className="px-6 py-4 text-center">{vital.date}</td>
                              <td className="px-6 py-4 text-center">{vital.heartRate}</td>
                              <td className="px-6 py-4 text-center">{vital.bloodPressure}</td>
                              <td className="px-6 py-4 text-center">{vital.temperature}</td>
                              <td className="px-6 py-4 text-center">{vital.weight}</td>
                              <td className="px-6 py-4 text-center">{vital.recordedBy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
              
                      {showSidebar && (
                        <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowSidebar(false)}>
                          <div
                            className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex  justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
                              <div className='flex flex-col'>
                                  <h2>Date of Visit : </h2>
                                  <h2> Doctor : </h2>
                              </div>
                              <button onClick={() => setShowSidebar(false)} className="text-xl">
                                ×
                              </button>
                            </div>
              
                            {/* Main Content */}
                          <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] ">
                              {selectedVital ? (         
                                  <>        
                                      <div className="  w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px] shadow sm">
                                 {/* Header */}
                                 <div
                                   className=" px-4 py-3 cursor-pointer flex justify-between  rounded-[8px] items-center bg-[rgba(243,246,255,1)] "
                                   onClick={() => setIsOpen(!isOpen)}
                                 >
                                   <span className="font-medium text-sm">Test & vitals results</span>
                                   <span className="text-lg transform transition-transform duration-300 ">
                                     {isOpen ? '▾' : '▸'}
                                   </span>
                                 </div>
                           
                                 {/* Collapsible content */}
                                 {isOpen && (
                                   <div className="divide-y text-sm  pl-4 pr-4 pt-2 pb-2rounded-b-[12px]">
                                     <div className="flex justify-between px-4 py-3">
                                          <span>Test</span>
                                          <span className="text-gray-700 font-medium">Blood sugar test</span>
                                     </div>
                                     <div className="flex justify-between px-4 py-3">
                                          <div className=' w-full flex justify-between'><h1>Blood Pressure :</h1> {selectedVital.bloodPressure}</div>
                                     </div>
                                     <div className="flex justify-between px-4 py-3">
                                          <div className=' w-full flex justify-between'><h1>Heart rate :</h1> {selectedVital.heartRate} bpm</div>
                                     </div>
                                     <div className="flex justify-between px-4 py-3">
                                       <span>Lab results</span>
                                       <button className="text-blue-600 hover:underline">View</button>
                                     </div>
                                   </div>
                                 )}
                                      </div>
                                  </> 
                              ) : (
                                <div className="text-gray-500 italic">Form to record new allergies goes here...</div>
                              )}
                              {selectedVital ? (         
                                  <>        
                                      <div className="  w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px] shadow-sm">
                                          {/* Header */}
                                          <div className=" px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] rounded-b-[5px] items-center bg-[rgba(243,246,255,1)] " onClick={() => setIsOpen1(!isOpen1)}>
                                              <span className="font-medium text-sm">Doctor’s notes & treatment plan</span>
                                              <span className="text-lg transform transition-transform duration-300">
                                              {isOpen1 ? '▾' : '▸'}
                                              </span>
                                          </div>
                                  
                                          {/* Collapsible content */}
                                          {isOpen1 && (
                                              <div className="divide-y text-sm  pl-4 pr-4 pt-2 pb-2 rounded-b-[8px]">
                                                  <div className="flex justify-between px-4 py-3">
                                                      <span>Diagnosis</span>
                                                      <span className="text-gray-700 font-medium">Acute Tonsillitis</span>
                                                  </div>
                                                  <div className="flex justify-between px-4 py-3">
                                                      <span>Description</span>
                                                      <button className="text-blue-600 hover:underline">View</button>
                                                  </div>
                                                  <div className="flex justify-between px-4 py-3">
                                                      <span>Possible Cause</span>
                                                      <span className="text-gray-700 font-medium">Likely Streptococcal infection (Strep throat).</span>
                                                  </div>
                                                  <div className="flex justify-between px-4 py-3">
                                                      <span>Medication</span>
                                                      <span className="text-gray-700 font-medium">Amoxicillin 500mg</span>
                                                  </div>
                                                  <div className="flex justify-between px-4 py-3">
                                                      <span>Dosage</span>
                                                      <span className="text-gray-700 font-medium">Twice daily for 10 days.</span>
                                                  </div>
                                                  <div className="flex justify-between px-4 py-3 h-auto items-center">
                                                      <span className='w-3/10'>Follow-up</span>
                                                      <span className="text-gray-700 font-medium w-7/10">If symptoms persist beyond five days or worsen, return for reassessment.</span>
                                                  </div>
                                                  <div className="flex justify-between px-4 py-3h-auto items-center">
                                                      <span className='w-3/10'>Notes</span>
                                                      <span className="text-gray-700 font-medium w-7/10">Stay hydrated and remember to get plenty of rest for a smooth recovery.</span>
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  </> 
                                  ) : (
                                      <div className="text-gray-500 italic">Form to record new allergies goes here...</div>
                                  )}
                              
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
                    </div>
                  </div>
            )}

            {activeSection === 'prescriptions' && (
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
                            <tr className="text-[12px] font-normal ">
                                <th className="px-4 py-4  text-center">Date of visit</th>
                                <th className="px-4 py-4  text-center">Last dose date</th>
                                <th className="px-4 py-4  text-center">Prescribed by</th>
                                <th className="px-4 py-4 text-center">Medication 1</th>
                                <th className="px-4 py-4 text-center">Dosage</th>
                                <th className="px-4 py-4 text-center">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-[14px]">
                            {vitals.map((vital, index) => (
                                <tr
                                key={index}
                                className="odd:bg-white even:bg-gray-50" // <-- Alternating row colors
                                onClick={() => handleRowClick(vital)}
                                >
                                <td className="px-6 py-4 text-[14px] w-[150px] text-center">{vital.date}</td>
                                <td className="px-6 py-4 text-[14px] w-[160px] text-center">{vital.date}</td>
                                <td className="px-6 py-4 text-[14px] w-[190px] text-center">{vital.recordedBy}</td>
                                <td className="px-6 py-4 text-[14px] w-[140px] text-center">{vital.temperature}</td>
                                <td className="px-6 py-4 text-[14px] w-[160px] text-center">{vital.weight}</td>
                                <td className="px-6 py-4 text-[14px] w-[190px] text-center">{vital.recordedBy}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {showSidebar && (
                            <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowSidebar(false)}>
                            <div
                              className="absolute right-0 top-0 h-full w-[55%] bg-white shadow-lg z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex  justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
                                <div className='flex flex-col w-auto'>
                                    <div className=' w-full flex justify-between gap-[17px]'>
                                      <h2>Date of Visit : </h2>
                                      <h2>Last dose date : </h2>
                                    </div>
                                    <h2> Prescribed by : </h2>
                                </div>
                                <button onClick={() => setShowSidebar(false)} className="text-xl">
                                  ×
                                </button>
                              </div>
            
                              {/* Main Content */}
                            <div className="min-h-[81%] flex flex-col pl-7 pr-7 gap-[14px] ">
                                {selectedVital ? (         
                                    <>        
                                        <div className="  w-full border-[0.8px] border-[rgba(235,235,235,1)] rounded-[8px]">
                                            {/* Header */}
                                            <div className=" px-4 py-3 cursor-pointer flex justify-between rounded-t-[8px] rounded-b-[5px] items-center bg-[rgba(243,246,255,1)] " onClick={() => setIsOpen1(!isOpen1)}>
                                                <span className="font-medium text-sm">Prescription details</span>
                                                <span className="text-lg transform transition-transform duration-300">
                                                {isOpen1 ? '▾' : '▸'}
                                                </span>
                                            </div>
                                    
                                            {/* Collapsible content */}
                                            {isOpen1 && (
                                                <div className="divide-y text-sm bg-white pl-4 pr-4 pt-2 pb-2">
                                                    <div className="flex justify-between px-4 py-3">
                                                        <span>Medication </span>
                                                        <span className="text-gray-700 font-medium">Paracetamol (500mg)</span>
                                                    </div>
                                                    <div className="flex justify-between px-4 py-3">
                                                        <span>Dosage</span>
                                                        <button className="text-blue-600 hover:underline">1 tablet, twice daily</button>
                                                    </div>
                                                    <div className="flex justify-between px-4 py-3 h-auto">
                                                        <span className='w-3/10'>Instructions</span>
                                                        <span className="text-gray-700 font-medium w-7/10">Take with a full glass of water. Can be taken with or without food, but taking it with a meal may help prevent stomach upset.
                                                        Do not skip doses.</span>
                                                    </div>
                                                    <div className="flex justify-between px-4 py-3">
                                                        <span>Medication 2</span>
                                                        <span className="text-gray-700 font-medium">Amoxicillin 500mg</span>
                                                    </div>
                                                    <div className="flex justify-between px-4 py-3">
                                                        <span>Dosage</span>
                                                        <span className="text-gray-700 font-medium">Twice daily for 10 days.</span>
                                                    </div>
                                                    <div className="flex justify-between px-4 py-3 h-auto">
                                                        <span className='w-3/10'>Instructions</span>
                                                        <span className="text-gray-700 font-medium w-7/10">Take with a full glass of water. Can be taken with or without food, but taking it with a meal may help prevent stomach upset.
                                                        Do not skip doses.</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </> 
                                    ) : (
                                        <div className="text-gray-500 italic">Form to record new allergies goes here...</div>
                                    )}
                                
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
                        </div>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QueueDetailPage;
