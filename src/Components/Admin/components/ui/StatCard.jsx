"use client"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import "./StatCard.css"

const StatCard = ({ title, value, icon: Icon, color, percentage }) => {
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return {
          bg: "rgba(255, 42, 109, 0.1)",
          text: "var(--primary)",
          border: "rgba(255, 42, 109, 0.3)",
          glow: "rgba(255, 42, 109, 0.4)",
          gradient: "linear-gradient(135deg, rgba(255, 42, 109, 0.2), rgba(255, 42, 109, 0.05))",
        }
      case "secondary":
        return {
          bg: "rgba(5, 217, 232, 0.1)",
          text: "var(--secondary)",
          border: "rgba(5, 217, 232, 0.3)",
          glow: "rgba(5, 217, 232, 0.4)",
          gradient: "linear-gradient(135deg, rgba(5, 217, 232, 0.2), rgba(5, 217, 232, 0.05))",
        }
      case "accent":
        return {
          bg: "rgba(255, 215, 0, 0.1)",
          text: "var(--accent)",
          border: "rgba(255, 215, 0, 0.3)",
          glow: "rgba(255, 215, 0, 0.4)",
          gradient: "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05))",
        }
      case "success":
        return {
          bg: "rgba(40, 167, 69, 0.1)",
          text: "#4cd964",
          border: "rgba(40, 167, 69, 0.3)",
          glow: "rgba(40, 167, 69, 0.4)",
          gradient: "linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(40, 167, 69, 0.05))",
        }
      case "warning":
        return {
          bg: "rgba(255, 193, 7, 0.1)",
          text: "#ffcc00",
          border: "rgba(255, 193, 7, 0.3)",
          glow: "rgba(255, 193, 7, 0.4)",
          gradient: "linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.05))",
        }
      default:
        return {
          bg: "rgba(255, 42, 109, 0.1)",
          text: "var(--primary)",
          border: "rgba(255, 42, 109, 0.3)",
          glow: "rgba(255, 42, 109, 0.4)",
          gradient: "linear-gradient(135deg, rgba(255, 42, 109, 0.2), rgba(255, 42, 109, 0.05))",
        }
    }
  }

  const colors = getColorClasses()

  // Generate mini chart data for visual enhancement
  const generateMiniChart = () => {
    const points = Array.from({ length: 8 }, (_, i) => {
      const baseValue = 50 + Math.sin(i * 0.5) * 20 + Math.random() * 10
      return baseValue
    })
    return points
  }

  const miniChartData = generateMiniChart()
  const maxValue = Math.max(...miniChartData)

  return (
    <motion.div
      className="stat-card"
      style={{
        "--card-border": colors.border,
        "--card-glow": colors.glow,
        "--card-gradient": colors.gradient,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="stat-card-inner">
        {/* Background Pattern */}
        <div className="stat-card-pattern"></div>

        {/* Glow Effect */}
        <div className="stat-card-glow"></div>

        <div className="stat-card-content">
          <div className="stat-card-main">
            <div className="stat-card-text">
              <motion.h6
                className="stat-card-title"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h6>

              <motion.div
                className="stat-card-value"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {value}
              </motion.div>

              {percentage !== undefined && (
                <motion.div
                  className="stat-card-percentage"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className={`percentage-indicator ${percentage >= 0 ? "positive" : "negative"}`}>
                    {percentage >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>
                      {percentage >= 0 ? "+" : ""}
                      {percentage}%
                    </span>
                  </div>
                  <span className="percentage-label">vs last month</span>
                </motion.div>
              )}
            </div>

            <motion.div
              className="stat-card-icon"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                boxShadow: `0 0 20px ${colors.glow}`,
              }}
              initial={{ opacity: 0, rotate: -180, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Icon size={24} />
              <div className="icon-pulse" style={{ backgroundColor: colors.text }}></div>
            </motion.div>
          </div>

          {/* Mini Chart */}
          <motion.div
            className="stat-card-chart"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <svg width="100%" height="30" viewBox="0 0 100 30">
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.text} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={colors.text} stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Area */}
              <motion.path
                d={`M0,30 ${miniChartData
                  .map(
                    (value, index) => `L${(index / (miniChartData.length - 1)) * 100},${30 - (value / maxValue) * 25}`,
                  )
                  .join(" ")} L100,30 Z`}
                fill={`url(#gradient-${color})`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              />

              {/* Line */}
              <motion.path
                d={`M${miniChartData
                  .map(
                    (value, index) => `${(index / (miniChartData.length - 1)) * 100},${30 - (value / maxValue) * 25}`,
                  )
                  .join(" L")}`}
                fill="none"
                stroke={colors.text}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 1.2 }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
