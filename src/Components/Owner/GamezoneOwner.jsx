// // import React from 'react'
// // import OwnerNavbar from './OwnerNavbar'
// // import Sidebar from './Sidebar';
// // import DashboardHeader from './DashboardHeader';
// // import StatsCards from './StatsCards';
// // import RevenueChart from './RevenueChart';

// // const GamezoneOwner = () => {
// //   return (
// //     <div>
// //       <OwnerNavbar />
// //       <div
// //         style={{
// //           height: '100vh',
// //           display: 'flex',
// //           justifyContent: 'center',
// //           alignItems: 'center',
// //           flexDirection: 'column',
// //           backgroundColor: '#000', // optional: to make white text visible
// //           color: 'white',
// //           textAlign: 'center'
// //         }}
// //       >
// //         <h1>This is gamezone owner page</h1>

// //       </div>



// //     </div>
// //   )
// // }

// // export default GamezoneOwner


// // GamezoneOwner.jsx

// import React from 'react';
// import Sidebar from './Sidebar';
// import DashboardHeader from './DashboardHeader';
// import StatsCards from './StatsCards';
// import RevenueChart from './RevenueChart';
// import UsersChart from './DailyRevenueChart';
// import './Dashboard.css';
// import DailyRevenueChart from './DailyRevenueChart';

// const GamezoneOwner = () => {
//   return (
//     <div className="dashboard-container d-flex">
//       <Sidebar />
//       <div className="main-content flex-grow-1">
//         <DashboardHeader />
//         <div className="container-fluid mt-4">
//           <StatsCards />
//           <div>
//             <div className="row mt-4">
//               <div className="col-md-6 mb-4">
//                 <RevenueChart />
//               </div>
//               <div className="col-md-6 mb-4">
//                 <DailyRevenueChart />
//               </div>
//             </div>
//           </div>


//         </div>
//       </div>
//     </div>
//   );
// };

// export default GamezoneOwner;


// ---------------------------


// "use client"

// import { useState, useEffect } from "react"
// import Sidebar from "./Sidebar"
// import DashboardHeader from "./DashboardHeader"
// import StatsCards from "./StatsCards"
// import RevenueChart from "./RevenueChart"
// import DailyRevenueChart from "./DailyRevenueChart"
// import "./Dashboard.css"

// const GamezoneOwner = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true)

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 992) {
//         setSidebarOpen(true)
//       } else {
//         setSidebarOpen(false)
//       }
//     }

//     handleResize()
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
//   const closeSidebar = () => {
//     if (window.innerWidth < 992) {
//       setSidebarOpen(false)
//     }
//   }

//   return (
//     <div className="gamezone-layout">
//       {/* Animated Background */}
//       <div className="layout-background">
//         <div className="grid-overlay"></div>
//         <div className="floating-particles">
//           <div className="particle particle-0"></div>
//           <div className="particle particle-1"></div>
//           <div className="particle particle-2"></div>
//           <div className="particle particle-3"></div>
//         </div>
//       </div>

//       <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

//       <div className={`main-content ${sidebarOpen && window.innerWidth >= 992 ? "sidebar-open" : "sidebar-closed"}`}>
//         <DashboardHeader toggleSidebar={toggleSidebar} />
//         <main className="content-area">
//           <div className="content-wrapper">
//             <StatsCards />
//             <div className="charts-section">
//               <div className="charts-grid">
//                 <RevenueChart />
//                 <DailyRevenueChart />
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default GamezoneOwner


"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import StatsCards from "./StatsCards"
import RevenueChart from "./RevenueChart"
import DailyRevenueChart from "./DailyRevenueChart"
import GameRunningStatus from "./GameRunningStatus"
import "./Dashboard.css"

const GamezoneOwner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState("dashboard") // dashboard, running-status

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

  const renderContent = () => {
    switch (activeView) {
      case "running-status":
        return <GameRunningStatus />
      case "dashboard":
      default:
        return (
          <>
            <StatsCards />
            <div className="charts-section">
              <div className="charts-grid">
                <RevenueChart />
                <DailyRevenueChart />
              </div>
            </div>
          </>
        )
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

      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} activeView={activeView} setActiveView={setActiveView} />

      <div className={`main-content ${sidebarOpen && window.innerWidth >= 992 ? "sidebar-open" : "sidebar-closed"}`}>
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <main className="content-area">
          <div className="content-wrapper">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}

export default GamezoneOwner



