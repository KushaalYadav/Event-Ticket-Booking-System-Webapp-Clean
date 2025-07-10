// src/components/ReceiptContent.jsx
import React from "react";

const ReceiptContent = ({ userDetails, ticketData }) => {
  const { movieId, theatre, date, time, seats, amount } = ticketData;

  const convenienceFee = seats.length * 35.4;
  const seatPriceTotal = seats.reduce((acc, seat) => {
    const price = ["J", "K"].includes(seat.charAt(0)) ? 600 : 200;
    return acc + price;
  }, 0);
  const donation = seats.length;
  const subtotal = seatPriceTotal + convenienceFee + donation;

  return (
    <div className="w-full p-8 font-poppins text-gray-900">
      {/* 🎟 Confirmation Header */}
      <div className="w-full border rounded-xl shadow-lg p-6 mb-6 bg-white">
        <h2 className="text-2xl font-bold text-[#532f63] uppercase">
          Booking Confirmation
        </h2>
        <p className="text-lg mt-1">{userDetails.name}, your booking has been confirmed!</p>
        <p className="text-sm text-gray-500">Movie ID: {movieId}</p>
        <p className="text-sm text-gray-500">Theatre: {theatre}</p>
        <p className="text-sm text-gray-500">Date: {new Date(date).toDateString()}</p>
        <p className="text-sm text-gray-500">Time: {time}</p>
        <p className="text-sm text-gray-500">Seats: {seats.join(", ")}</p>
        <p className="text-sm text-gray-500">Email: {userDetails.email}</p>
        <p className="text-sm text-gray-500">Phone: {userDetails.phone}</p>
      </div>

      {/* 💳 Price Breakdown */}
      <div className="bg-white border rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-pink-600 mb-4 uppercase">Booking Summary</h3>

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Ticket Price</span>
            <span>Rs. {seatPriceTotal}.00</span>
          </div>
          <div className="flex justify-between">
            <span>Convenience Fee</span>
            <span>Rs. {convenienceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>BookAChange Donation</span>
            <span>Rs. {donation}.00</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Grand Total</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptContent;
