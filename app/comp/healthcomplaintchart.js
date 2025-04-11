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
  Cell, // <-- Make sure this is imported
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

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 w-full mx-auto">
      <h2 className="text-lg font-bold mb-4">Most common health complaints</h2>

      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={complaints}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              label={{ position: 'top' }}
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
