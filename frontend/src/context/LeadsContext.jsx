import { createContext, useReducer } from 'react'

export const LeadsContext = createContext()

export const leadsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LEADS':
      return {
        ...state,
        leads: action.payload
      }
    case 'CREATE_LEAD':
      return {
        ...state,
        leads: [action.payload, ...state.leads]
      }
    case 'DELETE_LEAD':
      return {
        ...state,
        leads: state.leads.filter((l) => l._id !== action.payload._id)
      }
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map((lead) =>
          lead._id === action.payload._id ? action.payload : lead
        )
      }
    case 'SET_UNASSIGNED_LEADS':
      return {
        ...state,
        unassignedLeads: action.payload
      }
    case 'UPDATE_STATUS':
      return {
        ...state,
        unassignedLeads: state.unassignedLeads.map((lead) =>
          lead._id === action.payload._id ? action.payload : lead
        )
      }
    case 'DELETE_STATUS':
      return {
        ...state,
        unassignedLeads: state.unassignedLeads.filter((l) => l._id !== action.payload._id)
      }
    case 'SET_TL_LEADS':
      return {
        ...state,
        tlLeads: action.payload
      }
    case 'UPDATE_TL_LEAD':
      return {
        ...state,
        tlLeads: state.tlLeads.map((lead) =>
          lead._id === action.payload._id ? action.payload : lead
        )
      }
    case 'DELETE_TL_LEAD':
      return {
        ...state,
        tlLeads: state.tlLeads.filter((l) => l._id !== action.payload._id)
      }
    case 'SET_INVENTORY':
      return {
        ...state,
        inventory: action.payload
      }
    case 'SET_BOOKINGS':
      return {
        ...state,
        recentBookings: action.payload
      }
    case 'SET_LEADGEN_STATS':
      return {
        ...state,
        leadGenStats: action.payload
      }
    case 'SET_BOOKED_UNITS':
      return {
        ...state,
        bookedUnits: action.payload
      }
    default:
      return state
  }
}

export const LeadsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leadsReducer, {
    leads: [],
    unassignedLeads: [],
    tlLeads: [],
    inventory: [],
    recentBookings: [],
    leadGenStats: [],
    bookedUnits: []
  })

  return (
    <LeadsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </LeadsContext.Provider>
  )
}
