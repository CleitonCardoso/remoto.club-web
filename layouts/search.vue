<template>
  <v-app id="keep">
    <v-app-bar app dark clipped-right color="black lighten-2">
      <router-link to="/vagas" style="text-decoration: none; color: inherit;">
        <span class="title ml-3 mr-5 text--darken-4">
          Remoto.
          <span class="font-weight-light">Club</span>
        </span>
      </router-link>
      <v-text-field
        v-if="false"
        solo-inverted
        flat
        hide-details
        label="Ex: Desenvolvedor springboot + vuejs"
        prepend-inner-icon="search"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon
        class="ml-5 mr-1"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-if="drawer"
      v-model="drawer"
      app
      color="black "
      clipped
      disable-resize-watcher
      dark
      right
    >
      <v-list dense class="black">
        <template v-for="(item, i) in items">
          <v-row v-if="item.heading" :key="i" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-btn small text>edit</v-btn>
            </v-col>
          </v-row>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-4"
          ></v-divider>
          <v-list-item v-else-if="item.exit" :key="i" @click="logout">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else :key="i" :to="item.to" router exact>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="grey lighten-4 fill-height align-start">
        <v-row>
          <v-col v-if="!isMobile" md="2">
            <!-- Ad -->
          </v-col>
          <v-col md="8" xs="12">
            <nuxt />
          </v-col>
          <v-col v-if="!isMobile" md="2">
            <!-- Ad -->
          </v-col>
        </v-row>
      </v-container>
      <Footer></Footer>
    </v-main>
  </v-app>
</template>

<script>
import Footer from '~/components/Footer'

export default {
  name: 'Search',
  components: { Footer },
  data: () => ({
    drawer: null,
    items: [],
    isMobile: false,
  }),
  computed: {},

  beforeDestroy() {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })

    if (this.$auth.loggedIn) {
      if (this.$auth.user.role === 'COMPANY') {
        this.items = [
          { icon: 'create', text: 'Adicionar uma vaga', to: '/job' },
          { icon: 'list', text: 'Ver minhas vagas', to: '/my-jobs' },
          { divider: true },
          { icon: 'mdi-account-circle', text: 'Meu perfil', to: '/my-profile' },
          { icon: 'mdi-cog', text: 'Configurações', to: '/configs' },
          { icon: 'mdi-lightbulb-on', text: 'Sugestões', to: '/sac' },
          { divider: true },
          { icon: 'mdi-logout', text: 'Sair', exit: true },
        ]
      }
      if (this.$auth.user.role === 'CANDIDATE') {
        this.items = [
          {
            icon: 'list',
            text: 'Ver minhas aplicações',
            to: '/my-applications',
          },
          { divider: true },
          { icon: 'mdi-account-circle', text: 'Meu perfil', to: '/my-profile' },
          { icon: 'mdi-lightbulb-on', text: 'Sugestões', to: '/sac' },
          { divider: true },
          { icon: 'mdi-logout', text: 'Sair', exit: true },
        ]
      }
    } else {
      this.items = [{ icon: 'mdi-login', text: 'Entrar', to: '/login' }]
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
      if (this.$route.path === '/') {
        this.$router.go()
      } else {
        this.$router.push('/')
        this.$router.go()
      }
    },
    onResize() {
      this.isMobile = window.innerWidth < 600
    },
  },
}
</script>
