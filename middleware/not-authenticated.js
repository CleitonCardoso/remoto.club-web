export default function ({ store, redirect }) {
  debugger
  if (store.$auth.loggedIn) {
    return redirect('/vagas')
  }
}
