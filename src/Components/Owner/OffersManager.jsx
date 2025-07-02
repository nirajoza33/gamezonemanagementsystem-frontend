"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Gift,
  Plus,
  Edit,
  Trash2,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Tag,
  ImageIcon,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar,
  MoreVertical,
  Zap,
  Clock,
  Percent,
  ChevronDown,
  Gamepad2,
} from "lucide-react"
import { getUserInfo } from "../../auth/JwtUtils"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import toast, { Toaster } from "react-hot-toast"
import "./OffersManager.css"

const OffersManager = () => {
  const [offers, setOffers] = useState([])
  const [filteredOffers, setFilteredOffers] = useState([])
  const [userGames, setUserGames] = useState([])
  const [formData, setFormData] = useState({
    offerId: 0,
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    category: "",
    validFrom: "",
    validUntil: "",
    isFeatured: false,
    isTrending: false,
    icon: "",
    gradientClass: "",
    accentColor: "#ffd700",
    gamesIncluded: [],
    terms: [],
    status: true,
    userId: 0,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  // Games dropdown state
  const [showGamesDropdown, setShowGamesDropdown] = useState(false)
  const [gameSearchTerm, setGameSearchTerm] = useState("")

  // Terms management
  const [newTerm, setNewTerm] = useState("")

  const userInfo = getUserInfo()
  const userId = Number.parseInt(userInfo?.UserId) || 0
  const apiBase = "https://localhost:7186/api/TblOffers"
  const gamesApiBase = "https://localhost:7186/api/TblGames"

  const categories = ["weekend", "student", "birthday", "corporate", "family", "vr", "happy-hour", "midnight"]

  const icons = ["🎮", "🎓", "🎂", "🏢", "👨‍👩‍👧‍👦", "🥽", "⏰", "🌙", "🎯", "🎪", "🎨", "🎭"]

  const gradients = [
    "from-purple-500 via-pink-500 to-red-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-yellow-500 via-orange-500 to-red-500",
    "from-green-500 via-emerald-500 to-teal-500",
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-pink-500 via-rose-500 to-red-500",
  ]

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch user's games
  const fetchUserGames = async () => {
    try {
      const res = await axios.get(`${gamesApiBase}/ByUser/${userId}`)
      setUserGames(res.data)
    } catch (err) {
      console.error("Failed to fetch user games:", err)
      toast.error("Failed to load your games")
    }
  }

  const fetchOffers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${apiBase}/ByUser/${userId}`)
      setOffers(res.data)
      setFilteredOffers(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch offers.")
      toast.error("Failed to load offers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId > 0) {
      setFormData((prev) => ({
        ...prev,
        userId: userId,
      }))
      fetchOffers()
      fetchUserGames()
    }
  }, [userId])

  // Filter and sort offers
  useEffect(() => {
    let filtered = offers

    if (searchTerm) {
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((offer) => offer.category === selectedCategory)
    }

    // Sort offers
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate))
        break
      case "discount-high":
        filtered.sort((a, b) => Number.parseFloat(b.discountValue || 0) - Number.parseFloat(a.discountValue || 0))
        break
      case "discount-low":
        filtered.sort((a, b) => Number.parseFloat(a.discountValue || 0) - Number.parseFloat(b.discountValue || 0))
        break
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    setFilteredOffers(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, offers, sortBy])

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOffers = filteredOffers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  // Enhanced Games management with dropdown
  const toggleGameSelection = (gameTitle) => {
    setFormData((prev) => ({
      ...prev,
      gamesIncluded: prev.gamesIncluded.includes(gameTitle)
        ? prev.gamesIncluded.filter((game) => game !== gameTitle)
        : [...prev.gamesIncluded, gameTitle],
    }))
  }

  const removeGame = (gameTitle) => {
    setFormData((prev) => ({
      ...prev,
      gamesIncluded: prev.gamesIncluded.filter((game) => game !== gameTitle),
    }))
  }

  // Filter games based on search term
  const filteredGames = userGames.filter((game) => game.title.toLowerCase().includes(gameSearchTerm.toLowerCase()))

  // Terms management
  const addTerm = () => {
    if (newTerm.trim() && !formData.terms.includes(newTerm.trim())) {
      setFormData((prev) => ({
        ...prev,
        terms: [...prev.terms, newTerm.trim()],
      }))
      setNewTerm("")
    }
  }

  const removeTerm = (index) => {
    setFormData((prev) => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation for required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.discountValue ||
      !formData.validFrom ||
      !formData.validUntil
    ) {
      setError("Please fill in all required fields.")
      setLoading(false)
      toast.error("Please fill in all required fields")
      return
    }

    // Validate dates
    if (new Date(formData.validFrom) >= new Date(formData.validUntil)) {
      setError("Valid Until date must be after Valid From date.")
      setLoading(false)
      toast.error("Valid Until date must be after Valid From date")
      return
    }

    // Validate discount value based on type
    if (formData.discountType === "percentage" && formData.discountValue > 100) {
      setError("Percentage discount cannot exceed 100%.")
      setLoading(false)
      toast.error("Percentage discount cannot exceed 100%")
      return
    }

    const data = new FormData()

    // Required fields
    data.append("Title", formData.title)
    data.append("Description", formData.description)
    data.append("DiscountType", formData.discountType)
    data.append("DiscountValue", formData.discountValue.toString())
    data.append("Category", formData.category)
    data.append("ValidFrom", formData.validFrom)
    data.append("ValidUntil", formData.validUntil)
    data.append("UserId", userId.toString())

    // Status field - Always include this
    data.append("Status", formData.status.toString())

    // Optional fields
    data.append("IsFeatured", formData.isFeatured.toString())
    data.append("IsTrending", formData.isTrending.toString())

    if (formData.icon) {
      data.append("Icon", formData.icon)
    }
    if (formData.gradientClass) {
      data.append("GradientClass", formData.gradientClass)
    }
    if (formData.accentColor) {
      data.append("AccentColor", formData.accentColor)
    }

    // Handle arrays
    if (formData.gamesIncluded.length > 0) {
      formData.gamesIncluded.forEach((game, index) => {
        data.append(`GamesIncluded[${index}]`, game)
      })
    }

    if (formData.terms.length > 0) {
      formData.terms.forEach((term, index) => {
        data.append(`Terms[${index}]`, term)
      })
    }

    if (imageFile) {
      data.append("ImageFile", imageFile)
    }

    if (editing) {
      data.append("OfferId", formData.offerId.toString())
    }

    try {
      if (editing) {
        await axios.put(`${apiBase}/${formData.offerId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Offer updated successfully!")
      } else {
        const response = await axios.post(apiBase, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Offer created successfully!")
      }

      resetForm()
      setShowModal(false)
      fetchOffers()
    } catch (err) {
      console.error("Error details:", err.response?.data)
      const errorMessage = err.response?.data?.message || "Failed to save offer."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      offerId: 0,
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      category: "",
      validFrom: "",
      validUntil: "",
      isFeatured: false,
      isTrending: false,
      icon: "",
      gradientClass: "",
      accentColor: "#ffd700",
      gamesIncluded: [],
      terms: [],
      status: true,
      userId: userId,
    })
    setImageFile(null)
    setImagePreview(null)
    setEditing(false)
    setNewTerm("")
    setGameSearchTerm("")
    setShowGamesDropdown(false)
  }

  const handleEdit = (offer) => {
    setFormData({
      offerId: offer.offerId,
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      category: offer.category,
      validFrom: offer.validFrom?.split("T")[0] || "",
      validUntil: offer.validUntil?.split("T")[0] || "",
      isFeatured: offer.isFeatured,
      isTrending: offer.isTrending,
      icon: offer.icon || "",
      gradientClass: offer.gradientClass || "",
      accentColor: offer.accentColor || "#ffd700",
      gamesIncluded: offer.gamesIncluded || [],
      terms: offer.terms || [],
      status: offer.status !== undefined ? offer.status : true,
      userId: offer.userId,
    })
    if (offer.imageUrl) {
      setImagePreview(`https://localhost:7186/uploads/${offer.imageUrl}`)
    }
    setEditing(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) {
      return
    }

    try {
      await axios.delete(`${apiBase}/${id}`)
      toast.success("Offer deleted successfully!")
      fetchOffers()
    } catch (err) {
      console.error(err)
      const errorMessage = err.response?.data?.message || "Failed to delete offer."
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const getTotalOffers = () => {
    return offers.length
  }

  const getActiveOffers = () => {
    return offers.filter((offer) => offer.status && new Date(offer.validUntil) >= new Date()).length
  }

  const getAverageDiscount = () => {
    if (offers.length === 0) return "0"
    const totalDiscount = offers.reduce((sum, offer) => {
      return sum + (offer.discountType === "percentage" ? Number.parseFloat(offer.discountValue || 0) : 0)
    }, 0)
    return (totalDiscount / offers.length).toFixed(1)
  }

  const getFeaturedOffers = () => {
    return offers.filter((offer) => offer.isFeatured).length
  }

  const formatTimeLeft = (validUntil) => {
    const now = new Date()
    const endDate = new Date(validUntil)
    const diff = endDate - now

    if (diff <= 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} days left`
    if (hours > 0) return `${hours} hours left`
    return "Expires soon"
  }

  // Show loading or error if userId is not available
  if (userId === 0) {
    return (
      <div className="offers-manager-layout">
        <div className="dashboard-loading">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          <div className="loading-text">Loading user information...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="offers-manager-layout">
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

      {/* Animated Background */}
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

      <div className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <main className="content-area">
          <div className="content-wrapper">
            {/* Header Section */}
            <div className="dashboard-header">
              <div className="header-content">
                <div>
                  <h1 className="dashboard-title">
                    <Gift className="title-icon" />
                    Offers Manager
                  </h1>
                  <p className="dashboard-subtitle">Create and manage discount offers for your gamezone</p>
                </div>
                <div className="system-status">
                  <div className="status-indicator active"></div>
                  <span>Offers Active</span>
                </div>
              </div>
            </div>

            {/* Enhanced Statistics Grid */}
            <div className="stats-grid">
              <div className="stat-card stat-card-primary">
                <div className="stat-icon-wrapper">
                  <Gift className="stat-icon" size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{getTotalOffers()}</div>
                  <div className="stat-label">Total Offers</div>
                  <div className="stat-trend">
                    <TrendingUp size={16} />
                    <span>Created</span>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-success">
                <div className="stat-icon-wrapper">
                  <Zap className="stat-icon" size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{getActiveOffers()}</div>
                  <div className="stat-label">Active Offers</div>
                  <div className="stat-trend">
                    <Star size={16} />
                    <span>Live</span>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-accent">
                <div className="stat-icon-wrapper">
                  <Percent className="stat-icon" size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{getAverageDiscount()}%</div>
                  <div className="stat-label">Avg Discount</div>
                  <div className="stat-trend">
                    <Percent size={16} />
                    <span>Average</span>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-secondary">
                <div className="stat-icon-wrapper">
                  <Star className="stat-icon" size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{getFeaturedOffers()}</div>
                  <div className="stat-label">Featured</div>
                  <div className="stat-trend">
                    <Calendar size={16} />
                    <span>Highlighted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Panel */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <Gift className="panel-icon" />
                  Offers Portfolio
                </div>
                <div className="panel-actions">
                  <button className="panel-action secondary" onClick={() => setShowFilters(!showFilters)}>
                    <Filter size={16} />
                    Filters
                  </button>
                  <button className="panel-action primary" onClick={openAddModal}>
                    <Plus size={16} />
                    Create Offer
                  </button>
                </div>
              </div>

              <div className="panel-content">
                {/* Enhanced Controls */}
                <div className="controls-section">
                  <div className="controls-row">
                    <div className="search-container">
                      <Search className="search-icon" size={18} />
                      <input
                        type="text"
                        placeholder="Search offers by title or description..."
                        className="enhanced-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm("")}>
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <div className="controls-group">
                      <div className="sort-container">
                        <select className="enhanced-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="name">Name A-Z</option>
                          <option value="discount-high">Discount High-Low</option>
                          <option value="discount-low">Discount Low-High</option>
                        </select>
                      </div>

                      <div className="view-toggle">
                        <button
                          className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                          onClick={() => setViewMode("grid")}
                          title="Grid View"
                        >
                          <Grid size={18} />
                        </button>
                        <button
                          className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                          onClick={() => setViewMode("list")}
                          title="List View"
                        >
                          <List size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  {showFilters && (
                    <div className="filters-panel">
                      <div className="filters-grid">
                        <div className="filter-group">
                          <label className="filter-label">Category</label>
                          <select
                            className="enhanced-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                          >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="filter-actions">
                          <button
                            className="filter-btn clear"
                            onClick={() => {
                              setSelectedCategory("")
                              setSearchTerm("")
                              setSortBy("newest")
                            }}
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results Summary */}
                <div className="results-summary">
                  <div className="results-info">
                    <span className="results-count">
                      {filteredOffers.length} of {offers.length} offers
                    </span>
                    {(searchTerm || selectedCategory) && (
                      <span className="filter-indicator">
                        <Filter size={14} />
                        Filtered
                      </span>
                    )}
                  </div>
                </div>

                {/* Offers Display */}
                <div className="offers-container">
                  {loading ? (
                    <div className="dashboard-loading">
                      <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                      </div>
                      <div className="loading-text">Loading your offers...</div>
                    </div>
                  ) : currentOffers.length === 0 ? (
                    <div className="no-data">
                      <div className="no-data-content">
                        <div className="no-data-icon">
                          <Gift size={64} />
                        </div>
                        <h3 className="no-data-title">
                          {offers.length === 0 ? "No offers yet" : "No offers match your filters"}
                        </h3>
                        <p className="no-data-description">
                          {offers.length === 0
                            ? "Create your first offer to start attracting customers"
                            : "Try adjusting your search or filter criteria"}
                        </p>
                        {offers.length === 0 && (
                          <button className="enhanced-btn primary large" onClick={openAddModal}>
                            <Plus size={20} />
                            Create Your First Offer
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`offers-grid ${viewMode}`}>
                        {currentOffers.map((offer) => (
                          <div key={offer.offerId} className="offer-card">
                            <div className="offer-image-container">
                              <img
                                src={
                                  offer.imageUrl
                                    ? `https://localhost:7186/uploads/${offer.imageUrl}`
                                    : "/placeholder.svg?height=200&width=300"
                                }
                                alt={offer.title}
                                className="offer-image"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=200&width=300"
                                }}
                              />
                              <div className="offer-overlay">
                                <div className="overlay-actions">
                                  <button className="overlay-btn" onClick={() => handleEdit(offer)} title="Edit Offer">
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    className="overlay-btn delete"
                                    onClick={() => handleDelete(offer.offerId)}
                                    title="Delete Offer"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* Status Badges */}
                              <div className="offer-badges">
                                {offer.isFeatured && (
                                  <div className="offer-badge featured">
                                    <Star size={12} />
                                    Featured
                                  </div>
                                )}
                                {offer.isTrending && (
                                  <div className="offer-badge trending">
                                    <TrendingUp size={12} />
                                    Trending
                                  </div>
                                )}
                                {!offer.status && (
                                  <div className="offer-badge inactive">
                                    <X size={12} />
                                    Inactive
                                  </div>
                                )}
                              </div>

                              {/* Discount Badge */}
                              <div className="discount-badge">
                                <Percent size={12} />
                                {offer.discountType === "percentage"
                                  ? `${offer.discountValue}%`
                                  : `₹${offer.discountValue}`}
                              </div>
                            </div>

                            <div className="offer-content">
                              <div className="offer-header">
                                <h3 className="offer-title">{offer.title}</h3>
                                <div className="offer-category">
                                  <Tag size={12} />
                                  {offer.category}
                                </div>
                              </div>

                              <p className="offer-description">{offer.description}</p>

                              {/* Games Included Display */}
                              {offer.gamesIncluded && offer.gamesIncluded.length > 0 && (
                                <div className="games-included-display">
                                  <h4 className="games-title">
                                    <Gamepad2 size={14} />
                                    Games Included:
                                  </h4>
                                  <div className="games-tags">
                                    {offer.gamesIncluded.slice(0, 3).map((game, index) => (
                                      <span key={index} className="game-tag">
                                        {game}
                                      </span>
                                    ))}
                                    {offer.gamesIncluded.length > 3 && (
                                      <span className="more-games">+{offer.gamesIncluded.length - 3} more</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="discount-display-section">
                                <div className="discount-highlight">
                                  <div className="discount-amount">
                                    {offer.discountType === "percentage"
                                      ? `${offer.discountValue}% OFF`
                                      : `₹${offer.discountValue} OFF`}
                                  </div>
                                  <div className="discount-label">Discount Offer</div>
                                </div>
                              </div>

                              <div className="offer-meta">
                                <div className="meta-item">
                                  <Clock size={14} />
                                  <span>{formatTimeLeft(offer.validUntil)}</span>
                                </div>
                                <div className="meta-item">
                                  <div
                                    className={`status-dot ${offer.status && new Date(offer.validUntil) >= new Date() ? "active" : "expired"}`}
                                  ></div>
                                  <span>
                                    {offer.status && new Date(offer.validUntil) >= new Date() ? "Active" : "Inactive"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="offer-actions">
                              <button className="action-btn edit" onClick={() => handleEdit(offer)}>
                                <Edit size={16} />
                                <span>Edit</span>
                              </button>
                              <button className="action-btn delete" onClick={() => handleDelete(offer.offerId)}>
                                <Trash2 size={16} />
                                <span>Delete</span>
                              </button>
                              <button className="action-btn more">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="pagination">
                          <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>

                          <div className="pagination-numbers">
                            {[...Array(totalPages)].map((_, index) => (
                              <button
                                key={index + 1}
                                className={`pagination-number ${currentPage === index + 1 ? "active" : ""}`}
                                onClick={() => setCurrentPage(index + 1)}
                              >
                                {index + 1}
                              </button>
                            ))}
                          </div>

                          <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Add/Edit Offer Modal */}
            {showModal && (
              <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                <div className="enhanced-modal extra-large">
                  {/* Modal Header */}
                  <div className="modal-header">
                    <div className="modal-header-content">
                      <div className="modal-icon-wrapper">
                        <Gift className="modal-icon" />
                        <div className="icon-pulse"></div>
                      </div>
                      <div className="modal-title-section">
                        <h2 className="modal-title">{editing ? "Edit Offer" : "Create New Offer"}</h2>
                        <p className="modal-subtitle">
                          {editing
                            ? "Update your offer details"
                            : "Create an attractive discount offer for your customers"}
                        </p>
                      </div>
                    </div>
                    <button type="button" className="close-btn" onClick={() => setShowModal(false)}>
                      <X size={20} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="modal-body">
                    <form onSubmit={handleSubmit} className="enhanced-form">
                      <div className="form-layout">
                        {/* Left Column - Offer Details */}
                        <div className="form-section">
                          <h3 className="section-title">
                            <Gift size={16} />
                            Offer Information
                          </h3>

                          <div className="form-group">
                            <label className="form-label">
                              <span>Offer Title</span>
                              <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                              <input
                                type="text"
                                name="title"
                                className="enhanced-input"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter an attractive offer title"
                                maxLength="200"
                                required
                              />
                              <div className="input-border"></div>
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              <span>Description</span>
                              <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                              <textarea
                                name="description"
                                className="enhanced-input enhanced-textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your offer details and benefits..."
                                maxLength="1000"
                                rows="3"
                                required
                              />
                              <div className="input-border"></div>
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">
                                <span>Category</span>
                                <span className="required">*</span>
                              </label>
                              <div className="input-wrapper">
                                <select
                                  name="category"
                                  className="enhanced-input"
                                  value={formData.category}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="">Select category</option>
                                  {categories.map((category) => (
                                    <option key={category} value={category}>
                                      {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                  ))}
                                </select>
                                <div className="input-border"></div>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                <span>Icon</span>
                              </label>
                              <div className="input-wrapper">
                                <select
                                  name="icon"
                                  className="enhanced-input"
                                  value={formData.icon}
                                  onChange={handleChange}
                                >
                                  <option value="">Select icon</option>
                                  {icons.map((icon) => (
                                    <option key={icon} value={icon}>
                                      {icon}
                                    </option>
                                  ))}
                                </select>
                                <div className="input-border"></div>
                              </div>
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">
                                <span>Valid From</span>
                                <span className="required">*</span>
                              </label>
                              <div className="input-wrapper">
                                <input
                                  type="date"
                                  name="validFrom"
                                  className="enhanced-input"
                                  value={formData.validFrom}
                                  onChange={handleChange}
                                  required
                                />
                                <div className="input-border"></div>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                <span>Valid Until</span>
                                <span className="required">*</span>
                              </label>
                              <div className="input-wrapper">
                                <input
                                  type="date"
                                  name="validUntil"
                                  className="enhanced-input"
                                  value={formData.validUntil}
                                  onChange={handleChange}
                                  required
                                />
                                <div className="input-border"></div>
                              </div>
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Offer Settings</label>
                            <div className="checkbox-group">
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  name="isFeatured"
                                  checked={formData.isFeatured}
                                  onChange={handleChange}
                                />
                                <span className="checkbox-custom"></span>
                                Featured Offer
                              </label>
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  name="isTrending"
                                  checked={formData.isTrending}
                                  onChange={handleChange}
                                />
                                <span className="checkbox-custom"></span>
                                Trending Offer
                              </label>
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  name="status"
                                  checked={formData.status}
                                  onChange={handleChange}
                                />
                                <span className="checkbox-custom"></span>
                                Active Status
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Discount & Media */}
                        <div className="form-section">
                          <h3 className="section-title">
                            <Percent size={16} />
                            Discount & Media
                          </h3>

                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">
                                <span>Discount Type</span>
                                <span className="required">*</span>
                              </label>
                              <div className="input-wrapper">
                                <select
                                  name="discountType"
                                  className="enhanced-input"
                                  value={formData.discountType}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="percentage">Percentage (%)</option>
                                  <option value="fixed">Fixed Amount (₹)</option>
                                </select>
                                <div className="input-border"></div>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                <span>Discount Value</span>
                                <span className="required">*</span>
                              </label>
                              <div className="input-wrapper">
                                <input
                                  type="number"
                                  name="discountValue"
                                  className="enhanced-input"
                                  value={formData.discountValue}
                                  onChange={handleChange}
                                  placeholder={formData.discountType === "percentage" ? "50" : "100"}
                                  step="0.01"
                                  min="0.01"
                                  max={formData.discountType === "percentage" ? "100" : undefined}
                                  required
                                />
                                <div className="input-border"></div>
                              </div>
                              <div className="input-help">
                                {formData.discountType === "percentage"
                                  ? "Enter percentage (1-100)"
                                  : "Enter fixed amount in ₹"}
                              </div>
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">Gradient Class</label>
                              <div className="input-wrapper">
                                <select
                                  name="gradientClass"
                                  className="enhanced-input"
                                  value={formData.gradientClass}
                                  onChange={handleChange}
                                >
                                  <option value="">Select gradient</option>
                                  {gradients.map((gradient) => (
                                    <option key={gradient} value={gradient}>
                                      {gradient.replace("from-", "").replace(" via-", " → ").replace(" to-", " → ")}
                                    </option>
                                  ))}
                                </select>
                                <div className="input-border"></div>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Accent Color</label>
                              <div className="input-wrapper">
                                <input
                                  type="color"
                                  name="accentColor"
                                  className="enhanced-input color-input"
                                  value={formData.accentColor}
                                  onChange={handleChange}
                                />
                                <div className="input-border"></div>
                              </div>
                            </div>
                          </div>

                          <div className="image-upload-section">
                            <div className="image-upload-area">
                              {imagePreview ? (
                                <div className="image-preview">
                                  <img src={imagePreview || "/placeholder.svg"} alt="Offer preview" />
                                  <div className="image-overlay">
                                    <button
                                      type="button"
                                      className="change-image-btn"
                                      onClick={() => document.getElementById("imageInput").click()}
                                    >
                                      <Upload size={16} />
                                      Change Image
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="upload-placeholder">
                                  <div className="upload-icon">
                                    <Upload size={48} />
                                  </div>
                                  <h4>Upload Offer Image</h4>
                                  <p>Add an attractive image for your offer</p>
                                  <button
                                    type="button"
                                    className="upload-btn"
                                    onClick={() => document.getElementById("imageInput").click()}
                                  >
                                    <ImageIcon size={16} />
                                    Choose File
                                  </button>
                                </div>
                              )}

                              <input
                                id="imageInput"
                                type="file"
                                name="imageFile"
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: "none" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Games Included Section */}
                      <div className="form-section full-width">
                        <h3 className="section-title">
                          <Gamepad2 size={16} />
                          Games Included (Optional)
                        </h3>

                        <div className="games-selection-section">
                          <div className="games-dropdown-container">
                            <div className="dropdown-header" onClick={() => setShowGamesDropdown(!showGamesDropdown)}>
                              <div className="dropdown-label">
                                <Gamepad2 size={16} />
                                <span>Select Games from Your Collection</span>
                                <span className="games-count">({formData.gamesIncluded.length} selected)</span>
                              </div>
                              <ChevronDown size={16} className={`dropdown-arrow ${showGamesDropdown ? "open" : ""}`} />
                            </div>

                            {showGamesDropdown && (
                              <div className="games-dropdown">
                                <div className="games-search">
                                  <Search size={16} className="search-icon" />
                                  <input
                                    type="text"
                                    placeholder="Search your games..."
                                    value={gameSearchTerm}
                                    onChange={(e) => setGameSearchTerm(e.target.value)}
                                    className="games-search-input"
                                  />
                                </div>

                                <div className="games-list">
                                  {filteredGames.length > 0 ? (
                                    filteredGames.map((game) => (
                                      <div
                                        key={game.gameId}
                                        className={`game-option ${formData.gamesIncluded.includes(game.title) ? "selected" : ""}`}
                                        onClick={() => toggleGameSelection(game.title)}
                                      >
                                        <div className="game-info">
                                          <div className="game-title">{game.title}</div>
                                          <div className="game-category">{game.cname}</div>
                                        </div>
                                        <div className="game-checkbox">
                                          {formData.gamesIncluded.includes(game.title) && <CheckCircle size={16} />}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="no-games-found">
                                      <Gamepad2 size={24} />
                                      <p>
                                        No games found.{" "}
                                        {userGames.length === 0
                                          ? "Add some games first!"
                                          : "Try a different search term."}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Selected Games Display */}
                          {formData.gamesIncluded.length > 0 && (
                            <div className="selected-games">
                              <div className="selected-games-header">
                                <span>Selected Games ({formData.gamesIncluded.length})</span>
                              </div>
                              <div className="selected-games-list">
                                {formData.gamesIncluded.map((game, index) => (
                                  <div key={index} className="selected-game-tag">
                                    <Gamepad2 size={14} />
                                    <span>{game}</span>
                                    <button type="button" className="remove-game-btn" onClick={() => removeGame(game)}>
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Terms & Conditions Section */}
                      <div className="form-section full-width">
                        <h3 className="section-title">
                          <AlertCircle size={16} />
                          Terms & Conditions (Optional)
                        </h3>

                        <div className="dynamic-list-section">
                          <div className="add-item-row">
                            <input
                              type="text"
                              className="enhanced-input"
                              value={newTerm}
                              onChange={(e) => setNewTerm(e.target.value)}
                              placeholder="Enter term or condition"
                              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTerm())}
                            />
                            <button type="button" className="add-btn" onClick={addTerm}>
                              <Plus size={16} />
                              Add Term
                            </button>
                          </div>

                          {formData.terms.length > 0 && (
                            <div className="items-list">
                              {formData.terms.map((term, index) => (
                                <div key={index} className="list-item">
                                  <span>{term}</span>
                                  <button type="button" className="remove-btn" onClick={() => removeTerm(index)}>
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="error-alert">
                          <AlertCircle size={20} />
                          <div>
                            <strong>Error</strong>
                            <p>{error}</p>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer">
                    <button type="button" className="enhanced-btn secondary" onClick={() => setShowModal(false)}>
                      <X size={16} />
                      Cancel
                    </button>

                    <button type="button" className="enhanced-btn primary" onClick={handleSubmit} disabled={loading}>
                      {loading ? (
                        <>
                          <div className="btn-spinner"></div>
                          {editing ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          {editing ? "Update Offer" : "Create Offer"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default OffersManager
