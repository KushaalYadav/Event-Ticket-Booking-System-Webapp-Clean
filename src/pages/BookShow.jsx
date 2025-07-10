// pages/BookShow.jsx
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useEffect, useState, useRef } from "react";
import { FaHeart, FaSearch } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const timeCategories = {
  Morning: { start: 0, end: 11 },
  Afternoon: { start: 12, end: 15 },
  Evening: { start: 16, end: 18 },
  Night: { start: 19, end: 23 },
};



const BookShow = () => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  // const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [showDropdown, setShowDropdown] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const dropdownRef = useRef(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [searchParams] = useSearchParams();
    const defaultDate = searchParams.get("date");

    const [selectedDate, setSelectedDate] = useState(defaultDate || null);

  // 🧠 Outside click for dropdown close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📥 Fetch movie data
  useEffect(() => {
    const fetchMovie = async () => {
      const docRef = doc(db, "shows", movieId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const movieData = docSnap.data();

        const dateSet = new Set();
        movieData.theaters?.forEach((theatre) => {
          if (theatre.timings && typeof theatre.timings === "object") {
            Object.keys(theatre.timings).forEach((date) => dateSet.add(date));
          }
        });

        setAvailableDates([...dateSet].sort());
        setMovie(movieData);
      }
    };
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    if (!movie || !selectedDate) return;
  
    console.log("Selected Date:", selectedDate);
    movie.theaters?.forEach((t, idx) => {
      console.log(`Theater ${idx} Name:`, t.name);
      console.log(`Timings Available:`, Object.keys(t.timings || {}));
    });
  }, [movie, selectedDate]);

  if (!movie)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );

    const handleTimeClick = (time, theatreName) => {
      const bookingUrl = `/seats/${movieId}/${selectedDate}/${theatreName}/${time}`;
    navigate(bookingUrl);
    };

 // ✅ Show all theaters that have timings for selected date (regardless of slot)
  const filteredTheaters = movie.theaters?.filter(
    (theatre) => Array.isArray(theatre.timings?.[selectedDate])
  );

  // 🔻 Dropdown Component
  const renderDropdown = (title, options, selected, onSelect) => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(showDropdown === title ? "" : title)}
        className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-md w-44 flex justify-between items-center"
      >
        {title} <span>{showDropdown === title ? "▲" : "▼"}</span>
      </button>
      {showDropdown === title && (
        <div className="absolute z-20 mt-1 w-44 bg-white dark:bg-gray-800 shadow-lg border rounded transition-all duration-300 ease-in-out">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected === opt}
                onChange={() => {
                  onSelect(selected === opt ? "" : opt);
                  setShowDropdown("");
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 1. Movie Header */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          {movie.title} ({movie.languages?.join(", ") || " ~ Hindi "})
        </h1>
        <div className="mt-2 flex gap-2 text-sm text-gray-600 dark:text-gray-300 flex-wrap">
          {movie.certificate && (
            <span className="border px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
              {movie.certificate}
            </span>
          )}
          {movie.genre && (
            <span className="border px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
              {movie.genre}
            </span>
          )}
        </div>
      </div>
      <hr className="my-4 border-gray-300" />

{/* 2️⃣ Date & Filter Bar - Final Styling */}
<div className="w-full border-b shadow-sm bg-white dark:bg-gray-900">
  <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center flex-wrap sm:flex-nowrap gap-4 sm:gap-0">
    {/* Date Bar */}
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {availableDates.map((date, idx) => {
        const isSelected = selectedDate === date;
        return (
          <button
            key={idx}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center justify-center w-14 h-16 rounded-lg text-sm leading-tight text-center whitespace-nowrap
              ${isSelected
                ? "bg-red-500 text-white font-semibold"
                : "bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <span className="text-xs uppercase">
              {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="text-base font-bold">{new Date(date).getDate()}</span>
            <span className="text-xs uppercase">
              {new Date(date).toLocaleDateString("en-US", { month: "short" })}
            </span>
          </button>
        );
      })}

      {/* Greyed out dates */}
      {[...Array(3)].map((_, i) => {
        const nextDate = new Date(availableDates[availableDates.length - 1]);
        nextDate.setDate(nextDate.getDate() + i + 1);
        return (
          <div
            key={`grey-${i}`}
            className="flex flex-col items-center justify-center w-14 h-16 rounded-lg text-gray-400 text-sm leading-tight text-center"
          >
            <span className="text-xs uppercase">
              {nextDate.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="text-base font-bold">{nextDate.getDate()}</span>
            <span className="text-xs uppercase">
              {nextDate.toLocaleDateString("en-US", { month: "short" })}
            </span>
          </div>
        );
      })}
    </div>

    {/* Filter Section */}
    <div className="flex items-center gap-2 ml-auto">
      {/* Hindi - 2D Static */}
      <div className="flex items-center justify-center w-32 h-12 border rounded-md relative text-sm text-gray-900 dark:text-white">
        Hindi - 2D
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full" />
      </div>

      {/* Filter Dropdowns with consistent box sizing */}
      {[
      {
        label: "Price Range",
        options: ["₹0–₹100", "₹101–₹200", "₹201–₹400", "₹401–₹500", "₹501–₹600"],
      },
      {
        label: "Special Formats",
        options: ["2D", "3D", "IMAX"],
      },
      {
        label: "Preferred Time",
        options: [
          { label: "Morning", range: "12:00 AM - 11:59 AM", icon: "🌤" },
          { label: "Afternoon", range: "12:00 PM - 3:59 PM", icon: "☀️" },
          { label: "Evening", range: "4:00 PM - 6:59 PM", icon: "🌥" },
          { label: "Night", range: "7:00 PM - 11:59 PM", icon: "🌙" },
        ],
      },
    ].map((filter, i) => (
      <div
        key={i}
        className="relative w-44 h-12 border rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white"
      >
        <button
          onClick={() =>
            setShowDropdown(showDropdown === filter.label ? "" : filter.label)
          }
          className="w-full h-full px-3 flex items-center justify-between"
        >
          {filter.label}
          <span>{showDropdown === filter.label ? "▲" : "▼"}</span>
        </button>

        {showDropdown === filter.label && (
          <div className="absolute top-full left-0 mt-1 w-full z-20 bg-white dark:bg-gray-800 shadow-lg border rounded">
            {filter.label === "Preferred Time"
              ? filter.options.map(({ label, range, icon }) => (
                  <label
                    key={label}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex gap-3 items-start">
                      <span>{icon}</span>
                      <div>
                        <div
                          className={`${
                            selectedSlots.includes(label)
                              ? "text-black font-semibold"
                              : "text-gray-500"
                          }`}
                        >
                          {label}
                        </div>
                        <div className="text-xs text-gray-400">{range}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedSlots.includes(label)}
                      onChange={(e) => {
                        const newSlots = [...selectedSlots];
                        if (e.target.checked) {
                          newSlots.push(label);
                        } else {
                          const index = newSlots.indexOf(label);
                          if (index !== -1) newSlots.splice(index, 1);
                        }
                        setSelectedSlots(newSlots);
                        setShowDropdown("");
                      }}
                    />
                  </label>
                ))
              : filter.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input type="checkbox" className="accent-red-500" />
                    {opt}
                  </label>
                ))}
          </div>
        )}
      </div>
      
    ))}


      {/* Search Icon */}
      <div className="flex items-center justify-center w-12 h-12 border rounded-md cursor-pointer">
        <FaSearch className="text-gray-500 dark:text-white text-lg" />
      </div>
    </div>
  </div>
</div>


    {/* 3️⃣ Legend Section */}
    <div className="w-full shadow-inner border-b bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-2 text-xs text-gray-700 dark:text-gray-300 flex gap-6 items-center">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-green-500 rounded-full" /> AVAILABLE
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-yellow-500 rounded-full" /> FAST FILLING
        </span>
        <span className="flex items-center gap-1">
          <span className="border border-green-600 text-[10px] px-1 text-green-700 font-semibold rounded-sm leading-3">
            LAN
          </span>
          SUBTITLES LANGUAGE
        </span>
      </div>
    </div>

        {selectedSlots.length > 0 && (
      <div className="max-w-6xl mx-auto px-4 mt-2 flex gap-2 flex-wrap">
        {selectedSlots.map((slot) => (
          <div
            key={slot}
            className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold"
          >
            {slot}
            <button
              onClick={() =>
                setSelectedSlots(selectedSlots.filter((s) => s !== slot))
              }
              className="ml-2 text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
          {/* 4️⃣ Theater Listings */}
      {selectedDate && (
        <div className="max-w-6xl mx-auto mt-4 bg-[#f5f5f5] rounded-lg px-4 py-4">
          {movie.theaters
            ?.filter((theatre) => Array.isArray(theatre.timings?.[selectedDate]))
            .map((theatre, index) => {
              const timingArray = theatre.timings[selectedDate];

              // ✅ Filter timings based on selectedSlots
              const validTimings = timingArray.filter((timeStr) => {
                if (selectedSlots.length === 0) return true;

                const [hr, min, period] = timeStr.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
                let hour = parseInt(hr);
                if (period === "PM" && hour !== 12) hour += 12;
                if (period === "AM" && hour === 12) hour = 0;

                // Check if the time fits in any of the selected ranges
                return selectedSlots.some((slot) => {
                  const { start, end } = timeCategories[slot];
                  return hour >= start && hour <= end;
                });
              });

              // ❌ Don't render theater if no matching timings
              if (validTimings.length === 0) return null;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md shadow-sm px-6 py-4 bg-white dark:bg-gray-800 mb-6"
                >
                  {/* 🎭 Theater Name */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <FaHeart className="text-gray-400 hover:text-red-500 cursor-pointer text-lg" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {theatre.name}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <span className="text-gray-400">ⓘ</span> INFO
                    </span>
                  </div>

                  {/* 🧾 M-Ticket & Food Icons */}
                  <div className="flex items-center gap-6 text-xs text-green-600 mb-3">
                    <div className="flex items-center gap-1 text-green-600">📱 M-Ticket</div>
                    <div className="flex items-center gap-1 text-orange-500">🍔 Food & Beverage</div>
                  </div>

                  {/* 🕒 Timings */}
                  <div className="flex flex-wrap gap-4 items-center">
                    {validTimings.map((time, i) => {
                      const label = ["06:00 PM", "08:00 PM","08:30 PM", "05:00 PM"].includes(time)
                        ? "CINE LUXE"
                        : ["08:15 PM", "11:30 PM"].includes(time)
                        ? "GOLD"
                        : "";

                      const borderColor =
                        label === "CINE LUXE"
                          ? "border-l-4 border-yellow-500"
                          : "border-l-4 border-green-500";

                      return (
                        <button
                          key={i}
                          onClick={() => handleTimeClick(time, theatre.name)}
                          className={`${borderColor} px-4 py-2 border rounded-md text-sm text-gray-800 font-medium hover:bg-gray-100 transition text-left`}
                        >
                          <div>{time}</div>
                          {label && (
                            <div className="text-[10px] text-gray-500 mt-1">{label}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* 📌 Cancellation Message */}
                  <p className="text-xs text-gray-500 mt-3">Cancellation available</p>
                </div>
              );
            })}
        </div>
      )}

    </div>
  );
};

export default BookShow;
