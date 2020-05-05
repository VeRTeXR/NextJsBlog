import createStore from 'react-waterfall'

const config = {
  initialState: { 
    loggedInUser: false,
    modals: [],
    filterListMap: {}
  },
  actionsCreators: {

    // Modal
    setLoggedInUser: (state, actions, loggedInUser) => { 
      return { loggedInUser: loggedInUser }
    },
    setModals: (state, actions, modals) => {
      return {modals: modals}
    },
    pushModal: (state, actions, modal) => {
      return {modals: state.modals.concat([modal])}
    },
    popModal: (state, actions) => {
      return {modals: state.modals.slice(0, state.modals.length-1)}
    },
    clearModals: (state, actions) => {
      return {modals: []}
    },

    // Filter
    filterListItems: (state, actions, filterKey, filterList) => {
      const filterListMap = { ...state.filterListMap }
      filterListMap[filterKey] = filterList
      // console.log('state.filterListMap', state.filterListMap)
      return {filterListMap: filterListMap}
    },
  },
}

export const { Provider, connect, actions } = createStore(config)
