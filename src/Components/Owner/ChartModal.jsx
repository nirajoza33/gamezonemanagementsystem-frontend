"use client"

import { X, Calendar, BarChart3 } from "lucide-react"

const ChartModal = ({ isOpen, onClose, type, data, title }) => {
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const renderDetailsContent = () => {
    if (!data) return null

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
    const avgRevenue = totalRevenue / data.length
    const maxRevenue = Math.max(...data.map((item) => item.revenue))
    const minRevenue = Math.min(...data.map((item) => item.revenue))
    const bestPeriod = data.find((item) => item.revenue === maxRevenue)
    const worstPeriod = data.find((item) => item.revenue === minRevenue)

    return (
      <div className="modal-body">
        <div className="details-grid">
          <div className="detail-card">
            <div className="detail-label">Total Revenue</div>
            <div className="detail-value">
              ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-label">Average Revenue</div>
            <div className="detail-value">
              ₹{avgRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-label">Highest Revenue</div>
            <div className="detail-value">
              ₹{maxRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="detail-label" style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
              {bestPeriod?.month || bestPeriod?.date}
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-label">Lowest Revenue</div>
            <div className="detail-value">
              ₹{minRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="detail-label" style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
              {worstPeriod?.month || worstPeriod?.date}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h4 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>Performance Analysis</h4>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div style={{ padding: "1rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px" }}>
              <strong style={{ color: "var(--accent-color)" }}>Growth Trend:</strong>
              <p style={{ marginTop: "0.5rem" }}>
                {data.length > 1 && data[data.length - 1].revenue > data[0].revenue
                  ? "📈 Positive growth trajectory observed"
                  : "📉 Revenue showing decline, requires attention"}
              </p>
            </div>
            <div style={{ padding: "1rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px" }}>
              <strong style={{ color: "var(--secondary-color)" }}>Recommendations:</strong>
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                <li>Focus on high-performing periods for strategy replication</li>
                <li>Analyze low-revenue periods for improvement opportunities</li>
                <li>Consider seasonal trends and market conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCalendarContent = () => {
    if (!data) return null

    // Generate calendar for current month
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayData = data.find((item) => item.date === dateStr)
      calendarDays.push({
        day,
        revenue: dayData?.revenue || 0,
        hasData: !!dayData,
      })
    }

    const avgRevenue = data.reduce((sum, item) => sum + item.revenue, 0) / data.length

    return (
      <div className="modal-body">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--accent-color)" }}>
                ₹{avgRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Daily Average</div>
            </div>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--secondary-color)" }}>
                {data.filter((item) => item.revenue > 0).length}
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Active Days</div>
            </div>
          </div>
        </div>

        <div className="calendar-grid">
          {dayNames.map((day) => (
            <div key={day} className="calendar-header">
              {day}
            </div>
          ))}
          {calendarDays.map((dayData, index) => (
            <div
              key={index}
              className={`calendar-day ${dayData?.hasData ? "has-data" : ""} ${
                dayData?.revenue > avgRevenue * 1.5 ? "high-revenue" : ""
              }`}
            >
              {dayData && (
                <>
                  <div className="day-number">{dayData.day}</div>
                  {dayData.hasData && <div className="day-revenue">₹{dayData.revenue.toLocaleString("en-IN")}</div>}
                </>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{ width: "12px", height: "12px", background: "rgba(76, 217, 100, 0.5)", borderRadius: "2px" }}
            ></div>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Has Revenue</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{ width: "12px", height: "12px", background: "rgba(255, 215, 0, 0.5)", borderRadius: "2px" }}
            ></div>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>High Performance</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" style={{ width: type === "calendar" ? "800px" : "600px" }}>
        <div className="modal-header">
          <div className="modal-title">
            {type === "details" ? <BarChart3 size={24} /> : <Calendar size={24} />}
            {title}
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {type === "details" ? renderDetailsContent() : renderCalendarContent()}
      </div>
    </div>
  )
}

export default ChartModal
