// src/pages/ChartsPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import LineChartComp from '../components/charts/LineChartComp';
import BarChartComp from '../components/charts/BarChartComp';
import AreaChartComp from '../components/charts/AreaChartComp';
import PieChartComp from '../components/charts/PieChartComp';

const chartMap = {
  line: LineChartComp,
  bar: BarChartComp,
  area: AreaChartComp,
  pie: PieChartComp,
};

const ChartsPage = () => {
  const { chartType } = useParams();

  if (chartType) {
    const ChartComponent = chartMap[chartType?.toLowerCase()];
    if (!ChartComponent) {
      return (
        <div className="p-6 text-red-500 dark:text-red-400">
          Chart type "{chartType}" not found.
        </div>
      );
    }

    return (
      <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold capitalize mb-4">
          {chartType} Chart
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <ChartComponent />
        </div>
      </div>
    );
  }

  // If no :chartType param, show all charts
  return (
    <div className="space-y-8 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold">Box Office Analytics</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <LineChartComp />
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <AreaChartComp />
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <BarChartComp />
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <PieChartComp />
      </div>
    </div>
  );
};

export default ChartsPage;
