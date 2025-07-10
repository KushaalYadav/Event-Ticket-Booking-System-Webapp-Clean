// src/pages/Dashboard.jsx
import React from 'react';
import { FaCalendarAlt, FaTasks, FaChartPie, FaTable, FaFilm, FaUsers, FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChartsPage from './ChartsPage';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">🎟️ Ticket Booking Dashboard</h2>

      {/* Top Booking Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Tickets Sold</h3>
            <FaFilm className="text-blue-600 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">12,340</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Active Users</h3>
            <FaUsers className="text-green-600 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">1,987</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Revenue</h3>
            <FaRupeeSign className="text-yellow-500 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">₹1.2L</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
        </div>
      </div>

      {/* Feature Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Charts */}
        <div
          onClick={() => navigate('/Dashboard')}
          className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transform transition duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-semibold text-gray-700 dark:text-white">Analytics & Charts</h4>
            <FaChartPie className="text-red-500 text-3xl" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Visualize bookings, flops, hits.</p>
        </div>
  
      </div>
      {/* Analytics and charts combined  */}
      <ChartsPage/>
    </div>
  );
};

export default Dashboard;
