<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <ErrorAlert
          ref="message-alert"
          :notification="notification"
        ></ErrorAlert>
        <v-col xs="12" sm="6" lg="4">
          <v-card class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>
                <router-link
                  to="/"
                  style="text-decoration: none; color: inherit;"
                >
                  <span class="title ml-3 mr-5 text--darken-4"
                    >Remoto.<span class="font-weight-light">Club</span></span
                  >
                </router-link>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="login_form">
                <v-text-field
                  v-model="loginData.username"
                  label="Login"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  :rules="notEmptyRule"
                  @keypress.enter="jumpToPassword"
                ></v-text-field>

                <v-text-field
                  id="password"
                  ref="password"
                  v-model="loginData.password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="notEmptyRule"
                  @keypress.enter="login"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <nuxt-link to="/recovery-password" class="ml-3"
                >Esqueci minha senha</nuxt-link
              >
              <v-spacer></v-spacer>
              <v-btn dark to="/register">Criar conta</v-btn>
              <v-btn dark :href="getUrlToLinkedin">
                <v-icon>mdi-linkedin</v-icon></v-btn
              >
              <v-btn dark class="mr-3" @click="login">Entrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import ErrorAlert from '~/components/ErrorAlert'

export default {
  layout: 'clean',
  middleware: 'not-authenticated',
  components: { ErrorAlert },
  data() {
    return {
      redirectUri: process.client
        ? document.location.origin + document.location.pathname
        : undefined,
      loginData: {
        username: '',
        password: '',
      },
      notification: {
        title: '',
        description: '',
      },
      recoverPassEmail: '',
      notEmptyRule: [(v) => !!v || 'O campo precisa ser preenchido!'],
    }
  },
  computed: {
    getUrlToLinkedin() {
      const clientId = '77sps93aqlw7mu'
      const stateValue = '445sd5f45'
      return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${this.redirectUri}&state=${stateValue}&scope=r_liteprofile%20r_emailaddress%20w_member_social`
    },
  },
  mounted() {
    this.linkedInCode = this.$route.query.code
    if (this.linkedInCode) {
      this.loginWithLinkedin()
    }
  },
  methods: {
    login() {
      const valid = this.$refs.login_form.validate()
      if (valid) {
        const username = this.loginData.username
        const password = this.loginData.password
        this.$auth
          .loginWith('local', { data: { username, password } })
          .then((response) => {
            this.$router.push(
              this.$auth.$state.user.role === 'CANDIDATE'
                ? '/vagas'
                : '/my-jobs'
            )
          })
          .catch((e) => {
            let description = 'Servidor indisponível'
            if (e.response) {
              if (e.response.status === 401) {
                description = 'Usuário inválido'
              }
              if (e.response.status === 403) {
                description = 'Senha inválida'
              }
            }
            this.notification.title = 'Erro!'
            this.notification.description = description
            this.$refs['message-alert'].showAlert()
          })
      } else {
        this.notification.title = 'Aviso. As credenciais devem ser informadas'
      }
    },
    loginWithLinkedin() {
      const linkedInCode = this.linkedInCode
      const redirectUri = this.redirectUri
      this.$auth
        .loginWith('local', { data: { linkedInCode, redirectUri } })
        .then((response) => {
          this.$router.push(
            this.$auth.$state.user.role === 'CANDIDATE' ? '/vagas' : '/my-jobs'
          )
        })
        .catch((e) => {
          let description = 'Servidor indisponível'
          if (e.response) {
            if (e.response.status === 401) {
              description = 'Usuário inválido'
            }
            if (e.response.status === 403) {
              description = 'Senha inválida'
            }
          }
          this.notification.title = 'Erro!'
          this.notification.description = description
          this.$refs['message-alert'].showAlert()
        })
    },
    jumpToPassword() {
      this.$refs.password.focus()
    },
    cleanFieldsLogin() {
      this.loginData = { username: '', password: '' }
    },
  },
}
</script>
