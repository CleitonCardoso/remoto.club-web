<template>
  <v-snackbar v-model="show" top :color="getNotificationStyle">
    <strong>
      {{ notification.title }}
    </strong>
    <br />
    {{ notification.description }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="$emit('hide')">
        Ok
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  props: {
    notification: Object,
    show: Boolean,
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
}
</script>
