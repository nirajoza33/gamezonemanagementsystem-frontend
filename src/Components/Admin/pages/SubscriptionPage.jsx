// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Search, Plus, Edit, Trash2, X, Save, Check, Filter, ToggleLeft, ToggleRight } from "lucide-react"
// import { useSubscriptionStore } from "../store/subscriptionStore"
// import toast from "react-hot-toast"

// const SubscriptionPage = () => {
//   const {
//     plans,
//     fetchPlans,
//     createPlan,
//     updatePlan,
//     deletePlan,
//     togglePlanStatus,
//     setSearchTerm,
//     setUserTypeFilter,
//     setBillingCycleFilter,
//     filteredPlans,
//     loading,
//   } = useSubscriptionStore()

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//   const [selectedPlan, setSelectedPlan] = useState(null)
//   const [planToDelete, setPlanToDelete] = useState(null)
//   const [formData, setFormData] = useState({
//     name: "",
//     price: 0,
//     billingCycle: "monthly",
//     features: [""],
//     userType: "user",
//     isActive: true,
//   })
//   const [showFilters, setShowFilters] = useState(false)

//   useEffect(() => {
//     fetchPlans()
//   }, [fetchPlans])

//   const openAddModal = () => {
//     setSelectedPlan(null)
//     setFormData({
//       name: "",
//       price: 0,
//       billingCycle: "monthly",
//       features: [""],
//       userType: "user",
//       isActive: true,
//     })
//     setIsModalOpen(true)
//   }

//   const openEditModal = (plan) => {
//     setSelectedPlan(plan)
//     setFormData({
//       name: plan.name,
//       price: plan.price,
//       billingCycle: plan.billingCycle,
//       features: [...plan.features],
//       userType: plan.userType,
//       isActive: plan.isActive,
//     })
//     setIsModalOpen(true)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       if (selectedPlan) {
//         await updatePlan(selectedPlan.id, formData)
//         toast.success("Subscription plan updated successfully")
//       } else {
//         await createPlan(formData)
//         toast.success("Subscription plan created successfully")
//       }
//       setIsModalOpen(false)
//     } catch (error) {
//       console.error(error)
//       toast.error("An error occurred")
//     }
//   }

//   const confirmDelete = (planId) => {
//     setPlanToDelete(planId)
//     setIsDeleteModalOpen(true)
//   }

//   const handleDelete = async () => {
//     if (!planToDelete) return
//     try {
//       await deletePlan(planToDelete)
//       toast.success("Subscription plan deleted successfully")
//       setIsDeleteModalOpen(false)
//       setPlanToDelete(null)
//     } catch (error) {
//       console.error(error)
//       toast.error("An error occurred")
//     }
//   }

//   const handleToggleStatus = async (planId) => {
//     try {
//       await togglePlanStatus(planId)
//       toast.success("Plan status updated")
//     } catch (error) {
//       console.error(error)
//       toast.error("An error occurred")
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     if (name === "price") {
//       setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) }))
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }))
//     }
//   }

//   const handleFeatureChange = (index, value) => {
//     const updatedFeatures = [...formData.features]
//     updatedFeatures[index] = value
//     setFormData((prev) => ({ ...prev, features: updatedFeatures }))
//   }

//   const addFeature = () => {
//     setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
//   }

//   const removeFeature = (index) => {
//     const updatedFeatures = [...formData.features]
//     updatedFeatures.splice(index, 1)
//     setFormData((prev) => ({ ...prev, features: updatedFeatures }))
//   }

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value)
//   }

//   return (
//     <div>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="mb-4"
//       >
//         <h1 className="fs-4 fw-bold">Subscription Plans</h1>
//         <p className="text-white-50">Manage subscription plans for users and game zone owners</p>
//       </motion.div>

//       {/* Search and filters */}
//       <div className="mb-4">
//         <div className="row g-3 align-items-center">
//           <div className="col-12 col-md-6">
//             <div className="position-relative">
//               <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-white-50" size={18} />
//               <input type="text" placeholder="Search plans..." className="form-control ps-5" onChange={handleSearch} />
//             </div>
//           </div>

//           <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
//             <button
//               type="button"
//               onClick={() => setShowFilters(!showFilters)}
//               className="btn btn-outline-light d-flex align-items-center"
//             >
//               <Filter size={16} className="me-2" />
//               Filters
//             </button>

//             <button type="button" onClick={openAddModal} className="btn btn-primary d-flex align-items-center">
//               <Plus size={16} className="me-2" />
//               Add Plan
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         {showFilters && (
//           <motion.div
//             className="card mt-3"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="card-body">
//               <div className="row g-3">
//                 <div className="col-12 col-md-6">
//                   <label className="form-label small fw-medium text-white-50">User Type</label>
//                   <select className="form-select" onChange={(e) => setUserTypeFilter(e.target.value)}>
//                     <option value="all">All User Types</option>
//                     <option value="user">User</option>
//                     <option value="owner">Owner</option>
//                     <option value="both">Both</option>
//                   </select>
//                 </div>

//                 <div className="col-12 col-md-6">
//                   <label className="form-label small fw-medium text-white-50">Billing Cycle</label>
//                   <select className="form-select" onChange={(e) => setBillingCycleFilter(e.target.value)}>
//                     <option value="all">All Billing Cycles</option>
//                     <option value="monthly">Monthly</option>
//                     <option value="yearly">Yearly</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>

//       {/* Subscription plans cards */}
//       <div className="row g-4">
//         {loading ? (
//           <div className="col-12 d-flex justify-content-center py-5">
//             <div className="spinner-border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         ) : filteredPlans.length === 0 ? (
//           <div className="col-12 text-center py-5">
//             <p className="text-white-50">No subscription plans found</p>
//           </div>
//         ) : (
//           filteredPlans.map((plan) => (
//             <div key={plan.id} className="col-12 col-md-6 col-lg-4">
//               <motion.div
//                 className="card h-100"
//                 style={{
//                   borderColor: plan.isActive ? "rgba(255, 255, 255, 0.1)" : "rgba(220, 53, 69, 0.3)",
//                   opacity: plan.isActive ? 1 : 0.7,
//                 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: plan.isActive ? 1 : 0.7, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="card-title fw-bold mb-0">{plan.name}</h5>
//                     <div className="d-flex gap-1">
//                       <span className={`badge ${plan.isActive ? "badge-success" : "badge-danger"}`}>
//                         {plan.isActive ? "Active" : "Inactive"}
//                       </span>
//                       <span
//                         className={`badge ${
//                           plan.userType === "user"
//                             ? "badge-primary"
//                             : plan.userType === "owner"
//                               ? "badge-secondary"
//                               : "badge-accent"
//                         }`}
//                       >
//                         {plan.userType === "user" ? "User" : plan.userType === "owner" ? "Owner" : "Both"}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <span className="fs-3 fw-bold">${plan.price}</span>
//                     <span className="text-white-50 ms-1">/{plan.billingCycle}</span>
//                   </div>

//                   <ul className="list-unstyled mb-4">
//                     {plan.features.map((feature, index) => (
//                       <li key={index} className="d-flex mb-2">
//                         <Check size={16} className="text-success me-2 flex-shrink-0 mt-1" />
//                         <span className="text-white-50">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <div className="d-flex justify-content-between align-items-center">
//                     <button type="button" onClick={() => handleToggleStatus(plan.id)} className="btn btn-link p-0">
//                       {plan.isActive ? (
//                         <ToggleRight size={20} className="text-success" />
//                       ) : (
//                         <ToggleLeft size={20} className="text-danger" />
//                       )}
//                     </button>

//                     <div className="d-flex gap-1">
//                       <button
//                         type="button"
//                         onClick={() => openEditModal(plan)}
//                         className="btn btn-sm btn-link text-secondary"
//                       >
//                         <Edit size={16} />
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => confirmDelete(plan.id)}
//                         className="btn btn-sm btn-link text-danger"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Add/Edit Plan Modal */}
//       {isModalOpen && (
//         <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <motion.div
//               className="modal-content"
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="modal-header">
//                 <h5 className="modal-title">{selectedPlan ? "Edit Subscription Plan" : "Add New Subscription Plan"}</h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={() => setIsModalOpen(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <form onSubmit={handleSubmit}>
//                   <div className="row g-3 mb-3">
//                     <div className="col-12 col-md-6">
//                       <label htmlFor="name" className="form-label small fw-medium text-white-50">
//                         Plan Name
//                       </label>
//                       <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="form-control"
//                         required
//                       />
//                     </div>

//                     <div className="col-12 col-md-6">
//                       <label htmlFor="price" className="form-label small fw-medium text-white-50">
//                         Price
//                       </label>
//                       <input
//                         type="number"
//                         id="price"
//                         name="price"
//                         step="0.01"
//                         value={formData.price}
//                         onChange={handleChange}
//                         className="form-control"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="row g-3 mb-4">
//                     <div className="col-12 col-md-6">
//                       <label htmlFor="billingCycle" className="form-label small fw-medium text-white-50">
//                         Billing Cycle
//                       </label>
//                       <select
//                         id="billingCycle"
//                         name="billingCycle"
//                         value={formData.billingCycle}
//                         onChange={handleChange}
//                         className="form-select"
//                         required
//                       >
//                         <option value="monthly">Monthly</option>
//                         <option value="yearly">Yearly</option>
//                       </select>
//                     </div>

//                     <div className="col-12 col-md-6">
//                       <label htmlFor="userType" className="form-label small fw-medium text-white-50">
//                         User Type
//                       </label>
//                       <select
//                         id="userType"
//                         name="userType"
//                         value={formData.userType}
//                         onChange={handleChange}
//                         className="form-select"
//                         required
//                       >
//                         <option value="user">User</option>
//                         <option value="owner">Owner</option>
//                         <option value="both">Both</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                       <label className="form-label small fw-medium text-white-50 mb-0">Features</label>
//                       <button
//                         type="button"
//                         onClick={addFeature}
//                         className="btn btn-link text-secondary p-0 small d-flex align-items-center"
//                       >
//                         <Plus size={14} className="me-1" />
//                         Add Feature
//                       </button>
//                     </div>

//                     {formData.features.map((feature, index) => (
//                       <div key={index} className="d-flex align-items-center mb-2">
//                         <input
//                           type="text"
//                           value={feature}
//                           onChange={(e) => handleFeatureChange(index, e.target.value)}
//                           className="form-control me-2"
//                           placeholder="Feature description"
//                           required
//                         />
//                         {formData.features.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeFeature(index)}
//                             className="btn btn-link text-danger p-0"
//                           >
//                             <X size={16} />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                   <div className="d-flex justify-content-end gap-2">
//                     <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline-light">
//                       Cancel
//                     </button>
//                     <button type="submit" className="btn btn-primary d-flex align-items-center">
//                       <Save size={16} className="me-2" />
//                       {selectedPlan ? "Update Plan" : "Create Plan"}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           </div>
//           <div className="modal-backdrop fade show"></div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {isDeleteModalOpen && (
//         <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
//           <div className="modal-dialog modal-dialog-centered">
//             <motion.div
//               className="modal-content"
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="modal-header">
//                 <h5 className="modal-title text-danger">Confirm Deletion</h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={() => setIsDeleteModalOpen(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p>Are you sure you want to delete this subscription plan? This action cannot be undone.</p>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn btn-outline-light">
//                   Cancel
//                 </button>
//                 <button type="button" onClick={handleDelete} className="btn btn-danger">
//                   Delete Plan
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//           <div className="modal-backdrop fade show"></div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default SubscriptionPage

"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, X, Save, Check, Filter, ToggleLeft, ToggleRight, Crown, Users, Calendar, TrendingUp, Activity, Shield, Award } from 'lucide-react'
import { useSubscriptionStore } from "../store/subscriptionStore"
import toast, { Toaster } from "react-hot-toast"
// import "./css/SubscriptionPage.css"
import "../components/css/SubscriptionPage.css"

const SubscriptionPage = () => {
  const {
    plans,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    setSearchTerm,
    setUserTypeFilter,
    setBillingCycleFilter,
    filteredPlans,
    loading,
  } = useSubscriptionStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [planToDelete, setPlanToDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    billingCycle: "monthly",
    features: [""],
    userType: "user",
    isActive: true,
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const openAddModal = () => {
    setSelectedPlan(null)
    setFormData({
      name: "",
      price: 0,
      billingCycle: "monthly",
      features: [""],
      userType: "user",
      isActive: true,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (plan) => {
    setSelectedPlan(plan)
    setFormData({
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      features: [...plan.features],
      userType: plan.userType,
      isActive: plan.isActive,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedPlan) {
        await updatePlan(selectedPlan.id, formData)
        toast.success("Subscription plan updated successfully")
      } else {
        await createPlan(formData)
        toast.success("Subscription plan created successfully")
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    }
  }

  const confirmDelete = (planId) => {
    setPlanToDelete(planId)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!planToDelete) return
    try {
      await deletePlan(planToDelete)
      toast.success("Subscription plan deleted successfully")
      setIsDeleteModalOpen(false)
      setPlanToDelete(null)
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    }
  }

  const handleToggleStatus = async (planId) => {
    try {
      await togglePlanStatus(planId)
      toast.success("Plan status updated")
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "price") {
      setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Calculate statistics
  const totalPlans = plans.length;
  const activePlans = plans.filter((p) => p.isActive).length;
  const userPlans = plans.filter((p) => p.userType === "user").length;
  const ownerPlans = plans.filter((p) => p.userType === "owner").length;

  const getUserTypeIcon = (userType) => {
    switch(userType) {
      case "user": return <Users size={16} />;
      case "owner": return <Crown size={16} />;
      case "both": return <Shield size={16} />;
      default: return <Users size={16} />;
    }
  };

  const getUserTypeBadgeClass = (userType) => {
    switch(userType) {
      case "user": return "badge-primary";
      case "owner": return "badge-secondary";
      case "both": return "badge-accent";
      default: return "badge-primary";
    }
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
              <Crown className="title-icon" />
              Subscription Plans
            </h1>
            <p className="dashboard-subtitle">Manage subscription plans for users and game zone owners</p>
          </div>
          <div className="system-status">
            <div className="status-indicator active"></div>
            <span>Plans Active</span>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon-wrapper">
            <Crown className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalPlans}</div>
            <div className="stat-label">Total Plans</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+5% this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon-wrapper">
            <Activity className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{activePlans}</div>
            <div className="stat-label">Active Plans</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+8% this week</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-accent">
          <div className="stat-icon-wrapper">
            <Users className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{userPlans}</div>
            <div className="stat-label">User Plans</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+12% this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon-wrapper">
            <Shield className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{ownerPlans}</div>
            <div className="stat-label">Owner Plans</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+18% this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Crown className="panel-icon" />
            Subscription Management
          </div>
          <button className="panel-action" onClick={openAddModal}>
            <Plus size={16} />
            Add Plan
          </button>
        </div>

        <div className="panel-content">
          {/* Controls */}
          <div className="controls-grid">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search subscription plans..."
                className="futuristic-input"
                onChange={handleSearch}
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
                  <label className="filter-label">User Type</label>
                  <select className="futuristic-select" onChange={(e) => setUserTypeFilter(e.target.value)}>
                    <option value="all">All User Types</option>
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Billing Cycle</label>
                  <select className="futuristic-select" onChange={(e) => setBillingCycleFilter(e.target.value)}>
                    <option value="all">All Billing Cycles</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Plans Grid */}
          <div className="subscription-container">
            {loading ? (
              <div className="dashboard-loading">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <div className="loading-text">Loading subscription plans...</div>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="no-data">
                <div className="no-data-content">
                  <Crown size={48} />
                  <h3>No subscription plans found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              </div>
            ) : (
              <div className="subscription-grid">
                {filteredPlans.map((plan) => (
                  <div key={plan.id} className={`subscription-card ${!plan.isActive ? "inactive" : ""}`}>
                    <div className="subscription-header">
                      <div className="subscription-title-section">
                        <h3 className="subscription-title">{plan.name}</h3>
                        <div className="subscription-badges">
                          <span className={`status-badge ${plan.isActive ? "status-active" : "status-inactive"}`}>
                            {plan.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className={`user-type-badge ${getUserTypeBadgeClass(plan.userType)}`}>
                            {getUserTypeIcon(plan.userType)}
                            <span>{plan.userType === "user" ? "User" : plan.userType === "owner" ? "Owner" : "Both"}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="subscription-actions">
                        <button
                          className="subscription-toggle"
                          onClick={() => handleToggleStatus(plan.id)}
                          title={plan.isActive ? "Deactivate Plan" : "Activate Plan"}
                        >
                          {plan.isActive ? (
                            <ToggleRight size={20} className="toggle-active" />
                          ) : (
                            <ToggleLeft size={20} className="toggle-inactive" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="subscription-pricing">
                      <div className="price-display">
                        <span className="currency">$</span>
                        <span className="amount">{plan.price}</span>
                        <span className="period">/{plan.billingCycle}</span>
                      </div>
                    </div>

                    <div className="subscription-features">
                      <h4>Features Included:</h4>
                      <ul className="features-list">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="feature-item">
                            <Check size={14} className="feature-check" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="subscription-footer">
                      <div className="subscription-meta">
                        <div className="meta-item">
                          <Calendar size={12} />
                          <span>{plan.billingCycle}</span>
                        </div>
                        <div className="meta-item">
                          <Award size={12} />
                          <span>Premium</span>
                        </div>
                      </div>

                      <div className="subscription-actions-bottom">
                        <button
                          className="enhanced-action-btn edit-btn"
                          onClick={() => openEditModal(plan)}
                          title="Edit Plan"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="enhanced-action-btn delete-btn"
                          onClick={() => confirmDelete(plan.id)}
                          title="Delete Plan"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Plan Modal */}
      {isModalOpen && (
        <div className="futuristic-modal-overlay">
          <div className="enhanced-modal">
            {/* Modal Header */}
            <div className="enhanced-modal-header">
              <div className="modal-header-content">
                <div className="modal-icon-wrapper">
                  <Crown className="modal-icon" />
                  <div className="icon-pulse"></div>
                </div>
                <div className="modal-title-section">
                  <h2 className="enhanced-modal-title">
                    {selectedPlan ? "Edit Subscription Plan" : "Add New Subscription Plan"}
                  </h2>
                  <p className="modal-subtitle">
                    {selectedPlan ? "Modify existing plan details" : "Create a new subscription plan for users"}
                  </p>
                </div>
              </div>
              <button type="button" className="enhanced-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="enhanced-modal-body">
              <form onSubmit={handleSubmit} className="form-container">
                <div className="form-section">
                  <h3 className="section-title">
                    <Crown size={16} />
                    Plan Information
                  </h3>

                  <div className="enhanced-form-grid">
                    <div className="enhanced-form-group">
                      <label className="enhanced-form-label">
                        <Crown size={16} />
                        <span>Plan Name</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-container">
                        <input
                          type="text"
                          name="name"
                          className="enhanced-input"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter plan name"
                          required
                        />
                        <div className="input-border"></div>
                      </div>
                    </div>

                    <div className="enhanced-form-group">
                      <label className="enhanced-form-label">
                        <Award size={16} />
                        <span>Price</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-container">
                        <input
                          type="number"
                          name="price"
                          step="0.01"
                          className="enhanced-input"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          required
                        />
                        <div className="input-border"></div>
                      </div>
                    </div>

                    <div className="enhanced-form-group">
                      <label className="enhanced-form-label">
                        <Calendar size={16} />
                        <span>Billing Cycle</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-container">
                        <select
                          name="billingCycle"
                          className="enhanced-input"
                          value={formData.billingCycle}
                          onChange={handleChange}
                          required
                        >
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                        <div className="input-border"></div>
                      </div>
                    </div>

                    <div className="enhanced-form-group">
                      <label className="enhanced-form-label">
                        <Users size={16} />
                        <span>User Type</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-container">
                        <select
                          name="userType"
                          className="enhanced-input"
                          value={formData.userType}
                          onChange={handleChange}
                          required
                        >
                          <option value="user">User</option>
                          <option value="owner">Owner</option>
                          <option value="both">Both</option>
                        </select>
                        <div className="input-border"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="features-header">
                    <h3 className="section-title">
                      <Check size={16} />
                      Plan Features
                    </h3>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="add-feature-btn"
                    >
                      <Plus size={14} />
                      Add Feature
                    </button>
                  </div>

                  <div className="features-list-container">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="feature-input-group">
                        <div className="input-container">
                          <input
                            type="text"
                            className="enhanced-input"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder="Feature description"
                            required
                          />
                          <div className="input-border"></div>
                        </div>
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="remove-feature-btn"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="enhanced-modal-footer">
              <button
                type="button"
                className="enhanced-btn secondary"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="button"
                className="enhanced-btn primary"
                onClick={handleSubmit}
              >
                <Save size={16} />
                {selectedPlan ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="futuristic-modal-overlay">
          <div className="futuristic-modal delete-modal">
            <div className="modal-header">
              <h2 className="modal-title">
                <Trash2 size={24} />
                Confirm Deletion
              </h2>
              <button type="button" className="modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-warning">
                <Trash2 size={48} className="warning-icon" />
                <h4>Are you sure you want to delete this subscription plan?</h4>
                <p>
                  This action cannot be undone. All associated subscriptions will be affected and users may lose access to premium features.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                <Trash2 size={16} />
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionPage
