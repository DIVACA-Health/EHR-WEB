'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const QueueDetailPage = () => {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

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

  return (
    <div className='w-[95%] m-auto mt-6'>
      <h1 className='text-xl font-bold mb-4'>Student Health Record</h1>

      {/* Tabs */}
      <div className='flex space-x-6 border-b border-gray-300 mb-4 text-sm font-medium'>
        {tabs.map(tab => (
          <div
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`pb-2 cursor-pointer ${
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
      <div className='bg-white p-6 rounded shadow text-sm'>
        {!user ? (
          <div>Loading user...</div>
        ) : (
          <>
            {activeSection === 'overview' && (
              <div className='space-y-4'>
                {/* Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Box 1 - Vitals */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-[rgba(240,242,245,1)] shadow shadow-gray-200">
                    <div className=' min-h-[84px] w-[90%] flex gap-4'>
                        <div className='w-[30%] h-full'>
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full"/>
                        </div>
                        <div className='flex flex-col gap-1 h-full w-fit'>
                            <h1>{user.name}</h1>
                            <h1>ID : {user.divacaId}</h1>
                            <span
                      className={` flex text-center px-2 py-1 text-xs rounded-xl w-fit ${
                        user.status === 'Waiting'
                          ? 'bg-yellow-200 text-yellow-800'
                          : user.status === 'In consultation'
                          ? 'bg-blue-200 text-blue-800'
                          : user.status === 'Returned to health attendant'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {user.status}
                    </span>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-2'>
                        <div>
                            <h1>Matric Number</h1>
                            <h1 className='text-bold'>{user.matricNumber}</h1>
                        </div>
                        <div className='w-[60%] '>
                            <h1>Phone number</h1>
                            <h1>{user.phoneNumber}</h1>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-2'>
                        <div>
                            <h1>Date of birth</h1>
                            <h1>{user.matricNumber}</h1>
                        </div>
                        <div className='w-[60%] '>
                            <h1>Email</h1>
                            <h1 className='text-sm'>{user.email}</h1>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-2'>
                        <div>
                            <h1>Age</h1>
                            <h1>{user.age}</h1>
                        </div>
                        <div className='w-[60%] '>
                            <h1>Address</h1>
                            <h1>{user.phoneNumber}</h1>
                        </div>
                    </div>

                  </div>

                  {/* Box 2 - Notes */}
                  <div className="bg-gray-50  rounded-xl border border-[rgba(240,242,245,1)] shadow shadow-gray-200 h-fit">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-between items-center w-full h-14 '>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame 1261158733.png' alt='img' height={38} width={38} />
                                <h2 className='text-lg'>Vitals</h2>
                            </div>
                            <div>
                                <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center mb-2'>
                            <div>
                                <h1>Heart rate (bpm)</h1>
                                <h1>{user.age}</h1>
                            </div>
                            <div className='w-[50%] '>
                                <h1>Blood pressure (mmHg)</h1>
                                <h1>{user.age}</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2'>
                            <div>
                                <h1>Temperature (°C)</h1>
                                <h1>{user.age}</h1>
                            </div>
                            <div className='w-[50%] '>
                                <h1>Weight (kg)</h1>
                                <h1>{user.age}</h1>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Box 3 - Health History */}
                  <div className="bg-gray-50  rounded-xl border border-[rgba(240,242,245,1)] shadow shadow-gray-200 h-fit">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-between items-center w-full h-14'>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame 1261158733 (1).png' alt='img' height={38} width={38} />
                                <h2 className='text-lg'>Notes / Documents</h2>
                            </div>
                            <div>
                                <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center mb-2 border-b-[1px] border-b-black h-14'>
                            <div>
                                <h1>Dr Michael Ekene</h1>
                                <h1>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1>14-09-2024</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2'>
                            <div>
                                <h1>Dr Michael Ekene</h1>
                                <h1>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1>14-09-2024</h1>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Box 4 - Prescriptions */}
                  <div className="bg-gray-50  rounded-xl border border-[rgba(240,242,245,1)] shadow shadow-gray-200 h-fit">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-start items-center w-full h-14'>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame 1261158733 (1).png' alt='img' height={38} width={38} />
                                <h2 className='text-lg'>Health history</h2>
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center mb-2 border-b-[1px] border-b-black h-10'>
                            <div>
                                <h1>Dr Michael Ekene</h1>
                            </div>
                            <div className='w-[50%] flex justify-end '>
                                <h1>14-09-2024</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2 h-10'>
                            <div>
                                <h1>Dr Michael Ekene</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1>14-09-2024</h1>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Box 5 - Allergies */}
                  <div className="bg-gray-50  rounded-xl border border-[rgba(240,242,245,1)] shadow shadow-gray-200 h-fit -mt-[80px]">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-between items-center w-full h-14'>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame 1261158733 (2).png' alt='img' height={38} width={38} />
                                <h2 className='text-lg'>Prescription history</h2>
                            </div>
                            <div>
                                <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center mb-2 border-b-[1px] border-b-black h-14'>
                            <div>
                                <h1>Dr Michael Ekene</h1>
                                <h1>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1>14-09-2024</h1>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-2 h-10'>
                            <div>
                                <h1>Dr Michael Ekene</h1>
                                <h1>Treatment note</h1>
                            </div>
                            <div className='w-[50%] flex justify-end'>
                                <h1>14-09-2024</h1>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Box 6 - Basic Info */}
                  <div className="bg-gray-50  rounded-xl border border-[rgba(240,242,245,1)] shadow shadow-gray-200 h-fit -mt-[80px]">
                    <div className=' rounded-t-xl border-b-[1px] border-b-[rgba(240,242,245,1)] shadow shadow-gray-200 flex items-center'>
                        <div className='flex pl-2 pr-2 justify-between items-center w-full h-14'>
                            <div className='flex gap-3 items-center'>
                                <img src='/image/Frame1261158733(3).png' alt='img' height={38} width={38} />
                                <h2 className='text-lg'>Allergies</h2>
                            </div>
                            <div>
                                <img src='/image/Plus.png' alt='icon' width={25} height={25} />
                            </div>
                        </div>
                    </div>
                    <div className='p-4 text-sm font-lighter'>
                        <div className='flex justify-between items-center w-full  h-10 border-b-[1px] border-b-black'>
                            <div>Ibuprofen</div>
                            <div className='w-[30%] flex justify-end'>
                                <div className='rounded-xl bg-green-200 h-fit w-fit p-1 border-[1px] border-black'>
                                    <h1 className='text-sm'>Mild</h1>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between items-center w-full h-10 border-b-[1px] border-b-black'>
                            <div>Ibuprofen</div>
                            <div className='w-[30%] flex justify-end'>
                                <div className='rounded-xl bg-green-200 h-fit w-fit p-1 border-[1px] border-black'>
                                    <h1 className='text-sm'>Mild</h1>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between items-center w-full  h-10 '>
                            <div>Penicillin</div>
                            <div className='w-[30%] flex justify-end'>
                                <div className='rounded-xl bg-red-200 h-fit w-fit p-1 border-[1px] border-black'>
                                    <h1 className='text-sm'>Severe</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'personal' && (
              <div>
                <h2 className='text-lg font-semibold mb-2'>Personal Information</h2>
                <p><strong>Matric Number:</strong> {user.matricNumber}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Address:</strong> {user.address}</p>
              </div>
            )}

            {activeSection === 'notes' && (
              <div>
                <h2 className='text-lg font-semibold mb-2'>Notes</h2>
                <p>Dr. Michael Ekene - Treatment note - 14-09-2024</p>
                <p>Dr. Michael Ekene - Treatment note - 14-09-2024</p>
              </div>
            )}

            {activeSection === 'vitals' && (
              <div>
                <h2 className='text-lg font-semibold mb-2'>Vitals</h2>
                <p>Heart Rate: 89 bpm</p>
                <p>Blood Pressure: 120/80 mmHg</p>
                <p>Temperature: 98.6 °F</p>
                <p>Weight: 78 kg</p>
              </div>
            )}

            {activeSection === 'allergies' && (
              <div>
                <h2 className='text-lg font-semibold mb-2'>Allergies</h2>
                <ul className='list-disc ml-5'>
                  <li>Ibuprofen - Mild</li>
                  <li>Penicillin - Severe</li>
                </ul>
              </div>
            )}

            {activeSection === 'health' && (
              <div>
                <h2 className='text-lg font-semibold mb-2'>Health History</h2>
                <ul className='list-disc ml-5'>
                  <li>Malaria & Typhoid - 14-09-2024</li>
                  <li>Food Poisoning - 14-09-2024</li>
                </ul>
              </div>
            )}

            {activeSection === 'prescriptions' && (
              <div>
                <h2 className='text-lg font-semibold mb-2'>Prescription History</h2>
                <ul className='list-disc ml-5'>
                  <li>Penicillin - 14-09-2024</li>
                  <li>Blood Tonic - 14-09-2024</li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QueueDetailPage;
