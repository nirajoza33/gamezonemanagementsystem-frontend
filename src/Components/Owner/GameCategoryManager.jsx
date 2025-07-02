// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import OwnerNavbar from "./OwnerNavbar";
// import Sidebar from "./Sidebar";
// import DashboardHeader from "./DashboardHeader";

// const GameCategoryManager = () => {
//     const [toastMessage, setToastMessage] = useState("");
//     const [categories, setCategories] = useState([]);
//     const [formData, setFormData] = useState({
//         categoryId: 0,
//         categoryName: "",
//         description: ""
//     });
//     const [editing, setEditing] = useState(false);
//     const [error, setError] = useState(null);

//     const apiBase = "https://localhost:7186/api/TblGameCategories";

//     // Function to show toast for 3 seconds
//     const showToast = (message) => {
//         setToastMessage(message);
//         setTimeout(() => {
//             setToastMessage("");
//         }, 3000);
//     };

//     const fetchCategories = async () => {
//         try {
//             const res = await axios.get(apiBase);
//             setCategories(res.data);
//         } catch (err) {
//             console.error(err);
//             setError("Failed to fetch categories.");
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);

//         const isDuplicate = categories.some(c =>
//             c.categoryName.toLowerCase() === formData.categoryName.toLowerCase() &&
//             (!editing || c.categoryId !== formData.categoryId)
//         );

//         if (isDuplicate) {
//             showToast("Category name already exists.");
//             return;
//         }

//         try {
//             if (editing) {
//                 await axios.put(`${apiBase}/${formData.categoryId}`, {
//                     categoryName: formData.categoryName,
//                     description: formData.description
//                 });
//                 showToast("Category updated successfully!");
//             } else {
//                 await axios.post(apiBase, {
//                     categoryName: formData.categoryName,
//                     description: formData.description
//                 });
//                 showToast("Category added successfully!");
//             }

//             setFormData({ categoryId: 0, categoryName: "", description: "" });
//             setEditing(false);
//             fetchCategories();
//         } catch (err) {
//             console.error(err);
//             setError("Failed to save category.");
//         }
//     };

//     const handleEdit = (category) => {
//         setFormData({
//             categoryId: category.categoryId,
//             categoryName: category.categoryName,
//             description: category.description
//         });
//         setEditing(true);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${apiBase}/${id}`);
//             fetchCategories();
//         } catch (err) {
//             console.error(err);
//             setError("Failed to delete category.");
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
//                                 📂 Game Category Manager (CRUD)
//                             </h2>

//                             {toastMessage && (
//                                 <div
//                                     style={{
//                                         position: "fixed",
//                                         top: 80,
//                                         left: "80%",
//                                         transform: "translateX(-50%)",
//                                         backgroundColor: "#00ffcc",
//                                         color: "#000",
//                                         padding: "10px 20px",
//                                         borderRadius: 5,
//                                         boxShadow: "0 0 10px #00ffcc",
//                                         zIndex: 9999,
//                                     }}
//                                 >
//                                     {toastMessage}
//                                 </div>
//                             )}


//                             {error && <div className="alert alert-danger">{error}</div>}

//                             <form onSubmit={handleSubmit} className="p-4 rounded mb-4"
//                                 style={{
//                                     background: "linear-gradient(145deg, rgba(20, 20, 70, 0.9), rgba(0, 255, 150, 0.2))",
//                                     border: "2px solid #00ffcc",
//                                     boxShadow: "0 0 15px #00ffcc"
//                                 }}>
//                                 <h4>{editing ? "Update Category" : "Add New Category"}</h4>

//                                 <div className="mb-2">
//                                     <label>Category Name</label>
//                                     <input
//                                         type="text"
//                                         name="categoryName"
//                                         value={formData.categoryName}
//                                         onChange={handleChange}
//                                         className="form-control bg-dark text-white border-neon"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-2">
//                                     <label>Description</label>
//                                     <textarea
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleChange}
//                                         className="form-control bg-dark text-white border-neon"
//                                         required
//                                     />
//                                 </div>

//                                 <button type="submit" className="btn btn-success"
//                                     style={{ backgroundColor: "#00ffcc", border: "none", boxShadow: "0 0 10px #00ffcc" }}>
//                                     {editing ? "Update" : "Add"}
//                                 </button>
//                             </form>

//                             <h4 className="mb-3">📋 Category List</h4>
//                             <div className="row">
//                                 {categories.map((cat) => (
//                                     <div key={cat.categoryId} className="col-md-4 mb-3">
//                                         <div className="p-3 rounded"
//                                             style={{
//                                                 background: "rgba(0, 0, 0, 0.7)",
//                                                 border: "1px solid #00ffcc",
//                                                 boxShadow: "0 0 10px rgba(0,255,204,0.4)"
//                                             }}>
//                                             <h5 style={{ color: "#0ff" }}>{cat.categoryName}</h5>
//                                             <p style={{ color: "#ccc" }}>{cat.description}</p>

//                                             <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(cat)}>Edit</button>
//                                             <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.categoryId)}>Delete</button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </>
//     );
// };

// export default GameCategoryManager;

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  FolderPlus,
  Edit,
  Trash2,
  X,
  Save,
  Search,
  Plus,
  AlertCircle,
  Folder,
  Activity,
  TrendingUp,
} from "lucide-react"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import toast, { Toaster } from "react-hot-toast"
import "./GameCategoryManager.css"

const GameCategoryManager = () => {
  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [formData, setFormData] = useState({
    categoryId: 0,
    categoryName: "",
    description: "",
  })
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const apiBase = "https://localhost:7186/api/TblGameCategories"

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await axios.get(apiBase)
      setCategories(res.data)
      setFilteredCategories(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch categories.")
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Filter categories based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(
        (cat) =>
          cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [searchTerm, categories])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const isDuplicate = categories.some(
      (c) =>
        c.categoryName.toLowerCase() === formData.categoryName.toLowerCase() &&
        (!editing || c.categoryId !== formData.categoryId),
    )

    if (isDuplicate) {
      toast.error("Category name already exists.")
      return
    }

    setLoading(true)
    try {
      if (editing) {
        await axios.put(`${apiBase}/${formData.categoryId}`, {
          categoryName: formData.categoryName,
          description: formData.description,
        })
        toast.success("Category updated successfully!")
      } else {
        await axios.post(apiBase, {
          categoryName: formData.categoryName,
          description: formData.description,
        })
        toast.success("Category added successfully!")
      }

      setFormData({ categoryId: 0, categoryName: "", description: "" })
      setEditing(false)
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      console.error(err)
      setError("Failed to save category.")
      toast.error("Failed to save category")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setFormData({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      description: category.description,
    })
    setEditing(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return
    }

    try {
      await axios.delete(`${apiBase}/${id}`)
      toast.success("Category deleted successfully!")
      fetchCategories()
    } catch (err) {
      console.error(err)
      setError("Failed to delete category.")
      toast.error("Failed to delete category")
    }
  }

  const openAddModal = () => {
    setFormData({ categoryId: 0, categoryName: "", description: "" })
    setEditing(false)
    setShowModal(true)
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false)
    }
  }

  // Calculate statistics
  const totalCategories = categories.length
  const recentCategories = categories.filter(
    (cat) => new Date() - new Date(cat.createdAt || Date.now()) < 7 * 24 * 60 * 60 * 1000,
  ).length

  return (
    <div className="gamezone-layout">
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
                    <FolderPlus className="title-icon" />
                    Category Manager
                  </h1>
                  <p className="dashboard-subtitle">Organize and manage your game categories with advanced tools</p>
                </div>
                <div className="system-status">
                  <div className="status-indicator active"></div>
                  <span>Categories Active</span>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
              <div className="stat-card stat-card-primary">
                <div className="stat-icon-wrapper">
                  <Folder className="stat-icon" />
                  <div className="icon-glow"></div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{totalCategories}</div>
                  <div className="stat-label">Total Categories</div>
                  <div className="stat-trend">
                    <TrendingUp size={16} />
                    <span>+12% this month</span>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-success">
                <div className="stat-icon-wrapper">
                  <Activity className="stat-icon" />
                  <div className="icon-glow"></div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{recentCategories}</div>
                  <div className="stat-label">Recent Additions</div>
                  <div className="stat-trend">
                    <TrendingUp size={16} />
                    <span>This week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Panel */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <FolderPlus className="panel-icon" />
                  Category Management
                </div>
                <button className="panel-action" onClick={openAddModal}>
                  <Plus size={16} />
                  Add Category
                </button>
              </div>

              <div className="panel-content">
                {/* Search Controls */}
                <div className="controls-grid">
                  <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      className="futuristic-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="categories-container">
                  {loading ? (
                    <div className="dashboard-loading">
                      <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                      </div>
                      <div className="loading-text">Loading categories...</div>
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="no-data">
                      <div className="no-data-content">
                        <FolderPlus size={48} />
                        <h3>No categories found</h3>
                        <p>Create your first category to get started</p>
                        <button className="enhanced-btn primary" onClick={openAddModal}>
                          <Plus size={16} />
                          Add Category
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="categories-grid">
                      {filteredCategories.map((category) => (
                        <div key={category.categoryId} className="category-card">
                          <div className="category-header">
                            <div className="category-icon">
                              <Folder size={24} />
                            </div>
                            <h3 className="category-title">{category.categoryName}</h3>
                          </div>

                          <div className="category-content">
                            <p className="category-description">{category.description}</p>
                          </div>

                          <div className="category-actions">
                            <button
                              className="enhanced-action-btn edit-btn"
                              onClick={() => handleEdit(category)}
                              title="Edit Category"
                            >
                              <Edit size={16} />
                              <span>Edit</span>
                            </button>
                            <button
                              className="enhanced-action-btn delete-btn"
                              onClick={() => handleDelete(category.categoryId)}
                              title="Delete Category"
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add/Edit Category Modal */}
            {showModal && (
              <div className="futuristic-modal-overlay">
                <div className="enhanced-modal">
                  {/* Modal Header */}
                  <div className="enhanced-modal-header">
                    <div className="modal-header-content">
                      <div className="modal-icon-wrapper">
                        <FolderPlus className="modal-icon" />
                        <div className="icon-pulse"></div>
                      </div>
                      <div className="modal-title-section">
                        <h2 className="enhanced-modal-title">{editing ? "Edit Category" : "Add New Category"}</h2>
                        <p className="modal-subtitle">
                          {editing ? "Update category information" : "Create a new game category"}
                        </p>
                      </div>
                    </div>
                    <button type="button" className="enhanced-close-btn" onClick={() => setShowModal(false)}>
                      <X size={20} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="enhanced-modal-body">
                    <form onSubmit={handleSubmit} className="form-container">
                      <div className="form-section">
                        <h3 className="section-title">
                          <FolderPlus size={16} />
                          Category Information
                        </h3>

                        <div className="enhanced-form-grid">
                          <div className="enhanced-form-group full-width">
                            <label className="enhanced-form-label">
                              <Folder size={16} />
                              <span>Category Name</span>
                              <span className="required">*</span>
                            </label>
                            <div className="input-container">
                              <input
                                type="text"
                                name="categoryName"
                                className="enhanced-input"
                                value={formData.categoryName}
                                onChange={handleChange}
                                placeholder="Enter category name"
                                required
                              />
                              <div className="input-border"></div>
                            </div>
                          </div>

                          <div className="enhanced-form-group full-width">
                            <label className="enhanced-form-label">
                              <Edit size={16} />
                              <span>Description</span>
                              <span className="required">*</span>
                            </label>
                            <div className="input-container">
                              <textarea
                                name="description"
                                className="enhanced-input enhanced-textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter category description"
                                rows="4"
                                required
                              />
                              <div className="input-border"></div>
                            </div>
                          </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                          <div className="enhanced-error-message">
                            <AlertCircle size={20} />
                            <div>
                              <strong>Error</strong>
                              <p>{error}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Modal Footer */}
                  <div className="enhanced-modal-footer">
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
                          {editing ? "Update Category" : "Create Category"}
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

export default GameCategoryManager
