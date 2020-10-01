<template>
  <v-container>
    <v-layout row wrap>
      <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
      <v-flex class="align-start">
        <v-card class="elevation-12">
          <v-toolbar dark flat>
            <v-toolbar-title>
              <router-link
                to="/"
                style="text-decoration: none; color: inherit;"
              >
                <span class="title ml-3 mr-5 text--darken-4">Sugestões</span>
              </router-link>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="sac_form">
              <v-text-field
                v-model="sac.title"
                label="titulo"
                name="title"
                type="text"
                :rules="notEmptyRule"
              ></v-text-field>

              <v-text-field
                v-model="sac.text"
                label="sugestao"
                name="text"
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark class="mr-3" to="/my-jobs">Cancelar</v-btn>
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
  middleware: 'authenticated',
  components: { ErrorAlert },
  data() {
    return {
      sac: {
        title: null,
        text: null,
      },
      snackbar: false,
      notification: {
        title: '',
        description: '',
        type: '',
      },
      notEmptyRule: [(v) => !!v || 'O campo precisa ser preenchido!'],
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.$api
        .get(`private/sac`)
        .then((res) => {
          this.sac = res.data
        })
        .catch((err) => {
          let message = 'Houve um erro inesperado.'
          console.log('error')
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
          .post(`private/sac`, this.sac)
          .then((res) => {
            console.log(res)
            this.notification.title = 'Atualizado!'
            this.notification.description = 'Informações salvas com sucesso'
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
