import React, { useState } from 'react';
import { FaTicketAlt } from 'react-icons/fa';
import { MdLocalActivity } from 'react-icons/md';

const BookingSummaryModal = ({ selectedSeats, ticketPrice , onClose, onProceed }) => {
  const [ticketType, setTicketType] = useState('m-ticket');
  const convenienceFee = selectedSeats.length * 35.4;
  const seatPriceTotal = selectedSeats.reduce((acc, seat) => {
    const price = ["J", "K"].includes(seat.charAt(0)) ? 600 : 200;
    return acc + price;
  }, 0);

  const [donationAdded, setDonationAdded] = useState(false);
  const donation = donationAdded ? selectedSeats.length * 1 : 0;

  const subtotal = seatPriceTotal + convenienceFee + donation;

  const openRazorpayCheckout = () => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: Math.round(subtotal * 100), // in paise
      currency: 'INR',
      name: 'CineReserve',
      description: `Booking for ${selectedSeats.length} ticket(s)`,
      prefill: {
        name: "John Doe", // Replace with real user info if available
        email: "john@example.com"
      },
      handler: function (response) {
        onProceed(response); // Pass to parent to handle Firestore updates
      },
      theme: {
        color: '#ec4899'
      }
    };

    const rzp = new window.Razorpay(options);
  rzp.open();
  
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center font-poppins">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden max-h-[95vh] overflow-y-auto relative">
        
        <div className="p-6 text-gray-800 space-y-4">

          {/* Heading */}
          <h2 className="text-xl font-semibold text-pink-600 uppercase tracking-widest">Booking Summary</h2>

          {/* Seats Info */}
          <div>
            <p className="font-bold text-gray-900">
              CC-{selectedSeats.join(',')} <span className="font-normal text-sm text-gray-500">({selectedSeats.length} Tickets)</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">AUDI 1</p>
          </div>

          {/* Price Breakdown */}
        <div className="border-t pt-3 text-sm">
        <div className="flex justify-between mb-1">
            <span>Ticket Price</span>
            <span>
            Rs. {
                selectedSeats.reduce((acc, seat) => {
                const price = ["J", "K"].includes(seat.charAt(0)) ? 600 : 200;
                return acc + price;
                }, 0)
            }.00
            </span>
        </div>
        <div className="flex justify-between mb-1">
            <span>Convenience fees</span>
            <span>Rs. {convenienceFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2">
            <span>Sub total</span>
            <span>
            Rs. {
                selectedSeats.reduce((acc, seat) => {
                const price = ["J", "K"].includes(seat.charAt(0)) ? 600 : 200;
                return acc + price;
                }, 0) + convenienceFee
            }.00
            </span>
        </div>
        </div>

{/* Donation Block */}
<div className="bg-gray-100 p-4 rounded-md border text-sm">
  <div className="flex justify-between items-center">
    <div>
      <div className="flex items-center gap-2 font-semibold">
        <img
          src="https://in.bmscdn.com/offers/tnc/book-a-change-icon.png"
          alt="donate"
          className="w-5 h-5"
        />
        <span>Donate to BookAChange</span>
      </div>
      <p className="text-xs mt-1">
        ({donationAdded ? `₹1 per ticket added` : `Click below to add ₹1 per ticket`})
      </p>
      <button className="underline text-xs mt-1">VIEW T&C</button>
    </div>
    <div className="text-right">
      <p className="text-sm font-semibold">Rs. {donation}</p>
      {!donationAdded ? (
        <button
          onClick={() => setDonationAdded(true)}
          className="text-pink-600 text-xs font-bold"
        >
          Add Rs. {selectedSeats.length}
        </button>
      ) : (
        <button
          onClick={() => setDonationAdded(false)}
          className="text-red-500 text-xs font-bold"
        >
          Remove
        </button>
      )}
    </div>
  </div>
</div>

          {/* Location and Amount Payable */}
          <p className="text-sm">Your current state is <span className="text-pink-600 font-medium">Chandigarh</span></p>
          <div className="bg-yellow-100 p-3 rounded-md flex justify-between font-semibold text-sm">
            <span>Amount Payable</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>

          {/* Ticket Type Selection */}
          <div className="mt-4">
            <h3 className="text-center text-gray-700 text-sm tracking-wider font-medium uppercase mb-2">Select Ticket Type</h3>
            <div className="flex justify-center gap-4">
              <div
                className={`flex items-center gap-2 border px-4 py-2 rounded-md cursor-pointer ${ticketType === 'm-ticket' ? 'border-pink-600 bg-pink-50' : 'border-gray-300'}`}
                onClick={() => setTicketType('m-ticket')}
              >
                <FaTicketAlt className="text-pink-600" />
                <span className="text-sm">M-Ticket</span>
              </div>
              <div
                className={`flex items-center gap-2 border px-4 py-2 rounded-md cursor-pointer ${ticketType === 'box-office' ? 'border-pink-600 bg-pink-50' : 'border-gray-300'}`}
                onClick={() => setTicketType('box-office')}
              >
                <MdLocalActivity className="text-pink-600" />
                <span className="text-sm">Box Office Pickup</span>
              </div>
            </div>
            <p className="text-xs mt-2 text-center text-gray-500">
              Show the m-ticket QR Code on your mobile to enter the cinema.
            </p>
          </div>

          {/* Consent & Proceed */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            <span className="inline-block align-middle mr-1">ℹ️</span> By proceeding, I express my consent to complete this transaction.
          </p>

        </div>

        {/* Proceed Footer */}
        <div className="bg-white border-t px-4 py-4 sticky bottom-0 z-10">
        <button
            onClick={openRazorpayCheckout}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-full flex justify-between items-center px-4"
        >
            <span className="text-sm">TOTAL: Rs. {subtotal.toFixed(2)}</span>
            <span className="font-semibold text-base">Proceed</span>
        </button>
        </div>


        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

      </div>
    </div>
  );
};

export default BookingSummaryModal;
