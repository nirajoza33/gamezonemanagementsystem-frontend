"use client"

import { useState, useEffect } from "react"
import Analytics from "./Analytics"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"

const AnalyticsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
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
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="gamezone-layout">
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
          <Analytics />
        </main>
      </div>
    </div>
  )
}

export default AnalyticsPage
