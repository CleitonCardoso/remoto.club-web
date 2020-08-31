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
                <span class="title ml-3 mr-5 text--darken-4"
                  >Configurações</span
                >
              </router-link>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="configs_form">
              <v-text-field
                v-model="tenant.companyName"
                label="Nome da empresa"
                name="companyName"
                type="text"
                :rules="notEmptyRule"
              ></v-text-field>
              <v-text-field
                v-model="tenant.phone"
                label="Telefone"
                name="companyName"
                mask="(##) #####-####"
                type="text"
              ></v-text-field>
              <v-text-field
                v-model="tenant.contactEmail"
                label="Email de contato"
                name="contactEmail"
                type="text"
                :rules="emailRules"
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
      tenant: {
        companyName: null,
        phone: null,
        contactEmail: null,
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
        .get(`private/tenant`)
        .then((res) => {
          this.tenant = res.data
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
    },
    save() {
      const valid = this.$refs.configs_form.validate()
      if (valid) {
        this.$api
          .post(`private/tenant`, this.tenant)
          .then((res) => {
            console.log(res)
            this.notification.title = 'Atualizado!'
            this.notification.description = 'Informações salvas com sucesso'
            this.notification.type = 'success'
            this.snackbar = true
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
