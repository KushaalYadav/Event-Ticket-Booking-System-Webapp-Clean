import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Camera, Pencil, UploadCloud } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toast } from 'react-toastify';

const LoggedInPanel = () => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState({
    email: currentUser?.email || '',
    phone: currentUser?.phoneNumber || '',
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    married: '',
    address: {
      pincode: '',
      line1: '',
      line2: '',
      landmark: '',
      city: '',
      state: ''
    }
  });

  const [emailEditable, setEmailEditable] = useState(!userData.email);
  const [phoneEditable, setPhoneEditable] = useState(!userData.phone);
  const [expanded, setExpanded] = useState(true);

  const uid = localStorage.getItem('customUID');

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!uid) return;
      const docRef = doc(db, 'userProfiles', uid);
      const userSnap = await getDoc(docRef);
      if (userSnap.exists()) {
        setUserData(prev => ({ ...prev, ...userSnap.data() }));
      }
    };
    fetchUserProfile();
  }, [uid]);

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    if (!uid) return;
    try {
      await setDoc(doc(db, 'userProfiles', uid), userData, { merge: true });
      toast.success('Changes saved!');
    } catch (error) {
      toast.error('Failed to save changes');
      console.error(error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in userData.address) {
      setUserData(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setUserData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center space-x-6 border-b pb-6 mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
            <Camera className="text-gray-500" size={32} />
          </div>
          <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
            <UploadCloud size={16} className="text-gray-700" />
          </button>
        </div>

        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Hi, {userData.firstName || 'Guest'}
          </h2>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4 dark:text-white">Account Details</h3>

        {/* Email */}
        <div className="mb-4 flex items-center justify-between">
          <label className="text-gray-700 dark:text-gray-300 font-medium">Email Address</label>
          {emailEditable ? (
            <div className="flex-1 ml-4">
              <input
                type="email"
                name="email"
                value={userData.email}
                placeholder="Add Email"
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-yellow-400 bg-yellow-50 text-yellow-800"
              />
              <p className="text-sm text-yellow-600 mt-1">Get a copy of the tickets on your Email</p>
            </div>
          ) : (
            <div className="ml-4 flex items-center">
              <span className="text-green-700">{userData.email || 'Not Provided'}</span>
              {userData.email && <CheckCircle className="text-green-600 ml-2" size={18} />}
              <button
                onClick={() => setEmailEditable(true)}
                className="ml-4 text-sm text-red-600 flex items-center"
              >
                <Pencil size={14} className="mr-1" />
                {userData.email ? 'Edit' : 'Add'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="mb-4 flex items-center justify-between">
          <label className="text-gray-700 dark:text-gray-300 font-medium">Mobile Number</label>
          {phoneEditable ? (
            <div className="ml-4 flex gap-2 items-center">
              <input
                name="phone"
                value={userData.phone}
                placeholder="Enter mobile number"
                onChange={handleInputChange}
                className="p-2 border border-yellow-400 bg-yellow-50 rounded text-yellow-800"
              />
              <button onClick={() => setPhoneEditable(false)} className="text-blue-600 text-sm">Done</button>
            </div>
          ) : (
            <div className="ml-4 flex items-center">
              <span className="text-green-700">{userData.phone || '+91 - Not Provided'}</span>
              {userData.phone && (
                <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
              )}
              <button
                onClick={() => setPhoneEditable(true)}
                className="ml-4 text-sm text-red-600 flex items-center"
              >
                <Pencil size={14} className="mr-1" />
                {userData.phone ? 'Edit' : 'Add'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Personal Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" placeholder="Enter first name" value={userData.firstName} onChange={handleInputChange}
            className="p-3 border rounded dark:bg-gray-700" />
          <input name="lastName" placeholder="Enter last name" value={userData.lastName} onChange={handleInputChange}
            className="p-3 border rounded dark:bg-gray-700" />
          <input name="birthday" type="date" value={userData.birthday} onChange={handleInputChange}
            className="p-3 border rounded dark:bg-gray-700" />

          {/* Gender Buttons */}
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-700 dark:text-gray-300">Identity:</label>
            <button
              className={`px-4 py-1 rounded ${userData.gender === 'Woman' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
              onClick={() => setUserData({ ...userData, gender: 'Woman' })}
            >Woman</button>
            <button
              className={`px-4 py-1 rounded ${userData.gender === 'Man' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
              onClick={() => setUserData({ ...userData, gender: 'Man' })}
            >Man</button>
          </div>

          {/* Married */}
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-700 dark:text-gray-300">Married?</label>
            <button
              className={`px-4 py-1 rounded ${userData.married === 'Yes' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
              onClick={() => setUserData({ ...userData, married: 'Yes' })}
            >Yes</button>
            <button
              className={`px-4 py-1 rounded ${userData.married === 'No' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
              onClick={() => setUserData({ ...userData, married: 'No' })}
            >No</button>
          </div>
        </div>

        {/* Address */}
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Address (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['pincode', 'line1', 'line2', 'landmark', 'city', 'state'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={userData.address[field]}
              onChange={handleInputChange}
              className="p-3 border rounded dark:bg-gray-700"
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <button
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default LoggedInPanel;
