// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../css/Booking.css"

// const BookingManager = () => {
//   const [bookings, setBookings] = useState([]);
//   const [formData, setFormData] = useState({
//     bookingId: 0,
//     gameId: "",
//     userId: "",
//     price: "",
//     status: "Pending"
//   });
//   const [editing, setEditing] = useState(false);
//   const apiBase = "https://localhost:7186/api/TblBookings";

//   const fetchBookings = async () => {
//     const res = await axios.get(apiBase);
//     setBookings(res.data);
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editing) {
//         await axios.put(`${apiBase}/${formData.bookingId}`, formData);
//       } else {
//         await axios.post(apiBase, formData);
//       }
//       setFormData({ bookingId: 0, gameId: "", userId: "", price: "", status: "Pending" });
//       setEditing(false);
//       fetchBookings();
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

//   const handleEdit = (booking) => {
//     setFormData(booking);
//     setEditing(true);
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`${apiBase}/${id}`);
//     fetchBookings();
//   };

//   return (
//     <div className="container text-light">
//       <h2>📄 Booking Manager</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="number" name="gameId" placeholder="Game ID" value={formData.gameId} onChange={(e) => setFormData({ ...formData, gameId: e.target.value })} required />
//         <input type="number" name="userId" placeholder="User ID" value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} required />
//         <input type="number" name="price" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
//         <button type="submit">{editing ? "Update" : "Add"} Booking</button>
//       </form>
//       <ul>
//         {bookings.map(b => (
//           <li key={b.bookingId}>
//             Game #{b.gameId}, User #{b.userId}, ₹{b.price} - {b.status}
//             <button onClick={() => handleEdit(b)}>Edit</button>
//             <button onClick={() => handleDelete(b.bookingId)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default BookingManager;


import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Booking.css";
import Navbar from "./Navbar";


const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    bookingId: 0,
    gameId: "",
    userId: "",
    price: "",
    status: "Pending",
    bookingDate: "",
    startTime: "",
    endTime: ""
  });
  const [editing, setEditing] = useState(false);
  const apiBase = "https://localhost:7186/api/TblBookings";

  const fetchBookings = async () => {
    const res = await axios.get(apiBase);
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime
      };

      if (editing) {
        await axios.put(`${apiBase}/${formData.bookingId}`, payload);
      } else {
        await axios.post(apiBase, payload);
      }

      setFormData({
        bookingId: 0,
        gameId: "",
        userId: "",
        price: "",
        status: "Pending",
        bookingDate: "",
        startTime: "",
        endTime: ""
      });
      setEditing(false);
      fetchBookings();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEdit = (booking) => {
    setFormData({
      ...booking,
      bookingDate: booking.bookingDate?.split("T")[0],
      startTime: booking.startTime,
      endTime: booking.endTime
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${apiBase}/${id}`);
    fetchBookings();
  };

  return (
    <div className="container text-light">
      <Navbar/>
      <h2>📄 Booking Manager</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="gameId"
          placeholder="Game ID"
          value={formData.gameId}
          onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
          required
        />
        <input
          type="number"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
          required
        />
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          required
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </select>
        <button type="submit">{editing ? "Update" : "Add"} Booking</button>
      </form>
      <ul>
        {bookings.map((b) => (
          <li key={b.bookingId}>
            Game #{b.gameId}, User #{b.userId}, ₹{b.price} - {b.status} <br />
            📅 {new Date(b.bookingDate).toLocaleDateString()} | ⏰ {b.startTime} - {b.endTime}
            <br />
            <button onClick={() => handleEdit(b)}>Edit</button>
            <button onClick={() => handleDelete(b.bookingId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingManager;
