'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const StudentVisitsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/visits')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      });
  }, []);

  // Calculate the maximum visits value for dynamic Y-axis scaling
  const maxVisits = Math.max(...data.map((item) => item.visits));

  // Generate Y-axis tick values (0, 200, 400, 600, 800, 1000)
  const generateYAxisTicks = () => {
    const step = 200; // Define the step size
    const ticks = [];
    for (let i = 0; i <= Math.ceil(maxVisits / step) * step; i += step) {
      ticks.push(i);
    }
    return ticks;
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm w-full ">
      <div className='w-full h-10  flex items-center'>
        <h2 className=" font-semibold  mb-3">Student visits over time</h2>
      </div>

      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" />
            <YAxis 
              ticks={generateYAxisTicks()} 
              domain={[0, 'dataMax + 100']} 
              padding={{ top: 10, bottom: 25 }} 
            />

            <Tooltip />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorVisits)"
              dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 1 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StudentVisitsChart;
