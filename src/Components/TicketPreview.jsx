"use client"
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaUser, FaEnvelope, FaQrcode } from "react-icons/fa"

const TicketPreview = ({ booking, userInfo, onClose, onDownload }) => {
  return (
    <div className="ticket-preview-overlay" onClick={onClose}>
      <div className="ticket-preview-container" onClick={(e) => e.stopPropagation()}>
        <div className="ticket-preview-header">
          <h2>Ticket Preview</h2>
          <button className="close-preview" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="ticket-preview-content">
          <div className="ticket-wrapper">
            {/* Ticket Header */}
            <div className="ticket-header">
              <div className="ticket-logo">
                <div className="logo-text">GAMEZONE</div>
                <div className="logo-subtitle">Your Gaming Adventure Awaits</div>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="ticket-body">
              {/* Game Info */}
              <div className="ticket-game-info">
                <div className="game-icon-large">
                  <span>{booking.gameIcon}</span>
                </div>
                <div className="game-details">
                  <h3 className="game-name">{booking.gameName}</h3>
                  <div className="game-category">{booking.gameCategory}</div>
                  <div className="booking-ref">#{booking.bookingReference}</div>
                </div>
                <div className={`status-badge ${booking.status}`}>{booking.status.toUpperCase()}</div>
              </div>

              {/* Booking Details */}
              <div className="ticket-details-grid">
                <div className="detail-card">
                  <FaCalendarAlt className="detail-icon" />
                  <div className="detail-label">Date</div>
                  <div className="detail-value">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                </div>

                <div className="detail-card">
                  <FaClock className="detail-icon" />
                  <div className="detail-label">Time</div>
                  <div className="detail-value">
                    {booking.startTime} - {booking.endTime}
                  </div>
                </div>

                <div className="detail-card">
                  <FaMapMarkerAlt className="detail-icon" />
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{booking.location}</div>
                </div>

                <div className="detail-card">
                  <FaUsers className="detail-icon" />
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">{booking.duration}</div>
                </div>
              </div>

              {/* Price */}
              <div className="ticket-price-section">
                <div className="price-label">Total Amount Paid</div>
                <div className="price-value">₹{booking.price}</div>
              </div>

              {/* Customer Info */}
              <div className="ticket-customer-info">
                <h4>Customer Information</h4>
                <div className="customer-details">
                  <div className="customer-item">
                    <FaUser className="customer-icon" />
                    <span>{userInfo?.username || "Gaming Enthusiast"}</span>
                  </div>
                  <div className="customer-item">
                    <FaEnvelope className="customer-icon" />
                    <span>{userInfo?.email || "customer@gamezone.com"}</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="ticket-qr-section">
                <div className="qr-label">Show this at the venue</div>
                <div className="qr-code-placeholder">
                  <FaQrcode size={60} />
                  <div className="qr-text">{booking.bookingReference}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="ticket-footer">
                <div className="generated-info">
                  Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </div>
                <div className="thank-you">Thank you for choosing GameZone!</div>
              </div>
            </div>
          </div>
        </div>

        <div className="ticket-preview-actions">
          <button className="preview-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="preview-btn download" onClick={onDownload}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default TicketPreview
