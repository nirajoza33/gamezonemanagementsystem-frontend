import axios from "axios"
import { jwtDecode } from "jwt-decode"

const API_URL = "https://localhost:7186/api" // Update with your API URL

// Configure axios with authentication
const configureAxios = () => {
  const token = localStorage.getItem("token")
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  }
  return {}
}

// Get user ID from token
// Add this line
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    return decoded.UserId
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}


// Dashboard data services
const DashboardService = {
    getUserIdFromToken: () => {
    const token = localStorage.getItem("token")
    if (!token) return null

    try {
      const decoded = jwtDecode(token)
      return decoded.UserId
    } catch (error) {
      console.error("Error decoding token:", error)
      return null
    }
  },
  // Get user info
  getUserInfo: () => {
    const token = localStorage.getItem("token")
    if (!token) return null

    try {
      return jwtDecode(token)
    } catch (error) {
      console.error("Error decoding token:", error)
      return null
    }
  },

  // Get all games for the owner
  getOwnerGames: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/TblGames/ByUser/${userId}`, configureAxios())
      return response.data
    } catch (error) {
      console.error("Error fetching owner games:", error)
      throw error
    }
  },

  // Get total revenue for the owner
  getTotalRevenue: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/TblGames/TotalRevenueByUser/${userId}`, configureAxios())
      return response.data
    } catch (error) {
      console.error("Error fetching total revenue:", error)
      throw error
    }
  },

  // Get revenue over time
  getRevenueOverTime: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/TblPayments/RevenueByUserOverTime/${userId}`, configureAxios())
      return response.data
    } catch (error) {
      console.error("Error fetching revenue over time:", error)
      throw error
    }
  },

  // Get daily revenue
  getDailyRevenue: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/TblPayments/RevenueByUserDaily/${userId}`, configureAxios())
      return response.data
    } catch (error) {
      console.error("Error fetching daily revenue:", error)
      throw error
    }
  },

  // Get bookings for the owner's games
  getBookings: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/TblBookings?userId=${userId}`, configureAxios())
      return response.data
    } catch (error) {
      console.error("Error fetching bookings:", error)
      throw error
    }
  },

  // Get reviews for the owner's games
  getReviews: async (userId) => {
    try {
      // First get the owner's games
      const games = await DashboardService.getOwnerGames(userId)

      // Then get reviews for each game
      const reviewPromises = games.map((game) =>
        axios.get(`${API_URL}/TblReviews/Game/${game.gameId}`, configureAxios()),
      )

      const reviewResponses = await Promise.all(reviewPromises)

      // Flatten the array of review arrays
      return reviewResponses.flatMap((response) => response.data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      throw error
    }
  },
}

export default DashboardService
