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
      <section>
        <v-layout column align-center style="overflow: hidden;">
          <v-flex xs12 md4>
            <v-card class="elevation-0 transparent text-center" dark>
              <v-card-title class="layout justify-center">
                <div style="height: 50%; margin-top: 15%;">
                  <span style="text-shadow: 3px 2px #000000; font-size: 7rem;">
                    Remoto.<span class="font-weight-light">Club</span>
                  </span>
                </div>
              </v-card-title>
              <v-card-text style="text-center">
                <span
                  class="text-h5 white--text font-weight-bold"
                  style="text-shadow: 1.5px 1px #000000;"
                >
                  O seu site de classificados de vagas HomeOffice para TI.
                  Simples e direto.
                </span>
                <br />
                <br />
                <v-row>
                  <v-col>
                    <v-btn dark large block to="/vagas">
                      Procuro um emprego
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn dark large block to="/login">
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
        <v-container grid-list-xl>
          <v-layout justify-center row wrap class="my-5">
            <v-flex xs12 md4>
              <v-card
                class="elevation-0 text-center"
                style="background-color: rgba(0, 0, 0, 0.8);"
                dark
              >
                <v-card-title primary-title class="layout">
                  <v-flex class="text-center">
                    <v-label>
                      <v-icon style="font-size: 8vh;">device_hub</v-icon>
                    </v-label>

                    <div style="font-size: 3vh;">
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
            </v-flex>
            <v-flex xs12 md4>
              <v-card
                class="elevation-0"
                style="background-color: rgba(0, 0, 0, 0.8);"
                dark
              >
                <v-card-title primary-title class="layout text-center">
                  <v-flex class="text-center">
                    <v-label>
                      <v-icon style="font-size: 8vh;">house</v-icon>
                    </v-label>
                    <div style="font-size: 3vh;">
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
            </v-flex>
            <v-flex xs12 md4>
              <v-card
                class="elevation-0"
                style="background-color: rgba(0, 0, 0, 0.8);"
                dark
              >
                <v-card-title primary-title class="layout text-center">
                  <v-flex class="text-center">
                    <v-label>
                      <v-icon style="font-size: 8vh;">money_off</v-icon>
                    </v-label>
                    <div style="font-size: 3vh;">Gratuito!</div>
                  </v-flex>
                </v-card-title>
                <v-card-text class="text-center">
                  Pra quem anuncia uma
                  <strong>oportunidade fantástica</strong> e pra quem procura
                  uma <strong>vaga certeira</strong>.
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
import Footer from '~/components/Footer'

export default {
  layout: 'clean',
  components: {
    Footer,
  },
  data() {
    return {
      number: 4,
      title: 'Endorfine',
      imageLink: {
        main: '/landing/2.jpg',
        sub_main: '/landing/3.jpg',
        logo: '/landing/1.jpg',
        social_cover: '/landing/1.jpg',
      },
      email: '',
      emailRules: [
        (v) => {
          return !!v || 'E-mail is required'
        },
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail must be valid',
      ],
      subscribed: false,
    }
  },
  computed: {},
  mounted() {
    debugger
    console.log(this.$vuetify.breakpoint)
  },
  methods: {
    subscribe() {
      this.subscribed = !this.subscribed
    },
  },
}
</script>

<style>
body {
  word-break: keep-all;
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
