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
                  Cadastro
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="login.username"
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="login.password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>

                  <v-text-field
                    v-model="login.email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-mail"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="login.tenant.companyName"
                    label="Nome da empresa"
                    name="companyName"
                    prepend-icon="mdi-briefcase"
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
                <v-btn class="mr-3" dark @click="create">Criar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  layout: 'clean',
  data() {
    return {
      login: {
        username: '',
        password: '',
        email: '',
        tenant: { companyName: '' },
      },
      notification: {
        title: '',
        description: '',
      },
    }
  },
  methods: {
    create() {
      this.$api
        .post('/login/create', this.login)
        .then((resp) => {
          console.log(resp)
          this.$router.push('/login')
        })
        .catch((err) => {
          this.notification.title = 'Erro. Verifique as suas credenciais'
          console.log(err)
        })
    },
  },
}
</script>
