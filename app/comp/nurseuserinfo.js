'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const QueueDetailPage = () => {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('http://localhost:3000/api/queue', { cache: 'no-store' });
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
                  <div className="bg-gray-50 p-4 shadow rounded border">
                    <div className=' min-h-[84px] w-[90%] flex gap-4'>
                        <div className='w-[30%] h-full'>
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full"/>
                        </div>
                        <div className='flex flex-col gap-1 h-full w-[70%]'>
                            <h1>{user.name}</h1>
                            <h1>ID : {user.divacaId}</h1>
                            <span
                      className={` flex text-center px-2 py-1 text-xs rounded ${
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
                        <div>
                            <h1>Phone number</h1>
                            <h1>{user.phoneNumber}</h1>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-2'>
                        <div>
                            <h1>Date of birth</h1>
                            <h1>{user.matricNumber}</h1>
                        </div>
                        <div>
                            <h1>Email</h1>
                            <h1>{user.phoneNumber}</h1>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-2'>
                        <div>
                            <h1>Age</h1>
                            <h1>{user.matricNumber}</h1>
                        </div>
                        <div>
                            <h1>Address</h1>
                            <h1>{user.phoneNumber}</h1>
                        </div>
                    </div>

                  </div>

                  {/* Box 2 - Notes */}
                  <div className="bg-gray-50 p-4 shadow rounded border">
                    <h2 className="font-semibold text-base mb-2 text-gray-700">Notes</h2>
                    <p>Dr. Michael Ekene - Treatment note - 14-09-2024</p>
                    <p>Dr. Michael Ekene - Treatment note - 14-09-2024</p>
                  </div>

                  {/* Box 3 - Health History */}
                  <div className="bg-gray-50 p-4 shadow rounded border">
                    <h2 className="font-semibold text-base mb-2 text-gray-700">Health History</h2>
                    <p>Malaria & Typhoid - 14-09-2024</p>
                    <p>Food Poisoning - 14-09-2024</p>
                  </div>

                  {/* Box 4 - Prescriptions */}
                  <div className="bg-gray-50 p-4 shadow rounded border">
                    <h2 className="font-semibold text-base mb-2 text-gray-700">Prescription History</h2>
                    <p>Penicillin - 14-09-2024</p>
                    <p>Blood Tonic - 14-09-2024</p>
                  </div>

                  {/* Box 5 - Allergies */}
                  <div className="bg-gray-50 p-4 shadow rounded border">
                    <h2 className="font-semibold text-base mb-2 text-gray-700">Allergies</h2>
                    <p>Ibuprofen - Mild</p>
                    <p>Penicillin - Severe</p>
                  </div>

                  {/* Box 6 - Basic Info */}
                  <div className="bg-gray-50 p-4 shadow rounded border">
                    <h2 className="font-semibold text-base mb-2 text-gray-700">Overview</h2>
                    <p>Full Name: {user.name}</p>
                    <p>Divaca ID: {user.divacaId}</p>
                    <p>Status: {user.status}</p>
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
