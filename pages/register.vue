<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <ErrorAlert
          :notification="notification"
          :show.sync="snackbar"
          type="error"
          @hide="snackbar = !snackbar"
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
                Cadastro
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="register_form">
                <v-text-field
                  v-model="login.username"
                  label="Login"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  :rules="notEmptyRule"
                ></v-text-field>

                <v-text-field
                  v-model="login.password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="notEmptyRule"
                ></v-text-field>

                <v-text-field
                  v-model="login.email"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-mail"
                  type="mail"
                  :rules="emailRules"
                ></v-text-field>

                <v-text-field
                  v-model="login.tenant.companyName"
                  label="Nome da empresa"
                  name="companyName"
                  prepend-icon="mdi-briefcase"
                  type="text"
                  :rules="notEmptyRule"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn dark class="ml-3" to="/login">
                <span>
                  <v-icon>mdi-arrow-left</v-icon>
                  Voltar
                </span>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mr-3" dark @click="create">Criar</v-btn>
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
      login: {
        username: '',
        password: '',
        email: '',
        tenant: { companyName: '' },
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
  methods: {
    create() {
      const valid = this.$refs.register_form.validate()
      if (valid) {
        this.$api
          .post('/login/create', this.login)
          .then((resp) => {
            console.log(resp)
            this.$router.push('/login')
          })
          .catch((err) => {
            let message = 'Houve um erro inesperado.'
            if (err.response && err.response.status === 400) {
              message = err.response.data.message
            }

            this.notification.title = 'Erro'
            this.notification.description = message
            this.snackbar = true
          })
      } else {
        this.notification.title = 'Erro'
        this.notification.description = 'Verifique os erros no formulário'
        this.notification.type = 'error'
        this.snackbar = true
      }
    },
  },
}
</script>
