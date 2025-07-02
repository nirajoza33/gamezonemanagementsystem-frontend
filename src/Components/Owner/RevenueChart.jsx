// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
// } from 'recharts';
// import { getUserInfo } from '../../auth/JwtUtils';

// const RevenueChart = () => {
//   const [data, setData] = useState([]);
//   const userInfo = getUserInfo();
//   const userId = userInfo?.UserId;

//   useEffect(() => {
//     const fetchRevenueData = async () => {
//       try {
//         const res = await axios.get(`https://localhost:7186/api/TblPayments/RevenueByUserOverTime/${userId}`);
//         setData(res.data);
//       } catch (err) {
//         console.error('Failed to fetch revenue chart data:', err);
//       }
//     };

//     fetchRevenueData();
//   }, [userId]);

//   return (
//     <div className="card p-4 mb-4">
//       <h5 className="mb-3">Revenue Over Time</h5>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis tickFormatter={(value) => `$${value}`} />
//           <Tooltip formatter={(value) => `$${value}`} />
//           <Line type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default RevenueChart;

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, DollarSign, Activity } from "lucide-react"
import { getUserInfo } from "../../auth/JwtUtils"
import ChartModal from "./ChartModal"

const RevenueChart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [growth, setGrowth] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState("details")

  const userInfo = getUserInfo()
  const userId = userInfo?.UserId

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`https://localhost:7186/api/TblPayments/RevenueByUserOverTime/${userId}`)
        setData(res.data)

        // Calculate total revenue and growth
        const total = res.data.reduce((sum, item) => sum + item.revenue, 0)
        setTotalRevenue(total)

        if (res.data.length > 1) {
          const lastMonth = res.data[res.data.length - 1].revenue
          const prevMonth = res.data[res.data.length - 2].revenue
          const growthRate = prevMonth > 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0
          setGrowth(growthRate)
        }
      } catch (err) {
        console.error("Failed to fetch revenue chart data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchRevenueData()
    }
  }, [userId])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div className="tooltip-header">
            <DollarSign size={16} />
            <span>{label}</span>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-value">
              ₹{payload[0].value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="tooltip-label">Revenue</div>
          </div>
        </div>
      )
    }
    return null
  }

  const handleViewDetails = () => {
    setModalType("details")
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
            <TrendingUp className="chart-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="chart-title-content">
            <h3 className="chart-title">Revenue Analytics</h3>
            <p className="chart-subtitle">Monthly performance tracking</p>
          </div>
        </div>

        <div className="chart-stats">
          <div className="chart-stat">
            <div className="stat-value">
              ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="chart-stat">
            <div className={`stat-value ${growth >= 0 ? "positive" : "negative"}`}>
              {growth >= 0 ? "+" : ""}
              {growth.toFixed(1)}%
            </div>
            <div className="stat-label">Growth Rate</div>
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
            <div className="loading-text">Loading revenue data...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="chart-no-data">
            <Activity size={48} />
            <h4>No Revenue Data</h4>
            <p>Start earning to see your revenue analytics</p>
          </div>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffd700" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#ff2a6d" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4cd964" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffd700" />
                    <stop offset="50%" stopColor="#ff2a6d" />
                    <stop offset="100%" stopColor="#4cd964" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis
                  dataKey="month"
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ fill: "#ffd700", strokeWidth: 2, r: 6 }}
                  activeDot={{
                    r: 8,
                    stroke: "#ffd700",
                    strokeWidth: 3,
                    fill: "#fff",
                    filter: "drop-shadow(0 0 6px #ffd700)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chart Footer */}
      <div className="chart-footer">
        <div className="chart-indicators">
          <div className="indicator">
            <div className="indicator-dot revenue"></div>
            <span>Revenue Trend</span>
          </div>
          <div className="indicator">
            <div className="indicator-dot growth"></div>
            <span>Growth Pattern</span>
          </div>
        </div>

        <div className="chart-actions">
          <button className="chart-action-btn" onClick={handleViewDetails}>
            <TrendingUp size={16} />
            View Details
          </button>
        </div>
      </div>

      {/* Background Effects */}
      <div className="chart-background-effects">
        <div className="chart-grid"></div>
        <div className="chart-glow"></div>
      </div>
      <ChartModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        data={data}
        title="Revenue Analytics Details"
      />
    </div>
  )
}

export default RevenueChart


