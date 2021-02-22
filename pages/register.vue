<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <ErrorAlert
          ref="message-alert"
          :notification="notification"
        ></ErrorAlert>
        <v-col
          v-if="registrationType === 'NORMAL' || true"
          xs="12"
          sm="6"
          lg="4"
        >
          <v-card v-if="!showConfirmCard" class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>
                <span class="title ml-3 mr-5 text--darken-4"
                  >Remoto.<span class="font-weight-light">Club</span></span
                >
                <span>
                  Cadastro<span v-if="registrationType"
                    >: {{ getRegistrationTypeLabel }}</span
                  >
                </span>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <div v-if="!(linkedInCode || loginAndPasswordRegistration)">
                <v-btn
                  v-if="!linkedInCode"
                  dark
                  :href="getUrlToLinkedin"
                  block
                  class="mt-4 mb-4"
                >
                  <span>
                    <v-icon>mdi-linkedin</v-icon>
                    Registrar com o LinkedIn
                  </span>
                </v-btn>

                <h3 v-if="!linkedInCode" class="text-center">ou</h3>

                <v-btn
                  v-if="!linkedInCode"
                  dark
                  block
                  class="mt-4 mb-4"
                  @click="loginAndPasswordRegistration = true"
                >
                  <span>
                    Login e senha
                  </span>
                </v-btn>
              </div>
              <div
                v-if="
                  (linkedInCode || loginAndPasswordRegistration) &&
                  !registrationType
                "
              >
                <v-col>
                  <v-btn
                    x-large
                    class="mr-3"
                    dark
                    block
                    @click="registrationType = 'COMPANY'"
                    >Recrutador</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn
                    x-large
                    class="mr-3"
                    dark
                    block
                    @click="registrationType = 'CANDIDATE'"
                    >Candidato</v-btn
                  >
                </v-col>
              </div>

              <v-form
                v-if="
                  (linkedInCode || loginAndPasswordRegistration) &&
                  registrationType
                "
                ref="register_form"
              >
                <v-text-field
                  v-model="login.username"
                  label="Login"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  :rules="notEmptyRule"
                ></v-text-field>

                <v-text-field
                  v-if="loginAndPasswordRegistration"
                  v-model="login.password"
                  label="Senha"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="notEmptyRule"
                ></v-text-field>

                <v-text-field
                  v-if="loginAndPasswordRegistration"
                  label="Confirmação de senha"
                  name="password"
                  prepend-icon="mdi-lock-plus"
                  type="password"
                  :rules="passwordMatchRule"
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
                  v-if="registrationType === 'COMPANY'"
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
              <v-btn
                class="mr-3"
                :dark="
                  registrationType &&
                  $refs.register_form &&
                  $refs.register_form.validate()
                "
                :disabled="
                  !(
                    registrationType &&
                    $refs.register_form &&
                    $refs.register_form.validate()
                  )
                "
                @click="create"
                >Concluir</v-btn
              >
            </v-card-actions>
          </v-card>
          <v-card v-if="showConfirmCard" class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>
                <span class="title ml-3 mr-5 text--darken-4"
                  >Remoto.<span class="font-weight-light">Club</span></span
                >
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span class="title text--darken-4">
                Sua conta foi criada, você deve receber em alguns instantes um
                email de confirmação.
              </span>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn to="/login" class="mr-3" dark>
                Login
              </v-btn>
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
      registrationType: null,
      loginAndPasswordRegistration: false,
      login: {
        username: '',
        password: '',
        email: '',
        tenant: { companyName: '' },
      },
      linkedInCode: null,
      notification: {
        title: '',
        description: '',
        type: '',
      },
      notEmptyRule: [(v) => !!v || 'O campo precisa ser preenchido!'],
      passwordMatchRule: [
        (v) => !v || v === this.login.password || 'Senhas não correspondem!',
      ],
      emailRules: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail inválido',
      ],
      showConfirmCard: false,
    }
  },
  computed: {
    getUrlToLinkedin() {
      const clientId = '77sps93aqlw7mu'
      const redirectUri = this.redirectUri
      const stateValue = '445sd5f45'
      return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${stateValue}&scope=r_liteprofile%20r_emailaddress%20w_member_social`
    },
    getRegistrationTypeLabel() {
      switch (this.registrationType) {
        case 'COMPANY':
          return 'Recrutador'
        case 'CANDIDATE':
          return 'Cadidato'
      }
      return null
    },
  },
  mounted() {
    this.linkedInCode = this.$route.query.code
    this.partnerCode = this.$route.query.partnerCode
  },
  methods: {
    create() {
      const valid = this.$refs.register_form.validate()
      if (valid) {
        let createPath = '/login/create'
        if (this.linkedInCode) {
          createPath +=
            '?linkedInCode=' +
            this.linkedInCode +
            '&redirectUri=' +
            this.redirectUri +
            '&partnerCode=' +
            this.partnerCode
        } else if (this.partnerCode) {
          createPath += '?partnerCode=' + this.partnerCode
        }

        this.login.role = this.registrationType

        if (this.registrationType === 'CANDIDATE') {
          this.login.tenant = null
        }

        this.$api
          .post(createPath, this.login)
          .then((resp) => {
            this.showConfirmCard = true
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
