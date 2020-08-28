import Qs from 'qs'

export default function ({ $axios, store }, inject) {
  const api = $axios.create({
    timeout: 100000,
    paramsSerializer(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })

  api.onRequest((config) => {
    if (store.state.token) {
      config.headers.common.Authorization = `Bearer ${store.state.token}`
    }
  })

  inject('api', api)
}
