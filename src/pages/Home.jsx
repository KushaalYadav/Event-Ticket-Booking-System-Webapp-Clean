import React, { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import MovieCard from "../components/MovieCard";
import BannerSlider from "../components/BannerSlider";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchShows = async () => {
      const snapshot = await getDocs(collection(db, "shows"));
      setShows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchShows();
  }, []);

  const filtered = shows.filter(show =>
    show.title.toLowerCase().includes(search.toLowerCase()) ||
    show.genre.toLowerCase().includes(search.toLowerCase())
  );

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <div className="px-4 py-6 space-y-8">
      {/* Banner Slider */}
      <BannerSlider shows={shows.slice(0, 5)} />

      {/* Search */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by title or genre..."
          className="w-full md:w-1/2 p-2 border rounded shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

{/* Recommended Movies Section (Exactly 4 visible, Scrollable) */}
<div className="relative w-full">
  <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Recommended Movies</h2>
  
  <div className="relative">
    {/* Left Button */}
    <button
      onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 shadow rounded-full p-2"
    >
      &#8249;
    </button>

    {/* Scrollable Cards */}
    <div
      ref={scrollRef}
      className="flex overflow-x-auto no-scrollbar space-x-6 px-10"
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {filtered.map(show => (
        <div
          key={show.id}
          className="flex-shrink-0 w-[250px] scroll-snap-align-start transition-transform duration-300"
        >
          <MovieCard show={show} />
        </div>
      ))}
    </div>

    {/* Right Button */}
    <button
      onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 shadow rounded-full p-2"
    >
      &#8250;
    </button>
  </div>
</div>
      <br />
      <br />
      {/* Third Container - Banner Section */}
      <div
        className="relative rounded-lg overflow-hidden mt-10"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-photo/cinema-elements-background-with-copy-space_23-2148467834.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '150px',
        }}
      >
        <div className="bg-black/50 w-full h-full flex items-center justify-center">
          <h2 className="text-white text-2xl sm:text-3xl font-semibold text-center">
            Endless Entertainment Anytime. Anywhere!
          </h2>
        </div>
      </div>
    </div>
  );

};

export default Home;
