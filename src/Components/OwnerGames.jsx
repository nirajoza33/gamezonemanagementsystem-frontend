"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import "../css/OwnerGames.css" // Make sure this CSS file exists and is imported
import Navbar from "./Navbar"
import { getUserInfo } from "../auth/JwtUtils"
import LoginPopup from "./LoginPopup"
import GameDetailsPopup from "./GameDetailsPopup"
import {
  FaGamepad,
  FaUsers,
  FaClock,
  FaStar,
  FaFilter,
  FaSearch,
  FaPlay,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaCalendarAlt,
  FaTrophy,
  FaFire,
  FaBolt,
  FaMagic,
  FaSpinner,
  FaArrowLeft,
  FaUser,
  FaCoins,
  FaStore,
} from "react-icons/fa"

const difficulties = ["All", "Easy", "Medium", "Hard"]

// Helper function to deterministically assign game properties
const getGameProperties = (gameId) => {
  // Use gameId to generate consistent values
  const hash = Array.from(gameId.toString()).reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  return {
    featured: hash % 100 < 30, // 30% chance
    trending: (hash * 7) % 100 < 20, // 20% chance
    difficulty: difficulties[1 + (hash % 3)], // Excluding 'All'
    rating: 4.5 + (hash % 6) / 10, // Range 4.5-5.0
  }
}

// Helper function to map API data to enhanced format
const mapApiGameToEnhanced = (apiGame) => {
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

  const style = categoryStyles[apiGame.cname] || categoryStyles.default
  const properties = getGameProperties(apiGame.gameId)

  return {
    gameId: apiGame.gameId,
    title: apiGame.title,
    category: apiGame.cname,
    description: apiGame.description,
    image: apiGame.imageUrl ? `https://localhost:7186/uploads/${apiGame.imageUrl}` : "/placeholder.svg",
    pricing: apiGame.pricing,
    duration: "60 mins",
    players: "1-6 players",
    rating: properties.rating,
    difficulty: properties.difficulty,
    featured: properties.featured,
    trending: properties.trending,
    tags: ["Premium", "Popular", "Fun"],
    gradient: style.gradient,
    accentColor: style.accentColor,
    icon: style.icon,
    status: apiGame.status,
    userId: apiGame.userId,
    categoryId: apiGame.categoryId,
  }
}

const OwnerGames = () => {
  const { ownerId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [ownerInfo, setOwnerInfo] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [sortBy, setSortBy] = useState("featured")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState(["All"])
  const [loginPopup, setLoginPopup] = useState({
    isOpen: false,
    message: "",
    redirectPath: "",
    actionType: "",
    gameId: null,
    game: null,
  })

  const [showGameDetailsPopup, setShowGameDetailsPopup] = useState(false)
  const [selectedGameForDetails, setSelectedGameForDetails] = useState(null)

  const userInfo = getUserInfo()
  const userId = userInfo?.UserId || ""
  const ownerName = location.state?.ownerName || "GameZone Owner"
  const returnPath = location.state?.returnPath || "/gamezone-owners"

  const API_BASE_URL = "https://localhost:7186/api"

  useEffect(() => {
    console.log("OwnerGames component mounted, ownerId:", ownerId)
    if (ownerId) {
      fetchOwnerGames()
    }
    if (userId) {
      fetchWishlist()
    }
  }, [ownerId, userId])

  // Add new useEffect to fetch owner info after games are loaded
  useEffect(() => {
    if (games.length >= 0) {
      // Call even if 0 games to show owner info
      fetchOwnerInfo()
    }
  }, [games])

  useEffect(() => {
    filterGames()
  }, [selectedCategory, selectedDifficulty, searchTerm, sortBy, games])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowFilters(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const fetchOwnerGames = async () => {
    try {
      setLoading(true)
      console.log(`Fetching games for owner ${ownerId}`)
      const response = await axios.get(`${API_BASE_URL}/TblGames/ByUser/${ownerId}`)
      console.log("Games response:", response.data)

      if (!response.data || !Array.isArray(response.data)) {
        console.log("No games found or invalid response format")
        setGames([])
        setFilteredGames([])
        setError(null)
        return
      }

      const enhancedGames = response.data.map(mapApiGameToEnhanced)

      // Extract unique categories from games
      const uniqueCategories = ["All", ...new Set(enhancedGames.map((game) => game.category).filter(Boolean))]
      setCategories(uniqueCategories)

      // Sort by gameId to maintain consistent order
      enhancedGames.sort((a, b) => a.gameId - b.gameId)
      setGames(enhancedGames)
      setFilteredGames(enhancedGames)
      setError(null)

      console.log(`Successfully loaded ${enhancedGames.length} games`)
    } catch (err) {
      console.error("Error fetching owner games:", err)
      if (err.response) {
        console.error("Response status:", err.response.status)
        console.error("Response data:", err.response.data)

        if (err.response.status === 404) {
          setError("Owner not found or has no games.")
        } else if (err.response.status === 500) {
          setError("Server error. Please try again later.")
        } else {
          setError(`Error: ${err.response.status} - ${err.response.statusText}`)
        }
      } else if (err.request) {
        setError("Network error. Please check your connection.")
      } else {
        setError("Failed to load games. Please try again later.")
      }
      setGames([])
      setFilteredGames([])
    } finally {
      setLoading(false)
    }
  }

  const fetchOwnerInfo = async () => {
    try {
      console.log(`Fetching info for owner ${ownerId}`)

      // Try to get detailed owner info from GameZoneOwners endpoint first
      try {
        const response = await axios.get(`${API_BASE_URL}/GameZoneOwners/${ownerId}`)
        console.log("Owner info response:", response.data)
        setOwnerInfo(response.data)
        return
      } catch (err) {
        console.log("GameZoneOwners endpoint not available, falling back to basic user info")
      }

      // Fallback to basic user info
      try {
        const response = await axios.get(`${API_BASE_URL}/TblUsers/Admin/get-owners`)
        if (response.data.success) {
          const owner = response.data.data.find((o) => o.userId == ownerId)
          if (owner) {
            console.log("Found owner in owners list:", owner)
            setOwnerInfo({
              userId: owner.userId,
              username: owner.userName,
              email: owner.email,
              phone: owner.phone,
              status: owner.status,
              totalGames: games.length,
              activeGames: games.filter((g) => g.status).length,
              totalRevenue: games.reduce((sum, g) => sum + (g.pricing || 0), 0),
              categories: [...new Set(games.map((g) => g.category).filter(Boolean))],
            })
            return
          }
        }
      } catch (err) {
        console.log("TblUsers endpoint not available")
      }

      // Final fallback - create basic owner info
      setOwnerInfo({
        userId: ownerId,
        username: ownerName || "GameZone Owner",
        totalGames: games.length,
        activeGames: games.filter((g) => g.status).length,
        totalRevenue: games.reduce((sum, g) => sum + (g.pricing || 0), 0),
        categories: [...new Set(games.map((g) => g.category).filter(Boolean))],
      })
    } catch (err) {
      console.error("Error fetching owner info:", err)
      // Set default owner info on error
      setOwnerInfo({
        userId: ownerId,
        username: ownerName || "GameZone Owner",
        totalGames: games.length,
        activeGames: games.filter((g) => g.status).length,
        totalRevenue: games.reduce((sum, g) => sum + (g.pricing || 0), 0),
        categories: [...new Set(games.map((g) => g.category).filter(Boolean))],
      })
    }
  }

  const fetchWishlist = async () => {
    if (!userId) return

    try {
      const res = await axios.get(`${API_BASE_URL}/TblWishlists`)
      const userWishlist = res.data.filter((w) => w.userId == userId)
      setWishlist(userWishlist)
      setFavorites(userWishlist.map((w) => w.gameId))
    } catch (err) {
      console.error("Error fetching wishlist:", err)
    }
  }

  const filterGames = () => {
    let filtered = [...games]

    if (selectedCategory !== "All") {
      filtered = filtered.filter((game) => game.category === selectedCategory)
    }

    if (selectedDifficulty !== "All") {
      filtered = filtered.filter((game) => game.difficulty === selectedDifficulty)
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(searchLower) ||
          game.description.toLowerCase().includes(searchLower) ||
          (game.category && game.category.toLowerCase().includes(searchLower)) ||
          game.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Maintain consistent sorting
    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => {
          if (a.featured === b.featured) return a.gameId - b.gameId
          return b.featured - a.featured
        })
        break
      case "rating":
        filtered.sort((a, b) => {
          if (a.rating === b.rating) return a.gameId - b.gameId
          return b.rating - a.rating
        })
        break
      case "price":
        filtered.sort((a, b) => {
          if (a.pricing === b.pricing) return a.gameId - b.gameId
          return a.pricing - b.pricing
        })
        break
      case "duration":
        filtered.sort((a, b) => {
          const durationA = Number.parseInt(a.duration)
          const durationB = Number.parseInt(b.duration)
          if (durationA === durationB) return a.gameId - b.gameId
          return durationA - durationB
        })
        break
      default:
        filtered.sort((a, b) => a.gameId - b.gameId)
        break
    }

    setFilteredGames(filtered)
  }

  const handleBackToOwners = () => {
    navigate(returnPath)
  }

  const handleCloseLoginPopup = () => {
    setLoginPopup((prev) => ({ ...prev, isOpen: false }))
  }

  const handleLoginComplete = () => {
    const { actionType, gameId, game } = loginPopup

    if (actionType === "wishlist" && gameId) {
      toggleFavorite(gameId)
    } else if (actionType === "booking" && game) {
      navigate("/booking", { state: { game } })
    }

    setLoginPopup({
      isOpen: false,
      message: "",
      redirectPath: "",
      actionType: "",
      gameId: null,
      game: null,
    })
  }

  const handleShowGameDetails = (game) => {
    setSelectedGameForDetails(game)
    setShowGameDetailsPopup(true)
  }

  const handleCloseGameDetails = () => {
    setShowGameDetailsPopup(false)
    setSelectedGameForDetails(null)
  }

  const toggleFavorite = async (gameId) => {
    if (!userId) {
      setLoginPopup({
        isOpen: true,
        message: "Please login to add games to your wishlist",
        redirectPath: window.location.pathname,
        actionType: "wishlist",
        gameId: gameId,
        game: null,
      })
      return
    }

    const existingEntry = wishlist.find((w) => w.gameId === gameId)

    try {
      if (existingEntry) {
        await axios.delete(`${API_BASE_URL}/TblWishlists/${existingEntry.wishlistId}`)
        setWishlist((prev) => prev.filter((w) => w.gameId !== gameId))
        setFavorites((prev) => prev.filter((id) => id !== gameId))
      } else {
        const response = await axios.post(`${API_BASE_URL}/TblWishlists`, {
          userId: userId,
          gameId: gameId,
        })
        setWishlist((prev) => [...prev, response.data])
        setFavorites((prev) => [...prev, gameId])
      }
    } catch (err) {
      console.error("Error updating wishlist:", err)
      alert(existingEntry ? "Failed to remove from wishlist" : "Failed to add to wishlist")
    }
  }

  const clearFilters = () => {
    setSelectedCategory("All")
    setSelectedDifficulty("All")
    setSearchTerm("")
    setSortBy("featured")
  }

  const handleBookNow = (game) => {
    if (!userId) {
      setLoginPopup({
        isOpen: true,
        message: "Please login to book this game",
        redirectPath: window.location.pathname,
        actionType: "booking",
        gameId: null,
        game: game,
      })
      return
    }

    navigate("/booking", { state: { game } })
  }

  const handleImageError = (e) => {
    e.target.parentElement.classList.add("error")
  }

  const handleImageLoad = (e) => {
    e.target.parentElement.classList.remove("loading")
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="enhanced-games-page owner-games-page">
          <div className="loading-container">
            <div className="loading-spinner">
              <FaSpinner className="spinner-icon" />
            </div>
            <h2>Loading {ownerName}'s Games...</h2>
            <p>Please wait while we fetch the games for this owner</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="enhanced-games-page owner-games-page">
          <div className="error-container">
            <div className="error-icon">
              <FaGamepad />
            </div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchOwnerGames}>
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
      <div className="enhanced-games-page owner-games-page">
        <LoginPopup
          isOpen={loginPopup.isOpen}
          onClose={handleCloseLoginPopup}
          message={loginPopup.message}
          redirectPath={loginPopup.redirectPath}
        />

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

        {/* Owner Header Section */}
        <section className="owner-header-section">
          <div className="owner-header-container">
            <button className="back-btn" onClick={handleBackToOwners}>
              <FaArrowLeft />
              <span>Back to Owners</span>
            </button>

            <div className="owner-info-card">
              <div className="owner-avatar">
                <FaUser />
              </div>
              <div className="owner-details">
                <h1 className="owner-name">{ownerInfo?.username || ownerName}</h1>
                <p className="owner-subtitle">GameZone Owner</p>
                {ownerInfo && (
                  <div className="owner-stats-inline">
                    <span className="stat-item">
                      <FaGamepad /> {ownerInfo.totalGames} Games
                    </span>
                    <span className="stat-item">
                      <FaPlay /> {ownerInfo.activeGames} Active
                    </span>
                    <span className="stat-item">
                      <FaCoins /> ₹{ownerInfo.totalRevenue?.toLocaleString() || 0}
                    </span>
                  </div>
                )}
              </div>
              <div className="store-badge">
                <FaStore />
                <span>Verified Owner</span>
              </div>
            </div>
          </div>
        </section>

        <section className="enhanced-filters">
          <div className="filters-container">
            <div className="filters-glass-card">
              <div className="filters-header">
                <div className="filters-title-wrapper">
                  <FaFilter className="filters-icon" />
                  <h2 className="filters-title">Find Games by {ownerInfo?.username || ownerName}</h2>
                </div>
                <button
                  className="mobile-filters-toggle"
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      setShowFilters(!showFilters)
                    }
                  }}
                >
                  <FaFilter />
                  <span>Filters</span>
                </button>
              </div>

              <div className={`filters-content ${showFilters ? "show" : ""}`}>
                <div className="search-wrapper">
                  <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search games, categories, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="enhanced-search-input"
                    />
                    <div className="search-glow"></div>
                  </div>
                </div>

                <div className="enhanced-filter-grid">
                  <div className="filter-card">
                    <label className="filter-label">
                      <span className="label-icon">🎯</span>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="enhanced-filter-select"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-card">
                    <label className="filter-label">
                      <span className="label-icon">⚡</span>
                      Difficulty
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="enhanced-filter-select"
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-card">
                    <label className="filter-label">
                      <span className="label-icon">📊</span>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="enhanced-filter-select"
                    >
                      <option value="featured">Featured</option>
                      <option value="rating">Rating</option>
                      <option value="price">Price</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>

                  <div className="filter-actions">
                    <button className="clear-filters-btn" onClick={clearFilters}>
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="enhanced-games-section">
          <div className="games-container">
            <div className="games-header">
              <div className="header-content">
                <h2 className="section-title">
                  <span className="title-highlight">{filteredGames.length}</span> Game
                  {filteredGames.length !== 1 ? "s" : ""} Found
                </h2>
                {selectedCategory !== "All" && (
                  <div className="active-filter-badge">
                    <span>Category: {selectedCategory}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="enhanced-games-grid">
              {filteredGames.map((game, index) => (
                <div
                  key={game.gameId}
                  className={`enhanced-game-card ${game.featured ? "featured" : ""} ${!game.status ? "inactive" : ""}`}
                  style={{
                    "--accent-color": game.accentColor,
                    "--animation-delay": `${index * 0.1}s`,
                  }}
                >
                  {/* Background Effects */}
                  <div className="card-bg-gradient" />
                  <div className="card-glow-effect" />
                  <div className="card-hover-effect" />

                  {/* Status Badges */}
                  <div className="status-badges">
                    {!game.status && (
                      <div className="inactive-badge">
                        <span>Inactive</span>
                      </div>
                    )}
                    {game.featured && (
                      <div className="featured-badge">
                        <FaTrophy />
                        <span>Featured</span>
                      </div>
                    )}
                    {game.trending && (
                      <div className="trending-badge">
                        <FaFire />
                        <span>Trending</span>
                      </div>
                    )}
                  </div>

                  {/* Game Image Section */}
                  <div className="enhanced-image-container">
                    <div className={`image-wrapper ${!game.imageLoaded ? "loading" : ""}`}>
                      <img
                        src={game.image || "/placeholder.svg"}
                        alt={game.title}
                        className="game-image"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                      />
                      <div className="image-shine" />
                    </div>

                    {/* Emoji or Icon */}
                    <div className="floating-game-icon">
                      <span className="game-emoji">{game.icon}</span>
                    </div>

                    {/* Action Buttons (Heart & Share) */}
                    <div className="enhanced-card-actions">
                      <button
                        className={`action-btn favorite-btn ${favorites.includes(game.gameId) ? "active" : ""}`}
                        onClick={() => toggleFavorite(game.gameId)}
                      >
                        {favorites.includes(game.gameId) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      <button className="action-btn share-btn">
                        <FaShare />
                      </button>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="enhanced-difficulty-badge">
                      <span className={`difficulty-tag ${game.difficulty.toLowerCase()}`}>
                        <FaBolt className="difficulty-icon" />
                        {game.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Game Content Section */}
                  <div className="enhanced-card-content">
                    {/* Header */}
                    <div className="content-header">
                      <div className="game-category-badge">
                        <span>{game.category}</span>
                      </div>
                      <div className="rating-badge">
                        <FaStar className="star-icon" />
                        <span>{game.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="enhanced-game-title">{game.title}</h3>
                    <p className="enhanced-game-description">{game.description}</p>

                    {/* Tags */}
                    <div className="enhanced-tags">
                      {game.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={`${game.gameId}-tag-${tagIndex}`}
                          className="enhanced-tag"
                          style={{ "--tag-delay": `${tagIndex * 0.1}s` }}
                        >
                          <FaMagic className="tag-icon" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Info Section: Duration & Players */}
                    <div className="enhanced-game-info">
                      <div className="info-card">
                        <FaClock className="info-icon" />
                        <span className="info-text">{game.duration}</span>
                      </div>
                      <div className="info-card">
                        <FaUsers className="info-icon" />
                        <span className="info-text">{game.players}</span>
                      </div>
                    </div>

                    {/* Footer: Pricing & Buttons */}
                    <div className="enhanced-card-footer">
                      <div className="price-container">
                        <div className="price-main">₹{game.pricing}</div>
                        <div className="price-label">per session</div>
                      </div>

                      <div className="enhanced-action-buttons">
                        <button onClick={() => handleShowGameDetails(game)} className="enhanced-details-btn">
                          <FaPlay className="btn-icon" />
                          <span>Details</span>
                          <div className="btn-glow" />
                        </button>
                        <button
                          onClick={() => handleBookNow(game)}
                          className="enhanced-book-btn"
                          disabled={!game.status}
                        >
                          <FaCalendarAlt className="btn-icon" />
                          <span>{game.status ? "Book Now" : "Unavailable"}</span>
                          <div className="btn-glow" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="enhanced-no-games">
                <div className="no-games-icon">
                  <FaGamepad />
                </div>
                <h3>No games found</h3>
                <p>Try adjusting your filters or search terms to discover more games</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </div>
        </section>
        {/* Game Details Popup */}
        <GameDetailsPopup
          isOpen={showGameDetailsPopup}
          onClose={handleCloseGameDetails}
          game={selectedGameForDetails}
          onBookNow={handleBookNow}
          onToggleFavorite={toggleFavorite}
          isFavorite={selectedGameForDetails ? favorites.includes(selectedGameForDetails.gameId) : false}
        />
      </div>
    </>
  )
}

export default OwnerGames
