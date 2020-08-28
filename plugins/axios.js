export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    debugger
    console.log(store.state)
    console.log(store)
    if (store.state.token) {
      config.headers.common.Authorization = `Bearer ${store.state.token}`
    }
  })
}
