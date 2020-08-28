<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
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
              <v-form>
                <v-text-field
                  v-model="loginData.username"
                  label="Login"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                ></v-text-field>

                <v-text-field
                  id="password"
                  v-model="loginData.password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <nuxt-link to="/recovery-password" class="ml-3"
                >Esqueci minha senha</nuxt-link
              >
              <v-spacer></v-spacer>
              <v-btn dark to="/register">Criar conta</v-btn>
              <v-btn dark class="mr-3" @click="this.login">Entrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  layout: 'clean',
  middleware: 'not-authenticated',
  props: {
    source: String,
  },
  data() {
    return {
      loginData: {
        username: '',
        password: '',
      },
      notification: {
        title: '',
        description: '',
      },
      recoverPassEmail: '',
    }
  },
  methods: {
    login() {
      const username = this.loginData.username
      const password = this.loginData.password
      if (username && password) {
        this.$api
          .post('/login', { username, password })
          .then((resp) => {
            const token = resp.data.token
            this.$store.commit('setToken', token)
            Cookie.set('token', token)
            this.notification.title = 'Acesso realizado com sucesso'
            this.$router.push('/')
          })
          .catch((err) => {
            this.notification.title = 'Erro. Verifique as suas credenciais'
            this.cleanFieldsLogin()
            console.log(err)
          })
      } else {
        this.notification.title = 'Aviso. As credenciais devem ser informadas'
      }
    },
    cleanFieldsLogin() {
      this.loginData = { username: '', password: '' }
    },
  },
}
</script>
