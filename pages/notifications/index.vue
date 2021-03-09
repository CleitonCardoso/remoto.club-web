<template>
  <v-container>
    <client-only>
      <v-layout row wrap>
        <ErrorAlert ref="message-alert" :notification="message"></ErrorAlert>
        <v-flex class="align-start">
          <div v-if="loading" class="text-center ma-5">
            <v-progress-circular
              :size="100"
              :width="10"
              indeterminate
              dark
            ></v-progress-circular>
          </div>

          <v-row v-if="notifications.length === 0">
            <v-col align="center">Nenhuma notificação disponível</v-col>
          </v-row>

          <v-row
            v-for="(notification, index) in notifications"
            :key="`notification-${index}`"
          >
            <v-col>
              <router-link
                :to="notification.urlPath || ''"
                style="text-decoration: none; color: inherit;"
              >
                <v-card dark color="black darken-1" elevation="5">
                  <v-card-title>
                    <strong>{{ notification.title }}</strong>
                  </v-card-title>
                  <v-card-text>
                    {{ notification.description }}
                  </v-card-text>
                </v-card>
              </router-link>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                dark
                color="black darken-1"
                block
                :disabled="notifications.length === resultSize"
                @click="loadMore"
                >Carregar mais</v-btn
              >
            </v-col>
          </v-row>
        </v-flex>
      </v-layout>
    </client-only>
  </v-container>
</template>
<script>
import ErrorAlert from '~/components/ErrorAlert'

export default {
  layout: 'search',
  components: { ErrorAlert },
  data() {
    return {
      pageIndex: 0,
      resultSize: 0,
      loading: true,
      notifications: [],
      snackbar: false,
      message: {
        title: '',
        description: '',
        type: '',
      },
    }
  },
  mounted() {
    this.loadNotifications()
  },
  methods: {
    async loadMore() {
      this.pageIndex++
      await this.loadNotifications()
      window.scrollTo(0, document.body.scrollHeight)
    },
    async loadNotifications() {
      this.loading = true

      const params = { 'page-index': this.pageIndex, 'result-size': 10 }

      await this.$api
        .get(`private/notification`, { params })
        .then((res) => {
          this.loading = false
          this.notifications.push.apply(this.notifications, res.data.content)
          this.resultSize = res.data.totalElements
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
  },
}
</script>
