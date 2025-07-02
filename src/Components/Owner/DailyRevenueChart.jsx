// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
// } from 'recharts';
// import { getUserInfo } from '../../auth/JwtUtils';

// const DailyRevenueChart = () => {
//   const [data, setData] = useState([]);
//   const userInfo = getUserInfo();
//   const userId = userInfo?.UserId;

//   useEffect(() => {
//     const fetchDailyRevenueData = async () => {
//       try {
//         const res = await axios.get(`https://localhost:7186/api/TblPayments/RevenueByUserDaily/${userId}`);
//         setData(res.data);
//       } catch (err) {
//         console.error('Failed to fetch daily revenue chart data:', err);
//       }
//     };

//     if (userId) {
//       fetchDailyRevenueData();
//     }
//   }, [userId]);

//   return (
//     <div className="card chart-card mt-4">
//       <div className="card-body">
//         <h5 className="card-title">Revenue Growth (Date-wise)</h5>
//         {data.length === 0 ? (
//           <p>No data available</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data} margin={{ top: 10, right: 30, bottom: 5, left: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis tickFormatter={(value) => `$${value}`} />
//               <Tooltip formatter={(value) => `$${value}`} />
//               <Line type="monotone" dataKey="revenue" stroke="#ff7300" strokeWidth={3} dot={{ r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DailyRevenueChart;

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts"
import { Calendar, BarChart3 } from "lucide-react"
import { getUserInfo } from "../../auth/JwtUtils"
import ChartModal from "./ChartModal"

const DailyRevenueChart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dailyAverage, setDailyAverage] = useState(0)
  const [bestDay, setBestDay] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState("calendar")

  const userInfo = getUserInfo()
  const userId = userInfo?.UserId

  useEffect(() => {
    const fetchDailyRevenueData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`https://localhost:7186/api/TblPayments/RevenueByUserDaily/${userId}`)
        setData(res.data)

        // Calculate daily average
        if (res.data.length > 0) {
          const total = res.data.reduce((sum, item) => sum + item.revenue, 0)
          setDailyAverage(total / res.data.length)

          // Find best performing day
          const best = res.data.reduce((max, item) => (item.revenue > max.revenue ? item : max), res.data[0])
          setBestDay(best)
        }
      } catch (err) {
        console.error("Failed to fetch daily revenue chart data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchDailyRevenueData()
    }
  }, [userId])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div className="tooltip-header">
            <Calendar size={16} />
            <span>{label}</span>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-value">
              ₹{payload[0].value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="tooltip-label">Daily Revenue</div>
          </div>
        </div>
      )
    }
    return null
  }

  const getBarColor = (value) => {
    if (value > dailyAverage * 1.5) return "#4cd964"
    if (value > dailyAverage) return "#ffd700"
    return "#ff6b9d"
  }

  const handleViewCalendar = () => {
    setModalType("calendar")
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="futuristic-chart-container">
      {/* Chart Header */}
      <div className="chart-header">
        <div className="chart-title-section">
          <div className="chart-icon-wrapper">
            <BarChart3 className="chart-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="chart-title-content">
            <h3 className="chart-title">Daily Performance</h3>
            <p className="chart-subtitle">Day-by-day revenue breakdown</p>
          </div>
        </div>

        <div className="chart-stats">
          <div className="chart-stat">
            <div className="stat-value">
              ₹{dailyAverage.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="stat-label">Daily Average</div>
          </div>
          <div className="chart-stat">
            <div className="stat-value">
              {bestDay
                ? `₹${bestDay.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "₹0.00"}
            </div>
            <div className="stat-label">Best Day</div>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="chart-content">
        {loading ? (
          <div className="chart-loading">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <div className="loading-text">Loading daily data...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="chart-no-data">
            <Calendar size={48} />
            <h4>No Daily Data</h4>
            <p>Daily revenue tracking will appear here</p>
          </div>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4cd964" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#4cd964" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffd700" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ffd700" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b9d" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ff6b9d" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255, 255, 255, 0.6)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                  stroke="rgba(255, 255, 255, 0.6)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => {
                    const color = getBarColor(entry.revenue)
                    let gradientId = "barGradient3"
                    if (color === "#4cd964") gradientId = "barGradient1"
                    else if (color === "#ffd700") gradientId = "barGradient2"

                    return <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} stroke={color} strokeWidth={2} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chart Footer */}
      <div className="chart-footer">
        <div className="chart-indicators">
          <div className="indicator">
            <div className="indicator-dot excellent"></div>
            <span>Excellent (Above 150% avg)</span>
          </div>
          <div className="indicator">
            <div className="indicator-dot good"></div>
            <span>Good (Above avg)</span>
          </div>
          <div className="indicator">
            <div className="indicator-dot average"></div>
            <span>Below Average</span>
          </div>
        </div>

        <div className="chart-actions">
          <button className="chart-action-btn" onClick={handleViewCalendar}>
            <Calendar size={16} />
            View Calendar
          </button>
        </div>
      </div>

      <ChartModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        data={data}
        title="Daily Performance Calendar"
      />

      {/* Background Effects */}
      <div className="chart-background-effects">
        <div className="chart-grid"></div>
        <div className="chart-glow"></div>
      </div>
    </div>
  )
}

export default DailyRevenueChart


