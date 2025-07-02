import { create } from "zustand"

// Mock data
const mockGames = [
  {
    id: "1",
    title: "Cyber Racer 2077",
    description: "A futuristic racing game with cyberpunk aesthetics.",
    genre: "Racing",
    thumbnail:
      "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ownerId: "2",
    ownerName: "NeonGames Inc.",
    status: "pending",
    submittedAt: "2023-05-15T10:30:00Z",
    reviewedAt: null,
    reviewedBy: null,
  },
  {
    id: "2",
    title: "Medieval Conquest",
    description: "Strategy game set in medieval times with kingdom building.",
    genre: "Strategy",
    thumbnail:
      "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ownerId: "3",
    ownerName: "StrategyMasters",
    status: "approved",
    submittedAt: "2023-05-10T14:25:00Z",
    reviewedAt: "2023-05-12T09:15:00Z",
    reviewedBy: "Admin User",
  },
  {
    id: "3",
    title: "Space Explorer",
    description: "Open world space exploration game with stunning visuals.",
    genre: "Adventure",
    thumbnail:
      "https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ownerId: "4",
    ownerName: "Cosmic Studios",
    status: "rejected",
    submittedAt: "2023-05-05T11:45:00Z",
    reviewedAt: "2023-05-07T16:30:00Z",
    reviewedBy: "Moderator User",
  },
  {
    id: "4",
    title: "Dungeon Crawler",
    description: "Roguelike dungeon crawler with procedural generation.",
    genre: "RPG",
    thumbnail:
      "https://images.pexels.com/photos/2728255/pexels-photo-2728255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ownerId: "2",
    ownerName: "NeonGames Inc.",
    status: "pending",
    submittedAt: "2023-05-18T13:20:00Z",
    reviewedAt: null,
    reviewedBy: null,
  },
]

export const useGameStore = create((set) => ({
  games: [],
  filteredGames: [],
  searchTerm: "",
  statusFilter: "all",
  genreFilter: "all",
  loading: false,
  error: null,

  fetchGames: async () => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      set({
        games: mockGames,
        filteredGames: mockGames,
        loading: false,
      })
    } catch (error) {
      set({
        error: "Failed to fetch games",
        loading: false,
      })
    }
  },

  approveGame: async (id, reviewerId, reviewerName) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      set((state) => {
        const updatedGames = state.games.map((game) =>
          game.id === id
            ? {
                ...game,
                status: "approved",
                reviewedAt: new Date().toISOString(),
                reviewedBy: reviewerName,
              }
            : game,
        )

        return {
          games: updatedGames,
          filteredGames: getFilteredGames(updatedGames, state.searchTerm, state.statusFilter, state.genreFilter),
          loading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to approve game", loading: false })
    }
  },

  rejectGame: async (id, reviewerId, reviewerName) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      set((state) => {
        const updatedGames = state.games.map((game) =>
          game.id === id
            ? {
                ...game,
                status: "rejected",
                reviewedAt: new Date().toISOString(),
                reviewedBy: reviewerName,
              }
            : game,
        )

        return {
          games: updatedGames,
          filteredGames: getFilteredGames(updatedGames, state.searchTerm, state.statusFilter, state.genreFilter),
          loading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to reject game", loading: false })
    }
  },

  setSearchTerm: (term) => {
    set((state) => ({
      searchTerm: term,
      filteredGames: getFilteredGames(state.games, term, state.statusFilter, state.genreFilter),
    }))
  },

  setStatusFilter: (status) => {
    set((state) => ({
      statusFilter: status,
      filteredGames: getFilteredGames(state.games, state.searchTerm, status, state.genreFilter),
    }))
  },

  setGenreFilter: (genre) => {
    set((state) => ({
      genreFilter: genre,
      filteredGames: getFilteredGames(state.games, state.searchTerm, state.statusFilter, genre),
    }))
  },
}))

// Helper function for filtering
const getFilteredGames = (games, searchTerm, statusFilter, genreFilter) => {
  return games.filter((game) => {
    const matchesSearch =
      searchTerm === "" ||
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.ownerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || game.status === statusFilter

    const matchesGenre = genreFilter === "all" || game.genre === genreFilter

    return matchesSearch && matchesStatus && matchesGenre
  })
}
