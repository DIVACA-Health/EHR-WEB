'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
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

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-3xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Most common health complaints</h2>

      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={complaints}>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              label={{ position: 'top' }}
            >
              {complaints.map((entry, index) => (
                <cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HealthComplaintChart;
