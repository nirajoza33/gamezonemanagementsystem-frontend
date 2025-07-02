// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import OwnerNavbar from "./OwnerNavbar";
// import { getUserInfo } from "../../auth/JwtUtils";
// import Sidebar from "./Sidebar";
// import DashboardHeader from "./DashboardHeader";

// const GameManager = () => {
//     const [games, setGames] = useState([]);
//     const [categories, setCategories] = useState([]);

//     const [formData, setFormData] = useState({
//         gameId: 0,
//         title: "",
//         description: "",
//         pricing: "",
//         categoryId: "",
//         userId: ""
//     });
//     const [imageFile, setImageFile] = useState(null);
//     const [editing, setEditing] = useState(false);
//     const [error, setError] = useState(null);

//     const userInfo = getUserInfo();
//     const userId = userInfo?.UserId;


//     const apiBase = "https://localhost:7186/api/TblGames";

//     const fetchCategories = async () => {
//         try {
//             const res = await axios.get("https://localhost:7186/api/TblGames"); // Change this if your endpoint differs
//             setCategories(res.data);
//         } catch (err) {
//             console.error("Failed to fetch categories", err);
//         }
//     };

//     const fetchGames = async () => {
//         try {
//             const res = await axios.get(`${apiBase}/ByUser/${userId}`);
//             setGames(res.data);
//             console.log("userid", userId)
//         } catch (err) {
//             console.error(err);
//             setError("Failed to fetch games.");
//         }
//     };


//     // useEffect(() => {
//     //     fetchGames();
//     // }, []);

//     useEffect(() => {
//         if (userId) {
//             setFormData((prev) => ({
//                 ...prev,
//                 userId: userId
//             }));
//             fetchGames();
//             fetchCategories(); // fetch categories
//         }
//     }, [userId]);


//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleImageChange = (e) => {
//         setImageFile(e.target.files[0]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         formData.userId = userId;


//         const data = new FormData();
//         data.append("GameId", formData.gameId);
//         data.append("Title", formData.title);
//         data.append("Description", formData.description);
//         data.append("Pricing", formData.pricing);
//         data.append("CategoryId", formData.categoryId);
//         data.append("UserId", formData.userId);
//         if (imageFile) {
//             data.append("ImageFile", imageFile);
//         }

//         try {
//             if (editing) {
//                 await axios.post(`${apiBase}/UpdateGameWithImage`, data, {
//                     headers: { "Content-Type": "multipart/form-data" },
//                 });
//             } else {
//                 await axios.post(apiBase, data, {
//                     headers: { "Content-Type": "multipart/form-data" },
//                 });
//             }

//             setFormData({
//                 gameId: 0,
//                 title: "",
//                 description: "",
//                 pricing: "",
//                 categoryId: "",
//                 userId: userId
//             });
//             setImageFile(null);
//             setEditing(false);
//             fetchGames();
//         } catch (err) {
//             console.error(err);
//             setError("Failed to save game.");
//         }
//     };

//     const handleEdit = (game) => {
//         setFormData({
//             gameId: game.gameId,
//             title: game.title,
//             description: game.description,
//             pricing: game.pricing,
//             categoryId: game.categoryId,
//             userId: game.userId,
//             imageUrl: game.imageUrl
//         });

//         setEditing(true);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${apiBase}/${id}`);
//             fetchGames();
//         } catch (err) {
//             console.error(err);
//             setError("Failed to delete game.");
//         }
//     };

//     return (
//         <>
//             {/* <OwnerNavbar /> */}
//             <div className="dashboard-container d-flex">
//                 <Sidebar />
//                 <div className="main-content flex-grow-1">
//                     <DashboardHeader />
//                     <div className="container-fluid mt-4">
//                         <div className="container py-4" style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", color: "#00ffcc" }}>
//                             <h2 className="text-center mb-4" style={{ textShadow: "0 0 15px #00ffcc" }}>
//                                 🛠 Game Manager (CRUD)
//                             </h2>

//                             {error && <div className="alert alert-danger">{error}</div>}

//                             <form onSubmit={handleSubmit} className="p-4 rounded mb-4"
//                                 style={{
//                                     background: "linear-gradient(145deg, rgba(20, 20, 70, 0.9), rgba(0, 255, 150, 0.2))",
//                                     border: "2px solid #00ffcc",
//                                     boxShadow: "0 0 15px #00ffcc"
//                                 }}>
//                                 <h4>{editing ? "Update Game" : "Add New Game"}</h4>

//                                 <div className="mb-2">
//                                     <label>Title</label>
//                                     <input type="text" name="title" value={formData.title} onChange={handleChange}
//                                         className="form-control bg-dark text-white border-neon" required />
//                                 </div>
//                                 <div className="mb-2">
//                                     <label>Description</label>
//                                     <textarea name="description" value={formData.description} onChange={handleChange}
//                                         className="form-control bg-dark text-white border-neon" required />
//                                 </div>
//                                 <div className="mb-2">
//                                     <label>Pricing</label>
//                                     <input type="number" name="pricing" value={formData.pricing} onChange={handleChange}
//                                         className="form-control bg-dark text-white border-neon" required />
//                                 </div>
//                                 <div className="mb-2">
//                                     <label>Upload Image</label>
//                                     <input
//                                         type="file"
//                                         name="imageFile"
//                                         onChange={handleImageChange}
//                                         className="form-control bg-dark text-white border-neon"
//                                         accept="image/*"
//                                         required={!editing}
//                                     />
//                                 </div>
//                                 {editing && formData.imageUrl && (
//                                     <div className="mb-3">
//                                         <label>Current Image Preview:</label>
//                                         <img
//                                             src={`https://localhost:7186/uploads/${formData.imageUrl}`}
//                                             alt="Current Game"
//                                             style={{ width: "100%", maxHeight: "200px", objectFit: "cover", border: "1px solid #00ffcc", marginTop: "8px" }}
//                                         />
//                                     </div>
//                                 )}

//                                 <div className="mb-2">
//                                     <label>Category</label>
//                                     <select
//                                         name="categoryId"
//                                         value={formData.categoryId}
//                                         onChange={handleChange}
//                                         className="form-control bg-dark text-white border-neon"
//                                         required
//                                     >
//                                         <option value="">Select Category</option>
//                                         {categories.map((cat) => (
//                                             <option key={cat.cid} value={cat.cid}>
//                                                 {cat.cname}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div className="mb-2">
//                                     {/* <label>User ID</label> */}
//                                     {/* <input type="number" name="userId" value={formData.userId} onChange={handleChange}
//                             className="form-control bg-dark text-white border-neon" required /> */}
//                                     <input type="hidden" name="userId" value={formData.userId} />

//                                 </div>
//                                 <button type="submit" className="btn btn-success"
//                                     style={{ backgroundColor: "#00ffcc", border: "none", boxShadow: "0 0 10px #00ffcc" }}>
//                                     {editing ? "Update" : "Add"}
//                                 </button>
//                             </form>

//                             <h4 className="mb-3">🎮 Game List</h4>
//                             {games.length === 0 ? (
//                                 <p className="text-center" style={{ color: "#ccc", fontStyle: "italic" }}>
//                                     No games added yet.
//                                 </p>
//                             ) : (
//                                 <div className="row">
//                                     {games.map((game) => (
//                                         <div key={game.gameId} className="col-md-4 mb-3">
//                                             <div className="p-3 rounded"
//                                                 style={{
//                                                     background: "rgba(0, 0, 0, 0.7)",
//                                                     border: "1px solid #00ffcc",
//                                                     boxShadow: "0 0 10px rgba(0,255,204,0.4)"
//                                                 }}>
//                                                 <h5 style={{ color: "#0ff" }}>{game.title}</h5>
//                                                 <p style={{ color: "#ccc" }}>{game.description}</p>
//                                                 <p><strong>₹</strong>{game.pricing}</p>
//                                                 <p><strong>Category:</strong> {game.cname}</p>
//                                                 <p><strong>User ID:</strong> {game.userId}</p>
//                                                 <img src={`https://localhost:7186/uploads/${game.imageUrl}`} alt={game.title} style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />

//                                                 <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(game)}>Edit</button>
//                                                 <button className="btn btn-sm btn-danger" onClick={() => handleDelete(game.gameId)}>Delete</button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </>
//     );
// };

// export default GameManager;
// ---------------------------------------------------


"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Gamepad2, Plus, Edit, Trash2, Upload, Search, Filter, Grid, List, Star, Eye, DollarSign, Tag, ImageIcon, Save, X, AlertCircle, CheckCircle, TrendingUp, Users, Calendar, Download, Share2, MoreVertical, Zap } from 'lucide-react'
import { getUserInfo } from "../../auth/JwtUtils"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import toast, { Toaster } from "react-hot-toast"
import "./GameManager.css"

const GameManager = () => {
  const [games, setGames] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [formData, setFormData] = useState({
    gameId: 0,
    title: "",
    description: "",
    pricing: "",
    categoryId: "",
    userId: "",
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const userInfo = getUserInfo()
  const userId = userInfo?.UserId
  const apiBase = "https://localhost:7186/api/TblGames"

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://localhost:7186/api/TblGameCategories")
      setCategories(res.data)
    } catch (err) {
      console.error("Failed to fetch categories", err)
      toast.error("Failed to load categories")
    }
  }

  const fetchGames = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${apiBase}/ByUser/${userId}`)
      setGames(res.data)
      setFilteredGames(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch games.")
      toast.error("Failed to load games")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        userId: userId,
      }))
      fetchGames()
      fetchCategories()
    }
  }, [userId])

  // Filter and sort games
  useEffect(() => {
    let filtered = games

    if (searchTerm) {
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((game) => game.categoryId.toString() === selectedCategory)
    }

    // Sort games
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
        break
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.pricing || 0) - parseFloat(a.pricing || 0))
        break
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.pricing || 0) - parseFloat(b.pricing || 0))
        break
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    setFilteredGames(filtered)
  }, [searchTerm, selectedCategory, games, sortBy])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const data = new FormData()
    data.append("GameId", formData.gameId)
    data.append("Title", formData.title)
    data.append("Description", formData.description)
    data.append("Pricing", formData.pricing)
    data.append("CategoryId", formData.categoryId)
    data.append("UserId", userId)
    if (imageFile) {
      data.append("ImageFile", imageFile)
    }

    try {
      if (editing) {
        await axios.post(`${apiBase}/UpdateGameWithImage`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Game updated successfully!")
      } else {
        await axios.post(apiBase, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Game added successfully!")
      }

      setFormData({
        gameId: 0,
        title: "",
        description: "",
        pricing: "",
        categoryId: "",
        userId: userId,
      })
      setImageFile(null)
      setImagePreview(null)
      setEditing(false)
      setShowModal(false)
      fetchGames()
    } catch (err) {
      console.error(err)
      setError("Failed to save game.")
      toast.error("Failed to save game")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (game) => {
    setFormData({
      gameId: game.gameId,
      title: game.title,
      description: game.description,
      pricing: game.pricing,
      categoryId: game.categoryId,
      userId: game.userId,
      imageUrl: game.imageUrl,
    })
    setImagePreview(`https://localhost:7186/uploads/${game.imageUrl}`)
    setEditing(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game?")) {
      return
    }

    try {
      await axios.delete(`${apiBase}/${id}`)
      toast.success("Game deleted successfully!")
      fetchGames()
    } catch (err) {
      console.error(err)
      setError("Failed to delete game.")
      toast.error("Failed to delete game")
    }
  }

  const openAddModal = () => {
    setFormData({
      gameId: 0,
      title: "",
      description: "",
      pricing: "",
      categoryId: "",
      userId: userId,
    })
    setImageFile(null)
    setImagePreview(null)
    setEditing(false)
    setShowModal(true)
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false)
    }
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId)
    return category ? category.categoryName : "Unknown"
  }

  const getTotalValue = () => {
    return games.reduce((sum, game) => sum + parseFloat(game.pricing || 0), 0).toFixed(2)
  }

  const getAveragePrice = () => {
    if (games.length === 0) return "0.00"
    return (games.reduce((sum, game) => sum + parseFloat(game.pricing || 0), 0) / games.length).toFixed(2)
  }

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

      <div className={`main-content ${sidebarOpen && window.innerWidth >= 992 ? "sidebar-open" : "sidebar-closed"}`}>
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <main className="content-area">
          <div className="content-wrapper">
            {/* Header Section */}
            <div className="dashboard-header">
              <div className="header-content">
                <div>
                  <h1 className="dashboard-title">
                    <Gamepad2 className="title-icon" />
                    Game Manager
                  </h1>
                  <p className="dashboard-subtitle">Create, manage, and optimize your gaming portfolio</p>
                </div>
                <div className="system-status">
                  <div className="status-indicator active"></div>
                  <span>Games Online</span>
                </div>
              </div>
            </div>

            {/* Enhanced Statistics Grid */}
            <div className="stats-grid">
              <div className="stat-card stat-card-primary">
                <div className="stat-icon-wrapper">
                  <Gamepad2 className="stat-icon" size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{games.length}</div>
                  <div className="stat-label">Total Games</div>
                  <div className="stat-trend">
                    <TrendingUp size={16} />
                    <span>Published</span>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-success">
                <div className="stat-icon-wrapper">
                  <DollarSign className="stat-icon" size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">${getTotalValue()}</div>
                  <div className="stat-label">Total Value</div>
                  <div className="stat-trend">
                    <Star size={16} />
                    <span>Portfolio</span>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-accent">
                <div className="stat-icon-wrapper">
                  <Tag className="stat-icon" size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{categories.length}</div>
                  <div className="stat-label">Categories</div>
                  <div className="stat-trend">
                    <Zap size={16} />
                    <span>Active</span>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-secondary">
                <div className="stat-icon-wrapper">
                  <Users className="stat-icon" size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">${getAveragePrice()}</div>
                  <div className="stat-label">Avg. Price</div>
                  <div className="stat-trend">
                    <Calendar size={16} />
                    <span>Per Game</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Panel */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <Gamepad2 className="panel-icon" />
                  Game Portfolio
                </div>
                <div className="panel-actions">
                  <button className="panel-action secondary" onClick={() => setShowFilters(!showFilters)}>
                    <Filter size={16} />
                    Filters
                  </button>
                  <button className="panel-action primary" onClick={openAddModal}>
                    <Plus size={16} />
                    Add Game
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
                        placeholder="Search games by title or description..."
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
                        <select
                          className="enhanced-select"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="name">Name A-Z</option>
                          <option value="price-high">Price High-Low</option>
                          <option value="price-low">Price Low-High</option>
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
                              <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
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
                      {filteredGames.length} of {games.length} games
                    </span>
                    {(searchTerm || selectedCategory) && (
                      <span className="filter-indicator">
                        <Filter size={14} />
                        Filtered
                      </span>
                    )}
                  </div>
                </div>

                {/* Games Display */}
                <div className="games-container">
                  {loading ? (
                    <div className="dashboard-loading">
                      <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                      </div>
                      <div className="loading-text">Loading your games...</div>
                    </div>
                  ) : filteredGames.length === 0 ? (
                    <div className="no-data">
                      <div className="no-data-content">
                        <div className="no-data-icon">
                          <Gamepad2 size={64} />
                        </div>
                        <h3 className="no-data-title">
                          {games.length === 0 ? "No games yet" : "No games match your filters"}
                        </h3>
                        <p className="no-data-description">
                          {games.length === 0
                            ? "Create your first game to start building your portfolio"
                            : "Try adjusting your search or filter criteria"}
                        </p>
                        {games.length === 0 && (
                          <button className="enhanced-btn primary large" onClick={openAddModal}>
                            <Plus size={20} />
                            Create Your First Game
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={`games-grid ${viewMode}`}>
                      {filteredGames.map((game) => (
                        <div key={game.gameId} className="game-card">
                          <div className="game-image-container">
                            <img
                              src={`https://localhost:7186/uploads/${game.imageUrl}`}
                              alt={game.title}
                              className="game-image"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg?height=200&width=300"
                              }}
                            />
                            <div className="game-overlay">
                              <div className="overlay-actions">
                                <button
                                  className="overlay-btn"
                                  onClick={() =>
                                    window.open(`https://localhost:7186/uploads/${game.imageUrl}`, "_blank")
                                  }
                                  title="View Full Image"
                                >
                                  <Eye size={16} />
                                </button>
                                <button className="overlay-btn" onClick={() => handleEdit(game)} title="Edit Game">
                                  <Edit size={16} />
                                </button>
                                <button
                                  className="overlay-btn delete"
                                  onClick={() => handleDelete(game.gameId)}
                                  title="Delete Game"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="game-badge">
                              <Tag size={12} />
                              <span>{getCategoryName(game.categoryId)}</span>
                            </div>
                          </div>

                          <div className="game-content">
                            <div className="game-header">
                              <h3 className="game-title">{game.title}</h3>
                              <div className="game-price">
                                <DollarSign size={14} />
                                {game.pricing}
                              </div>
                            </div>

                            <p className="game-description">{game.description}</p>

                            <div className="game-meta">
                              <div className="meta-item">
                                <div className="meta-icon">
                                  <Tag size={14} />
                                </div>
                                <span className="meta-text">{getCategoryName(game.categoryId)}</span>
                              </div>
                              <div className="meta-item">
                                <div className="status-dot active"></div>
                                <span className="meta-text">Published</span>
                              </div>
                            </div>
                          </div>

                          <div className="game-actions">
                            <button className="action-btn edit" onClick={() => handleEdit(game)}>
                              <Edit size={16} />
                              <span>Edit</span>
                            </button>
                            <button className="action-btn delete" onClick={() => handleDelete(game.gameId)}>
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
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Add/Edit Game Modal */}
            {showModal && (
              <div className="modal-overlay">
                <div className="enhanced-modal extra-large">
                  {/* Modal Header */}
                  <div className="modal-header">
                    <div className="modal-header-content">
                      <div className="modal-icon-wrapper">
                        <Gamepad2 className="modal-icon" />
                        <div className="icon-pulse"></div>
                      </div>
                      <div className="modal-title-section">
                        <h2 className="modal-title">{editing ? "Edit Game" : "Create New Game"}</h2>
                        <p className="modal-subtitle">
                          {editing ? "Update your game information" : "Add a new game to your portfolio"}
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
                        {/* Left Column - Game Details */}
                        <div className="form-section">
                          <h3 className="section-title">
                            <Gamepad2 size={16} />
                            Game Information
                          </h3>

                          <div className="form-group">
                            <label className="form-label">
                              <span>Game Title</span>
                              <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                              <input
                                type="text"
                                name="title"
                                className="enhanced-input"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter an engaging game title"
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
                                placeholder="Describe your game's features, gameplay, and what makes it unique..."
                                rows="4"
                                required
                              />
                              <div className="input-border"></div>
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">
                                <span>Price (USD)</span>
                                <span className="required">*</span>
                              </label>
                              <div className="input-wrapper">
                                <div className="input-prefix">$</div>
                                <input
                                  type="number"
                                  name="pricing"
                                  className="enhanced-input with-prefix"
                                  value={formData.pricing}
                                  onChange={handleChange}
                                  placeholder="0.00"
                                  step="0.01"
                                  min="0"
                                  required
                                />
                                <div className="input-border"></div>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                <span>Category</span>
                                <span className="required">*</span>
                              </label>
                              <div className="input-wrapper">
                                <select
                                  name="categoryId"
                                  className="enhanced-input"
                                  value={formData.categoryId}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="">Select a category</option>
                                  {categories.map((category) => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                      {category.categoryName}
                                    </option>
                                  ))}
                                </select>
                                <div className="input-border"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Image Upload */}
                        <div className="form-section">
                          <h3 className="section-title">
                            <ImageIcon size={16} />
                            Game Artwork
                          </h3>

                          <div className="image-upload-section">
                            <div className="image-upload-area">
                              {imagePreview ? (
                                <div className="image-preview">
                                  <img src={imagePreview || "/placeholder.svg"} alt="Game preview" />
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
                                  <h4>Upload Game Artwork</h4>
                                  <p>Drag & drop your image here or click to browse</p>
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
                                required={!editing && !imagePreview}
                                style={{ display: "none" }}
                              />
                            </div>

                            <div className="upload-guidelines">
                              <h4>Image Guidelines</h4>
                              <div className="guidelines-list">
                                <div className="guideline-item">
                                  <CheckCircle size={16} />
                                  <span>Recommended: 1920x1080px (16:9 ratio)</span>
                                </div>
                                <div className="guideline-item">
                                  <CheckCircle size={16} />
                                  <span>Maximum file size: 5MB</span>
                                </div>
                                <div className="guideline-item">
                                  <CheckCircle size={16} />
                                  <span>Supported formats: JPG, PNG, WebP</span>
                                </div>
                                <div className="guideline-item">
                                  <CheckCircle size={16} />
                                  <span>High quality artwork improves visibility</span>
                                </div>
                              </div>
                            </div>
                          </div>
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
                          {editing ? "Update Game" : "Create Game"}
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

export default GameManager


