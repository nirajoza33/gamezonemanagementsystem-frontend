"use client"

import "../css/MyOffersPage.css"
import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import { getUserInfo } from "../auth/JwtUtils"
import { Toaster } from "react-hot-toast"
import {
  FaGift,
  FaPercent,
  FaStar,
  FaClock,
  FaGamepad,
  FaRocket,
  FaMagic,
  FaSpinner,
  FaExclamationTriangle,
  FaCheck,
  FaTicketAlt,
  FaArrowLeft,
  FaCalendarAlt,
  FaClipboard,
  FaShoppingCart,
} from "react-icons/fa"

const MyOffersPage = () => {
  const navigate = useNavigate()
  const userInfo = getUserInfo()
  const userId = userInfo?.UserId || null

  const [claimedOffers, setClaimedOffers] = useState([])
  const [activeTab, setActiveTab] = useState("active") // active, used, expired
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const apiBase = "https://localhost:7186/api"

  // Fetch user's claimed offers
  const fetchUserClaimedOffers = async () => {
    if (!userId) {
      navigate("/login", { state: { from: "/my-offers" } })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${apiBase}/TblClaimedOffers/ByUser/${userId}`)

      if (response.data && Array.isArray(response.data)) {
        const now = new Date()

        // Process and categorize offers
        const offers = response.data.map((offer) => ({
          ...offer,
          isExpired: new Date(offer.validUntil) < now,
        }))

        setClaimedOffers(offers)
      }
    } catch (err) {
      console.error("Failed to fetch claimed offers:", err)
      setError("Failed to load your claimed offers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserClaimedOffers()
  }, [userId])

  const getFilteredOffers = () => {
    const now = new Date()

    switch (activeTab) {
      case "active":
        return claimedOffers.filter((offer) => !offer.isUsed && !offer.isExpired && offer.isActive)
      case "used":
        return claimedOffers.filter((offer) => offer.isUsed)
      case "expired":
        return claimedOffers.filter((offer) => offer.isExpired || !offer.isActive)
      default:
        return claimedOffers
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const bookWithOffer = (offer) => {
    // Navigate to booking page with offer details including category for validation
    navigate("/booking", {
      state: {
        useOffer: true,
        offerId: offer.offerId,
        claimedOfferId: offer.claimedOfferId,
        offerCategory: offer.category,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        applicableGames: offer.gamesIncluded || [],
      },
    })
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="offers-page">
          <div className="offers-loading">
            <div className="loading-container">
              <FaSpinner className="loading-spinner" />
              <h2>Loading Your Offers...</h2>
              <p>Please wait while we fetch your claimed offers</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="offers-page">
          <div className="offers-error">
            <div className="error-container">
              <FaExclamationTriangle className="error-icon" />
              <h2>Oops! Something went wrong</h2>
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchUserClaimedOffers}>
                <FaRocket className="btn-icon" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Not logged in
  if (!userId) {
    return (
      <>
        <Navbar />
        <div className="offers-page">
          <div className="offers-error">
            <div className="error-container">
              <FaExclamationTriangle className="error-icon" />
              <h2>Login Required</h2>
              <p>Please login to view your claimed offers</p>
              <button className="retry-btn" onClick={() => navigate("/login", { state: { from: "/my-offers" } })}>
                Login Now
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const filteredOffers = getFilteredOffers()

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

      <div className="offers-page my-offers-page">
        {/* Background Effects */}
        <div className="offers-bg-overlay"></div>
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        {/* Back Button */}
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate("/offers")}>
            <FaArrowLeft /> Back to Offers
          </button>
        </div>

        {/* Hero Section */}
        <section className="offers-hero my-offers-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <FaClipboard />
              <span>My Claimed Offers</span>
            </div>
            <h1 className="hero-title">
              <span className="title-gradient">Your Exclusive</span>
              <br />
              <span className="title-gradient">Gaming Deals</span>
            </h1>
            <p className="hero-subtitle">
              Manage your claimed offers and use them to get amazing discounts on your favorite games!
            </p>
          </div>
        </section>

        {/* Tabs */}
        <div className="offers-tabs">
          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              <FaTicketAlt className="tab-icon" />
              <span>Active Offers</span>
              <span className="tab-count">
                {claimedOffers.filter((o) => !o.isUsed && !o.isExpired && o.isActive).length}
              </span>
            </button>
            <button
              className={`tab-button ${activeTab === "used" ? "active" : ""}`}
              onClick={() => setActiveTab("used")}
            >
              <FaCheck className="tab-icon" />
              <span>Used Offers</span>
              <span className="tab-count">{claimedOffers.filter((o) => o.isUsed).length}</span>
            </button>
            <button
              className={`tab-button ${activeTab === "expired" ? "active" : ""}`}
              onClick={() => setActiveTab("expired")}
            >
              <FaClock className="tab-icon" />
              <span>Expired Offers</span>
              <span className="tab-count">{claimedOffers.filter((o) => o.isExpired || !o.isActive).length}</span>
            </button>
          </div>
        </div>

        {/* Offers Grid */}
        <section className="offers-grid-section">
          <div className="offers-container">
            <div className="offers-header">
              <h2 className="section-title">
                <span className="title-highlight">{filteredOffers.length}</span>{" "}
                {activeTab === "active" ? "Active" : activeTab === "used" ? "Used" : "Expired"} Offer
                {filteredOffers.length !== 1 ? "s" : ""}
              </h2>
            </div>

            <div className="offers-grid">
              {filteredOffers.map((offer, index) => (
                <div
                  key={offer.claimedOfferId}
                  className={`offer-card claimed-offer ${offer.isUsed ? "used" : ""} ${offer.isExpired ? "expired" : ""}`}
                  style={{ "--animation-delay": `${index * 0.1}s` }}
                >
                  {/* Status Badges */}
                  <div className="status-badges">
                    {offer.isUsed && (
                      <div className="used-badge">
                        <FaCheck />
                        <span>Used</span>
                      </div>
                    )}
                    {offer.isExpired && (
                      <div className="expired-badge">
                        <FaClock />
                        <span>Expired</span>
                      </div>
                    )}
                    {!offer.isUsed && !offer.isExpired && (
                      <div className="active-badge">
                        <FaStar />
                        <span>Active</span>
                      </div>
                    )}
                  </div>

                  {/* Offer Code Badge */}
                  <div className="offer-code-badge">
                    <span className="offer-code-label">CODE:</span>
                    <span className="offer-code">{offer.offerCode}</span>
                  </div>

                  {/* Enhanced Card Content */}
                  <div className="offer-card-content">
                    <h3 className="offer-title">{offer.offerTitle}</h3>
                    <p className="offer-description">{offer.description}</p>

                    {/* Dates */}
                    <div className="offer-dates">
                      <div className="offer-date">
                        <FaCalendarAlt className="date-icon" />
                        <span className="date-label">Claimed:</span>
                        <span className="date-value">{formatDate(offer.claimedDate)}</span>
                      </div>
                      <div className="offer-date">
                        <FaClock className="date-icon" />
                        <span className="date-label">Valid Until:</span>
                        <span className="date-value">{formatDate(offer.validUntil)}</span>
                      </div>
                      {offer.isUsed && (
                        <div className="offer-date">
                          <FaCheck className="date-icon" />
                          <span className="date-label">Used On:</span>
                          <span className="date-value">{formatDate(offer.usedDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* Discount Details */}
                    <div className="discount-details">
                      <div className="discount-type">
                        <FaPercent className="discount-icon" />
                        <span className="discount-label">Discount:</span>
                        <span className="discount-value">
                          {offer.discountType === "percentage"
                            ? `${offer.discountValue}% Off`
                            : `₹${offer.discountValue} Off`}
                        </span>
                      </div>
                      <div className="offer-category">
                        <span className="category-label">Category:</span>
                        <span className="category-value">{offer.category}</span>
                      </div>
                    </div>

                    {/* Games Included */}
                    {offer.gamesIncluded && offer.gamesIncluded.length > 0 && (
                      <div className="games-included">
                        <h4 className="games-title">
                          <FaGamepad className="games-icon" />
                          Applicable Games:
                        </h4>
                        <div className="games-list">
                          {offer.gamesIncluded.slice(0, 3).map((game, gameIndex) => (
                            <span key={`${offer.claimedOfferId}-${gameIndex}`} className="game-tag">
                              <FaMagic className="tag-icon" />
                              {game}
                            </span>
                          ))}
                          {offer.gamesIncluded.length > 3 && (
                            <span className="more-games">+{offer.gamesIncluded.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="offer-footer">
                      {!offer.isUsed && !offer.isExpired ? (
                        <button className="use-offer-btn" onClick={() => bookWithOffer(offer)}>
                          <FaShoppingCart className="btn-icon" />
                          <span>Book with this Offer</span>
                        </button>
                      ) : offer.isUsed ? (
                        <div className="offer-used-message">
                          <FaCheck className="used-icon" />
                          <span>This offer has been used</span>
                        </div>
                      ) : (
                        <div className="offer-expired-message">
                          <FaClock className="expired-icon" />
                          <span>This offer has expired</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOffers.length === 0 && (
              <div className="no-offers">
                <div className="no-offers-icon">
                  <FaGift />
                </div>
                <h3>No {activeTab === "active" ? "active" : activeTab === "used" ? "used" : "expired"} offers found</h3>
                <p>
                  {activeTab === "active"
                    ? "You don't have any active offers. Claim some offers to see them here!"
                    : activeTab === "used"
                      ? "You haven't used any offers yet."
                      : "You don't have any expired offers."}
                </p>
                <button className="reset-filters-btn" onClick={() => navigate("/offers")}>
                  <span>Browse Available Offers</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default MyOffersPage
