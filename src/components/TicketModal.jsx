import React, { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import ReceiptContent from "./ReceiptContent"; // 👈 Import it
import { useReactToPrint } from "react-to-print";
import { MdChair } from "react-icons/md";
import { FaCouch } from "react-icons/fa";
import QRCode from "react-qr-code";

const TicketModal = ({ booking, movieData, userDetails, onClose }) => {

    const handlePrintReceipt = () => {
        window.print();
      };
      
  if (!booking) return null;

  const {
    theatre = "PVR Inox Cinemas",
    seats = [],
    paymentId = "TXN12345678",
    date = new Date().toISOString(),
    time = "09:45 AM",
    amount = 7911,
    seatType = "Recliner",
    userSessionId = "USR123456",
  } = booking;

  const formats = movieData?.formats?.join(", ") || "2D, Hindi";
  const showDuration = movieData?.duration || "2h 10m";


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center overflow-y-auto px-4">
      <div className="bg-white w-[90%] max-w-4xl rounded-lg shadow-lg font-poppins relative p-6">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
        >
          <IoMdClose />
        </button>

        {/* 🔶 Section 1 */}
        <div className="text-center">
          <p className="text-sm text-gray-500 text-left">Invoice Number: {paymentId}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 uppercase mt-1">Ticket Booked</h2>
          <p className="text-sm tracking-wider text-gray-400 uppercase">Format : {formats}</p>
          <p className="text-md font-semibold mt-1">{new Date(date).toDateString()}</p>
        </div>

        {/* 🔹 Info Block Row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 text-center gap-4">
          {/* Audi */}
          <div>
            <p className="text-sm text-gray-400 uppercase mb-1">Audi</p>
            <p className="text-lg font-bold text-gray-800">Audi 1</p>
          </div>

          {/* Seat Type */}
          <div>
            <p className="text-sm text-gray-400 uppercase mb-1 flex justify-center items-center gap-1">
              <FaCouch className="inline-block text-lg text-gray-500" /> Seat Type
            </p>
            <p className="text-lg font-bold text-gray-800">{seatType}</p>
          </div>

          {/* Seats */}
          <div>
            <p className="text-sm text-gray-400 uppercase mb-1 flex justify-center items-center gap-1">
              <MdChair className="inline-block text-lg text-gray-500" /> Seat
            </p>
            <p className="text-lg font-bold text-gray-800">{seats?.join(", ")}</p>
          </div>
        </div>

        {/* ⏱️ Duration Line */}
        <div className="mt-6 grid grid-cols-3 text-center items-center">
          <div>
            <p className="text-sm text-gray-400">Movie Begun</p>
            <p className="text-xl font-bold text-gray-800">{time}</p>
          </div>

          <div className="relative">
            <div className="border-t-2 border-gray-300 mx-2" />
            <p className="text-xs text-gray-400 mt-1">{showDuration || "2h 30m" }</p>
            {/* <FaCircleDot className="text-2xl text-blue-500 absolute top-[-14px] left-1/2 transform -translate-x-1/2" /> */}
          </div>

          <div>
            <p className="text-sm text-gray-400">Great! Show Ends</p>
            <p className="text-xl font-bold text-gray-800">
              {/* Show end time placeholder */}
              01:00 PM
            </p>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-dashed border-t my-6 border-gray-300" />

        {/* 🔸 Section 2: QR + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 👤 Traveler Info */}
          <div className="text-left space-y-3">
            <p className="text-sm text-gray-500 font-semibold">User Details</p>
            <p className="text-md font-bold">{userDetails?.name || "Guest User"}</p>
            <QRCode value={`MovieTicket-${paymentId}`} size={80} />
            <a href="/support" className="text-xs text-blue-600 underline">
              📩 Contact & Support
            </a>
          </div>

          {/* 💳 Payment Summary */}
          <div className="text-left">
            <p className="text-sm text-gray-500 font-semibold mb-2">Payment Summary</p>
            <div className="flex justify-between mb-1 text-sm text-gray-700">
              <span>Base Fare</span>
              <span>₹{Math.floor(amount * 0.55)}</span>
            </div>
            <div className="flex justify-between mb-1 text-sm text-gray-700">
              <span>Service Fees & Taxes</span>
              <span>₹{Math.floor(amount * 0.40)}</span>
            </div>
            <div className="flex justify-between mb-1 text-sm text-gray-700">
              <span>Insurance</span>
              <span>₹{Math.floor(amount * 0.05)}</span>
            </div>
            <div className="flex justify-between mt-3 text-lg font-bold">
              <span>Grand Total</span>
              <span>₹{amount}</span>
            </div>
          </div>
        </div>
              {/* 🔽 Download Button */}
      <div className="text-center mt-6">
        <button
        onClick={handlePrintReceipt}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          Print Reciept (- With Ctrl+P)
        </button>
      </div>

        {/* 📝 Footer Note */}
        <p className="text-xs text-center text-gray-400 mt-6">
          Note: This is a digital confirmation and doesn't require a signature or stamp.
        </p>
      </div>
      
    </div>
    
  );
};

export default TicketModal;
