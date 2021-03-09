<template>
  <v-main>
    <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col xs="12" sm="6" lg="4">
          <v-card class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>
                <router-link
                  to="/vagas"
                  style="text-decoration: none; color: inherit;"
                >
                  <span class="title ml-3 mr-5 text--darken-4"
                    >Remoto.<span class="font-weight-light">Club</span></span
                  >
                </router-link>
                Recuperação de senha
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              Você receberá um email para resetar a senha.
              <v-form>
                <v-text-field
                  v-model="email"
                  label="Email"
                  name="login"
                  type="text"
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
              <v-btn class="mr-3" dark @click="send">Enviar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  layout: 'clean',
  data() {
    return {
      email: '',
      notification: {
        title: '',
        description: '',
        type: '',
      },
      snackbar: false,
    }
  },
  methods: {
    send() {
      this.$api
        .post('/login/recovery', null, { params: { email: this.email } })
        .then((resp) => {
          this.notification.title = 'Enviado'
          this.notification.description =
            'Verifique sua caixa de email e spam em alguns minutos'
          this.notification.type = 'success'
          this.$refs['message-alert'].showAlert()
        })
        .catch((err) => {
          let message = 'Houve um erro inesperado.'
          if (err.response && err.response.status === 400) {
            message = err.response.data.message
          }

          this.notification.title = 'Erro'
          this.notification.type = 'error'
          this.notification.description = message
          this.$refs['message-alert'].showAlert()
        })
    },
  },
}
</script>
