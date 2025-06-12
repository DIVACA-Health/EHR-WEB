// components/VitalsTable.js
'use client';
import { useEffect, useState } from 'react';

export default function VitalsTable({ studentId }) {
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    const fetchVitals = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        const res = await fetch(`/api/v1/vitals/student/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await res.json();
        console.log('Vitals API response:', result);

        if (Array.isArray(result)) {
          setVitals(result);
        } else if (Array.isArray(result.data)) {
          setVitals(result.data);
        } else {
          console.error('Unexpected API response format:', result);
        }
      } catch (error) {
        console.error('Failed to fetch vitals:', error);
      }
    };

    fetchVitals();
  }, []);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
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
            <tr key={index} className="odd:bg-white even:bg-gray-50">
              <td className="px-6 py-4 text-center">{vital.date}</td>
              <td className="px-6 py-4 text-center">{vital.heartRate}</td>
              <td className="px-6 py-4 text-center">{vital.bloodPressure}</td>
              <td className="px-6 py-4 text-center">{vital.temperature}</td>
              <td className="px-6 py-4 text-center">{vital.weight}</td>
              <td className="px-6 py-4 text-center">
                Nurse {vital.recorder?.firstName} {vital.recorder?.lastName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
