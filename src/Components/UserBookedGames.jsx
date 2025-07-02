"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../css/UserBookedGames.css"
import "./TicketPreview.css"
import "../css/BookingQRCode.css"
import Navbar from "./Navbar"
import TicketPreview from "./TicketPreview"
import { getUserInfo } from "../auth/JwtUtils"
import { generateTicketPDF } from "./utils/pdfGenerator"
import { generateBookingQRCode } from "./utils/qrCodeGenerator"
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaRupeeSign,
  FaFilter,
  FaSearch,
  FaSort,
  FaEye,
  FaDownload,
  FaCheck,
  FaTimes,
  FaTicketAlt,
  FaShare,
  FaPrint,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaHourglass,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaQrcode,
} from "react-icons/fa"
import { FaStar } from "react-icons/fa"
import toast, { Toaster } from "react-hot-toast"

const UserBookingsPage = () => {
  const userInfo = getUserInfo()
  const userId = userInfo?.UserId || ""
  const userName = userInfo?.username || "User"

  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showTicketPreview, setShowTicketPreview] = useState(false)
  const [ticketBooking, setTicketBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloadingTicket, setDownloadingTicket] = useState(false)

  // Helper function to map API booking data to component format
  const mapApiBookingToComponent = async (apiBooking) => {
    // Define gradients and colors based on category
    const categoryStyles = {
      Sports: {
        gradient: "from-blue-500 via-blue-400 to-cyan-400",
        accentColor: "#3b82f6",
        icon: "🎳",
      },
      "Virtual Reality": {
        gradient: "from-purple-500 via-violet-400 to-pink-400",
        accentColor: "#8b5cf6",
        icon: "🥽",
      },
      Action: {
        gradient: "from-green-500 via-emerald-400 to-teal-400",
        accentColor: "#10b981",
        icon: "🔫",
      },
      Arcade: {
        gradient: "from-orange-500 via-amber-400 to-yellow-400",
        accentColor: "#f59e0b",
        icon: "🕹️",
      },
      Simulation: {
        gradient: "from-red-500 via-rose-400 to-pink-400",
        accentColor: "#ef4444",
        icon: "🏎️",
      },
      Puzzle: {
        gradient: "from-indigo-500 via-purple-400 to-violet-400",
        accentColor: "#6366f1",
        icon: "🔍",
      },
      default: {
        gradient: "from-gray-500 via-gray-400 to-slate-400",
        accentColor: "#6b7280",
        icon: "🎮",
      },
    }

    const gameCategory = apiBooking.game?.cname || "Unknown"
    const style = categoryStyles[gameCategory] || categoryStyles.default

    // Map status from API to component format
    const getBookingStatus = (apiStatus) => {
      switch (apiStatus) {
        case 1:
          return "confirmed"
        case 2:
          return "completed"
        case 3:
          return "cancelled"
        case 0:
        default:
          return "pending"
      }
    }

    // Calculate duration
    const calculateDuration = (startTime, endTime) => {
      if (!startTime || !endTime) return "60 mins"

      const start = new Date(`2000-01-01T${startTime}`)
      const end = new Date(`2000-01-01T${endTime}`)
      const diffMs = end - start
      const diffMins = Math.floor(diffMs / (1000 * 60))

      if (diffMins >= 60) {
        const hours = Math.floor(diffMins / 60)
        const mins = diffMins % 60
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
      }
      return `${diffMins} mins`
    }

    const bookingReference = `BK${String(apiBooking.bookingId).padStart(6, "0")}`

    // Generate QR code for existing bookings if not already present
    let qrCodeDataURL = null
    try {
      const bookingDataForQR = {
        bookingId: apiBooking.bookingId,
        gameId: apiBooking.gameId,
        gameName: apiBooking.game?.title || "Unknown Game",
        userId: apiBooking.userId,
        bookingDate: apiBooking.bookingDate?.split("T")[0],
        startTime: apiBooking.startTime?.slice(0, 5),
        endTime: apiBooking.endTime?.slice(0, 5),
        price: apiBooking.price,
        bookingReference: bookingReference,
        gameCategory: gameCategory,
        location: `Gaming Zone ${apiBooking.gameId}`,
      }

      const qrResult = await generateBookingQRCode(bookingDataForQR)
      qrCodeDataURL = qrResult?.qrCodeDataURL
    } catch (error) {
      console.error("Error generating QR for existing booking:", error)
    }

    return {
      bookingId: apiBooking.bookingId,
      gameId: apiBooking.gameId,
      gameName: apiBooking.game?.title || "Unknown Game",
      gameIcon: style.icon,
      gameImage: apiBooking.game?.imageUrl
        ? `https://localhost:7186/uploads/${apiBooking.game.imageUrl}`
        : "/placeholder.svg?height=200&width=300",
      bookingDate: apiBooking.bookingDate?.split("T")[0] || new Date().toISOString().split("T")[0],
      startTime: apiBooking.startTime?.slice(0, 5) || "00:00",
      endTime: apiBooking.endTime?.slice(0, 5) || "01:00",
      price: apiBooking.price || 0,
      status: getBookingStatus(apiBooking.status),
      paymentStatus: "paid", // Assuming paid if booking exists
      bookingReference: bookingReference,
      qrCode: qrCodeDataURL || "/placeholder.svg?height=150&width=150",
      location: `Gaming Zone ${apiBooking.gameId}`, // Default location
      players: "1-6 players", // Default players
      specialRequests: "", // Not available in API
      createdAt: apiBooking.bookingDate || new Date().toISOString(),
      gradient: style.gradient,
      accentColor: style.accentColor,
      duration: calculateDuration(apiBooking.startTime, apiBooking.endTime),
      gameCategory: gameCategory,
      gameDescription: apiBooking.game?.description || "",
    }
  }

  // Fetch bookings from API
  const fetchBookings = async () => {
    if (!userId) {
      setError("User not logged in")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.get(`https://localhost:7186/api/TblBookings?userId=${userId}`)

      // Map bookings with QR code generation
      const mappedBookings = await Promise.all(response.data.map((booking) => mapApiBookingToComponent(booking)))

      setBookings(mappedBookings)
      setFilteredBookings(mappedBookings)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError("Failed to load bookings. Please try again later.")
      setBookings([])
      setFilteredBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [userId])

  useEffect(() => {
    filterBookings()
  }, [bookings, activeFilter, searchTerm, sortBy])

  const filterBookings = () => {
    let filtered = [...bookings]

    // Filter by status
    if (activeFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === activeFilter)
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.gameName.toLowerCase().includes(term) ||
          booking.bookingReference.toLowerCase().includes(term) ||
          booking.location.toLowerCase().includes(term) ||
          booking.gameCategory.toLowerCase().includes(term),
      )
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case "date-asc":
        filtered.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
        break
      case "date-desc":
        filtered.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      default:
        break
    }

    setFilteredBookings(filtered)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle className="status-icon confirmed" />
      case "pending":
        return <FaHourglass className="status-icon pending" />
      case "completed":
        return <FaCheck className="status-icon completed" />
      case "cancelled":
        return <FaTimesCircle className="status-icon cancelled" />
      default:
        return null
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "confirmed"
      case "pending":
        return "pending"
      case "completed":
        return "completed"
      case "cancelled":
        return "cancelled"
      default:
        return ""
    }
  }

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        // Update booking status to cancelled (status = 3)
        await axios.put(`https://localhost:7186/api/TblBookings/${bookingId}`, {
          status: 3,
        })

        // Update local state
        setBookings((prev) =>
          prev.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, status: "cancelled", paymentStatus: "refunded" } : booking,
          ),
        )

        toast.success("Booking cancelled successfully!")
      } catch (err) {
        console.error("Error cancelling booking:", err)
        toast.error("Failed to cancel booking. Please try again.")
      }
    }
  }

  const handleDownloadTicket = (booking) => {
    setTicketBooking(booking)
    setShowTicketPreview(true)
  }

  const handleConfirmDownload = async () => {
    if (!ticketBooking) return

    try {
      setDownloadingTicket(true)
      toast.loading("Generating your ticket PDF...")

      await generateTicketPDF(ticketBooking, userInfo)

      toast.dismiss()
      toast.success("Ticket downloaded successfully!")
      setShowTicketPreview(false)
      setTicketBooking(null)
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.dismiss()
      toast.error("Failed to generate ticket. Please try again.")
    } finally {
      setDownloadingTicket(false)
    }
  }

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }
    return stats
  }

  const stats = getBookingStats()

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="user-bookings-page">
          <div className="loading-container">
            <div className="loading-spinner">
              <FaSpinner className="spinner" />
            </div>
            <p>Loading your bookings...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="user-bookings-page">
          <div className="error-container">
            <div className="error-icon">
              <FaTimesCircle />
            </div>
            <h2>Error Loading Bookings</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchBookings}>
              Try Again
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

      <div className="user-bookings-page">
        {/* Background Effects */}
        <div className="bookings-bg-overlay"></div>
        <div className="bookings-bg-pattern"></div>
        <div className="bookings-floating-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="floating-orb orb-5"></div>
        </div>

        {/* Hero Section */}
        <section className="bookings-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <FaStar className="badge-icon" />
              <span>My Bookings</span>
            </div>
            <h1 className="hero-title">
              <span className="title-line-1">Welcome back,</span>
              <span className="title-line-2">{userName}!</span>
            </h1>
            <p className="hero-subtitle">
              Manage your gaming sessions, view booking details, and track your gaming history all in one place.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bookings-stats">
          <div className="stats-container">
            <div className="stat-card total">
              <div className="stat-icon">
                <FaTicketAlt />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
            </div>
            <div className="stat-card confirmed">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.confirmed}</div>
                <div className="stat-label">Confirmed</div>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">
                <FaCheck />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <FaHourglass />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="bookings-filters">
          <div className="filters-container">
            <div className="filters-header">
              <h2 className="filters-title">Your Gaming Sessions</h2>
              <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                <FaFilter />
                <span>Filters</span>
                {showFilters ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            <div className={`filters-content ${showFilters ? "show" : ""}`}>
              <div className="filter-group">
                <div className="filter-label">Status:</div>
                <div className="filter-options">
                  <button
                    className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                    onClick={() => setActiveFilter("all")}
                  >
                    All Bookings
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "confirmed" ? "active" : ""}`}
                    onClick={() => setActiveFilter("confirmed")}
                  >
                    <FaCheckCircle /> Confirmed
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "pending" ? "active" : ""}`}
                    onClick={() => setActiveFilter("pending")}
                  >
                    <FaHourglass /> Pending
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "completed" ? "active" : ""}`}
                    onClick={() => setActiveFilter("completed")}
                  >
                    <FaCheck /> Completed
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "cancelled" ? "active" : ""}`}
                    onClick={() => setActiveFilter("cancelled")}
                  >
                    <FaTimesCircle /> Cancelled
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-label">Sort by:</div>
                <div className="filter-options">
                  <button
                    className={`filter-btn ${sortBy === "newest" ? "active" : ""}`}
                    onClick={() => setSortBy("newest")}
                  >
                    <FaSort /> Newest First
                  </button>
                  <button
                    className={`filter-btn ${sortBy === "oldest" ? "active" : ""}`}
                    onClick={() => setSortBy("oldest")}
                  >
                    <FaSort /> Oldest First
                  </button>
                  <button
                    className={`filter-btn ${sortBy === "date-asc" ? "active" : ""}`}
                    onClick={() => setSortBy("date-asc")}
                  >
                    <FaCalendarAlt /> Date (Earliest)
                  </button>
                  <button
                    className={`filter-btn ${sortBy === "date-desc" ? "active" : ""}`}
                    onClick={() => setSortBy("date-desc")}
                  >
                    <FaCalendarAlt /> Date (Latest)
                  </button>
                  <button
                    className={`filter-btn ${sortBy === "price-high" ? "active" : ""}`}
                    onClick={() => setSortBy("price-high")}
                  >
                    <FaRupeeSign /> Price (High)
                  </button>
                  <button
                    className={`filter-btn ${sortBy === "price-low" ? "active" : ""}`}
                    onClick={() => setSortBy("price-low")}
                  >
                    <FaRupeeSign /> Price (Low)
                  </button>
                </div>
              </div>

              <div className="search-filter">
                <div className="search-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button className="clear-search" onClick={() => setSearchTerm("")}>
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings List */}
        <section className="bookings-list-section">
          <div className="bookings-container">
            {filteredBookings.length > 0 ? (
              <div className="bookings-grid">
                {filteredBookings.map((booking, index) => (
                  <div
                    key={booking.bookingId}
                    className={`booking-card ${getStatusClass(booking.status)}`}
                    style={{ "--accent-color": booking.accentColor, "--animation-delay": `${index * 0.1}s` }}
                  >
                    {/* Status Badge */}
                    <div className={`booking-status-badge ${getStatusClass(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="status-text">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    {/* Game Header */}
                    <div className="booking-header">
                      <div className="game-icon-wrapper">
                        <span className="game-emoji">{booking.gameIcon}</span>
                      </div>
                      <div className="game-info">
                        <h3 className="game-name">{booking.gameName}</h3>
                        <div className="booking-reference">#{booking.bookingReference}</div>
                      </div>
                    </div>

                    {/* Game Image */}
                    <div className="booking-image-container">
                      <img
                        src={booking.gameImage || "/placeholder.svg"}
                        alt={booking.gameName}
                        className="booking-image"
                      />
                      <div className={`image-overlay bg-gradient-to-br ${booking.gradient}`}></div>
                    </div>

                    {/* Booking Details */}
                    <div className="booking-content">
                      <div className="booking-details-grid">
                        <div className="detail-row">
                          <div className="detail-item">
                            <FaCalendarAlt className="detail-icon" />
                            <span className="detail-text">{formatDate(booking.bookingDate)}</span>
                          </div>
                        </div>

                        <div className="detail-row">
                          <div className="detail-item">
                            <FaClock className="detail-icon" />
                            <span className="detail-text">
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </span>
                          </div>
                        </div>

                        <div className="detail-row">
                          <div className="detail-item">
                            <FaMapMarkerAlt className="detail-icon" />
                            <span className="detail-text">{booking.location}</span>
                          </div>
                        </div>

                        <div className="detail-row">
                          <div className="detail-item">
                            <FaUsers className="detail-icon" />
                            <span className="detail-text">{booking.duration}</span>
                          </div>
                        </div>

                        <div className="detail-row price-row">
                          <div className="detail-item price-item">
                            <span className="detail-text price-text">₹{booking.price}</span>
                          </div>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="special-requests">
                          <div className="special-requests-label">Special Requests:</div>
                          <div className="special-requests-text">{booking.specialRequests}</div>
                        </div>
                      )}

                      <div className="booking-actions">
                        <button className="action-btn view-btn" onClick={() => handleViewDetails(booking)}>
                          <FaEye />
                          <span>View Details</span>
                        </button>

                        {booking.status === "confirmed" && (
                          <>
                            <button
                              className="action-btn download-btn"
                              onClick={() => handleDownloadTicket(booking)}
                              disabled={downloadingTicket}
                            >
                              {downloadingTicket ? <FaSpinner className="spinning" /> : <FaDownload />}
                              <span>Download Ticket</span>
                            </button>
                            <button
                              className="action-btn cancel-btn"
                              onClick={() => handleCancelBooking(booking.bookingId)}
                            >
                              <FaTimes />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}

                        {booking.status === "pending" && (
                          <button
                            className="action-btn cancel-btn"
                            onClick={() => handleCancelBooking(booking.bookingId)}
                          >
                            <FaTimes />
                            <span>Cancel</span>
                          </button>
                        )}

                        {booking.status === "completed" && (
                          <button
                            className="action-btn download-btn"
                            onClick={() => handleDownloadTicket(booking)}
                            disabled={downloadingTicket}
                          >
                            {downloadingTicket ? <FaSpinner className="spinning" /> : <FaDownload />}
                            <span>Download Receipt</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-bookings">
                <div className="no-bookings-icon">
                  <FaHistory />
                </div>
                <h3>No bookings found</h3>
                <p>
                  {activeFilter === "all"
                    ? "You haven't made any bookings yet. Start exploring our games!"
                    : `No ${activeFilter} bookings found. Try adjusting your filters.`}
                </p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setActiveFilter("all")
                    setSortBy("newest")
                    setSearchTerm("")
                  }}
                >
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Booking Details Modal */}
        {showModal && selectedBooking && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Booking Details</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-content">
                <div className="modal-game-info">
                  <div className="modal-game-icon">
                    <span>{selectedBooking.gameIcon}</span>
                  </div>
                  <div className="modal-game-details">
                    <h3>{selectedBooking.gameName}</h3>
                    <div className="modal-reference">#{selectedBooking.bookingReference}</div>
                  </div>
                  <div className={`modal-status ${getStatusClass(selectedBooking.status)}`}>
                    {getStatusIcon(selectedBooking.status)}
                    <span>{selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}</span>
                  </div>
                </div>

                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <div className="detail-label">
                      <FaCalendarAlt />
                      <span>Date</span>
                    </div>
                    <div className="detail-value">{formatDate(selectedBooking.bookingDate)}</div>
                  </div>
                  <div className="modal-detail-item">
                    <div className="detail-label">
                      <FaClock />
                      <span>Time</span>
                    </div>
                    <div className="detail-value">
                      {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                    </div>
                  </div>
                  <div className="modal-detail-item">
                    <div className="detail-label">
                      <FaMapMarkerAlt />
                      <span>Location</span>
                    </div>
                    <div className="detail-value">{selectedBooking.location}</div>
                  </div>
                  <div className="modal-detail-item">
                    <div className="detail-label">
                      <FaUsers />
                      <span>Duration</span>
                    </div>
                    <div className="detail-value">{selectedBooking.duration}</div>
                  </div>
                  <div className="modal-detail-item">
                    <div className="detail-label">
                      <FaRupeeSign />
                      <span>Price</span>
                    </div>
                    <div className="detail-value">₹{selectedBooking.price}</div>
                  </div>
                  <div className="modal-detail-item">
                    <div className="detail-label">
                      <FaCheck />
                      <span>Payment</span>
                    </div>
                    <div className="detail-value">{selectedBooking.paymentStatus}</div>
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div className="modal-special-requests">
                    <h4>Special Requests</h4>
                    <p>{selectedBooking.specialRequests}</p>
                  </div>
                )}

                <div className="modal-qr-section">
                  <h4>
                    <FaQrcode className="qr-modal-icon" />
                    QR Code
                  </h4>
                  <div className="qr-code-container">
                    <img src={selectedBooking.qrCode || "/placeholder.svg"} alt="QR Code" className="qr-code" />
                    <p>Show this QR code at the venue</p>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="modal-action-btn share-btn">
                    <FaShare />
                    <span>Share</span>
                  </button>
                  <button className="modal-action-btn print-btn">
                    <FaPrint />
                    <span>Print</span>
                  </button>
                  <button
                    className="modal-action-btn download-btn"
                    onClick={() => handleDownloadTicket(selectedBooking)}
                    disabled={downloadingTicket}
                  >
                    {downloadingTicket ? <FaSpinner className="spinning" /> : <FaDownload />}
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Preview Modal */}
        {showTicketPreview && ticketBooking && (
          <TicketPreview
            booking={ticketBooking}
            userInfo={userInfo}
            onClose={() => {
              setShowTicketPreview(false)
              setTicketBooking(null)
            }}
            onDownload={handleConfirmDownload}
          />
        )}
      </div>
    </>
  )
}

export default UserBookingsPage
