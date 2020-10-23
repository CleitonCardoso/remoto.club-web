<template>
  <v-stepper v-model="e1">
    <v-stepper-header v-if="candidature" dark>
      <v-stepper-step step="1" complete>
        Você se aplicou
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="
          ['ACCEPTED', 'OFFERED', 'HIRED'].includes(candidature.status)
        "
        step="2"
      >
        A empresa quer te conhecer
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="['OFFERED', 'HIRED'].includes(candidature.status)"
        step="3"
      >
        Você recebeu uma oferta
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="candidature.status === 'HIRED'" step="4">
        Contratado!
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card height="200px">
          teste
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn @click="e1 = 3">
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="primary" @click="e1 = 1">
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  layout: 'search',
  middleware: 'auth',
  data() {
    return {
      e1: 1,
      candidature: null,
    }
  },

  mounted() {
    const jobUuid = this.$route.params.uuid
    this.$api
      .get(`private/my-applications/` + jobUuid)
      .then((res) => {
        this.candidature = res.data
      })
      .catch((err) => {
        let message = 'Houve um erro inesperado.'
        if (err.response && err.response.status === 400) {
          message = err.response.data.message
        }

        this.notification.title = 'Erro'
        this.notification.description = message
        this.notification.type = 'error'
        this.$refs['message-alert'].showAlert()
      })
  },
}
</script>
