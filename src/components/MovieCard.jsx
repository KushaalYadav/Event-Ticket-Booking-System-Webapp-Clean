import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ show }) => {
  const nav = useNavigate();

  return (
    <div
      onClick={() => nav(`/show/${show.id}`)}
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition cursor-pointer overflow-hidden"
    >
      {/* Poster Image */}
      <div className="relative h-80 w-full">
        <img
          src={show.poster}
          alt={show.title}
          className="object-cover w-full h-full"
        />

        {/* Promoted / Rating Tag */}
        {show.promoted ? (
          <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
            PROMOTED
          </span>
        ) : show.rating ? (
          <span className="absolute top-2 left-2 bg-red-700 text-white text-xs px-2 py-1 rounded shadow-md">
            ⭐ {show.rating}/10
          </span>
        ) : null}

        {/* Likes / Votes */}
        {show.likes ? (
          <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md">
            👍 {show.likes}
          </span>
        ) : show.votes ? (
          <span className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md">
            {show.votes} Votes
          </span>
        ) : null}
      </div>

      {/* Movie Info */}
      <div className="p-3 bg-white dark:bg-gray-900">
        <h3 className="text-base font-bold dark:text-white truncate">
          {show.title}
        </h3>
        {show.duration && (
          <p className="text-xs text-gray-400">{show.duration}</p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {show.genre || "Genre not available"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
