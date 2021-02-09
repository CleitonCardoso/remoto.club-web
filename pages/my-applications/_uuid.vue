<template>
  <v-flex class="align-start">
    <v-card dark color="black darken-1">
      <v-card-title>
        <div>
          <div>
            <strong>
              {{ job.title }} -
              {{ job.contractType }}
            </strong>
          </div>
          {{ job.company }}
          <span v-if="job.officeLocation"> | {{ job.officeLocation }}</span>
        </div>
        <v-spacer></v-spacer>
        <div>
          <div>
            Nível:
            {{ job.experienceRequired }}
          </div>
          <strong>
            {{
              format(job.salary) + '/' + getCompensationTypeLabel(job)
            }}</strong
          >
        </div>
      </v-card-title>

      <v-card-text>
        <div class="my-4">
          <p style="white-space: pre-wrap;">
            {{ job.description }}
          </p>
        </div>
      </v-card-text>
    </v-card>
    <v-stepper v-model="e1">
      <v-stepper-header v-if="application" dark>
        <v-stepper-step step="1" complete>
          Você se aplicou
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          :complete="
            ['ACCEPTED', 'OFFERED', 'HIRED'].includes(application.status)
          "
          step="2"
        >
          A empresa quer te conhecer
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          :complete="['OFFERED', 'HIRED'].includes(application.status)"
          step="3"
        >
          Você recebeu uma oferta
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="application.status === 'HIRED'" step="4">
          Contratado!
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card height="200px"> </v-card>
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
  </v-flex>
</template>
<script>
const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2,
  unitDisplay: 'short',
})
export default {
  layout: 'search',
  middleware: 'auth',
  data() {
    return {
      e1: 1,
      candidature: null,

      application: [],
      job: {
        company: '',
        compensationType: '',
        contractType: '',
        createdDate: '',
        description: '',
        experienceRequired: '',
        jobStatus: '',
        lastUpdate: '',
        officeLocation: '',
        salary: '',
        title: '',
        uuid: '',
      },
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    format(value) {
      return brlFormatter.format(value)
    },
    getCompensationTypeLabel(job) {
      if (job.compensationType) {
        switch (job.compensationType) {
          case 'PER_HOUR':
            return 'hora'
          case 'PER_MONTH':
            return 'mês'
          case 'PER_YEAR':
            return 'ano'
        }
      } else {
        if (job.salary >= 0 && job.salary < 600) {
          return 'hora'
        }
        if (job.salary >= 600 && job.salary < 30000) {
          return 'mês'
        }
        if (job.salary >= 30000) {
          return 'ano'
        }
      }
    },
    load() {
      const jobUuid = this.$route.params.uuid
      this.$api
        .get(`private/my-applications/` + jobUuid)
        .then((res) => {
          this.application = res.data
          this.job = res.data.job
          console.log(this.application)
          console.log(this.job)
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
  },
  getCompensationTypeLabel(job) {
    if (job.compensationType) {
      switch (job.compensationType) {
        case 'PER_HOUR':
          return 'hora'
        case 'PER_MONTH':
          return 'mês'
        case 'PER_YEAR':
          return 'ano'
      }
    } else {
      if (job.salary >= 0 && job.salary < 600) {
        return 'hora'
      }
      if (job.salary >= 600 && job.salary < 30000) {
        return 'mês'
      }
      if (job.salary >= 30000) {
        return 'ano'
      }
    }
  },
}
</script>
