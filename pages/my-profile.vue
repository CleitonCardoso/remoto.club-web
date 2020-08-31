<template>
  <v-container>
    <v-layout row wrap>
      <ErrorAlert
        :notification="notification"
        :show="snackbar"
        type="error"
        @hide="snackbar = !snackbar"
      ></ErrorAlert>
      <v-flex class="align-start">
        <v-card class="elevation-12">
          <v-toolbar dark flat>
            <v-toolbar-title>
              <router-link
                to="/"
                style="text-decoration: none; color: inherit;"
              >
                <span class="title ml-3 mr-5 text--darken-4">Meu perfil</span>
              </router-link>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="profile_form">
              <v-text-field
                v-model="appUser.name"
                label="Nome"
                name="name"
                :rules="notEmptyRule"
                type="text"
              ></v-text-field>

              <v-text-field
                v-model="appUser.login.username"
                label="Nome de usuário"
                name="username"
                :rules="notEmptyRule"
                type="text"
              ></v-text-field>

              <v-text-field
                v-model="appUser.login.email"
                label="Email"
                name="email"
                :rules="emailRules"
                type="mail"
              ></v-text-field>
            </v-form>
            <nuxt-link to="/recovery-password">Recuperação de senha</nuxt-link>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark class="mr-3" to="/my-jobs">Cancelar</v-btn>
            <v-btn dark class="mr-3" @click="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" max-width="330">
      <v-card>
        <v-card-title class="headline">Você será desconectado</v-card-title>

        <v-card-text>
          Ao alterar o nome de usuário é necessário realizar novo login.
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn dark class="mr-3" @click="dialog = false">Cancelar</v-btn>
          <v-btn dark class="mr-3 red darken-1" @click="confirmUpdate"
            >Prosseguir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import ErrorAlert from '~/components/ErrorAlert'

export default {
  layout: 'search',
  middleware: 'authenticated',
  components: { ErrorAlert },
  data() {
    return {
      dialog: false,
      oldUsername: null,
      appUser: {
        name: '',
        login: {
          username: '',
          email: '',
        },
      },
      snackbar: false,
      notification: {
        title: '',
        description: '',
        type: '',
      },
      notEmptyRule: [(v) => !!v || 'O campo precisa ser preenchido!'],
      emailRules: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail inválido',
      ],
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.$api
        .get(`private/profile`)
        .then((res) => {
          this.appUser = res.data
          this.oldUsername = res.data.login.username
        })
        .catch((err) => {
          let message = 'Houve um erro inesperado.'
          if (err.response && err.response.status === 400) {
            message = err.response.data.message
          }

          this.notification.title = 'Erro'
          this.notification.description = message
          this.notification.type = 'error'
          this.snackbar = true
        })
    },
    save() {
      const valid = this.$refs.profile_form.validate()
      if (valid) {
        if (this.appUser.login.username !== this.oldUsername) {
          this.dialog = true
        } else {
          this.confirmUpdate()
        }
      } else {
        this.notification.title = 'Erro'
        this.notification.description = 'Verifique os erros no formulário'
        this.notification.type = 'error'
        this.snackbar = true
      }
    },
    confirmUpdate() {
      this.$api
        .post(`private/profile`, this.appUser)
        .then((res) => {
          console.log(res)
          if (this.appUser.login.username !== this.oldUsername) {
            this.$store.commit('removeToken')
            this.$router.push('/login')
          } else {
            this.$router.push('/my-jobs')
          }
        })
        .catch((err) => {
          let message = 'Houve um erro inesperado.'
          if (err.response && err.response.status === 400) {
            message = err.response.data.message
          }

          this.notification.title = 'Erro'
          this.notification.description = message
          this.notification.type = 'error'
          this.snackbar = true
        })
    },
  },
}
</script>
