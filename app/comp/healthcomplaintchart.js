'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const HealthComplaintChart = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health-complaints')
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load chart data:', err);
        setLoading(false);
      });
  }, []);

  // Optional: fallback colors if API doesn't provide 'color' field
  const fallbackColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Calculate the maximum 'value' to dynamically set Y-axis ticks
  const maxValue = Math.max(...complaints.map((item) => item.value));

  // Generate Y-axis tick values (0, 200, 400, 600, 800, 1000)
  const generateYAxisTicks = () => {
    const step = 200; // Define the step size
    const ticks = [];
    for (let i = 0; i <= Math.ceil(maxValue / step) * step; i += step) {
      ticks.push(i);
    }
    return ticks;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 w-full mx-auto">
      <div className='w-full h-10  flex items-center mb-3'>
        <h2 className=" font-medium mb-4">Most common health complaints</h2>
      </div>

      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={complaints}>
            <XAxis dataKey="name" />
            <YAxis ticks={generateYAxisTicks()} />
            <Tooltip />
            <Bar
              dataKey="value"
              radius={[10, 10, 0, 0]}
              // label={{ position: 'top' }}
            >
              {complaints.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || fallbackColors[index % fallbackColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HealthComplaintChart;
