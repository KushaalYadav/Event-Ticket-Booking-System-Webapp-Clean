import React ,{useState}from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ShowDetails from './pages/ShowDetails';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import ResetPasswordPage from './pages/ResetPasswordPage'
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import BookShow from './pages/BookShow';
import SelectSeats from "./pages/SelectSeats";
import SeatBookingPage from './pages/SeatBookingPage'; 
import AboutUs from './pages/AboutUs';
import Dashboard from './pages/Dashboard';
import ChartsPage from './pages/ChartsPage';
import Footer from './components/Footer/Footer';
import ConfirmationPage from "./pages/ConfirmationPage";
import MyBookings from "./pages/MyBookings";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Hidden by default

  const toggleSidebar = () => setSidebarOpen(prev => !prev);


  return (
    <AuthProvider>
      <Router>
      <div className="flex h-screen overflow-x-hidden bg-gray-100 dark:bg-gray-900">
          {/* Sidebar - conditionally rendered */}
          <div
            className={`fixed z-40 inset-y-0 left-0 transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out w-64`}
          >
            <Sidebar />
          </div>
          <div className={`flex-1 flex flex-col overflow-x-hidden transition-margin duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Topbar onToggleSidebar={toggleSidebar} />
            <div className="flex-grow p-4">
              <Routes>
                <Route path="/" element={<PrivateRoute><Home showBanner={sidebarOpen} /></PrivateRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/show/:id" element={<PrivateRoute><ShowDetails/></PrivateRoute>} />
                <Route path="/book/:id" element={<BookShow />} />
                <Route path="/seats/:movieId/:date/:theatre/:time" element={<SeatBookingPage />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/charts" element={<ChartsPage />} />
                <Route path="/seats/:movieId/:selectedDate/:selectedTime" element={<SelectSeats />} />
                <Route path="/confirmation/:paymentId" element={<ConfirmationPage />} />
                <Route path="/my-bookings" element={<MyBookings />} />
              </Routes>
            </div>

{/* Global Footer */}
<Footer />
          </div>
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
