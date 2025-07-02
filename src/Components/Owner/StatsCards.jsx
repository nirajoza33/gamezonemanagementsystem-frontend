// import React, { useEffect, useState } from 'react';
// import { FaDollarSign, FaGamepad, FaUsers, FaChartLine } from 'react-icons/fa';
// import axios from 'axios';
// import './StatsCard.css';
// import { getUserInfo } from '../../auth/JwtUtils';

// const StatsCards = () => {  
//   const [stats, setStats] = useState([
//     { title: 'Total Revenue', value: '12,430', icon: <FaDollarSign />, color: '#28a745', fontColor: '#e6f4ea' },
//     { title: 'Active Games', value: '0', icon: <FaGamepad />, color: '#007bff', fontColor: '#d0e7ff' },
//     { title: 'New Users', value: '0', icon: <FaUsers />, color: '#17a2b8', fontColor: '#d4f0f7' },
//     { title: 'Sessions Today', value: '1,024', icon: <FaChartLine />, color: '#ffc107', fontColor: '#4a3d00' },
//   ]);

//   const userInfo = getUserInfo();
//   const userId = userInfo?.UserId;
  
//   // useEffect(() => { 

//   //   const fetchCounts = async () => {
//   //     try {
//   //       const [usersRes, gamesRes, revenueRes] = await Promise.all([
//   //         axios.get('https://localhost:7186/api/TblUsers'),
//   //         axios.get('https://localhost:7186/api/TblGames'),
//   //         axios.get(`https://localhost:7186/api/TblGames/TotalRevenueByUser/${userId}`),
//   //       ]);

//   //       const formattedRevenue = `${parseFloat(revenueRes.data).toFixed(2)}`;

//   //       setStats((prevStats) =>
//   //         prevStats.map((stat) => {
//   //           if (stat.title === 'New Users') {
//   //             return { ...stat, value: usersRes.data.length.toString() };
//   //           }
//   //           if (stat.title === 'Active Games') {
//   //             return { ...stat, value: gamesRes.data.length.toString() };
//   //           }
//   //           if (stat.title === 'Total Revenue') {
//   //             return { ...stat, value: formattedRevenue };
//   //           }
//   //           return stat;
//   //         })
//   //       );
//   //     } catch (error) {
//   //       console.error('Failed to fetch stats:', error);
//   //     }
//   //   };

//   //   fetchCounts();
//   // }, []);

//   useEffect(() => { 
//   const fetchCounts = async () => {
//     try {
//       const [usersRes, gamesRes, revenueRes] = await Promise.all([
//         axios.get('https://localhost:7186/api/TblUsers'),
//         axios.get('https://localhost:7186/api/TblGames'),
//         axios.get(`https://localhost:7186/api/TblGames/TotalRevenueByUser/${userId}`),
//       ]);

//       const formattedRevenue = `${parseFloat(revenueRes.data).toFixed(2)}`;

//       // 👇 Filter games owned by the logged-in user
//       const userGames = gamesRes.data.filter(game => game.status === true && game.userId  == userId);
//       console.log("gamesRes.data", gamesRes.data);
//       console.log("gamesRes.data", userId);


//       setStats((prevStats) =>
//         prevStats.map((stat) => {
//           if (stat.title === 'New Users') {
//             return { ...stat, value: usersRes.data.length.toString() };
//           }
//           if (stat.title === 'Active Games') {
//             console.log("userid",userGames)
//             return { ...stat, value: userGames.length.toString() };
//           }
//           if (stat.title === 'Total Revenue') {
//             return { ...stat, value: formattedRevenue };
//           }
//           return stat;
//         })
//       );
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//     }
//   };

//   fetchCounts();
// }, [userId]);


//   return (
//     <div className="row">
//       {stats.map((stat, idx) => (
//         <div key={idx} className="col-12 col-sm-6 col-md-3 mb-4">
//           <div className="card stat-card text-white" style={{ backgroundColor: stat.color, color: stat.fontColor }}>
//             <div className="card-body d-flex align-items-center">
//               <div className="me-3 fs-2">{stat.icon}</div>
//               <div>
//                 <h6 className="mb-1">{stat.title}</h6>
//                 <h4 className="mb-0">{stat.value}</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StatsCards;

"use client"

import { useEffect, useState } from "react"
import { DollarSign, Gamepad2, Users, TrendingUp, Activity, Crown, Zap, Target } from "lucide-react"
import axios from "axios"
import "./StatsCard.css"
import { getUserInfo } from "../../auth/JwtUtils"

const StatsCards = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Revenue",
      value: "₹0",
      icon: <DollarSign size={28} />,
      color: "#ff2a6d",
      trend: "+12.5%",
      description: "Monthly earnings",
    },
    {
      title: "Active Games",
      value: "0",
      icon: <Gamepad2 size={28} />,
      color: "#ffd700",
      trend: "+8.2%",
      description: "Published games",
    },
    {
      title: "Total Users",
      value: "0",
      icon: <Users size={28} />,
      color: "#4cd964",
      trend: "+15.3%",
      description: "Registered players",
    },
    {
      title: "Performance",
      value: "98.5%",
      icon: <Activity size={28} />,
      color: "#ff6b9d",
      trend: "+2.1%",
      description: "System uptime",
    },
  ])

  const [loading, setLoading] = useState(true)
  const userInfo = getUserInfo()
  const userId = userInfo?.UserId

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true)
        const [usersRes, gamesRes, revenueRes] = await Promise.all([
          axios.get("https://localhost:7186/api/TblUsers"),
          axios.get("https://localhost:7186/api/TblGames"),
          axios.get(`https://localhost:7186/api/TblGames/TotalRevenueByUser/${userId}`),
        ])

        const formattedRevenue = `₹${Number.parseFloat(revenueRes.data).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        const userGames = gamesRes.data.filter((game) => game.status === true && game.userId == userId)

        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.title === "Total Users") {
              return { ...stat, value: usersRes.data.length.toLocaleString("en-IN") }
            }
            if (stat.title === "Active Games") {
              return { ...stat, value: userGames.length.toString() }
            }
            if (stat.title === "Total Revenue") {
              return { ...stat, value: formattedRevenue }
            }
            return stat
          }),
        )
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchCounts()
    }
  }, [userId])

  return (
    <div className="stats-section">
      <div className="stats-header">
        <div className="stats-title">
          <Crown className="stats-title-icon" />
          <h2>Performance Overview</h2>
        </div>
        <div className="stats-subtitle">Real-time insights into your gaming empire</div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="futuristic-stat-card"
            style={{
              "--card-color": stat.color,
              "--card-glow": `${stat.color}33`,
            }}
          >
            {/* Card Background Effects */}
            <div className="card-background">
              <div className="card-grid"></div>
              <div className="card-glow"></div>
            </div>

            {/* Card Header */}
            <div className="card-header">
              <div className="card-icon-wrapper">
                <div className="card-icon">{stat.icon}</div>
                <div className="icon-pulse"></div>
              </div>
              <div className="card-trend">
                <TrendingUp size={16} />
                <span>{stat.trend}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="card-content">
              <div className="card-value">
                {loading ? (
                  <div className="loading-skeleton">
                    <div className="skeleton-bar"></div>
                  </div>
                ) : (
                  stat.value
                )}
              </div>
              <div className="card-title">{stat.title}</div>
              <div className="card-description">{stat.description}</div>
            </div>

            {/* Card Footer */}
            <div className="card-footer">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="card-status">
                <div className="status-dot"></div>
                <span>Live</span>
              </div>
            </div>

            {/* Hover Effects */}
            <div className="card-hover-effect"></div>
            <div className="card-border-glow"></div>
          </div>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="additional-stats">
        <div className="mini-stat">
          <div className="mini-stat-icon">
            <Target size={20} />
          </div>
          <div className="mini-stat-content">
            <div className="mini-stat-value">94.2%</div>
            <div className="mini-stat-label">Success Rate</div>
          </div>
        </div>

        <div className="mini-stat">
          <div className="mini-stat-icon">
            <Zap size={20} />
          </div>
          <div className="mini-stat-content">
            <div className="mini-stat-value">1.2s</div>
            <div className="mini-stat-label">Avg Response</div>
          </div>
        </div>

        <div className="mini-stat">
          <div className="mini-stat-icon">
            <Activity size={20} />
          </div>
          <div className="mini-stat-content">
            <div className="mini-stat-value">24/7</div>
            <div className="mini-stat-label">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCards
  
