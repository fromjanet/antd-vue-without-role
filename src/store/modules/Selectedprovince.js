const state = {
  Selectedprovince: ''
}
const getters = {
  province: ({ Selectedprovince }) => Selectedprovince
}
const mutations = {
  UPDATE_PROVINCE (state, { Selectedprovince }) {
    state.Selectedprovince = Selectedprovince
  }
}

const Selectedprovince = {
  state,
  getters,
  mutations
}
export default Selectedprovince
