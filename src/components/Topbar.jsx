// src/components/Topbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon ,MenuIcon} from 'lucide-react';

const Topbar = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  const navLinkStyle =
    'text-sm md:text-base px-3 py-2 rounded-md transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700';

  const activeStyle =
    'font-semibold text-blue-600 dark:text-yellow-400';

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow-md border-b dark:border-gray-700 transition-all">
      {/* Sidebar Toggle */}
      <button onClick={onToggleSidebar} className="text-gray-700 dark:text-gray-200 mr-4 focus:outline-none">
        <MenuIcon size={24} />
      </button>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white flex-1">CineVerses</h1>
  
      <nav className="flex items-center gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${navLinkStyle} ${isActive ? activeStyle : 'hover:text-pink-600 font-medium'}`
          }
        >
          Home 
        </NavLink>
        
        <NavLink
          to="/my-bookings"
          className={({ isActive }) =>
            `${navLinkStyle} ${isActive ? activeStyle : 'hover:text-pink-600 font-medium'}`
          }
        >
          My Booking
        </NavLink>
        <NavLink
          to="/about-us"
          className={({ isActive }) =>
            `${navLinkStyle} ${isActive ? activeStyle : 'hover:text-pink-600 font-medium'}`
          }
        >
          About Us
        </NavLink>
        
        <NavLink
            to="/Dashboard"
            className={({ isActive }) =>
                `${navLinkStyle} ${isActive ? activeStyle : 'hover:text-pink-600 font-medium'}`
            }
        >
            Insights
            </NavLink>


        <NavLink
          to="/login"
          className={({ isActive }) =>
            `${navLinkStyle} ${isActive ? activeStyle : 'hover:text-pink-600 font-medium'}`
          }
        >
          Login
        </NavLink>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="ml-3 p-2 rounded-full transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>
      </nav>
    </header>
  );
};

export default Topbar;
