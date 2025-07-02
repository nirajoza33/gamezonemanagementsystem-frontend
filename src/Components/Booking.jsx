// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import "../css/Booking.css";
// // import Navbar from "./Navbar";
// // import { useLocation } from "react-router-dom";
// // import { getUserInfo } from "../auth/JwtUtils";

// // const BookingManager = () => {
// //   const { state } = useLocation();
// //   const game = state?.game;
// //   const userInfo = getUserInfo();
// //   const userId = userInfo?.UserId || "";

// //   const [formData, setFormData] = useState({
// //     bookingId: 0,
// //     gameId: game?.gameId || "",
// //     userId: userId,
// //     price: game?.pricing || "",
// //     status: 1,
// //     bookingDate: "",
// //     startTime: "",
// //     endTime: ""
// //   });

// //   const [bookedSlots, setBookedSlots] = useState([]);

// //   const loadRazorpayScript = () => {
// //     return new Promise((resolve) => {
// //       const script = document.createElement("script");
// //       script.src = "https://checkout.razorpay.com/v1/checkout.js";
// //       script.onload = () => resolve(true);
// //       script.onerror = () => resolve(false);
// //       document.body.appendChild(script);
// //     });
// //   };

// //   const timeToMinutes = (time) => {
// //     const [hour, minute] = time.split(":").map(Number);
// //     return hour * 60 + minute;
// //   };

// //   // const parseBackendDate = (dateStr) => {
// //   //   if (!dateStr || typeof dateStr !== "string") {
// //   //     console.warn("Invalid dateStr:", dateStr);
// //   //     return null;
// //   //   }

// //   //   if (dateStr.includes("T")) {
// //   //     const date = new Date(dateStr);
// //   //     return date.toISOString().slice(0, 10);
// //   //   }

// //   //   const [date, time] = dateStr.split(" ");
// //   //   if (!time || !time.includes(":")) {
// //   //     console.warn("Invalid time part:", time);
// //   //     return null;
// //   //   }

// //   //   const [month, day, year] = date.split("/");
// //   //   const [hour, minute, second] = time.split(":").map(Number);
// //   //   const ampm = time.slice(-2);

// //   //   let hours = hour;
// //   //   if (ampm === "PM" && hours !== 12) hours += 12;
// //   //   if (ampm === "AM" && hours === 12) hours = 0;

// //   //   const formattedDate = new Date(year, month - 1, day, hours, minute, second);
// //   //   return formattedDate.toISOString().slice(0, 10);
// //   // };

// // const parseBackendDate = (dateStr) => {
// //   if (!dateStr || typeof dateStr !== "string") {
// //     console.warn("Invalid dateStr:", dateStr);
// //     return null;
// //   }

// //   const date = new Date(dateStr);
// //   if (isNaN(date)) {
// //     console.warn("Invalid Date object:", dateStr);
// //     return null;
// //   }

// //   const year = date.getFullYear();
// //   const month = String(date.getMonth() + 1).padStart(2, "0");
// //   const day = String(date.getDate()).padStart(2, "0");

// //   return `${year}-${month}-${day}`;  // format: yyyy-mm-dd
// // };




// //   const fetchBookedSlots = async () => {
// //     if (formData.bookingDate && formData.gameId) {
// //       try {
// //         const res = await axios.get("https://localhost:7186/api/TblBookings");

// //         const filtered = res.data
// //           .filter((b) => {
// //             const parsedDate = parseBackendDate(b.bookingDate);
// //             if (!parsedDate) return false;

// //             const isSameDate = parsedDate === formData.bookingDate;
// //             console.log(`Booking Date: ${parsedDate}, Selected Date: ${formData.bookingDate}, Match: ${isSameDate}`);
// //             return b.gameId == formData.gameId && isSameDate;
// //           })
// //           .map((b) => ({
// //             startTime: b.startTime.slice(0, 5),
// //             endTime: b.endTime.slice(0, 5)
// //           }));

// //         setBookedSlots(filtered);
// //       } catch (err) {
// //         console.error("Error fetching booked slots:", err);
// //       }
// //     }
// //   };



// //   useEffect(() => {
// //     fetchBookedSlots();
// //   }, [formData.bookingDate]);

// //   const checkTimeOverlap = () => {
// //     const selectedStart = timeToMinutes(formData.startTime);
// //     const selectedEnd = timeToMinutes(formData.endTime);

// //     for (let slot of bookedSlots) {
// //       const slotStart = timeToMinutes(slot.startTime);
// //       const slotEnd = timeToMinutes(slot.endTime);

// //       const isOverlap = !(selectedEnd <= slotStart || selectedStart >= slotEnd);
// //       if (isOverlap) return true;
// //     }
// //     return false;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     // 🔴 Validation: StartTime >= EndTime
// //     if (formData.startTime >= formData.endTime) {
// //       alert("⚠️ Start Time must be earlier than End Time.");
// //       return;
// //     }

// //     if (checkTimeOverlap()) {
// //       alert("⚠️ This time slot is already booked. Please select a different time.");
// //       return;
// //     }

// //     const isScriptLoaded = await loadRazorpayScript();
// //     if (!isScriptLoaded) {
// //       alert("Razorpay SDK failed to load.");
// //       return;
// //     }

// //     const amountInPaise = parseFloat(formData.price) * 100;
// //     const user = JSON.parse(sessionStorage.getItem("user")) || {};

// //     const options = {
// //       key: "rzp_test_mKFFsoRNrHIPv0",
// //       currency: "INR",
// //       amount: amountInPaise,
// //       name: "Playvana Booking",
// //       description: "Payment for game booking",
// //       image: "/logo.png",
// //       handler: async function (response) {
// //         try {
// //           const paymentData = {
// //             transactionId: response.razorpay_payment_id,
// //             userId: parseInt(userId),
// //             amount: parseFloat(formData.price),
// //             paymentDate: new Date().toISOString(),
// //             gameId: parseInt(formData.gameId),
// //             PaymentStatus: "Confirm"
// //           };

// //           await axios.post("https://localhost:7186/api/TblPayments", paymentData);

// //           const bookingPayload = {
// //             ...formData,
// //             price: parseFloat(formData.price),
// //           };

// //           await axios.post("https://localhost:7186/api/TblBookings", bookingPayload);

// //           alert("🎉 Payment and Booking Successful!");
// //         } catch (err) {
// //           console.error("❌ Booking/payment failed:", err);
// //           alert("Payment done but booking failed. Contact support.");
// //         }
// //       },
// //       prefill: {
// //         name: user?.name || "Customer",
// //         email: user?.email || "customer@example.com",
// //         contact: user?.phone || "9999999999"
// //       },
// //       notes: {
// //         game_id: formData.gameId
// //       },
// //       theme: {
// //         color: "#3399cc"
// //       }
// //     };

// //     const paymentObject = new window.Razorpay(options);
// //     paymentObject.open();
// //   };

// //   return (
// //     <div className="container text-light">
// //       <Navbar />
// //       <h2>📝 Book Game</h2>
// //       <form onSubmit={handleSubmit}>
// //         <label>Game ID</label>
// //         <input type="number" value={formData.gameId} readOnly />

// //         <label>User ID</label>
// //         <input type="number" value={formData.userId} readOnly />

// //         <label>Price</label>
// //         <input type="number" value={formData.price} readOnly />

// //         <label>Booking Date</label>
// //         <input
// //           type="date"
// //           value={formData.bookingDate}
// //           onChange={(e) =>
// //             setFormData({ ...formData, bookingDate: e.target.value })
// //           }
// //           required
// //         />

// //         <label>Start Time</label>
// //         <input
// //           type="time"
// //           value={formData.startTime}
// //           onChange={(e) =>
// //             setFormData({ ...formData, startTime: e.target.value })
// //           }
// //           required
// //         />

// //         <label>End Time</label>
// //         <input
// //           type="time"
// //           value={formData.endTime}
// //           onChange={(e) =>
// //             setFormData({ ...formData, endTime: e.target.value })
// //           }
// //           required
// //         />

// //         {bookedSlots.length > 0 && (
// //           <div className="booked-slots">
// //             <strong>📌 Booked Time Slots:</strong>
// //             <ul>
// //               {bookedSlots.map((slot, index) => (
// //                 <li key={index}>
// //                   ⏰ {slot.startTime} - {slot.endTime}
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         )}

// //         <button type="submit">Confirm Booking</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default BookingManager;

// import { useState, useEffect } from "react"
// import axios from "axios"
// import "../css/Booking.css"
// import Navbar from "./Navbar"
// import { useLocation, useNavigate } from "react-router-dom"
// import { getUserInfo } from "../auth/JwtUtils"
// import LoginPopup from "./LoginPopup"
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaGamepad,
//   FaMoneyBillWave,
//   FaUser,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSpinner,
//   FaInfoCircle,
//   FaLock,
//   FaCreditCard,
//   FaArrowLeft,
//   FaTrophy,
//   FaStar,
//   FaUsers,
//   FaPlay,
// } from "react-icons/fa"

// const BookingManager = () => {
//   const navigate = useNavigate()
//   const { state } = useLocation()
//   const game = state?.game
//   const userInfo = getUserInfo()
//   const userId = userInfo?.UserId || ""

//   const [formData, setFormData] = useState({
//     bookingId: 0,
//     gameId: game?.gameId || "",
//     userId: userId,
//     price: game?.pricing || "",
//     status: 1,
//     bookingDate: "",
//     startTime: "",
//     endTime: "",
//   })

//   const [bookedSlots, setBookedSlots] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [showLoginPopup, setShowLoginPopup] = useState(!userId)
//   const [timeSlots, setTimeSlots] = useState([])
//   const [selectedStartSlot, setSelectedStartSlot] = useState(null)
//   const [selectedEndSlot, setSelectedEndSlot] = useState(null)
//   const [bookingStep, setBookingStep] = useState(1) // 1: Date/Time, 2: Review, 3: Success

//   // Generate time slots from 9 AM to 10 PM
//   useEffect(() => {
//     const slots = []
//     for (let hour = 9; hour <= 22; hour++) {
//       const formattedHour = hour.toString().padStart(2, "0")
//       slots.push(`${formattedHour}:00`)
//       if (hour < 22) {
//         slots.push(`${formattedHour}:30`)
//       }
//     }
//     setTimeSlots(slots)
//   }, [])

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script")
//       script.src = "https://checkout.razorpay.com/v1/checkout.js"
//       script.onload = () => resolve(true)
//       script.onerror = () => resolve(false)
//       document.body.appendChild(script)
//     })
//   }

//   const timeToMinutes = (time) => {
//     const [hour, minute] = time.split(":").map(Number)
//     return hour * 60 + minute
//   }

//   const parseBackendDate = (dateStr) => {
//     if (!dateStr || typeof dateStr !== "string") {
//       console.warn("Invalid dateStr:", dateStr)
//       return null
//     }

//     const date = new Date(dateStr)
//     if (isNaN(date)) {
//       console.warn("Invalid Date object:", dateStr)
//       return null
//     }

//     const year = date.getFullYear()
//     const month = String(date.getMonth() + 1).padStart(2, "0")
//     const day = String(date.getDate()).padStart(2, "0")

//     return `${year}-${month}-${day}` // format: yyyy-mm-dd
//   }

//   const fetchBookedSlots = async () => {
//     if (formData.bookingDate && formData.gameId) {
//       try {
//         setLoading(true)
//         const res = await axios.get("https://localhost:7186/api/TblBookings")

//         const filtered = res.data
//           .filter((b) => {
//             const parsedDate = parseBackendDate(b.bookingDate)
//             if (!parsedDate) return false

//             const isSameDate = parsedDate === formData.bookingDate
//             return b.gameId == formData.gameId && isSameDate
//           })
//           .map((b) => ({
//             startTime: b.startTime.slice(0, 5),
//             endTime: b.endTime.slice(0, 5),
//           }))

//         setBookedSlots(filtered)
//         setError(null)
//       } catch (err) {
//         console.error("Error fetching booked slots:", err)
//         setError("Failed to load booked slots. Please try again.")
//       } finally {
//         setLoading(false)
//       }
//     }
//   }

//   useEffect(() => {
//     if (formData.bookingDate) {
//       fetchBookedSlots()
//     }
//   }, [formData.bookingDate])

//   useEffect(() => {
//     // Set start and end time when slots are selected
//     if (selectedStartSlot) {
//       setFormData((prev) => ({ ...prev, startTime: selectedStartSlot }))
//     }
//     if (selectedEndSlot) {
//       setFormData((prev) => ({ ...prev, endTime: selectedEndSlot }))
//     }
//   }, [selectedStartSlot, selectedEndSlot])

//   const checkTimeOverlap = () => {
//     if (!formData.startTime || !formData.endTime) return false

//     const selectedStart = timeToMinutes(formData.startTime)
//     const selectedEnd = timeToMinutes(formData.endTime)

//     for (const slot of bookedSlots) {
//       const slotStart = timeToMinutes(slot.startTime)
//       const slotEnd = timeToMinutes(slot.endTime)

//       const isOverlap = !(selectedEnd <= slotStart || selectedStart >= slotEnd)
//       if (isOverlap) return true
//     }
//     return false
//   }

//   const isSlotBooked = (slot) => {
//     const slotMinutes = timeToMinutes(slot)

//     for (const bookedSlot of bookedSlots) {
//       const bookedStart = timeToMinutes(bookedSlot.startTime)
//       const bookedEnd = timeToMinutes(bookedSlot.endTime)

//       if (slotMinutes >= bookedStart && slotMinutes < bookedEnd) {
//         return true
//       }
//     }
//     return false
//   }

//   const isValidEndTime = (slot) => {
//     if (!selectedStartSlot) return false

//     const startMinutes = timeToMinutes(selectedStartSlot)
//     const endMinutes = timeToMinutes(slot)

//     // End time must be after start time
//     return endMinutes > startMinutes
//   }

//   const handleStartTimeSelect = (slot) => {
//     if (isSlotBooked(slot)) return

//     setSelectedStartSlot(slot)
//     setSelectedEndSlot(null) // Reset end time when start time changes
//   }

//   const handleEndTimeSelect = (slot) => {
//     if (!selectedStartSlot || !isValidEndTime(slot) || isSlotBooked(slot)) return

//     setSelectedEndSlot(slot)
//   }

//   const handleDateChange = (date) => {
//     setFormData({ ...formData, bookingDate: date })
//     setSelectedStartSlot(null)
//     setSelectedEndSlot(null)
//     setError(null)
//   }

//   const validateBooking = () => {
//     if (!formData.bookingDate) {
//       setError("Please select a booking date.")
//       return false
//     }

//     if (!selectedStartSlot) {
//       setError("Please select a start time.")
//       return false
//     }

//     if (!selectedEndSlot) {
//       setError("Please select an end time.")
//       return false
//     }

//     if (formData.startTime >= formData.endTime) {
//       setError("Start time must be earlier than end time.")
//       return false
//     }

//     if (checkTimeOverlap()) {
//       setError("This time slot is already booked. Please select a different time.")
//       return false
//     }

//     const selectedDate = new Date(formData.bookingDate)
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     if (selectedDate < today) {
//       setError("Cannot book for past dates.")
//       return false
//     }

//     return true
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!userId) {
//       setShowLoginPopup(true)
//       return
//     }

//     // Validation
//     if (!validateBooking()) {
//       return
//     }

//     // Move to review step
//     if (bookingStep === 1) {
//       setBookingStep(2)
//       return
//     }

//     // Process payment
//     setLoading(true)

//     const isScriptLoaded = await loadRazorpayScript()
//     if (!isScriptLoaded) {
//       setError("Razorpay SDK failed to load.")
//       setLoading(false)
//       return
//     }

//     const amountInPaise = Number.parseFloat(formData.price) * 100
//     const user = JSON.parse(sessionStorage.getItem("user")) || {}

//     const options = {
//       key: "rzp_test_mKFFsoRNrHIPv0",
//       currency: "INR",
//       amount: amountInPaise,
//       name: "Playvana Booking",
//       description: `Booking for ${game?.title || "Game"}`,
//       image: "/logo.png",
//       handler: async (response) => {
//         try {
//           const paymentData = {
//             transactionId: response.razorpay_payment_id,
//             userId: Number.parseInt(userId),
//             amount: Number.parseFloat(formData.price),
//             paymentDate: new Date().toISOString(),
//             gameId: Number.parseInt(formData.gameId),
//             PaymentStatus: "Confirm",
//           }

//           await axios.post("https://localhost:7186/api/TblPayments", paymentData)

//           const bookingPayload = {
//             ...formData,
//             price: Number.parseFloat(formData.price),
//           }

//           await axios.post("https://localhost:7186/api/TblBookings", bookingPayload)

//           setBookingStep(3) // Success
//         } catch (err) {
//           console.error("Booking/payment failed:", err)
//           setError("Payment done but booking failed. Contact support.")
//         } finally {
//           setLoading(false)
//         }
//       },
//       prefill: {
//         name: user?.name || "Customer",
//         email: user?.email || "customer@example.com",
//         contact: user?.phone || "9999999999",
//       },
//       notes: {
//         game_id: formData.gameId,
//       },
//       theme: {
//         color: "#F9C349",
//       },
//     }

//     const paymentObject = new window.Razorpay(options)
//     paymentObject.open()
//   }

//   const handleCloseLoginPopup = () => {
//     setShowLoginPopup(false)
//     if (!userId) {
//       navigate("/games")
//     }
//   }

//   const calculateDuration = () => {
//     if (!formData.startTime || !formData.endTime) return "0"

//     const startMinutes = timeToMinutes(formData.startTime)
//     const endMinutes = timeToMinutes(formData.endTime)
//     const durationMinutes = endMinutes - startMinutes

//     const hours = Math.floor(durationMinutes / 60)
//     const minutes = durationMinutes % 60

//     if (hours === 0) {
//       return `${minutes} minutes`
//     } else if (minutes === 0) {
//       return `${hours} hour${hours > 1 ? "s" : ""}`
//     } else {
//       return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minutes`
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   const formatTime = (timeString) => {
//     if (!timeString) return ""
//     const [hours, minutes] = timeString.split(":")
//     const hour = Number.parseInt(hours)
//     const ampm = hour >= 12 ? "PM" : "AM"
//     const formattedHour = hour % 12 || 12
//     return `${formattedHour}:${minutes} ${ampm}`
//   }

//   const getDifficultyLabel = () => {
//     // Random difficulty for demo purposes
//     const difficulties = ["EASY", "MEDIUM", "HARD"]
//     return difficulties[Math.floor(Math.random() * difficulties.length)]
//   }

//   const getDifficultyClass = (difficulty) => {
//     switch (difficulty) {
//       case "EASY":
//         return "easy-badge"
//       case "MEDIUM":
//         return "medium-badge"
//       case "HARD":
//         return "hard-badge"
//       default:
//         return "medium-badge"
//     }
//   }

//   if (!game) {
//     return (
//       <>
//         <Navbar />
//         <div className="booking-page">
//           <div className="error-container">
//             <div className="error-icon">
//               <FaGamepad />
//             </div>
//             <h2>No game selected</h2>
//             <p>Please select a game from the games page to book.</p>
//             <button className="golden-btn" onClick={() => navigate("/games")}>
//               Back to Games
//             </button>
//           </div>
//         </div>
//       </>
//     )
//   }

//   const difficulty = getDifficultyLabel()
//   const difficultyClass = getDifficultyClass(difficulty)

//   return (
//     <>
//       <Navbar />
//       <div className="booking-page">
//         {/* Login Popup */}
//         <LoginPopup
//           isOpen={showLoginPopup}
//           onClose={handleCloseLoginPopup}
//           message="Please login to book this game"
//           redirectPath="/games"
//         />

//         {/* Background Elements */}
//         <div className="booking-bg-overlay"></div>
//         <div className="booking-bg-pattern"></div>
//         <div className="booking-floating-elements">
//           <div className="floating-orb orb-1"></div>
//           <div className="floating-orb orb-2"></div>
//           <div className="floating-orb orb-3"></div>
//         </div>

//         <div className="booking-container">
//           {/* Back Button */}
//           <div className="back-button-container">
//             <button className="back-button" onClick={() => navigate("/games")}>
//               <FaArrowLeft /> Back to Games
//             </button>
//           </div>

//           {/* Game Card - Styled like Games Page */}
//           <div className="game-card">
//             <div className="game-card-image">
//               <img src={game.image || "/placeholder.svg"} alt={game.title} />
//               <div className="game-card-badges">
//                 {Math.random() > 0.5 && <div className="featured-badge">FEATURED</div>}
//                 {Math.random() > 0.7 && <div className="trending-badge">TRENDING</div>}
//                 <div className={`difficulty-badge ${difficultyClass}`}>{difficulty}</div>
//               </div>
//               <div className="game-card-category">{game.category}</div>
//               <div className="game-card-rating">
//                 <FaStar /> {(4 + Math.random()).toFixed(1)}
//               </div>
//             </div>
//             <div className="game-card-content">
//               <h2 className="game-card-title">{game.title}</h2>
//               <p className="game-card-description">{game.description}</p>
              
//               <div className="game-card-features">
//                 <div className="feature-badge">Premium</div>
//                 <div className="feature-badge">Popular</div>
//               </div>
              
//               <div className="game-card-details">
//                 <div className="detail-item">
//                   <FaClock />
//                   <span>60 mins</span>
//                 </div>
//                 <div className="detail-item">
//                   <FaUsers />
//                   <span>1-6 players</span>
//                 </div>
//               </div>
              
//               <div className="game-card-footer">
//                 <div className="game-card-price">
//                   <span className="currency">₹</span>
//                   <span className="amount">{game.pricing}</span>
//                   <span className="period">PER SESSION</span>
//                 </div>
//                 {/* <div className="game-card-actions">
//                   <button className="action-button details-button">
//                     <FaPlay /> Details
//                   </button>
//                   <button className="action-button book-button">
//                     <FaCalendarAlt /> Book Now
//                   </button>
//                 </div> */}
//               </div>
//             </div>
//           </div>

//           {/* Booking Steps */}
//           <div className="booking-steps">
//             <div className={`step ${bookingStep >= 1 ? "active" : ""} ${bookingStep > 1 ? "completed" : ""}`}>
//               <div className="step-number">1</div>
//               <div className="step-label">Select Date & Time</div>
//             </div>
//             <div className={`step ${bookingStep >= 2 ? "active" : ""} ${bookingStep > 2 ? "completed" : ""}`}>
//               <div className="step-number">2</div>
//               <div className="step-label">Review & Pay</div>
//             </div>
//             <div className={`step ${bookingStep >= 3 ? "active" : ""}`}>
//               <div className="step-number">3</div>
//               <div className="step-label">Confirmation</div>
//             </div>
//           </div>

//           {/* Booking Form */}
//           {bookingStep === 1 && (
//             <div className="booking-form-container">
//               <h3 className="section-title">
//                 <FaCalendarAlt className="form-icon" /> Select Date & Time
//               </h3>

//               {error && (
//                 <div className="error-message">
//                   <FaTimesCircle /> {error}
//                 </div>
//               )}

//               <form className="booking-form">
//                 <div className="form-group">
//                   <label className="form-label">
//                     <FaCalendarAlt className="input-icon" /> Booking Date
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.bookingDate}
//                     onChange={(e) => handleDateChange(e.target.value)}
//                     min={new Date().toISOString().split("T")[0]}
//                     required
//                     className="form-input"
//                   />
//                 </div>

//                 {formData.bookingDate && (
//                   <>
//                     <div className="time-slots-section">
//                       <div className="time-slots-header">
//                         <h4 className="time-slots-title">
//                           <FaClock className="input-icon" /> Select Start Time
//                         </h4>
//                         {loading && <FaSpinner className="spinner" />}
//                       </div>

//                       <div className="time-slots-grid">
//                         {timeSlots.map((slot) => {
//                           const isBooked = isSlotBooked(slot)
//                           const isSelected = selectedStartSlot === slot
//                           return (
//                             <button
//                               key={`start-${slot}`}
//                               type="button"
//                               className={`time-slot ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
//                               onClick={() => handleStartTimeSelect(slot)}
//                               disabled={isBooked}
//                             >
//                               {formatTime(slot)}
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {selectedStartSlot && (
//                       <div className="time-slots-section">
//                         <div className="time-slots-header">
//                           <h4 className="time-slots-title">
//                             <FaClock className="input-icon" /> Select End Time
//                           </h4>
//                         </div>

//                         <div className="time-slots-grid">
//                           {timeSlots.map((slot) => {
//                             const isBooked = isSlotBooked(slot)
//                             const isValid = isValidEndTime(slot)
//                             const isSelected = selectedEndSlot === slot
//                             return (
//                               <button
//                                 key={`end-${slot}`}
//                                 type="button"
//                                 className={`time-slot ${!isValid ? "invalid" : ""} ${isBooked ? "booked" : ""} ${
//                                   isSelected ? "selected" : ""
//                                 }`}
//                                 onClick={() => handleEndTimeSelect(slot)}
//                                 disabled={!isValid || isBooked}
//                               >
//                                 {formatTime(slot)}
//                               </button>
//                             )
//                           })}
//                         </div>
//                       </div>
//                     )}

//                     {bookedSlots.length > 0 && (
//                       <div className="booked-slots-info">
//                         <h4 className="booked-slots-title">
//                           <FaInfoCircle /> Already Booked Slots
//                         </h4>
//                         <div className="booked-slots-list">
//                           {bookedSlots.map((slot, index) => (
//                             <div key={index} className="booked-slot-item">
//                               <FaTimesCircle className="booked-icon" />
//                               {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {selectedStartSlot && selectedEndSlot && (
//                       <div className="booking-summary">
//                         <h4 className="summary-title">Booking Summary</h4>
//                         <div className="summary-details">
//                           <div className="summary-item">
//                             <span className="summary-label">Date:</span>
//                             <span className="summary-value">{formatDate(formData.bookingDate)}</span>
//                           </div>
//                           <div className="summary-item">
//                             <span className="summary-label">Time:</span>
//                             <span className="summary-value">
//                               {formatTime(selectedStartSlot)} - {formatTime(selectedEndSlot)}
//                             </span>
//                           </div>
//                           <div className="summary-item">
//                             <span className="summary-label">Duration:</span>
//                             <span className="summary-value">{calculateDuration()}</span>
//                           </div>
//                           <div className="summary-item">
//                             <span className="summary-label">Price:</span>
//                             <span className="summary-value golden-text">₹{formData.price}</span>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div className="form-actions">
//                       <button
//                         type="button"
//                         className="golden-btn primary"
//                         onClick={handleSubmit}
//                         disabled={!selectedStartSlot || !selectedEndSlot || loading}
//                       >
//                         {loading ? <FaSpinner className="spinner" /> : "Continue to Payment"}
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </form>
//             </div>
//           )}

//           {/* Review & Payment */}
//           {bookingStep === 2 && (
//             <div className="booking-review-container">
//               <h3 className="section-title">
//                 <FaCheckCircle className="form-icon" /> Review & Confirm
//               </h3>

//               {error && (
//                 <div className="error-message">
//                   <FaTimesCircle /> {error}
//                 </div>
//               )}

//               <div className="booking-review">
//                 <div className="review-section">
//                   <h4 className="review-section-title">
//                     <FaCalendarAlt className="section-icon" /> Booking Details
//                   </h4>
//                   <div className="review-details">
//                     <div className="review-item">
//                       <span className="review-label">Game:</span>
//                       <span className="review-value">{game.title}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Date:</span>
//                       <span className="review-value">{formatDate(formData.bookingDate)}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Time:</span>
//                       <span className="review-value">
//                         {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
//                       </span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Duration:</span>
//                       <span className="review-value">{calculateDuration()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="review-section">
//                   <h4 className="review-section-title">
//                     <FaUser className="section-icon" /> User Details
//                   </h4>
//                   <div className="review-details">
//                     <div className="review-item">
//                       <span className="review-label">User ID:</span>
//                       <span className="review-value">{userId}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="review-section">
//                   <h4 className="review-section-title">
//                     <FaMoneyBillWave className="section-icon" /> Payment Details
//                   </h4>
//                   <div className="review-details">
//                     <div className="review-item">
//                       <span className="review-label">Price:</span>
//                       <span className="review-value golden-text">₹{formData.price}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Payment Method:</span>
//                       <span className="review-value">Razorpay (Credit/Debit Card, UPI, etc.)</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="payment-security-note">
//                   <FaLock className="lock-icon" />
//                   <p>Your payment information is secure. We use Razorpay for secure payment processing.</p>
//                 </div>

//                 <div className="form-actions">
//                   <button type="button" className="golden-btn secondary" onClick={() => setBookingStep(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="golden-btn primary" onClick={handleSubmit} disabled={loading}>
//                     {loading ? (
//                       <FaSpinner className="spinner" />
//                     ) : (
//                       <>
//                         <FaCreditCard className="btn-icon" /> Proceed to Payment
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Confirmation */}
//           {bookingStep === 3 && (
//             <div className="booking-confirmation-container">
//               <div className="confirmation-icon">
//                 <FaCheckCircle />
//               </div>
//               <h2 className="confirmation-title">Booking Confirmed!</h2>
//               <p className="confirmation-subtitle">Your booking for {game.title} has been successfully confirmed.</p>

//               <div className="confirmation-details">
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Date:</span>
//                   <span className="confirmation-value">{formatDate(formData.bookingDate)}</span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Time:</span>
//                   <span className="confirmation-value">
//                     {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
//                   </span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Duration:</span>
//                   <span className="confirmation-value">{calculateDuration()}</span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Price:</span>
//                   <span className="confirmation-value golden-text">₹{formData.price}</span>
//                 </div>
//               </div>

//               <div className="confirmation-actions">
//                 <button className="golden-btn primary" onClick={() => navigate("/bookedGames")}>
//                   View My Bookings
//                 </button>
//                 <button className="golden-btn secondary" onClick={() => navigate("/games")}>
//                   Back to Games
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default BookingManager



// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import "../css/Booking.css"
// import Navbar from "./Navbar"
// import { useLocation, useNavigate } from "react-router-dom"
// import { getUserInfo } from "../auth/JwtUtils"
// import LoginPopup from "./LoginPopup"
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaGamepad,
//   FaMoneyBillWave,
//   FaUser,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSpinner,
//   FaInfoCircle,
//   FaLock,
//   FaCreditCard,
//   FaArrowLeft,
//   FaTrophy,
// } from "react-icons/fa"

// const BookingManager = () => {
//   const navigate = useNavigate()
//   const { state } = useLocation()
//   const game = state?.game
//   const userInfo = getUserInfo()
//   const userId = userInfo?.UserId || ""

//   const [formData, setFormData] = useState({
//     bookingId: 0,
//     gameId: game?.gameId || "",
//     userId: userId,
//     hourlyRate: game?.pricing || 200, // Store hourly rate
//     price: 0, // This will be calculated dynamically
//     status: 1,
//     bookingDate: "",
//     startTime: "",
//     endTime: "",
//   })

//   const [bookedSlots, setBookedSlots] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [showLoginPopup, setShowLoginPopup] = useState(!userId)
//   const [timeSlots, setTimeSlots] = useState([])
//   const [selectedStartSlot, setSelectedStartSlot] = useState(null)
//   const [selectedEndSlot, setSelectedEndSlot] = useState(null)
//   const [bookingStep, setBookingStep] = useState(1) // 1: Date/Time, 2: Review, 3: Success

//   // Generate time slots from 9 AM to 10 PM
//   useEffect(() => {
//     const slots = []
//     for (let hour = 9; hour <= 22; hour++) {
//       const formattedHour = hour.toString().padStart(2, "0")
//       slots.push(`${formattedHour}:00`)
//       if (hour < 22) {
//         slots.push(`${formattedHour}:30`)
//       }
//     }
//     setTimeSlots(slots)
//   }, [])

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script")
//       script.src = "https://checkout.razorpay.com/v1/checkout.js"
//       script.onload = () => resolve(true)
//       script.onerror = () => resolve(false)
//       document.body.appendChild(script)
//     })
//   }

//   const timeToMinutes = (time) => {
//     const [hour, minute] = time.split(":").map(Number)
//     return hour * 60 + minute
//   }

//   const parseBackendDate = (dateStr) => {
//     if (!dateStr || typeof dateStr !== "string") {
//       console.warn("Invalid dateStr:", dateStr)
//       return null
//     }

//     const date = new Date(dateStr)
//     if (isNaN(date)) {
//       console.warn("Invalid Date object:", dateStr)
//       return null
//     }

//     const year = date.getFullYear()
//     const month = String(date.getMonth() + 1).padStart(2, "0")
//     const day = String(date.getDate()).padStart(2, "0")

//     return `${year}-${month}-${day}` // format: yyyy-mm-dd
//   }

//   const fetchBookedSlots = async () => {
//     if (formData.bookingDate && formData.gameId) {
//       try {
//         setLoading(true)
//         const res = await axios.get("https://localhost:7186/api/TblBookings")

//         const filtered = res.data
//           .filter((b) => {
//             const parsedDate = parseBackendDate(b.bookingDate)
//             if (!parsedDate) return false

//             const isSameDate = parsedDate === formData.bookingDate
//             return b.gameId == formData.gameId && isSameDate
//           })
//           .map((b) => ({
//             startTime: b.startTime.slice(0, 5),
//             endTime: b.endTime.slice(0, 5),
//           }))

//         setBookedSlots(filtered)
//         setError(null)
//       } catch (err) {
//         console.error("Error fetching booked slots:", err)
//         setError("Failed to load booked slots. Please try again.")
//       } finally {
//         setLoading(false)
//       }
//     }
//   }

//   useEffect(() => {
//     if (formData.bookingDate) {
//       fetchBookedSlots()
//     }
//   }, [formData.bookingDate])

//   // Function to calculate duration in hours
//   const calculateDurationInHours = (startTime, endTime) => {
//     if (!startTime || !endTime) return 0

//     const start = new Date(`2000-01-01T${startTime}`)
//     const end = new Date(`2000-01-01T${endTime}`)
//     const diffMs = end - start
//     const diffHours = diffMs / (1000 * 60 * 60) // Convert to hours

//     return Math.max(0, diffHours) // Ensure non-negative
//   }

//   // Function to calculate total amount
//   const calculateTotalAmount = (startTime, endTime, hourlyRate) => {
//     const durationHours = calculateDurationInHours(startTime, endTime)
//     return Math.round(durationHours * hourlyRate) // Round to nearest rupee
//   }

//   useEffect(() => {
//     // Set start and end time when slots are selected
//     if (selectedStartSlot) {
//       setFormData((prev) => ({ ...prev, startTime: selectedStartSlot }))
//     }
//     if (selectedEndSlot) {
//       setFormData((prev) => ({ ...prev, endTime: selectedEndSlot }))
//     }
    
//     // Calculate total amount when both times are selected
//     if (selectedStartSlot && selectedEndSlot) {
//       const totalAmount = calculateTotalAmount(selectedStartSlot, selectedEndSlot, formData.hourlyRate)
//       setFormData((prev) => ({ ...prev, price: totalAmount }))
//     }
//   }, [selectedStartSlot, selectedEndSlot, formData.hourlyRate])

//   const checkTimeOverlap = () => {
//     if (!formData.startTime || !formData.endTime) return false

//     const selectedStart = timeToMinutes(formData.startTime)
//     const selectedEnd = timeToMinutes(formData.endTime)

//     for (const slot of bookedSlots) {
//       const slotStart = timeToMinutes(slot.startTime)
//       const slotEnd = timeToMinutes(slot.endTime)

//       const isOverlap = !(selectedEnd <= slotStart || selectedStart >= slotEnd)
//       if (isOverlap) return true
//     }
//     return false
//   }

//   const isSlotBooked = (slot) => {
//     const slotMinutes = timeToMinutes(slot)

//     for (const bookedSlot of bookedSlots) {
//       const bookedStart = timeToMinutes(bookedSlot.startTime)
//       const bookedEnd = timeToMinutes(bookedSlot.endTime)

//       if (slotMinutes >= bookedStart && slotMinutes < bookedEnd) {
//         return true
//       }
//     }
//     return false
//   }

//   const isValidEndTime = (slot) => {
//     if (!selectedStartSlot) return false

//     const startMinutes = timeToMinutes(selectedStartSlot)
//     const endMinutes = timeToMinutes(slot)

//     // End time must be after start time
//     return endMinutes > startMinutes
//   }

//   const handleStartTimeSelect = (slot) => {
//     if (isSlotBooked(slot)) return

//     setSelectedStartSlot(slot)
//     setSelectedEndSlot(null) // Reset end time when start time changes
//   }

//   const handleEndTimeSelect = (slot) => {
//     if (!selectedStartSlot || !isValidEndTime(slot) || isSlotBooked(slot)) return

//     setSelectedEndSlot(slot)
//   }

//   const handleDateChange = (date) => {
//     setFormData({ ...formData, bookingDate: date })
//     setSelectedStartSlot(null)
//     setSelectedEndSlot(null)
//     setError(null)
//   }

//   const validateBooking = () => {
//     if (!formData.bookingDate) {
//       setError("Please select a booking date.")
//       return false
//     }

//     if (!selectedStartSlot) {
//       setError("Please select a start time.")
//       return false
//     }

//     if (!selectedEndSlot) {
//       setError("Please select an end time.")
//       return false
//     }

//     if (formData.startTime >= formData.endTime) {
//       setError("Start time must be earlier than end time.")
//       return false
//     }

//     if (checkTimeOverlap()) {
//       setError("This time slot is already booked. Please select a different time.")
//       return false
//     }

//     const selectedDate = new Date(formData.bookingDate)
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     if (selectedDate < today) {
//       setError("Cannot book for past dates.")
//       return false
//     }

//     return true
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!userId) {
//       setShowLoginPopup(true)
//       return
//     }

//     // Validation
//     if (!validateBooking()) {
//       return
//     }

//     // Move to review step
//     if (bookingStep === 1) {
//       setBookingStep(2)
//       return
//     }

//     // Process payment
//     setLoading(true)

//     const isScriptLoaded = await loadRazorpayScript()
//     if (!isScriptLoaded) {
//       setError("Razorpay SDK failed to load.")
//       setLoading(false)
//       return
//     }

//     const amountInPaise = Number.parseFloat(formData.price) * 100
//     const user = JSON.parse(sessionStorage.getItem("user")) || {}

//     const options = {
//       key: "rzp_test_mKFFsoRNrHIPv0",
//       currency: "INR",
//       amount: amountInPaise,
//       name: "GameZone Booking",
//       description: `Booking for ${game?.title || "Game"}`,
//       image: "/logo.png",
//       handler: async (response) => {
//         try {
//           const paymentData = {
//             transactionId: response.razorpay_payment_id,
//             userId: Number.parseInt(userId),
//             amount: Number.parseFloat(formData.price),
//             paymentDate: new Date().toISOString(),
//             gameId: Number.parseInt(formData.gameId),
//             PaymentStatus: "Confirm",
//           }

//           await axios.post("https://localhost:7186/api/TblPayments", paymentData)

//           const bookingPayload = {
//             ...formData,
//             price: Number.parseFloat(formData.price),
//           }

//           await axios.post("https://localhost:7186/api/TblBookings", bookingPayload)

//           setBookingStep(3) // Success
//         } catch (err) {
//           console.error("Booking/payment failed:", err)
//           setError("Payment done but booking failed. Contact support.")
//         } finally {
//           setLoading(false)
//         }
//       },
//       prefill: {
//         name: user?.name || "Customer",
//         email: user?.email || "customer@example.com",
//         contact: user?.phone || "9999999999",
//       },
//       notes: {
//         game_id: formData.gameId,
//       },
//       theme: {
//         color: "#F59E0B",
//       },
//     }

//     const paymentObject = new window.Razorpay(options)
//     paymentObject.open()
//   }

//   const handleCloseLoginPopup = () => {
//     setShowLoginPopup(false)
//     if (!userId) {
//       navigate("/games")
//     }
//   }

//   const calculateDuration = () => {
//     if (!formData.startTime || !formData.endTime) return "0"

//     const durationHours = calculateDurationInHours(formData.startTime, formData.endTime)
  
//     const hours = Math.floor(durationHours)
//     const minutes = Math.round((durationHours - hours) * 60)

//     if (hours === 0) {
//       return `${minutes} minutes`
//     } else if (minutes === 0) {
//       return `${hours} hour${hours > 1 ? "s" : ""}`
//     } else {
//       return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minutes`
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   const formatTime = (timeString) => {
//     if (!timeString) return ""
//     const [hours, minutes] = timeString.split(":")
//     const hour = Number.parseInt(hours)
//     const ampm = hour >= 12 ? "PM" : "AM"
//     const formattedHour = hour % 12 || 12
//     return `${formattedHour}:${minutes} ${ampm}`
//   }

//   if (!game) {
//     return (
//       <>
//         <Navbar />
//         <div className="booking-page">
//           <div className="error-container">
//             <div className="error-icon">
//               <FaGamepad />
//             </div>
//             <h2>No game selected</h2>
//             <p>Please select a game from the games page to book.</p>
//             <button className="golden-btn" onClick={() => navigate("/games")}>
//               Back to Games
//             </button>
//           </div>
//         </div>
//       </>
//     )
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="booking-page">
//         {/* Login Popup */}
//         <LoginPopup
//           isOpen={showLoginPopup}
//           onClose={handleCloseLoginPopup}
//           message="Please login to book this game"
//           redirectPath="/games"
//         />

//         {/* Background Elements */}
//         <div className="booking-bg-overlay"></div>
//         <div className="booking-bg-pattern"></div>
//         <div className="booking-floating-elements">
//           <div className="floating-orb orb-1"></div>
//           <div className="floating-orb orb-2"></div>
//           <div className="floating-orb orb-3"></div>
//         </div>

//         {/* Back Button */}
//         <div className="back-button-container">
//           <button className="back-button" onClick={() => navigate("/games")}>
//             <FaArrowLeft /> Back to Games
//           </button>
//         </div>

//         {/* Premium Badge */}
//         <div className="premium-badge-container">
//           <div className="premium-badge">
//             <FaTrophy className="trophy-icon" />
//             <span>PREMIUM GAMING EXPERIENCE</span>
//           </div>
//         </div>

//         {/* Booking Container */}
//         <div className="booking-container">
//           {/* Game Info Card */}
//           <div className="booking-game-card">
//             <div className="game-image-container">
//               <img src={game.image || "/placeholder.svg"} alt={game.title} className="game-image" />
//               <div className="game-overlay"></div>
//             </div>
//             <div className="game-details">
//               <h2 className="game-title">{game.title}</h2>
//               <div className="game-meta">
//                 <span className="game-category">{game.category}</span>
//                 <span className="game-price">₹{game.pricing}</span>
//               </div>
//               <p className="game-description">{game.description}</p>
//             </div>
//           </div>

//           {/* Booking Steps */}
//           <div className="booking-steps">
//             <div className={`step ${bookingStep >= 1 ? "active" : ""} ${bookingStep > 1 ? "completed" : ""}`}>
//               <div className="step-number">1</div>
//               <div className="step-label">Select Date & Time</div>
//             </div>
//             <div className={`step ${bookingStep >= 2 ? "active" : ""} ${bookingStep > 2 ? "completed" : ""}`}>
//               <div className="step-number">2</div>
//               <div className="step-label">Review & Pay</div>
//             </div>
//             <div className={`step ${bookingStep >= 3 ? "active" : ""}`}>
//               <div className="step-number">3</div>
//               <div className="step-label">Confirmation</div>
//             </div>
//           </div>

//           {/* Booking Form */}
//           {bookingStep === 1 && (
//             <div className="booking-form-container">
//               <h3 className="section-title">
//                 <FaCalendarAlt className="form-icon" /> Select Date & Time
//               </h3>

//               {error && (
//                 <div className="error-message">
//                   <FaTimesCircle /> {error}
//                 </div>
//               )}

//               <form className="booking-form">
//                 <div className="form-group">
//                   <label className="form-label">
//                     <FaCalendarAlt className="input-icon" /> Booking Date
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.bookingDate}
//                     onChange={(e) => handleDateChange(e.target.value)}
//                     min={new Date().toISOString().split("T")[0]}
//                     required
//                     className="form-input"
//                   />
//                 </div>

//                 {formData.bookingDate && (
//                   <>
//                     <div className="time-slots-section">
//                       <div className="time-slots-header">
//                         <h4 className="time-slots-title">
//                           <FaClock className="input-icon" /> Select Start Time
//                         </h4>
//                         {loading && <FaSpinner className="spinner" />}
//                       </div>

//                       <div className="time-slots-grid">
//                         {timeSlots.map((slot) => {
//                           const isBooked = isSlotBooked(slot)
//                           const isSelected = selectedStartSlot === slot
//                           return (
//                             <button
//                               key={`start-${slot}`}
//                               type="button"
//                               className={`time-slot ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
//                               onClick={() => handleStartTimeSelect(slot)}
//                               disabled={isBooked}
//                             >
//                               {formatTime(slot)}
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {selectedStartSlot && (
//                       <div className="time-slots-section">
//                         <div className="time-slots-header">
//                           <h4 className="time-slots-title">
//                             <FaClock className="input-icon" /> Select End Time
//                           </h4>
//                         </div>

//                         <div className="time-slots-grid">
//                           {timeSlots.map((slot) => {
//                             const isBooked = isSlotBooked(slot)
//                             const isValid = isValidEndTime(slot)
//                             const isSelected = selectedEndSlot === slot
//                             return (
//                               <button
//                                 key={`end-${slot}`}
//                                 type="button"
//                                 className={`time-slot ${!isValid ? "invalid" : ""} ${isBooked ? "booked" : ""} ${
//                                   isSelected ? "selected" : ""
//                                 }`}
//                                 onClick={() => handleEndTimeSelect(slot)}
//                                 disabled={!isValid || isBooked}
//                               >
//                                 {formatTime(slot)}
//                               </button>
//                             )
//                           })}
//                         </div>
//                       </div>
//                     )}

//                     {bookedSlots.length > 0 && (
//                       <div className="booked-slots-info">
//                         <h4 className="booked-slots-title">
//                           <FaInfoCircle /> Already Booked Slots
//                         </h4>
//                         <div className="booked-slots-list">
//                           {bookedSlots.map((slot, index) => (
//                             <div key={index} className="booked-slot-item">
//                               <FaTimesCircle className="booked-icon" />
//                               {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {selectedStartSlot && selectedEndSlot && (
//                       <div className="booking-summary">
//                         <h4 className="summary-title">Booking Summary</h4>
//                         <div className="summary-details">
//                           <div className="summary-item">
//                             <span className="summary-label">Date:</span>
//                             <span className="summary-value">{formatDate(formData.bookingDate)}</span>
//                           </div>
//                           <div className="summary-item">
//                             <span className="summary-label">Time:</span>
//                             <span className="summary-value">
//                               {formatTime(selectedStartSlot)} - {formatTime(selectedEndSlot)}
//                             </span>
//                           </div>
//                           <div className="summary-item">
//                             <span className="summary-label">Duration:</span>
//                             <span className="summary-value">{calculateDuration()}</span>
//                           </div>
//                           <div className="summary-item">
//                             <span className="summary-label">Price:</span>
//                             <span className="summary-value">₹{formData.price}</span>
//                           </div>
//                         </div>
//                         <div className="pricing-breakdown">
//                           <h4 className="breakdown-title">Pricing Breakdown</h4>
//                           <div className="breakdown-details">
//                             <div className="breakdown-item">
//                               <span className="breakdown-label">Hourly Rate:</span>
//                               <span className="breakdown-value">₹{formData.hourlyRate}/hour</span>
//                             </div>
//                             <div className="breakdown-item">
//                               <span className="breakdown-label">Duration:</span>
//                               <span className="breakdown-value">{calculateDurationInHours(formData.startTime, formData.endTime).toFixed(1)} hours</span>
//                             </div>
//                             <div className="breakdown-item total">
//                               <span className="breakdown-label">Total Amount:</span>
//                               <span className="breakdown-value">₹{formData.price}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div className="form-actions">
//                       <button
//                         type="button"
//                         className="golden-btn primary"
//                         onClick={handleSubmit}
//                         disabled={!selectedStartSlot || !selectedEndSlot || loading}
//                       >
//                         {loading ? <FaSpinner className="spinner" /> : "Continue to Payment"}
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </form>
//             </div>
//           )}

//           {/* Review & Payment */}
//           {bookingStep === 2 && (
//             <div className="booking-review-container">
//               <h3 className="section-title">
//                 <FaCheckCircle className="form-icon" /> Review & Confirm
//               </h3>

//               {error && (
//                 <div className="error-message">
//                   <FaTimesCircle /> {error}
//                 </div>
//               )}

//               <div className="booking-review">
//                 <div className="review-section">
//                   <h4 className="review-section-title">
//                     <FaCalendarAlt className="section-icon" /> Booking Details
//                   </h4>
//                   <div className="review-details">
//                     <div className="review-item">
//                       <span className="review-label">Game:</span>
//                       <span className="review-value">{game.title}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Date:</span>
//                       <span className="review-value">{formatDate(formData.bookingDate)}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Time:</span>
//                       <span className="review-value">
//                         {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
//                       </span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Duration:</span>
//                       <span className="review-value">{calculateDuration()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="review-section">
//                   <h4 className="review-section-title">
//                     <FaUser className="section-icon" /> User Details
//                   </h4>
//                   <div className="review-details">
//                     <div className="review-item">
//                       <span className="review-label">User ID:</span>
//                       <span className="review-value">{userId}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="review-section">
//                   <h4 className="review-section-title">
//                     <FaMoneyBillWave className="section-icon" /> Payment Details
//                   </h4>
//                   <div className="review-details">
//                     <div className="review-item">
//                       <span className="review-label">Price:</span>
//                       <span className="review-value golden-text">₹{formData.price}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Payment Method:</span>
//                       <span className="review-value">Razorpay (Credit/Debit Card, UPI, etc.)</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="payment-security-note">
//                   <FaLock className="lock-icon" />
//                   <p>Your payment information is secure. We use Razorpay for secure payment processing.</p>
//                 </div>

//                 <div className="form-actions">
//                   <button type="button" className="golden-btn secondary" onClick={() => setBookingStep(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="golden-btn primary" onClick={handleSubmit} disabled={loading}>
//                     {loading ? (
//                       <FaSpinner className="spinner" />
//                     ) : (
//                       <>
//                         <FaCreditCard className="btn-icon" /> Proceed to Payment
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Confirmation */}
//           {bookingStep === 3 && (
//             <div className="booking-confirmation-container">
//               <div className="confirmation-icon">
//                 <FaCheckCircle />
//               </div>
//               <h2 className="confirmation-title">Booking Confirmed!</h2>
//               <p className="confirmation-subtitle">Your booking for {game.title} has been successfully confirmed.</p>

//               <div className="confirmation-details">
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Date:</span>
//                   <span className="confirmation-value">{formatDate(formData.bookingDate)}</span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Time:</span>
//                   <span className="confirmation-value">
//                     {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
//                   </span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Duration:</span>
//                   <span className="confirmation-value">{calculateDuration()}</span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Price:</span>
//                   <span className="confirmation-value golden-text">₹{formData.price}</span>
//                 </div>
//               </div>

//               <div className="confirmation-actions">
//                 <button className="golden-btn primary" onClick={() => navigate("/bookedGames")}>
//                   View My Bookings
//                 </button>
//                 <button className="golden-btn secondary" onClick={() => navigate("/games")}>
//                   Back to Games
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default BookingManager

// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import "../css/Booking.css"
// import Navbar from "./Navbar"
// import { useLocation, useNavigate } from "react-router-dom"
// import { getUserInfo } from "../auth/JwtUtils"
// import { generateBookingQRCode } from "./utils/qrCodeGenerator"
// import LoginPopup from "./LoginPopup"
// import toast, { Toaster } from "react-hot-toast"
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaGamepad,
//   FaMoneyBillWave,
//   FaUser,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSpinner,
//   FaInfoCircle,
//   FaLock,
//   FaCreditCard,
//   FaArrowLeft,
//   FaTrophy,
//   FaQrcode,
//   FaDownload,
// } from "react-icons/fa"

// const BookingManager = () => {
//   const navigate = useNavigate()
//   const { state } = useLocation()
//   const game = state?.game
//   const userInfo = getUserInfo()
//   const userId = userInfo?.UserId || ""

//   const [formData, setFormData] = useState({
//     bookingId: 0,
//     gameId: game?.gameId || "",
//     userId: userId,
//     hourlyRate: game?.pricing || 200, // Store hourly rate
//     price: 0, // This will be calculated dynamically
//     status: 1,
//     bookingDate: "",
//     startTime: "",
//     endTime: "",
//   })

//   const [bookedSlots, setBookedSlots] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [showLoginPopup, setShowLoginPopup] = useState(!userId)
//   const [timeSlots, setTimeSlots] = useState([])
//   const [selectedStartSlot, setSelectedStartSlot] = useState(null)
//   const [selectedEndSlot, setSelectedEndSlot] = useState(null)
//   const [bookingStep, setBookingStep] = useState(1) // 1: Date/Time, 2: Review, 3: Success
//   const [bookingResult, setBookingResult] = useState(null) // Store booking result with QR code
//   const [generatingQR, setGeneratingQR] = useState(false)

//   // Generate time slots from 9 AM to 10 PM
//   useEffect(() => {
//     const slots = []
//     for (let hour = 9; hour <= 22; hour++) {
//       const formattedHour = hour.toString().padStart(2, "0")
//       slots.push(`${formattedHour}:00`)
//       if (hour < 22) {
//         slots.push(`${formattedHour}:30`)
//       }
//     }
//     setTimeSlots(slots)
//   }, [])

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script")
//       script.src = "https://checkout.razorpay.com/v1/checkout.js"
//       script.onload = () => resolve(true)
//       script.onerror = () => resolve(false)
//       document.body.appendChild(script)
//     })
//   }

//   const timeToMinutes = (time) => {
//     const [hour, minute] = time.split(":").map(Number)
//     return hour * 60 + minute
//   }

//   const parseBackendDate = (dateStr) => {
//     if (!dateStr || typeof dateStr !== "string") {
//       console.warn("Invalid dateStr:", dateStr)
//       return null
//     }

//     const date = new Date(dateStr)
//     if (isNaN(date)) {
//       console.warn("Invalid Date object:", dateStr)
//       return null
//     }

//     const year = date.getFullYear()
//     const month = String(date.getMonth() + 1).padStart(2, "0")
//     const day = String(date.getDate()).padStart(2, "0")

//     return `${year}-${month}-${day}` // format: yyyy-mm-dd
//   }

//   const fetchBookedSlots = async () => {
//     if (formData.bookingDate && formData.gameId) {
//       try {
//         setLoading(true)
//         const res = await axios.get("https://localhost:7186/api/TblBookings")

//         const filtered = res.data
//           .filter((b) => {
//             const parsedDate = parseBackendDate(b.bookingDate)
//             if (!parsedDate) return false

//             const isSameDate = parsedDate === formData.bookingDate
//             return b.gameId == formData.gameId && isSameDate
//           })
//           .map((b) => ({
//             startTime: b.startTime.slice(0, 5),
//             endTime: b.endTime.slice(0, 5),
//           }))

//         setBookedSlots(filtered)
//         setError(null)
//       } catch (err) {
//         console.error("Error fetching booked slots:", err)
//         setError("Failed to load booked slots. Please try again.")
//       } finally {
//         setLoading(false)
//       }
//     }
//   }

//   useEffect(() => {
//     if (formData.bookingDate) {
//       fetchBookedSlots()
//     }
//   }, [formData.bookingDate])

//   // Function to calculate duration in hours
//   const calculateDurationInHours = (startTime, endTime) => {
//     if (!startTime || !endTime) return 0

//     const start = new Date(`2000-01-01T${startTime}`)
//     const end = new Date(`2000-01-01T${endTime}`)
//     const diffMs = end - start
//     const diffHours = diffMs / (1000 * 60 * 60) // Convert to hours

//     return Math.max(0, diffHours) // Ensure non-negative
//   }

//   // Function to calculate total amount
//   const calculateTotalAmount = (startTime, endTime, hourlyRate) => {
//     const durationHours = calculateDurationInHours(startTime, endTime)
//     return Math.round(durationHours * hourlyRate) // Round to nearest rupee
//   }

//   useEffect(() => {
//     // Set start and end time when slots are selected
//     if (selectedStartSlot) {
//       setFormData((prev) => ({ ...prev, startTime: selectedStartSlot }))
//     }
//     if (selectedEndSlot) {
//       setFormData((prev) => ({ ...prev, endTime: selectedEndSlot }))
//     }

//     // Calculate total amount when both times are selected
//     if (selectedStartSlot && selectedEndSlot) {
//       const totalAmount = calculateTotalAmount(selectedStartSlot, selectedEndSlot, formData.hourlyRate)
//       setFormData((prev) => ({ ...prev, price: totalAmount }))
//     }
//   }, [selectedStartSlot, selectedEndSlot, formData.hourlyRate])

//   const checkTimeOverlap = () => {
//     if (!formData.startTime || !formData.endTime) return false

//     const selectedStart = timeToMinutes(formData.startTime)
//     const selectedEnd = timeToMinutes(formData.endTime)

//     for (const slot of bookedSlots) {
//       const slotStart = timeToMinutes(slot.startTime)
//       const slotEnd = timeToMinutes(slot.endTime)

//       const isOverlap = !(selectedEnd <= slotStart || selectedStart >= slotEnd)
//       if (isOverlap) return true
//     }
//     return false
//   }

//   const isSlotBooked = (slot) => {
//     const slotMinutes = timeToMinutes(slot)

//     for (const bookedSlot of bookedSlots) {
//       const bookedStart = timeToMinutes(bookedSlot.startTime)
//       const bookedEnd = timeToMinutes(bookedSlot.endTime)

//       if (slotMinutes >= bookedStart && slotMinutes < bookedEnd) {
//         return true
//       }
//     }
//     return false
//   }

//   const isValidEndTime = (slot) => {
//     if (!selectedStartSlot) return false

//     const startMinutes = timeToMinutes(selectedStartSlot)
//     const endMinutes = timeToMinutes(slot)

//     // End time must be after start time
//     return endMinutes > startMinutes
//   }

//   const handleStartTimeSelect = (slot) => {
//     if (isSlotBooked(slot)) return

//     setSelectedStartSlot(slot)
//     setSelectedEndSlot(null) // Reset end time when start time changes
//   }

//   const handleEndTimeSelect = (slot) => {
//     if (!selectedStartSlot || !isValidEndTime(slot) || isSlotBooked(slot)) return

//     setSelectedEndSlot(slot)
//   }

//   const handleDateChange = (date) => {
//     setFormData({ ...formData, bookingDate: date })
//     setSelectedStartSlot(null)
//     setSelectedEndSlot(null)
//     setError(null)
//   }

//   const validateBooking = () => {
//     if (!formData.bookingDate) {
//       setError("Please select a booking date.")
//       return false
//     }

//     if (!selectedStartSlot) {
//       setError("Please select a start time.")
//       return false
//     }

//     if (!selectedEndSlot) {
//       setError("Please select an end time.")
//       return false
//     }

//     if (formData.startTime >= formData.endTime) {
//       setError("Start time must be earlier than end time.")
//       return false
//     }

//     if (checkTimeOverlap()) {
//       setError("This time slot is already booked. Please select a different time.")
//       return false
//     }

//     const selectedDate = new Date(formData.bookingDate)
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     if (selectedDate < today) {
//       setError("Cannot book for past dates.")
//       return false
//     }

//     return true
//   }

//   const generateBookingQR = async (bookingData) => {
//     try {
//       setGeneratingQR(true)
//       toast.loading("Generating your QR code...")

//       const qrResult = await generateBookingQRCode(bookingData)

//       toast.dismiss()
//       toast.success("QR code generated successfully!")

//       return qrResult
//     } catch (error) {
//       console.error("Error generating QR code:", error)
//       toast.dismiss()
//       toast.error("Failed to generate QR code")
//       return null
//     } finally {
//       setGeneratingQR(false)
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!userId) {
//       setShowLoginPopup(true)
//       return
//     }

//     // Validation
//     if (!validateBooking()) {
//       return
//     }

//     // Move to review step
//     if (bookingStep === 1) {
//       setBookingStep(2)
//       return
//     }

//     // Process payment
//     setLoading(true)

//     const isScriptLoaded = await loadRazorpayScript()
//     if (!isScriptLoaded) {
//       setError("Razorpay SDK failed to load.")
//       setLoading(false)
//       return
//     }

//     const amountInPaise = Number.parseFloat(formData.price) * 100
//     const user = JSON.parse(sessionStorage.getItem("user")) || {}

//     const options = {
//       key: "rzp_test_mKFFsoRNrHIPv0",
//       currency: "INR",
//       amount: amountInPaise,
//       name: "GameZone Booking",
//       description: `Booking for ${game?.title || "Game"}`,
//       image: "/logo.png",
//       handler: async (response) => {
//         try {
//           // Create payment record
//           const paymentData = {
//             transactionId: response.razorpay_payment_id,
//             userId: Number.parseInt(userId),
//             amount: Number.parseFloat(formData.price),
//             paymentDate: new Date().toISOString(),
//             gameId: Number.parseInt(formData.gameId),
//             PaymentStatus: "Confirm",
//           }

//           await axios.post("https://localhost:7186/api/TblPayments", paymentData)

//           // Create booking record
//           const bookingPayload = {
//             ...formData,
//             price: Number.parseFloat(formData.price),
//           }

//           const bookingResponse = await axios.post("https://localhost:7186/api/TblBookings", bookingPayload)
//           const createdBooking = bookingResponse.data

//           // Generate booking reference
//           const bookingReference = `BK${String(createdBooking.bookingId || Date.now()).padStart(6, "0")}`

//           // Prepare booking data for QR generation
//           const bookingDataForQR = {
//             bookingId: createdBooking.bookingId || Date.now(),
//             gameId: formData.gameId,
//             gameName: game?.title || "Unknown Game",
//             userId: userId,
//             bookingDate: formData.bookingDate,
//             startTime: formData.startTime,
//             endTime: formData.endTime,
//             price: formData.price,
//             bookingReference: bookingReference,
//             paymentId: response.razorpay_payment_id,
//             gameCategory: game?.category || "Gaming",
//             location: `Gaming Zone ${formData.gameId}`,
//           }

//           // Generate QR code
//           const qrResult = await generateBookingQR(bookingDataForQR)

//           // Store complete booking result
//           setBookingResult({
//             ...bookingDataForQR,
//             qrCode: qrResult?.qrCodeDataURL || null,
//             qrData: qrResult?.qrData || null,
//             paymentStatus: "Confirmed",
//             createdAt: new Date().toISOString(),
//           })

//           setBookingStep(3) // Success
//           toast.success("Booking confirmed successfully!")
//         } catch (err) {
//           console.error("Booking/payment failed:", err)
//           setError("Payment done but booking failed. Contact support.")
//           toast.error("Booking failed. Please contact support.")
//         } finally {
//           setLoading(false)
//         }
//       },
//       prefill: {
//         name: user?.name || userInfo?.username || "Customer",
//         email: user?.email || userInfo?.email || "customer@example.com",
//         contact: user?.phone || "9999999999",
//       },
//       notes: {
//         game_id: formData.gameId,
//         user_id: userId,
//       },
//       theme: {
//         color: "#F59E0B",
//       },
//     }

//     const paymentObject = new window.Razorpay(options)
//     paymentObject.open()
//   }

//   const handleCloseLoginPopup = () => {
//     setShowLoginPopup(false)
//     if (!userId) {
//       navigate("/games")
//     }
//   }

//   const calculateDuration = () => {
//     if (!formData.startTime || !formData.endTime) return "0"

//     const durationHours = calculateDurationInHours(formData.startTime, formData.endTime)

//     const hours = Math.floor(durationHours)
//     const minutes = Math.round((durationHours - hours) * 60)

//     if (hours === 0) {
//       return `${minutes} minutes`
//     } else if (minutes === 0) {
//       return `${hours} hour${hours > 1 ? "s" : ""}`
//     } else {
//       return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minutes`
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   const formatTime = (timeString) => {
//     if (!timeString) return ""
//     const [hours, minutes] = timeString.split(":")
//     const hour = Number.parseInt(hours)
//     const ampm = hour >= 12 ? "PM" : "AM"
//     const formattedHour = hour % 12 || 12
//     return `${formattedHour}:${minutes} ${ampm}`
//   }

//   const downloadQRCode = () => {
//     if (!bookingResult?.qrCode) return

//     const link = document.createElement("a")
//     link.download = `GameZone-QR-${bookingResult.bookingReference}.png`
//     link.href = bookingResult.qrCode
//     link.click()
//   }

//   if (!game) {
//     return (
//       <>
//         <Navbar />
//         <div className="booking-page">
//           <div className="error-container">
//             <div className="error-icon">
//               <FaGamepad />
//             </div>
//             <h2>No game selected</h2>
//             <p>Please select a game from the games page to book.</p>
//             <button className="golden-btn" onClick={() => navigate("/games")}>
//               Back to Games
//             </button>
//           </div>
//         </div>
//       </>
//     )
//   }

//   return (
//     <>
//       <Navbar />
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: "rgba(26, 26, 26, 0.95)",
//             color: "#ffffff",
//             border: "1px solid rgba(255, 215, 0, 0.3)",
//             borderRadius: "12px",
//             backdropFilter: "blur(20px)",
//             boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
//           },
//         }}
//       />

//       <div className="booking-page">
//         {/* Login Popup */}
//         <LoginPopup
//           isOpen={showLoginPopup}
//           onClose={handleCloseLoginPopup}
//           message="Please login to book this game"
//           redirectPath="/games"
//         />

//         {/* Background Elements */}
//         <div className="booking-bg-overlay"></div>
//         <div className="booking-bg-pattern"></div>
//         <div className="booking-floating-elements">
//           <div className="floating-orb orb-1"></div>
//           <div className="floating-orb orb-2"></div>
//           <div className="floating-orb orb-3"></div>
//         </div>

//         {/* Back Button */}
//         <div className="back-button-container">
//           <button className="back-button" onClick={() => navigate("/games")}>
//             <FaArrowLeft /> Back to Games
//           </button>
//         </div>

//         {/* Premium Badge */}
//         <div className="premium-badge-container">
//           <div className="premium-badge">
//             <FaTrophy className="trophy-icon" />
//             <span>PREMIUM GAMING EXPERIENCE</span>
//           </div>
//         </div>

//         {/* Booking Container */}
//         <div className="booking-container">
//           {/* Game Info Card */}
//           <div className="booking-game-card">
//             <div className="game-image-container">
//               <img src={game.image || "/placeholder.svg"} alt={game.title} className="game-image" />
//               <div className="game-overlay"></div>
//             </div>
//             <div className="game-details">
//               <h2 className="game-title">{game.title}</h2>
//               <div className="game-meta">
//                 <span className="game-category">{game.category}</span>
//                 <span className="game-price">₹{game.pricing}</span>
//               </div>
//               <p className="game-description">{game.description}</p>
//             </div>
//           </div>

//           {/* Booking Steps */}
//           <div className="booking-steps">
//             <div className={`step ${bookingStep >= 1 ? "active" : ""} ${bookingStep > 1 ? "completed" : ""}`}>
//               <div className="step-number">1</div>
//               <div className="step-label">Select Date & Time</div>
//             </div>
//             <div className={`step ${bookingStep >= 2 ? "active" : ""} ${bookingStep > 2 ? "completed" : ""}`}>
//               <div className="step-number">2</div>
//               <div className="step-label">Review & Pay</div>
//             </div>
//             <div className={`step ${bookingStep >= 3 ? "active" : ""}`}>
//               <div className="step-number">3</div>
//               <div className="step-label">Confirmation</div>
//             </div>
//           </div>

//           {/* Booking Form */}
//           {bookingStep === 1 && (
//             <div className="booking-form-container">
//               <h3 className="section-title">
//                 <FaCalendarAlt className="form-icon" /> Select Date & Time
//               </h3>

//               {error && (
//                 <div className="error-message">
//                   <FaTimesCircle /> {error}
//                 </div>
//               )}

//               <form className="booking-form">
//                 <div className="form-group">
//                   <label className="form-label">
//                     <FaCalendarAlt className="input-icon" /> Booking Date
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.bookingDate}
//                     onChange={(e) => handleDateChange(e.target.value)}
//                     min={new Date().toISOString().split("T")[0]}
//                     required
//                     className="form-input"
//                   />
//                 </div>

//                 {formData.bookingDate && (
//                   <>
//                     <div className="time-slots-section">
//                       <div className="time-slots-header">
//                         <h4 className="time-slots-title">
//                           <FaClock className="input-icon" /> Select Start Time
//                         </h4>
//                         {loading && <FaSpinner className="spinner" />}
//                       </div>

//                       <div className="time-slots-grid">
//                         {timeSlots.map((slot) => {
//                           const isBooked = isSlotBooked(slot)
//                           const isSelected = selectedStartSlot === slot
//                           return (
//                             <button
//                               key={`start-${slot}`}
//                               type="button"
//                               className={`time-slot ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
//                               onClick={() => handleStartTimeSelect(slot)}
//                               disabled={isBooked}
//                             >
//                               {formatTime(slot)}
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {selectedStartSlot && (
//                       <div className="time-slots-section">
//                         <div className="time-slots-header">
//                           <h4 className="time-slots-title">
//                             <FaClock className="input-icon" /> Select End Time
//                           </h4>
//                         </div>

//                         <div className="time-slots-grid">
//                           {timeSlots.map((slot) => {
//                             const isBooked = isSlotBooked(slot)
//                             const isValid = isValidEndTime(slot)
//                             const isSelected = selectedEndSlot === slot
//                             return (
//                               <button
//                                 key={`end-${slot}`}
//                                 type="button"
//                                 className={`time-slot ${!isValid ? "invalid" : ""} ${isBooked ? "booked" : ""} ${
//                                   isSelected ? "selected" : ""
//                                 }`}
//                                 onClick={() => handleEndTimeSelect(slot)}
//                                 disabled={!isValid || isBooked}
//                               >
//                                 {formatTime(slot)}
//                               </button>
//                             )
//                           })}
//                         </div>
//                       </div>
//                     )}

//                     {bookedSlots.length > 0 && (
//                       <div className="booked-slots-info">
//                         <h4 className="booked-slots-title">
//                           <FaInfoCircle /> Already Booked Slots
//                         </h4>
//                         <div className="booked-slots-list">
//                           {bookedSlots.map((slot, index) => (
//                             <div key={index} className="booked-slot-item">
//                               <FaTimesCircle className="booked-icon" />
//                               {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {selectedStartSlot && selectedEndSlot && (
//                       <div className="booking-summary">
//                         <h4 className="summary-title">Booking Summary</h4>
//                         <div className="summary-details">
//                           <div className="summary-item">
//                             <span className="summary-label">Date:</span>
//                             <span className="summary-value">{formatDate(formData.bookingDate)}</span>
//                           </div>
//                           <div className="summary-item">
//                             <span className="summary-label">Time:</span>
//                             <span className="summary-value">
//                               {formatTime(selectedStartSlot)} - {formatTime(selectedEndSlot)}
//                             </span>
//                           </div>
//                           <div className="summary-item">
//                             <span className="summary-label">Duration:</span>
//                             <span className="summary-value">{calculateDuration()}</span>
//                           </div>
//                           <div className="summary-item">
//                             <span className="summary-label">Price:</span>
//                             <span className="summary-value">₹{formData.price}</span>
//                           </div>
//                         </div>
//                         <div className="pricing-breakdown">
//                           <h4 className="breakdown-title">Pricing Breakdown</h4>
//                           <div className="breakdown-details">
//                             <div className="breakdown-item">
//                               <span className="breakdown-label">Hourly Rate:</span>
//                               <span className="breakdown-value">₹{formData.hourlyRate}/hour</span>
//                             </div>
//                             <div className="breakdown-item">
//                               <span className="breakdown-label">Duration:</span>
//                               <span className="breakdown-value">
//                                 {calculateDurationInHours(formData.startTime, formData.endTime).toFixed(1)} hours
//                               </span>
//                             </div>
//                             <div className="breakdown-item total">
//                               <span className="breakdown-label">Total Amount:</span>
//                               <span className="breakdown-value">₹{formData.price}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div className="form-actions">
//                       <button
//                         type="button"
//                         className="golden-btn primary"
//                         onClick={handleSubmit}
//                         disabled={!selectedStartSlot || !selectedEndSlot || loading}
//                       >
//                         {loading ? <FaSpinner className="spinner" /> : "Continue to Payment"}
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </form>
//             </div>
//           )}

//           {/* Review & Payment */}
//           {bookingStep === 2 && (
//             <div className="booking-review-container">
//               <h3 className="section-title">
//                 <FaCheckCircle className="form-icon" /> Review & Confirm
//               </h3>

//               {error && (
//                 <div className="error-message">
//                   <FaTimesCircle /> {error}
//                 </div>
//               )}

//               <div className="booking-review">
//                 <div className="review-section">
//                   <h4 className="review-section-title">
//                     <FaCalendarAlt className="section-icon" /> Booking Details
//                   </h4>
//                   <div className="review-details">
//                     <div className="review-item">
//                       <span className="review-label">Game:</span>
//                       <span className="review-value">{game.title}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Date:</span>
//                       <span className="review-value">{formatDate(formData.bookingDate)}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Time:</span>
//                       <span className="review-value">
//                         {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
//                       </span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Duration:</span>
//                       <span className="review-value">{calculateDuration()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="review-section">
//                   <h4 className="review-section-title">
//                     <FaUser className="section-icon" /> User Details
//                   </h4>
//                   <div className="review-details">
//                     <div className="review-item">
//                       <span className="review-label">User ID:</span>
//                       <span className="review-value">{userId}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Name:</span>
//                       <span className="review-value">{userInfo?.username || "Customer"}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="review-section">
//                   <h4 className="review-section-title">
//                     <FaMoneyBillWave className="section-icon" /> Payment Details
//                   </h4>
//                   <div className="review-details">
//                     <div className="review-item">
//                       <span className="review-label">Price:</span>
//                       <span className="review-value golden-text">₹{formData.price}</span>
//                     </div>
//                     <div className="review-item">
//                       <span className="review-label">Payment Method:</span>
//                       <span className="review-value">Razorpay (Credit/Debit Card, UPI, etc.)</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="payment-security-note">
//                   <FaLock className="lock-icon" />
//                   <p>Your payment information is secure. We use Razorpay for secure payment processing.</p>
//                 </div>

//                 <div className="form-actions">
//                   <button type="button" className="golden-btn secondary" onClick={() => setBookingStep(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="golden-btn primary" onClick={handleSubmit} disabled={loading}>
//                     {loading ? (
//                       <FaSpinner className="spinner" />
//                     ) : (
//                       <>
//                         <FaCreditCard className="btn-icon" /> Proceed to Payment
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Confirmation */}
//           {bookingStep === 3 && bookingResult && (
//             <div className="booking-confirmation-container">
//               <div className="confirmation-icon">
//                 <FaCheckCircle />
//               </div>
//               <h2 className="confirmation-title">Booking Confirmed!</h2>
//               <p className="confirmation-subtitle">Your booking for {game.title} has been successfully confirmed.</p>

//               <div className="confirmation-details">
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Booking Reference:</span>
//                   <span className="confirmation-value golden-text">{bookingResult.bookingReference}</span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Date:</span>
//                   <span className="confirmation-value">{formatDate(bookingResult.bookingDate)}</span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Time:</span>
//                   <span className="confirmation-value">
//                     {formatTime(bookingResult.startTime)} - {formatTime(bookingResult.endTime)}
//                   </span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Duration:</span>
//                   <span className="confirmation-value">{calculateDuration()}</span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Price:</span>
//                   <span className="confirmation-value golden-text">₹{bookingResult.price}</span>
//                 </div>
//                 <div className="confirmation-item">
//                   <span className="confirmation-label">Payment ID:</span>
//                   <span className="confirmation-value">{bookingResult.paymentId}</span>
//                 </div>
//               </div>

//               {/* QR Code Section */}
//               {bookingResult.qrCode && (
//                 <div className="qr-code-section">
//                   <h3 className="qr-title">
//                     <FaQrcode className="qr-icon" /> Your Booking QR Code
//                   </h3>
//                   <div className="qr-container">
//                     <img src={bookingResult.qrCode || "/placeholder.svg"} alt="Booking QR Code" className="qr-image" />
//                     <p className="qr-description">Show this QR code at the venue for quick check-in</p>
//                     <button className="qr-download-btn" onClick={downloadQRCode}>
//                       <FaDownload className="download-icon" />
//                       Download QR Code
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="confirmation-actions">
//                 <button className="golden-btn primary" onClick={() => navigate("/bookedGames")}>
//                   View My Bookings
//                 </button>
//                 <button className="golden-btn secondary" onClick={() => navigate("/games")}>
//                   Back to Games
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default BookingManager









"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../css/Booking.css"
import Navbar from "./Navbar"
import { useLocation, useNavigate } from "react-router-dom"
import { getUserInfo } from "../auth/JwtUtils"
import { generateBookingQRCode } from "./utils/qrCodeGenerator"
import LoginPopup from "./LoginPopup"
import toast, { Toaster } from "react-hot-toast"
import {
  FaCalendarAlt,
  FaClock,
  FaGamepad,
  FaMoneyBillWave,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaInfoCircle,
  FaLock,
  FaCreditCard,
  FaArrowLeft,
  FaTrophy,
  FaQrcode,
  FaDownload,
  FaTicketAlt,
  FaIdCard,
  FaExclamationTriangle,
  FaUpload,
  FaFileImage,
} from "react-icons/fa"

const BookingManager = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const game = state?.game
  const userInfo = getUserInfo()
  const userId = userInfo?.UserId || ""

  const [formData, setFormData] = useState({
    bookingId: 0,
    gameId: game?.gameId || "",
    userId: userId,
    hourlyRate: game?.pricing || 200, // Store hourly rate
    originalPrice: 0, // Price before discount
    price: 0, // Final price after discount
    status: 1,
    bookingDate: "",
    startTime: "",
    endTime: "",
    // Offer-related fields
    hasOfferApplied: false,
    appliedOfferId: null,
    discountAmount: 0,
    offerCode: null,
  })

  const [bookedSlots, setBookedSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showLoginPopup, setShowLoginPopup] = useState(!userId)
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedStartSlot, setSelectedStartSlot] = useState(null)
  const [selectedEndSlot, setSelectedEndSlot] = useState(null)
  const [bookingStep, setBookingStep] = useState(1) // 1: Date/Time, 2: Review, 3: Success
  const [bookingResult, setBookingResult] = useState(null) // Store booking result with QR code
  const [generatingQR, setGeneratingQR] = useState(false)

  // Offer-related states
  const [userOffers, setUserOffers] = useState([])
  const [loadingOffers, setLoadingOffers] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [useOffer, setUseOffer] = useState(false)
  const [discountedPrice, setDiscountedPrice] = useState(0)
  const [originalPrice, setOriginalPrice] = useState(0)

  // Category validation states
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationFile, setVerificationFile] = useState(null)
  const [verificationPreview, setVerificationPreview] = useState(null)
  const [verificationUploaded, setVerificationUploaded] = useState(false)
  const [offerValidationError, setOfferValidationError] = useState("")

  const apiBase = "https://localhost:7186/api"

  // Generate time slots from 9 AM to 10 PM
  useEffect(() => {
    const slots = []
    for (let hour = 9; hour <= 22; hour++) {
      const formattedHour = hour.toString().padStart(2, "0")
      slots.push(`${formattedHour}:00`)
      if (hour < 22) {
        slots.push(`${formattedHour}:30`)
      }
    }
    setTimeSlots(slots)
  }, [])

  // Check if selected date is weekend
  const isWeekend = (dateString) => {
    if (!dateString) return false
    const date = new Date(dateString)
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 // Sunday = 0, Saturday = 6
  }

  // Validate offer category against booking conditions
  const validateOfferCategory = (offer, bookingDate) => {
    if (!offer || !bookingDate) return { valid: true, message: "" }

    switch (offer.category) {
      case "weekend":
        if (!isWeekend(bookingDate)) {
          return {
            valid: false,
            message: "Weekend offers can only be used on Saturdays and Sundays.",
          }
        }
        break
      case "student":
        if (!verificationUploaded) {
          return {
            valid: false,
            message: "Student offers require verification. Please upload your student ID card.",
            requiresVerification: true,
          }
        }
        break
      case "birthday":
        // Could add birthday validation here if needed
        break
      default:
        break
    }

    return { valid: true, message: "" }
  }

  // Handle verification file upload
  const handleVerificationUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPG, PNG, WEBP)")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }

      setVerificationFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setVerificationPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Submit verification
  const submitVerification = async () => {
    if (!verificationFile) {
      toast.error("Please select a file to upload")
      return
    }

    try {
      // Here you would typically upload to your server
      // For now, we'll just simulate the upload
      toast.loading("Uploading verification document...")

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setVerificationUploaded(true)
      setShowVerificationModal(false)
      toast.dismiss()
      toast.success("Verification document uploaded successfully!")

      // Clear validation error
      setOfferValidationError("")
    } catch (error) {
      toast.dismiss()
      toast.error("Failed to upload verification document")
    }
  }

  // Fetch user's active offers
  const fetchUserOffers = async () => {
    if (!userId) return

    setLoadingOffers(true)
    try {
      const response = await axios.get(`${apiBase}/TblClaimedOffers/Active/${userId}`)

      if (response.data && Array.isArray(response.data)) {
        // Filter offers applicable to this game
        const applicableOffers = response.data.filter((offer) => {
          if (!offer.gamesIncluded || offer.gamesIncluded.length === 0) {
            return true // If no games specified, offer applies to all games
          }
          return offer.gamesIncluded.includes(game?.title)
        })

        setUserOffers(applicableOffers)
      }
    } catch (error) {
      console.error("Failed to fetch user offers:", error)
    } finally {
      setLoadingOffers(false)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const timeToMinutes = (time) => {
    const [hour, minute] = time.split(":").map(Number)
    return hour * 60 + minute
  }

  const parseBackendDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") {
      console.warn("Invalid date string:", dateStr)
      return null
    }

    const date = new Date(dateStr)
    if (isNaN(date)) {
      console.warn("Invalid Date object:", dateStr)
      return null
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}` // format: yyyy-mm-dd
  }

  const fetchBookedSlots = async () => {
    if (formData.bookingDate && formData.gameId) {
      try {
        setLoading(true)
        const res = await axios.get(`${apiBase}/TblBookings`)

        const filtered = res.data
          .filter((b) => {
            const parsedDate = parseBackendDate(b.bookingDate)
            if (!parsedDate) return false

            const isSameDate = parsedDate === formData.bookingDate
            return b.gameId == formData.gameId && isSameDate
          })
          .map((b) => ({
            startTime: b.startTime.slice(0, 5),
            endTime: b.endTime.slice(0, 5),
          }))

        setBookedSlots(filtered)
        setError(null)
      } catch (err) {
        console.error("Error fetching booked slots:", err)
        setError("Failed to load booked slots. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (formData.bookingDate) {
      fetchBookedSlots()
    }
  }, [formData.bookingDate])

  useEffect(() => {
    fetchUserOffers()
  }, [userId, game])

  // Function to calculate duration in hours
  const calculateDurationInHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diffMs = end - start
    const diffHours = diffMs / (1000 * 60 * 60) // Convert to hours

    return Math.max(0, diffHours) // Ensure non-negative
  }

  // Function to calculate total amount
  const calculateTotalAmount = (startTime, endTime, hourlyRate) => {
    const durationHours = calculateDurationInHours(startTime, endTime)
    return Math.round(durationHours * hourlyRate) // Round to nearest rupee
  }

  // Function to apply offer discount
  const applyOfferDiscount = (basePrice, offer) => {
    if (!offer) return basePrice

    if (offer.discountType === "percentage") {
      return Math.round(basePrice * (1 - offer.discountValue / 100))
    } else {
      return Math.max(0, basePrice - offer.discountValue)
    }
  }

  useEffect(() => {
    // Set start and end time when slots are selected
    if (selectedStartSlot) {
      setFormData((prev) => ({ ...prev, startTime: selectedStartSlot }))
    }
    if (selectedEndSlot) {
      setFormData((prev) => ({ ...prev, endTime: selectedEndSlot }))
    }

    // Calculate total amount when both times are selected
    if (selectedStartSlot && selectedEndSlot) {
      const baseAmount = calculateTotalAmount(selectedStartSlot, selectedEndSlot, formData.hourlyRate)
      setOriginalPrice(baseAmount)

      if (useOffer && selectedOffer) {
        const discounted = applyOfferDiscount(baseAmount, selectedOffer)
        const discountAmount = baseAmount - discounted

        setDiscountedPrice(discounted)

        // Update form data with offer information
        setFormData((prev) => ({
          ...prev,
          originalPrice: baseAmount,
          price: discounted,
          hasOfferApplied: true,
          appliedOfferId: selectedOffer.offerId,
          discountAmount: discountAmount,
          offerCode: selectedOffer.offerCode,
        }))
      } else {
        setDiscountedPrice(baseAmount)

        // Update form data without offer
        setFormData((prev) => ({
          ...prev,
          originalPrice: baseAmount,
          price: baseAmount,
          hasOfferApplied: false,
          appliedOfferId: null,
          discountAmount: 0,
          offerCode: null,
        }))
      }
    }
  }, [selectedStartSlot, selectedEndSlot, formData.hourlyRate, useOffer, selectedOffer])

  const checkTimeOverlap = () => {
    if (!formData.startTime || !formData.endTime) return false

    const selectedStart = timeToMinutes(formData.startTime)
    const selectedEnd = timeToMinutes(formData.endTime)

    for (const slot of bookedSlots) {
      const slotStart = timeToMinutes(slot.startTime)
      const slotEnd = timeToMinutes(slot.endTime)

      const isOverlap = !(selectedEnd <= slotStart || selectedStart >= slotEnd)
      if (isOverlap) return true
    }
    return false
  }

  const isSlotBooked = (slot) => {
    const slotMinutes = timeToMinutes(slot)

    for (const bookedSlot of bookedSlots) {
      const bookedStart = timeToMinutes(bookedSlot.startTime)
      const bookedEnd = timeToMinutes(bookedSlot.endTime)

      if (slotMinutes >= bookedStart && slotMinutes < bookedEnd) {
        return true
      }
    }
    return false
  }

  const isValidEndTime = (slot) => {
    if (!selectedStartSlot) return false

    const startMinutes = timeToMinutes(selectedStartSlot)
    const endMinutes = timeToMinutes(slot)

    // End time must be after start time
    return endMinutes > startMinutes
  }

  const handleStartTimeSelect = (slot) => {
    if (isSlotBooked(slot)) return

    setSelectedStartSlot(slot)
    setSelectedEndSlot(null) // Reset end time when start time changes
  }

  const handleEndTimeSelect = (slot) => {
    if (!selectedStartSlot || !isValidEndTime(slot) || isSlotBooked(slot)) return

    setSelectedEndSlot(slot)
  }

  const handleDateChange = (date) => {
    setFormData({ ...formData, bookingDate: date })
    setSelectedStartSlot(null)
    setSelectedEndSlot(null)
    setError(null)
    setOfferValidationError("")

    // Validate selected offer against new date
    if (selectedOffer) {
      const validation = validateOfferCategory(selectedOffer, date)
      if (!validation.valid) {
        setOfferValidationError(validation.message)
        if (validation.requiresVerification) {
          // Don't remove offer, just show verification requirement
        } else {
          // Remove offer if it's not valid for this date
          setSelectedOffer(null)
          setUseOffer(false)
        }
      }
    }
  }

  const handleOfferSelect = (offer) => {
    console.log("Selected offer:", offer)

    // Validate offer category against current booking date
    const validation = validateOfferCategory(offer, formData.bookingDate)

    if (!validation.valid) {
      if (validation.requiresVerification) {
        setOfferValidationError(validation.message)
        setShowVerificationModal(true)
        // Still select the offer, but require verification
        setSelectedOffer(offer)
        setUseOffer(true)
      } else {
        toast.error(validation.message)
        return
      }
    } else {
      setSelectedOffer(offer)
      setUseOffer(true)
      setOfferValidationError("")
    }
  }

  const handleRemoveOffer = () => {
    setSelectedOffer(null)
    setUseOffer(false)
    setOfferValidationError("")
  }

  const validateBooking = () => {
    if (!formData.bookingDate) {
      setError("Please select a booking date.")
      return false
    }

    if (!selectedStartSlot) {
      setError("Please select a start time.")
      return false
    }

    if (!selectedEndSlot) {
      setError("Please select an end time.")
      return false
    }

    if (formData.startTime >= formData.endTime) {
      setError("Start time must be earlier than end time.")
      return false
    }

    if (checkTimeOverlap()) {
      setError("This time slot is already booked. Please select a different time.")
      return false
    }

    const selectedDate = new Date(formData.bookingDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      setError("Cannot book for past dates.")
      return false
    }

    // Validate selected offer
    if (selectedOffer) {
      const validation = validateOfferCategory(selectedOffer, formData.bookingDate)
      if (!validation.valid) {
        setError(validation.message)
        return false
      }
    }

    return true
  }

  const generateBookingQR = async (bookingData) => {
    try {
      setGeneratingQR(true)
      toast.loading("Generating your QR code...")

      const qrResult = await generateBookingQRCode(bookingData)

      toast.dismiss()
      toast.success("QR code generated successfully!")

      return qrResult
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast.dismiss()
      toast.error("Failed to generate QR code")
      return null
    } finally {
      setGeneratingQR(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userId) {
      setShowLoginPopup(true)
      return
    }

    // Validation
    if (!validateBooking()) {
      return
    }

    // Move to review step
    if (bookingStep === 1) {
      setBookingStep(2)
      return
    }

    // Process payment
    setLoading(true)

    const isScriptLoaded = await loadRazorpayScript()
    if (!isScriptLoaded) {
      setError("Razorpay SDK failed to load.")
      setLoading(false)
      return
    }

    const amountInPaise = Number.parseFloat(formData.price) * 100
    const user = JSON.parse(sessionStorage.getItem("user")) || {}

    const options = {
      key: "rzp_test_mKFFsoRNrHIPv0",
      currency: "INR",
      amount: amountInPaise,
      name: "GameZone Booking",
      description: `Booking for ${game?.title || "Game"}`,
      image: "/logo.png",
      handler: async (response) => {
        try {
          // Create payment record
          const paymentData = {
            transactionId: response.razorpay_payment_id,
            userId: Number.parseInt(userId),
            amount: Number.parseFloat(formData.price),
            paymentDate: new Date().toISOString(),
            gameId: Number.parseInt(formData.gameId),
            PaymentStatus: "Confirm",
          }

          await axios.post(`${apiBase}/TblPayments`, paymentData)

          // Prepare booking payload with proper data types
          const bookingPayload = {
            gameId: Number.parseInt(formData.gameId),
            userId: Number.parseInt(userId),
            bookingDate: formData.bookingDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            originalPrice: Number.parseFloat(formData.originalPrice),
            price: Number.parseFloat(formData.price),
            hasOfferApplied: formData.hasOfferApplied,
            appliedOfferId: formData.appliedOfferId ? Number.parseInt(formData.appliedOfferId) : null,
            discountAmount: formData.discountAmount ? Number.parseFloat(formData.discountAmount) : null,
            offerCode: formData.offerCode || null,
          }

          console.log("Booking payload:", bookingPayload)

          // Create booking record
          const bookingResponse = await axios.post(`${apiBase}/TblBookings`, bookingPayload)
          const createdBooking = bookingResponse.data

          console.log("Created booking:", createdBooking)

          // Generate booking reference
          const bookingReference = `BK${String(createdBooking.bookingId || Date.now()).padStart(6, "0")}`

          // Prepare booking data for QR generation
          const bookingDataForQR = {
            bookingId: createdBooking.bookingId || Date.now(),
            gameId: formData.gameId,
            gameName: game?.title || "Unknown Game",
            userId: userId,
            bookingDate: formData.bookingDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            price: formData.price,
            originalPrice: formData.originalPrice,
            discountApplied: formData.discountAmount || 0,
            offerUsed: formData.offerCode || null,
            bookingReference: bookingReference,
            paymentId: response.razorpay_payment_id,
            gameCategory: game?.category || "Gaming",
            location: `Gaming Zone ${formData.gameId}`,
          }

          // Generate QR code
          const qrResult = await generateBookingQR(bookingDataForQR)

          // Store complete booking result
          setBookingResult({
            ...bookingDataForQR,
            qrCode: qrResult?.qrCodeDataURL || null,
            qrData: qrResult?.qrData || null,
            paymentStatus: "Confirmed",
            createdAt: new Date().toISOString(),
          })

          setBookingStep(3) // Success
          toast.success("Booking confirmed successfully!")
        } catch (err) {
          console.error("Booking/payment failed:", err)
          setError("Payment done but booking failed. Contact support.")
          toast.error("Booking failed. Please contact support.")
        } finally {
          setLoading(false)
        }
      },
      prefill: {
        name: user?.name || userInfo?.username || "Customer",
        email: user?.email || userInfo?.email || "customer@example.com",
        contact: user?.phone || "9999999999",
      },
      notes: {
        game_id: formData.gameId,
        user_id: userId,
        offer_used: useOffer ? selectedOffer?.offerCode : null,
      },
      theme: {
        color: "#F59E0B",
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false)
    if (!userId) {
      navigate("/games")
    }
  }

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return "0"

    const durationHours = calculateDurationInHours(formData.startTime, formData.endTime)

    const hours = Math.floor(durationHours)
    const minutes = Math.round((durationHours - hours) * 60)

    if (hours === 0) {
      return `${minutes} minutes`
    } else if (minutes === 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`
    } else {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minutes`
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  const downloadQRCode = () => {
    if (!bookingResult?.qrCode) return

    const link = document.createElement("a")
    link.download = `GameZone-QR-${bookingResult.bookingReference}.png`
    link.href = bookingResult.qrCode
    link.click()
  }

  if (!game) {
    return (
      <>
        <Navbar />
        <div className="booking-page">
          <div className="error-container">
            <div className="error-icon">
              <FaGamepad />
            </div>
            <h2>No game selected</h2>
            <p>Please select a game from the games page to book.</p>
            <button className="golden-btn" onClick={() => navigate("/games")}>
              Back to Games
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(26, 26, 26, 0.95)",
            color: "#ffffff",
            border: "1px solid rgba(255, 215, 0, 0.3)",
            borderRadius: "12px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          },
        }}
      />

      <div className="booking-page">
        {/* Login Popup */}
        <LoginPopup
          isOpen={showLoginPopup}
          onClose={handleCloseLoginPopup}
          message="Please login to book this game"
          redirectPath="/games"
        />

        {/* Verification Modal */}
        {showVerificationModal && (
          <div className="modal-overlay" onClick={() => setShowVerificationModal(false)}>
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <FaIdCard className="modal-icon" />
                  Student Verification Required
                </h3>
                <button className="close-btn" onClick={() => setShowVerificationModal(false)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <p>To use this student offer, please upload a clear photo of your student ID card.</p>

                <div className="verification-upload">
                  {verificationPreview ? (
                    <div className="verification-preview">
                      <img src={verificationPreview || "/placeholder.svg"} alt="Verification document" />
                      <button
                        className="change-file-btn"
                        onClick={() => document.getElementById("verificationInput").click()}
                      >
                        <FaFileImage />
                        Change File
                      </button>
                    </div>
                  ) : (
                    <div className="upload-area" onClick={() => document.getElementById("verificationInput").click()}>
                      <FaUpload className="upload-icon" />
                      <h4>Upload Student ID</h4>
                      <p>Click to select or drag and drop</p>
                      <small>Supported: JPG, PNG, WEBP (Max 5MB)</small>
                    </div>
                  )}

                  <input
                    id="verificationInput"
                    type="file"
                    accept="image/*"
                    onChange={handleVerificationUpload}
                    style={{ display: "none" }}
                  />
                </div>

                <div className="verification-note">
                  <FaInfoCircle />
                  <p>
                    Your document will be verified within 24 hours. You can proceed with booking after verification.
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn secondary" onClick={() => setShowVerificationModal(false)}>
                  Cancel
                </button>
                <button className="btn primary" onClick={submitVerification} disabled={!verificationFile}>
                  <FaUpload />
                  Upload & Verify
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Background Elements */}
        <div className="booking-bg-overlay"></div>
        <div className="booking-bg-pattern"></div>
        <div className="booking-floating-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>

        {/* Back Button */}
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate("/games")}>
            <FaArrowLeft /> Back to Games
          </button>
        </div>

        {/* Premium Badge */}
        <div className="premium-badge-container">
          <div className="premium-badge">
            <FaTrophy className="trophy-icon" />
            <span>PREMIUM GAMING EXPERIENCE</span>
          </div>
        </div>

        {/* Booking Container */}
        <div className="booking-container">
          {/* Game Info Card */}
          <div className="booking-game-card">
            <div className="game-image-container">
              <img src={game.image || "/placeholder.svg"} alt={game.title} className="game-image" />
              <div className="game-overlay"></div>
            </div>
            <div className="game-details">
              <h2 className="game-title">{game.title}</h2>
              <div className="game-meta">
                <span className="game-category">{game.category}</span>
                <span className="game-price">₹{game.pricing}/hour</span>
              </div>
              <p className="game-description">{game.description}</p>
            </div>
          </div>

          {/* Booking Steps */}
          <div className="booking-steps">
            <div className={`step ${bookingStep >= 1 ? "active" : ""} ${bookingStep > 1 ? "completed" : ""}`}>
              <div className="step-number">1</div>
              <div className="step-label">Select Date & Time</div>
            </div>
            <div className={`step ${bookingStep >= 2 ? "active" : ""} ${bookingStep > 2 ? "completed" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-label">Review & Pay</div>
            </div>
            <div className={`step ${bookingStep >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>

          {/* Booking Form */}
          {bookingStep === 1 && (
            <div className="booking-form-container">
              <h3 className="section-title">
                <FaCalendarAlt className="form-icon" /> Select Date & Time
              </h3>

              {error && (
                <div className="error-message">
                  <FaTimesCircle /> {error}
                </div>
              )}

              <form className="booking-form">
                <div className="form-group">
                  <label className="form-label">
                    <FaCalendarAlt className="input-icon" /> Booking Date
                  </label>
                  <input
                    type="date"
                    value={formData.bookingDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="form-input"
                  />
                  {formData.bookingDate && isWeekend(formData.bookingDate) && (
                    <div className="date-info weekend">
                      <FaCalendarAlt />
                      <span>Weekend selected - Weekend offers available!</span>
                    </div>
                  )}
                </div>

                {formData.bookingDate && (
                  <>
                    <div className="time-slots-section">
                      <div className="time-slots-header">
                        <h4 className="time-slots-title">
                          <FaClock className="input-icon" /> Select Start Time
                        </h4>
                        {loading && <FaSpinner className="spinner" />}
                      </div>

                      <div className="time-slots-grid">
                        {timeSlots.map((slot) => {
                          const isBooked = isSlotBooked(slot)
                          const isSelected = selectedStartSlot === slot
                          return (
                            <button
                              key={`start-${slot}`}
                              type="button"
                              className={`time-slot ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                              onClick={() => handleStartTimeSelect(slot)}
                              disabled={isBooked}
                            >
                              {formatTime(slot)}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {selectedStartSlot && (
                      <div className="time-slots-section">
                        <div className="time-slots-header">
                          <h4 className="time-slots-title">
                            <FaClock className="input-icon" /> Select End Time
                          </h4>
                        </div>

                        <div className="time-slots-grid">
                          {timeSlots.map((slot) => {
                            const isBooked = isSlotBooked(slot)
                            const isValid = isValidEndTime(slot)
                            const isSelected = selectedEndSlot === slot
                            return (
                              <button
                                key={`end-${slot}`}
                                type="button"
                                className={`time-slot ${!isValid ? "invalid" : ""} ${isBooked ? "booked" : ""} ${
                                  isSelected ? "selected" : ""
                                }`}
                                onClick={() => handleEndTimeSelect(slot)}
                                disabled={!isValid || isBooked}
                              >
                                {formatTime(slot)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Available Offers Section */}
                    {userId && userOffers.length > 0 && selectedStartSlot && selectedEndSlot && (
                      <div className="offers-section">
                        <h4 className="offers-title">
                          <FaTicketAlt className="input-icon" /> Available Offers
                        </h4>

                        {offerValidationError && (
                          <div className="offer-validation-error">
                            <FaExclamationTriangle />
                            <span>{offerValidationError}</span>
                            {selectedOffer?.category === "student" && !verificationUploaded && (
                              <button className="verify-btn" onClick={() => setShowVerificationModal(true)}>
                                <FaIdCard />
                                Upload ID
                              </button>
                            )}
                          </div>
                        )}

                        <div className="offers-grid">
                          {userOffers.map((offer) => {
                            const validation = validateOfferCategory(offer, formData.bookingDate)
                            const isValid = validation.valid || offer.category === "student" // Student offers can be selected but need verification

                            return (
                              <div
                                key={offer.claimedOfferId}
                                className={`offer-item ${
                                  selectedOffer?.claimedOfferId === offer.claimedOfferId ? "selected" : ""
                                } ${!isValid ? "invalid" : ""}`}
                                onClick={() => isValid && handleOfferSelect(offer)}
                              >
                                <div className="offer-header">
                                  <div className="offer-code">{offer.offerCode}</div>
                                  <div className="offer-discount">
                                    {offer.discountType === "percentage"
                                      ? `${offer.discountValue}% OFF`
                                      : `₹${offer.discountValue} OFF`}
                                  </div>
                                </div>
                                <div className="offer-title">{offer.offerTitle}</div>
                                <div className="offer-category">
                                  <span className="category-badge">{offer.category}</span>
                                  {offer.category === "weekend" && !isWeekend(formData.bookingDate) && (
                                    <span className="restriction">Weekends only</span>
                                  )}
                                  {offer.category === "student" && (
                                    <span className="restriction">
                                      {verificationUploaded ? "Verified" : "ID required"}
                                    </span>
                                  )}
                                </div>
                                {originalPrice > 0 && (
                                  <div className="offer-savings">
                                    Save ₹{originalPrice - applyOfferDiscount(originalPrice, offer)}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        {selectedOffer && (
                          <button type="button" className="remove-offer-btn" onClick={handleRemoveOffer}>
                            Remove Offer
                          </button>
                        )}
                      </div>
                    )}

                    {bookedSlots.length > 0 && (
                      <div className="booked-slots-info">
                        <h4 className="booked-slots-title">
                          <FaInfoCircle /> Already Booked Slots
                        </h4>
                        <div className="booked-slots-list">
                          {bookedSlots.map((slot, index) => (
                            <div key={index} className="booked-slot-item">
                              <FaTimesCircle className="booked-icon" />
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStartSlot && selectedEndSlot && (
                      <div className="booking-summary">
                        <h4 className="summary-title">Booking Summary</h4>
                        <div className="summary-details">
                          <div className="summary-item">
                            <span className="summary-label">Date:</span>
                            <span className="summary-value">{formatDate(formData.bookingDate)}</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Time:</span>
                            <span className="summary-value">
                              {formatTime(selectedStartSlot)} - {formatTime(selectedEndSlot)}
                            </span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Duration:</span>
                            <span className="summary-value">{calculateDuration()}</span>
                          </div>
                          {useOffer && selectedOffer && (
                            <>
                              <div className="summary-item">
                                <span className="summary-label">Original Price:</span>
                                <span className="summary-value original-price">₹{formData.originalPrice}</span>
                              </div>
                              <div className="summary-item">
                                <span className="summary-label">Offer Applied:</span>
                                <span className="summary-value offer-code">{selectedOffer.offerCode}</span>
                              </div>
                              <div className="summary-item">
                                <span className="summary-label">Discount:</span>
                                <span className="summary-value discount">-₹{formData.discountAmount}</span>
                              </div>
                            </>
                          )}
                          <div className="summary-item total">
                            <span className="summary-label">Final Price:</span>
                            <span className="summary-value">₹{formData.price}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-actions">
                      <button
                        type="button"
                        className="golden-btn primary"
                        onClick={handleSubmit}
                        disabled={!selectedStartSlot || !selectedEndSlot || loading}
                      >
                        {loading ? <FaSpinner className="spinner" /> : "Continue to Payment"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}

          {/* Review & Payment */}
          {bookingStep === 2 && (
            <div className="booking-review-container">
              <h3 className="section-title">
                <FaCheckCircle className="form-icon" /> Review & Confirm
              </h3>

              {error && (
                <div className="error-message">
                  <FaTimesCircle /> {error}
                </div>
              )}

              <div className="booking-review">
                <div className="review-section">
                  <h4 className="review-section-title">
                    <FaCalendarAlt className="section-icon" /> Booking Details
                  </h4>
                  <div className="review-details">
                    <div className="review-item">
                      <span className="review-label">Game:</span>
                      <span className="review-value">{game.title}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Date:</span>
                      <span className="review-value">{formatDate(formData.bookingDate)}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Time:</span>
                      <span className="review-value">
                        {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Duration:</span>
                      <span className="review-value">{calculateDuration()}</span>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h4 className="review-section-title">
                    <FaUser className="section-icon" /> User Details
                  </h4>
                  <div className="review-details">
                    <div className="review-item">
                      <span className="review-label">User ID:</span>
                      <span className="review-value">{userId}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Name:</span>
                      <span className="review-value">{userInfo?.username || "Customer"}</span>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h4 className="review-section-title">
                    <FaMoneyBillWave className="section-icon" /> Payment Details
                  </h4>
                  <div className="review-details">
                    {useOffer && selectedOffer && (
                      <>
                        <div className="review-item">
                          <span className="review-label">Original Price:</span>
                          <span className="review-value original-price">₹{formData.originalPrice}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Offer Applied:</span>
                          <span className="review-value offer-applied">
                            {selectedOffer.offerCode} (
                            {selectedOffer.discountType === "percentage"
                              ? `${selectedOffer.discountValue}% OFF`
                              : `₹${selectedOffer.discountValue} OFF`}
                            )
                          </span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Discount:</span>
                          <span className="review-value discount">-₹{formData.discountAmount}</span>
                        </div>
                      </>
                    )}
                    <div className="review-item total">
                      <span className="review-label">Final Amount:</span>
                      <span className="review-value golden-text">₹{formData.price}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Payment Method:</span>
                      <span className="review-value">Razorpay (Credit/Debit Card, UPI, etc.)</span>
                    </div>
                  </div>
                </div>

                <div className="payment-security-note">
                  <FaLock className="lock-icon" />
                  <p>Your payment information is secure. We use Razorpay for secure payment processing.</p>
                </div>

                <div className="form-actions">
                  <button type="button" className="golden-btn secondary" onClick={() => setBookingStep(1)}>
                    Back
                  </button>
                  <button type="button" className="golden-btn primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <>
                        <FaCreditCard className="btn-icon" /> Proceed to Payment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {bookingStep === 3 && bookingResult && (
            <div className="booking-confirmation-container">
              <div className="confirmation-icon">
                <FaCheckCircle />
              </div>
              <h2 className="confirmation-title">Booking Confirmed!</h2>
              <p className="confirmation-subtitle">Your booking for {game.title} has been successfully confirmed.</p>

              <div className="confirmation-details">
                <div className="confirmation-item">
                  <span className="confirmation-label">Booking Reference:</span>
                  <span className="confirmation-value golden-text">{bookingResult.bookingReference}</span>
                </div>
                <div className="confirmation-item">
                  <span className="confirmation-label">Date:</span>
                  <span className="confirmation-value">{formatDate(bookingResult.bookingDate)}</span>
                </div>
                <div className="confirmation-item">
                  <span className="confirmation-label">Time:</span>
                  <span className="confirmation-value">
                    {formatTime(bookingResult.startTime)} - {formatTime(bookingResult.endTime)}
                  </span>
                </div>
                <div className="confirmation-item">
                  <span className="confirmation-label">Duration:</span>
                  <span className="confirmation-value">{calculateDuration()}</span>
                </div>
                {bookingResult.offerUsed && (
                  <>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Offer Used:</span>
                      <span className="confirmation-value offer-used">{bookingResult.offerUsed}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Discount Applied:</span>
                      <span className="confirmation-value discount">₹{bookingResult.discountApplied}</span>
                    </div>
                  </>
                )}
                <div className="confirmation-item">
                  <span className="confirmation-label">Final Price:</span>
                  <span className="confirmation-value golden-text">₹{bookingResult.price}</span>
                </div>
                <div className="confirmation-item">
                  <span className="confirmation-label">Payment ID:</span>
                  <span className="confirmation-value">{bookingResult.paymentId}</span>
                </div>
              </div>

              {/* QR Code Section */}
              {bookingResult.qrCode && (
                <div className="qr-code-section">
                  <h3 className="qr-title">
                    <FaQrcode className="qr-icon" /> Your Booking QR Code
                  </h3>
                  <div className="qr-container">
                    <img src={bookingResult.qrCode || "/placeholder.svg"} alt="Booking QR Code" className="qr-image" />
                    <p className="qr-description">Show this QR code at the venue for quick check-in</p>
                    <button className="qr-download-btn" onClick={downloadQRCode}>
                      <FaDownload className="download-icon" />
                      Download QR Code
                    </button>
                  </div>
                </div>
              )}

              <div className="confirmation-actions">
                <button className="golden-btn primary" onClick={() => navigate("/bookedGames")}>
                  View My Bookings
                </button>
                <button className="golden-btn secondary" onClick={() => navigate("/games")}>
                  Back to Games
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default BookingManager
