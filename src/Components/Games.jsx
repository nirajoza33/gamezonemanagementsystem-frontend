// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import "../css/Games.css";
// // import Navbar from "./Navbar";
// // import { useNavigate } from "react-router-dom";
// // import { FaHeart, FaRegHeart } from "react-icons/fa"; // for wishlist icon
// // import { getUserInfo } from '../auth/JwtUtils';

// // const Games = () => {
// //   const [games, setGames] = useState([]);
// //   const [wishlist, setWishlist] = useState([]); // keep track of wishlisted gameIds
// //   const navigate = useNavigate();

// //   const userInfo = getUserInfo();
// //   const userId = userInfo?.UserId || ""; // Replace this with logged-in user's ID dynamically

// //   const fetchGames = async () => {
// //     try {
// //       const res = await axios.get("https://localhost:7186/api/TblGames");
// //       setGames(res.data);
// //     } catch (err) {
// //       console.error("Error fetching games:", err);
// //     }
// //   };

// //   // const fetchWishlist = async () => {
// //   //   try {
// //   //     const res = await axios.get("https://localhost:7186/api/TblWishlists");
// //   //     const userWishlist = res.data.filter((w) => w.userId == userId);
// //   //     setWishlist(userWishlist.map((w) => w.gameId));
// //   //   } catch (err) {
// //   //     console.error("Error fetching wishlist:", err);
// //   //   }
// //   // };

// //   const fetchWishlist = async () => {
// //     try {
// //       const res = await axios.get("https://localhost:7186/api/TblWishlists");
// //       const userWishlist = res.data.filter((w) => w.userId == userId);
// //       setWishlist(userWishlist); // store full objects
// //     } catch (err) {
// //       console.error("Error fetching wishlist:", err);
// //     }
// //   };

// //   // useEffect(() => {
// //   //   fetchGames();
// //   //   fetchWishlist();
// //   // }, []);

// //   useEffect(() => {
// //     if (userId) {
// //       fetchGames();
// //       fetchWishlist();
// //     }
// //   }, [userId]);


// //   const handleBook = (game) => {
// //     navigate("/booking", { state: { game } });
// //   };

// //   // const toggleWishlist = async (gameId) => {
// //   //   console.log("Clicked on wishlist icon for gameId:", gameId);
// //   //   const isWishlisted = wishlist.includes(gameId);

// //   //   if (isWishlisted) {
// //   //     // Remove from wishlist (optional enhancement)
// //   //     alert("Remove functionality not yet implemented");
// //   //   } else {
// //   //     try {
// //   //       await axios.post("https://localhost:7186/api/TblWishlists", {
// //   //         userId: userId,
// //   //         gameId: gameId,
// //   //       });
// //   //       setWishlist((prev) => [...prev, gameId]);
// //   //     } catch (err) {
// //   //       console.error("Error adding to wishlist:", err);
// //   //     }
// //   //   }
// //   // };

// //   const toggleWishlist = async (gameId) => {
// //     const existingEntry = wishlist.find(w => w.gameId === gameId);

// //     if (existingEntry) {
// //       // REMOVE from wishlist
// //       try {
// //         await axios.delete(`https://localhost:7186/api/TblWishlists/${existingEntry.wishlistId}`);
// //         setWishlist(prev => prev.filter(w => w.gameId !== gameId));
// //       } catch (err) {
// //         console.error("Error removing from wishlist:", err);
// //       }
// //     } else {
// //       // ADD to wishlist
// //       try {
// //         const response = await axios.post("https://localhost:7186/api/TblWishlists", {
// //           userId: userId,
// //           gameId: gameId,
// //         });

// //         // Assuming backend returns the created wishlist object
// //         setWishlist(prev => [...prev, response.data]);
// //       } catch (err) {
// //         console.error("Error adding to wishlist:", err);
// //       }
// //     }
// //   };


// //   return (
// //     <div className="games-container">
// //       <Navbar />
// //       <h2>🎮 Available Games</h2>
// //       <div className="game-grid">
// //         {games.map((game) => (
// //           <div key={game.gameId} className="game-card">
// //             <div className="wishlist-icon" onClick={() => toggleWishlist(game.gameId)}>
// //               {/* {wishlist.includes(game.gameId) ? (
// //                 <FaHeart style={{ color: "red" }} />
// //               ) : (
// //                 <FaRegHeart />
// //               )} */}
// //               {wishlist.some((w) => w.gameId === game.gameId) ? (
// //                 <FaHeart style={{ color: "red" }} />
// //               ) : (
// //                 <FaRegHeart />
// //               )}

// //             </div>

// //             <img
// //               src={`https://localhost:7186/uploads/${game.imageUrl}`}
// //               alt={game.title}
// //               className="game-image"
// //             />
// //             <div className="game-info">
// //               <h3>{game.title}</h3>
// //               <p><strong>Game Id:</strong> {game.gameId}</p>
// //               <p><strong>Description:</strong> {game.description}</p>
// //               <p><strong>Price:</strong> ₹{game.pricing}</p>
// //               <p><strong>Category:</strong> {game.cname}</p>
// //               <button className="book-button" onClick={() => handleBook(game)}>
// //                 Book
// //               </button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Games;




"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "../css/Games.css"
import Navbar from "./Navbar"
import { getUserInfo } from "../auth/JwtUtils"
import LoginPopup from "./LoginPopup"
import GameDetailsPopup from "./GameDetailsPopup"
import Lottie from "react-lottie" // Add Lottie import
import animationData from "../animations/gaming-loader.json" // Import the animation data
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
} from "react-icons/fa"

const categories = ["All", "Sports", "Virtual Reality", "Arcade", "Action", "Simulation", "Puzzle"]
const difficulties = ["All", "Easy", "Medium", "Hard"]

// Helper function to map API data to enhanced format
const mapApiGameToEnhanced = (apiGame) => {
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

  const style = categoryStyles[apiGame.cname] || categoryStyles.default

  return {
    gameId: apiGame.gameId,
    title: apiGame.title,
    category: apiGame.cname,
    description: apiGame.description,
    image: `https://localhost:7186/uploads/${apiGame.imageUrl}`,
    pricing: apiGame.pricing,
    duration: "60 mins", // Default duration, adjust based on your API
    players: "1-6 players", // Default players, adjust based on your API
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
    difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
    featured: Math.random() > 0.7, // 30% chance of being featured
    trending: Math.random() > 0.8, // 20% chance of being trending
    tags: ["Premium", "Popular", "Fun"], // Default tags, customize based on your needs
    gradient: style.gradient,
    accentColor: style.accentColor,
    icon: style.icon,
    status: apiGame.status, // Add status from API
  }
}

const Games = () => {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [sortBy, setSortBy] = useState("featured")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loginPopup, setLoginPopup] = useState({
    isOpen: false,
    message: "",
    redirectPath: "",
    actionType: "", // "wishlist" or "booking"
    gameId: null, // For wishlist actions
    game: null, // For booking actions
  })

  // Game Details Popup State
  const [showGameDetailsPopup, setShowGameDetailsPopup] = useState(false)
  const [selectedGameForDetails, setSelectedGameForDetails] = useState(null)

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const userInfo = getUserInfo()
  const userId = userInfo?.UserId || ""

  // Fetch games from API
  const fetchGames = async () => {
    try {
      setLoading(true)
      const res = await axios.get("https://localhost:7186/api/TblGames")
      const enhancedGames = res.data.map(mapApiGameToEnhanced)
      setGames(enhancedGames)
      setFilteredGames(enhancedGames)
      setError(null)
    } catch (err) {
      console.error("Error fetching games:", err)
      setError("Failed to load games. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    if (!userId) return

    try {
      const res = await axios.get("https://localhost:7186/api/TblWishlists")
      const userWishlist = res.data.filter((w) => w.userId == userId)
      setWishlist(userWishlist)
      // Set favorites for the enhanced UI
      setFavorites(userWishlist.map((w) => w.gameId))
    } catch (err) {
      console.error("Error fetching wishlist:", err)
    }
  }

  useEffect(() => {
    fetchGames()
    if (userId) {
      fetchWishlist()
    }
  }, [userId])

  useEffect(() => {
    filterGames()
  }, [selectedCategory, selectedDifficulty, searchTerm, sortBy, games])

  const filterGames = () => {
    let filtered = [...games]

    if (selectedCategory !== "All") {
      filtered = filtered.filter((game) => game.category === selectedCategory)
    }

    if (selectedDifficulty !== "All") {
      filtered = filtered.filter((game) => game.difficulty === selectedDifficulty)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    switch (sortBy) {
      case "featured":
        filtered = filtered.sort((a, b) => b.featured - a.featured)
        break
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating)
        break
      case "price":
        filtered = filtered.sort((a, b) => a.pricing - b.pricing)
        break
      case "duration":
        filtered = filtered.sort((a, b) => Number.parseInt(a.duration) - Number.parseInt(b.duration))
        break
      default:
        break
    }

    setFilteredGames(filtered)
  }

  // Handle login popup close
  const handleCloseLoginPopup = () => {
    setLoginPopup((prev) => ({ ...prev, isOpen: false }))
  }

  // Handle login completion (after user logs in and returns)
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

  // Game Details Popup Handlers
  const handleShowGameDetails = (game) => {
    setSelectedGameForDetails(game)
    setShowGameDetailsPopup(true)
  }

  const handleCloseGameDetails = () => {
    setShowGameDetailsPopup(false)
    setSelectedGameForDetails(null)
  }

  // Toggle wishlist with API integration
  const toggleFavorite = async (gameId) => {
    if (!userId) {
      // Show login popup
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

    if (existingEntry) {
      // Remove from wishlist
      try {
        await axios.delete(`https://localhost:7186/api/TblWishlists/${existingEntry.wishlistId}`)
        setWishlist((prev) => prev.filter((w) => w.gameId !== gameId))
        setFavorites((prev) => prev.filter((id) => id !== gameId))
      } catch (err) {
        console.error("Error removing from wishlist:", err)
        alert("Failed to remove from wishlist")
      }
    } else {
      // Add to wishlist
      try {
        const response = await axios.post("https://localhost:7186/api/TblWishlists", {
          userId: userId,
          gameId: gameId,
        })
        setWishlist((prev) => [...prev, response.data])
        setFavorites((prev) => [...prev, gameId])
      } catch (err) {
        console.error("Error adding to wishlist:", err)
        alert("Failed to add to wishlist")
      }
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
      // Show login popup
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

    // Navigate to booking manager with game data
    navigate("/booking", { state: { game } })
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="enhanced-games-page">
          {/* Lottie Animation Loader with Glassmorphism Overlay */}
          <div className="lottie-loading-overlay">
            <div className="glassmorphism-backdrop"></div>
            <div className="lottie-container">
              <Lottie options={defaultOptions} height={200} width={200} />
              <div className="loading-text">
                <span>Loading Games</span>
                <div className="loading-dots">
                  <span className="dot dot-1">.</span>
                  <span className="dot dot-2">.</span>
                  <span className="dot dot-3">.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="enhanced-games-page">
          <div className="error-container">
            <div className="error-icon">
              <FaGamepad />
            </div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchGames}>
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
      <div className="enhanced-games-page">
        {/* Login Popup */}
        <LoginPopup
          isOpen={loginPopup.isOpen}
          onClose={handleCloseLoginPopup}
          message={loginPopup.message}
          redirectPath={loginPopup.redirectPath}
        />

        {/* Advanced Background */}
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
              <FaTrophy className="trophy-icon" />
              <span>Premium Gaming Experience</span>
            </div>
            <div className="hero-icon-wrapper">
              <div className="hero-icon">
                <FaGamepad />
              </div>
              <div className="hero-icon-glow"></div>
            </div>
            <h1 className="hero-title">
              <span className="title-line-1">PLAYVANA</span>
              <span className="title-line-2">Collection</span>
            </h1>
            <p className="hero-subtitle">
              Discover endless entertainment with our premium collection of games and activities designed for ultimate
              fun
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaGamepad />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{games.length}+</span>
                  <span className="stat-label">Games Available</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaStar />
                </div>
                <div className="stat-content">
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">Average Rating</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaClock />
                </div>
                <div className="stat-content">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Open Hours</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Filters */}
        {/* <section className="enhanced-filters">
          <div className="filters-container">
            <div className="filters-glass-card">
              <div className="filters-header">
                <div className="filters-title-wrapper">
                  <FaFilter className="filters-icon" />
                  <h2 className="filters-title">Find Your Perfect Game</h2>
                </div>
                <button className="mobile-filters-toggle" onClick={() => setShowFilters(!showFilters)}>
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
        </section> */}

        {/* Enhanced Games Grid */}
        <section className="enhanced-games-section">
          <div className="games-container">
            {/* <div className="games-header">
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
            </div> */}

            <div className="enhanced-games-grid">
              {filteredGames.map((game, index) => (
                <div
                  key={game.gameId}
                  className={`enhanced-game-card ${game.featured ? "featured" : ""} ${!game.status ? "inactive" : ""}`}
                  style={{ "--accent-color": game.accentColor, "--animation-delay": `${index * 0.1}s` }}
                >
                  {/* Card Background Effects */}
                  <div className="card-bg-gradient"></div>
                  <div className="card-glow-effect"></div>

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

                  {/* Image Container */}
                  <div className="enhanced-image-container">
                    <div className="image-wrapper">
                      <img src={game.image || "/placeholder.svg"} alt={game.title} className="game-image" />
                      <div className={`dynamic-overlay bg-gradient-to-br ${game.gradient}`}></div>
                      <div className="image-shine"></div>
                    </div>

                    {/* Floating Icon */}
                    <div className="floating-game-icon">
                      <span className="game-emoji">{game.icon}</span>
                    </div>

                    {/* Card Actions */}
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

                  {/* Card Content */}
                  <div className="enhanced-card-content">
                    <div className="content-header">
                      <div className="game-category-badge">
                        <span>{game.category}</span>
                      </div>
                      <div className="rating-badge">
                        <FaStar className="star-icon" />
                        <span>{game.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 className="enhanced-game-title">{game.title}</h3>
                    <p className="enhanced-game-description">{game.description}</p>

                    {/* Enhanced Tags */}
                    <div className="enhanced-tags">
                      {game.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tag} className="enhanced-tag" style={{ "--tag-delay": `${tagIndex * 0.1}s` }}>
                          <FaMagic className="tag-icon" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Game Info Grid */}
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

                    {/* Enhanced Footer */}
                    <div className="enhanced-card-footer">
                      <div className="price-container">
                        <div className="price-main">₹{game.pricing}</div>
                        <div className="price-label">per session</div>
                      </div>

                      <div className="enhanced-action-buttons">
                        <button onClick={() => handleShowGameDetails(game)} className="enhanced-details-btn">
                          <FaPlay className="btn-icon" />
                          <span>Details</span>
                          <div className="btn-glow"></div>
                        </button>
                        <button
                          onClick={() => handleBookNow(game)}
                          className="enhanced-book-btn"
                          disabled={!game.status}
                        >
                          <FaCalendarAlt className="btn-icon" />
                          <span>{game.status ? "Book Now" : "Unavailable"}</span>
                          <div className="btn-glow"></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="card-hover-effect"></div>
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

export default Games




