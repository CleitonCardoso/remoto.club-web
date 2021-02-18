<template>
  <v-container>
    <v-layout row wrap>
      <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
      <v-flex class="align-start">
        <v-card class="elevation-12">
          <v-toolbar dark flat>
            <v-toolbar-title>
              <span class="title ml-3 mr-5 text--darken-4"
                >Configuração de servidor de email</span
              >
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <h3>
              Evitar alterar essas configurações em horário comercial, pois ao
              salvar o servidor será reiniciado.
            </h3>
            <br />
            <v-form ref="configs_form">
              <v-text-field
                v-model="mailConfiguration.principalMail"
                label="Email de remetente"
                name="principalMail"
                type="text"
                :rules="emailRules"
              ></v-text-field>

              <v-text-field
                v-model="mailConfiguration.smtpHost"
                label="Host SMTP"
                name="smtpHost"
                type="text"
                :rules="notEmptyRule"
              ></v-text-field>

              <v-text-field
                v-model="mailConfiguration.smtpPort"
                label="Porta SMTP"
                name="smtpPort"
                type="number"
                :rules="notEmptyRule"
              ></v-text-field>

              <v-text-field
                v-model="mailConfiguration.smtpUsername"
                label="Usuário SMTP"
                name="smtpUsername"
                type="text"
                :rules="notEmptyRule"
              ></v-text-field>

              <v-text-field
                v-model="mailConfiguration.smtpPassword"
                label="Senha SMTP"
                name="smtpPassword"
                type="password"
                :rules="notEmptyRule"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark class="mr-3" to="/admin-jobs">Cancelar</v-btn>
            <v-btn dark class="mr-3" @click="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import ErrorAlert from '~/components/ErrorAlert'

export default {
  layout: 'search',
  middleware: ['auth', 'admin-only'],
  components: { ErrorAlert },
  data() {
    return {
      mailConfiguration: {
        principalMail: null,
        smtpHost: null,
        smtpPort: null,
        smtpUsername: null,
        smtpPassword: null,
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
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,20})+$/.test(v) ||
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
        .get(`private/admin/mail-config`)
        .then((res) => {
          this.mailConfiguration = res.data
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
    },
    save() {
      const valid = this.$refs.configs_form.validate()
      if (valid) {
        this.$api
          .post(`private/admin/mail-config`, this.mailConfiguration)
          .then((res) => {
            this.notification.title = 'Atualizado!'
            this.notification.description =
              'Informações salvas com sucesso, o servidor irá reiniciar em alguns minutos'
            this.notification.type = 'success'
            this.$refs['message-alert'].showAlert()
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
