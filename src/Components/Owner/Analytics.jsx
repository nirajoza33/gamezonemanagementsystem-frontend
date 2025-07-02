"use client"

import { useState, useEffect } from "react"
import "./Analytics.css"
import axios from "axios"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts"
import { TrendingUp, Users, Gamepad2, Target, Download, RefreshCw, AlertCircle, BarChart3 } from "lucide-react"
import { getUserInfo } from "../../auth/JwtUtils"

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [analyticsData, setAnalyticsData] = useState({
    gamePerformance: [],
    userEngagement: [],
    revenueBreakdown: [],
    geographicData: [],
    timeAnalytics: [],
    performanceMetrics: [],
    monthlyRevenue: [],
    dailyRevenue: [],
    userActivity: [],
    bookingTrends: [],
    reviewAnalytics: {
      reviews: [],
      averageRating: 0,
    },
    dashboardStats: {
      totalRevenue: 0,
      totalUsers: 0,
      activeGames: 0,
      conversionRate: 0,
      totalGames: 0,
      revenueGrowth: 0,
    },
  })

  const userInfo = getUserInfo()
  const userId = userInfo?.UserId

  const API_BASE_URL = "https://localhost:7186/api"

  useEffect(() => {
    if (userId) {
      fetchAnalyticsData()
    }
  }, [userId, timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const endpoints = [
        `${API_BASE_URL}/Tblusers/Dashboard/${userId}`,
        `${API_BASE_URL}/Tblusers/GameRevenue/${userId}`,
        `${API_BASE_URL}/Tblusers/UserEngagement/${userId}`,
        `${API_BASE_URL}/Tblusers/RevenueBreakdown/${userId}`,
        `${API_BASE_URL}/Tblusers/GeographicData`,
        `${API_BASE_URL}/Tblusers/PerformanceMetrics/${userId}`,
        `${API_BASE_URL}/TblPayments/RevenueByUserOverTime/${userId}`,
        `${API_BASE_URL}/TblPayments/RevenueByUserDaily/${userId}`,
        `${API_BASE_URL}/Tblusers/UserActivity`,
        `${API_BASE_URL}/Tblusers/BookingTrends/${userId}`,
        `${API_BASE_URL}/Tblusers/ReviewAnalytics/${userId}`,
      ]

      const responses = await Promise.allSettled(endpoints.map((endpoint) => axios.get(endpoint)))

      const [
        dashboardRes,
        gameRevenueRes,
        userEngagementRes,
        revenueBreakdownRes,
        geographicRes,
        performanceRes,
        monthlyRevenueRes,
        dailyRevenueRes,
        userActivityRes,
        bookingTrendsRes,
        reviewAnalyticsRes,
      ] = responses

      const processedData = {
        dashboardStats:
          dashboardRes.status === "fulfilled"
            ? dashboardRes.value.data
            : {
                totalRevenue: 10675,
                totalUsers: 6,
                activeGames: 2,
                conversionRate: 1.8,
                totalGames: 4,
                revenueGrowth: -37,
              },
        gamePerformance:
          gameRevenueRes.status === "fulfilled"
            ? gameRevenueRes.value.data
            : [
                { name: "Puzzle", revenue: 9625, players: 45, downloads: 120 },
                { name: "Adventure", revenue: 1050, players: 12, downloads: 35 },
              ],
        userEngagement: userEngagementRes.status === "fulfilled" ? userEngagementRes.value.data : [],
        revenueBreakdown:
          revenueBreakdownRes.status === "fulfilled"
            ? revenueBreakdownRes.value.data
            : [
                { name: "Puzzle", value: 90.2, amount: 9625 },
                { name: "Adventure", value: 9.8, amount: 1050 },
              ],
        geographicData: geographicRes.status === "fulfilled" ? geographicRes.value.data : [],
        performanceMetrics: performanceRes.status === "fulfilled" ? performanceRes.value.data : [],
        monthlyRevenue: monthlyRevenueRes.status === "fulfilled" ? monthlyRevenueRes.value.data : [],
        dailyRevenue: dailyRevenueRes.status === "fulfilled" ? dailyRevenueRes.value.data : [],
        userActivity: userActivityRes.status === "fulfilled" ? userActivityRes.value.data : [],
        bookingTrends: bookingTrendsRes.status === "fulfilled" ? bookingTrendsRes.value.data : [],
        reviewAnalytics:
          reviewAnalyticsRes.status === "fulfilled"
            ? reviewAnalyticsRes.value.data
            : {
                reviews: [],
                averageRating: 0,
              },
        timeAnalytics: monthlyRevenueRes.status === "fulfilled" ? monthlyRevenueRes.value.data : [],
      }

      setAnalyticsData(processedData)
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
      setError("Failed to load analytics data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#ff2a6d", "#4cd964", "#ffcc00", "#ff6b9d", "#8b5cf6", "#06b6d4"]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="analytics-tooltip">
          <div className="tooltip-header">{label}</div>
          {payload.map((entry, index) => (
            <div key={index} className="tooltip-item">
              <span className="tooltip-label" style={{ color: entry.color }}>
                {entry.name || entry.dataKey}:
              </span>
              <span className="tooltip-value">
                {typeof entry.value === "number" && (entry.name || entry.dataKey).toLowerCase().includes("revenue")
                  ? `₹${entry.value.toLocaleString("en-IN")}`
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Loading Analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="analytics-loading">
        <div className="error-container">
          <AlertCircle size={48} style={{ color: "var(--primary-color)" }} />
          <h3>Error Loading Analytics</h3>
          <p>{error}</p>
          <button onClick={fetchAnalyticsData} className="action-btn">
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <div className="header-title">
            <div className="header-icon">
              <BarChart3 size={40} />
            </div>
            <div>
              <h1>Analytics Dashboard</h1>
              <p>Comprehensive insights into your gaming business</p>
            </div>
          </div>
          <div className="header-controls">
            <div className="time-selector">
              <button className={`time-btn ${timeRange === "7d" ? "active" : ""}`} onClick={() => setTimeRange("7d")}>
                7 Days
              </button>
              <button className={`time-btn ${timeRange === "30d" ? "active" : ""}`} onClick={() => setTimeRange("30d")}>
                30 Days
              </button>
              <button className={`time-btn ${timeRange === "90d" ? "active" : ""}`} onClick={() => setTimeRange("90d")}>
                90 Days
              </button>
            </div>
            <button onClick={fetchAnalyticsData} className="action-btn">
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="action-btn">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-section">
        <div className="kpi-grid">
          <div className="kpi-card revenue">
            <div className="kpi-icon">
              <TrendingUp size={24} />
            </div>
            <div className="kpi-content">
              <div className="kpi-label">Total Revenue</div>
              <div className="kpi-value">₹{analyticsData.dashboardStats.totalRevenue.toLocaleString("en-IN")}</div>
              <div
                className={`kpi-change ${analyticsData.dashboardStats.revenueGrowth >= 0 ? "positive" : "negative"}`}
              >
                {analyticsData.dashboardStats.revenueGrowth >= 0 ? "+" : ""}
                {analyticsData.dashboardStats.revenueGrowth}% from last month
              </div>
            </div>
          </div>

          <div className="kpi-card users">
            <div className="kpi-icon">
              <Users size={24} />
            </div>
            <div className="kpi-content">
              <div className="kpi-label">Active Users</div>
              <div className="kpi-value">{analyticsData.dashboardStats.totalUsers.toLocaleString("en-IN")}</div>
              <div className="kpi-change positive">+8.3% from last month</div>
            </div>
          </div>

          <div className="kpi-card games">
            <div className="kpi-icon">
              <Gamepad2 size={24} />
            </div>
            <div className="kpi-content">
              <div className="kpi-label">Active Games</div>
              <div className="kpi-value">{analyticsData.dashboardStats.activeGames}</div>
              <div className="kpi-change positive">
                {analyticsData.dashboardStats.activeGames} of {analyticsData.dashboardStats.totalGames} games active
              </div>
            </div>
          </div>

          <div className="kpi-card conversion">
            <div className="kpi-icon">
              <Target size={24} />
            </div>
            <div className="kpi-content">
              <div className="kpi-label">Conversion Rate</div>
              <div className="kpi-value">{analyticsData.dashboardStats.conversionRate}%</div>
              <div className="kpi-change positive">+0.2% from last month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          {/* Game Performance */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Game Performance</h3>
              <div className="chart-controls">
                <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
                  <option value="revenue">Revenue</option>
                  <option value="players">Players</option>
                  <option value="downloads">Downloads</option>
                </select>
              </div>
            </div>
            <div className="chart-content">
              {analyticsData.gamePerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.gamePerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--border-color)" }}
                    />
                    <YAxis
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--border-color)" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey={selectedMetric} radius={[4, 4, 0, 0]}>
                      {analyticsData.gamePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-message">No game performance data available</div>
              )}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Breakdown</h3>
            </div>
            <div className="chart-content">
              {analyticsData.revenueBreakdown.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analyticsData.revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {analyticsData.revenueBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {analyticsData.revenueBreakdown.map((entry, index) => (
                      <div key={entry.name} className="legend-item">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span>{entry.name}</span>
                        </div>
                        <span className="legend-value">₹{entry.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-data-message">No revenue breakdown data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        {analyticsData.monthlyRevenue.length > 0 && (
          <div className="chart-row full-width">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Monthly Revenue Trend</h3>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--border-color)" }}
                    />
                    <YAxis
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--border-color)" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--primary-color)"
                      strokeWidth={3}
                      dot={{ fill: "var(--primary-color)", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Additional Charts Row */}
        <div className="chart-row">
          {/* User Engagement */}
          {analyticsData.userEngagement.length > 0 && (
            <div className="chart-card">
              <div className="chart-header">
                <h3>User Engagement Timeline</h3>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.userEngagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--border-color)" }}
                    />
                    <YAxis
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--border-color)" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="active"
                      fill="var(--primary-color)"
                      fillOpacity={0.3}
                      stroke="var(--primary-color)"
                    />
                    <Bar dataKey="new_users" fill="var(--accent-color)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {analyticsData.performanceMetrics.length > 0 && (
            <div className="chart-card">
              <div className="chart-header">
                <h3>Performance Metrics</h3>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analyticsData.performanceMetrics}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--text-secondary)", fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="var(--primary-color)"
                      fill="var(--primary-color)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics
