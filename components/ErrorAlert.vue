<template>
  <v-snackbar
    v-model="show"
    top
    :color="getNotificationStyle"
    @hide="show = !show"
  >
    <strong>
      {{ notification.title }}
    </strong>
    <br />
    <p style="white-space: pre-wrap;">{{ notification.description }}</p>
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="hideAlert">
        Ok
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  props: {
    notification: Object,
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    getNotificationStyle() {
      switch (this.notification.type) {
        case 'success':
          return 'green darken-4'
        case 'error':
          return 'red darken-4'
        case 'alert':
          return 'yellow darken-4'
        default:
          return 'red darken-4'
      }
    },
  },
  methods: {
    showAlert() {
      this.show = true
    },
    hideAlert() {
      this.show = false
    },
  },
}
</script>
