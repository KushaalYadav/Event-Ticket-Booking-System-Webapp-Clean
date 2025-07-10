import React, { useEffect, useState, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const banners = [
  "https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/m/k/k/small-spos8308-poster-inception-animated-wall-poster-sl-8308-original-imaghzwanmepwc89.jpeg?q=90&crop=false",
  "https://images3.alphacoders.com/551/551456.jpg",
  "https://img.englishcinemakyiv.com/huTkZGEkT0gyszNkPlvk3mdsdYrPKJBve3_uzF8c-GU/resize:fill:800:450:1:0/gravity:sm/aHR0cHM6Ly9leHBhdGNpbmVtYXByb2QuYmxvYi5jb3JlLndpbmRvd3MubmV0L2ltYWdlcy9jZjg4OTJhMS03NWZiLTRjNDYtOWFmMy1kMzRjZTg3MTIzYzEuanBn.jpg",
  "https://i.pinimg.com/736x/d5/86/19/d58619d1fe5a4ca71c57cb1afde76a0a.jpg",
  "https://cdna.artstation.com/p/assets/images/images/017/022/542/large/amirhosein-naseri-desktop-screenshot-2019-04-03-18-17-47-11.jpg?1554338571"
];

const BannerSlider = ({ shows }) => {
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef();

  // Ensure both arrays have the same length
  const length = Math.min(shows?.length || 0, banners.length);

  const prev = () => setIdx(i => (i - 1 + length) % length);
  const next = () => setIdx(i => (i + 1) % length);

  useEffect(() => {
    if (length === 0) return;

    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [length]);

  if (length === 0) return null;

  const currentShow = shows[idx];
  const currentBanner = banners[idx];

  return (
    <div className="relative w-full max-w-6xl mx-auto h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
      <img
        src={currentBanner}
        alt={currentShow?.title || "Movie Banner"}
        className="w-full h-full object-cover transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
        <div className="text-white">
          <h2 className="text-3xl font-bold">{currentShow?.title || "..."}</h2>
          <p className="mt-1">
            {currentShow?.genre || "Genre"} • {currentShow?.duration || "Duration"} • ⭐ {currentShow?.rating || "N/A"}
          </p>
        </div>
      </div>

      {/* Arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        onClick={() => { prev(); clearInterval(intervalRef.current); }}
      >
        <ChevronLeftIcon size={24} />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        onClick={() => { next(); clearInterval(intervalRef.current); }}
      >
        <ChevronRightIcon size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {Array.from({ length }).map((_, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); clearInterval(intervalRef.current); }}
            className={`w-3 h-3 rounded-full transition-all ${i === idx ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
