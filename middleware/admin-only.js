export default function (context) {
  if (context.store.$auth.user.role !== 'ADMIN') {
    return context.redirect('/vagas')
  }
}
