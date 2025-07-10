import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { year: '2020', SRK: 30, Salman: 40 },
  { year: '2021', SRK: 45, Salman: 50 },
  { year: '2022', SRK: 70, Salman: 65 },
  { year: '2023', SRK: 90, Salman: 75 },
];

const AreaChartComp = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h3 className="text-xl font-semibold mb-4">Actor Popularity Over Years</h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="SRK" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="Salman" stackId="1" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default AreaChartComp;
