// pages/SelectSeats.jsx
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useState, useEffect } from "react";

const seatMap = {
  RECLINER: ["A1", "A2", "A3", "A4", "A5"],
  CLASSIC: [
    "B1", "B2", "B3", "B4", "B5",
    "C1", "C2", "C3", "C4", "C5",
  ],
};

const SelectSeats = () => {
  const { movieId, selectedDate, selectedTime } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "movies", movieId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMovie(data);
        const seatKey = `${selectedDate}_${selectedTime}`;
        setBookedSeats(data.seats?.[seatKey] || []);
      }
    };
    fetchData();
  }, [movieId, selectedDate, selectedTime]);

  const handleSelect = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const getClass = (seat) =>
    bookedSeats.includes(seat)
      ? "bg-gray-300 cursor-not-allowed"
      : selectedSeats.includes(seat)
      ? "bg-green-500 text-white"
      : "bg-white hover:bg-gray-100";

  const calculateTotal = () => {
    let total = 0;
    selectedSeats.forEach((seat) => {
      const category = Object.keys(seatMap).find((key) =>
        seatMap[key].includes(seat)
      );
      total += movie.seatPrice?.[category] || 0;
    });
    return total;
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="flex max-w-6xl mx-auto p-6">
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">
          Select Seats ({selectedDate}, {selectedTime})
        </h2>
        {Object.entries(seatMap).map(([type, seats]) => (
          <div key={type} className="mb-4">
            <h3 className="font-semibold text-lg mb-2">
              {type} - ₹{movie.seatPrice?.[type]}
            </h3>
            <div className="flex gap-3 flex-wrap">
              {seats.map((seat) => (
                <button
                  key={seat}
                  onClick={() => handleSelect(seat)}
                  className={`border px-4 py-2 rounded ${getClass(seat)}`}
                >
                  {seat}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="w-64 ml-8 border p-4 rounded shadow-lg">
        <h3 className="text-lg font-bold mb-2">Summary</h3>
        <p>Seats: {selectedSeats.join(", ") || "None"}</p>
        <p>Tickets: {selectedSeats.length}</p>
        <p>Subtotal: ₹{calculateTotal()}</p>
        <p>Convenience Fee: ₹{selectedSeats.length * 20}</p>
        <hr className="my-2" />
        <p className="font-bold text-xl">
          Total: ₹{calculateTotal() + selectedSeats.length * 20}
        </p>
        <button className="mt-4 bg-pink-600 text-white w-full py-2 rounded">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default SelectSeats;
