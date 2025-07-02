// "use client"
// import { useState, useEffect } from "react"
// import axios from "axios"
// import "../css/Review.css"
// import Navbar from "./Navbar"
// import { getUserInfo } from "../auth/JwtUtils"
// import {
//   FaStar,
//   FaStarHalfAlt,
//   FaRegStar,
//   FaUser,
//   FaCalendarAlt,
//   FaFilter,
//   FaSort,
//   FaThumbsUp,
//   FaComment,
//   FaCamera,
//   FaSmile,
//   FaMeh,
//   FaFrown,
//   FaSearch,
//   FaPaperPlane,
//   FaGamepad,
//   FaCheck,
//   FaChevronDown,
//   FaChevronUp,
//   FaReply,
//   FaSpinner,
// } from "react-icons/fa"
// import GameDetailsPopup from "./GameDetailsPopup"

// const ReviewPage = () => {
//   const [activeFilter, setActiveFilter] = useState("all")
//   const [sortBy, setSortBy] = useState("newest")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [showFilters, setShowFilters] = useState(false)
//   const [rating, setRating] = useState(0)
//   const [hoverRating, setHoverRating] = useState(0)
//   const [reviewText, setReviewText] = useState("")
//   const [reviewTitle, setReviewTitle] = useState("")
//   const [gameSelected, setGameSelected] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [showThankYou, setShowThankYou] = useState(false)
//   const [filteredReviews, setFilteredReviews] = useState([])
//   const [reviews, setReviews] = useState([])
//   const [games, setGames] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [message, setMessage] = useState("")
//   const [showDetailsPopup, setShowDetailsPopup] = useState(false)
//   const [selectedGame, setSelectedGame] = useState(null)
//   const [likedReviews, setLikedReviews] = useState(new Set())
//   const [expandedReplies, setExpandedReplies] = useState(new Set())
//   const [replyTexts, setReplyTexts] = useState({})
//   const [submittingReply, setSubmittingReply] = useState(new Set())
//   const [reviewReplies, setReviewReplies] = useState({})
//   const [likingReviews, setLikingReviews] = useState(new Set())

//   const userInfo = getUserInfo()
//   const userId = userInfo?.UserId || ""

//   // Fetch games and reviews on component mount
//   useEffect(() => {
//     fetchGames()
//     fetchReviews()
//     if (userId) {
//       checkUserLikes()
//     }
//   }, [userId])

//   // Filter reviews when dependencies change
//   useEffect(() => {
//     filterReviews()
//   }, [activeFilter, sortBy, searchTerm, reviews])

//   const fetchGames = async () => {
//     try {
//       const response = await axios.get("https://localhost:7186/api/TblGames")
//       setGames(response.data)
//     } catch (error) {
//       console.error("Error fetching games:", error)
//       setMessage("❌ Failed to load games")
//     }
//   }

//   const fetchReviews = async () => {
//     try {
//       setLoading(true)
//       const response = await axios.get("https://localhost:7186/api/TblReviews")

//       // Map the API response to the format expected by the UI
//       const transformedReviews = response.data.map((review) => ({
//         id: review.reviewId,
//         userName: review.userName,
//         userImage: review.userImage || "/placeholder.svg?height=80&width=80",
//         rating: review.rating,
//         date: review.createdDate,
//         title: review.title,
//         comment: review.reviewText,
//         game: review.gameTitle,
//         likes: review.likes,
//         replies: review.replies,
//         verified: review.verified,
//         sentiment: review.sentiment,
//       }))

//       setReviews(transformedReviews)
//     } catch (error) {
//       console.error("Error fetching reviews:", error)
//       setMessage("❌ Failed to load reviews")
//       setReviews([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const checkUserLikes = async () => {
//     if (!userId || reviews.length === 0) return

//     try {
//       const likeChecks = await Promise.all(
//         reviews.map(async (review) => {
//           try {
//             const response = await axios.get(`https://localhost:7186/api/TblReviews/${review.id}/likes/check/${userId}`)
//             return { reviewId: review.id, hasLiked: response.data.hasLiked }
//           } catch (error) {
//             console.error(`Error checking like for review ${review.id}:`, error)
//             return { reviewId: review.id, hasLiked: false }
//           }
//         }),
//       )

//       const likedSet = new Set()
//       likeChecks.forEach(({ reviewId, hasLiked }) => {
//         if (hasLiked) {
//           likedSet.add(reviewId)
//         }
//       })
//       setLikedReviews(likedSet)
//     } catch (error) {
//       console.error("Error checking user likes:", error)
//     }
//   }

//   // Calculate review statistics
//   const totalReviews = reviews.length
//   const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0
//   const ratingCounts = [0, 0, 0, 0, 0]
//   reviews.forEach((review) => {
//     ratingCounts[review.rating - 1]++
//   })
//   const ratingPercentages = ratingCounts.map((count) => (totalReviews > 0 ? (count / totalReviews) * 100 : 0))

//   const filterReviews = () => {
//     let filtered = [...reviews]

//     // Filter by rating
//     if (activeFilter !== "all") {
//       if (activeFilter === "positive") {
//         filtered = filtered.filter((review) => review.rating >= 4)
//       } else if (activeFilter === "neutral") {
//         filtered = filtered.filter((review) => review.rating === 3)
//       } else if (activeFilter === "negative") {
//         filtered = filtered.filter((review) => review.rating <= 2)
//       } else {
//         const ratingFilter = Number.parseInt(activeFilter)
//         filtered = filtered.filter((review) => review.rating === ratingFilter)
//       }
//     }

//     // Search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       filtered = filtered.filter(
//         (review) =>
//           review.title.toLowerCase().includes(term) ||
//           review.comment.toLowerCase().includes(term) ||
//           review.userName.toLowerCase().includes(term) ||
//           review.game.toLowerCase().includes(term),
//       )
//     }

//     // Sort
//     if (sortBy === "newest") {
//       filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
//     } else if (sortBy === "oldest") {
//       filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
//     } else if (sortBy === "highest") {
//       filtered.sort((a, b) => b.rating - a.rating)
//     } else if (sortBy === "lowest") {
//       filtered.sort((a, b) => a.rating - b.rating)
//     } else if (sortBy === "mostLiked") {
//       filtered.sort((a, b) => b.likes - a.likes)
//     }

//     setFilteredReviews(filtered)
//   }

//   const handleSubmitReview = async (e) => {
//     e.preventDefault()

//     if (rating === 0 || !reviewTitle || !reviewText || !gameSelected) {
//       setMessage("❌ Please fill in all required fields and provide a rating")
//       return
//     }

//     if (!userId) {
//       setMessage("❌ Please log in to submit a review")
//       return
//     }

//     setIsSubmitting(true)
//     setMessage("")

//     const selectedGame = games.find((game) => game.title === gameSelected)
//     if (!selectedGame) {
//       setMessage("❌ Please select a valid game")
//       setIsSubmitting(false)
//       return
//     }

//     const reviewData = {
//       gameId: Number.parseInt(selectedGame.gameId),
//       userId: Number.parseInt(userId),
//       rating,
//       title: reviewTitle,
//       reviewText,
//     }

//     try {
//       await axios.post("https://localhost:7186/api/TblReviews", reviewData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       setShowThankYou(true)
//       setRating(0)
//       setReviewTitle("")
//       setReviewText("")
//       setGameSelected("")
//       setMessage("✅ Review submitted successfully!")

//       // Refresh reviews after successful submission
//       fetchReviews()

//       // Hide thank you message after 5 seconds
//       setTimeout(() => {
//         setShowThankYou(false)
//         setMessage("")
//       }, 5000)
//     } catch (error) {
//       console.error("Error submitting review:", error)
//       setMessage("❌ Failed to submit review. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" }
//     return new Date(dateString).toLocaleDateString(undefined, options)
//   }

//   const renderStars = (rating) => {
//     const stars = []
//     for (let i = 1; i <= 5; i++) {
//       if (i <= rating) {
//         stars.push(<FaStar key={i} className="star-icon filled" />)
//       } else if (i - 0.5 <= rating) {
//         stars.push(<FaStarHalfAlt key={i} className="star-icon half" />)
//       } else {
//         stars.push(<FaRegStar key={i} className="star-icon empty" />)
//       }
//     }
//     return stars
//   }

//   const getSentimentIcon = (sentiment) => {
//     switch (sentiment) {
//       case "positive":
//         return <FaSmile className="sentiment-icon positive" />
//       case "neutral":
//         return <FaMeh className="sentiment-icon neutral" />
//       case "negative":
//         return <FaFrown className="sentiment-icon negative" />
//       default:
//         return null
//     }
//   }

//   const handleShowDetails = (game) => {
//     setSelectedGame(game)
//     setShowDetailsPopup(true)
//   }

//   const handleCloseDetails = () => {
//     setShowDetailsPopup(false)
//     setSelectedGame(null)
//   }

//   // Fetch replies for a specific review
//   const fetchReplies = async (reviewId) => {
//     try {
//       const response = await axios.get(`https://localhost:7186/api/TblReviews/${reviewId}/replies`)
//       setReviewReplies((prev) => ({
//         ...prev,
//         [reviewId]: response.data,
//       }))
//     } catch (error) {
//       console.error("Error fetching replies:", error)
//       setReviewReplies((prev) => ({
//         ...prev,
//         [reviewId]: [],
//       }))
//     }
//   }

//   // Handle like/unlike review
//   const handleLikeReview = async (reviewId) => {
//     if (!userId) {
//       setMessage("❌ Please log in to like reviews")
//       return
//     }

//     if (likingReviews.has(reviewId)) {
//       return // Prevent multiple simultaneous requests
//     }

//     try {
//       setLikingReviews((prev) => new Set([...prev, reviewId]))

//       const isLiked = likedReviews.has(reviewId)

//       if (isLiked) {
//         // Unlike the review
//         await axios.delete(`https://localhost:7186/api/TblReviews/${reviewId}/like`, {
//           data: { userId: Number.parseInt(userId) },
//           headers: {
//             "Content-Type": "application/json",
//           },
//         })
//         setLikedReviews((prev) => {
//           const newSet = new Set(prev)
//           newSet.delete(reviewId)
//           return newSet
//         })
//       } else {
//         // Like the review
//         await axios.post(`https://localhost:7186/api/TblReviews/${reviewId}/like`, {
//           userId: Number.parseInt(userId),
//         })
//         setLikedReviews((prev) => new Set([...prev, reviewId]))
//       }

//       // Update the review likes count in the local state
//       setReviews((prev) =>
//         prev.map((review) =>
//           review.id === reviewId ? { ...review, likes: isLiked ? review.likes - 1 : review.likes + 1 } : review,
//         ),
//       )
//     } catch (error) {
//       console.error("Error liking review:", error)
//       if (error.response?.status === 400) {
//         setMessage("❌ " + (error.response.data.message || "Unable to update like status"))
//       } else {
//         setMessage("❌ Failed to update like status")
//       }
//       setTimeout(() => setMessage(""), 3000)
//     } finally {
//       setLikingReviews((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(reviewId)
//         return newSet
//       })
//     }
//   }

//   // Handle reply submission
//   const handleSubmitReply = async (reviewId) => {
//     if (!userId) {
//       setMessage("❌ Please log in to reply to reviews")
//       return
//     }

//     const replyText = replyTexts[reviewId]?.trim()
//     if (!replyText) {
//       setMessage("❌ Please enter a reply message")
//       return
//     }

//     try {
//       setSubmittingReply((prev) => new Set([...prev, reviewId]))

//       const replyData = {
//         userId: Number.parseInt(userId),
//         replyText: replyText,
//       }

//       await axios.post(`https://localhost:7186/api/TblReviews/${reviewId}/reply`, replyData)

//       // Clear the reply text
//       setReplyTexts((prev) => ({
//         ...prev,
//         [reviewId]: "",
//       }))

//       // Refresh replies for this review
//       await fetchReplies(reviewId)

//       // Update replies count in local state
//       setReviews((prev) =>
//         prev.map((review) => (review.id === reviewId ? { ...review, replies: review.replies + 1 } : review)),
//       )

//       setMessage("✅ Reply submitted successfully!")
//       setTimeout(() => setMessage(""), 3000)
//     } catch (error) {
//       console.error("Error submitting reply:", error)
//       setMessage("❌ Failed to submit reply")
//       setTimeout(() => setMessage(""), 3000)
//     } finally {
//       setSubmittingReply((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(reviewId)
//         return newSet
//       })
//     }
//   }

//   // Toggle reply section visibility
//   const toggleReplies = async (reviewId) => {
//     const isExpanded = expandedReplies.has(reviewId)

//     if (isExpanded) {
//       setExpandedReplies((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(reviewId)
//         return newSet
//       })
//     } else {
//       setExpandedReplies((prev) => new Set([...prev, reviewId]))
//       // Fetch replies if not already loaded
//       if (!reviewReplies[reviewId]) {
//         await fetchReplies(reviewId)
//       }
//     }
//   }

//   // Handle reply text change
//   const handleReplyTextChange = (reviewId, text) => {
//     setReplyTexts((prev) => ({
//       ...prev,
//       [reviewId]: text,
//     }))
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="review-page">
//         {/* Background Effects */}
//         <div className="review-bg-overlay"></div>
//         <div className="review-bg-pattern"></div>
//         <div className="review-floating-elements">
//           <div className="floating-orb orb-1"></div>
//           <div className="floating-orb orb-2"></div>
//           <div className="floating-orb orb-3"></div>
//           <div className="floating-orb orb-4"></div>
//           <div className="floating-orb orb-5"></div>
//         </div>

//         {/* Hero Section */}
//         <section className="review-hero">
//           <div className="hero-content">
//             <div className="hero-badge">
//               <span>Customer Reviews</span>
//             </div>
//             <h1 className="hero-title">
//               <span className="title-line-1">What Our Customers</span>
//               <span className="title-line-2">Are Saying</span>
//             </h1>
//             <p className="hero-subtitle">
//               Discover authentic experiences shared by our gaming community. Your feedback helps us improve and create
//               better experiences for everyone.
//             </p>
//             <div className="hero-rating">
//               <div className="rating-number">{averageRating.toFixed(1)}</div>
//               <div className="rating-stars">{renderStars(averageRating)}</div>
//               <div className="rating-count">Based on {totalReviews} reviews</div>
//             </div>
//           </div>
//         </section>

//         {/* Review Statistics */}
//         <section className="review-stats-section">
//           <div className="stats-container">
//             <div className="stats-header">
//               <h2 className="section-title">Review Summary</h2>
//               <p className="section-subtitle">See how our customers rate their experiences</p>
//             </div>
//             <div className="stats-content">
//               <div className="rating-summary">
//                 <div className="average-rating">
//                   <div className="big-rating">{averageRating.toFixed(1)}</div>
//                   <div className="rating-stars">{renderStars(averageRating)}</div>
//                   <div className="total-reviews">{totalReviews} reviews</div>
//                 </div>
//                 <div className="rating-bars">
//                   {[5, 4, 3, 2, 1].map((star) => (
//                     <div key={star} className="rating-bar-item">
//                       <div className="bar-label">{star} stars</div>
//                       <div className="bar-container">
//                         <div className="bar-fill" style={{ width: `${ratingPercentages[star - 1]}%` }}></div>
//                       </div>
//                       <div className="bar-count">{ratingCounts[star - 1]}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="rating-breakdown">
//                 <div className="breakdown-item">
//                   <div className="breakdown-label">
//                     <FaSmile className="breakdown-icon positive" />
//                     <span>Positive</span>
//                   </div>
//                   <div className="breakdown-value">
//                     {totalReviews > 0 ? (((ratingCounts[4] + ratingCounts[3]) / totalReviews) * 100).toFixed(0) : 0}%
//                   </div>
//                 </div>
//                 <div className="breakdown-item">
//                   <div className="breakdown-label">
//                     <FaMeh className="breakdown-icon neutral" />
//                     <span>Neutral</span>
//                   </div>
//                   <div className="breakdown-value">
//                     {totalReviews > 0 ? ((ratingCounts[2] / totalReviews) * 100).toFixed(0) : 0}%
//                   </div>
//                 </div>
//                 <div className="breakdown-item">
//                   <div className="breakdown-label">
//                     <FaFrown className="breakdown-icon negative" />
//                     <span>Negative</span>
//                   </div>
//                   <div className="breakdown-value">
//                     {totalReviews > 0 ? (((ratingCounts[1] + ratingCounts[0]) / totalReviews) * 100).toFixed(0) : 0}%
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Reviews Section */}
//         <section className="reviews-section">
//           <div className="reviews-container">
//             <div className="reviews-header">
//               <h2 className="section-title">Customer Reviews</h2>
//               <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
//                 <FaFilter />
//                 <span>Filters</span>
//                 {showFilters ? <FaChevronUp /> : <FaChevronDown />}
//               </button>
//             </div>

//             {/* Message Display */}
//             {message && <div className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</div>}

//             {/* Filters */}
//             <div className={`reviews-filters ${showFilters ? "show" : ""}`}>
//               <div className="filter-group">
//                 <div className="filter-label">Filter by:</div>
//                 <div className="filter-options">
//                   <button
//                     className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
//                     onClick={() => setActiveFilter("all")}
//                   >
//                     All Reviews
//                   </button>
//                   <button
//                     className={`filter-btn ${activeFilter === "5" ? "active" : ""}`}
//                     onClick={() => setActiveFilter("5")}
//                   >
//                     5 Stars
//                   </button>
//                   <button
//                     className={`filter-btn ${activeFilter === "4" ? "active" : ""}`}
//                     onClick={() => setActiveFilter("4")}
//                   >
//                     4 Stars
//                   </button>
//                   <button
//                     className={`filter-btn ${activeFilter === "3" ? "active" : ""}`}
//                     onClick={() => setActiveFilter("3")}
//                   >
//                     3 Stars
//                   </button>
//                   <button
//                     className={`filter-btn ${activeFilter === "2" ? "active" : ""}`}
//                     onClick={() => setActiveFilter("2")}
//                   >
//                     2 Stars
//                   </button>
//                   <button
//                     className={`filter-btn ${activeFilter === "1" ? "active" : ""}`}
//                     onClick={() => setActiveFilter("1")}
//                   >
//                     1 Star
//                   </button>
//                   <button
//                     className={`filter-btn ${activeFilter === "positive" ? "active" : ""}`}
//                     onClick={() => setActiveFilter("positive")}
//                   >
//                     <FaSmile /> Positive
//                   </button>
//                   <button
//                     className={`filter-btn ${activeFilter === "neutral" ? "active" : ""}`}
//                     onClick={() => setActiveFilter("neutral")}
//                   >
//                     <FaMeh /> Neutral
//                   </button>
//                   <button
//                     className={`filter-btn ${activeFilter === "negative" ? "active" : ""}`}
//                     onClick={() => setActiveFilter("negative")}
//                   >
//                     <FaFrown /> Negative
//                   </button>
//                 </div>
//               </div>

//               <div className="filter-group">
//                 <div className="filter-label">Sort by:</div>
//                 <div className="filter-options">
//                   <button
//                     className={`filter-btn ${sortBy === "newest" ? "active" : ""}`}
//                     onClick={() => setSortBy("newest")}
//                   >
//                     <FaSort /> Newest
//                   </button>
//                   <button
//                     className={`filter-btn ${sortBy === "oldest" ? "active" : ""}`}
//                     onClick={() => setSortBy("oldest")}
//                   >
//                     <FaSort /> Oldest
//                   </button>
//                   <button
//                     className={`filter-btn ${sortBy === "highest" ? "active" : ""}`}
//                     onClick={() => setSortBy("highest")}
//                   >
//                     <FaSort /> Highest Rating
//                   </button>
//                   <button
//                     className={`filter-btn ${sortBy === "lowest" ? "active" : ""}`}
//                     onClick={() => setSortBy("lowest")}
//                   >
//                     <FaSort /> Lowest Rating
//                   </button>
//                   <button
//                     className={`filter-btn ${sortBy === "mostLiked" ? "active" : ""}`}
//                     onClick={() => setSortBy("mostLiked")}
//                   >
//                     <FaThumbsUp /> Most Liked
//                   </button>
//                 </div>
//               </div>

//               <div className="search-filter">
//                 <div className="search-wrapper">
//                   <FaSearch className="search-icon" />
//                   <input
//                     type="text"
//                     placeholder="Search reviews..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="search-input"
//                   />
//                   {searchTerm && (
//                     <button className="clear-search" onClick={() => setSearchTerm("")}>
//                       ×
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Reviews List */}
//             <div className="reviews-list">
//               {loading ? (
//                 <div className="loading-reviews">
//                   <div className="loading-spinner">
//                     <div className="spinner"></div>
//                     <span>Loading reviews...</span>
//                   </div>
//                 </div>
//               ) : filteredReviews.length > 0 ? (
//                 filteredReviews.map((review) => (
//                   <div key={review.id} className="review-card">
//                     <div className="review-header">
//                       <div className="reviewer-info">
//                         <img
//                           src={review.userImage || "/placeholder.svg"}
//                           alt={review.userName}
//                           className="reviewer-image"
//                         />
//                         <div className="reviewer-details">
//                           <div className="reviewer-name">
//                             {review.userName}
//                             {review.verified && (
//                               <span className="verified-badge">
//                                 <FaCheck /> Verified
//                               </span>
//                             )}
//                           </div>
//                           <div className="review-meta">
//                             <span className="review-date">
//                               <FaCalendarAlt /> {formatDate(review.date)}
//                             </span>
//                             <span className="review-game">
//                               <FaGamepad /> {review.game}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="review-rating">
//                         <div className="rating-stars">{renderStars(review.rating)}</div>
//                         <div className="sentiment-indicator">{getSentimentIcon(review.sentiment)}</div>
//                       </div>
//                     </div>
//                     <div className="review-content">
//                       <h3 className="review-title">{review.title}</h3>
//                       <p className="review-comment">{review.comment}</p>
//                     </div>
//                     <div className="review-footer">
//                       <button
//                         className={`review-action like-btn ${likedReviews.has(review.id) ? "liked" : ""} ${
//                           likingReviews.has(review.id) ? "loading" : ""
//                         }`}
//                         onClick={() => handleLikeReview(review.id)}
//                         disabled={likingReviews.has(review.id)}
//                       >
//                         {likingReviews.has(review.id) ? <FaSpinner className="spinner-icon" /> : <FaThumbsUp />}
//                         <span>{review.likes}</span>
//                       </button>
//                       <button className="review-action comment-btn" onClick={() => toggleReplies(review.id)}>
//                         <FaComment />
//                         <span>{review.replies}</span>
//                       </button>
//                     </div>

//                     {/* Replies Section */}
//                     {expandedReplies.has(review.id) && (
//                       <div className="replies-section">
//                         <div className="replies-header">
//                           <div className="replies-title">
//                             <FaReply className="replies-icon" />
//                             <h4>Replies ({review.replies})</h4>
//                           </div>
//                           <button className="collapse-replies-btn" onClick={() => toggleReplies(review.id)}>
//                             <FaChevronUp />
//                           </button>
//                         </div>

//                         {/* Reply Form */}
//                         {userId && (
//                           <div className="reply-form">
//                             <div className="reply-input-container">
//                               <img
//                                 src={userInfo?.userImage || "/placeholder.svg?height=32&width=32"}
//                                 alt="Your avatar"
//                                 className="reply-avatar"
//                               />
//                               <div className="reply-input-wrapper">
//                                 <textarea
//                                   value={replyTexts[review.id] || ""}
//                                   onChange={(e) => handleReplyTextChange(review.id, e.target.value)}
//                                   placeholder="Write a thoughtful reply..."
//                                   className="reply-input"
//                                   rows="2"
//                                 />
//                                 <button
//                                   onClick={() => handleSubmitReply(review.id)}
//                                   disabled={submittingReply.has(review.id) || !replyTexts[review.id]?.trim()}
//                                   className={`submit-reply-btn ${
//                                     submittingReply.has(review.id) ? "loading" : ""
//                                   } ${!replyTexts[review.id]?.trim() ? "disabled" : ""}`}
//                                 >
//                                   {submittingReply.has(review.id) ? (
//                                     <FaSpinner className="spinner-icon" />
//                                   ) : (
//                                     <FaPaperPlane />
//                                   )}
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         {/* Replies List */}
//                         <div className="replies-list">
//                           {reviewReplies[review.id]?.length > 0 ? (
//                             reviewReplies[review.id].map((reply, index) => (
//                               <div key={reply.replyId || index} className="reply-item">
//                                 <img
//                                   src={reply.userImage || "/placeholder.svg?height=32&width=32"}
//                                   alt={reply.userName}
//                                   className="reply-avatar"
//                                 />
//                                 <div className="reply-content">
//                                   <div className="reply-header">
//                                     <span className="reply-author">{reply.userName}</span>
//                                     <span className="reply-date">{formatDate(reply.createdDate)}</span>
//                                   </div>
//                                   <p className="reply-text">{reply.replyText}</p>
//                                 </div>
//                               </div>
//                             ))
//                           ) : (
//                             <div className="no-replies">
//                               <FaComment className="no-replies-icon" />
//                               <p>No replies yet. Be the first to reply!</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="no-reviews">
//                   <div className="no-reviews-icon">
//                     <FaComment />
//                   </div>
//                   <h3>No reviews found</h3>
//                   <p>
//                     {reviews.length === 0
//                       ? "Be the first to share your experience!"
//                       : "Try adjusting your filters or search terms"}
//                   </p>
//                   {reviews.length > 0 && (
//                     <button
//                       className="reset-filters-btn"
//                       onClick={() => {
//                         setActiveFilter("all")
//                         setSortBy("newest")
//                         setSearchTerm("")
//                       }}
//                     >
//                       <span>Reset Filters</span>
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Write Review Section */}
//         <section className="write-review-section">
//           <div className="write-review-container">
//             <div className="write-review-header">
//               <h2 className="section-title">Share Your Experience</h2>
//               <p className="section-subtitle">
//                 Your feedback helps us improve and helps others make informed decisions
//               </p>
//             </div>

//             {showThankYou ? (
//               <div className="thank-you-message">
//                 <div className="thank-you-icon">
//                   <FaCheck />
//                 </div>
//                 <h3>Thank You for Your Review!</h3>
//                 <p>Your feedback has been submitted successfully and will be published soon.</p>
//               </div>
//             ) : (
//               <form className="review-form" onSubmit={handleSubmitReview}>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label className="form-label">Your Name</label>
//                     <div className="input-wrapper">
//                       <FaUser className="input-icon" />
//                       <input
//                         type="text"
//                         value={userInfo?.name || userInfo?.username || ""}
//                         className="form-input"
//                         placeholder="Your name"
//                         disabled
//                       />
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">Select Game*</label>
//                     <div className="input-wrapper">
//                       <FaGamepad className="input-icon" />
//                       <select
//                         value={gameSelected}
//                         onChange={(e) => setGameSelected(e.target.value)}
//                         className="form-input"
//                         required
//                       >
//                         <option value="">Select a game</option>
//                         {games.map((game) => (
//                           <option key={game.gameId} value={game.title}>
//                             {game.title}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Your Rating*</label>
//                   <div className="rating-selector">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         type="button"
//                         className={`star-btn ${star <= (hoverRating || rating) ? "active" : ""}`}
//                         onClick={() => setRating(star)}
//                         onMouseEnter={() => setHoverRating(star)}
//                         onMouseLeave={() => setHoverRating(0)}
//                       >
//                         <FaStar />
//                       </button>
//                     ))}
//                     <span className="rating-text">
//                       {rating ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1] : "Click to rate"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Review Title*</label>
//                   <div className="input-wrapper">
//                     <input
//                       type="text"
//                       value={reviewTitle}
//                       onChange={(e) => setReviewTitle(e.target.value)}
//                       className="form-input"
//                       placeholder="Summarize your experience"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Your Review*</label>
//                   <div className="input-wrapper">
//                     <textarea
//                       value={reviewText}
//                       onChange={(e) => setReviewText(e.target.value)}
//                       className="form-textarea"
//                       placeholder="Share the details of your experience"
//                       rows="5"
//                       required
//                     ></textarea>
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Add Photos (Optional)</label>
//                   <div className="photo-upload">
//                     <button type="button" className="upload-btn">
//                       <FaCamera className="upload-icon" />
//                       <span>Upload Photos</span>
//                     </button>
//                     <span className="upload-hint">You can upload up to 3 photos</span>
//                   </div>
//                 </div>

//                 <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
//                   {isSubmitting ? (
//                     <div className="loading-spinner">
//                       <div className="spinner"></div>
//                       <span>Submitting...</span>
//                     </div>
//                   ) : (
//                     <>
//                       <FaPaperPlane className="btn-icon" />
//                       <span>Submit Review</span>
//                     </>
//                   )}
//                 </button>
//               </form>
//             )}
//           </div>
//         </section>
//         {/* Game Details Popup */}
//         <GameDetailsPopup isOpen={showDetailsPopup} onClose={() => setShowDetailsPopup(false)} game={selectedGame} />
//       </div>
//     </>
//   )
// }

// export default ReviewPage




"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import "../css/Review.css"
import Navbar from "./Navbar"
import { getUserInfo } from "../auth/JwtUtils"
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUser,
  FaCalendarAlt,
  FaFilter,
  FaSort,
  FaThumbsUp,
  FaComment,
  FaCamera,
  FaSmile,
  FaMeh,
  FaFrown,
  FaSearch,
  FaPaperPlane,
  FaGamepad,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaReply,
  FaSpinner,
  FaTimes,
} from "react-icons/fa"
import GameDetailsPopup from "./GameDetailsPopup"

const ReviewPage = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [reviewTitle, setReviewTitle] = useState("")
  const [gameSelected, setGameSelected] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [filteredReviews, setFilteredReviews] = useState([])
  const [reviews, setReviews] = useState([])
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [showDetailsPopup, setShowDetailsPopup] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [likedReviews, setLikedReviews] = useState(new Set())
  const [expandedReplies, setExpandedReplies] = useState(new Set())
  const [replyTexts, setReplyTexts] = useState({})
  const [submittingReply, setSubmittingReply] = useState(new Set())
  const [reviewReplies, setReviewReplies] = useState({})
  const [likingReviews, setLikingReviews] = useState(new Set())
  const [selectedImages, setSelectedImages] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const [imageModal, setImageModal] = useState({ isOpen: false, imageSrc: "" })

  const userInfo = getUserInfo()
  const userId = userInfo?.UserId || ""

  // Fetch games and reviews on component mount
  useEffect(() => {
    fetchGames()
    fetchReviews()
    if (userId) {
      checkUserLikes()
    }
  }, [userId])

  // Filter reviews when dependencies change
  useEffect(() => {
    filterReviews()
  }, [activeFilter, sortBy, searchTerm, reviews])

  const fetchGames = async () => {
    try {
      const response = await axios.get("https://localhost:7186/api/TblGames")
      setGames(response.data)
    } catch (error) {
      console.error("Error fetching games:", error)
      setMessage("❌ Failed to load games")
    }
  }

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://localhost:7186/api/TblReviews")

      console.log("=== RAW API RESPONSE ===")
      console.log("Full response:", response.data)

      // Map the API response to the format expected by the UI
      const transformedReviews = response.data.map((review) => {
        return {
          id: review.reviewId,
          userName: review.userName,
          userImage: review.userImage || "/placeholder.svg?height=80&width=80",
          rating: review.rating,
          date: review.createdDate,
          title: review.title,
          comment: review.reviewText,
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
        }
      })

      // Add this right after the transformedReviews mapping and before setReviews(transformedReviews)
      console.log("=== FINAL TRANSFORMED REVIEWS DEBUG ===")
      transformedReviews.forEach((review, index) => {
        console.log(`Review ${index + 1} (ID: ${review.id}):`)
        console.log("  - title:", review.title)
        console.log("  - comment:", review.comment)
        console.log("  - likes:", review.likes)
        console.log("  - replies:", review.replies)
        console.log("  - images:", review.images)
        console.log("  - images length:", review.images?.length)
        console.log("  - date:", review.date)
        console.log("  - game:", review.game)
        console.log("  - userName:", review.userName)
        console.log("  - verified:", review.verified)
        console.log("  - Raw API data for this review:")
        console.log("    - Original review object:", response.data[index])
        console.log("---")
      })

      setReviews(transformedReviews)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setMessage("❌ Failed to load reviews")
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  // Add this debugging function
  const debugImageData = () => {
    console.log("=== DEBUG IMAGE DATA ===")
    reviews.forEach((review) => {
      console.log(`Review ${review.id}:`)
      console.log("  - images array:", review.images)
      console.log("  - images type:", typeof review.images)
      console.log("  - images length:", review.images?.length)
      if (review.images && review.images.length > 0) {
        review.images.forEach((img, idx) => {
          console.log(`  - image ${idx}:`, img, typeof img)
        })
      }
    })
  }

  // Call this function after reviews are loaded
  useEffect(() => {
    if (reviews.length > 0) {
      debugImageData()
    }
  }, [reviews])

  const checkUserLikes = async () => {
    if (!userId || reviews.length === 0) return

    try {
      const likeChecks = await Promise.all(
        reviews.map(async (review) => {
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

  // Calculate review statistics
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0
  const ratingCounts = [0, 0, 0, 0, 0]
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++
  })
  const ratingPercentages = ratingCounts.map((count) => (totalReviews > 0 ? (count / totalReviews) * 100 : 0))

  const filterReviews = () => {
    let filtered = [...reviews]

    // Filter by rating
    if (activeFilter !== "all") {
      if (activeFilter === "positive") {
        filtered = filtered.filter((review) => review.rating >= 4)
      } else if (activeFilter === "neutral") {
        filtered = filtered.filter((review) => review.rating === 3)
      } else if (activeFilter === "negative") {
        filtered = filtered.filter((review) => review.rating <= 2)
      } else {
        const ratingFilter = Number.parseInt(activeFilter)
        filtered = filtered.filter((review) => review.rating === ratingFilter)
      }
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(term) ||
          review.comment.toLowerCase().includes(term) ||
          review.userName.toLowerCase().includes(term) ||
          review.game.toLowerCase().includes(term),
      )
    }

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === "highest") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "lowest") {
      filtered.sort((a, b) => a.rating - b.rating)
    } else if (sortBy === "mostLiked") {
      filtered.sort((a, b) => b.likes - a.likes)
    }

    setFilteredReviews(filtered)
  }

  // Handle image upload - Use the correct endpoint
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)

    if (files.length === 0) return

    // Validate file count
    if (selectedImages.length + files.length > 3) {
      setMessage("❌ You can only upload up to 3 images")
      return
    }

    // Validate file sizes (5MB max)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setMessage("❌ Each image must be less than 5MB")
      return
    }

    setUploadingImages(true)

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await axios.post("https://localhost:7186/api/TblReviews/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        console.log("Upload response:", response.data) // Debug log
        return response.data.fileName
      })

      const uploadedFileNames = await Promise.all(uploadPromises)
      console.log("Uploaded file names:", uploadedFileNames) // Debug log

      // Update state with new images
      setSelectedImages((prev) => [...prev, ...uploadedFileNames])

      // Create preview URLs
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])

      setMessage("✅ Images uploaded successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error uploading images:", error)
      setMessage("❌ Failed to upload images. Please try again.")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setUploadingImages(false)
    }
  }

  // Remove image from selection
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviewUrls((prev) => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  // Open image modal
  const openImageModal = (imageSrc) => {
    setImageModal({ isOpen: true, imageSrc })
  }

  // Close image modal
  const closeImageModal = () => {
    setImageModal({ isOpen: false, imageSrc: "" })
  }

  // Fixed handleSubmitReview function
  const handleSubmitReview = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (rating === 0 || !reviewTitle.trim() || !reviewText.trim() || !gameSelected) {
      setMessage("❌ Please fill in all required fields and provide a rating")
      return
    }

    if (!userId) {
      setMessage("❌ Please log in to submit a review")
      return
    }

    setIsSubmitting(true)
    setMessage("")

    try {
      const selectedGameObj = games.find((game) => game.title === gameSelected)
      if (!selectedGameObj) {
        setMessage("❌ Please select a valid game")
        setIsSubmitting(false)
        return
      }

      // Prepare review data according to your DTO structure
      const reviewData = {
        gameId: Number.parseInt(selectedGameObj.gameId),
        userId: Number.parseInt(userId),
        rating: rating,
        title: reviewTitle.trim(),
        reviewText: reviewText.trim(),
        imageUrls: selectedImages, // This should match your DTO property name
      }

      console.log("Submitting review data:", reviewData) // Debug log

      const response = await axios.post("https://localhost:7186/api/TblReviews", reviewData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Review submission response:", response.data) // Debug log

      // Reset form on success
      setShowThankYou(true)
      setRating(0)
      setReviewTitle("")
      setReviewText("")
      setGameSelected("")
      setSelectedImages([])
      setImagePreviewUrls([])
      setMessage("✅ Review submitted successfully!")

      // Refresh reviews after successful submission
      await fetchReviews()

      // Hide thank you message after 5 seconds
      setTimeout(() => {
        setShowThankYou(false)
        setMessage("")
      }, 5000)
    } catch (error) {
      console.error("Error submitting review:", error)

      if (error.response?.status === 400 && error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors
        const errorMessages = Object.values(errors).flat()
        setMessage(`❌ Validation Error: ${errorMessages.join(", ")}`)
      } else if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`)
      } else {
        setMessage("❌ Failed to submit review. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
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

  const handleShowDetails = (game) => {
    setSelectedGame(game)
    setShowDetailsPopup(true)
  }

  const handleCloseDetails = () => {
    setShowDetailsPopup(false)
    setSelectedGame(null)
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

  // Handle like/unlike review
  const handleLikeReview = async (reviewId) => {
    if (!userId) {
      setMessage("❌ Please log in to like reviews")
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
      if (error.response?.status === 400) {
        setMessage("❌ " + (error.response.data.message || "Unable to update like status"))
      } else {
        setMessage("❌ Failed to update like status")
      }
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setLikingReviews((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    }
  }

  // Handle reply submission
  const handleSubmitReply = async (reviewId) => {
    if (!userId) {
      setMessage("❌ Please log in to reply to reviews")
      return
    }

    const replyText = replyTexts[reviewId]?.trim()
    if (!replyText) {
      setMessage("❌ Please enter a reply message")
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

      setMessage("✅ Reply submitted successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error submitting reply:", error)
      setMessage("❌ Failed to submit reply")
      setTimeout(() => setMessage(""), 3000)
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

  return (
    <>
      <Navbar />
      <div className="review-page">
        {/* Background Effects */}
        <div className="review-bg-overlay"></div>
        <div className="review-bg-pattern"></div>
        <div className="review-floating-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="floating-orb orb-5"></div>
        </div>

        {/* Image Modal */}
        {imageModal.isOpen && (
          <div className="image-modal-overlay" onClick={closeImageModal}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="image-modal-close" onClick={closeImageModal}>
                <FaTimes />
              </button>
              <img src={imageModal.imageSrc || "/placeholder.svg"} alt="Review" className="image-modal-img" />
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="review-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span>Customer Reviews</span>
            </div>
            <h1 className="hero-title">
              <span className="title-line-1">What Our Customers</span>
              <span className="title-line-2">Are Saying</span>
            </h1>
            <p className="hero-subtitle">
              Discover authentic experiences shared by our gaming community. Your feedback helps us improve and create
              better experiences for everyone.
            </p>
            <div className="hero-rating">
              <div className="rating-number">{averageRating.toFixed(1)}</div>
              <div className="rating-stars">{renderStars(averageRating)}</div>
              <div className="rating-count">Based on {totalReviews} reviews</div>
            </div>
          </div>
        </section>

        {/* Review Statistics */}
        <section className="review-stats-section">
          <div className="stats-container">
            <div className="stats-header">
              <h2 className="section-title">Review Summary</h2>
              <p className="section-subtitle">See how our customers rate their experiences</p>
            </div>
            <div className="stats-content">
              <div className="rating-summary">
                <div className="average-rating">
                  <div className="big-rating">{averageRating.toFixed(1)}</div>
                  <div className="rating-stars">{renderStars(averageRating)}</div>
                  <div className="total-reviews">{totalReviews} reviews</div>
                </div>
                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="rating-bar-item">
                      <div className="bar-label">{star} stars</div>
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: `${ratingPercentages[star - 1]}%` }}></div>
                      </div>
                      <div className="bar-count">{ratingCounts[star - 1]}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rating-breakdown">
                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <FaSmile className="breakdown-icon positive" />
                    <span>Positive</span>
                  </div>
                  <div className="breakdown-value">
                    {totalReviews > 0 ? (((ratingCounts[4] + ratingCounts[3]) / totalReviews) * 100).toFixed(0) : 0}%
                  </div>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <FaMeh className="breakdown-icon neutral" />
                    <span>Neutral</span>
                  </div>
                  <div className="breakdown-value">
                    {totalReviews > 0 ? ((ratingCounts[2] / totalReviews) * 100).toFixed(0) : 0}%
                  </div>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <FaFrown className="breakdown-icon negative" />
                    <span>Negative</span>
                  </div>
                  <div className="breakdown-value">
                    {totalReviews > 0 ? (((ratingCounts[1] + ratingCounts[0]) / totalReviews) * 100).toFixed(0) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="reviews-section">
          <div className="reviews-container">
            <div className="reviews-header">
              <h2 className="section-title">Customer Reviews</h2>
              <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                <FaFilter />
                <span>Filters</span>
                {showFilters ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {/* Message Display */}
            {message && <div className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</div>}

            {/* Filters */}
            <div className={`reviews-filters ${showFilters ? "show" : ""}`}>
              <div className="filter-group">
                <div className="filter-label">Filter by:</div>
                <div className="filter-options">
                  <button
                    className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                    onClick={() => setActiveFilter("all")}
                  >
                    All Reviews
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "5" ? "active" : ""}`}
                    onClick={() => setActiveFilter("5")}
                  >
                    5 Stars
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "4" ? "active" : ""}`}
                    onClick={() => setActiveFilter("4")}
                  >
                    4 Stars
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "3" ? "active" : ""}`}
                    onClick={() => setActiveFilter("3")}
                  >
                    3 Stars
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "2" ? "active" : ""}`}
                    onClick={() => setActiveFilter("2")}
                  >
                    2 Stars
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "1" ? "active" : ""}`}
                    onClick={() => setActiveFilter("1")}
                  >
                    1 Star
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "positive" ? "active" : ""}`}
                    onClick={() => setActiveFilter("positive")}
                  >
                    <FaSmile /> Positive
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "neutral" ? "active" : ""}`}
                    onClick={() => setActiveFilter("neutral")}
                  >
                    <FaMeh /> Neutral
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "negative" ? "active" : ""}`}
                    onClick={() => setActiveFilter("negative")}
                  >
                    <FaFrown /> Negative
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
                    <FaSort /> Newest
                  </button>
                  <button
                    className={`filter-btn ${sortBy === "oldest" ? "active" : ""}`}
                    onClick={() => setSortBy("oldest")}
                  >
                    <FaSort /> Oldest
                  </button>
                  <button
                    className={`filter-btn ${sortBy === "highest" ? "active" : ""}`}
                    onClick={() => setSortBy("highest")}
                  >
                    <FaSort /> Highest Rating
                  </button>
                  <button
                    className={`filter-btn ${sortBy === "lowest" ? "active" : ""}`}
                    onClick={() => setSortBy("lowest")}
                  >
                    <FaSort /> Lowest Rating
                  </button>
                  <button
                    className={`filter-btn ${sortBy === "mostLiked" ? "active" : ""}`}
                    onClick={() => setSortBy("mostLiked")}
                  >
                    <FaThumbsUp /> Most Liked
                  </button>
                </div>
              </div>

              <div className="search-filter">
                <div className="search-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
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

            {/* Reviews List */}
            <div className="reviews-list">
              {loading ? (
                <div className="loading-reviews">
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Loading reviews...</span>
                  </div>
                </div>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src={review.userImage || "/placeholder.svg"}
                          alt={review.userName}
                          className="reviewer-image"
                        />
                        <div className="reviewer-details">
                          <div className="reviewer-name">
                            {review.userName}
                            {review.verified && (
                              <span className="verified-badge">
                                <FaCheck /> Verified
                              </span>
                            )}
                          </div>
                          <div className="review-meta">
                            <span className="review-date">
                              <FaCalendarAlt /> {formatDate(review.date)}
                            </span>
                            <span className="review-game">
                              <FaGamepad /> {review.game}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="review-rating">
                        <div className="rating-stars">{renderStars(review.rating)}</div>
                        <div className="sentiment-indicator">{getSentimentIcon(review.sentiment)}</div>
                      </div>
                    </div>

                    <div className="review-content">
                      <h3 className="review-title">{review.title}</h3>
                      <p className="review-comment">{review.comment}</p>

                      {/* Review Images - Only show if images exist */}
                      {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                        <div className="review-images">
                          {review.images.map((image, index) => {
                            if (!image || typeof image !== "string" || image.trim() === "") {
                              return null
                            }

                            const imageUrl = `https://localhost:7186/uploads/${image.trim()}`

                            return (
                              <div key={index} className="review-image-container">
                                <img
                                  src={imageUrl || "/placeholder.svg"}
                                  alt={`Review image ${index + 1}`}
                                  className="review-image"
                                  onClick={() => openImageModal(imageUrl)}
                                  onError={(e) => {
                                    console.error("Failed to load image:", imageUrl)
                                    e.target.src = "/placeholder.svg?height=200&width=200"
                                  }}
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="review-footer">
                      <button
                        className={`review-action like-btn ${likedReviews.has(review.id) ? "liked" : ""} ${
                          likingReviews.has(review.id) ? "loading" : ""
                        }`}
                        onClick={() => handleLikeReview(review.id)}
                        disabled={likingReviews.has(review.id)}
                      >
                        {likingReviews.has(review.id) ? <FaSpinner className="spinner-icon" /> : <FaThumbsUp />}
                        <span>{review.likes}</span>
                      </button>
                      <button className="review-action comment-btn" onClick={() => toggleReplies(review.id)}>
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
                            <h4>Replies ({review.replies})</h4>
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
                            reviewReplies[review.id].map((reply, index) => (
                              <div key={reply.replyId || index} className="reply-item">
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
                  <div className="no-reviews-icon">
                    <FaComment />
                  </div>
                  <h3>No reviews found</h3>
                  <p>
                    {reviews.length === 0
                      ? "Be the first to share your experience!"
                      : "Try adjusting your filters or search terms"}
                  </p>
                  {reviews.length > 0 && (
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
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Write Review Section */}
        <section className="write-review-section">
          <div className="write-review-container">
            <div className="write-review-header">
              <h2 className="section-title">Share Your Experience</h2>
              <p className="section-subtitle">
                Your feedback helps us improve and helps others make informed decisions
              </p>
            </div>

            {showThankYou ? (
              <div className="thank-you-message">
                <div className="thank-you-icon">
                  <FaCheck />
                </div>
                <h3>Thank You for Your Review!</h3>
                <p>Your feedback has been submitted successfully and will be published soon.</p>
              </div>
            ) : (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <div className="input-wrapper">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        value={userInfo?.name || userInfo?.username || ""}
                        className="form-input"
                        placeholder="Your name"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Select Game*</label>
                    <div className="custom-dropdown-wrapper">
                      <FaGamepad className="dropdown-icon" />
                      <select
                        value={gameSelected}
                        onChange={(e) => setGameSelected(e.target.value)}
                        className="custom-dropdown-select"
                        required
                      >
                        <option value="" disabled>
                          Select a game
                        </option>
                        {games.map((game) => (
                          <option key={game.gameId} value={game.title}>
                            {game.title}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="dropdown-arrow" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Rating*</label>
                  <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= (hoverRating || rating) ? "active" : ""}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <FaStar />
                      </button>
                    ))}
                    <span className="rating-text">
                      {rating ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1] : "Click to rate"}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Title*</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="form-input"
                      placeholder="Summarize your experience"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Review*</label>
                  <div className="input-wrapper">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="form-textarea"
                      placeholder="Share the details of your experience"
                      rows="5"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Add Photos (Optional)</label>
                  <div className="photo-upload-container">
                    <input
                      type="file"
                      id="photo-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="photo-upload-input"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="photo-upload" className="upload-btn">
                      <FaCamera className="upload-icon" />
                      <span>{uploadingImages ? "Uploading..." : "Upload Photos"}</span>
                    </label>
                    <span className="upload-hint">You can upload up to 3 photos (Max 5MB each)</span>

                    {/* Image Previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="image-previews">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="image-preview">
                            <img src={url || "/placeholder.svg"} alt={`Preview ${index + 1}`} />
                            <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <>
                      <FaPaperPlane className="btn-icon" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
        {/* Game Details Popup */}
        <GameDetailsPopup isOpen={showDetailsPopup} onClose={() => setShowDetailsPopup(false)} game={selectedGame} />
      </div>
    </>
  )
}

export default ReviewPage



