import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { db, auth } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';

const SignupPage = () => {
  const { theme } = useTheme();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '',
    phoneCode: '+91', phoneNumber: '', country: '', city: ''
  });
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.username.trim()) newErrors.username = 'Username required';
    if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
    if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone required';
    if (!formData.country) newErrors.country = 'Country required';
    if (!formData.city) newErrors.city = 'City required';
    return newErrors;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const credential = await signup(formData.email, formData.password);
      const user = credential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'userProfiles', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        phone: formData.phoneCode + formData.phoneNumber,
        address: { city: formData.city, country: formData.country }
      });

      setModalOpen(true);
      toast.success('Verification email sent! Check your inbox.');

    } catch (err) {
      toast.error(err.message);
    }
  };

  // Auto detect email verification
  useEffect(() => {
    if (modalOpen) {
      const interval = setInterval(() => {
        const user = auth.currentUser;
        if (user) {
          user.reload().then(() => {
            if (user.emailVerified) {
              clearInterval(interval);
              toast.success('Email verified successfully!');
              navigate('/'); // Redirect to dashboard/home
            }
          });
        }
      }, 3000); // check every 3 seconds

      return () => clearInterval(interval);
    }
  }, [modalOpen, navigate]);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen flex items-center justify-center`}>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Signup</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['firstName','lastName','username','email','password','phoneNumber','country','city'].map(field => (
            <div key={field} className={`col-span-1 ${field==='phoneNumber'?'flex gap-2 col-span-2':''}`}>
              {field === 'phoneNumber' ? (
                <>
                  <input name="phoneCode" readOnly value={formData.phoneCode} className="p-3 w-20 rounded border dark:bg-gray-700" />
                  <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="p-3 flex-1 rounded border dark:bg-gray-700" />
                </>
              ) : (
                <input
                  type={field==='password'?'password':'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`p-3 border rounded w-full dark:bg-gray-700 ${errors[field]?'border-red-500':''}`}
                />
              )}
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}
          <button type="submit" className="col-span-2 mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Signup</button>
          <p className="col-span-2 mt-4 text-center text-sm">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </form>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 space-y-4 text-center">
            <h3 className="text-xl font-semibold text-blue-600">Verify Your Email</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              A verification link has been sent to:
            </p>
            <p className="text-md font-semibold text-black dark:text-white">{formData.email}</p>
            <p className="text-sm mt-2 text-green-600 font-medium">
              ✅ Just check your Inbox or Spam folder
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🔗 Click the link to complete your verification process
            </p>
            <p className="text-xs text-gray-500 italic mt-3">
              We'll detect the verification automatically and log you in!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
