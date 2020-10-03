import Qs from 'qs'

export default function ({ $axios, store }, inject) {
  const api = $axios.create({
    timeout: 100000,
    paramsSerializer(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })

  api.onRequest((config) => {
    if (store.$auth.loggedIn) {
      config.headers.common.Authorization = `${store.$auth.getToken('local')}`
    }
  })

  api.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        store.commit('removeToken')
        store.$router.push('/login')
      }
      return Promise.reject(error)
    }
  )

  inject('api', api)
}
