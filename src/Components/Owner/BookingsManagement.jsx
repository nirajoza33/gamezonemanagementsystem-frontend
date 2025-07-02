"use client"

import { useState, useEffect } from "react"
import { getUserInfo } from "../../auth/JwtUtils"
import "./OwnerPanel.css"
const BookingsManagement = () => {
  const [bookings, setBookings] = useState([])
  const [games, setGames] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userInfo = getUserInfo()
    setUser(userInfo)
    if (userInfo?.UserId) {
      fetchData(userInfo.UserId)
    }
  }, [])

  const fetchData = async (userId) => {
    try {
      setLoading(true)

      // Fetch user's games
      const gamesResponse = await fetch(`http://localhost:5012/api/TblGames/ByUser/${userId}`)
      const userGames = await gamesResponse.json()
      setGames(userGames)

      // Fetch all bookings
      const bookingsResponse = await fetch(`http://localhost:5012/api/TblBookings`)
      const allBookings = await bookingsResponse.json()

      // Filter bookings for user's games
      const userGameIds = userGames.map((game) => game.gameId)
      const userBookings = allBookings.filter((booking) => userGameIds.includes(booking.gameId))

      // Fetch users data
      const usersResponse = await fetch(`http://localhost:5012/api/Tblusers`)
      const allUsers = await usersResponse.json()
      setUsers(allUsers)

      // Enrich bookings with game and user details
      const enrichedBookings = userBookings.map((booking) => {
        const game = userGames.find((g) => g.gameId === booking.gameId)
        const bookingUser = allUsers.find((u) => u.userId === booking.userId)
        return {
          ...booking,
          gameTitle: game?.title || "Unknown Game",
          gameImage: game?.imageUrl,
          userName: bookingUser?.userName || "Unknown User",
          userEmail: bookingUser?.email || "Unknown Email",
        }
      })

      setBookings(enrichedBookings)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const booking = bookings.find((b) => b.bookingId === bookingId)
      if (!booking) return

      const updateData = {
        bookingId: booking.bookingId,
        gameId: booking.gameId,
        userId: booking.userId,
        price: booking.price,
        status: newStatus,
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
      }

      const response = await fetch(`http://localhost:5012/api/TblBookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        fetchData(user.UserId)
        alert("Booking status updated successfully!")
      } else {
        alert("Error updating booking status")
      }
    } catch (error) {
      console.error("Error updating booking:", error)
      alert("Error updating booking status")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "status-active"
      case "cancelled":
        return "status-inactive"
      case "completed":
        return "status-active"
      default:
        return "status-active"
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status?.toLowerCase() === filter.toLowerCase()
  })

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="panel-content">
      <div className="panel-card">
        <div className="card-header">
          <h1 className="card-title">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="card-icon">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
            Bookings Management
          </h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select"
              style={{ width: "auto", minWidth: "150px" }}
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255, 255, 255, 0.6)" }}>
            <svg
              width="64"
              height="64"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ marginBottom: "1rem", opacity: 0.5 }}
            >
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
            <h3>No bookings found</h3>
            <p>No bookings match your current filter</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Game</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>#{booking.bookingId}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img
                          src={
                            booking.gameImage
                              ? `http://localhost:5012/uploads/${booking.gameImage}`
                              : "/placeholder.svg?height=40&width=40"
                          }
                          alt={booking.gameTitle}
                          style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: "600", color: "#fff" }}>{booking.gameTitle}</div>
                          <div style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>
                            Game ID: {booking.gameId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: "600", color: "#fff" }}>{booking.userName}</div>
                        <div style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>{booking.userEmail}</div>
                      </div>
                    </td>
                    <td>{formatDate(booking.bookingDate)}</td>
                    <td>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </td>
                    <td style={{ color: "#ffd700", fontWeight: "600" }}>${booking.price}</td>
                    <td>
                      <span className={`game-status ${getStatusColor(booking.status)}`}>{booking.status}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {booking.status?.toLowerCase() === "confirmed" && (
                          <>
                            <button
                              className="btn-secondary btn-small"
                              onClick={() => updateBookingStatus(booking.bookingId, "Completed")}
                            >
                              Complete
                            </button>
                            <button
                              className="btn-danger btn-small"
                              onClick={() => updateBookingStatus(booking.bookingId, "Cancelled")}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status?.toLowerCase() === "cancelled" && (
                          <button
                            className="btn-primary btn-small"
                            onClick={() => updateBookingStatus(booking.bookingId, "Confirmed")}
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ "--stat-color": "#4cd964" }}>
          <div className="stat-value">{bookings.filter((b) => b.status?.toLowerCase() === "confirmed").length}</div>
          <div className="stat-label">Confirmed Bookings</div>
        </div>

        <div className="stat-card" style={{ "--stat-color": "#ffd700" }}>
          <div className="stat-value">{bookings.filter((b) => b.status?.toLowerCase() === "completed").length}</div>
          <div className="stat-label">Completed Bookings</div>
        </div>

        <div className="stat-card" style={{ "--stat-color": "#ff2a6d" }}>
          <div className="stat-value">{bookings.filter((b) => b.status?.toLowerCase() === "cancelled").length}</div>
          <div className="stat-label">Cancelled Bookings</div>
        </div>

        <div className="stat-card" style={{ "--stat-color": "#05d9e8" }}>
          <div className="stat-value">
            ${bookings.reduce((sum, booking) => sum + (booking.price || 0), 0).toFixed(2)}
          </div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>
    </div>
  )
}

export default BookingsManagement
