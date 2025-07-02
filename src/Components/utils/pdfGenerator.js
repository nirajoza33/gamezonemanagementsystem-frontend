import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export const generateTicketPDF = async (booking, userInfo) => {
  // Create a temporary div for PDF content
  const tempDiv = document.createElement("div")
  tempDiv.style.position = "absolute"
  tempDiv.style.left = "-9999px"
  tempDiv.style.top = "-9999px"
  tempDiv.style.width = "800px"
  tempDiv.style.background = "#ffffff"
  tempDiv.style.fontFamily = "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"

  // Create ticket HTML content with real QR code
  tempDiv.innerHTML = `
    <div style="
      width: 800px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #ffffff;
      padding: 40px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    ">
      <!-- Background Pattern -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: 
          radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
        pointer-events: none;
      "></div>
      
      <!-- Header -->
      <div style="
        text-align: center;
        margin-bottom: 30px;
        position: relative;
        z-index: 1;
      ">
        <div style="
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        ">GAMEZONE TICKET</div>
        <div style="
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
        ">Your Gaming Adventure Awaits</div>
      </div>

      <!-- Ticket Content -->
      <div style="
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 215, 0, 0.2);
        border-radius: 16px;
        padding: 30px;
        position: relative;
        backdrop-filter: blur(10px);
      ">
        <!-- Game Info Header -->
        <div style="
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        ">
          <div style="
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, ${booking.accentColor || "#ffd700"}20, ${booking.accentColor || "#ffd700"}40);
            border: 2px solid ${booking.accentColor || "#ffd700"};
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-right: 20px;
          ">${booking.gameIcon || "🎮"}</div>
          <div style="flex: 1;">
            <div style="
              font-size: 24px;
              font-weight: 700;
              color: #ffffff;
              margin-bottom: 4px;
            ">${booking.gameName}</div>
            <div style="
              font-size: 14px;
              color: rgba(255, 255, 255, 0.7);
              font-weight: 500;
            ">${booking.gameCategory} • ${booking.bookingReference}</div>
          </div>
          <div style="
            background: linear-gradient(135deg, #10b981, #059669);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">${booking.status || "CONFIRMED"}</div>
        </div>

        <!-- Booking Details Grid -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        ">
          <div style="
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 215, 0, 0.1);
            border-radius: 12px;
            padding: 16px;
          ">
            <div style="
              color: #ffd700;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            ">📅 Date</div>
            <div style="
              color: #ffffff;
              font-size: 16px;
              font-weight: 600;
            ">${formatDateForPDF(booking.bookingDate)}</div>
          </div>
          
          <div style="
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 215, 0, 0.1);
            border-radius: 12px;
            padding: 16px;
          ">
            <div style="
              color: #ffd700;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            ">🕐 Time</div>
            <div style="
              color: #ffffff;
              font-size: 16px;
              font-weight: 600;
            ">${formatTimeForPDF(booking.startTime)} - ${formatTimeForPDF(booking.endTime)}</div>
          </div>
          
          <div style="
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 215, 0, 0.1);
            border-radius: 12px;
            padding: 16px;
          ">
            <div style="
              color: #ffd700;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            ">📍 Location</div>
            <div style="
              color: #ffffff;
              font-size: 16px;
              font-weight: 600;
            ">${booking.location}</div>
          </div>
          
          <div style="
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 215, 0, 0.1);
            border-radius: 12px;
            padding: 16px;
          ">
            <div style="
              color: #ffd700;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            ">⏱️ Duration</div>
            <div style="
              color: #ffffff;
              font-size: 16px;
              font-weight: 600;
            ">${booking.duration}</div>
          </div>
        </div>

        <!-- Price Section -->
        <div style="
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          margin-bottom: 25px;
        ">
          <div style="
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
          ">Total Amount Paid</div>
          <div style="
            color: #ffd700;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -1px;
          ">₹${booking.price}</div>
        </div>

        <!-- Customer Info -->
        <div style="
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 215, 0, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 25px;
        ">
          <div style="
            color: #ffd700;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          ">👤 Customer Information</div>
          <div style="
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
          ">${userInfo?.username || "Gaming Enthusiast"}</div>
          <div style="
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
          ">${userInfo?.email || "customer@gamezone.com"}</div>
          <div style="
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            margin-top: 4px;
          ">Booking ID: ${booking.bookingId}</div>
          ${booking.paymentId ? `<div style="
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            margin-top: 4px;
          ">Payment ID: ${booking.paymentId}</div>` : ""}
        </div>

        <!-- QR Code Section -->
        <div style="
          text-align: center;
          margin-bottom: 20px;
        ">
          <div style="
            color: #ffd700;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          ">📱 Show this QR code at the venue</div>
          <div style="
            background: #ffffff;
            padding: 20px;
            border-radius: 12px;
            display: inline-block;
            border: 2px solid #ffd700;
          ">
            ${booking.qrCode ? `<img src="${booking.qrCode}" style="width: 120px; height: 120px; border-radius: 8px;" alt="QR Code" />` : `
            <div style="
              width: 120px;
              height: 120px;
              background: #f0f0f0;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #666;
              font-size: 12px;
              text-align: center;
            ">QR Code<br/>${booking.bookingReference}</div>`}
          </div>
        </div>

        <!-- Footer -->
        <div style="
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 215, 0, 0.2);
        ">
          <div style="
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            margin-bottom: 8px;
          ">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <div style="
            color: #ffd700;
            font-size: 14px;
            font-weight: 600;
          ">Thank you for choosing GameZone!</div>
        </div>
      </div>
    </div>
  `

  // Add to DOM temporarily
  document.body.appendChild(tempDiv)

  try {
    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#1a1a1a",
    })

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4")
    const imgData = canvas.toDataURL("image/png")

    // Calculate dimensions to fit A4
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

    // Save the PDF
    pdf.save(`GameZone-Ticket-${booking.bookingReference}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  } finally {
    // Clean up
    document.body.removeChild(tempDiv)
  }
}

// Helper functions
const formatDateForPDF = (dateString) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTimeForPDF = (timeString) => {
  if (!timeString) return ""
  const [hours, minutes] = timeString.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const formattedHour = hour % 12 || 12
  return `${formattedHour}:${minutes} ${ampm}`
}
