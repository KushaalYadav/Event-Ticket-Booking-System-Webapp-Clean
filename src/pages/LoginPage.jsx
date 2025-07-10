import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import LoggedInPanel from '../components/LoggedInPanel';

const LoginPage = () => {
  const { theme } = useTheme();
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErr = {};
    if (!formData.email.trim()) newErr.email = 'Email is required';
    if (!formData.password.trim()) newErr.password = 'Password is required';
    return newErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
    } else {
      try {
        await login(formData.email, formData.password);
        toast.success("Logged in successfully!");
        navigate('/');
      } catch {
        toast.error("Invalid email or password");
      }
    }
  };

  if (currentUser) {
    return <LoggedInPanel />;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" name="email" placeholder="Email"
            className={`w-full p-3 rounded border ${errors.email ? 'border-red-500' : 'border-gray-300'} dark:bg-gray-700`}
            value={formData.email} onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password" name="password" placeholder="Password"
            className={`w-full p-3 rounded border ${errors.password ? 'border-red-500' : 'border-gray-300'} dark:bg-gray-700`}
            value={formData.password} onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>

          <p className="text-center text-sm mt-4">
            <Link to="/signup" className="text-blue-500 hover:underline">Create one</Link>
          </p>
          <p className="text-center text-sm mt-2">
            <Link to="/reset-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
