// components/VitalsTable.js
'use client';
import { useEffect, useState } from 'react';

export default function VitalsTable() {
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    const fetchVitals = async () => {
      const res = await fetch('/api/vitals');
      const data = await res.json();
      setVitals(data);
    };
    fetchVitals();
  }, []);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
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
    </div>
  );
}
