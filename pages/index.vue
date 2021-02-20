<template>
  <v-main>
    <div class="back"></div>
    <v-container fluid pa-0>
      <!-- <img
        :src="'/landing/' + number + '.jpg'"
        style="
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          filter: blur(10px);
          -webkit-filter: blur(10px);
          transform: scale(1.1);
        "
      /> -->
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
                <v-row>
                  <v-col>
                    <v-btn light large block to="/vagas">
                      Procuro um emprego
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn light large block to="/login">
                      Procuro um profissional
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </section>
      <section>
        <v-container fluid class="align-start flex-column" fill-height>
          <v-row>
            <v-col>
              <v-card
                height="100%"
                class="elevation-0 text-center justify-center mx-5"
                style="background-color: rgba(0, 0, 0, 0.8);"
                dark
              >
                <v-card-title primary-title class="layout">
                  <v-flex class="text-center">
                    <v-label>
                      <v-icon style="font-size: 8vh;">device_hub</v-icon>
                    </v-label>

                    <div style="font-size: 3vh; word-break: break-word;">
                      Um novo hub de profissionais de TI
                    </div>
                  </v-flex>
                </v-card-title>
                <v-card-text>
                  Profissionais de diferentes especialidades, habilidades e
                  expectativas de vida em busca de
                  <strong>boas oportunidades de trabalho</strong>.
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card
                height="100%"
                class="elevation-0 text-center justify-center mx-5"
                style="background-color: rgba(0, 0, 0, 0.8);"
                dark
              >
                <v-card-title primary-title class="layout text-center">
                  <v-flex class="text-center">
                    <v-label>
                      <v-icon style="font-size: 8vh;">house</v-icon>
                    </v-label>
                    <div style="font-size: 3vh; word-break: break-word;">
                      Uma nova forma de trabalhar
                    </div>
                  </v-flex>
                </v-card-title>
                <v-card-text class="text-center">
                  A pandemia mundial mostrou para o mundo que
                  <strong>o nosso lar</strong> pode sim ser
                  <strong>o melhor escritório que poderíamos ter</strong> e
                  ainda trazer <strong>aumento na produtividade</strong>.
                  Levantamos a bandeira do
                  <strong>HomeOffice, ou trabalho remoto</strong> e focamos
                  apenas em vagas dessa natureza.
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card
                height="100%"
                class="elevation-0 text-center justify-center mx-5"
                style="background-color: rgba(0, 0, 0, 0.8);"
                dark
              >
                <v-card-title primary-title class="layout text-center">
                  <v-flex class="text-center">
                    <v-label>
                      <v-icon style="font-size: 8vh;">money_off</v-icon>
                    </v-label>
                    <div style="font-size: 3vh; word-break: break-word;">
                      Gratuito!
                    </div>
                  </v-flex>
                </v-card-title>
                <v-card-text class="text-center">
                  Pra quem anuncia uma
                  <strong>oportunidade fantástica</strong> e pra quem procura
                  uma <strong>vaga certeira</strong>.
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>
      <section id="contato" style="margin-top: 10vh;">
        <v-container fluid class="flex-column" fill-height>
          <v-card
            class="elevation-0"
            width="50%"
            style="background-color: rgba(0, 0, 0, 0.8);"
            dark
          >
            <v-card-title
              class="align-center justify-center"
              style="padding-bottom: 10%;"
            >
              <div style="font-size: 3vh;">
                <a class="contact-link" href="#contato">
                  Entre em contato pelo WhatsApp!
                </a>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-text>
              <v-text-field
                v-model="contact.subject"
                label="Motivo do contato"
              ></v-text-field>
              <v-textarea
                v-model="contact.details"
                label="Conte-nos mais..."
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn light block @click="sendPostToWhatsapp"
                >Iniciar conversa</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
      </section>
    </v-container>
    <Footer></Footer>
  </v-main>
</template>

<script>
import Footer from '~/components/Footer'

export default {
  layout: 'clean',
  components: {
    Footer,
  },
  data() {
    return {
      contact: {
        subject: '',
        details: '',
      },
    }
  },
  mounted() {},
  methods: {
    sendPostToWhatsapp() {
      const moderator = '47996590190'
      const p1 = 'Motivo: ' + this.contact.subject + '\n'
      const p2 = ' | Conteúdo: ' + this.contact.details + '\n'

      const url =
        'https://api.whatsapp.com/send?phone=+55' +
        moderator +
        '&text=' +
        p1 +
        p2
      window.open(url, '_blank')
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
#inspire {
  background: none;
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
