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
      <client-only>
        <v-menu
          v-if="$auth.$state.loggedIn"
          rounded
          offset-y
          :nudge-width="100"
          height="100px"
          class="mt-11"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon v-if="!hasUpdates">
                mdi-bullhorn-outline
              </v-icon>
              <v-badge v-if="hasUpdates" color="red" dot>
                <v-icon>
                  mdi-bullhorn
                </v-icon>
              </v-badge>
            </v-btn>
          </template>

          <v-list class="notification-wrapper">
            <v-list-item-group>
              <v-list-item
                v-for="(notification, index) in notifications"
                :key="`notification-${index}`"
                class="elevation-1"
                @click="openNotification(notification)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{
                    notification.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle class="text-wrap">
                    {{ notification.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                class="elevation-1"
                align="center"
                to="/notifications"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <strong>Ver mais</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-wrap">
                    <strong>Clique para ver todas as notificações</strong>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </client-only>

      <v-app-bar-nav-icon
        class="ml-5 mr-1"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <script>
      ;(function (__htas) {
        var d = document,
          s = d.createElement('script'),
          l = d.scripts[d.scripts.length - 1]
        s.settings = __htas || {}
        s.src =
          '\/\/apprefaculty.pro\/aeW_ZAyYQ.2W9\/k\/ZwTS9z6Dbq2J5rlRSoWIQS9XN\/DkE\/2NOdTNkFw\/M\/iX0i0vMpT\/Y\/5WOLTRAvz\/JKnCB\/1vcR2lhda\/be2u5BlFStW-Qu9ENEDJEV2\/O\/TVkTwYM\/iz0G0\/MwTsYq5YOYTDAmzp'
        l.parentNode.insertBefore(s, l)
      })({})
    </script>

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
      <v-container fluid class="grey lighten-4 align-start" fill-height>
        <v-row>
          <client-only>
            <v-col v-show="!isMobile" class="text-center mt-3">
              <iframe
                src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=14&l=ur1&category=kindle&banner=10J9VCHB18FBPQRS0D02&f=ifr&linkID=699a0c679f10d0140a53eab8aa37d4ec&t=cleitoncardos-20&tracking_id=cleitoncardos-20&new_tab=1"
                width="160"
                height="600"
                scrolling="no"
                border="0"
                marginwidth="0"
                style="border: none;"
                frameborder="0"
              ></iframe>
            </v-col>
          </client-only>
          <v-col md="8" xs="12" class="justify-center">
            <nuxt />
          </v-col>
          <client-only>
            <v-col v-show="!isMobile" class="text-center mt-3">
              <iframe
                src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=14&l=ur1&category=software&banner=1DXZZEJ8X4XD42VS1AR2&f=ifr&linkID=504967c303d4a0d61fb9c38362ef327e&t=cleitoncardos-20&tracking_id=cleitoncardos-20"
                width="160"
                height="600"
                scrolling="no"
                border="0"
                marginwidth="0"
                style="border: none;"
                frameborder="0"
              ></iframe>
            </v-col>
          </client-only>
        </v-row>
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Footer from '~/components/Footer'

export default {
  name: 'Search',
  components: { Footer },
  data() {
    return {
      drawer: null,
      items: [],
      isMobile: false,
      hasUpdates: false,
      notifications: [],
    }
  },
  computed: {},
  beforeMount() {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  beforeDestroy() {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  mounted() {
    this.onResize()

    if (this.$auth.loggedIn) {
      if (this.$auth.user.role === 'ADMIN') {
        this.items = [
          {
            icon: 'create',
            text: 'Adicionar uma vaga avulsa',
            to: '/admin-job',
          },
          {
            icon: 'list',
            text: 'Ver vagas avulsas',
            to: '/admin-jobs',
          },
          { divider: true },
          {
            icon: 'mdi-email-edit',
            text: 'Templates de email',
            to: '/mail-templates/all',
          },
          {
            icon: 'mail',
            text: 'Configuração de email',
            to: '/mail-config',
          },
          { icon: 'mdi-account-circle', text: 'Meu perfil', to: '/my-profile' },
          { icon: 'mdi-cog', text: 'Configurações', to: '/configs' },
          { divider: true },
          { icon: 'mdi-logout', text: 'Sair', exit: true },
        ]
      }
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

      this.loadNotifications()

      setInterval(() => {
        this.loadNotifications()
      }, 60000)
    } else {
      this.items = [{ icon: 'mdi-login', text: 'Entrar', to: '/login' }]
    }
  },
  methods: {
    openNotification(notification) {
      this.$router.push(notification.urlPath)
    },
    logout() {
      this.$auth.logout()
      if (this.$route.path === '/') {
        this.$router.go()
      } else {
        this.$router.push('/')
        this.$router.go()
      }
    },
    async loadNotifications() {
      await this.$api
        .get(`private/notification`)
        .then((res) => {
          this.notifications = res.data.content
          this.hasUpdates = this.notifications.some(
            (notification) => notification.read === false
          )
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onResize() {
      this.isMobile = window.innerWidth < 958
    },
  },
}
</script>
<style lang="css">
.notification-wrapper {
  max-width: 300px;
  max-height: 500px;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}
.notification-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
