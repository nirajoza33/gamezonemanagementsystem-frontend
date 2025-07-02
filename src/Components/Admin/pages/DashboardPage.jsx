"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  GamepadIcon as GameController,
  Calendar,
  DollarSign,
  User,
  TrendingUp,
  Activity,
  Shield,
  BarChart3,
  TrendingDown,
} from "lucide-react"
import axios from "axios"
import "../components/css/DashboardPage.css"

const DashboardPage = () => {
  const [users, setUsers] = useState([])
  const [games, setGames] = useState([])
  const [owners, setOwners] = useState([])
  const [recentGames, setRecentGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://localhost:7186/api/TblUsers")
        setUsers(res.data)
      } catch (err) {
        console.error("Failed to fetch users", err)
      }
    }

    const fetchGames = async () => {
      try {
        const res = await axios.get("https://localhost:7186/api/TblGames")
        setGames(res.data)

        const sortedRecent = res.data.slice(-5).reverse()
        setRecentGames(sortedRecent)
      } catch (err) {
        console.error("Failed to fetch games", err)
      }
    }

    const fetchOwners = async () => {
      try {
        const res = await axios.get("https://localhost:7186/api/Tblusers/Admin/get-owners")
        setOwners(res.data.data)
        console.log("len", res.data.data.length)
      } catch (err) {
        console.error("Failed to fetch owners", err)
      }
    }

    const fetchData = async () => {
      await Promise.all([fetchUsers(), fetchGames(), fetchOwners()])
      setLoading(false)
    }

    fetchData()
  }, [])

  const userSignupData = [
    { label: "Jan", value: 65 },
    { label: "Feb", value: 59 },
    { label: "Mar", value: 80 },
    { label: "Apr", value: 81 },
    { label: "May", value: 56 },
    { label: "Jun", value: 85 },
    { label: "Jul", value: 90 },
  ]

  const gameUploadsData = [
    { label: "Jan", value: 12 },
    { label: "Feb", value: 19 },
    { label: "Mar", value: 15 },
    { label: "Apr", value: 25 },
    { label: "May", value: 32 },
    { label: "Jun", value: 30 },
    { label: "Jul", value: 38 },
  ]

  // Enhanced Chart Component
  const ElegantChart = ({ data, title, color = "primary", height = 300 }) => {
    if (!data || data.length === 0) return null

    const maxValue = Math.max(...data.map((d) => d.value))
    const minValue = Math.min(...data.map((d) => d.value))
    const totalPoints = data.length

    const getColor = () => {
      switch (color) {
        case "primary":
          return {
            stroke: "rgb(236, 72, 153)",
            fill: "rgba(236, 72, 153, 0.2)",
            glow: "rgba(236, 72, 153, 0.4)",
            gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(236, 72, 153, 0.05))",
          }
        case "secondary":
          return {
            stroke: "rgb(14, 165, 233)",
            fill: "rgba(14, 165, 233, 0.2)",
            glow: "rgba(14, 165, 233, 0.4)",
            gradient: "linear-gradient(135deg, rgba(14, 165, 233, 0.3), rgba(14, 165, 233, 0.05))",
          }
        default:
          return {
            stroke: "rgb(236, 72, 153)",
            fill: "rgba(236, 72, 153, 0.2)",
            glow: "rgba(236, 72, 153, 0.4)",
            gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(236, 72, 153, 0.05))",
          }
      }
    }

    const chartColors = getColor()

    const getPathData = () => {
      const points = data.map((dataPoint, index) => {
        const x = (index / (totalPoints - 1)) * 100
        const y = 100 - ((dataPoint.value - minValue) / (maxValue - minValue)) * 70
        return `${x},${y}`
      })
      return `M0,100 L${points.join(" L")} L100,100 Z`
    }

    const getLineData = () => {
      const points = data.map((dataPoint, index) => {
        const x = (index / (totalPoints - 1)) * 100
        const y = 100 - ((dataPoint.value - minValue) / (maxValue - minValue)) * 70
        return `${x},${y}`
      })
      return `M${points.join(" L")}`
    }

    const calculateTrend = () => {
      if (data.length < 2) return 0
      const firstValue = data[0].value
      const lastValue = data[data.length - 1].value
      return ((lastValue - firstValue) / firstValue) * 100
    }

    const calculateStats = () => {
      const values = data.map((d) => d.value)
      return {
        max: Math.max(...values),
        min: Math.min(...values),
        avg: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length),
        total: values.reduce((sum, val) => sum + val, 0),
      }
    }

    const trend = calculateTrend()
    const stats = calculateStats()
    const isPositiveTrend = trend >= 0

    return (
      <motion.div
        className="elegant-chart-card"
        style={{
          "--chart-color": chartColors.stroke,
          "--chart-glow": chartColors.glow,
          "--chart-gradient": chartColors.gradient,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ y: -3, scale: 1.01 }}
      >
        <div className="elegant-chart-inner">
          <div className="elegant-chart-pattern"></div>
          <div className="elegant-chart-glow"></div>

          <div className="elegant-chart-content">
            {/* Header */}
            <motion.div
              className="elegant-chart-header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="elegant-chart-title-section">
                <div className="elegant-chart-icon">
                  <BarChart3 size={20} />
                </div>
                <h3 className="elegant-chart-title">{title}</h3>
              </div>

              <div className="elegant-chart-stats">
                <div className={`elegant-chart-trend ${isPositiveTrend ? "trend-positive" : "trend-negative"}`}>
                  {isPositiveTrend ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>
                    {isPositiveTrend ? "+" : ""}
                    {trend.toFixed(1)}%
                  </span>
                </div>
                <div className="elegant-chart-period">
                  <Calendar size={14} />
                  <span>Last 7 months</span>
                </div>
              </div>
            </motion.div>

            {/* Chart Container */}
            <motion.div
              className="elegant-chart-container"
              style={{ height: `${height}px` }}
              initial={{ opacity: 0, scaleY: 0.9 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`elegantGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={chartColors.stroke} stopOpacity="0.4" />
                    <stop offset="50%" stopColor={chartColors.stroke} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={chartColors.stroke} stopOpacity="0.05" />
                  </linearGradient>

                  <filter id={`elegantGlow-${color}`}>
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid lines */}
                {[25, 50, 75].map((y, index) => (
                  <motion.line
                    key={index}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="0.5"
                    strokeDasharray="4,4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  />
                ))}

                {/* Area */}
                <motion.path
                  d={getPathData()}
                  fill={`url(#elegantGradient-${color})`}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  style={{ transformOrigin: "bottom" }}
                />

                {/* Line */}
                <motion.path
                  d={getLineData()}
                  fill="none"
                  stroke={chartColors.stroke}
                  strokeWidth="3"
                  filter={`url(#elegantGlow-${color})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.7, ease: "easeInOut" }}
                />

                {/* Data points */}
                {data.map((dataPoint, index) => {
                  const x = (index / (totalPoints - 1)) * 100
                  const y = 100 - ((dataPoint.value - minValue) / (maxValue - minValue)) * 70

                  return (
                    <motion.g key={index}>
                      <motion.circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill={chartColors.stroke}
                        opacity="0.3"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                      />
                      <motion.circle
                        cx={x}
                        cy={y}
                        r="2"
                        fill="#ffffff"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                        className="elegant-chart-point"
                      />
                    </motion.g>
                  )
                })}
              </svg>
            </motion.div>

            {/* X-axis labels */}
            <motion.div
              className="elegant-chart-labels"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              {data.map((dataPoint, index) => (
                <motion.div
                  key={index}
                  className="elegant-chart-label"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                >
                  {dataPoint.label}
                </motion.div>
              ))}
            </motion.div>

            {/* Summary Stats */}
            <motion.div
              className="elegant-chart-summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <div className="elegant-summary-item">
                <span className="elegant-summary-label">Peak</span>
                <span className="elegant-summary-value">{stats.max.toLocaleString()}</span>
              </div>
              <div className="elegant-summary-item">
                <span className="elegant-summary-label">Low</span>
                <span className="elegant-summary-value">{stats.min.toLocaleString()}</span>
              </div>
              <div className="elegant-summary-item">
                <span className="elegant-summary-label">Avg</span>
                <span className="elegant-summary-value">{stats.avg.toLocaleString()}</span>
              </div>
              <div className="elegant-summary-item">
                <span className="elegant-summary-label">Total</span>
                <span className="elegant-summary-value">{stats.total.toLocaleString()}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Initializing Admin Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="futuristic-dashboard">
      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="grid-overlay"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 4}`}></div>
          ))}
        </div>
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="dashboard-header"
      >
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <Shield className="title-icon" />
              Admin Command Center
            </h1>
            <p className="dashboard-subtitle">Real-time system monitoring & control</p>
          </div>
          <div className="header-right">
            <div className="system-status">
              <div className="status-indicator active"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="stat-card stat-card-primary"
        >
          <div className="stat-icon-wrapper">
            <Users className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{users.length.toLocaleString()}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-trend">
              <TrendingUp size={14} />
              <span>+12.5%</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="chart-bar" style={{ height: `${Math.random() * 100}%` }}></div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="stat-card stat-card-secondary"
        >
          <div className="stat-icon-wrapper">
            <GameController className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{games.length.toLocaleString()}</div>
            <div className="stat-label">Total Games</div>
            <div className="stat-trend">
              <TrendingUp size={14} />
              <span>+8.3%</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="chart-bar" style={{ height: `${Math.random() * 100}%` }}></div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="stat-card stat-card-accent"
        >
          <div className="stat-icon-wrapper">
            <DollarSign className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">$12,543</div>
            <div className="stat-label">Revenue</div>
            <div className="stat-trend">
              <TrendingUp size={14} />
              <span>+5.1%</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="chart-bar" style={{ height: `${Math.random() * 100}%` }}></div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="stat-card stat-card-success"
        >
          <div className="stat-icon-wrapper">
            <User className="stat-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{owners.length.toLocaleString()}</div>
            <div className="stat-label">Total Owners</div>
            <div className="stat-trend">
              <Activity size={14} />
              <span>Stable</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="chart-bar" style={{ height: `${Math.random() * 100}%` }}></div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="chart-container"
        >
          <div className="chart-header">
            <h3 className="chart-title">User Analytics</h3>
            <div className="chart-controls">
              <button className="chart-btn active">7M</button>
              <button className="chart-btn">1Y</button>
              <button className="chart-btn">All</button>
            </div>
          </div>
          <div className="chart-wrapper">
            <ElegantChart data={userSignupData} title="User Sign Ups" color="primary" height={320} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="chart-container"
        >
          <div className="chart-header">
            <h3 className="chart-title">Game Metrics</h3>
            <div className="chart-controls">
              <button className="chart-btn active">7M</button>
              <button className="chart-btn">1Y</button>
              <button className="chart-btn">All</button>
            </div>
          </div>
          <div className="chart-wrapper">
            <ElegantChart data={gameUploadsData} title="Game Uploads" color="secondary" height={320} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
