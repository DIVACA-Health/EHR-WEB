'use client';

import React, { useEffect, useState } from 'react';
import { useParams , useSearchParams } from 'next/navigation';
import Nursevitals from './nursevitals';
import NurseHealthHistory from './nursehealthhistory';
import Nurseprescription from './nurseprescription';
import Nurseallergies from './nurseallergies';
import NoteManager from './nursenotes';

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

const QueueDetailPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const fullName = user?.name || '';
    const [firstName, ...rest] = fullName.trim().split(' ');
    const lastName = rest.join(' ');
   
  useEffect(() => {
    if (!params.userId) {
      return;
    }
  
const fetchUserQueueData = async () => {
  try {
    const url = `/api/v1/queue/${params.userId}/current`;
    const res = await fetchWithAuth(url, { method: 'GET' });

    if (!res.ok) {
      throw new Error(`API call failed with status ${res.status}`);
    }

    const data = await res.json();


    // Update the state with the fetched data
    setUser({
      name: `${data.data.personalInfo.firstName} ${data.data.personalInfo.lastName}`,
      divacaId: data.data.student.id,
      matricNumber: data.data.student.matricNumber || 'N/A',
      status: data.data.queueInfo.status,
      timeAdded: data.data.queueInfo.timeAdded,
      position: data.data.queueInfo.position,
      peopleAhead: data.data.queueInfo.peopleAhead,
      waitTime: data.data.queueInfo.waitTime,
      phoneNumber: data.data.personalInfo.phoneNumber,
      email: data.data.personalInfo.email,
      emergency: data.data.student.emergencyContact.name || 'N/A', 
      address: data.data.personalInfo.homeAddress || 'N/A', 
      age: data.data.personalInfo.Age || 'N/A', 
      DOB: data.data.personalInfo.dateofbirth || 'N/A', 
      avatar: data.data.personalInfo.Profileimg || "/image/profileimg.png", 
      heartrate: data.data.medicalData.vitals[0]?.heartRate  ??  'N/A',
      bloodpressure: data.data.medicalData.vitals[0]?.bloodPressure ?? 'N/A',
      temperature: data.data.medicalData.vitals[0]?.temperature ?? 'N/A',
      weight: data.data.medicalData.vitals[0]?.weight ?? 'N/A',
      note1: data.data.medicalData.notes[0]?.createdBy?.name || 'N/A',
      notedate1: data.data.medicalData.notes[0]?.createdAt || 'N/A',
      note2: data.data.medicalData.notes[1]?.createdBy?.name || 'N/A',
      notedate2: data.data.medicalData.notes[1]?.createdAt || 'N/A',
      notecontent1 : data.data.medicalData.notes[0]?.content || 'N/A',
      notecontent2 : data.data.medicalData.notes[1]?.content || 'N/A',
      allergy : data.data.medicalData.allergies[0]?.severity || 'N/A',
      allergyname : data.data.medicalData.allergies[0]?.allergyName || 'N/A',
      allergy1 : data.data.medicalData.allergies[1]?.severity || 'N/A',
      allergyname1 : data.data.medicalData.allergies[1]?.allergyName || 'N/A',
      allergy2 : data.data.medicalData.allergies[2]?.severity || 'N/A',
      allergyname2 : data.data.medicalData.allergies[2]?.allergyName || 'N/A',

    });
  } catch (error) {
    console.error('Error fetching user queue data:', error);
  }
};
  
    fetchUserQueueData();
  }, [params.userId]);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'personal', label: 'Personal information' },
    { key: 'vitals', label: 'Vitals' },
    { key: 'notes', label: 'Notes' },
    { key: 'allergies', label: 'Allergies' },
    { key: 'health', label: 'Health history' },
    { key: 'prescriptions', label: 'Prescription history' },
  ];


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

const getTodayDate = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

    useEffect(() => {
    const section = searchParams.get('section');
    if (section) setActiveSection(section);
  }, [searchParams]);


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
      <div className=' text-sm'>
        {!user ? (
          <div>Loading user...</div>
        ) : (
          <>
            {activeSection === 'overview' && (
              <div className='space-y-4 pt-4'>
                {/* Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Box 1 - Vitals */}
                  <div className="bg-[#FFFFFF] pt-4 pb-4 pl-4 pr-8 rounded-xl border border-[#EBEBEB] shadow shadow-[#C6C6C61A] h-[300px] xl:h-fit">
                    <div className=' min-h-[84px] w-[90%] flex gap-4 items-center'>
                        <div className='w-[30%] h-full'>
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full"/>
                        </div>
                        <div className='flex flex-col gap-1.5 h-full w-fit'>
                            <h1>{user.name}</h1>
                            <h1>ID : {user.divacaId}</h1>
                             <span className={`inline-block px-3 py-1 text-xs rounded-full border w-fit ${
                                user.status === 'Waiting' ? 'bg-[#FFF5E3] text-[#E99633] border-[#E99633]' :
                                user.status === 'In consultation' ? 'bg-[#F2F6FF] text-[#3B6FED] border-[#3B6FED]' :
                                user.status === 'Forwarded to doctor' ? 'bg-[#ECFFF0] text-[#218838] border-[#218838]  text-center text-[11px]' :
                                user.status === 'Emergency' ? 'bg-[#FFF0EC] text-[#e24312] border-[#e24312]' :
                                user.status === 'Admitted' ? 'bg-[#FFEBEB] text-[#FF4040] border-[#FF4040]' :
                                user.status === 'Returned to health attendant' ? 'bg-[#EBE7FF] text-[#2000C2] border-[#2000C2] text-center text-[11px]' :
                                'bg-gray-200 text-gray-800 border-gray-300'
                            }`}>
                            {user.status}
                            </span>
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
                            <h1 className='text-xs text-[#141414] font-semibold'>{user.DOB}</h1>
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
                            <h1 className='text-xs text-[#141414] font-semibold'>{user.address}</h1>
                        </div>
                    </div>

                  </div>

                  {/* Box 2 - Vitals */}
                  <div className="bg-[#FFFFFF] rounded-xl border border-[#EBEBEB] shadow shadow-[#C6C6C61A] h-fit  ">
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
                        <div className='flex justify-between items-center mb-2 '>
                            <div className='flex flex-col gap-1 '>
                                <h1 className='text-xs text-[#919191] font-extralight'>Heart rate (bpm)</h1>
                                <h1>{user.heartrate}</h1>
                            </div>
                            <div className='flex flex-col gap-1 w-[40%] '>
                                <h1 className='text-xs text-[#919191] font-extralight'>Blood pressure (mmHg)</h1>
                                <h1>{user.bloodpressure}</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Temperature (°C)</h1>
                                <h1>{user.temperature}</h1>
                            </div>
                            <div className='flex flex-col gap-1 w-[40%]'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Weight (kg)</h1>
                                <h1>{user.weight}</h1>
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
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr {user.note1}</h1>
                                <h1 className='text-xs max-h-[80%]  overflow-hidden text-ellipsis'>{user.notecontent1}</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-sm'>{getTodayDate(user.notedate1)}</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr {user.note2}</h1>
                                <h1 className='text-xs max-h-[80%] overflow-hidden text-ellipsis'>{user.notecontent2}</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-sm'>{getTodayDate(user.notedate2)}</h1>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Box 4 - Prescriptions */}
                  <div className="bg-[#FFFFFF] rounded-xl border border-[#EBEBEB] shadow shadow-[#C6C6C61A] h-fit">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-start items-center w-full h-14'>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/nursehealthlogo.png' alt='img' height={38} width={38} />
                                <h2 className='text-[14px]'>Health history</h2>
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center mb-2 border-b-[1px] border-b-black h-10'>
                            <div>
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr {user.note1}</h1>
                            </div>
                            <div className='w-[50%] flex justify-end '>
                                <h1 className='text-xs'>{getTodayDate(user.notedate1)}</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2 h-10'>
                            <div>
                               <h1 className='text-xs text-[#919191] font-extralight'>Dr {user.note2}</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-xs'>{getTodayDate(user.notedate2)}</h1>
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
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr {user.note1}</h1>
                                <h1 className='text-xs'>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-xs'>{getTodayDate(user.notedate1)}</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2 h-10'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-xs text-[#919191] font-extralight'>Dr {user.note2}</h1>
                                <h1 className='text-xs'>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1 className='text-xs'>{getTodayDate(user.notedate2)}</h1>
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
                            <div className='text-xs text-[#919191] font-extralight'>{user.allergyname}</div>
                            <div className='w-[30%] flex justify-end'>
                             <span className={`inline-block px-3 py-1 text-xs rounded-full border w-fit ${
                                user.allergy === 'Moderate' ? 'border-[#FCBF49] bg-[#FFF8EB] text-[#FCBF49]' :
                                user.allergy === 'Mild' ? 'border-[#2A9D8F] bg-[#E2FFFB] text-[#2A9D8F]' :
                                user.allergy === 'Severe' ? 'border-[#FF4040] bg-[#FEF0F0] text-[#FF4040]' :
                                'border-gray-300 bg-gray-100 text-gray-700'
                            }`}>
                            {user.allergy}
                            </span>
                            </div>
                        </div>
                            <div className='flex justify-between items-center w-full  h-10 border-b-[1px] border-b-black'>
                            <div className='text-xs text-[#919191] font-extralight'>{user.allergyname1}</div>
                            <div className='w-[30%] flex justify-end'>
                             <span className={`inline-block px-3 py-1 text-xs rounded-full border w-fit ${
                                user.allergy === 'Moderate' ? 'border-[#FCBF49] bg-[#FFF8EB] text-[#FCBF49]' :
                                user.allergy === 'Mild' ? 'border-[#2A9D8F] bg-[#E2FFFB] text-[#2A9D8F]' :
                                user.allergy === 'Severe' ? 'border-[#FF4040] bg-[#FEF0F0] text-[#FF4040]' :
                                'border-gray-300 bg-gray-100 text-gray-700'
                            }`}>
                            {user.allergy1}
                            </span>
                            </div>
                        </div>
                            <div className='flex justify-between items-center w-full  h-10 '>
                            <div className='text-xs text-[#919191] font-extralight'>{user.allergyname2}</div>
                            <div className='w-[30%] flex justify-end'>
                             <span className={`inline-block px-3 py-1 text-xs rounded-full border w-fit ${
                                user.allergy === 'Moderate' ? 'border-[#FCBF49] bg-[#FFF8EB] text-[#FCBF49]' :
                                user.allergy === 'Mild' ? 'border-[#2A9D8F] bg-[#E2FFFB] text-[#2A9D8F]' :
                                user.allergy === 'Severe' ? 'border-[#FF4040] bg-[#FEF0F0] text-[#FF4040]' :
                                'border-gray-300 bg-gray-100 text-gray-700'
                            }`}>
                            {user.allergy2}
                            </span>
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
                             <span className={`inline-block px-3 py-1 text-xs rounded-full border w-fit ${
                                user.status === 'Waiting' ? 'bg-[#FFF5E3] text-[#E99633] border-[#E99633]' :
                                user.status === 'In consultation' ? 'bg-[#F2F6FF] text-[#3B6FED] border-[#3B6FED]' :
                                user.status === 'Forwarded to doctor' ? 'bg-[#ECFFF0] text-[#218838] border-[#218838]  text-center text-[11px]' :
                                user.status === 'Emergency' ? 'bg-[#FFF0EC] text-[#e24312] border-[#e24312]' :
                                user.status === 'Admitted' ? 'bg-[#FFEBEB] text-[#FF4040] border-[#FF4040]' :
                                user.status === 'Returned to health attendant' ? 'bg-[#EBE7FF] text-[#2000C2] border-[#2000C2] text-center text-[11px]' :
                                'bg-gray-200 text-gray-800 border-gray-300'
                            }`}>
                            {user.status}
                            </span>
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
                        <input type="text" value={user.phoneNumber} readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
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
                        <input type="text" value="N/A" readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
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
                        <input type="text" value={user.address}readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Emergency contact</h1>
                        </label>
                        <input type="text" value={user.emergency} readOnly className="p-2 rounded-[12px]  bg-[rgba(239,239,239,1)] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                </div>

              </div>
            )}

            {activeSection === 'notes' && (
                <NoteManager studentId={user?.divacaId} userRole={user?.role}/>
            )}

            {activeSection === 'vitals' && (
                <Nursevitals studentId={user?.divacaId} />
            )}

            {activeSection === 'allergies' && (
                <Nurseallergies studentId={user?.divacaId} />
            )}

            {activeSection === 'health' && (
                <NurseHealthHistory studentId={user?.divacaId}/>
            )}

            {activeSection === 'prescriptions' && (
                <Nurseprescription studentId={user?.divacaId}/>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QueueDetailPage;
