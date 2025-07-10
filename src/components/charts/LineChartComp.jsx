import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', collection: 120 },
  { month: 'Feb', collection: 98 },
  { month: 'Mar', collection: 140 },
  { month: 'Apr', collection: 170 },
  { month: 'May', collection: 220 },
  { month: 'Jun', collection: 180 },
];

const LineChartComp = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h3 className="text-xl font-semibold mb-4">Monthly Box Office Collection (in Crores)</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="collection" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LineChartComp;
