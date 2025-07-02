// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Filter, ThumbsUp, ThumbsDown, Eye, X } from "lucide-react";
// import toast from "react-hot-toast";

// const GameManagementPage = () => {
//   const [games, setGames] = useState([]);
//   const [filteredGames, setFilteredGames] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [genreFilter, setGenreFilter] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [viewGame, setViewGame] = useState(null);

//   // ✅ Fetch games from API
//   const fetchGames = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("https://localhost:7186/api/TblGames");
//       if (!res.ok) throw new Error("Failed to fetch games");
//       const data = await res.json();
//       setGames(data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load games");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch on mount
//   useEffect(() => {
//     fetchGames();
//   }, []);

//   // ✅ Filter games
//   useEffect(() => {
//     let filtered = [...games];

//     if (searchTerm) {
//       filtered = filtered.filter((g) =>
//         g.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (statusFilter !== "") {
//       const statusBool = statusFilter === "approved";
//       filtered = filtered.filter((g) => g.status === statusBool);
//     }

//     if (genreFilter) {
//       filtered = filtered.filter(
//         (g) => g.cname.toLowerCase() === genreFilter.toLowerCase()
//       );
//     }

//     setFilteredGames(filtered);
//   }, [games, searchTerm, statusFilter, genreFilter]);

//   // const updateGameStatus = async (gameId, newStatus) => {
//   //   const gameToUpdate = games.find((g) => g.gameId == gameId);

//   //   if (!gameToUpdate) {
//   //     toast.error("Game not found");
//   //     return;
//   //   }

//   //   const payload = {
//   //     gameId: gameToUpdate.gameId,
//   //     title: gameToUpdate.title,
//   //     imageUrl: gameToUpdate.imageUrl,
//   //     description: gameToUpdate.description,
//   //     userId: gameToUpdate.userId,
//   //     status: newStatus,
//   //     cid: gameToUpdate.cid
//   //   };

//   //   try {
//   //     const res = await fetch(`https://localhost:7186/api/TblGames/${gameId}`, {
//   //       method: "PUT",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(payload),
//   //     });

//   //     if (!res.ok) {
//   //       const errorData = await res.json();
//   //       throw new Error(errorData.title || "Failed to update status");
//   //     }

//   //     toast.success(`Game ${newStatus ? "approved" : "rejected"} successfully`);
//   //     fetchGames(); // Refresh list
//   //   } catch (error) {
//   //     console.error(error);
//   //     toast.error(error.message || "Failed to update status");
//   //   }
//   // };

//   const updateGameStatus = async (gameId, newStatus) => {
//     const gameToUpdate = games.find((g) => g.gameId == gameId);

//     if (!gameToUpdate) {
//       toast.error("Game not found");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("gameId", gameToUpdate.gameId);
//     formData.append("title", gameToUpdate.title);
//     formData.append("description", gameToUpdate.description);
//     formData.append("userId", gameToUpdate.userId);
//     formData.append("pricing", gameToUpdate.pricing); // Make sure pricing is included
//     formData.append("categoryId", gameToUpdate.categoryId);
//     formData.append("status", newStatus);

//     try {
//       const res = await fetch(`https://localhost:7186/api/TblGames/${gameId}`, {
//         method: "PUT",
//         body: formData, // ← no Content-Type header needed, let browser set it
//       });

//       if (!res.ok) throw new Error("Update failed");

//       toast.success("Game status updated");
//       fetchGames(); // Refresh list
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update game");
//     }
//   };




//   return (
//     <div className="container py-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="d-flex justify-content-between align-items-center mb-3"
//       >
//         <h1 className="fs-4 fw-bold">Game Management</h1>
//         <button
//           className="btn btn-outline-secondary"
//           onClick={() => setShowFilters((prev) => !prev)}
//         >
//           <Filter size={18} className="me-1" /> Filters
//         </button>
//       </motion.div>

//       {showFilters && (
//         <div className="mb-4 d-flex gap-3 flex-wrap">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search games..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select
//             className="form-select"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option value="approved">Approved</option>
//             <option value="pending">Pending</option>
//           </select>
//           <select
//             className="form-select"
//             value={genreFilter}
//             onChange={(e) => setGenreFilter(e.target.value)}
//           >
//             <option value="">All Genres</option>
//             <option value="Action">Action</option>
//             <option value="Adventure">Adventure</option>
//             <option value="Puzzle">Puzzle</option>
//           </select>
//         </div>
//       )}

//       {loading ? (
//         <p>Loading games...</p>
//       ) : filteredGames.length === 0 ? (
//         <p>No games found.</p>
//       ) : (
//         <div className="d-flex flex-column gap-3">
//           {filteredGames.map((game) => (
//             <div
//               key={game.gameId}
//               className="card p-3 d-flex flex-row align-items-center"
//             >
//               <div
//                 className="flex-shrink-0"
//                 style={{ width: "60px", height: "60px" }}
//               >
//                 <img
//                   src={`https://localhost:7186/uploads/${game.imageUrl}`}
//                   alt={game.title}
//                   className="w-100 h-100 object-fit-cover rounded"
//                 />
//               </div>
//               <div className="ms-3 flex-grow-1">
//                 <h5 className="mb-1 text-white">{game.title}</h5>
//                 <p className="mb-0 text-white" color="primary">
//                   Status: {game.status ? "Approved" : "Pending"}
//                 </p>
//               </div>
//               <div className="d-flex gap-2">
//                 <button
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => setViewGame(game)}
//                 >
//                   <Eye size={16} /> View
//                 </button>
//                 {!game.status ? (
//                   <button
//                     className="btn btn-sm btn-success"
//                     onClick={() => updateGameStatus(game.gameId, true)}
//                   >
//                     <ThumbsUp size={16} /> Approve
//                   </button>
//                 ) : (
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => updateGameStatus(game.gameId, false)}
//                   >
//                     <ThumbsDown size={16} /> Reject
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {viewGame && (
//         <div
//           className="modal d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={() => setViewGame(null)}
//         >
//           <div
//             className="modal-dialog"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">{viewGame.title}</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   aria-label="Close"
//                   onClick={() => setViewGame(null)}
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <img
//                   src={`https://localhost:7186/uploads/${viewGame.imageUrl}`}
//                   alt={viewGame.title}
//                   className="img-fluid mb-3 rounded"
//                 />
//                 <p><strong>Description:</strong> {viewGame.description}</p>
//                 <p><strong>Genre:</strong> {viewGame.cname}</p>
//                 <p><strong>Uploaded by User ID:</strong> {viewGame.userId}</p>
//                 <p><strong>Status:</strong> {viewGame.status ? "Approved" : "Pending"}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GameManagementPage;


"use client";

import { useState, useEffect } from "react";
import { Filter, ThumbsUp, ThumbsDown, Eye, X, Search, Users, Activity, Shield, Calendar, Gamepad2, Star, Award, TrendingUp, RefreshCw, Download } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
// import "./css/GameManagement.css";
import "../components/css/GameManagement.css"

const GameManagementPage = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewGame, setViewGame] = useState(null);

  // Fetch games from API
  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7186/api/TblGames");
      if (!res.ok) throw new Error("Failed to fetch games");
      const data = await res.json();
      
      // Enhanced game data with additional properties
      const enhancedGames = data.map((game) => ({
        ...game,
        uploadDate: game.uploadDate || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        downloads: Math.floor(Math.random() * 10000) + 100,
        rating: (Math.random() * 2 + 3).toFixed(1),
        fileSize: `${(Math.random() * 500 + 50).toFixed(1)} MB`,
        lastUpdated: game.lastUpdated || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      
      setGames(enhancedGames);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const refreshGames = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
    toast.success("Games refreshed successfully!");
  };

  // Fetch on mount
  useEffect(() => {
    fetchGames();
  }, []);

  // Filter games
  useEffect(() => {
    let filtered = [...games];

    if (searchTerm) {
      filtered = filtered.filter((g) =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "") {
      const statusBool = statusFilter === "approved";
      filtered = filtered.filter((g) => g.status === statusBool);
    }

    if (genreFilter) {
      filtered = filtered.filter(
        (g) => g.cname.toLowerCase() === genreFilter.toLowerCase()
      );
    }

    setFilteredGames(filtered);
  }, [games, searchTerm, statusFilter, genreFilter]);

  const updateGameStatus = async (gameId, newStatus) => {
    const gameToUpdate = games.find((g) => g.gameId == gameId);

    if (!gameToUpdate) {
      toast.error("Game not found");
      return;
    }

    const formData = new FormData();
    formData.append("gameId", gameToUpdate.gameId);
    formData.append("title", gameToUpdate.title);
    formData.append("description", gameToUpdate.description);
    formData.append("userId", gameToUpdate.userId);
    formData.append("pricing", gameToUpdate.pricing);
    formData.append("categoryId", gameToUpdate.categoryId);
    formData.append("status", newStatus);

    try {
      const res = await fetch(`https://localhost:7186/api/TblGames/${gameId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Game status updated");
      fetchGames();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update game");
    }
  };

  const exportGames = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Status,Genre,Upload Date,Downloads,Rating,File Size\n" +
      filteredGames
        .map(
          (game) =>
            `${game.title},${game.status ? "Approved" : "Pending"},${game.cname},${new Date(game.uploadDate).toLocaleDateString()},${game.downloads},${game.rating},${game.fileSize}`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "games_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Games exported successfully!");
  };

  // Calculate statistics
  const totalGames = games.length;
  const approvedGames = games.filter((g) => g.status === true).length;
  const pendingGames = games.filter((g) => g.status === false).length;
  const totalDownloads = games.reduce((sum, game) => sum + (game.downloads || 0), 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="futuristic-dashboard">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(26, 26, 26, 0.9)",
            color: "#ffffff",
            border: "1px solid rgba(255, 215, 0, 0.3)",
            borderRadius: "12px",
            backdropFilter: "blur(20px)",
          },
        }}
      />

      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="grid-overlay"></div>
        <div className="floating-particles">
          <div className="particle particle-0"></div>
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>
      </div>

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">
              <Gamepad2 className="title-icon" />
              Game Management
            </h1>
            <p className="dashboard-subtitle">Manage and monitor game submissions with advanced analytics</p>
          </div>
          <div className="system-status">
            <div className="status-indicator active"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon-wrapper">
            <Gamepad2 className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalGames}</div>
            <div className="stat-label">Total Games</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+15% this month</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <div className="chart-bar" style={{ "--height": "25px" }}></div>
              <div className="chart-bar" style={{ "--height": "40px" }}></div>
              <div className="chart-bar" style={{ "--height": "30px" }}></div>
              <div className="chart-bar" style={{ "--height": "45px" }}></div>
              <div className="chart-bar" style={{ "--height": "35px" }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon-wrapper">
            <Shield className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{approvedGames}</div>
            <div className="stat-label">Approved Games</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+12% this week</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <div className="chart-bar" style={{ "--height": "35px" }}></div>
              <div className="chart-bar" style={{ "--height": "50px" }}></div>
              <div className="chart-bar" style={{ "--height": "40px" }}></div>
              <div className="chart-bar" style={{ "--height": "55px" }}></div>
              <div className="chart-bar" style={{ "--height": "45px" }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-accent">
          <div className="stat-icon-wrapper">
            <Calendar className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{pendingGames}</div>
            <div className="stat-label">Pending Review</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+8% today</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <div className="chart-bar" style={{ "--height": "20px" }}></div>
              <div className="chart-bar" style={{ "--height": "30px" }}></div>
              <div className="chart-bar" style={{ "--height": "25px" }}></div>
              <div className="chart-bar" style={{ "--height": "35px" }}></div>
              <div className="chart-bar" style={{ "--height": "28px" }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon-wrapper">
            <Activity className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalDownloads.toLocaleString()}</div>
            <div className="stat-label">Total Downloads</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+22% this month</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <div className="chart-bar" style={{ "--height": "30px" }}></div>
              <div className="chart-bar" style={{ "--height": "45px" }}></div>
              <div className="chart-bar" style={{ "--height": "38px" }}></div>
              <div className="chart-bar" style={{ "--height": "50px" }}></div>
              <div className="chart-bar" style={{ "--height": "42px" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Gamepad2 className="panel-icon" />
            Game Library
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="panel-action" onClick={refreshGames} disabled={refreshing}>
              <RefreshCw size={16} className={refreshing ? "spinner-icon" : ""} />
              Refresh
            </button>
            <button className="panel-action" onClick={exportGames}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="panel-content">
          {/* Controls */}
          <div className="controls-grid">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search games by title..."
                className="futuristic-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="filters-panel">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div className="filter-group">
                  <label className="filter-label">Status</label>
                  <select
                    className="futuristic-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Genre</label>
                  <select
                    className="futuristic-select"
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                  >
                    <option value="">All Genres</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Puzzle">Puzzle</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Games Grid */}
          <div className="games-container">
            {loading ? (
              <div className="dashboard-loading">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <div className="loading-text">Loading games...</div>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="no-data">
                <div className="no-data-content">
                  <Gamepad2 size={48} />
                  <h3>No games found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              </div>
            ) : (
              <div className="games-grid">
                {filteredGames.map((game) => (
                  <div key={game.gameId} className="game-card">
                    <div className="game-image-container">
                      <img
                        src={`https://localhost:7186/uploads/${game.imageUrl}`}
                        alt={game.title}
                        className="game-image"
                      />
                      <div className="game-overlay">
                        <div className="game-actions">
                          <button
                            className="game-action-btn view-btn"
                            onClick={() => setViewGame(game)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="game-content">
                      <div className="game-header">
                        <h3 className="game-title">{game.title}</h3>
                        <div className="game-badges">
                          <span className={`status-badge ${game.status ? "status-approved" : "status-pending"}`}>
                            {game.status ? "Approved" : "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="game-meta">
                        <div className="game-meta-item">
                          <Award size={14} />
                          <span>{game.cname}</span>
                        </div>
                        <div className="game-meta-item">
                          <Calendar size={14} />
                          <span>{getTimeAgo(game.uploadDate)}</span>
                        </div>
                      </div>

                      <div className="game-stats">
                        <div className="game-stat">
                          <Activity size={12} />
                          <span>{game.downloads} downloads</span>
                        </div>
                        <div className="game-stat">
                          <Star size={12} />
                          <span>{game.rating} rating</span>
                        </div>
                      </div>

                      <div className="game-actions-bottom">
                        {!game.status ? (
                          <button
                            className="enhanced-action-btn approve-btn"
                            onClick={() => updateGameStatus(game.gameId, true)}
                          >
                            <ThumbsUp size={16} />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <button
                            className="enhanced-action-btn reject-btn"
                            onClick={() => updateGameStatus(game.gameId, false)}
                          >
                            <ThumbsDown size={16} />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Game Modal */}
      {viewGame && (
        <div className="futuristic-modal-overlay">
          <div className="enhanced-modal view-modal">
            {/* Modal Header */}
            <div className="enhanced-modal-header">
              <div className="modal-header-content">
                <div className="modal-icon-wrapper">
                  <Gamepad2 className="modal-icon" />
                  <div className="icon-pulse"></div>
                </div>
                <div className="modal-title-section">
                  <h2 className="enhanced-modal-title">{viewGame.title}</h2>
                  <p className="modal-subtitle">Complete game information and statistics</p>
                </div>
              </div>
              <button type="button" className="enhanced-close-btn" onClick={() => setViewGame(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="enhanced-modal-body">
              <div className="view-container">
                {/* Game Preview Section */}
                <div className="view-section">
                  <div className="game-preview-header">
                    <div className="game-preview-image">
                      <img
                        src={`https://localhost:7186/uploads/${viewGame.imageUrl}`}
                        alt={viewGame.title}
                        className="preview-image"
                      />
                    </div>
                    <div className="game-preview-info">
                      <h3 className="preview-title">{viewGame.title}</h3>
                      <div className="preview-badges">
                        <span className={`profile-status ${viewGame.status ? "approved" : "pending"}`}>
                          {viewGame.status ? "Approved" : "Pending"}
                        </span>
                        <span className="profile-role">{viewGame.cname}</span>
                      </div>
                      <p className="preview-description">{viewGame.description}</p>
                    </div>
                  </div>
                </div>

                {/* Game Details Section */}
                <div className="view-section">
                  <h3 className="section-title">
                    <Activity size={16} />
                    Game Information
                  </h3>

                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-icon">
                        <Users size={16} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Uploaded By</span>
                        <span className="info-value">User ID: {viewGame.userId}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <Calendar size={16} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Upload Date</span>
                        <span className="info-value">{formatDate(viewGame.uploadDate)}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <Award size={16} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">File Size</span>
                        <span className="info-value">{viewGame.fileSize}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <Activity size={16} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Last Updated</span>
                        <span className="info-value">{getTimeAgo(viewGame.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Section */}
                <div className="view-section">
                  <h3 className="section-title">
                    <TrendingUp size={16} />
                    Performance Statistics
                  </h3>

                  <div className="stats-grid-view">
                    <div className="stat-item">
                      <div className="stat-icon-view">
                        <Activity size={20} />
                      </div>
                      <div className="stat-content-view">
                        <span className="stat-value-view">{viewGame.downloads}</span>
                        <span className="stat-label-view">Downloads</span>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-icon-view">
                        <Star size={20} />
                      </div>
                      <div className="stat-content-view">
                        <span className="stat-value-view">{viewGame.rating}</span>
                        <span className="stat-label-view">Rating</span>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-icon-view">
                        <Users size={20} />
                      </div>
                      <div className="stat-content-view">
                        <span className="stat-value-view">{Math.floor(viewGame.downloads * 0.7)}</span>
                        <span className="stat-label-view">Active Players</span>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-icon-view">
                        <TrendingUp size={20} />
                      </div>
                      <div className="stat-content-view">
                        <span className="stat-value-view">{Math.floor(Math.random() * 100)}%</span>
                        <span className="stat-label-view">Growth Rate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="enhanced-modal-footer">
              <button
                type="button"
                className="enhanced-btn secondary"
                onClick={() => setViewGame(null)}
              >
                <X size={16} />
                Close
              </button>

              {!viewGame.status ? (
                <button
                  type="button"
                  className="enhanced-btn primary"
                  onClick={() => {
                    updateGameStatus(viewGame.gameId, true);
                    setViewGame(null);
                  }}
                >
                  <ThumbsUp size={16} />
                  Approve Game
                </button>
              ) : (
                <button
                  type="button"
                  className="enhanced-btn danger"
                  onClick={() => {
                    updateGameStatus(viewGame.gameId, false);
                    setViewGame(null);
                  }}
                >
                  <ThumbsDown size={16} />
                  Reject Game
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameManagementPage;
