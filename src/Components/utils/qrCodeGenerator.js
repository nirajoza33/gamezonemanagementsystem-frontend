import QRCode from "qrcode"

export const generateBookingQRCode = async (bookingData) => {
  try {
    // Create unique QR data with booking information
    const qrData = {
      bookingId: bookingData.bookingId,
      gameId: bookingData.gameId,
      gameName: bookingData.gameName,
      userId: bookingData.userId,
      bookingDate: bookingData.bookingDate,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      price: bookingData.price,
      bookingReference: bookingData.bookingReference,
      timestamp: new Date().toISOString(),
      // Add verification hash for security
      verificationCode: generateVerificationCode(bookingData),
    }

    // Convert to JSON string
    const qrString = JSON.stringify(qrData)

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      width: 300,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })

    return {
      qrCodeDataURL,
      qrData,
      qrString,
    }
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw error
  }
}

// Generate a simple verification code for security
const generateVerificationCode = (bookingData) => {
  const baseString = `${bookingData.bookingId}-${bookingData.userId}-${bookingData.gameId}-${bookingData.bookingDate}`
  let hash = 0
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase().slice(0, 8)
}

// Function to verify QR code data
export const verifyQRCode = (qrData) => {
  try {
    const expectedCode = generateVerificationCode(qrData)
    return qrData.verificationCode === expectedCode
  } catch (error) {
    console.error("Error verifying QR code:", error)
    return false
  }
}

// Function to parse QR code string back to object
export const parseQRCode = (qrString) => {
  try {
    return JSON.parse(qrString)
  } catch (error) {
    console.error("Error parsing QR code:", error)
    return null
  }
}
