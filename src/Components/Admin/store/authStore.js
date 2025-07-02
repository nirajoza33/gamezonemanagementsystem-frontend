import { create } from "zustand"

// Mock authentication for demo purposes - would be replaced with real API
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@gamezone.club",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "Moderator User",
    email: "mod@gamezone.club",
    password: "mod123",
    role: "moderator",
  },
]

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === email && u.password === password)

        if (user) {
          const { password, ...userWithoutPassword } = user
          set({ user: userWithoutPassword, isAuthenticated: true })
          localStorage.setItem("user", JSON.stringify(userWithoutPassword))
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 800)
    })
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
    localStorage.removeItem("user")
  },
}))

// Initialize auth state from localStorage
export const initializeAuth = () => {
  const storedUser = localStorage.getItem("user")
  if (storedUser) {
    const user = JSON.parse(storedUser)
    useAuthStore.setState({ user, isAuthenticated: true })
  }
}
