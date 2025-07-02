import { create } from "zustand"

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    createdAt: "2023-01-15T08:30:00Z",
    lastLogin: "2023-05-20T14:25:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "moderator",
    status: "active",
    createdAt: "2023-02-10T10:15:00Z",
    lastLogin: "2023-05-19T09:45:00Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "owner",
    status: "suspended",
    createdAt: "2023-03-05T15:45:00Z",
    lastLogin: "2023-04-28T16:30:00Z",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "owner",
    status: "active",
    createdAt: "2023-03-12T09:20:00Z",
    lastLogin: "2023-05-21T11:10:00Z",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    role: "owner",
    status: "active",
    createdAt: "2023-04-02T14:50:00Z",
    lastLogin: "2023-05-18T10:05:00Z",
  },
]

export const useUserStore = create((set, get) => ({
  users: [],
  filteredUsers: [],
  searchTerm: "",
  statusFilter: "all",
  roleFilter: "all",
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      console.log("Fetched users:", mockUsers)
      set({
        users: mockUsers,
        filteredUsers: mockUsers,
        loading: false,
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      set({
        error: "Failed to fetch users",
        loading: false,
      })
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newUser = {
        ...userData,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        lastLogin: "",
      }

      console.log("Creating new user:", newUser)

      set((state) => {
        const updatedUsers = [...state.users, newUser]
        console.log("Updated users after create:", updatedUsers)
        return {
          users: updatedUsers,
          filteredUsers: getFilteredUsers(updatedUsers, state.searchTerm, state.statusFilter, state.roleFilter),
          loading: false,
        }
      })
    } catch (error) {
      console.error("Error creating user:", error)
      set({ error: "Failed to create user", loading: false })
    }
  },

  updateUser: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      console.log("Updating user with ID:", id, "Updates:", updates)

      set((state) => {
        const updatedUsers = state.users.map((user) => (user.id === id ? { ...user, ...updates } : user))

        console.log("Updated users after update:", updatedUsers)

        return {
          users: updatedUsers,
          filteredUsers: getFilteredUsers(updatedUsers, state.searchTerm, state.statusFilter, state.roleFilter),
          loading: false,
        }
      })
    } catch (error) {
      console.error("Error updating user:", error)
      set({ error: "Failed to update user", loading: false })
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      console.log("Deleting user with ID:", id)

      set((state) => {
        const updatedUsers = state.users.filter((user) => user.id !== id)
        console.log("Updated users after delete:", updatedUsers)
        return {
          users: updatedUsers,
          filteredUsers: getFilteredUsers(updatedUsers, state.searchTerm, state.statusFilter, state.roleFilter),
          loading: false,
        }
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      set({ error: "Failed to delete user", loading: false })
    }
  },

  suspendUser: async (id) => {
    console.log("Suspending user with ID:", id)
    get().updateUser(id, { status: "suspended" })
  },

  activateUser: async (id) => {
    console.log("Activating user with ID:", id)
    get().updateUser(id, { status: "active" })
  },

  setSearchTerm: (term) => {
    set((state) => ({
      searchTerm: term,
      filteredUsers: getFilteredUsers(state.users, term, state.statusFilter, state.roleFilter),
    }))
  },

  setStatusFilter: (status) => {
    set((state) => ({
      statusFilter: status,
      filteredUsers: getFilteredUsers(state.users, state.searchTerm, status, state.roleFilter),
    }))
  },

  setRoleFilter: (role) => {
    set((state) => ({
      roleFilter: role,
      filteredUsers: getFilteredUsers(state.users, state.searchTerm, state.statusFilter, role),
    }))
  },
}))

// Helper function for filtering
const getFilteredUsers = (users, searchTerm, statusFilter, roleFilter) => {
  return users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })
}
