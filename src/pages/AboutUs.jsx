import React, { useState } from 'react';
import { FaUsers, FaGlobe, FaCity, FaTv, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFlag } from 'react-icons/fa';
import axios from 'axios';

const AboutUs = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => setShowModal(!showModal);

  const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [message, setMessage] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    const payload = { name, email, phone, message };
  
    try {
      const response = await axios.post('http://localhost:5000/api/contact', payload);
      console.log('Message sent!', response.data);
      alert('Thank you! We will get back to you soon.');
      setShowModal(false); // Close modal
      // Reset fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Something went wrong. Please try again later.');
    }
  };
  
  return (
    <div className="font-inter text-gray-800 bg-[#f1f1f1]">

      {/* === Hero Section === */}
      <div
        className="relative h-[65vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(88, 28, 135, 0.6)), url('https://images.unsplash.com/photo-1607706189992-eae578626c44?auto=format&fit=crop&w=1600&q=80')`,
        }}
      >
        <div className="text-center px-6 md:px-12">
          <h3 className="text-white text-base uppercase tracking-[0.2em] font-light">We Are</h3>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-3 drop-shadow-md">
            MOVIE BUFFS
          </h1>
        </div>
      </div>

      {/* === Developer Section === */}
      <div className="bg-[#f7f7f7] py-14 px-6 md:px-20">
        <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-center text-3xl md:text-4xl font-merriweather text-pink-700 uppercase mb-6 tracking-wide">
            ~ Crafted by the Developer
          </h2>
          <p className="text-center text-gray-700 text-lg leading-relaxed tracking-wide">
            Hey 👋, I am <strong>Kushaal Yadav</strong>, and this is my recent project – a
            <strong> fully functional Event Ticket Booking Web Application</strong> built using a powerful tech stack
            including <strong>React.js</strong>, <strong>Tailwind CSS</strong>, <strong>Firebase</strong> (for real-time DB, auth),
            and <strong>Razorpay API</strong> for seamless payments.
            <br /><br />
            The app features real-time seat tracking, seat-lock logic before checkout, dynamic admin dashboards with
            drag-and-drop Kanban boards, a full-featured calendar, and CRUD tables. It’s built to reflect modern design
            and accessibility.
            <br /><br />
            I developed this project as my <strong>final internship project</strong> over 2 months to reflect my
            expertise in full-stack development and my deep interest in cloud operations and real-world scalable systems.
            I'm truly passionate about creating digital experiences that connect and empower people 🚀.
          </p>
        </div>
      </div>

      {/* === Quick Facts Section === */}
      <div className="bg-[#2f2f2f] py-16 px-6 md:px-24 text-white">
        <div className="text-center mb-14">
          <h3 className="text-3xl font-semibold font-merriweather text-white tracking-wide">Quick Facts</h3>
          <div className="w-16 h-1 bg-pink-500 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-16 text-center">
          <div className="flex flex-col items-center space-y-2">
            <FaUsers className="text-5xl text-pink-400 mb-2" />
            <h4 className="text-2xl font-bold">30 Million+</h4>
            <p className="text-sm text-gray-300">Customers</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <FaGlobe className="text-5xl text-emerald-400 mb-2" />
            <h4 className="text-2xl font-bold">5</h4>
            <p className="text-sm text-gray-300">Countries</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <FaCity className="text-5xl text-yellow-400 mb-2" />
            <h4 className="text-2xl font-bold">650+</h4>
            <p className="text-sm text-gray-300">Towns and Cities</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <FaTv className="text-5xl text-sky-400 mb-2" />
            <h4 className="text-2xl font-bold">5000+</h4>
            <p className="text-sm text-gray-300">Screens</p>
          </div>
        </div>
      </div>

{/* === Contact Us Section (Updated) === */}
<div className="bg-[#e2e2e2] py-20 px-6 md:px-24 text-gray-800">
  <h3 className="text-center text-4xl font-semibold font-merriweather text-[#222222] mb-10 relative inline-block after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[3px] after:bg-pink-600">
    Contact Us
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto text-[1rem]">
    <div className="flex items-center gap-4 text-[#333]">
      <FaEnvelope className="text-pink-600 text-xl" />
      <span><strong>Email:</strong> kushaalnp@gmail.com</span>
    </div>
    <div className="flex items-center gap-4 text-[#333]">
      <FaPhone className="text-pink-600 text-xl" />
      <span><strong>Phone:</strong> +91 9034753612</span>
    </div>
    <div className="flex items-center gap-4 text-[#333]">
      <FaLinkedin className="text-blue-700 text-xl" />
      <a
        href="https://www.linkedin.com/in/kushaal-yadav"
        target="_blank"
        rel="noreferrer"
        className="hover:underline"
      >
        LinkedIn
      </a>
    </div>
    <div className="flex items-center gap-4 text-[#333]">
      <FaGithub className="text-black text-xl" />
      <a
        href="https://github.com/KushaalYadav"
        target="_blank"
        rel="noreferrer"
        className="hover:underline"
      >
        GitHub
      </a>
    </div>
    <div className="flex items-center gap-4 text-[#333]">
      <FaMapMarkerAlt className="text-green-700 text-xl" />
      <span><strong>Address:</strong> Gurugram, Haryana</span>
    </div>
    <div className="flex items-center gap-4 text-[#333]">
      <FaFlag className="text-red-600 text-xl" />
      <span><strong>Country:</strong> India</span>
    </div>
  </div>

  <div className="text-center mt-14">
    <button
      onClick={handleModalToggle}
      className="bg-gradient-to-r from-pink-600 to-red-500 hover:from-pink-700 hover:to-red-600 text-white px-12 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
    >
      Contact Us
    </button>
  </div>
</div>


{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
    <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl p-8 relative font-poppins overflow-y-auto max-h-[90vh]">
      
      {/* Close Button */}
      <button
        onClick={handleModalToggle}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
      >
        &times;
      </button>

      {/* Heading */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-8 border-b pb-2">
        Write to Us by filling in this form below
      </h3>

      {/* Name - Full Width */}
      <div className="mb-5">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
          * Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Email & Mobile Number - Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            * Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
            * Mobile Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 XXXXX-XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Message - Full Width */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows="4"
          placeholder="Enter message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-md shadow-md transition-all duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AboutUs;
