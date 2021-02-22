<template>
  <v-main>
    <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col xs="12" sm="6" lg="4">
          <v-card class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>
                <span class="title ml-3 mr-5 text--darken-4"
                  >Remoto.<span class="font-weight-light">Club</span></span
                >
                Nova senha
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="recovery_form">
                <v-text-field
                  v-model="newPassword"
                  label="Nova senha"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="notEmptyRule"
                ></v-text-field>

                <v-text-field
                  label="Confirmação de senha"
                  name="password"
                  prepend-icon="mdi-lock-plus"
                  type="password"
                  :rules="passwordMatchRule"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn dark class="ml-3" to="/login">
                <span>
                  <v-icon>mdi-arrow-left</v-icon>
                  Voltar para o login
                </span>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn dark class="mr-3" @click="performRecovery">Concluir</v-btn>
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
      recoveryHash: '',
      newPassword: '',
      notification: {
        title: '',
        description: '',
        type: '',
      },
      snackbar: false,
      notEmptyRule: [(v) => !!v || 'O campo precisa ser preenchido!'],
      passwordMatchRule: [
        (v) => !v || v === this.newPassword || 'Senhas não correspondem!',
      ],
    }
  },
  mounted() {
    this.recoveryHash = this.$route.query.recoveryHash
  },
  methods: {
    performRecovery() {
      const valid = this.$refs.recovery_form.validate()
      if (valid) {
        this.$api
          .post('/login/perform-recovery/', null, {
            params: {
              recoveryHash: this.recoveryHash,
              newPassword: this.newPassword,
            },
          })
          .then((resp) => {
            this.$router.push('/login')
          })
          .catch((err) => {
            let message = 'Houve um erro inesperado.'
            if (err.response && err.response.status === 400) {
              message = err.response.data.message
            }

            this.notification.title = 'Erro'
            this.notification.description = message
            this.$refs['message-alert'].showAlert()
          })
      } else {
        this.notification.title = 'Erro'
        this.notification.description = 'Verifique os erros no formulário'
        this.notification.type = 'error'
        this.$refs['message-alert'].showAlert()
      }
    },
  },
}
</script>
