export default function (context) {
  if (context.store.$auth.loggedIn) {
    return context.redirect('/vagas')
  }
}
