import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Hits', value: 60 },
  { name: 'Flops', value: 40 },
];

const COLORS = ['#00C49F', '#FF8042'];

const PieChartComp = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h3 className="text-xl font-semibold mb-4">Hit vs Flop Movies</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={100}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default PieChartComp;
