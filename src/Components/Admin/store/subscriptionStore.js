import { create } from "zustand"

// Mock data
const mockSubscriptionPlans = [
  {
    id: "1",
    name: "Basic User",
    price: 4.99,
    billingCycle: "monthly",
    features: ["Access to all games", "Basic profile customization", "Standard customer support"],
    userType: "user",
    isActive: true,
  },
  {
    id: "2",
    name: "Premium User",
    price: 9.99,
    billingCycle: "monthly",
    features: [
      "Access to all games",
      "Advanced profile customization",
      "Priority customer support",
      "No advertisements",
      "Exclusive monthly rewards",
    ],
    userType: "user",
    isActive: true,
  },
  {
    id: "3",
    name: "Starter Game Zone",
    price: 29.99,
    billingCycle: "monthly",
    features: ["Host up to 5 games", "Basic analytics", "Standard support", "Custom game zone page"],
    userType: "owner",
    isActive: true,
  },
  {
    id: "4",
    name: "Professional Game Zone",
    price: 79.99,
    billingCycle: "monthly",
    features: [
      "Unlimited games",
      "Advanced analytics",
      "Priority support",
      "Custom game zone page",
      "Featured placement",
      "API access",
    ],
    userType: "owner",
    isActive: true,
  },
  {
    id: "5",
    name: "Yearly Basic User",
    price: 49.99,
    billingCycle: "yearly",
    features: [
      "Access to all games",
      "Basic profile customization",
      "Standard customer support",
      "15% discount on yearly billing",
    ],
    userType: "user",
    isActive: true,
  },
]

export const useSubscriptionStore = create((set) => ({
  plans: [],
  filteredPlans: [],
  searchTerm: "",
  userTypeFilter: "all",
  billingCycleFilter: "all",
  loading: false,
  error: null,

  fetchPlans: async () => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      set({
        plans: mockSubscriptionPlans,
        filteredPlans: mockSubscriptionPlans,
        loading: false,
      })
    } catch (error) {
      set({
        error: "Failed to fetch subscription plans",
        loading: false,
      })
    }
  },

  createPlan: async (planData) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newPlan = {
        ...planData,
        id: Math.random().toString(36).substring(2, 9),
      }

      set((state) => ({
        plans: [...state.plans, newPlan],
        filteredPlans: getFilteredPlans(
          [...state.plans, newPlan],
          state.searchTerm,
          state.userTypeFilter,
          state.billingCycleFilter,
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: "Failed to create subscription plan", loading: false })
    }
  },

  updatePlan: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      set((state) => {
        const updatedPlans = state.plans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))

        return {
          plans: updatedPlans,
          filteredPlans: getFilteredPlans(
            updatedPlans,
            state.searchTerm,
            state.userTypeFilter,
            state.billingCycleFilter,
          ),
          loading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to update subscription plan", loading: false })
    }
  },

  deletePlan: async (id) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      set((state) => {
        const updatedPlans = state.plans.filter((plan) => plan.id !== id)
        return {
          plans: updatedPlans,
          filteredPlans: getFilteredPlans(
            updatedPlans,
            state.searchTerm,
            state.userTypeFilter,
            state.billingCycleFilter,
          ),
          loading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to delete subscription plan", loading: false })
    }
  },

  togglePlanStatus: async (id) => {
    set((state) => {
      const plan = state.plans.find((p) => p.id === id)
      if (plan) {
        return state.updatePlan(id, { isActive: !plan.isActive })
      }
      return state
    })
  },

  setSearchTerm: (term) => {
    set((state) => ({
      searchTerm: term,
      filteredPlans: getFilteredPlans(state.plans, term, state.userTypeFilter, state.billingCycleFilter),
    }))
  },

  setUserTypeFilter: (userType) => {
    set((state) => ({
      userTypeFilter: userType,
      filteredPlans: getFilteredPlans(state.plans, state.searchTerm, userType, state.billingCycleFilter),
    }))
  },

  setBillingCycleFilter: (cycle) => {
    set((state) => ({
      billingCycleFilter: cycle,
      filteredPlans: getFilteredPlans(state.plans, state.searchTerm, state.userTypeFilter, cycle),
    }))
  },
}))

// Helper function for filtering
const getFilteredPlans = (plans, searchTerm, userTypeFilter, billingCycleFilter) => {
  return plans.filter((plan) => {
    const matchesSearch = searchTerm === "" || plan.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesUserType =
      userTypeFilter === "all" ||
      plan.userType === userTypeFilter ||
      (userTypeFilter === "both" && plan.userType === "both")

    const matchesBillingCycle = billingCycleFilter === "all" || plan.billingCycle === billingCycleFilter

    return matchesSearch && matchesUserType && matchesBillingCycle
  })
}
