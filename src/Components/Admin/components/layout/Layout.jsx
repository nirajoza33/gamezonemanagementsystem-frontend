// import React, { useEffect, useState } from "react"
// import { Outlet, useNavigate } from "react-router-dom"
// import { useAuthStore } from "../../store/authStore"
// import Header from "./Header"
// import Sidebar from "./Sidebar"

// const Layout = () => {
//   const { isAuthenticated } = useAuthStore()
//   const navigate = useNavigate()
//   const [sidebarOpen, setSidebarOpen] = useState(true)

//   useEffect(() => {
//     // if (!isAuthenticated) navigate("/login")

//     const handleResize = () => setSidebarOpen(window.innerWidth >= 992)
//     handleResize()
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [isAuthenticated, navigate])

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
//   const closeSidebar = () => window.innerWidth < 992 && setSidebarOpen(false)

//   return (
//     <div className="d-flex min-vh-100">
//       <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
//       <div
//         className="flex-grow-1 d-flex flex-column min-vh-100 overflow-hidden"
//         style={{ marginLeft: sidebarOpen && window.innerWidth >= 992 ? "16rem" : "0" }}
//       >
//         <Header toggleSidebar={toggleSidebar} />
//         <main className="flex-grow-1 overflow-auto p-3 p-md-4">
//           <div className="container-fluid">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default Layout

"use client"

import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import Header from "./Header"
import Sidebar from "./Sidebar"
import "./AdminLayout.css"

const Layout = () => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // if (!isAuthenticated) navigate("/login")

    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isAuthenticated, navigate])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="futuristic-layout">
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
        <Header toggleSidebar={toggleSidebar} />
        <main className="content-area">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

