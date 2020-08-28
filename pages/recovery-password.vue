<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
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
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                RECUPERAÇÃO DE SENHA
              </v-card-text>
              <v-card-actions>
                <v-btn dark class="ml-3" to="/login">
                  <span>
                    <v-icon>mdi-arrow-left</v-icon>
                    Voltar
                  </span>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn class="mr-3" dark>Recuperar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  layout: 'clean',
  middleware: 'not-authenticated',
  data() {
    return {
      loginData: {
        username: '',
        password: '',
      },
      notification: {
        title: '',
        description: '',
      },
      recoverPassEmail: '',
    }
  },
  methods: {},
}
</script>
