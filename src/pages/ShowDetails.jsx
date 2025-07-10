import React, { useEffect, useState } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { FaStar, FaUser, FaThumbsUp, FaThumbsDown, FaShareAlt } from "react-icons/fa";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import animations

export default function ShowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [others, setOthers] = useState([]);

  useEffect(() => {
    setShow(null); 
    (async () => {
      const snap = await getDoc(doc(db, "shows", id));
      if (snap.exists()) setShow({ id: snap.id, ...snap.data() });
      const b = await getDocs(collection(db, "shows"));
      setOthers(b.docs.map(d => ({ id: d.id, ...d.data() })).filter(s => s.id !== id));
    })();
  }, [id]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id} // ✅ triggers re-animation on ID change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      >
        {!show ? (
          <div className="flex items-center justify-center h-screen text-xl font-semibold">
            Loading movie details...
          </div>
        ) : (
          <>
            {/* 🧱 Top Section */}
            <div className="relative w-full bg-cover bg-center text-white"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.5)), url(${show.bgImage})`,
              }}>
              <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-52 rounded-lg overflow-hidden shadow-lg relative">
                  <img src={show.poster} alt={show.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 bg-black bg-opacity-70 text-center w-full py-1 text-sm">In cinemas</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h1 className="text-4xl font-bold">{show.title}</h1>
                    <button className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"><FaShareAlt /></button>
                  </div>

                  <div className="flex items-center gap-3 mt-3 bg-gray-800 p-3 rounded-lg w-max">
                    <FaStar className="text-yellow-400 text-xl" />
                    <span className="text-lg font-semibold">{show.rating}/10</span>
                    <span className="text-sm text-gray-400">({show.votes} Votes)</span>
                    <button className="ml-4 text-sm text-black bg-white px-3 py-1 rounded hover:bg-gray-300">Rate now</button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {show.formats?.map((f, i) => (
                      <span key={i} className="px-2 py-1 border border-white rounded text-sm">{f}</span>
                    ))}
                    {show.languages?.map((lang, i) => (
                      <span key={i} className="px-2 py-1 border border-white rounded text-sm">{lang}</span>
                    ))}
                  </div>

                  <div className="mt-3 text-sm text-gray-300 space-x-2">
                    <span>{show.duration}</span> •
                    <span>{show.genre}</span> •
                    <span>{show.certificate}</span> •
                    <span>{show.releaseDate}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/book/${id}`)}
                    className="mt-5 px-6 py-2 bg-pink-600 hover:bg-pink-700 font-semibold text-white rounded"
                    >
                    Book tickets
                  </button>

                </div>
              </div>
            </div>

            {/* 📝 About Section */}
            <div className="border-t py-10 px-4 max-w-6xl mx-auto bg-white dark:bg-gray-800 mt-4">
              <h2 className="text-2xl font-semibold mb-3">About the movie</h2>
              <p className="text-gray-700 dark:text-gray-300">{show.description}</p>
            </div>

            {/* 👥 Cast Section */}
            <div className="border-t py-10 px-4 max-w-6xl mx-auto bg-white dark:bg-gray-800 mt-4">
              <h2 className="text-2xl font-semibold mb-4">Cast</h2>
              <div className="flex overflow-x-auto gap-4">
                {show.cast?.map((c, i) => (
                  <div key={i} className="flex-shrink-0 w-28 text-center">
                    <img src={c.photo} alt={c.name} className="w-24 h-24 rounded-full object-cover mx-auto shadow" />
                    <p className="mt-2 text-sm">{c.name || "Anne Hathaway"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ⭐ Top Reviews Section */}
            <section className="max-w-6xl mx-auto px-4 bg-gray-50 dark:bg-gray-800 mt-4 py-8 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Top reviews</h2>
                <p className="text-pink-600 font-semibold">18K reviews</p>
              </div>

              {/* Hashtag tags */}
              <div className="flex overflow-x-auto gap-3 pb-4 mb-6">
                {[
                  { tag: "#Inspiring", count: 11018 },
                  { tag: "#GreatActing", count: 9743 },
                  { tag: "#AwesomeStory", count: 8653 },
                  { tag: "#Wellmade", count: 8359 },
                ].map((tag, idx) => (
                  <span key={idx} className="whitespace-nowrap px-4 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-400 text-pink-600 text-sm font-medium flex items-center gap-2">
                    {tag.tag}
                    <span className="text-gray-800 dark:text-gray-300 text-xs bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5">
                      {tag.count}
                    </span>
                  </span>
                ))}
              </div>

              {/* Review Slider */}
              <div className="relative">
                <button onClick={() => document.getElementById("reviewScroll").scrollBy({ left: -400, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full shadow-md">
                  <MdChevronLeft size={24} />
                </button>

                <div id="reviewScroll" className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-10 pb-4">
                  {show.reviews?.slice(0, 6).map((review, i) => (
                    <div key={i} className="min-w-[350px] max-w-[400px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow p-5 relative">
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-pink-500 font-semibold">
                        <FaStar className="text-lg" />
                        <span>{review.rating || 10}/10</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">
                          <FaUser className="text-lg" />
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold">User</p>
                          <p className="text-xs text-gray-500">Booked on <span className="text-red-600 font-bold"> My <span className="text-black"> Cine </span>verse</span></p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">{review.tags?.join(" ")}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">{review.text}</p>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1"><FaThumbsUp /> {review.likes || "1K"}</div>
                          <div className="flex items-center gap-1"><FaThumbsDown /> {review.dislikes || "0"}</div>
                        </div>
                        <div className="text-xs">{review.date || "7 Days ago"}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => document.getElementById("reviewScroll").scrollBy({ left: 400, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full shadow-md">
                  <MdChevronRight size={24} />
                </button>
              </div>
            </section>

            {/* 🎬 Recommendation Section (Clickable & Styled) */}
            <div className="border-t py-10 px-4 max-w-6xl mx-auto bg-white dark:bg-gray-800 mt-4">
              <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
              <div className="flex gap-4 overflow-x-auto">
                {others.map(m => (
                  <motion.div
                    key={m.id}
                    onClick={() => navigate(`/show/${m.id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 w-40 bg-white dark:bg-gray-900 rounded-lg shadow cursor-pointer transition-all duration-200"
                  >
                    <img src={m.poster} className="h-56 w-full object-cover rounded-t-lg" />
                    <div className="p-2">
                      <p className="text-sm font-semibold truncate">{m.title}</p>
                      <p className="text-xs text-gray-500">IMDb {m.rating}/10</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="h-10" />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
