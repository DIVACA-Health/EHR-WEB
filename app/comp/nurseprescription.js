'use client';
import { useEffect, useState } from 'react';


const nurseprescription = () => {
  const [vitals, setVitals] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedVital, setSelectedVital] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);

  useEffect(() => {
    const fetchVitals = async () => {
      const res = await fetch('/api/vitals');
      const data = await res.json();
      setVitals(data);
    };
    fetchVitals();
  }, []);

  const handleRowClick = (vital) => {
    setSelectedVital(vital);
    setShowSidebar(true);
  };
  return (
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
                    <th className="px-4 py-4  text-center">Date</th>
                    <th className="px-4 py-4  text-center">Heart rate (bpm)</th>
                    <th className="px-4 py-4  text-center">Blood pressure (mmHg)</th>
                    <th className="px-4 py-4 text-center">Temperature (°C)</th>
                    <th className="px-4 py-4 text-center">Weight (kg)</th>
                    <th className="px-4 py-4 text-center">Recorded by</th>
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
                    <td className="px-6 py-4 text-[14px] w-[160px] text-center">{vital.heartRate}</td>
                    <td className="px-6 py-4 text-[14px] w-[190px] text-center">{vital.bloodPressure}</td>
                    <td className="px-6 py-4 text-[14px] w-[140px] text-center">{vital.temperature}</td>
                    <td className="px-6 py-4 text-[14px] w-[160px] text-center">{vital.weight}</td>
                    <td className="px-6 py-4 text-[14px] w-[190px] text-center">{vital.recordedBy}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showSidebar && (
              <div
                className="fixed inset-0 z-40 bg-[#0C162F99]"
                onClick={() => setShowSidebar(false)}
              >
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
                                    <div className="divide-y text-sm  pl-4 pr-4 pt-2 pb-2 rounded-b-[8px]">
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
                                            <button className='text-[#3B6FED] bg-[#F3F6FF] h-[28px] w-[54px] rounded-[4px]'>View</button>
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
                                            <button className='text-[#3B6FED] bg-[#F3F6FF] h-[28px] w-[54px] rounded-[4px]'>View</button>
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
  )
}

export default nurseprescription