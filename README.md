# 🎬 CineReserve - Movie Ticket Booking WebApp

A full-stack **Movie Ticket Booking WebApp** built with modern design, responsive UI/UX, and powerful features like **seat selection**, **live Razorpay payment integration**, **real-time bookings**, **insightful dashboards**, **email verification**, and **theme toggle**.

---

## 🚀 Live Demo (Optional)
**~ will add link soon**

**DEMO LINK **
- https://drive.google.com/file/d/172TxduvJ2A2JEoa3Me2o2dJl2-OnjcEp/view?usp=sharing
---

## 📚 Features At a Glance

- 🔐 Firebase Auth: Login/Signup with Email Verification
- 🎞️ Movie Search, Filtering, Event Carousel & Details
- 🪑 Smart Seat Selection with Group Booking Logic
- 💳 Razorpay Integration with Test UPI Payment Support
- 🧾 Auto-generated Receipt with PDF Printing
- 📊 Dashboard with Graph-based Insights
- 🌙 Dark/Light Theme Toggle
- 🧠 Optimized UX with Personalized Booking Flow
- 📧 Contact Us Modal storing messages via Node.js Script

---

## 🧪 Workflow to Test the WebApp

### 1. 🔑 **Authentication**
- Launch the app on `localhost`.
- On first load, you'll land on the **Login/Signup screen**.
  - ✅ New Users: Click **"Create Account"** → Fill in signup form → Submit.
  - 🔐 Check **Spam folder** if email not in Inbox.
  - Click **"Verify Email"** link → It opens a verified page.
  - Return to main page → Click **"I'm Verified"** → Redirects to dashboard.

---

### 2. 🏠 **Dashboard Exploration**
- Enjoy the clean Home UI with:
  - 🎞️ Movie slider
  - 🔍 Live Search bar (search by name/genre)
  - 📆 Event Cards with hover effects and swipe toggle
- Navigate via Navbar:
  - **My Bookings**, **Insights**, **About Us**, **Login**
  - Try the **Dark/Light Theme Toggle**
- Sidebar toggles via button on the top-left corner.

---

### 3. 🎬 **Explore & Book an Event**
- Click any Event card → redirected to **Event Details Page**
  - Includes 🎥 Movie card, 🎭 Cast, ✍️ Description, ⭐ Reviews, 🎁 Recommendations.
- Click **"Book Now"** to start booking journey.

---

### 4. 🗓️ **Select Date & Venue**
- On **Event Booking Details** page:
  - Choose event date.
  - Venue/show cards appear (with venue, time, amenities).
  - Apply **Time Filter** to refine listings.

---

### 5. 🪑 **Seat Selection**
- Choose number of seats (default = 2, customizable).
- Redirected to **Seat Booking Page**:
  - Displays movie info, show timing, venue layout.
  - Auto-selects adjacent seats for group booking UX.
  - Click **"Pay ₹X"** button after selecting.

---

### 6. 💳 **Payment (Razorpay Integration)**
- Redirected to **Booking Summary Page**:
  - View venue, seats, breakdown, tax, charity, and total.
- Click **"Proceed"** → Opens Razorpay test screen.
  - ⚠️ _Card testing may be limited; prefer UPI ID (fake or real)._  
  - Razorpay is **test-mode enabled**, but production-ready.

---

### 7. ✅ **Confirmation & Receipt**
- Upon payment success:
  - Redirected to **Confirmation Page** with booking info.
  - Click **"View Receipt"** → Modal opens with detailed breakdown.
  - Click **"Print Receipt"** → Save as PDF (Print-to-PDF enabled).

---

### 8. 📂 **My Bookings Page**
- Head to **My Bookings** from navbar.
- View all your confirmed bookings:
  - 🎟️ Event name, 🎭 Venue, 🕒 Time, 🪑 Seats, 💰 Price, 🧾 Payment ID.

---

### 9. 🧑‍💼 **About Us**
- Learn about the developer (👤 You) with stylish UI.
- Contains contact information and **"Contact Us"** button.

---

### 10. 📬 **Contact Us Modal**
- Opens a modal with form fields.
- On submit:
  - Data is stored in a **JSON file via backend Node.js script**.
  - 🔧 To enable:
    - Install **Node.js**
    - Run backend script in `/services` folder:  
      ```bash
      cd services
      node contact-server.js
      ```
    - Data gets stored in a `.json` file.

---

### 11. 📊 **Insights Page**
- A beautifully styled admin-like dashboard:
  - Includes 📈 Graphs and 📊 Charts around bookings, trends, traffic.
  - Great for showcasing growth metrics visually.

---

### 12. 🌗 **Theme & Footer**
- Toggle light/dark mode from navbar at any time.
- Footer contains social/contact links and branding info.

---
**📁 Tech Stack** 

Frontend: React.js, Tailwind CSS

Auth/Database: Firebase Auth + Firestore

Payments: Razorpay API

Backend (Contact Us): Node.js, FileSystem (JSON-based)

UI Libraries: React Icons, Heroicons, React Router DOM, Chart.js/Recharts

### 🔧 Firebase Setup for Testing

To connect to the preconfigured Firebase project for this webapp:

1. Create a new `.env` file at the root of the project.
2. Paste the following values:

```env
REACT_APP_RAZORPAY_KEY=rzp_test_glkzl71CDP8RyY

REACT_APP_FIREBASE_API_KEY=AIzaSyBLEgR0aTPwxoLdtjHBrzswYgx7b3qai5U
```
## ⚙️ Local Setup Instructions

> Follow these steps to run the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/CineReserve.git
cd CineReserve

# 2. Install frontend dependencies
npm install

# 3. Setup Firebase:
#    - Create Firebase project
#    - Enable Firestore, Authentication (Email/Password)
#    - Add config in `/services/firebase.js`

# 4. Start frontend
npm run dev

# 5. (Optional) Run backend for Contact Us form
cd services
node contact-server.js
