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

  const fallbackColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const maxValue = Math.max(...complaints.map((item) => item.value), 0);

  const generateYAxisTicks = () => {
    const step = 200;
    const ticks = [];
    for (let i = 0; i <= Math.ceil(maxValue / step) * step; i += step) {
      ticks.push(i);
    }
    return ticks;
  };

  return (
    <div className="p-6 bg-white rounded-b-xl border border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.02)] w-full mx-auto">
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={complaints}>
            <XAxis dataKey="name" />
            <YAxis ticks={generateYAxisTicks()} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
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
