"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { getUserInfo } from "../../auth/JwtUtils"
import {
  FaGamepad,
  FaPlay,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaSync,
  FaTags,
  FaGift,
  FaStar,
  FaTicketAlt,
  FaCheckCircle as FaCheckSolid,
} from "react-icons/fa"
import "./GameRunningStatus.css"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import { Toaster } from "react-hot-toast"

const GameRunningStatusWithOffers = () => {
  const [runningGames, setRunningGames] = useState([])
  const [upcomingGames, setUpcomingGames] = useState([])
  const [completedGames, setCompletedGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTab, setSelectedTab] = useState("running")
  const [refreshing, setRefreshing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [offerStats, setOfferStats] = useState({
    totalWithOffers: 0,
    totalSavings: 0,
    averageDiscount: 0,
  })

  const userInfo = getUserInfo()
  const ownerId = userInfo?.UserId || ""

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Auto-refresh data every 2 minutes
  useEffect(() => {
    const autoRefresh = setInterval(() => {
      fetchGameStatus()
    }, 120000)
    return () => clearInterval(autoRefresh)
  }, [])

  const fetchGameStatus = async () => {
    if (!ownerId) return

    try {
      setLoading(true)
      setError(null)

      // Fetch owner's games
      const gamesResponse = await axios.get(`https://localhost:7186/api/TblGames/ByUser/${ownerId}`)
      const ownerGames = gamesResponse.data

      if (!ownerGames || ownerGames.length === 0) {
        setRunningGames([])
        setUpcomingGames([])
        setCompletedGames([])
        setLoading(false)
        return
      }

      // Fetch all bookings with offer information
      const bookingsResponse = await axios.get("https://localhost:7186/api/TblBookings")
      const allBookings = bookingsResponse.data

      // Fetch offers data for reference
      const offersResponse = await axios.get("https://localhost:7186/api/TblOffers")
      const allOffers = offersResponse.data

      // Filter bookings for owner's games
      const ownerGameIds = ownerGames.map((game) => game.gameId)
      const ownerBookings = allBookings.filter((booking) => ownerGameIds.includes(booking.gameId))

      // Fetch user details for bookings
      const usersResponse = await axios.get("https://localhost:7186/api/TblUsers")
      const users = usersResponse.data

      // Process bookings with game, user, and offer details
      const processedBookings = ownerBookings.map((booking) => {
        const game = ownerGames.find((g) => g.gameId === booking.gameId)
        const user = users.find((u) => u.userId === booking.userId)
        const appliedOffer = booking.appliedOfferId
          ? allOffers.find((offer) => offer.offerId === booking.appliedOfferId)
          : null

        const bookingDate = new Date(booking.bookingDate)
        const startTime = new Date(`${booking.bookingDate.split("T")[0]}T${booking.startTime}`)
        const endTime = new Date(`${booking.bookingDate.split("T")[0]}T${booking.endTime}`)

        const now = new Date()
        const isToday = bookingDate.toDateString() === now.toDateString()

        let status = "upcoming"
        if (isToday && now >= startTime && now <= endTime) {
          status = "running"
        } else if (now > endTime) {
          status = "completed"
        }

        return {
          ...booking,
          game: game || { title: "Unknown Game", category: "Unknown" },
          user: user || { userName: "Unknown User", email: "unknown@email.com" },
          appliedOffer,
          startTime,
          endTime,
          bookingDate,
          status,
          duration: calculateDuration(booking.startTime, booking.endTime),
          timeRemaining: status === "running" ? calculateTimeRemaining(endTime, now) : null,
          timeUntilStart: status === "upcoming" ? calculateTimeUntilStart(startTime, now) : null,
          hasOfferApplied: booking.hasOfferApplied || false,
          discountAmount: booking.discountAmount || 0,
          originalPrice: booking.originalPrice || booking.price,
          offerCode: booking.offerCode || null,
        }
      })

      // Calculate offer statistics
      const bookingsWithOffers = processedBookings.filter((b) => b.hasOfferApplied)
      const totalSavings = bookingsWithOffers.reduce((sum, b) => sum + (b.discountAmount || 0), 0)
      const averageDiscount = bookingsWithOffers.length > 0 ? totalSavings / bookingsWithOffers.length : 0

      setOfferStats({
        totalWithOffers: bookingsWithOffers.length,
        totalSavings,
        averageDiscount,
      })

      // Categorize bookings
      const running = processedBookings.filter((b) => b.status === "running")
      const upcoming = processedBookings
        .filter((b) => b.status === "upcoming")
        .sort((a, b) => a.startTime - b.startTime)
      const completed = processedBookings
        .filter((b) => b.status === "completed")
        .sort((a, b) => b.endTime - a.endTime)
        .slice(0, 10)

      setRunningGames(running)
      setUpcomingGames(upcoming)
      setCompletedGames(completed)
    } catch (err) {
      console.error("Error fetching game status:", err)
      setError("Failed to load game status. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diffMs = end - start
    const diffHours = diffMs / (1000 * 60 * 60)

    const hours = Math.floor(diffHours)
    const minutes = Math.round((diffHours - hours) * 60)

    if (hours === 0) {
      return `${minutes}m`
    } else if (minutes === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${minutes}m`
    }
  }

  const calculateTimeRemaining = (endTime, currentTime) => {
    const diffMs = endTime - currentTime
    if (diffMs <= 0) return "Ended"

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (hours === 0) {
      return `${minutes}m left`
    } else {
      return `${hours}h ${minutes}m left`
    }
  }

  const calculateTimeUntilStart = (startTime, currentTime) => {
    const diffMs = startTime - currentTime
    if (diffMs <= 0) return "Starting now"

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `in ${days}d ${hours}h`
    } else if (hours > 0) {
      return `in ${hours}h ${minutes}m`
    } else {
      return `in ${minutes}m`
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchGameStatus()
  }

  useEffect(() => {
    if (ownerId) {
      fetchGameStatus()
    }
  }, [ownerId])

  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return <FaPlay className="status-icon running" />
      case "upcoming":
        return <FaClock className="status-icon upcoming" />
      case "completed":
        return <FaCheckCircle className="status-icon completed" />
      default:
        return <FaGamepad className="status-icon" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "running":
        return <span className="status-badge running">Live</span>
      case "upcoming":
        return <span className="status-badge upcoming">Scheduled</span>
      case "completed":
        return <span className="status-badge completed">Completed</span>
      default:
        return <span className="status-badge">Unknown</span>
    }
  }

  const renderOfferInfo = (booking) => {
    if (!booking.hasOfferApplied) {
      return (
        <div className="no-offer-info">
          <div className="info-row">
            <FaMoneyBillWave className="info-icon" />
            <span className="regular-price">₹{booking.price}</span>
            <span className="no-offer-label">No Offer Applied</span>
          </div>
        </div>
      )
    }

    return (
      <div className="offer-info">
        <div className="offer-header">
          <FaStar className="offer-star" />
          <span className="offer-applied-label">Offer Applied!</span>
        </div>

        <div className="pricing-breakdown">
          <div className="price-row">
            <FaMoneyBillWave className="info-icon" />
            <div className="price-details">
              <span className="final-price">₹{booking.price}</span>
              <span className="original-price">₹{booking.originalPrice}</span>
              <span className="savings-badge">Save ₹{booking.discountAmount}</span>
            </div>
          </div>
        </div>

        {booking.offerCode && (
          <div className="offer-code-info">
            <FaTicketAlt className="code-icon" />
            <span className="offer-code">{booking.offerCode}</span>
          </div>
        )}

        {booking.appliedOffer && (
          <div className="offer-details">
            <FaGift className="offer-icon" />
            <div className="offer-text">
              <span className="offer-title">{booking.appliedOffer.title}</span>
              <span className="offer-discount">
                {booking.appliedOffer.discountType === "percentage"
                  ? `${booking.appliedOffer.discountValue}% OFF`
                  : `₹${booking.appliedOffer.discountValue} OFF`}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderGameCard = (booking) => (
    <div
      key={booking.bookingId}
      className={`game-status-card ${booking.status} ${booking.hasOfferApplied ? "with-offer" : "no-offer"}`}
    >
      {booking.hasOfferApplied && (
        <div className="offer-indicator">
          <FaCheckSolid className="check-icon" />
          <span>Offer Used</span>
        </div>
      )}

      <div className="card-header">
        <div className="game-info">
          {getStatusIcon(booking.status)}
          <div className="game-details">
            <h4 className="game-title">{booking.game.title}</h4>
            <span className="game-category">{booking.game.category}</span>
          </div>
        </div>
        <div className="header-badges">{getStatusBadge(booking.status)}</div>
      </div>

      <div className="card-content">
        <div className="booking-info">
          <div className="info-row">
            <FaUser className="info-icon" />
            <span>{booking.user.userName}</span>
          </div>
          <div className="info-row">
            <FaCalendarAlt className="info-icon" />
            <span>{formatDate(booking.bookingDate)}</span>
          </div>
          <div className="info-row">
            <FaClock className="info-icon" />
            <span>
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </span>
          </div>
        </div>

        {renderOfferInfo(booking)}

        {booking.status === "running" && booking.timeRemaining && (
          <div className="time-remaining">
            <FaExclamationTriangle className="warning-icon" />
            <span>{booking.timeRemaining}</span>
          </div>
        )}

        {booking.status === "upcoming" && booking.timeUntilStart && (
          <div className="time-until-start">
            <FaClock className="clock-icon" />
            <span>Starts {booking.timeUntilStart}</span>
          </div>
        )}

        <div className="duration-info">
          <span className="duration">Duration: {booking.duration}</span>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="game-status-container">
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading game status...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="game-status-container">
        <div className="error-container">
          <FaTimesCircle className="error-icon" />
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchGameStatus}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false)
    }
  }

  // Calculate offer statistics for each tab
  const getTabOfferStats = (games) => {
    const withOffers = games.filter((g) => g.hasOfferApplied).length
    const withoutOffers = games.length - withOffers
    return { withOffers, withoutOffers }
  }

  const runningStats = getTabOfferStats(runningGames)
  const upcomingStats = getTabOfferStats(upcomingGames)
  const completedStats = getTabOfferStats(completedGames)

  return (
    <div className="gamezone-layout">
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

      <div className="layout-background">
        <div className="grid-overlay"></div>
        <div className="floating-particles">
          <div className="particle particle-0"></div>
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <div className={`main-content ${sidebarOpen && window.innerWidth >= 992 ? "sidebar-open" : "sidebar-closed"}`}>
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <main className="content-area">
          <div className="content-wrapper">
            <div className="status-header">
              <h2 className="status-title">Game Running Status</h2>
              <div className="header-actions">
                <div className="offer-summary">
                  <FaTags className="summary-icon" />
                  <div className="summary-text">
                    <span className="offer-count">{offerStats.totalWithOffers} Bookings with Offers</span>
                    <span className="total-savings">₹{offerStats.totalSavings.toFixed(2)} Total Savings</span>
                  </div>
                </div>
                <span className="last-updated">Last updated: {currentTime.toLocaleTimeString()}</span>
                <button
                  className={`refresh-btn ${refreshing ? "refreshing" : ""}`}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <FaSync className={refreshing ? "spinning" : ""} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="status-tabs">
              <button
                className={`tab-btn ${selectedTab === "running" ? "active" : ""}`}
                onClick={() => setSelectedTab("running")}
              >
                <div className="tab-content">
                  <div className="tab-main">
                    <FaPlay className="tab-icon" />
                    <span>Running ({runningGames.length})</span>
                  </div>
                  <div className="tab-offer-stats">
                    <span className="with-offers">{runningStats.withOffers} with offers</span>
                    <span className="without-offers">{runningStats.withoutOffers} regular</span>
                  </div>
                </div>
              </button>
              <button
                className={`tab-btn ${selectedTab === "upcoming" ? "active" : ""}`}
                onClick={() => setSelectedTab("upcoming")}
              >
                <div className="tab-content">
                  <div className="tab-main">
                    <FaClock className="tab-icon" />
                    <span>Upcoming ({upcomingGames.length})</span>
                  </div>
                  <div className="tab-offer-stats">
                    <span className="with-offers">{upcomingStats.withOffers} with offers</span>
                    <span className="without-offers">{upcomingStats.withoutOffers} regular</span>
                  </div>
                </div>
              </button>
              <button
                className={`tab-btn ${selectedTab === "completed" ? "active" : ""}`}
                onClick={() => setSelectedTab("completed")}
              >
                <div className="tab-content">
                  <div className="tab-main">
                    <FaCheckCircle className="tab-icon" />
                    <span>Completed ({completedGames.length})</span>
                  </div>
                  <div className="tab-offer-stats">
                    <span className="with-offers">{completedStats.withOffers} with offers</span>
                    <span className="without-offers">{completedStats.withoutOffers} regular</span>
                  </div>
                </div>
              </button>
            </div>

            <div className="status-content">
              {selectedTab === "running" && (
                <div className="games-grid">
                  {runningGames.length > 0 ? (
                    runningGames.map(renderGameCard)
                  ) : (
                    <div className="empty-state">
                      <FaPlay className="empty-icon" />
                      <h3>No games currently running</h3>
                      <p>Games will appear here when they are actively being played.</p>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === "upcoming" && (
                <div className="games-grid">
                  {upcomingGames.length > 0 ? (
                    upcomingGames.map(renderGameCard)
                  ) : (
                    <div className="empty-state">
                      <FaClock className="empty-icon" />
                      <h3>No upcoming bookings</h3>
                      <p>Scheduled games will appear here.</p>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === "completed" && (
                <div className="games-grid">
                  {completedGames.length > 0 ? (
                    completedGames.map(renderGameCard)
                  ) : (
                    <div className="empty-state">
                      <FaCheckCircle className="empty-icon" />
                      <h3>No completed games</h3>
                      <p>Recently completed games will appear here.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="status-summary">
              <div className="summary-card">
                <div className="summary-icon running">
                  <FaPlay />
                </div>
                <div className="summary-info">
                  <span className="summary-number">{runningGames.length}</span>
                  <span className="summary-label">Currently Running</span>
                  <div className="summary-breakdown">
                    <span className="with-offers-count">{runningStats.withOffers} with offers</span>
                    <span className="regular-count">{runningStats.withoutOffers} regular</span>
                  </div>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon upcoming">
                  <FaClock />
                </div>
                <div className="summary-info">
                  <span className="summary-number">{upcomingGames.length}</span>
                  <span className="summary-label">Upcoming</span>
                  <div className="summary-breakdown">
                    <span className="with-offers-count">{upcomingStats.withOffers} with offers</span>
                    <span className="regular-count">{upcomingStats.withoutOffers} regular</span>
                  </div>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon completed">
                  <FaCheckCircle />
                </div>
                <div className="summary-info">
                  <span className="summary-number">{completedGames.length}</span>
                  <span className="summary-label">Completed</span>
                  <div className="summary-breakdown">
                    <span className="with-offers-count">{completedStats.withOffers} with offers</span>
                    <span className="regular-count">{completedStats.withoutOffers} regular</span>
                  </div>
                </div>
              </div>
              <div className="summary-card offer-stats-card">
                <div className="summary-icon offer-stats">
                  <FaTags />
                </div>
                <div className="summary-info">
                  <span className="summary-number">₹{offerStats.totalSavings.toFixed(0)}</span>
                  <span className="summary-label">Total Customer Savings</span>
                  <div className="summary-breakdown">
                    <span className="avg-discount">Avg: ₹{offerStats.averageDiscount.toFixed(0)} per booking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default GameRunningStatusWithOffers
