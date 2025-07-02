"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import "../css/GameDetailsPopup.css"
import { getUserInfo } from "../auth/JwtUtils"
import {
  FaTimes,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUsers,
  FaClock,
  FaCalendarAlt,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaComment,
  FaThumbsUp,
  FaCheck,
  FaSpinner,
  FaFire,
  FaTrophy,
  FaBolt,
  FaMagic,
  FaGamepad,
  FaSmile,
  FaMeh,
  FaFrown,
  FaPaperPlane,
  FaChevronUp,
  FaReply,
  FaFilter,
} from "react-icons/fa"

const GameDetailsPopup = ({ isOpen, onClose, game, onBookNow, onToggleFavorite, isFavorite }) => {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: [0, 0, 0, 0, 0],
  })
  const [isAnimating, setIsAnimating] = useState(false)

  // Review interaction states
  const [likedReviews, setLikedReviews] = useState(new Set())
  const [expandedReplies, setExpandedReplies] = useState(new Set())
  const [replyTexts, setReplyTexts] = useState({})
  const [submittingReply, setSubmittingReply] = useState(new Set())
  const [reviewReplies, setReviewReplies] = useState({})
  const [likingReviews, setLikingReviews] = useState(new Set())

  // Review filtering and sorting
  const [reviewFilter, setReviewFilter] = useState("all")
  const [reviewSort, setReviewSort] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const userInfo = getUserInfo()
  const userId = userInfo?.UserId || ""

  useEffect(() => {
    if (isOpen && game) {
      setIsAnimating(true)
      fetchGameReviews()
      // Prevent body scroll when popup is open
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, game])

  useEffect(() => {
    filterAndSortReviews()
  }, [reviewFilter, reviewSort, reviews])

  const fetchGameReviews = async () => {
    if (!game?.gameId) return

    try {
      setLoading(true)
      // Use the specific endpoint for game reviews
      const response = await axios.get(`https://localhost:7186/api/TblReviews/game/${game.gameId}`)

      console.log("=== GAME REVIEWS API RESPONSE ===")
      console.log("Game ID:", game.gameId)
      console.log("Response data:", response.data)

      // Transform the reviews data
      const gameSpecificReviews = response.data.map((review) => ({
        id: review.reviewId,
        reviewId: review.reviewId,
        userName: review.userName,
        userImage: review.userImage || "/placeholder.svg?height=80&width=80",
        rating: review.rating,
        date: review.createdDate,
        createdDate: review.createdDate,
        title: review.title,
        comment: review.reviewText,
        reviewText: review.reviewText,
        game: review.gameTitle,
        likes: review.likes,
        replies: review.replies,
        verified: review.verified,
        sentiment: review.sentiment,
        images: (() => {
          try {
            if (!review.imageUrls || review.imageUrls === null || review.imageUrls === undefined) {
              return []
            }

            if (typeof review.imageUrls === "string" && review.imageUrls.trim() === "") {
              return []
            }

            if (Array.isArray(review.imageUrls)) {
              return review.imageUrls.filter((img) => img && typeof img === "string" && img.trim() !== "")
            }

            if (typeof review.imageUrls === "string") {
              const parsed = JSON.parse(review.imageUrls)
              if (Array.isArray(parsed)) {
                return parsed.filter((img) => img && typeof img === "string" && img.trim() !== "")
              }
            }

            return []
          } catch (error) {
            console.error("Error parsing imageUrls for review:", review.reviewId, error)
            return []
          }
        })(),
      }))

      console.log("Transformed reviews:", gameSpecificReviews)
      setReviews(gameSpecificReviews)

      // Calculate review statistics
      if (gameSpecificReviews.length > 0) {
        const totalReviews = gameSpecificReviews.length
        const averageRating = gameSpecificReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        const ratingCounts = [0, 0, 0, 0, 0]

        gameSpecificReviews.forEach((review) => {
          ratingCounts[review.rating - 1]++
        })

        setReviewStats({
          averageRating,
          totalReviews,
          ratingCounts,
        })
      } else {
        setReviewStats({
          averageRating: 0,
          totalReviews: 0,
          ratingCounts: [0, 0, 0, 0, 0],
        })
      }

      // Check user likes for these reviews
      if (userId && gameSpecificReviews.length > 0) {
        checkUserLikes(gameSpecificReviews)
      }
    } catch (error) {
      console.error("Error fetching game reviews:", error)
      console.error("Game ID that failed:", game?.gameId)
      setReviews([])
      setFilteredReviews([])
    } finally {
      setLoading(false)
    }
  }

  // Check which reviews the user has liked
  const checkUserLikes = async (reviewsToCheck) => {
    if (!userId || reviewsToCheck.length === 0) return

    try {
      const likeChecks = await Promise.all(
        reviewsToCheck.map(async (review) => {
          try {
            const response = await axios.get(`https://localhost:7186/api/TblReviews/${review.id}/likes/check/${userId}`)
            return { reviewId: review.id, hasLiked: response.data.hasLiked }
          } catch (error) {
            console.error(`Error checking like for review ${review.id}:`, error)
            return { reviewId: review.id, hasLiked: false }
          }
        }),
      )

      const likedSet = new Set()
      likeChecks.forEach(({ reviewId, hasLiked }) => {
        if (hasLiked) {
          likedSet.add(reviewId)
        }
      })
      setLikedReviews(likedSet)
    } catch (error) {
      console.error("Error checking user likes:", error)
    }
  }

  // Filter and sort reviews
  const filterAndSortReviews = () => {
    let filtered = [...reviews]

    // Filter by rating
    if (reviewFilter !== "all") {
      if (reviewFilter === "positive") {
        filtered = filtered.filter((review) => review.rating >= 4)
      } else if (reviewFilter === "neutral") {
        filtered = filtered.filter((review) => review.rating === 3)
      } else if (reviewFilter === "negative") {
        filtered = filtered.filter((review) => review.rating <= 2)
      } else {
        const ratingFilter = Number.parseInt(reviewFilter)
        filtered = filtered.filter((review) => review.rating === ratingFilter)
      }
    }

    // Sort reviews
    if (reviewSort === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (reviewSort === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (reviewSort === "highest") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (reviewSort === "lowest") {
      filtered.sort((a, b) => a.rating - b.rating)
    } else if (reviewSort === "mostLiked") {
      filtered.sort((a, b) => b.likes - a.likes)
    }

    setFilteredReviews(filtered)
  }

  // Handle like/unlike review
  const handleLikeReview = async (reviewId) => {
    if (!userId) {
      alert("Please log in to like reviews")
      return
    }

    if (likingReviews.has(reviewId)) {
      return // Prevent multiple simultaneous requests
    }

    try {
      setLikingReviews((prev) => new Set([...prev, reviewId]))

      const isLiked = likedReviews.has(reviewId)

      if (isLiked) {
        // Unlike the review
        await axios.delete(`https://localhost:7186/api/TblReviews/${reviewId}/like`, {
          data: { userId: Number.parseInt(userId) },
          headers: {
            "Content-Type": "application/json",
          },
        })
        setLikedReviews((prev) => {
          const newSet = new Set(prev)
          newSet.delete(reviewId)
          return newSet
        })
      } else {
        // Like the review
        await axios.post(`https://localhost:7186/api/TblReviews/${reviewId}/like`, {
          userId: Number.parseInt(userId),
        })
        setLikedReviews((prev) => new Set([...prev, reviewId]))
      }

      // Update the review likes count in the local state
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, likes: isLiked ? review.likes - 1 : review.likes + 1 } : review,
        ),
      )
    } catch (error) {
      console.error("Error liking review:", error)
      alert("Failed to update like status")
    } finally {
      setLikingReviews((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    }
  }

  // Fetch replies for a specific review
  const fetchReplies = async (reviewId) => {
    try {
      const response = await axios.get(`https://localhost:7186/api/TblReviews/${reviewId}/replies`)
      setReviewReplies((prev) => ({
        ...prev,
        [reviewId]: response.data,
      }))
    } catch (error) {
      console.error("Error fetching replies:", error)
      setReviewReplies((prev) => ({
        ...prev,
        [reviewId]: [],
      }))
    }
  }

  // Handle reply submission
  const handleSubmitReply = async (reviewId) => {
    if (!userId) {
      alert("Please log in to reply to reviews")
      return
    }

    const replyText = replyTexts[reviewId]?.trim()
    if (!replyText) {
      alert("Please enter a reply message")
      return
    }

    try {
      setSubmittingReply((prev) => new Set([...prev, reviewId]))

      const replyData = {
        userId: Number.parseInt(userId),
        replyText: replyText,
      }

      await axios.post(`https://localhost:7186/api/TblReviews/${reviewId}/reply`, replyData)

      // Clear the reply text
      setReplyTexts((prev) => ({
        ...prev,
        [reviewId]: "",
      }))

      // Refresh replies for this review
      await fetchReplies(reviewId)

      // Update replies count in local state
      setReviews((prev) =>
        prev.map((review) => (review.id === reviewId ? { ...review, replies: review.replies + 1 } : review)),
      )
    } catch (error) {
      console.error("Error submitting reply:", error)
      alert("Failed to submit reply")
    } finally {
      setSubmittingReply((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    }
  }

  // Toggle reply section visibility
  const toggleReplies = async (reviewId) => {
    const isExpanded = expandedReplies.has(reviewId)

    if (isExpanded) {
      setExpandedReplies((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    } else {
      setExpandedReplies((prev) => new Set([...prev, reviewId]))
      // Fetch replies if not already loaded
      if (!reviewReplies[reviewId]) {
        await fetchReplies(reviewId)
      }
    }
  }

  // Handle reply text change
  const handleReplyTextChange = (reviewId, text) => {
    setReplyTexts((prev) => ({
      ...prev,
      [reviewId]: text,
    }))
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="star-icon filled" />)
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="star-icon half" />)
      } else {
        stars.push(<FaRegStar key={i} className="star-icon empty" />)
      }
    }
    return stars
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <FaSmile className="sentiment-icon positive" />
      case "neutral":
        return <FaMeh className="sentiment-icon neutral" />
      case "negative":
        return <FaFrown className="sentiment-icon negative" />
      default:
        return null
    }
  }

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isOpen || !game) return null

  return (
    <div className={`modern-popup-overlay ${isAnimating ? "animate-in" : "animate-out"}`}>
      <div className="modern-popup-backdrop" onClick={handleClose} />

      <div className="modern-popup-container">
        <div className="modern-popup-header">
          <div className="popup-header-content">
            <div className="game-icon-large">
              <span>{game.icon}</span>
            </div>
            <div className="header-text">
              <h1 className="popup-game-title">{game.title}</h1>
              <div className="game-meta">
                <span className="category-tag">{game.category}</span>
                <div className="rating-display">
                  <div className="stars">{renderStars(game.rating)}</div>
                  <span className="rating-text">{game.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <button className="modern-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modern-popup-content">
          <div className="content-grid">
            {/* Left Column - Game Info */}
            <div className="game-info-section">
              <div className="game-image-container">
                <img
                  src={game.image || "/placeholder.svg?height=300&width=400"}
                  alt={game.title}
                  className="popup-game-image"
                />
                <div className="image-overlay">
                  <div className="status-badges">
                    {game.featured && (
                      <div className="status-badge featured">
                        <FaTrophy />
                        <span>Featured</span>
                      </div>
                    )}
                    {game.trending && (
                      <div className="status-badge trending">
                        <FaFire />
                        <span>Trending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="game-description">
                <h3>About This Game</h3>
                <p>{game.description}</p>
              </div>

              <div className="game-stats">
                <div className="stat-item">
                  <FaClock className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">{game.duration}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaUsers className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-label">Players</span>
                    <span className="stat-value">{game.players}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaBolt className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-label">Difficulty</span>
                    <span className="stat-value">{game.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="game-tags">
                {game.tags.map((tag, index) => (
                  <span key={index} className="game-tag">
                    <FaMagic />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pricing-section">
                <div className="price-display">
                  <span className="price-amount">₹{game.pricing}</span>
                  <span className="price-label">per session</span>
                </div>

                <div className="action-buttons">
                  <button
                    className={`action-btn favorite-btn ${isFavorite ? "active" : ""}`}
                    onClick={() => onToggleFavorite(game.gameId)}
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    <span>{isFavorite ? "Favorited" : "Favorite"}</span>
                  </button>

                  <button className="action-btn share-btn">
                    <FaShare />
                    <span>Share</span>
                  </button>

                  <button className="primary-btn book-btn" onClick={() => onBookNow(game)} disabled={!game.status}>
                    <FaCalendarAlt />
                    <span>{game.status ? "Book Now" : "Unavailable"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Reviews */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h3>
                  <FaComment />
                  Customer Reviews
                </h3>

                {reviewStats.totalReviews > 0 && (
                  <div className="reviews-summary">
                    <div className="rating-overview">
                      <div className="big-rating">{reviewStats.averageRating.toFixed(1)}</div>
                      <div className="rating-stars">{renderStars(reviewStats.averageRating)}</div>
                      <div className="rating-count">
                        {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="rating-breakdown">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="rating-bar">
                          <span className="bar-label">{star}★</span>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${reviewStats.totalReviews > 0 ? (reviewStats.ratingCounts[star - 1] / reviewStats.totalReviews) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="bar-count">{reviewStats.ratingCounts[star - 1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Filters */}
                {reviewStats.totalReviews > 0 && (
                  <div className="review-filters-section">
                    <button className="filters-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                      <FaFilter />
                      <span>Filters</span>
                    </button>

                    {showFilters && (
                      <div className="review-filters">
                        <div className="filter-group">
                          <label>Filter:</label>
                          <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)}>
                            <option value="all">All Reviews</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                            <option value="positive">Positive</option>
                            <option value="neutral">Neutral</option>
                            <option value="negative">Negative</option>
                          </select>
                        </div>
                        <div className="filter-group">
                          <label>Sort:</label>
                          <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                            <option value="mostLiked">Most Liked</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="reviews-list">
                {loading ? (
                  <div className="loading-state">
                    <FaSpinner className="spinner" />
                    <span>Loading reviews...</span>
                  </div>
                ) : filteredReviews.length > 0 ? (
                  filteredReviews.map((review, index) => (
                    <div key={review.reviewId} className="review-card" style={{ "--delay": `${index * 0.1}s` }}>
                      <div className="review-header">
                        <div className="reviewer-info">
                          <img
                            src={review.userImage || "/placeholder.svg?height=40&width=40"}
                            alt={review.userName}
                            className="reviewer-avatar"
                          />
                          <div className="reviewer-details">
                            <div className="reviewer-name">
                              {review.userName}
                              {review.verified && <FaCheck className="verified-icon" />}
                            </div>
                            <div className="review-date">{formatDate(review.createdDate)}</div>
                          </div>
                        </div>

                        <div className="review-rating">
                          <div className="stars">{renderStars(review.rating)}</div>
                          {getSentimentIcon(review.sentiment)}
                        </div>
                      </div>

                      <div className="review-content">
                        <h4 className="review-title">{review.title}</h4>
                        <p className="review-text">{review.reviewText}</p>

                        {/* Review Images */}
                        {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                          <div className="review-images">
                            {review.images.map((image, imgIndex) => {
                              if (!image || typeof image !== "string" || image.trim() === "") {
                                return null
                              }
                              const imageUrl = `https://localhost:7186/uploads/${image.trim()}`
                              return (
                                <div key={imgIndex} className="review-image-container">
                                  <img
                                    src={imageUrl || "/placeholder.svg"}
                                    alt={`Review image ${imgIndex + 1}`}
                                    className="review-image"
                                    onError={(e) => {
                                      e.target.src = "/placeholder.svg?height=100&width=100"
                                      e.target.style.display = "none"
                                    }}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      <div className="review-actions">
                        <button
                          className={`review-action-btn like-btn ${likedReviews.has(review.id) ? "liked" : ""} ${
                            likingReviews.has(review.id) ? "loading" : ""
                          }`}
                          onClick={() => handleLikeReview(review.id)}
                          disabled={likingReviews.has(review.id)}
                        >
                          {likingReviews.has(review.id) ? <FaSpinner className="spinner-icon" /> : <FaThumbsUp />}
                          <span>{review.likes}</span>
                        </button>
                        <button className="review-action-btn comment-btn" onClick={() => toggleReplies(review.id)}>
                          <FaComment />
                          <span>{review.replies}</span>
                        </button>
                      </div>

                      {/* Replies Section */}
                      {expandedReplies.has(review.id) && (
                        <div className="replies-section">
                          <div className="replies-header">
                            <div className="replies-title">
                              <FaReply className="replies-icon" />
                              <h5>Replies ({review.replies})</h5>
                            </div>
                            <button className="collapse-replies-btn" onClick={() => toggleReplies(review.id)}>
                              <FaChevronUp />
                            </button>
                          </div>

                          {/* Reply Form */}
                          {userId && (
                            <div className="reply-form">
                              <div className="reply-input-container">
                                <img
                                  src={userInfo?.userImage || "/placeholder.svg?height=32&width=32"}
                                  alt="Your avatar"
                                  className="reply-avatar"
                                />
                                <div className="reply-input-wrapper">
                                  <textarea
                                    value={replyTexts[review.id] || ""}
                                    onChange={(e) => handleReplyTextChange(review.id, e.target.value)}
                                    placeholder="Write a thoughtful reply..."
                                    className="reply-input"
                                    rows="2"
                                  />
                                  <button
                                    onClick={() => handleSubmitReply(review.id)}
                                    disabled={submittingReply.has(review.id) || !replyTexts[review.id]?.trim()}
                                    className={`submit-reply-btn ${
                                      submittingReply.has(review.id) ? "loading" : ""
                                    } ${!replyTexts[review.id]?.trim() ? "disabled" : ""}`}
                                  >
                                    {submittingReply.has(review.id) ? (
                                      <FaSpinner className="spinner-icon" />
                                    ) : (
                                      <FaPaperPlane />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Replies List */}
                          <div className="replies-list">
                            {reviewReplies[review.id]?.length > 0 ? (
                              reviewReplies[review.id].map((reply, replyIndex) => (
                                <div key={reply.replyId || replyIndex} className="reply-item">
                                  <img
                                    src={reply.userImage || "/placeholder.svg?height=32&width=32"}
                                    alt={reply.userName}
                                    className="reply-avatar"
                                  />
                                  <div className="reply-content">
                                    <div className="reply-header">
                                      <span className="reply-author">{reply.userName}</span>
                                      <span className="reply-date">{formatDate(reply.createdDate)}</span>
                                    </div>
                                    <p className="reply-text">{reply.replyText}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="no-replies">
                                <FaComment className="no-replies-icon" />
                                <p>No replies yet. Be the first to reply!</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-reviews">
                    <FaGamepad className="no-reviews-icon" />
                    <h4>No reviews yet</h4>
                    <p>Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetailsPopup
