import colors from 'vuetify/es5/util/colors'
let backendHost = ''
const applicationProfile = process.env.NODE_ENV

const axios = require('axios')

switch (applicationProfile) {
  case 'development':
    backendHost = 'http://localhost:8080'
    break
  case 'heroku':
    backendHost = 'https://remoto-club-api.herokuapp.com'
    break
}

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Remoto.Club',
    meta: [
      { charset: 'utf-8' },
      {
        hid: 'viewport',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        property: 'twitter:card',
        content: 'Remoto.Club - Vagas homeOffice para TI',
      },
      { hid: 'twitter:site', name: 'twitter:site', content: '@remoto.club' },
      {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        property: 'twitter:creator',
        content: '@remoto.club',
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        property: 'twitter:image',
        content: 'https://www.remoto.club/landing/12.jpg',
      },
      {
        hid: 'og:image',
        name: 'og:image',
        property: 'og:image',
        content: 'https://www.remoto.club/landing/12.jpg',
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        property: 'og:site_name',
        content: 'Remoto.Club - Vagas homeOffice para TI',
      },
      { hid: 'og:title', name: 'og:title', content: 'Remoto.Club' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: ['material-design-icons-iconfont/dist/material-design-icons.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['@/plugins/api.js', { src: '@/plugins/ga.js', mode: 'client' }],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    [
      'nuxt-compress',
      {
        gzip: {
          cache: true,
        },
        brotli: {
          threshold: 10240,
        },
      },
    ],
  ],
  sitemap: {
    hostname: 'https://remoto.club/',
    routes: async () => {
      const { data } = await axios.get(
        'https://remoto-club-api.herokuapp.com/public/jobs?page-index=1&result-size=140'
      )

      return data.content.map((job) => `/vagas/${job.uuid}`)
    },
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/login', method: 'post', propertyName: 'token' },
          logout: false,
          user: { url: '/private/user', method: 'get', propertyName: false },
        },
        localStorage: true,
        tokenRequired: true,
        tokenType: 'Bearer',
      },
      linkedin: {
        _scheme: 'oauth2',
        client_id: '77sps93aqlw7mu',
        authorization_endpoint:
          'https://www.linkedin.com/oauth/v2/authorization',
        response_type: 'code',
        access_type: 'offline',
        token_key: 'access_token',
        scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
      },
    },
  },
  generate: {
    minify: {
      collapseWhitespace: false,
    },
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: { baseURL: backendHost },
  /*
   ** Content module configuration
   ** See https://content.nuxtjs.org/configuration
   */
  content: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
}
