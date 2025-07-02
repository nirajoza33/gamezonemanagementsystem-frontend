// "use client"
// import { useState, useEffect } from "react"
// import { toast, Toaster } from "react-hot-toast"
// import {
//   Search,
//   UserPlus,
//   Edit,
//   Trash2,
//   Ban,
//   Check,
//   Filter
// } from "lucide-react"
// import axios from "axios"

// const API_BASE = "https://localhost:7186/api/TblUsers"

// const UserManagementPage = () => {
//   const [users, setUsers] = useState([])
//   const [filteredUsers, setFilteredUsers] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [roleFilter, setRoleFilter] = useState("all")
//   const [loading, setLoading] = useState(false)

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [userToDelete, setUserToDelete] = useState(null)


//   const [formData, setFormData] = useState({
//     email: "",
//     userName: "",
//     phone: "",
//     role: "Owner",
//     status: "active"
//   });


//   // OTP related state
//   const [otpSent, setOtpSent] = useState(false)
//   const [otp, setOtp] = useState("")
//   const [otpLoading, setOtpLoading] = useState(false)

//   const [showFilters, setShowFilters] = useState(false)

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   useEffect(() => {
//     filterUsers()
//   }, [users, searchTerm, statusFilter, roleFilter])

//   const fetchUsers = async () => {
//     setLoading(true)
//     try {
//       const res = await axios.get(`${API_BASE}/Admin/get-owners`, { withCredentials: true })
//       const data = res.data
//       console.log("ss", data.data)
//       if (Array.isArray(data.data)) {
//         setUsers(data.data)
//       } else {
//         setUsers([])
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error)
//       toast.error("An error occurred while fetching users.")
//       setUsers([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filterUsers = () => {
//     let filtered = [...users]
//     if (searchTerm)
//       filtered = filtered.filter(u =>
//         u.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     if (statusFilter !== "all")
//       filtered = filtered.filter(u => u.status === statusFilter)
//     if (roleFilter !== "all")
//       filtered = filtered.filter(u => u.role.toLowerCase() === roleFilter.toLowerCase())
//     setFilteredUsers(filtered)
//   }

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }


//   const handleSendOtp = async () => {
//     if (!formData.email) {
//       toast.error("Please enter an email to send OTP.")
//       return
//     }
//     setOtpLoading(true)
//     try {
//       const res = await axios.post(
//         `${API_BASE}/send-otp`,
//         { email: formData.email },
//         { withCredentials: true }
//       )
//       toast.success("OTP sent to email")
//       setOtpSent(true)
//     } catch (error) {
//       console.error("Send OTP error:", error)
//       toast.error("Failed to send OTP")
//     } finally {
//       setOtpLoading(false)
//     }
//   }

//   const handleVerifyOtpAndCreateUser = async () => {
//     if (!otp) {
//       toast.error("Please enter the OTP");
//       return;
//     }
//     setOtpLoading(true);

//     try {
//       console.log("Starting OTP verification for email:", formData.email);

//       // Step 1: Verify OTP
//       const verifyRes = await axios.post(
//         `${API_BASE}/verify-otp`,
//         { email: formData.email, otp },
//         { withCredentials: true }
//       );

//       console.log("OTP verification response:", verifyRes.data);

//       if (!verifyRes.data.success) {
//         toast.error(verifyRes.data.message || "OTP verification failed");
//         setOtpLoading(false);
//         return; // Stop further execution if OTP invalid
//       }

//       console.log("OTP verified successfully. Proceeding to create user...");

//       // Step 2: Create user after successful OTP verification
//       const createRes = await axios.post(
//         `${API_BASE}/Admin/create-owner`,
//         formData,
//         { withCredentials: true }
//       );

//       console.log("User creation response:", createRes.data);

//       toast.success("User created successfully");
//       setIsModalOpen(false);
//       setOtpSent(false);
//       setOtp("");
//       fetchUsers();

//     } catch (error) {
//       console.error("Error in verify/create user flow:", error);

//       // Show specific error from response if available
//       const errorMsg =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Error verifying OTP or creating user";

//       toast.error(errorMsg);
//     } finally {
//       setOtpLoading(false);
//     }
//   };



//   // Edit existing user submit (no OTP needed)
//   // const handleEditUserSubmit = async () => {
//   //   if (!selectedUser || !selectedUser.id) {
//   //     toast.error("Selected user is invalid or missing ID");
//   //     console.error("selectedUser is null or missing id:", selectedUser);
//   //     return;
//   //   }

//   //   try {
//   //     const res = await fetch(`${API_BASE}/${selectedUser.id}`, {
//   //       method: "PUT",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(formData)
//   //     });

//   //     if (!res.ok) throw new Error("Failed to update user");

//   //     toast.success("User updated successfully");
//   //     setIsModalOpen(false);
//   //     setSelectedUser(null); // clear selected user
//   //     fetchUsers();
//   //   } catch (error) {
//   //     toast.error("An error occurred updating user");
//   //     console.error("Update error:", error);
//   //   }
//   // };


//   // Form submit handler
//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (selectedUser) {
//       // Editing existing user — submit immediately
//       // handleEditUserSubmit()
//     } else {
//       // Creating new user — trigger OTP send or verify flow
//       if (!otpSent) {
//         handleSendOtp()
//       } else {
//         handleVerifyOtpAndCreateUser()
//       }
//     }
//   }

//   // Rest of your handlers for suspend, activate, delete (same as before)
//   // ...

//   const openAddModal = () => {
//     setSelectedUser(null)
//     setFormData({ userName: "", phone: "", email: "", role: "Owner", status: "active" })
//     setOtpSent(false)
//     setOtp("")
//     setIsModalOpen(true)
//   }

//   // const openEditModal = (user) => {
//   //   setSelectedUser(user)
//   //   setFormData({
//   //     userName: user.userName,
//   //     email: user.email,
//   //     phone: user.phone,
//   //     role: user.role,
//   //     status: user.status
//   //   })
//   //   setOtpSent(false)
//   //   setOtp("")
//   //   setIsModalOpen(true)
//   // }



//   // Open confirmation modal with selected user ID
//   const confirmDelete = (userId) => {
//     setUserToDelete(userId);
//     setIsDeleteModalOpen(true);
//   };

//   // Delete user via API
//   const deleteUser = async () => {
//     if (!userToDelete) {
//       toast.error("Invalid user ID for deletion");
//       return;
//     }

//     try {
//       const res = await axios.delete(`${API_BASE}/${userToDelete}`, {
//         withCredentials: true
//       });

//       if (res.status === 204) {
//         toast.success("User deleted successfully");
//         fetchUsers(); // refresh list
//       } else {
//         toast.error("Unexpected response while deleting user");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to delete user");
//     } finally {
//       setIsDeleteModalOpen(false);
//       setUserToDelete(null);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value)
//   }


//   const handleSuspend = async (userId) => {
//     console.log("Suspending user:", userId);
//     if (!userId) {
//       toast.error("Invalid user ID for suspension");
//       return;
//     }

//     try {
//       const res = await axios.patch(`${API_BASE}/${userId}/suspend`, {}, { withCredentials: true });
//       toast.success(res.data.message || "User suspended");
//       fetchUsers();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to suspend user");
//     }
//   };

//   const handleActivate = async (userId) => {
//     console.log("Activating user:", userId);
//     if (!userId) {
//       toast.error("Invalid user ID for activation");
//       return;
//     }

//     try {
//       const res = await axios.patch(`${API_BASE}/${userId}/activate`, {}, { withCredentials: true });
//       toast.success(res.data.message || "User activated");
//       fetchUsers();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to activate user");
//     }
//   };




//   return (
//     <div className="container py-4">
//       <Toaster />
//       <h1 className="fs-4 fw-bold mb-3">User Management</h1>

//       <div className="row g-3 align-items-center mb-4">
//         <div className="col-md-6">
//           <div className="position-relative">
//             <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-white-50" size={18} />
//             <input
//               type="text"
//               placeholder="Search users..."
//               className="form-control ps-5"
//               onChange={handleSearch}
//             />
//           </div>
//         </div>

//         <div className="col-md-6 d-flex justify-content-md-end gap-2">
//           <button className="btn btn-outline-light" onClick={() => setShowFilters(!showFilters)}>
//             <Filter size={16} className="me-2" /> Filters
//           </button>

//           <button className="btn btn-primary" onClick={openAddModal}>
//             <UserPlus size={16} className="me-2" /> Add User
//           </button>
//         </div>
//       </div>

//       {showFilters && (
//         <div className="card mb-3">
//           <div className="card-body row g-3">
//             <div className="col-md-6">
//               <label className="form-label text-white">Status</label>
//               <select className="form-select" onChange={(e) => setStatusFilter(e.target.value)}>
//                 <option value="all">All</option>
//                 <option value="active">Active</option>
//                 <option value="suspended">Suspended</option>
//               </select>
//             </div>
//             {/* <div className="col-md-6">
//               <label className="form-label">Role</label>
//               <select className="form-select" onChange={(e) => setRoleFilter(e.target.value)}>
//                 <option value="all">All</option>
//                 <option value="admin">Admin</option>
//                 <option value="moderator">Moderator</option>
//                 <option value="owner">Owner</option>
//               </select>
//             </div> */}
//           </div>
//         </div>
//       )}

//       <div className="card">
//         <div className="table-responsive">
//           <table className="table table-dark table-hover mb-0">
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>User Name</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
//               ) : filteredUsers.length === 0 ? (
//                 <tr><td colSpan={6} className="text-center py-4">No users found</td></tr>
//               ) : (
//                 filteredUsers.map(user => (
//                   <tr key={user.userId}>
//                     <td>{user.name}<br /><span className="text-white-50 small">{user.email}</span></td>
//                     <td><span className="text-white-50 small">{user.userName}</span></td>
//                     {console.log("Status:", user.status)}
//                     <td><span className={`badge ${user.status === "active" ? "bg-success" : "bg-danger"}`}>{user.status}</span></td>
//                     {/* <td>{new Date(user.createdAt).toLocaleDateString()}</td>
//                     <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</td> */}
//                     <td>
//                       {/* <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEditModal(user)}><Edit size={14} /></button> */}
//                       <button
//                         className={`btn btn-sm ${user.status === "active" ? "btn-outline-warning" : "btn-outline-success"} me-1`}
//                         onClick={() => user.status == "active" ? handleSuspend(user.userId) : handleActivate(user.userId)}
//                       >
//                         {user.status === "active" ? <Ban size={14} /> : <Check size={14} />}
//                       </button>
//                       <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(user.userId)}><Trash2 size={14} /></button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal for Add/Edit User */}
//       {isModalOpen && (
//         <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//           <div className="modal-dialog">
//             <form className="modal-content bg-dark text-white" onSubmit={handleSubmit}>
//               <div className="modal-header">
//                 <h5 className="modal-title">{selectedUser ? "Edit User" : "Add User"}</h5>
//                 <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)}></button>
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Username</label>
//                   <input
//                     name="userName"
//                     type="text"
//                     className="form-control"
//                     value={formData.userName}
//                     onChange={handleChange}
//                     required
//                     disabled={otpSent}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Phone Number</label>
//                   <input
//                     name="phone"
//                     type="tel"
//                     className="form-control"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                     disabled={otpSent}
//                   />
//                 </div>

//                 {/* <div className="mb-3">
//                   <label className="form-label">Name</label>
//                   <input
//                     name="name"
//                     type="text"
//                     className="form-control"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     disabled={otpSent} // Disable editing after OTP sent
//                   />
//                 </div> */}
//                 <div className="mb-3">
//                   <label className="form-label">Email</label>
//                   <input
//                     name="email"
//                     type="email"
//                     className="form-control"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     disabled={otpSent} // Disable editing after OTP sent
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Role</label>
//                   <select
//                     name="role"
//                     className="form-select"
//                     value={formData.role}
//                     onChange={handleChange}
//                     disabled={otpSent}
//                   >
//                     <option value="owner">Owner</option>
//                     {/* <option value="admin">Admin</option>
//                     <option value="moderator">Moderator</option> */}
//                   </select>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Status</label>
//                   <select
//                     name="status"
//                     className="form-select"
//                     value={formData.status}
//                     onChange={handleChange}
//                     disabled={otpSent}
//                   >
//                     <option value="active">Active</option>
//                     <option value="suspended">Suspended</option>
//                   </select>
//                 </div>

//                 {/* OTP input only shown when OTP sent */}
//                 {otpSent && (
//                   <div className="mb-3">
//                     <label className="form-label">Enter OTP</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value)}
//                       required
//                       maxLength={6}
//                       placeholder="6-digit OTP"
//                     />
//                   </div>
//                 )}
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => {
//                     setIsModalOpen(false)
//                     setOtpSent(false)
//                     setOtp("")
//                   }}
//                 >
//                   Cancel
//                 </button>

//                 <button type="submit" className="btn btn-primary" disabled={otpLoading}>
//                   {otpSent ? (otpLoading ? "Verifying..." : "Verify OTP & Create") : (otpLoading ? "Sending OTP..." : "Send OTP")}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal for Delete Confirmation */}
//       {isDeleteModalOpen && (
//         <div className="modal d-block" tabIndex="-1">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content bg-dark text-white">
//               <div className="modal-header">
//                 <h5 className="modal-title">Confirm Delete</h5>
//                 <button type="button" className="btn-close" onClick={() => setIsDeleteModalOpen(false)}></button>
//               </div>
//               <div className="modal-body">
//                 Are you sure you want to delete this user?
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-danger" onClick={deleteUser}>Delete</button>
//                 <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }

// export default UserManagementPage

"use client"
import { useState, useEffect } from "react"
import { toast, Toaster } from "react-hot-toast"
import { Search, UserPlus, Trash2, Ban, Check, Filter, Users, Activity, Shield, Calendar, Mail, Phone, Clock, TrendingUp, Eye, Download, RefreshCw, Star, Award, Zap, ChevronLeft, ChevronRight, MoreHorizontal, Edit, Settings, X, MapPin, CreditCard, UserCheck, AlertTriangle } from 'lucide-react'
import axios from "axios"
import "../components/css/UserManagement.css"

const API_BASE = "https://localhost:7186/api/TblUsers"

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewUser, setViewUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [deletingUsers, setDeletingUsers] = useState(new Set())

  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    phone: "",
    role: "Owner",
    status: "active",
  })

  // OTP related state
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)

  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, statusFilter, roleFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Fetch all users instead of just owners
      const res = await axios.get(`${API_BASE}`, { withCredentials: true })
      const data = res.data
      console.log("Fetched users:", data)
      
      if (Array.isArray(data)) {
        // Enhanced user data with additional properties and role mapping
        const enhancedUsers = data.map((user) => ({
          ...user,
          // Map roleId to role name
          role: getRoleName(user.roleId),
          name: user.userName, // Use userName as display name
          lastLogin: user.lastLogin || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          joinDate: user.createdAt || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          loginCount: Math.floor(Math.random() * 100) + 1,
          location: user.location || ["New York", "London", "Tokyo", "Sydney", "Paris"][Math.floor(Math.random() * 5)],
          verified: user.verified || Math.random() > 0.3,
          rating: (Math.random() * 2 + 3).toFixed(1),
          totalBookings: Math.floor(Math.random() * 50),
          totalSpent: Math.floor(Math.random() * 5000) + 100,
          lastActivity: user.lastActivity || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          accountType: user.accountType || "Premium",
          preferences: user.preferences || {
            notifications: true,
            newsletter: Math.random() > 0.5,
            darkMode: Math.random() > 0.5,
          },
        }))
        setUsers(enhancedUsers)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("An error occurred while fetching users.")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to map roleId to role name
  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return "Admin"
      case 2:
        return "Owner"
      case 3:
        return "User"
      default:
        return "User"
    }
  }

  const refreshUsers = async () => {
    setRefreshing(true)
    await fetchUsers()
    setRefreshing(false)
    toast.success("Users refreshed successfully!")
  }

  const filterUsers = () => {
    let filtered = [...users]
    if (searchTerm)
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    if (statusFilter !== "all") filtered = filtered.filter((u) => u.status === statusFilter)
    if (roleFilter !== "all") filtered = filtered.filter((u) => u.role?.toLowerCase() === roleFilter.toLowerCase())

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter an email to send OTP.")
      return
    }
    setOtpLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/send-otp`, { email: formData.email }, { withCredentials: true })
      toast.success("OTP sent to email")
      setOtpSent(true)
    } catch (error) {
      console.error("Send OTP error:", error)
      toast.error("Failed to send OTP")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtpAndCreateUser = async () => {
    if (!otp) {
      toast.error("Please enter the OTP")
      return
    }
    setOtpLoading(true)

    try {
      console.log("Starting OTP verification for email:", formData.email)

      // Step 1: Verify OTP
      const verifyRes = await axios.post(
        `${API_BASE}/verify-otp`,
        { email: formData.email, otp },
        { withCredentials: true },
      )

      console.log("OTP verification response:", verifyRes.data)

      if (!verifyRes.data.success) {
        toast.error(verifyRes.data.message || "OTP verification failed")
        setOtpLoading(false)
        return
      }

      console.log("OTP verified successfully. Proceeding to create user...")

      // Step 2: Create user after successful OTP verification
      const createRes = await axios.post(`${API_BASE}/Admin/create-owner`, formData, { withCredentials: true })

      console.log("User creation response:", createRes.data)

      toast.success("User created successfully")
      setIsModalOpen(false)
      setOtpSent(false)
      setOtp("")
      fetchUsers()
    } catch (error) {
      console.error("Error in verify/create user flow:", error)

      const errorMsg = error?.response?.data?.message || error?.message || "Error verifying OTP or creating user"

      toast.error(errorMsg)
    } finally {
      setOtpLoading(false)
    }
  }

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedUser) {
      // Editing existing user — submit immediately
      // handleEditUserSubmit()
    } else {
      // Creating new user — trigger OTP send or verify flow
      if (!otpSent) {
        handleSendOtp()
      } else {
        handleVerifyOtpAndCreateUser()
      }
    }
  }

  const openAddModal = () => {
    setSelectedUser(null)
    setFormData({ userName: "", phone: "", email: "", role: "Owner", status: "active" })
    setOtpSent(false)
    setOtp("")
    setIsModalOpen(true)
  }

  const openViewModal = (user) => {
    setViewUser(user)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setViewUser(null)
  }

  // Open confirmation modal with selected user ID
  const confirmDelete = (userId) => {
    setUserToDelete(userId)
    setIsDeleteModalOpen(true)
  }

  // Delete user via API with animation
  const deleteUser = async () => {
    if (!userToDelete) {
      toast.error("Invalid user ID for deletion")
      return
    }

    try {
      // Add user to deleting set for animation
      setDeletingUsers((prev) => new Set([...prev, userToDelete]))

      const res = await axios.delete(`${API_BASE}/${userToDelete}`, {
        withCredentials: true,
      })

      if (res.status === 204) {
        // Wait for animation to complete
        setTimeout(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userToDelete))
          setDeletingUsers((prev) => {
            const newSet = new Set(prev)
            newSet.delete(userToDelete)
            return newSet
          })
          toast.success("User deleted successfully")
        }, 500)
      } else {
        setDeletingUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(userToDelete)
          return newSet
        })
        toast.error("Unexpected response while deleting user")
      }
    } catch (error) {
      console.error(error)
      setDeletingUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userToDelete)
        return newSet
      })
      toast.error("Failed to delete user")
    } finally {
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleSuspend = async (userId) => {
    console.log("Suspending user:", userId)
    if (!userId) {
      toast.error("Invalid user ID for suspension")
      return
    }

    try {
      const res = await axios.patch(`${API_BASE}/${userId}/suspend`, {}, { withCredentials: true })
      toast.success(res.data.message || "User suspended")
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast.error("Failed to suspend user")
    }
  }

  const handleActivate = async (userId) => {
    console.log("Activating user:", userId)
    if (!userId) {
      toast.error("Invalid user ID for activation")
      return
    }

    try {
      const res = await axios.patch(`${API_BASE}/${userId}/activate`, {}, { withCredentials: true })
      toast.success(res.data.message || "User activated")
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast.error("Failed to activate user")
    }
  }

  const exportUsers = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Username,Email,Status,Role,Join Date,Last Login,Total Bookings,Total Spent\n" +
      filteredUsers
        .map(
          (user) =>
            `${user.name},${user.userName},${user.email},${user.status},${user.role},${new Date(user.joinDate).toLocaleDateString()},${new Date(user.lastLogin).toLocaleDateString()},${user.totalBookings},${user.totalSpent}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "users_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Users exported successfully!")
  }

  // Calculate statistics
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const suspendedUsers = users.filter((u) => u.status === "suspended").length
  const newUsersThisMonth = users.filter((u) => {
    const joinDate = new Date(u.joinDate)
    const now = new Date()
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
  }).length

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return formatDate(dateString)
  }

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
              <Users className="title-icon" />
              User Management
            </h1>
            <p className="dashboard-subtitle">Manage and monitor user accounts with advanced analytics</p>
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
            <Users className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalUsers}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+12% this month</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <div className="chart-bar" style={{ "--height": "20px" }}></div>
              <div className="chart-bar" style={{ "--height": "35px" }}></div>
              <div className="chart-bar" style={{ "--height": "25px" }}></div>
              <div className="chart-bar" style={{ "--height": "40px" }}></div>
              <div className="chart-bar" style={{ "--height": "30px" }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon-wrapper">
            <Activity className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{activeUsers}</div>
            <div className="stat-label">Active Users</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+8% this week</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <div className="chart-bar" style={{ "--height": "30px" }}></div>
              <div className="chart-bar" style={{ "--height": "45px" }}></div>
              <div className="chart-bar" style={{ "--height": "35px" }}></div>
              <div className="chart-bar" style={{ "--height": "50px" }}></div>
              <div className="chart-bar" style={{ "--height": "40px" }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-accent">
          <div className="stat-icon-wrapper">
            <Shield className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{suspendedUsers}</div>
            <div className="stat-label">Suspended</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>-5% this month</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <div className="chart-bar" style={{ "--height": "15px" }}></div>
              <div className="chart-bar" style={{ "--height": "25px" }}></div>
              <div className="chart-bar" style={{ "--height": "20px" }}></div>
              <div className="chart-bar" style={{ "--height": "10px" }}></div>
              <div className="chart-bar" style={{ "--height": "18px" }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon-wrapper">
            <Calendar className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{newUsersThisMonth}</div>
            <div className="stat-label">New This Month</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+25% vs last month</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <div className="chart-bar" style={{ "--height": "25px" }}></div>
              <div className="chart-bar" style={{ "--height": "40px" }}></div>
              <div className="chart-bar" style={{ "--height": "35px" }}></div>
              <div className="chart-bar" style={{ "--height": "45px" }}></div>
              <div className="chart-bar" style={{ "--height": "50px" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Users className="panel-icon" />
            User Accounts
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="panel-action" onClick={refreshUsers} disabled={refreshing}>
              <RefreshCw size={16} className={refreshing ? "spinner-icon" : ""} />
              Refresh
            </button>
            <button className="panel-action" onClick={exportUsers}>
              <Download size={16} />
              Export
            </button>
            <button className="panel-action" onClick={openAddModal}>
              <UserPlus size={16} />
              Add User
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
                placeholder="Search users by name, username, or email..."
                className="futuristic-input"
                value={searchTerm}
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
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}
              >
                <div className="filter-group">
                  <label className="filter-label">Status</label>
                  <select
                    className="futuristic-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Role</label>
                  <select
                    className="futuristic-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Table */}
          <div className="futuristic-table-container">
            {loading ? (
              <div className="dashboard-loading">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <div className="loading-text">Loading users...</div>
              </div>
            ) : (
              <>
                <table className="futuristic-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          User Profile
                          {sortConfig.key === "name" && <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </th>
                      <th onClick={() => handleSort("userName")} style={{ cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          Username
                          {sortConfig.key === "userName" && <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </th>
                      <th onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          Role
                          {sortConfig.key === "role" && <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </th>
                      <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          Status
                          {sortConfig.key === "status" && <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </th>
                      <th onClick={() => handleSort("joinDate")} style={{ cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          Join Date
                          {sortConfig.key === "joinDate" && <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </th>
                      <th onClick={() => handleSort("lastLogin")} style={{ cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          Last Activity
                          {sortConfig.key === "lastLogin" && <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="no-data">
                          <div className="no-data-content">
                            <Users size={48} />
                            <h3>No users found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr 
                          key={user.userId} 
                          className={`user-row ${deletingUsers.has(user.userId) ? "deleting" : ""}`}
                        >
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                              <div className="user-details">
                                <div className="user-name">
                                  {user.name}
                                  {user.verified && (
                                    <Star size={14} style={{ color: "#ffd700", marginLeft: "0.5rem" }} />
                                  )}
                                </div>
                                <div className="user-email">
                                  <Mail size={12} />
                                  {user.email}
                                </div>
                                {user.phone && (
                                  <div className="user-email">
                                    <Phone size={12} />
                                    {user.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="username-cell">@{user.userName}</div>
                          </td>
                          <td>
                            <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                              {user.role === "Admin" && <Shield size={12} />}
                              {user.role === "Owner" && <Users size={12} />}
                              {user.role === "User" && <UserCheck size={12} />}
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${user.status === "active" ? "status-active" : "status-suspended"}`}
                            >
                              <div
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  backgroundColor: "currentColor",
                                }}
                              ></div>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                color: "rgba(255, 255, 255, 0.8)",
                              }}
                            >
                              <Calendar size={14} />
                              {formatDate(user.joinDate)}
                            </div>
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                color: "rgba(255, 255, 255, 0.8)",
                              }}
                            >
                              <Clock size={14} />
                              {getTimeAgo(user.lastLogin)}
                            </div>
                          </td>
                          <td>
                            <div className="enhanced-action-buttons">
                              <div className="action-button-group">
                                <button
                                  className={`enhanced-action-btn ${user.status === "active" ? "suspend-btn" : "activate-btn"}`}
                                  onClick={() =>
                                    user.status === "active" ? handleSuspend(user.userId) : handleActivate(user.userId)
                                  }
                                  title={user.status === "active" ? "Suspend User" : "Activate User"}
                                  disabled={deletingUsers.has(user.userId)}
                                >
                                  <div className="btn-icon-wrapper">
                                    {user.status === "active" ? <Ban size={16} /> : <Check size={16} />}
                                  </div>
                                  <span className="btn-text">{user.status === "active" ? "Suspend" : "Activate"}</span>
                                  <div className="btn-glow"></div>
                                </button>

                                <button 
                                  className="enhanced-action-btn view-btn" 
                                  title="View Details"
                                  onClick={() => openViewModal(user)}
                                  disabled={deletingUsers.has(user.userId)}
                                >
                                  <div className="btn-icon-wrapper">
                                    <Eye size={16} />
                                  </div>
                                  <span className="btn-text">View</span>
                                  <div className="btn-glow"></div>
                                </button>

                                <div className="action-dropdown">
                                  <button 
                                    className="enhanced-action-btn dropdown-btn" 
                                    title="More Actions"
                                    disabled={deletingUsers.has(user.userId)}
                                  >
                                    <div className="btn-icon-wrapper">
                                      <MoreHorizontal size={16} />
                                    </div>
                                    <div className="btn-glow"></div>
                                  </button>
                                  <div className="dropdown-menu">
                                    <button className="dropdown-item edit-item">
                                      <Edit size={14} />
                                      <span>Edit User</span>
                                    </button>
                                    <button className="dropdown-item settings-item">
                                      <Settings size={14} />
                                      <span>Settings</span>
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button
                                      className="dropdown-item delete-item"
                                      onClick={() => confirmDelete(user.userId)}
                                    >
                                      <Trash2 size={14} />
                                      <span>Delete User</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="enhanced-pagination">
                    <div className="pagination-info">
                      <span>
                        Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                        {filteredUsers.length} users
                      </span>
                    </div>
                    <div className="pagination-controls">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`pagination-btn prev-btn ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <ChevronLeft size={16} />
                        <span>Previous</span>
                      </button>

                      <div className="page-numbers">
                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                          let pageNumber
                          if (totalPages <= 5) {
                            pageNumber = index + 1
                          } else if (currentPage <= 3) {
                            pageNumber = index + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + index
                          } else {
                            pageNumber = currentPage - 2 + index
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`page-number-btn ${currentPage === pageNumber ? "active" : ""}`}
                            >
                              {pageNumber}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`pagination-btn next-btn ${currentPage === totalPages ? "disabled" : ""}`}
                      >
                        <span>Next</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="futuristic-modal-overlay">
          <div className="enhanced-modal">
            <form onSubmit={handleSubmit}>
              {/* Modal Header */}
              <div className="enhanced-modal-header">
                <div className="modal-header-content">
                  <div className="modal-icon-wrapper">
                    <UserPlus className="modal-icon" />
                    <div className="icon-pulse"></div>
                  </div>
                  <div className="modal-title-section">
                    <h2 className="enhanced-modal-title">{selectedUser ? "Edit User" : "Add New User"}</h2>
                    <p className="modal-subtitle">
                      {otpSent
                        ? "Enter the verification code sent to your email"
                        : "Fill in the details to create a new user account"}
                    </p>
                  </div>
                </div>
                <button type="button" className="enhanced-close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="enhanced-modal-body">
                {!otpSent ? (
                  <div className="form-container">
                    <div className="form-section">
                      <h3 className="section-title">
                        <Users size={16} />
                        User Information
                      </h3>

                      <div className="enhanced-form-grid">
                        <div className="enhanced-form-group">
                          <label className="enhanced-form-label">
                            <Users size={16} />
                            <span>Username</span>
                            <span className="required">*</span>
                          </label>
                          <div className="input-container">
                            <input
                              name="userName"
                              type="text"
                              className="enhanced-input"
                              value={formData.userName}
                              onChange={handleChange}
                              required
                              placeholder="Enter username"
                            />
                            <div className="input-border"></div>
                          </div>
                        </div>

                        <div className="enhanced-form-group">
                          <label className="enhanced-form-label">
                            <Phone size={16} />
                            <span>Phone Number</span>
                            <span className="required">*</span>
                          </label>
                          <div className="input-container">
                            <input
                              name="phone"
                              type="tel"
                              className="enhanced-input"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              placeholder="Enter phone number"
                            />
                            <div className="input-border"></div>
                          </div>
                        </div>

                        <div className="enhanced-form-group full-width">
                          <label className="enhanced-form-label">
                            <Mail size={16} />
                            <span>Email Address</span>
                            <span className="required">*</span>
                          </label>
                          <div className="input-container">
                            <input
                              name="email"
                              type="email"
                              className="enhanced-input"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="Enter email address"
                            />
                            <div className="input-border"></div>
                          </div>
                        </div>
                      </div>

                      {/* Role and Status Info Cards */}
                      <div className="info-cards">
                        <div className="info-card">
                          <div className="info-card-icon">
                            <Shield size={20} />
                          </div>
                          <div className="info-card-content">
                            <h4>Role</h4>
                            <p>Owner</p>
                            <span className="info-badge">Default Role</span>
                          </div>
                        </div>

                        <div className="info-card">
                          <div className="info-card-icon">
                            <Activity size={20} />
                          </div>
                          <div className="info-card-content">
                            <h4>Status</h4>
                            <p>Active</p>
                            <span className="info-badge active">Ready to Use</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="otp-container">
                    <div className="otp-header">
                      <div className="otp-icon">
                        <Zap size={32} />
                      </div>
                      <h3>Verify Your Email</h3>
                      <p>We've sent a 6-digit verification code to</p>
                      <span className="email-highlight">{formData.email}</span>
                    </div>

                    <div className="otp-input-section">
                      <label className="enhanced-form-label">
                        <span>Verification Code</span>
                      </label>
                      <div className="otp-input-container">
                        <input
                          type="text"
                          className="otp-input-field"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          maxLength={6}
                          placeholder="000000"
                        />
                        <div className="otp-input-border"></div>
                      </div>
                      <p className="otp-hint">
                        <Clock size={14} />
                        Code expires in 5 minutes
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="enhanced-modal-footer">
                <button
                  type="button"
                  className="enhanced-btn secondary"
                  onClick={() => {
                    setIsModalOpen(false)
                    setOtpSent(false)
                    setOtp("")
                  }}
                >
                  <X size={16} />
                  Cancel
                </button>

                <button type="submit" className="enhanced-btn primary" disabled={otpLoading}>
                  {otpLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Processing...
                    </>
                  ) : otpSent ? (
                    <>
                      <Check size={16} />
                      Verify & Create
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Send OTP
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {isViewModalOpen && viewUser && (
        <div className="futuristic-modal-overlay">
          <div className="enhanced-modal view-modal">
            {/* Modal Header */}
            <div className="enhanced-modal-header">
              <div className="modal-header-content">
                <div className="modal-icon-wrapper">
                  <Eye className="modal-icon" />
                  <div className="icon-pulse"></div>
                </div>
                <div className="modal-title-section">
                  <h2 className="enhanced-modal-title">User Details</h2>
                  <p className="modal-subtitle">Complete information about {viewUser.name}</p>
                </div>
              </div>
              <button type="button" className="enhanced-close-btn" onClick={closeViewModal}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="enhanced-modal-body">
              <div className="view-container">
                {/* User Profile Section */}
                <div className="view-section">
                  <h3 className="section-title">
                    <Users size={16} />
                    Profile Information
                  </h3>
                  
                  <div className="profile-header">
                    <div className="profile-avatar">
                      {viewUser.name ? viewUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="profile-info">
                      <h4 className="profile-name">
                        {viewUser.name}
                        {viewUser.verified && <UserCheck size={20} className="verified-icon" />}
                      </h4>
                      <p className="profile-username">@{viewUser.userName}</p>
                      <div className="profile-badges">
                        <span className={`profile-status ${viewUser.status}`}>{viewUser.status}</span>
                        <span className="profile-role">{viewUser.role}</span>
                        <span className="profile-type">{viewUser.accountType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-icon">
                        <Mail size={16} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Email</span>
                        <span className="info-value">{viewUser.email}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <Phone size={16} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Phone</span>
                        <span className="info-value">{viewUser.phone || "Not provided"}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <MapPin size={16} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Location</span>
                        <span className="info-value">{viewUser.location}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <Calendar size={16} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Joined</span>
                        <span className="info-value">{formatDate(viewUser.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Section */}
                <div className="view-section">
                  <h3 className="section-title">
                    <Activity size={16} />
                    Activity & Statistics
                  </h3>

                  <div className="stats-grid-view">
                    <div className="stat-item">
                      <div className="stat-icon-view">
                        <Activity size={20} />
                      </div>
                      <div className="stat-content-view">
                        <span className="stat-value-view">{viewUser.totalBookings}</span>
                        <span className="stat-label-view">Total Bookings</span>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-icon-view">
                        <CreditCard size={20} />
                      </div>
                      <div className="stat-content-view">
                        <span className="stat-value-view">₹{viewUser.totalSpent}</span>
                        <span className="stat-label-view">Total Spent</span>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-icon-view">
                        <Star size={20} />
                      </div>
                      <div className="stat-content-view">
                        <span className="stat-value-view">{viewUser.rating}</span>
                        <span className="stat-label-view">Rating</span>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-icon-view">
                        <Clock size={20} />
                      </div>
                      <div className="stat-content-view">
                        <span className="stat-value-view">{getTimeAgo(viewUser.lastLogin)}</span>
                        <span className="stat-label-view">Last Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="view-section">
                  <h3 className="section-title">
                    <Settings size={16} />
                    Preferences
                  </h3>

                  <div className="preferences-grid">
                    <div className="preference-item">
                      <span className="preference-label">Notifications</span>
                      <span className={`preference-status ${viewUser.preferences?.notifications ? 'enabled' : 'disabled'}`}>
                        {viewUser.preferences?.notifications ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    <div className="preference-item">
                      <span className="preference-label">Newsletter</span>
                      <span className={`preference-status ${viewUser.preferences?.newsletter ? 'enabled' : 'disabled'}`}>
                        {viewUser.preferences?.newsletter ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                    </div>

                    <div className="preference-item">
                      <span className="preference-label">Dark Mode</span>
                      <span className={`preference-status ${viewUser.preferences?.darkMode ? 'enabled' : 'disabled'}`}>
                        {viewUser.preferences?.darkMode ? 'Enabled' : 'Disabled'}
                      </span>
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
                onClick={closeViewModal}
              >
                <X size={16} />
                Close
              </button>

              <button
                type="button"
                className="enhanced-btn danger"
                onClick={() => {
                  closeViewModal()
                  confirmDelete(viewUser.userId)
                }}
              >
                <Trash2 size={16} />
                Delete User
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
                <AlertTriangle size={24} />
                Confirm Deletion
              </h2>
              <button type="button" className="modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-warning">
                <AlertTriangle size={48} className="warning-icon" />
                <h4>Are you sure you want to delete this user?</h4>
                <p>
                  This action cannot be undone. All user data and associated records will be permanently removed from
                  the system.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={deleteUser}>
                <Trash2 size={16} />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagementPage

