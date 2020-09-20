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

  api.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error.response.status === 401) {
        store.commit('removeToken')
        store.$router.push('/login')
      } else {
        return Promise.reject(error)
      }
    }
  )

  // api.interceptors.response.use(
  //   (res) => res.data,
  //   function (error) {
  //     // Do something with response error
  //     console.log(redirect)
  //     if (error.response.status === 401) {
  //       redirect('/login')
  //     }
  //     return Promise.reject(error)
  //   }
  // )

  inject('api', api)
}
