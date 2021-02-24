<template>
  <v-main>
    <div class="back"></div>
    <v-container fluid pa-0>
      <section class="mb-10">
        <v-layout column align-center style="overflow: hidden;">
          <v-flex xs12 md4>
            <v-card class="elevation-0 transparent text-center" dark>
              <v-card-title class="layout justify-center">
                <div style="height: 50%; margin-top: 15%;">
                  <span style="text-shadow: 3px 2px #000000; font-size: 10vw;">
                    Remoto.<span class="font-weight-light">Club</span>
                  </span>
                </div>
              </v-card-title>
              <v-card-text style="text-center">
                <span
                  class="white--text font-weight-bold"
                  style="text-shadow: 1.5px 1px #000000; font-size: 200%;"
                >
                  O seu site de classificados de vagas HomeOffice para TI.
                  Simples e direto.
                </span>
                <br />
                <br />
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </section>
      <section id="contato" style="margin-top: 30px;">
        <v-container grid-list-xl>
          <v-layout justify-center row wrap class="my-5">
            <v-flex xs12 md6>
              <v-card
                class="elevation-0 text-center"
                style="background-color: rgba(0, 0, 0, 0.8);"
                dark
              >
                <v-card-title primary-title class="layout">
                  <v-flex class="text-center">
                    <div>
                      <div v-if="loading" class="text-center ma-5">
                        <v-progress-circular
                          :size="100"
                          :width="10"
                          indeterminate
                          dark
                        ></v-progress-circular>
                      </div>
                      <div v-if="!loading" class="text-center ma-5">
                        <v-icon
                          v-if="!isSuccess"
                          style="font-size: 8vh;"
                          class="red--text"
                        >
                          error
                        </v-icon>
                        <v-icon
                          v-if="isSuccess"
                          style="font-size: 8vh;"
                          class="green--text"
                        >
                          check
                        </v-icon>
                        <br />
                        {{ notification.description }}
                      </div>
                    </div>
                  </v-flex>
                </v-card-title>
                <v-card-text>
                  <v-btn
                    light
                    class="mr-3"
                    block
                    to="/login"
                    :disabled="!isSuccess"
                    >Fazer login e concluir o cadastro</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>
    </v-container>
    <Footer></Footer>
  </v-main>
</template>

<script>
export default {
  layout: 'clean',
  data() {
    return {
      notification: {
        title: '',
        description: '',
        type: '',
      },
      loading: true,
      isSuccess: false,
    }
  },
  mounted() {
    const loginUuid = this.$route.params.uuid
    this.$api
      .post(`/login/confirm/` + loginUuid)
      .then((res) => {
        this.notification.title = 'Sucesso'
        this.notification.description = 'Cadastro ativo com sucesso!'
        this.notification.type = 'success'
        this.loading = false
        this.isSuccess = true
      })
      .catch((err) => {
        let message = 'Houve um erro inesperado.'
        if (err.response && err.response.status === 400) {
          message = err.response.data.message
        }

        this.notification.title = 'Erro'
        this.notification.description = message
        this.notification.type = 'error'
        this.loading = false
        this.isSuccess = false
      })
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

<style>
body {
  word-break: keep-all;
}

.contact-link {
  text-decoration: none;
  color: #ffffff !important;
}

.contact-link:hover {
  cursor: pointer !important;
}

.back {
  position: fixed;
  display: block;
  left: 0;
  right: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-image: url('/landing/4.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}
.finedTitle {
  font-weight: 900;
  text-shadow: 2px 2px #000000;
}

.social-icon {
  font-size: 21px;
  color: white;
}
</style>
