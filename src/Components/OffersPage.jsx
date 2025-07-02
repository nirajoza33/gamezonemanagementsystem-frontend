// // "use client"

// // import { useState, useEffect } from "react"
// // import axios from "axios"
// // import "../css/Offers.css"
// // import Navbar from "./Navbar"
// // import {
// //   FaGift,
// //   FaPercent,
// //   FaStar,
// //   FaClock,
// //   FaUsers,
// //   FaCalendarAlt,
// //   FaFire,
// //   FaTags,
// //   FaGamepad,
// //   FaHeart,
// //   FaShare,
// //   FaCrown,
// //   FaBolt,
// //   FaRocket,
// //   FaMagic,
// //   FaSpinner,
// //   FaExclamationTriangle,
// // } from "react-icons/fa"

// // const OffersPage = () => {
// //   const [activeFilter, setActiveFilter] = useState("all")
// //   const [filteredOffers, setFilteredOffers] = useState([])
// //   const [allOffers, setAllOffers] = useState([])
// //   const [favorites, setFavorites] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState(null)

// //   const apiBase = "https://localhost:7186/api/TblOffers"

// //   // Category mapping for display
// //   const categories = [
// //     { id: "all", label: "All Offers", icon: <FaTags /> },
// //     { id: "weekend", label: "Weekend", icon: <FaCalendarAlt /> },
// //     { id: "student", label: "Student", icon: <FaUsers /> },
// //     { id: "birthday", label: "Birthday", icon: <FaGift /> },
// //     { id: "corporate", label: "Corporate", icon: <FaUsers /> },
// //     { id: "family", label: "Family", icon: <FaHeart /> },
// //     { id: "vr", label: "VR Special", icon: <FaGamepad /> },
// //     { id: "happy-hour", label: "Happy Hour", icon: <FaClock /> },
// //     { id: "midnight", label: "Midnight", icon: <FaClock /> },
// //   ]

// //   // Gradient mapping for different categories
// //   const categoryGradients = {
// //     weekend: "from-purple-500 via-pink-500 to-red-500",
// //     student: "from-blue-500 via-cyan-500 to-teal-500",
// //     birthday: "from-yellow-500 via-orange-500 to-red-500",
// //     corporate: "from-green-500 via-emerald-500 to-teal-500",
// //     family: "from-pink-500 via-rose-500 to-red-500",
// //     vr: "from-cyan-500 via-blue-500 to-indigo-500",
// //     "happy-hour": "from-indigo-500 via-purple-500 to-pink-500",
// //     midnight: "from-gray-700 via-gray-800 to-black",
// //   }

// //   // Accent color mapping for different categories
// //   const categoryAccentColors = {
// //     weekend: "#8b5cf6",
// //     student: "#3b82f6",
// //     birthday: "#f59e0b",
// //     corporate: "#10b981",
// //     family: "#ec4899",
// //     vr: "#06b6d4",
// //     "happy-hour": "#6366f1",
// //     midnight: "#374151",
// //   }

// //   // Fetch all active offers from all users
// //   const fetchAllOffers = async () => {
// //     setLoading(true)
// //     setError(null)
// //     try {
// //       // Since we need offers from all users, we'll need to modify this
// //       // For now, let's fetch from a general endpoint or modify the API
// //       const response = await axios.get(`${apiBase}`)

// //       // Transform API data to match component format
// //       const transformedOffers = response.data
// //         .filter((offer) => offer.status && new Date(offer.validUntil) >= new Date()) // Only active and valid offers
// //         .map((offer) => ({
// //           id: offer.offerId,
// //           title: offer.title,
// //           description: offer.description,
// //           discount: offer.discountType === "percentage" ? `${offer.discountValue}%` : `₹${offer.discountValue} OFF`,
// //           originalPrice: Number.parseFloat(offer.originalPrice),
// //           discountedPrice: Number.parseFloat(offer.discountedPrice),
// //           category: offer.category,
// //           type: offer.discountType,
// //           validUntil: offer.validUntil,
// //           featured: offer.isFeatured,
// //           trending: offer.isTrending,
// //           games: offer.gamesIncluded || [],
// //           terms: offer.terms || [],
// //           image: offer.imageUrl
// //             ? `https://localhost:7186/uploads/${offer.imageUrl}`
// //             : "/placeholder.svg?height=300&width=400",
// //           gradient:
// //             offer.gradientClass || categoryGradients[offer.category] || "from-purple-500 via-pink-500 to-red-500",
// //           accentColor: offer.accentColor || categoryAccentColors[offer.category] || "#8b5cf6",
// //           icon: offer.icon || getDefaultIcon(offer.category),
// //           userId: offer.userId,
// //           createdDate: offer.createdDate,
// //         }))

// //       setAllOffers(transformedOffers)
// //       setFilteredOffers(transformedOffers)
// //     } catch (err) {
// //       console.error("Failed to fetch offers:", err)
// //       setError("Failed to load offers. Please try again later.")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Get default icon based on category
// //   const getDefaultIcon = (category) => {
// //     const iconMap = {
// //       weekend: "🎮",
// //       student: "🎓",
// //       birthday: "🎂",
// //       corporate: "🏢",
// //       family: "👨‍👩‍👧‍👦",
// //       vr: "🥽",
// //       "happy-hour": "⏰",
// //       midnight: "🌙",
// //     }
// //     return iconMap[category] || "🎮"
// //   }

// //   useEffect(() => {
// //     fetchAllOffers()
// //   }, [])

// //   useEffect(() => {
// //     if (activeFilter === "all") {
// //       setFilteredOffers(allOffers)
// //     } else {
// //       setFilteredOffers(allOffers.filter((offer) => offer.category === activeFilter))
// //     }
// //   }, [activeFilter, allOffers])

// //   const toggleFavorite = (offerId) => {
// //     setFavorites((prev) => (prev.includes(offerId) ? prev.filter((id) => id !== offerId) : [...prev, offerId]))
// //   }

// //   const calculateTimeLeft = (validUntil) => {
// //     const difference = +new Date(validUntil) - +new Date()
// //     if (difference > 0) {
// //       const days = Math.floor(difference / (1000 * 60 * 60 * 24))
// //       const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

// //       if (days > 0) return `${days} days left`
// //       if (hours > 0) return `${hours} hours left`
// //       return "Expires soon"
// //     }
// //     return "Expired"
// //   }

// //   const getMaxDiscount = () => {
// //     if (allOffers.length === 0) return "0"
// //     const maxDiscount = Math.max(
// //       ...allOffers.map((offer) => (offer.type === "percentage" ? Number.parseFloat(offer.discount) : 0)),
// //     )
// //     return maxDiscount > 0 ? `${maxDiscount}` : "50"
// //   }

// //   const getActiveOffersCount = () => {
// //     return allOffers.filter((offer) => new Date(offer.validUntil) >= new Date()).length
// //   }

// //   // Loading state
// //   if (loading) {
// //     return (
// //       <>
// //         <Navbar />
// //         <div className="offers-page">
// //           <div className="offers-loading">
// //             <div className="loading-container">
// //               <FaSpinner className="loading-spinner" />
// //               <h2>Loading Amazing Offers...</h2>
// //               <p>Please wait while we fetch the latest deals for you</p>
// //             </div>
// //           </div>
// //         </div>
// //       </>
// //     )
// //   }

// //   // Error state
// //   if (error) {
// //     return (
// //       <>
// //         <Navbar />
// //         <div className="offers-page">
// //           <div className="offers-error">
// //             <div className="error-container">
// //               <FaExclamationTriangle className="error-icon" />
// //               <h2>Oops! Something went wrong</h2>
// //               <p>{error}</p>
// //               <button className="retry-btn" onClick={fetchAllOffers}>
// //                 <FaRocket className="btn-icon" />
// //                 Try Again
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </>
// //     )
// //   }

// //   return (
// //     <>
// //       <Navbar />
// //       <div className="offers-page">
// //         {/* Background Effects */}
// //         <div className="offers-bg-overlay"></div>
// //         <div className="offers-bg-pattern"></div>
// //         <div className="offers-floating-elements">
// //           <div className="floating-orb orb-1"></div>
// //           <div className="floating-orb orb-2"></div>
// //           <div className="floating-orb orb-3"></div>
// //           <div className="floating-orb orb-4"></div>
// //           <div className="floating-orb orb-5"></div>
// //         </div>

// //         {/* Hero Section */}
// //         <section className="offers-hero">
// //           <div className="hero-content">
// //             <div className="hero-badge">
// //               <span>Exclusive Offers</span>
// //             </div>
// //             <h1 className="hero-title">
// //               <span className="title-line-1">Amazing Deals</span>
// //               <span className="title-line-2">& Special Offers</span>
// //             </h1>
// //             <p className="hero-subtitle">
// //               Discover incredible savings on your favorite games and experiences. Limited time offers that make gaming
// //               even more exciting!
// //             </p>
// //             <div className="hero-stats">
// //               <div className="stat-item">
// //                 <div className="stat-number">{getMaxDiscount()}%</div>
// //                 <div className="stat-label">Max Discount</div>
// //               </div>
// //               <div className="stat-item">
// //                 <div className="stat-number">{getActiveOffersCount()}+</div>
// //                 <div className="stat-label">Active Offers</div>
// //               </div>
// //               <div className="stat-item">
// //                 <div className="stat-number">24/7</div>
// //                 <div className="stat-label">Available</div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Filters Section */}
// //         <section className="offers-filters">
// //           <div className="filters-container">
// //             <div className="filters-header">
// //               <h2 className="filters-title">Browse by Category</h2>
// //               <p className="filters-subtitle">Find the perfect offer for your gaming needs</p>
// //             </div>
// //             <div className="category-filters">
// //               {categories.map((category) => {
// //                 const categoryCount =
// //                   category.id === "all"
// //                     ? allOffers.length
// //                     : allOffers.filter((offer) => offer.category === category.id).length

// //                 // Only show categories that have offers
// //                 if (category.id !== "all" && categoryCount === 0) return null

// //                 return (
// //                   <button
// //                     key={category.id}
// //                     className={`category-btn ${activeFilter === category.id ? "active" : ""}`}
// //                     onClick={() => setActiveFilter(category.id)}
// //                   >
// //                     <span className="category-icon">{category.icon}</span>
// //                     <span className="category-label">{category.label}</span>
// //                     <span className="category-count">({categoryCount})</span>
// //                     <div className="category-glow"></div>
// //                   </button>
// //                 )
// //               })}
// //             </div>
// //           </div>
// //         </section>

// //         {/* Offers Grid */}
// //         <section className="offers-grid-section">
// //           <div className="offers-container">
// //             <div className="offers-header">
// //               <h2 className="section-title">
// //                 <span className="title-highlight">{filteredOffers.length}</span> Offer
// //                 {filteredOffers.length !== 1 ? "s" : ""} Available
// //               </h2>
// //               {activeFilter !== "all" && (
// //                 <div className="active-filter-badge">
// //                   <span>Category: {categories.find((c) => c.id === activeFilter)?.label}</span>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="offers-grid">
// //               {filteredOffers.map((offer, index) => (
// //                 <div
// //                   key={offer.id}
// //                   className={`offer-card ${offer.featured ? "featured" : ""}`}
// //                   style={{ "--accent-color": offer.accentColor, "--animation-delay": `${index * 0.1}s` }}
// //                 >
// //                   {/* Card Background Effects */}
// //                   <div className="card-bg-gradient"></div>
// //                   <div className="card-glow-effect"></div>

// //                   {/* Status Badges */}
// //                   <div className="status-badges">
// //                     {offer.featured && (
// //                       <div className="featured-badge">
// //                         <FaCrown />
// //                         <span>Featured</span>
// //                       </div>
// //                     )}
// //                     {offer.trending && (
// //                       <div className="trending-badge">
// //                         <FaFire />
// //                         <span>Trending</span>
// //                       </div>
// //                     )}
// //                   </div>

// //                   {/* Image Container */}
// //                   <div className="offer-image-container">
// //                     <div className="image-wrapper">
// //                       <img
// //                         src={offer.image || "/placeholder.svg"}
// //                         alt={offer.title}
// //                         className="offer-image"
// //                         onError={(e) => {
// //                           e.target.src = "/placeholder.svg?height=300&width=400"
// //                         }}
// //                       />
// //                       <div className={`dynamic-overlay bg-gradient-to-br ${offer.gradient}`}></div>
// //                       <div className="image-shine"></div>
// //                     </div>

// //                     {/* Floating Icon */}
// //                     <div className="floating-offer-icon">
// //                       <span className="offer-emoji">{offer.icon}</span>
// //                     </div>

// //                     {/* Card Actions */}
// //                     <div className="offer-card-actions">
// //                       <button
// //                         className={`action-btn favorite-btn ${favorites.includes(offer.id) ? "active" : ""}`}
// //                         onClick={() => toggleFavorite(offer.id)}
// //                       >
// //                         <FaHeart />
// //                       </button>
// //                       <button className="action-btn share-btn">
// //                         <FaShare />
// //                       </button>
// //                     </div>

// //                     {/* Discount Badge */}
// //                     <div className="discount-badge">
// //                       <div className="discount-text">
// //                         <FaBolt className="discount-icon" />
// //                         {offer.discount}
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Card Content */}
// //                   <div className="offer-card-content">
// //                     <div className="content-header">
// //                       <div className="offer-category-badge">
// //                         <span>{categories.find((c) => c.id === offer.category)?.label}</span>
// //                       </div>
// //                       <div className="validity-badge">
// //                         <FaClock className="clock-icon" />
// //                         <span>{calculateTimeLeft(offer.validUntil)}</span>
// //                       </div>
// //                     </div>

// //                     <h3 className="offer-title">{offer.title}</h3>
// //                     <p className="offer-description">{offer.description}</p>

// //                     {/* Games Included */}
// //                     {offer.games && offer.games.length > 0 && (
// //                       <div className="games-included">
// //                         <h4 className="games-title">
// //                           <FaGamepad className="games-icon" />
// //                           Includes:
// //                         </h4>
// //                         <div className="games-list">
// //                           {offer.games.slice(0, 3).map((game, gameIndex) => (
// //                             <span
// //                               key={`${offer.id}-${gameIndex}`}
// //                               className="game-tag"
// //                               style={{ "--tag-delay": `${gameIndex * 0.1}s` }}
// //                             >
// //                               <FaMagic className="tag-icon" />
// //                               {game}
// //                             </span>
// //                           ))}
// //                           {offer.games.length > 3 && <span className="more-games">+{offer.games.length - 3} more</span>}
// //                         </div>
// //                       </div>
// //                     )}

// //                     {/* Pricing */}
// //                     <div className="pricing-section">
// //                       <div className="price-comparison">
// //                         <div className="original-price">₹{offer.originalPrice}</div>
// //                         <div className="discounted-price">₹{offer.discountedPrice}</div>
// //                       </div>
// //                       <div className="savings-amount">
// //                         You Save: ₹{(offer.originalPrice - offer.discountedPrice).toFixed(2)}
// //                       </div>
// //                     </div>

// //                     {/* Terms Preview */}
// //                     {offer.terms && offer.terms.length > 0 && (
// //                       <div className="terms-preview">
// //                         <div className="terms-header">
// //                           <FaPercent className="terms-icon" />
// //                           <span>Terms & Conditions</span>
// //                         </div>
// //                         <ul className="terms-list">
// //                           {offer.terms.slice(0, 2).map((term, termIndex) => (
// //                             <li key={termIndex} className="term-item">
// //                               {term}
// //                             </li>
// //                           ))}
// //                           {offer.terms.length > 2 && (
// //                             <li className="term-item">+{offer.terms.length - 2} more terms</li>
// //                           )}
// //                         </ul>
// //                       </div>
// //                     )}

// //                     {/* Action Button */}
// //                     <div className="offer-footer">
// //                       <button className="claim-offer-btn">
// //                         <FaRocket className="btn-icon" />
// //                         <span>Claim Offer</span>
// //                         <div className="btn-glow"></div>
// //                       </button>
// //                     </div>
// //                   </div>

// //                   {/* Hover Effect */}
// //                   <div className="card-hover-effect"></div>
// //                 </div>
// //               ))}
// //             </div>

// //             {filteredOffers.length === 0 && !loading && (
// //               <div className="no-offers">
// //                 <div className="no-offers-icon">
// //                   <FaGift />
// //                 </div>
// //                 <h3>No offers found</h3>
// //                 <p>
// //                   {activeFilter === "all"
// //                     ? "No offers are currently available. Check back soon for amazing deals!"
// //                     : "No offers found in this category. Try selecting a different category to see more offers."}
// //                 </p>
// //                 <button className="reset-filters-btn" onClick={() => setActiveFilter("all")}>
// //                   <span>View All Offers</span>
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </section>

// //         {/* Newsletter Section */}
// //         <section className="newsletter-section">
// //           <div className="newsletter-container">
// //             <div className="newsletter-content">
// //               <div className="newsletter-icon">
// //                 <FaStar />
// //               </div>
// //               <h2 className="newsletter-title">Never Miss an Offer!</h2>
// //               <p className="newsletter-subtitle">
// //                 Subscribe to our newsletter and be the first to know about exclusive deals and special promotions.
// //               </p>
// //               <div className="newsletter-form">
// //                 <input type="email" placeholder="Enter your email address" className="newsletter-input" />
// //                 <button className="newsletter-btn">
// //                   <span>Subscribe</span>
// //                   <FaRocket className="btn-icon" />
// //                 </button>
// //               </div>
// //               <p className="newsletter-disclaimer">We respect your privacy. Unsubscribe at any time.</p>
// //             </div>
// //           </div>
// //         </section>
// //       </div>
// //     </>
// //   )
// // }

// // export default OffersPage



// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import "../css/Offers.css"
// import Navbar from "./Navbar"
// import { useNavigate } from "react-router-dom"
// import { getUserInfo } from "../auth/JwtUtils"
// import LoginPopup from "./LoginPopup"
// import toast, { Toaster } from "react-hot-toast"
// import {
//   FaGift,
//   FaStar,
//   FaClock,
//   FaUsers,
//   FaCalendarAlt,
//   FaFire,
//   FaTags,
//   FaGamepad,
//   FaHeart,
//   FaShare,
//   FaCrown,
//   FaBolt,
//   FaRocket,
//   FaMagic,
//   FaSpinner,
//   FaExclamationTriangle,
//   FaCheck,
//   FaTicketAlt,
//   FaTimes,
//   FaClipboard,
//   FaBookmark,
//   FaCheckCircle,
// } from "react-icons/fa"

// const EnhancedOffersPage = () => {
//   const navigate = useNavigate()
//   const userInfo = getUserInfo()
//   const userId = userInfo?.UserId || null

//   const [activeFilter, setActiveFilter] = useState("all")
//   const [filteredOffers, setFilteredOffers] = useState([])
//   const [allOffers, setAllOffers] = useState([])
//   const [favorites, setFavorites] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [claimingOffers, setClaimingOffers] = useState(new Set())
//   const [claimedOffers, setClaimedOffers] = useState(new Set())
//   const [showLoginPopup, setShowLoginPopup] = useState(false)
//   const [showClaimModal, setShowClaimModal] = useState(false)
//   const [claimModalData, setClaimModalData] = useState(null)

//   const apiBase = "https://localhost:7186/api"

//   // Category mapping for display
//   const categories = [
//     { id: "all", label: "All Offers", icon: <FaTags /> },
//     { id: "weekend", label: "Weekend", icon: <FaCalendarAlt /> },
//     { id: "student", label: "Student", icon: <FaUsers /> },
//     { id: "birthday", label: "Birthday", icon: <FaGift /> },
//     { id: "corporate", label: "Corporate", icon: <FaUsers /> },
//     { id: "family", label: "Family", icon: <FaHeart /> },
//     { id: "vr", label: "VR Special", icon: <FaGamepad /> },
//     { id: "happy-hour", label: "Happy Hour", icon: <FaClock /> },
//     { id: "midnight", label: "Midnight", icon: <FaClock /> },
//   ]

//   // Enhanced gradient mapping
//   const categoryGradients = {
//     weekend: "from-purple-600 via-pink-600 to-red-500",
//     student: "from-blue-600 via-cyan-500 to-teal-500",
//     birthday: "from-yellow-500 via-orange-500 to-red-500",
//     corporate: "from-green-600 via-emerald-500 to-teal-500",
//     family: "from-pink-600 via-rose-500 to-red-500",
//     vr: "from-cyan-600 via-blue-500 to-indigo-600",
//     "happy-hour": "from-indigo-600 via-purple-600 to-pink-500",
//     midnight: "from-gray-800 via-gray-900 to-black",
//   }

//   // Fetch all active offers
//   const fetchAllOffers = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await axios.get(`${apiBase}/TblOffers`)

//       const transformedOffers = response.data
//         .filter((offer) => offer.status && new Date(offer.validUntil) >= new Date())
//         .map((offer) => ({
//           id: offer.offerId,
//           title: offer.title,
//           description: offer.description,
//           discount: offer.discountType === "percentage" ? `${offer.discountValue}%` : `₹${offer.discountValue} OFF`,
//           originalPrice: Number.parseFloat(offer.originalPrice),
//           discountedPrice: Number.parseFloat(offer.discountedPrice),
//           category: offer.category,
//           type: offer.discountType,
//           discountValue: offer.discountValue,
//           validUntil: offer.validUntil,
//           featured: offer.isFeatured,
//           trending: offer.isTrending,
//           games: offer.gamesIncluded || [],
//           terms: offer.terms || [],
//           image: offer.imageUrl ? `${apiBase}/uploads/${offer.imageUrl}` : "/placeholder.svg?height=300&width=400",
//           gradient:
//             offer.gradientClass || categoryGradients[offer.category] || "from-purple-600 via-pink-600 to-red-500",
//           icon: offer.icon || getDefaultIcon(offer.category),
//           userId: offer.userId,
//           createdDate: offer.createdDate,
//         }))

//       setAllOffers(transformedOffers)
//       setFilteredOffers(transformedOffers)
//     } catch (err) {
//       console.error("Failed to fetch offers:", err)
//       setError("Failed to load offers. Please try again later.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch user's claimed offers
//   const fetchUserClaimedOffers = async () => {
//     if (!userId) return

//     try {
//       const response = await axios.get(`${apiBase}/TblClaimedOffers/ByUser/${userId}`)

//       if (response.data && Array.isArray(response.data)) {
//         const claimedOfferIds = new Set(response.data.map((offer) => offer.offerId))
//         setClaimedOffers(claimedOfferIds)
//       }
//     } catch (err) {
//       console.error("Failed to fetch claimed offers:", err)
//     }
//   }

//   // Get default icon based on category
//   const getDefaultIcon = (category) => {
//     const iconMap = {
//       weekend: "🎮",
//       student: "🎓",
//       birthday: "🎂",
//       corporate: "🏢",
//       family: "👨‍👩‍👧‍👦",
//       vr: "🥽",
//       "happy-hour": "⏰",
//       midnight: "🌙",
//     }
//     return iconMap[category] || "🎮"
//   }

//   useEffect(() => {
//     fetchAllOffers()
//     fetchUserClaimedOffers()
//   }, [userId])

//   useEffect(() => {
//     if (activeFilter === "all") {
//       setFilteredOffers(allOffers)
//     } else {
//       setFilteredOffers(allOffers.filter((offer) => offer.category === activeFilter))
//     }
//   }, [activeFilter, allOffers])

//   const toggleFavorite = (offerId) => {
//     setFavorites((prev) => (prev.includes(offerId) ? prev.filter((id) => id !== offerId) : [...prev, offerId]))
//   }

//   const calculateTimeLeft = (validUntil) => {
//     const difference = +new Date(validUntil) - +new Date()
//     if (difference > 0) {
//       const days = Math.floor(difference / (1000 * 60 * 60 * 24))
//       const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

//       if (days > 0) return `${days} days left`
//       if (hours > 0) return `${hours} hours left`
//       return "Expires soon"
//     }
//     return "Expired"
//   }

//   const getMaxDiscount = () => {
//     if (allOffers.length === 0) return "0"
//     const maxDiscount = Math.max(
//       ...allOffers.map((offer) => (offer.type === "percentage" ? Number.parseFloat(offer.discountValue) : 0)),
//     )
//     return maxDiscount > 0 ? `${maxDiscount}` : "50"
//   }

//   const getActiveOffersCount = () => {
//     return allOffers.filter((offer) => new Date(offer.validUntil) >= new Date()).length
//   }

//   // Claim offer functionality
//   const claimOffer = async (offer) => {
//     if (!userId) {
//       setShowLoginPopup(true)
//       return
//     }

//     if (claimingOffers.has(offer.id) || claimedOffers.has(offer.id)) {
//       return
//     }

//     setClaimingOffers((prev) => new Set([...prev, offer.id]))
//     toast.loading("Claiming offer...")

//     try {
//       const response = await axios.post(`${apiBase}/TblClaimedOffers/Claim`, {
//         userId: userId,
//         offerId: offer.id,
//       })

//       if (response.data && response.data.success) {
//         setClaimedOffers((prev) => new Set([...prev, offer.id]))

//         // Show success modal with claimed offer details
//         setClaimModalData({
//           ...response.data.data,
//           offerTitle: offer.title,
//           discount: offer.discount,
//           games: offer.games,
//           validUntil: offer.validUntil,
//         })
//         setShowClaimModal(true)

//         toast.dismiss()
//         toast.success("Offer claimed successfully!")
//       } else {
//         toast.dismiss()
//         toast.error(response.data?.message || "Failed to claim offer")
//       }
//     } catch (error) {
//       console.error("Failed to claim offer:", error)
//       toast.dismiss()
//       toast.error(error.response?.data?.message || "Failed to claim offer. Please try again.")
//     } finally {
//       setClaimingOffers((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(offer.id)
//         return newSet
//       })
//     }
//   }

//   const closeClaimModal = () => {
//     setShowClaimModal(false)
//     setClaimModalData(null)
//   }

//   const handleCloseLoginPopup = () => {
//     setShowLoginPopup(false)
//   }

//   const viewClaimedOffers = () => {
//     navigate("/my-offers")
//   }

//   const bookWithOffer = (gameId) => {
//     navigate("/booking", { state: { gameId, useOffer: true } })
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   // Loading state
//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="offers-page">
//           <div className="offers-loading">
//             <div className="loading-container">
//               <FaSpinner className="loading-spinner" />
//               <h2>Loading Amazing Offers...</h2>
//               <p>Please wait while we fetch the latest deals for you</p>
//             </div>
//           </div>
//         </div>
//       </>
//     )
//   }

//   // Error state
//   if (error) {
//     return (
//       <>
//         <Navbar />
//         <div className="offers-page">
//           <div className="offers-error">
//             <div className="error-container">
//               <FaExclamationTriangle className="error-icon" />
//               <h2>Oops! Something went wrong</h2>
//               <p>{error}</p>
//               <button className="retry-btn" onClick={fetchAllOffers}>
//                 <FaRocket className="btn-icon" />
//                 Try Again
//               </button>
//             </div>
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

//       {/* Login Popup */}
//       <LoginPopup
//         isOpen={showLoginPopup}
//         onClose={handleCloseLoginPopup}
//         message="Please login to claim this offer"
//         redirectPath="/offers"
//       />

//       <div className="offers-page">
//         {/* Background Effects */}
//         <div className="offers-bg-overlay"></div>
//         <div className="floating-particles">
//           <div className="particle"></div>
//           <div className="particle"></div>
//           <div className="particle"></div>
//           <div className="particle"></div>
//           <div className="particle"></div>
//         </div>

//         {/* Hero Section */}
//         <section className="offers-hero">
//           <div className="hero-content">
//             <div className="hero-badge">
//               <FaStar />
//               <span>Exclusive Gaming Offers</span>
//             </div>
//             <h1 className="hero-title">
//               <span className="title-gradient">Incredible Deals</span>
//               <br />
//               <span className="title-gradient">Await You!</span>
//             </h1>
//             <p className="hero-subtitle">
//               Discover unbeatable savings on your favorite games and experiences. Limited-time offers designed to
//               maximize your fun while minimizing costs!
//             </p>
//             <div className="hero-stats">
//               <div className="stat-item">
//                 <div className="stat-number">{getMaxDiscount()}%</div>
//                 <div className="stat-label">Max Discount</div>
//               </div>
//               <div className="stat-item">
//                 <div className="stat-number">{getActiveOffersCount()}+</div>
//                 <div className="stat-label">Active Offers</div>
//               </div>
//               <div className="stat-item">
//                 <div className="stat-number">24/7</div>
//                 <div className="stat-label">Available</div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* My Offers Button */}
//         {userId && (
//           <div className="my-offers-button-container">
//             <button className="my-offers-button" onClick={viewClaimedOffers}>
//               <FaBookmark className="my-offers-icon" />
//               <span>My Claimed Offers</span>
//             </button>
//           </div>
//         )}

//         {/* Category Filters */}
//         <section className="offers-filters">
//           <div className="filters-container">
//             <div className="filters-header">
//               <h2 className="filters-title">Browse by Category</h2>
//               <p className="filters-subtitle">Find the perfect offer tailored to your gaming preferences</p>
//             </div>
//             <div className="category-filters">
//               {categories.map((category) => {
//                 const categoryCount =
//                   category.id === "all"
//                     ? allOffers.length
//                     : allOffers.filter((offer) => offer.category === category.id).length

//                 if (category.id !== "all" && categoryCount === 0) return null

//                 return (
//                   <button
//                     key={category.id}
//                     className={`category-btn ${activeFilter === category.id ? "active" : ""}`}
//                     onClick={() => setActiveFilter(category.id)}
//                   >
//                     <span className="category-icon">{category.icon}</span>
//                     <span className="category-label">{category.label}</span>
//                     <span className="category-count">({categoryCount})</span>
//                   </button>
//                 )
//               })}
//             </div>
//           </div>
//         </section>

//         {/* Enhanced Offers Grid */}
//         <section className="offers-grid-section">
//           <div className="offers-container">
//             <div className="offers-header">
//               <h2 className="section-title">
//                 <span className="title-highlight">{filteredOffers.length}</span> Premium Offer
//                 {filteredOffers.length !== 1 ? "s" : ""} Available
//               </h2>
//               {activeFilter !== "all" && (
//                 <div className="active-filter-badge">
//                   <span>Category: {categories.find((c) => c.id === activeFilter)?.label}</span>
//                 </div>
//               )}
//             </div>

//             <div className="offers-grid">
//               {filteredOffers.map((offer, index) => (
//                 <div
//                   key={offer.id}
//                   className={`offer-card ${offer.featured ? "featured" : ""}`}
//                   style={{ "--animation-delay": `${index * 0.1}s` }}
//                 >
//                   {/* Status Badges */}
//                   <div className="status-badges">
//                     {offer.featured && (
//                       <div className="featured-badge">
//                         <FaCrown />
//                         <span>Featured</span>
//                       </div>
//                     )}
//                     {offer.trending && (
//                       <div className="trending-badge">
//                         <FaFire />
//                         <span>Trending</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Enhanced Image Container */}
//                   <div className="offer-image-container">
//                     <img
//                       src={offer.image || "/placeholder.svg?height=320&width=420"}
//                       alt={offer.title}
//                       className="offer-image"
//                       onError={(e) => {
//                         e.target.src = "/placeholder.svg?height=320&width=420"
//                       }}
//                     />
//                     <div className={`dynamic-overlay bg-gradient-to-br ${offer.gradient}`}></div>

//                     {/* Floating Icon */}
//                     <div className="floating-offer-icon">
//                       <span className="offer-emoji">{offer.icon}</span>
//                     </div>

//                     {/* Card Actions */}
//                     <div className="offer-card-actions">
//                       <button
//                         className={`action-btn favorite-btn ${favorites.includes(offer.id) ? "active" : ""}`}
//                         onClick={() => toggleFavorite(offer.id)}
//                       >
//                         <FaHeart />
//                       </button>
//                       <button className="action-btn share-btn">
//                         <FaShare />
//                       </button>
//                     </div>

//                     {/* Enhanced Discount Badge */}
//                     <div className="discount-badge">
//                       <div className="discount-text">
//                         <FaBolt className="discount-icon" />
//                         {offer.discount}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Enhanced Card Content */}
//                   <div className="offer-card-content">
//                     <div className="content-header">
//                       <div className="offer-category-badge">
//                         <span>{categories.find((c) => c.id === offer.category)?.label}</span>
//                       </div>
//                       <div className="validity-badge">
//                         <FaClock className="clock-icon" />
//                         <span>{calculateTimeLeft(offer.validUntil)}</span>
//                       </div>
//                     </div>

//                     <h3 className="offer-title">{offer.title}</h3>
//                     <p className="offer-description">{offer.description}</p>

//                     {/* Games Included */}
//                     {offer.games && offer.games.length > 0 && (
//                       <div className="games-included">
//                         <h4 className="games-title">
//                           <FaGamepad className="games-icon" />
//                           Includes:
//                         </h4>
//                         <div className="games-list">
//                           {offer.games.slice(0, 3).map((game, gameIndex) => (
//                             <span
//                               key={`${offer.id}-${gameIndex}`}
//                               className="game-tag"
//                               style={{ "--tag-delay": `${gameIndex * 0.1}s` }}
//                             >
//                               <FaMagic className="tag-icon" />
//                               {game}
//                             </span>
//                           ))}
//                           {offer.games.length > 3 && <span className="more-games">+{offer.games.length - 3} more</span>}
//                         </div>
//                       </div>
//                     )}

//                     {/* Enhanced Pricing */}
//                     <div className="pricing-section">
//                       <div className="price-comparison">
//                         <div className="original-price">₹{offer.originalPrice}</div>
//                         <div className="discounted-price">₹{offer.discountedPrice}</div>
//                       </div>
//                       <div className="savings-amount">
//                         You Save: ₹{(offer.originalPrice - offer.discountedPrice).toFixed(2)}
//                       </div>
//                     </div>

//                     {/* Enhanced Claim Button */}
//                     <div className="offer-footer">
//                       <button
//                         className={`claim-offer-btn ${claimingOffers.has(offer.id) ? "claiming" : ""} ${
//                           claimedOffers.has(offer.id) ? "claimed" : ""
//                         }`}
//                         onClick={() => claimOffer(offer)}
//                         disabled={claimingOffers.has(offer.id) || claimedOffers.has(offer.id)}
//                       >
//                         {claimingOffers.has(offer.id) ? (
//                           <>
//                             <div className="btn-spinner"></div>
//                             <span>Claiming...</span>
//                           </>
//                         ) : claimedOffers.has(offer.id) ? (
//                           <>
//                             <FaCheck className="btn-icon" />
//                             <span>Claimed</span>
//                           </>
//                         ) : (
//                           <>
//                             <FaTicketAlt className="btn-icon" />
//                             <span>Claim Offer</span>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredOffers.length === 0 && !loading && (
//               <div className="no-offers">
//                 <div className="no-offers-icon">
//                   <FaGift />
//                 </div>
//                 <h3>No offers found</h3>
//                 <p>
//                   {activeFilter === "all"
//                     ? "No offers are currently available. Check back soon for amazing deals!"
//                     : "No offers found in this category. Try selecting a different category to see more offers."}
//                 </p>
//                 <button className="reset-filters-btn" onClick={() => setActiveFilter("all")}>
//                   <span>View All Offers</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Claim Success Modal */}
//         {showClaimModal && claimModalData && (
//           <div className="claim-modal-overlay" onClick={closeClaimModal}>
//             <div className="claim-modal" onClick={(e) => e.stopPropagation()}>
//               <button
//                 className="modal-close-btn-x"
//                 onClick={closeClaimModal}
//                 style={{
//                   position: "absolute",
//                   top: "1rem",
//                   right: "1rem",
//                   background: "none",
//                   border: "none",
//                   color: "var(--text-secondary)",
//                   fontSize: "1.5rem",
//                   cursor: "pointer",
//                 }}
//               >
//                 <FaTimes />
//               </button>

//               <div className="modal-icon">
//                 <FaCheckCircle />
//               </div>

//               <h2 className="modal-title">Offer Claimed Successfully!</h2>

//               <div className="modal-message">
//                 <p>
//                   <strong>Offer:</strong> {claimModalData.offerTitle}
//                 </p>
//                 <p>
//                   <strong>Your Code:</strong>{" "}
//                   <code
//                     style={{
//                       background: "var(--primary-gold)",
//                       color: "#1a1a1a",
//                       padding: "0.5rem 1rem",
//                       borderRadius: "8px",
//                       fontWeight: "bold",
//                       fontSize: "1.2rem",
//                     }}
//                   >
//                     {claimModalData.offerCode}
//                   </code>
//                 </p>
//                 <p>
//                   <strong>Discount:</strong> {claimModalData.discount}
//                 </p>
//                 <p>
//                   <strong>Valid Until:</strong> {formatDate(claimModalData.validUntil)}
//                 </p>

//                 {claimModalData.games && claimModalData.games.length > 0 && (
//                   <div className="modal-games">
//                     <p>
//                       <strong>Applicable Games:</strong>
//                     </p>
//                     <div className="modal-games-list">
//                       {claimModalData.games.map((game, index) => (
//                         <span key={index} className="modal-game-tag">
//                           <FaGamepad className="modal-game-icon" />
//                           {game}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
//                   This offer has been added to your claimed offers. You can use it during checkout when booking
//                   applicable games.
//                 </p>
//               </div>

//               <div className="modal-actions">
//                 <button className="modal-action-btn primary" onClick={viewClaimedOffers}>
//                   <FaClipboard className="btn-icon" />
//                   View My Offers
//                 </button>
//                 <button className="modal-action-btn secondary" onClick={closeClaimModal}>
//                   Continue Browsing
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default EnhancedOffersPage



"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../css/Offers.css"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import { getUserInfo } from "../auth/JwtUtils"
import LoginPopup from "./LoginPopup"
import toast, { Toaster } from "react-hot-toast"
import {
  FaGift,
  FaStar,
  FaClock,
  FaUsers,
  FaCalendarAlt,
  FaFire,
  FaTags,
  FaGamepad,
  FaHeart,
  FaShare,
  FaCrown,
  FaBolt,
  FaRocket,
  FaMagic,
  FaSpinner,
  FaExclamationTriangle,
  FaCheck,
  FaTicketAlt,
  FaTimes,
  FaClipboard,
  FaBookmark,
  FaCheckCircle,
} from "react-icons/fa"

const OffersPage = () => {
  const navigate = useNavigate()
  const userInfo = getUserInfo()
  const userId = userInfo?.UserId || null

  const [activeFilter, setActiveFilter] = useState("all")
  const [filteredOffers, setFilteredOffers] = useState([])
  const [allOffers, setAllOffers] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [claimingOffers, setClaimingOffers] = useState(new Set())
  const [claimedOffers, setClaimedOffers] = useState(new Set())
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimModalData, setClaimModalData] = useState(null)

  const apiBase = "https://localhost:7186/api"

  // Category mapping for display
  const categories = [
    { id: "all", label: "All Offers", icon: <FaTags /> },
    { id: "weekend", label: "Weekend", icon: <FaCalendarAlt /> },
    { id: "student", label: "Student", icon: <FaUsers /> },
    { id: "birthday", label: "Birthday", icon: <FaGift /> },
    { id: "corporate", label: "Corporate", icon: <FaUsers /> },
    { id: "family", label: "Family", icon: <FaHeart /> },
    { id: "vr", label: "VR Special", icon: <FaGamepad /> },
    { id: "happy-hour", label: "Happy Hour", icon: <FaClock /> },
    { id: "midnight", label: "Midnight", icon: <FaClock /> },
  ]

  // Enhanced gradient mapping
  const categoryGradients = {
    weekend: "from-purple-600 via-pink-600 to-red-500",
    student: "from-blue-600 via-cyan-500 to-teal-500",
    birthday: "from-yellow-500 via-orange-500 to-red-500",
    corporate: "from-green-600 via-emerald-500 to-teal-500",
    family: "from-pink-600 via-rose-500 to-red-500",
    vr: "from-cyan-600 via-blue-500 to-indigo-600",
    "happy-hour": "from-indigo-600 via-purple-600 to-pink-500",
    midnight: "from-gray-800 via-gray-900 to-black",
  }

  // Fetch all active offers
  const fetchAllOffers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${apiBase}/TblOffers`)

      const transformedOffers = response.data
        .filter((offer) => offer.status && new Date(offer.validUntil) >= new Date())
        .map((offer) => ({
          id: offer.offerId,
          title: offer.title,
          description: offer.description,
          discount: offer.discountDisplay,
          category: offer.category,
          type: offer.discountType,
          discountValue: offer.discountValue,
          validUntil: offer.validUntil,
          featured: offer.isFeatured,
          trending: offer.isTrending,
          games: offer.gamesIncluded || [],
          terms: offer.terms || [],
          gradient:
            offer.gradientClass || categoryGradients[offer.category] || "from-purple-600 via-pink-600 to-red-500",
          icon: offer.icon || getDefaultIcon(offer.category),
          userId: offer.userId,
          createdDate: offer.createdDate,
        }))

      setAllOffers(transformedOffers)
      setFilteredOffers(transformedOffers)
    } catch (err) {
      console.error("Failed to fetch offers:", err)
      setError("Failed to load offers. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's claimed offers
  const fetchUserClaimedOffers = async () => {
    if (!userId) return

    try {
      const response = await axios.get(`${apiBase}/TblClaimedOffers/ByUser/${userId}`)

      if (response.data && Array.isArray(response.data)) {
        const claimedOfferIds = new Set(response.data.map((offer) => offer.offerId))
        setClaimedOffers(claimedOfferIds)
      }
    } catch (err) {
      console.error("Failed to fetch claimed offers:", err)
    }
  }

  // Get default icon based on category
  const getDefaultIcon = (category) => {
    const iconMap = {
      weekend: "🎮",
      student: "🎓",
      birthday: "🎂",
      corporate: "🏢",
      family: "👨‍👩‍👧‍👦",
      vr: "🥽",
      "happy-hour": "⏰",
      midnight: "🌙",
    }
    return iconMap[category] || "🎮"
  }

  useEffect(() => {
    fetchAllOffers()
    fetchUserClaimedOffers()
  }, [userId])

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredOffers(allOffers)
    } else {
      setFilteredOffers(allOffers.filter((offer) => offer.category === activeFilter))
    }
  }, [activeFilter, allOffers])

  const toggleFavorite = (offerId) => {
    setFavorites((prev) => (prev.includes(offerId) ? prev.filter((id) => id !== offerId) : [...prev, offerId]))
  }

  const calculateTimeLeft = (validUntil) => {
    const difference = +new Date(validUntil) - +new Date()
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) return `${days} days left`
      if (hours > 0) return `${hours} hours left`
      return "Expires soon"
    }
    return "Expired"
  }

  const getMaxDiscount = () => {
    if (allOffers.length === 0) return "0"
    const maxDiscount = Math.max(
      ...allOffers.map((offer) => (offer.type === "percentage" ? Number.parseFloat(offer.discountValue) : 0)),
    )
    return maxDiscount > 0 ? `${maxDiscount}` : "50"
  }

  const getActiveOffersCount = () => {
    return allOffers.filter((offer) => new Date(offer.validUntil) >= new Date()).length
  }

  // Claim offer functionality
  const claimOffer = async (offer) => {
    if (!userId) {
      setShowLoginPopup(true)
      return
    }

    if (claimingOffers.has(offer.id) || claimedOffers.has(offer.id)) {
      return
    }

    setClaimingOffers((prev) => new Set([...prev, offer.id]))
    toast.loading("Claiming offer...")

    try {
      const response = await axios.post(`${apiBase}/TblClaimedOffers/Claim`, {
        userId: userId,
        offerId: offer.id,
      })

      if (response.data && response.data.success) {
        setClaimedOffers((prev) => new Set([...prev, offer.id]))

        setClaimModalData({
          ...response.data.data,
          offerTitle: offer.title,
          discount: offer.discount,
          games: offer.games,
          validUntil: offer.validUntil,
        })
        setShowClaimModal(true)

        toast.dismiss()
        toast.success("Offer claimed successfully!")
      } else {
        toast.dismiss()
        toast.error(response.data?.message || "Failed to claim offer")
      }
    } catch (error) {
      console.error("Failed to claim offer:", error)
      toast.dismiss()
      toast.error(error.response?.data?.message || "Failed to claim offer. Please try again.")
    } finally {
      setClaimingOffers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(offer.id)
        return newSet
      })
    }
  }

  const closeClaimModal = () => {
    setShowClaimModal(false)
    setClaimModalData(null)
  }

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false)
  }

  const viewClaimedOffers = () => {
    navigate("/my-offers")
  }

  const bookWithOffer = (gameId) => {
    navigate("/booking", { state: { gameId, useOffer: true } })
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

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="enhanced-offers-page">
          <div className="enhanced-bg-overlay"></div>
          <div className="enhanced-bg-pattern"></div>
          <div className="enhanced-floating-elements">
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
          </div>
          <div className="offers-loading">
            <div className="loading-container">
              <FaSpinner className="loading-spinner" />
              <h2>Loading Amazing Offers...</h2>
              <p>Please wait while we fetch the latest deals for you</p>
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
        <div className="enhanced-offers-page">
          <div className="enhanced-bg-overlay"></div>
          <div className="enhanced-bg-pattern"></div>
          <div className="offers-error">
            <div className="error-container">
              <FaExclamationTriangle className="error-icon" />
              <h2>Oops! Something went wrong</h2>
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchAllOffers}>
                <FaRocket className="btn-icon" />
                Try Again
              </button>
            </div>
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

      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={handleCloseLoginPopup}
        message="Please login to claim this offer"
        redirectPath="/offers"
      />

      <div className="enhanced-offers-page">
        {/* Enhanced Background Effects */}
        <div className="enhanced-bg-overlay"></div>
        <div className="enhanced-bg-pattern"></div>
        <div className="enhanced-floating-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="floating-orb orb-5"></div>
          <div className="floating-orb orb-6"></div>
        </div>

        {/* Enhanced Hero Section */}
        <section className="enhanced-hero">
          <div className="hero-background">
            <div className="hero-gradient"></div>
            <div className="hero-particles"></div>
          </div>
          <div className="hero-content">
            <div className="hero-badge">
              <FaStar className="trophy-icon" />
              <span>Exclusive Gaming Offers</span>
            </div>
            <div className="hero-icon-wrapper">
              <div className="hero-icon-glow"></div>
              <div className="hero-icon">
                <FaGift />
              </div>
            </div>
            <h1 className="hero-title">
              <span className="title-line-1">Incredible Deals</span>
              <span className="title-line-2">Await You!</span>
            </h1>
            <p className="hero-subtitle">
              Discover unbeatable savings on your favorite games and experiences. Limited-time offers designed to
              maximize your fun while minimizing costs!
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBolt />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{getMaxDiscount()}%</div>
                  <div className="stat-label">Max Discount</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaTicketAlt />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{getActiveOffersCount()}+</div>
                  <div className="stat-label">Active Offers</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaClock />
                </div>
                <div className="stat-content">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* My Offers Button */}
        {userId && (
          <div className="my-offers-button-container">
            <button className="my-offers-button" onClick={viewClaimedOffers}>
              <FaBookmark className="my-offers-icon" />
              <span>My Claimed Offers</span>
            </button>
          </div>
        )}

        {/* Enhanced Category Filters */}
        <section className="enhanced-filters">
          <div className="filters-container">
            <div className="filters-glass-card">
              <div className="filters-header">
                <div className="filters-title-wrapper">
                  <FaTags className="filters-icon" />
                  <h2 className="filters-title">Browse by Category</h2>
                </div>
              </div>
              <div className="category-filters">
                {categories.map((category) => {
                  const categoryCount =
                    category.id === "all"
                      ? allOffers.length
                      : allOffers.filter((offer) => offer.category === category.id).length

                  if (category.id !== "all" && categoryCount === 0) return null

                  return (
                    <button
                      key={category.id}
                      className={`enhanced-category-btn ${activeFilter === category.id ? "active" : ""}`}
                      onClick={() => setActiveFilter(category.id)}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-label">{category.label}</span>
                      <span className="category-count">({categoryCount})</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Offers Grid */}
        <section className="enhanced-offers-section">
          <div className="offers-container">
            <div className="offers-header">
              <div className="header-content">
                <h2 className="section-title">
                  <span className="title-highlight">{filteredOffers.length}</span> Premium Offer
                  {filteredOffers.length !== 1 ? "s" : ""} Available
                </h2>
                {activeFilter !== "all" && (
                  <div className="active-filter-badge">
                    <span>Category: {categories.find((c) => c.id === activeFilter)?.label}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="enhanced-offers-grid">
              {filteredOffers.map((offer, index) => (
                <div
                  key={offer.id}
                  className={`enhanced-offer-card ${offer.featured ? "featured" : ""}`}
                  style={{ "--animation-delay": `${index * 0.1}s` }}
                >
                  {/* Status Badges */}
                  <div className="status-badges">
                    {offer.featured && (
                      <div className="featured-badge">
                        <FaCrown />
                        <span>Featured</span>
                      </div>
                    )}
                    {offer.trending && (
                      <div className="trending-badge">
                        <FaFire />
                        <span>Trending</span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Header Container (No Image) */}
                  <div className="enhanced-header-container">
                    <div className={`dynamic-gradient bg-gradient-to-br ${offer.gradient}`}></div>

                    {/* Floating Icon */}
                    <div className="floating-offer-icon">
                      <span className="offer-emoji">{offer.icon}</span>
                    </div>

                    {/* Card Actions */}
                    <div className="enhanced-card-actions">
                      <button
                        className={`action-btn favorite-btn ${favorites.includes(offer.id) ? "active" : ""}`}
                        onClick={() => toggleFavorite(offer.id)}
                      >
                        <FaHeart />
                      </button>
                      <button className="action-btn share-btn">
                        <FaShare />
                      </button>
                    </div>

                    {/* Compact Discount Badge */}
                    <div className="compact-discount-badge">
                      <FaBolt className="discount-icon" />
                      <span className="discount-text">{offer.discount}</span>
                    </div>
                  </div>

                  {/* Enhanced Card Content */}
                  <div className="enhanced-card-content">
                    <div className="content-header">
                      <div className="offer-category-badge">
                        <span>{categories.find((c) => c.id === offer.category)?.label}</span>
                      </div>
                      <div className="validity-badge">
                        <FaClock className="clock-icon" />
                        <span>{calculateTimeLeft(offer.validUntil)}</span>
                      </div>
                    </div>

                    <h3 className="enhanced-offer-title">{offer.title}</h3>
                    <p className="enhanced-offer-description">{offer.description}</p>

                    {/* Games Included */}
                    {offer.games && offer.games.length > 0 && (
                      <div className="games-included">
                        <h4 className="games-title">
                          <FaGamepad className="games-icon" />
                          Includes:
                        </h4>
                        <div className="games-list">
                          {offer.games.slice(0, 3).map((game, gameIndex) => (
                            <span
                              key={`${offer.id}-${gameIndex}`}
                              className="enhanced-game-tag"
                              style={{ "--tag-delay": `${gameIndex * 0.1}s` }}
                            >
                              <FaMagic className="tag-icon" />
                              {game}
                            </span>
                          ))}
                          {offer.games.length > 3 && <span className="more-games">+{offer.games.length - 3} more</span>}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Claim Button */}
                    <div className="offer-footer">
                      <button
                        className={`enhanced-claim-btn ${claimingOffers.has(offer.id) ? "claiming" : ""} ${
                          claimedOffers.has(offer.id) ? "claimed" : ""
                        }`}
                        onClick={() => claimOffer(offer)}
                        disabled={claimingOffers.has(offer.id) || claimedOffers.has(offer.id)}
                      >
                        {claimingOffers.has(offer.id) ? (
                          <>
                            <div className="btn-spinner"></div>
                            <span>Claiming...</span>
                          </>
                        ) : claimedOffers.has(offer.id) ? (
                          <>
                            <FaCheck className="btn-icon" />
                            <span>Claimed</span>
                          </>
                        ) : (
                          <>
                            <FaTicketAlt className="btn-icon" />
                            <span>Claim Offer</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOffers.length === 0 && !loading && (
              <div className="enhanced-no-offers">
                <div className="no-offers-icon">
                  <FaGift />
                </div>
                <h3>No offers found</h3>
                <p>
                  {activeFilter === "all"
                    ? "No offers are currently available. Check back soon for amazing deals!"
                    : "No offers found in this category. Try selecting a different category to see more offers."}
                </p>
                <button className="reset-filters-btn" onClick={() => setActiveFilter("all")}>
                  <span>View All Offers</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Claim Success Modal */}
        {showClaimModal && claimModalData && (
          <div className="claim-modal-overlay" onClick={closeClaimModal}>
            <div className="claim-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn-x" onClick={closeClaimModal}>
                <FaTimes />
              </button>

              <div className="modal-icon">
                <FaCheckCircle />
              </div>

              <h2 className="modal-title">Offer Claimed Successfully!</h2>

              <div className="modal-message">
                <p>
                  <strong>Offer:</strong> {claimModalData.offerTitle}
                </p>
                <p>
                  <strong>Your Code:</strong>{" "}
                  <code className="offer-code-display">{claimModalData.offerCode}</code>
                </p>
                <p>
                  <strong>Discount:</strong> {claimModalData.discount}
                </p>
                <p>
                  <strong>Valid Until:</strong> {formatDate(claimModalData.validUntil)}
                </p>

                {claimModalData.games && claimModalData.games.length > 0 && (
                  <div className="modal-games">
                    <p>
                      <strong>Applicable Games:</strong>
                    </p>
                    <div className="modal-games-list">
                      {claimModalData.games.map((game, index) => (
                        <span key={index} className="modal-game-tag">
                          <FaGamepad className="modal-game-icon" />
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="modal-note">
                  This offer has been added to your claimed offers. You can use it during checkout when booking
                  applicable games.
                </p>
              </div>

              <div className="modal-actions">
                <button className="modal-action-btn primary" onClick={viewClaimedOffers}>
                  <FaClipboard className="btn-icon" />
                  View My Offers
                </button>
                <button className="modal-action-btn secondary" onClick={closeClaimModal}>
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default OffersPage
