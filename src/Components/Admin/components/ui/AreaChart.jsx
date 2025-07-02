"use client"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react'
import "./AreaChart.css"

const AreaChart = ({ data, title, color = "primary", height = 280 }) => {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const totalPoints = data.length

  const getColor = () => {
    switch (color) {
      case "primary":
        return {
          stroke: "rgb(236, 72, 153)",
          fill: "rgba(236, 72, 153, 0.15)",
          glow: "rgba(236, 72, 153, 0.3)",
          gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.05))",
        }
      case "secondary":
        return {
          stroke: "rgb(14, 165, 233)",
          fill: "rgba(14, 165, 233, 0.15)",
          glow: "rgba(14, 165, 233, 0.3)",
          gradient: "linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.05))",
        }
      case "accent":
        return {
          stroke: "rgb(34, 197, 94)",
          fill: "rgba(34, 197, 94, 0.15)",
          glow: "rgba(34, 197, 94, 0.3)",
          gradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))",
        }
      default:
        return {
          stroke: "rgb(236, 72, 153)",
          fill: "rgba(236, 72, 153, 0.15)",
          glow: "rgba(236, 72, 153, 0.3)",
          gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.05))",
        }
    }
  }

  const chartColors = getColor()

  const getPathData = () => {
    const points = data.map((dataPoint, index) => {
      const x = (index / (totalPoints - 1)) * 100
      const y = 100 - ((dataPoint.value - minValue) / (maxValue - minValue)) * 75
      return `${x},${y}`
    })

    return `M0,100 L${points.join(" L")} L100,100 Z`
  }

  const getLineData = () => {
    const points = data.map((dataPoint, index) => {
      const x = (index / (totalPoints - 1)) * 100
      const y = 100 - ((dataPoint.value - minValue) / (maxValue - minValue)) * 75
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
      className="area-chart-card"
      style={{
        "--chart-color": chartColors.stroke,
        "--chart-glow": chartColors.glow,
        "--chart-gradient": chartColors.gradient,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.005 }}
    >
      <div className="area-chart-inner">
        <div className="area-chart-pattern"></div>
        <div className="area-chart-glow"></div>

        <div className="area-chart-content">
          {/* Header */}
          <motion.div
            className="area-chart-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="chart-title-section">
              <div className="chart-icon">
                <BarChart3 size={18} />
              </div>
              <h3 className="chart-title">{title}</h3>
            </div>

            <div className="chart-stats">
              <div className={`chart-trend ${isPositiveTrend ? 'trend-positive' : 'trend-negative'}`}>
                {isPositiveTrend ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>
                  {isPositiveTrend ? "+" : ""}
                  {trend.toFixed(1)}%
                </span>
              </div>
              <div className="chart-period">
                <Calendar size={12} />
                <span>Last 7 days</span>
              </div>
            </div>
          </motion.div>

          {/* Chart Container */}
          <motion.div
            className="area-chart-container"
            style={{ height: `${height}px` }}
            initial={{ opacity: 0, scaleY: 0.9 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`areaGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={chartColors.stroke} stopOpacity="0.4" />
                  <stop offset="70%" stopColor={chartColors.stroke} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={chartColors.stroke} stopOpacity="0.02" />
                </linearGradient>

                <filter id={`glow-${color}`}>
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid lines */}
              {[20, 40, 60, 80].map((y, index) => (
                <motion.line
                  key={index}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.5"
                  strokeDasharray="3,3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                />
              ))}

              {/* Area */}
              <motion.path
                d={getPathData()}
                fill={`url(#areaGradient-${color})`}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: "bottom" }}
              />

              {/* Line */}
              <motion.path
                d={getLineData()}
                fill="none"
                stroke={chartColors.stroke}
                strokeWidth="2.5"
                filter={`url(#glow-${color})`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }}
              />

              {/* Data points */}
              {data.map((dataPoint, index) => {
                const x = (index / (totalPoints - 1)) * 100
                const y = 100 - ((dataPoint.value - minValue) / (maxValue - minValue)) * 75

                return (
                  <motion.g key={index}>
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="3"
                      fill={chartColors.stroke}
                      opacity="0.4"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.4, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                    />
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="1.5"
                      fill={chartColors.stroke}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                      className="chart-point"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="transparent"
                      className="chart-point-hover"
                      data-value={dataPoint.value}
                      data-label={dataPoint.label}
                    />
                  </motion.g>
                )
              })}
            </svg>

            {/* Tooltip */}
            <div className="chart-tooltip" id={`tooltip-${color}`}>
              <div className="tooltip-content">
                <div className="tooltip-label"></div>
                <div className="tooltip-value"></div>
              </div>
            </div>
          </motion.div>

          {/* X-axis labels */}
          <motion.div
            className="area-chart-labels"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {data
              .filter((_, i) => i % Math.ceil(data.length / 4) === 0 || i === data.length - 1)
              .map((dataPoint, index) => (
                <motion.div
                  key={index}
                  className="chart-label"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  {dataPoint.label}
                </motion.div>
              ))}
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            className="chart-summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="summary-item">
              <span className="summary-label">Peak</span>
              <span className="summary-value">{stats.max.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Low</span>
              <span className="summary-value">{stats.min.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg</span>
              <span className="summary-value">{stats.avg.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total</span>
              <span className="summary-value">{stats.total.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default AreaChart
