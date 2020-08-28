const cookieparser = process.server ? require('cookieparser') : undefined
const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => ({
  token: null,
})

export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  removeToken(state) {
    state.token = null
    Cookie.remove('token')
  },
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let token = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      token = parsed.token
    }
    commit('setToken', token)
  },
}

export const getters = {
  isLoggedIn: (state) => {
    return !!state.token
  },
}
