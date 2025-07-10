import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { multiplex: 'PVR', earnings: 400 },
  { multiplex: 'INOX', earnings: 300 },
  { multiplex: 'Cinepolis', earnings: 250 },
  { multiplex: 'Carnival', earnings: 180 },
];

const BarChartComp = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h3 className="text-xl font-semibold mb-4">Multiplex Earnings (in Crores)</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="multiplex" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="earnings" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartComp;
