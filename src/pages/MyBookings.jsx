import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { FaRegClock } from 'react-icons/fa';
import { MdMovie, MdConfirmationNumber, MdEventSeat } from 'react-icons/md';

const MyBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      const userId = currentUser?.uid || localStorage.getItem("userSessionId");
      const userEmail = currentUser?.email || localStorage.getItem("userEmail");

      if (!userId && !userEmail) return;

      const moviesSnapshot = await getDocs(collection(db, 'movies'));
      const userBookings = [];

      for (const movieDoc of moviesSnapshot.docs) {
        const movieId = movieDoc.id;
        const movieData = movieDoc.data();

        const bookingsRef = collection(db, 'movies', movieId, 'bookings');
        const bookingsSnap = await getDocs(bookingsRef);

        bookingsSnap.forEach(docSnap => {
          const data = docSnap.data();

          const isMatch =
            data.userId === userId ||
            data.email === userEmail;

          if (isMatch) {
            userBookings.push({
              id: docSnap.id,
              movieId,
              movieTitle: data.movieTitle || movieId,
              date: data.date,
              time: data.time,
              theatre: data.venue,
              seats: data.seatNumbers,
              amount: data.amount || data.seatNumbers.length * 200,
              paymentId: data.paymentId,
              timestamp: data.timestamp?.seconds ? new Date(data.timestamp.seconds * 1000) : new Date()
            });
          }
        });
      }

      setBookings(userBookings);
      setLoading(false);
    };

    fetchUserBookings();
  }, [currentUser]);

  return (
    <div className="min-h-screen p-6 font-poppins bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">🎟️ Your Bookings</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid gap-6 max-w-3xl mx-auto">
          {bookings.map((booking, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-pink-500 relative"
            >
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <MdMovie className="text-pink-600" />
                Movie: <span className="text-gray-700 dark:text-gray-100">{booking.movieTitle}</span>
              </h3>

              <p className="mb-1 flex items-center gap-2 text-sm">
                <FaRegClock />
                Date: <span className="font-medium">{booking.date}</span> | Time: {booking.time}
              </p>

              <p className="mb-1 flex items-center gap-2 text-sm">
                <MdEventSeat />
                Seats: <span className="font-medium">{booking.seats.join(', ')}</span>
              </p>

              <p className="mb-1 text-sm">
                Theatre: <span className="font-medium">{booking.theatre}</span>
              </p>

              <p className="mb-1 text-sm">
                Payment ID:{" "}
                <span className="text-xs text-pink-600 font-mono">{booking.paymentId}</span>
              </p>

              <p className="text-right mt-4 text-lg font-bold text-pink-700">
                Rs. {booking.amount.toFixed(2)}
              </p>

              <span className="absolute top-2 right-3 text-xs text-gray-400">
                {booking.timestamp.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
