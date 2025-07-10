import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { v4 as uuidv4 } from "uuid";
import { FaPen, FaTimes } from "react-icons/fa";
import { HiChevronLeft } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import BookingSummaryModal from '../components/BookingSummaryModal'; 
import { arrayUnion, addDoc, collection, serverTimestamp } from "firebase/firestore";


const SeatBookingPage = () => {
  const { movieId, date, theatre, time } = useParams();
  const navigate = useNavigate();
  const [paymentDone, setPaymentDone] = useState(false);
  const [step, setStep] = useState("prompt");
  const [selectedCount, setSelectedCount] = useState(2);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movie, setMovie] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const reclinerRows = ["J", "K"];
  const classicRows = ["H", "G", "F", "E", "D", "C", "B", "A"];
  const seatsPerRow = 17;

  // Generate a unique session id
  const userSessionId = localStorage.getItem("userSessionId") || (() => {
    const id = uuidv4();
    localStorage.setItem("userSessionId", id);
    return id;
  })();



  const handlePayment = async () => {
    const amount = selectedSeats.reduce(
      (acc, s) => acc + (["J", "K"].includes(s.charAt(0)) ? 600 : 200),
      0
    );
  
    const subtotal = amount + (selectedSeats.length * 35.4); // including convenience fee if applicable
  
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY, // ✅ Use from .env for security
      amount: Math.round(subtotal * 100), // in paise
      currency: "INR",
      name: "CineReserve",
      description: `Booking for ${selectedSeats.length} ticket(s)`,
      prefill: {
        name: "CineReserve User",
        email: "user@example.com",
        contact: "9000090000",
      },
      theme: {
        color: "#EC4899",
      },
      handler: async function (response) {
        console.log("✅ Razorpay response:", response);
  
        if (!response.razorpay_payment_id) {
          alert("❌ Payment failed or was cancelled.");
          return;
        }
  
        try {
          // ✅ 1. Store booked seats in Firestore
          const docRef = doc(db, "shows", movieId);
          await updateDoc(docRef, {
            [`seats.${showKey}`]: arrayUnion(...selectedSeats),
          });
          console.log("🎟️ Seats updated in Firestore");
  
          // ✅ 2. Store booking receipt
          const receiptRef = collection(db, "bookings");
          await addDoc(receiptRef, {
            movieId,
            theatre,
            date,
            time,
            seats: selectedSeats,
            amount: subtotal,
            paymentId: response.razorpay_payment_id,
            userSessionId,
            showKey,
            timestamp: serverTimestamp(),
          });
          console.log("📜 Receipt stored in Firestore");
  
          // ✅ 3. Close modal and navigate to confirmation
          setPaymentDone(true);
          setShowConfirmModal(false);
  
          // ✅ Navigate to confirmation screen
          navigate(`/confirmation/${response.razorpay_payment_id}`);
  
        } catch (err) {
          console.error("🔥 Firestore write error:", err);
          alert("❌ Booking failed after payment. Contact support.");
        }
      },
      modal: {
        ondismiss: function () {
          console.warn("⚠️ Razorpay Checkout closed by user.");
          alert("Payment was cancelled.");
        },
      },
    };
  
    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("💥 Razorpay open failed:", err);
      alert("Unable to start payment. Please try again.");
    }
  

  };
      
  
  const normalizedTime = time.replace(/\s+/g, "").toUpperCase();
  const normalizedTheatre = decodeURIComponent(theatre).replace(/\s+/g, " ").trim();
  const showKey = `${normalizedTheatre}_${date}_${normalizedTime}`;
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  
  
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const docRef = doc(db, "shows", movieId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setMovie(data);

          const showKeys = Object.keys(data?.seats || {});
          const matchedKey = showKeys.find((key) => key.trim() === showKey.trim());
          const booked = matchedKey ? data.seats[matchedKey] : [];
          setBookedSeats(booked.map((seat) => seat.trim()));

          const lockedKeys = Object.keys(data?.lockedSeats || {});
          const matchedLockedKey = lockedKeys.find((key) => key.trim() === showKey.trim());
          const locked = matchedLockedKey ? data.lockedSeats[matchedLockedKey] : {};

          setBookedSeats(booked);
          setLockedSeats(locked);

          console.log("Expected showKey:", showKey);
          console.log("All Firestore seats keys:", Object.keys(data?.seats || []));
          console.log("Matched showKey for seats:", matchedKey);

                  
        }
      } catch (err) {
        console.error("Error loading movie/show:", err);
      }
    };

    fetchMovie();
    const interval = setInterval(fetchMovie, 10000);
    return () => clearInterval(interval);
  }, [movieId, showKey]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      const expired = Object.entries(lockedSeats || {}).filter(
        ([_, val]) => now - val.lockedAt > 5 * 60 * 1000
      );
      if (expired.length > 0) {
        const updated = { ...lockedSeats };
        expired.forEach(([key]) => delete updated[key]);

        const docRef = doc(db, "shows", movieId);
        await setDoc(docRef, {
          lockedSeats: {
            [showKey]: updated,
          },
        }, { merge: true });

        setLockedSeats(updated);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [lockedSeats]);

  const handleSeatClick = async (row, seatNum) => {
    const seatId = `${row}${seatNum}`;
    const docRef = doc(db, "shows", movieId);
  
    // 🚫 Prevent selecting already booked or locked by others
    if (bookedSeats.includes(seatId)) return;
    if (lockedSeats?.[seatId] && lockedSeats[seatId].userId !== userSessionId) return;
  
    // ✅ If this seat is already selected, remove it (deselect)
    if (selectedSeats.includes(seatId)) {
      const newSelection = selectedSeats.filter((s) => s !== seatId);
  
      // 🔐 Remove its lock from Firestore
      const updatedLocks = { ...lockedSeats };
      delete updatedLocks[seatId];
  
      await setDoc(docRef, {
        lockedSeats: {
          [showKey]: updatedLocks
        }
      }, { merge: true });
  
      setSelectedSeats(newSelection);
      setLockedSeats(updatedLocks);
      return;
    }
  
    // 🧠 User is selecting a new group, so reset selection
    const totalToSelect = selectedCount;
    const adjacentSeats = [seatId];
  
    // ⬅️ Left
    for (let i = 1; adjacentSeats.length < totalToSelect; i++) {
      const leftSeat = `${row}${seatNum - i}`;
      if (
        seatNum - i > 0 &&
        !bookedSeats.includes(leftSeat) &&
        !(lockedSeats?.[leftSeat] && lockedSeats[leftSeat].userId !== userSessionId)
      ) {
        adjacentSeats.unshift(leftSeat);
      } else break;
    }
  
    // ➡️ Right
    for (let i = 1; adjacentSeats.length < totalToSelect; i++) {
      const rightSeat = `${row}${seatNum + i}`;
      if (
        !bookedSeats.includes(rightSeat) &&
        !(lockedSeats?.[rightSeat] && lockedSeats[rightSeat].userId !== userSessionId)
      ) {
        adjacentSeats.push(rightSeat);
      } else break;
    }
  
    const finalSelection = adjacentSeats.slice(0, totalToSelect);
  
    // 🛡️ Lock new selection
    const newLocks = {};
    const now = Date.now();
    finalSelection.forEach((seat) => {
      newLocks[seat] = { userId: userSessionId, lockedAt: now };
    });
  
    // 🔄 Replace locked seats entirely for this show
    await setDoc(docRef, {
      lockedSeats: {
        [showKey]: {
          ...Object.fromEntries(
            Object.entries(lockedSeats || {}).filter(
              ([_, val]) => val.userId !== userSessionId
            )
          ),
          ...newLocks
        }
      }
    }, { merge: true });
  
    // ✅ Update state
    setSelectedSeats(finalSelection);
    setLockedSeats((prev) => ({
      ...Object.fromEntries(
        Object.entries(prev || {}).filter(
          ([_, val]) => val.userId !== userSessionId
        )
      ),
      ...newLocks
    }));
  };

  const isSeatDisabled = (seatId) => {
    const trimmedId = seatId.trim(); 
    const locked = lockedSeats?.[trimmedId];
    return bookedSeats.includes(trimmedId) || (locked && locked.userId !== userSessionId);
  };
  

  const renderSeat = (row, i) => {
    const seatId = `${row}${i + 1}`.trim();

    const isSelected = selectedSeats.includes(seatId);
    const isDisabled = isSeatDisabled(seatId);

    return (
      <div
        key={seatId}
        onClick={() => !isDisabled && handleSeatClick(row, i + 1)}
        className={`w-6 h-6 text-xs flex items-center justify-center border rounded-sm cursor-pointer ${
          isDisabled
            ? "bg-gray-300 text-white cursor-not-allowed"
            : isSelected
            ? "bg-green-600 text-white"
            : "border-green-500 text-green-500 hover:bg-green-100"
        }`}
      >
        {i + 1}
      </div>
    );
  };

  const showTimings =
    movie?.theaters?.find((t) => t.name === decodeURIComponent(theatre))?.timings?.[date] || [];


 

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative">
      {/* 🧾 Seat Prompt Modal */}
      {step === "prompt" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] z-50 text-center">
            <h2 className="text-lg font-semibold mb-4">How Many Seats?</h2>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2925/2925438.png"
              alt="Seat Icon"
              className="w-24 mx-auto mb-4"
            />
            <div className="flex justify-center gap-3 mb-6">
              {Array.from({ length: 10 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCount(i + 1)}
                  className={`w-8 h-8 rounded-full border-2 text-sm ${
                    selectedCount === i + 1
                      ? "bg-pink-500 text-white border-pink-500"
                      : "border-gray-300 text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-12 mb-6 text-sm">
              <div>
                <p className="font-semibold">RECLINER</p>
                <p className="text-green-600">Rs. 600</p>
              </div>
              <div>
                <p className="font-semibold">CLASSIC</p>
                <p className="text-green-600">Rs. 200</p>
              </div>
            </div>
            <button
              onClick={() => setStep("seats")}
              className="w-full bg-pink-500 text-white font-semibold py-2 rounded-md hover:bg-pink-600 transition"
            >
              Select Seats
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <BookingSummaryModal
          selectedSeats={selectedSeats}
          ticketPrice={200}
          onClose={() => setShowConfirmModal(false)}
          onProceed={handlePayment}
        />
      )}

{paymentDone && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center font-poppins">
    <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden p-6 space-y-4 text-center">
      <h2 className="text-xl font-semibold text-green-600">🎉 Booking Confirmed!</h2>
      <p className="text-gray-700">Your seats have been successfully booked.</p>
      <div className="text-sm text-gray-600">
        <p><strong>Movie:</strong> {movie?.title}</p>
        <p><strong>Theatre:</strong> {decodeURIComponent(theatre)}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
      >
        Back to Home
      </button>
    </div>
  </div>
)}


            {/* 🎬 Movie Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Back Icon */}
        <button
            onClick={() => navigate(`/book/${movieId}?date=${date}`)}
            className="text-gray-700 dark:text-white text-xl"
        >
            <HiChevronLeft />
        </button>

        {/* Movie Info */}
        <div className="flex-1 mx-4 text-center">
            {movie && (
            <h1 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                {movie.title}
            </h1>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
            {decodeURIComponent(theatre)} | {new Date(date).toDateString()},{" "}
            {time}
            </p>
        </div>

        {/* Tickets and Close Icons */}
        <div className="flex items-center gap-3">
            {/* Tickets box */}
            <button
            onClick={() => setStep("prompt")}
            className="flex items-center border border-gray-400 dark:border-gray-600 rounded px-3 py-1 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
            {selectedCount} Tickets <FaPen className="ml-2 text-xs" />
            </button>

            {/* Close icon */}
            <button
            onClick={() => navigate(`/book/${movieId}?date=${date}`)}
            className="text-gray-500 dark:text-gray-300 text-sm hover:text-red-500"
            >
            <FaTimes className="text-base" />
            </button>
        </div>
        </div>


      
      {/* Show Time Bar */}
      <div className="flex gap-2 px-6 py-4 mb-4 flex-wrap w-full max-w-[100vw] overflow-x-hidden border-b shadow-sm bg-gray-100 dark:bg-gray-800">
        {showTimings.map((t, i) => (
          <div
            key={i}
            className={`px-4 py-2 text-sm rounded-md font-medium border ${
              t === time
                ? "bg-green-600 text-white"
                : "border-green-600 text-green-600 hover:bg-green-100"
            }`}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Full-width seat container with centered content */}
            <div className="w-full max-w-[100vw] overflow-x-hidden bg-gray-50 dark:bg-gray-800 py-8 ">
            <div className="max-w-4xl mx-auto">

                {/* --- Recliner Section --- */}
                <h2 className="text-sm mb-4 text-gray-600 dark:text-gray-300 px-2">Rs. 600 RECLINER</h2>

                {/* Gap above K */}
                <div className="h-4" />

                {/* Row K: 14 continuous seats */}
                <div className="flex gap-2 items-center mb-4">
                <span className="w-4">{'K'}</span>
                <div className="grid grid-cols-[repeat(14,1.75rem)] gap-2 ml-6">
                    {Array.from({ length: 14 }, (_, i) => {
                    const seatId = `K${i + 1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isDisabled = isSeatDisabled(seatId); 
                    
                    return (
                        <div
                        key={seatId}
                        onClick={() => handleSeatClick('K', i + 1)}
                        className={`w-7 h-7 text-xs flex items-center justify-center border rounded cursor-pointer ${
                          isDisabled
                            ? "bg-gray-200 text-white cursor-not-allowed"
                            : isSelected
                            ? "bg-green-600 text-white"
                            : "border-green-500 text-green-500 hover:bg-green-100"
                        }`}
                        >
                        {i + 1}
                        </div>
                    );
                    })}
                </div>
                </div>

                {/* Gap between K and J */}
                <div className="h-6" />

                {/* Row J: 6 seats + gap + 6 seats */}
                <div className="flex gap-2 items-center mb-8">
                <span className="w-4">{'J'}</span>
                <div className="grid grid-cols-[repeat(6,1.75rem)_4rem_repeat(6,1.75rem)] gap-2 ml-6">
                    {Array.from({ length: 6 }, (_, i) => {
                    const seatId = `J${i + 1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isDisabled = isSeatDisabled(seatId); 
                    return (
                        <div
                        key={seatId}
                        onClick={() => handleSeatClick('J', i + 1)}
                        className={`w-7 h-7 text-xs flex items-center justify-center border rounded cursor-pointer ${
                          isDisabled
                            ? "bg-gray-200 text-white cursor-not-allowed"
                            : isSelected
                            ? "bg-green-600 text-white"
                            : "border-green-500 text-green-500 hover:bg-green-100"
                        }`}                        
                        >
                        {i + 1}
                        </div>
                    );
                    })}
                    {/* Empty gap */}
                    <div></div>
                    {Array.from({ length: 6 }, (_, i) => {
                    const seatId = `J${i + 7}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isDisabled = isSeatDisabled(seatId); 
                    return (
                        <div
                        key={seatId}
                        onClick={() => handleSeatClick('J', i + 7)}
                        className={`w-7 h-7 text-xs flex items-center justify-center border rounded cursor-pointer ${
                          isDisabled
                            ? "bg-gray-300 text-white cursor-not-allowed"
                            : isSelected
                            ? "bg-green-600 text-white"
                            : "border-green-500 text-green-500 hover:bg-green-100"
                        }`}                        
                        >
                        {i + 7}
                        </div>
                    );
                    })}
                </div>
                </div>

                {/* --- Classic Section --- */}
                <h2 className="text-sm mb-4 text-gray-600 dark:text-gray-300 px-2">Rs. 200 CLASSIC</h2>

                {classicRows.map((row) => (
                <div key={row} className="flex gap-2 items-center mb-4">
                    <span className="w-4">{row}</span>
                    {/* 17 seats with a gap between column 9 & 10 */}
                    <div className="grid grid-cols-[repeat(9,1.5rem)_1.5rem_repeat(8,1.5rem)] gap-2 ml-6">
                    {Array.from({ length: 9 }, (_, i) => {
                        const seatId = `${row}${i + 1}`;
                        const isSelected = selectedSeats.includes(seatId);
                        const isDisabled = isSeatDisabled(seatId); 
                        return (
                        <div
                            key={seatId}
                            onClick={() => handleSeatClick(row, i + 1)}
                            className={`w-7 h-7 text-xs flex items-center justify-center border rounded cursor-pointer ${
                              isDisabled
                                ? "bg-gray-200 text-white cursor-not-allowed"
                                : isSelected
                                ? "bg-green-600 text-white"
                                : "border-green-500 text-green-500 hover:bg-green-100"
                            }`}
                            
                        >
                            {i + 1}
                        </div>
                        );
                    })}
                    {/* Empty gap for spacing */}
                    <div></div>
                    {Array.from({ length: 8 }, (_, i) => {
                        const seatId = `${row}${i + 10}`;
                        const isSelected = selectedSeats.includes(seatId);
                        const isDisabled = isSeatDisabled(seatId); 
                        return (
                        <div
                            key={seatId}
                            onClick={() => handleSeatClick(row, i + 10)}
                            className={`w-7 h-7 text-xs flex items-center justify-center border rounded cursor-pointer ${
                              isDisabled
                                ? "bg-gray-200 text-white cursor-not-allowed"
                                : isSelected
                                ? "bg-green-600 text-white"
                                : "border-green-500 text-green-500 hover:bg-green-100"
                            }`}                            
                        >
                            {i + 10}
                        </div>
                        );
                    })}
                    </div>
                </div>
                ))}

                {/* Screen Indicator */}
                <div className="flex justify-center mt-10">
                <div className="bg-blue-100 dark:bg-gray-700 px-8 py-2 rounded text-sm text-gray-600 dark:text-white shadow">
                    All eyes this way please!
                </div>
                </div>
            </div>            
            </div>

        {/* Pay ₹X button */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white dark:bg-gray-900 border-t pt-3 pb-3 flex justify-center px-6">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="bg-pink-600 text-white font-bold py-3 px-10 rounded-md w-full max-w-md text-center"
          >
            Pay ₹{selectedSeats.reduce((acc, s) => acc + (["J", "K"].includes(s.charAt(0)) ? 600 : 200), 0)}
          </button>
        </div>
      )}

      
      {/* Legend */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 p-3 flex justify-center gap-4 text-xs border-t z-30">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 border-2 border-yellow-500 bg-yellow-100" />
          Bestseller
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 border-2 border-green-500" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-600" />
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-gray-300" />
          Sold
        </span>
      </div>

    </div>
  );
};


export default SeatBookingPage;

//  text-whitebg-pink-600