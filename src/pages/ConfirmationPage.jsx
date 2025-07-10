import React, { useEffect,useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "../services/firebase";
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from "firebase/auth";
import TicketModal from "../components/TicketModal";
import "../css/ConfirmationPage.css"; // ✅ CORRECT

const ConfirmationPage = () => {
  const { paymentId } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [movieData, setMovieData] = useState(null);
  const receiptRef = useRef();
  const { currentUser } = useAuth(); // For user ID and email
const userId = currentUser?.uid || localStorage.getItem("userSessionId");
const userEmail = currentUser?.email || localStorage.getItem("userEmail")
  // ✅ Step 2: Get logged-in user details
  const [userDetails, setUserDetails] = useState({
    name: "CineReserve User",
    email: "user@example.com",
    phone: "9000090000",
  });

  const auth = getAuth();

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserDetails({
          name: currentUser.displayName || "CineReserve User",
          email: currentUser.email || "user@example.com",
          phone: currentUser.phoneNumber || "9000090000",
        });
      }
    };

    fetchUser();
  }, [auth]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("paymentId", "==", paymentId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setTicketData(querySnapshot.docs[0].data());
        }
      } catch (err) {
        console.error("❌ Error fetching ticket data", err);
      }
    };

    fetchTicket();
  }, [paymentId]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!ticketData?.movieId) return;
      try {
        const movieQuery = query(
          collection(db, "movies"),
          where("id", "==", ticketData.movieId)
        );
        const querySnapshot = await getDocs(movieQuery);
        if (!querySnapshot.empty) {
          setMovieData(querySnapshot.docs[0].data());
        }
      } catch (err) {
        console.error("Error fetching movie data", err);
      }
    };
    fetchMovie();
  }, [ticketData]);
  const selectedSeats = ['A1', 'A2'];          // example
const venue = 'PVR: Pacific Mall, Delhi';    // example
const movieTitle = 'Dunki';                  // example

const saveBookingToFirestore = async () => {
    try {
      const bookingRef = collection(db, 'movies', movieId, 'bookings');
      await addDoc(bookingRef, {
        userId,
        email: userEmail,
        paymentId,
        seatNumbers: selectedSeats,
        venue,
        date,
        time,
        amount,
        movieTitle,
        timestamp: serverTimestamp()
      });
  
      console.log("Booking saved successfully.");
    } catch (error) {
      console.error("Error saving booking to Firestore:", error);
    }
  };
  
  if (!ticketData) return null;
  const {
    movieId,
    theatre,
    date,
    time,
    seats,
    amount,
    paymentId: refId,
  } = ticketData;


    return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-gray-900 px-6 py-10 font-poppins">
      <div className="max-w-6xl mx-auto w-full space-y-10">

{/* 🔶 Section 1: Ticket Confirmation Styled Container */}
<div className="w-full flex justify-center animate-ticket-entry">
  <div className="w-[95%] bg-white rounded-2xl shadow-xl overflow-hidden border relative font-poppins">

    {/* Zigzag Border Top */}
    <div className="h-4 bg-[#c8b2d6] rounded-b-full w-full" />

    {/* 🧾 Top Booking Details */}
    <div className="px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-center bg-white">
      
      {/* 📄 Left Info */}
      <div className="md:col-span-3 space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#532f63] tracking-wide uppercase font-serif">
          Booking Confirmation
        </h2>
        <p className="text-gray-700 font-medium text-lg">
          {userDetails.name}, your booking has been confirmed!
        </p>

        <div className="mt-2">
          <p className="font-bold text-xl text-[#111]">{theatre}</p>
          <p className="text-sm text-gray-600">Movie ID: {movieId}</p>
        </div>

        <div className="text-sm space-y-1 mt-2 text-gray-800">
          <p><strong>Booked Seats:</strong> {seats.join("")}</p>
          <p><strong>Phone:</strong> {userDetails.phone}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
        </div>
      </div>

      {/* 🗓️ Right Date Box */}
      <div className="text-center bg-[#f5f5f5] rounded-lg px-4 py-6 shadow-inner flex flex-col justify-center items-center">
        <div className="text-[#532f63] font-bold text-5xl leading-tight">
          {new Date(date).getDate()}
        </div>
        <p className="uppercase text-sm text-gray-500 mt-1">
          {new Date(date).toLocaleString("default", { month: "long" })}
        </p>
        <p className="text-sm font-medium text-gray-700 mt-2">{time}</p>
        <p className="text-xs text-gray-500 mt-4 font-semibold tracking-wide">
          Ref: {seats.join("")}
        </p>
      </div>
    </div>

    {/* 🎉 Divider Ribbon */}
    <div className="flex justify-center -mt-4 z-20 relative">
      <span className="bg-[#532f63] text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg uppercase tracking-widest">
        🎉 Congratulations
      </span>
    </div>

    {/* 🎁 Bottom Offer Segment */}
    <div className="bg-green-500 text-white px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <h3 className="text-lg font-bold">Enjoy 50% OFF on Your First Popcorn Combo!</h3>
        <p className="text-sm mt-1">Show this ticket at the food counter and redeem your exclusive offer.</p>
      </div>
      <div className="flex items-center justify-center md:justify-end">
        <div className="bg-white text-green-700 font-semibold px-6 py-3 rounded-md shadow text-center">
          <p className="text-sm uppercase">Use Code</p>
          <p className="text-xl font-bold tracking-wide">CINE50OFF</p>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* 🖼️ Section 2: Banner with Overlay Text */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-lg"
          style={{ height: "200px" }}
        >
          <img
            src="https://img.freepik.com/free-photo/cinema-elements-background-with-copy-space_23-2148467834.jpg"
            alt="Movie Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-white text-3xl md:text-4xl font-bold text-center px-6">
              Sit back, relax & enjoy the show 🍿 <br /> Your entertainment awaits!
            </h2>
          </div>
        </div>

        {/* 🎫 Section 3: View Ticket Button */}
        <div className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg rounded-full shadow-md transition"
          >
            View Ticket / Receipt
          </button>
        </div>

        {/* Ticket Modal */}
        {showModal && ticketData && (
            <TicketModal
  booking={ticketData}
  movieData={movieData || { formats: [], duration: "2h 30m" }}
  userDetails={userDetails}
  onClose={() => setShowModal(false)}
/>

      
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;
