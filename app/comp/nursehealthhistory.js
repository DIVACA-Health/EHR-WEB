'use client';
import { useEffect, useState } from 'react';

const NurseHealthHistory = () => {
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
          <div
            className="fixed inset-0 bg-amber-100 bg-opacity-20 z-40"
            onClick={() => setShowSidebar(false)}
          >
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
  );
};

export default NurseHealthHistory;
