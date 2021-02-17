<template>
  <v-container>
    <v-layout row wrap>
      <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
      <v-flex class="align-start">
        <v-expansion-panels
          v-model="panel"
          multiple
          dark
          color="black darken-1"
        >
          <v-expansion-panel>
            <v-expansion-panel-header hide-actions dark color="black darken-1">
              <v-combobox
                v-model="filter.keyWords"
                chips
                clearable
                hide-details
                label="Pesquise por palavras chave"
                prepend-inner-icon="search"
                multiple
                solo
                append-icon=""
                @click="expand = true"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    @click="select"
                    @click:close="removeKeyWords(item)"
                  >
                    <strong>{{ item }}</strong
                    >&nbsp;
                  </v-chip>
                </template>
              </v-combobox>
            </v-expansion-panel-header>
            <v-expansion-panel-content dark color="black darken-1">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="filter.contractTypes"
                    :items="contractTypes"
                    label="Tipo de contrato"
                    item-text="text"
                    item-value="value"
                    dark
                    multiple
                    solo
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="filter.experienceTypes"
                    :items="experienceTypes"
                    label="Experiência"
                    item-text="text"
                    item-value="value"
                    dark
                    multiple
                    solo
                    dense
                  ></v-select>
                </v-col>
              </v-row>
              <v-btn dark block grey @click="search">
                Pesquisar
              </v-btn>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-divider class="mt-5 mb-5"></v-divider>

        <v-row v-if="this.jobs.length < 1" align="center" justify="center">
          <v-col>
            <v-card elevation="1">
              <v-card-text class="text-center">
                <v-col class="text-center">
                  <v-row align="center" justify="center">
                    <h2>
                      Nenhuma vaga cadastrada, clique no botão abaixo para
                      cadastrar sua primeira vaga
                    </h2>
                  </v-row>
                  <br />
                  <v-row align="center" justify="center"
                    ><v-btn dark to="/job">Cadastrar uma vaga</v-btn></v-row
                  >
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-pagination
          v-if="this.jobs.length > 0"
          v-model="pageIndex"
          dark
          :length="resultSize"
          @input="nextPage"
        ></v-pagination>

        <div v-if="this.loading" class="text-center ma-5">
          <v-progress-circular
            :size="100"
            :width="10"
            indeterminate
            dark
          ></v-progress-circular>
        </div>

        <v-row v-for="(job, index) in jobs" :key="`job-${index}`">
          <v-col>
            <v-card
              dark
              :color="
                job.jobStatus === 'CLOSED' ? 'grey darken-1' : 'black darken-1'
              "
              elevation="5"
            >
              <v-card-title
                >{{ job.title }} - {{ job.contractType }}</v-card-title
              >
              <v-card-subtitle
                >{{ job.company }}
                <span v-if="job.officeLocation">
                  | {{ job.officeLocation }}</span
                ></v-card-subtitle
              >

              <v-card-text>
                <div class="subtitle-1">
                  Nível: <strong>{{ job.experienceRequired }}</strong>
                </div>
                <div class="subtitle-1">
                  Faixa salarial mínima:
                  <strong>
                    {{
                      format(job.salary) + '/' + getCompensationTypeLabel(job)
                    }}</strong
                  >
                </div>

                <div class="my-4">
                  <p style="white-space: pre-wrap;">{{ job.description }}</p>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  grey
                  :disabled="job.jobStatus === 'CLOSED'"
                  @click="edit(job.uuid)"
                >
                  Editar
                </v-btn>
                <v-btn dark grey @click="openCandidates(job.uuid)">
                  Ver candidatos
                </v-btn>
                <v-btn
                  v-if="job.jobStatus !== 'CLOSED'"
                  dark
                  grey
                  @click="closeJob(job.uuid)"
                >
                  Fechar vaga
                </v-btn>
                <v-btn
                  v-if="job.jobStatus === 'CLOSED'"
                  dark
                  grey
                  @click="reopenJob(job.uuid)"
                >
                  Reabrir vaga
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-pagination
          v-if="this.jobs.length > 0"
          v-model="pageIndex"
          dark
          :length="resultSize"
          @input="nextPage"
        ></v-pagination>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import ErrorAlert from '~/components/ErrorAlert'

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2,
  unitDisplay: 'short',
})

export default {
  layout: 'search',
  middleware: ['auth', 'admin-only'],
  components: { ErrorAlert },
  data() {
    return {
      expand: false,
      loading: false,
      pageIndex: 1,
      resultSize: 10,
      jobs: [],
      filter: {
        keyWords: [],
        contractTypes: [],
        experienceTypes: [],
      },
      contractTypes: [
        { text: 'CLT', value: 'CLT' },
        { text: 'PJ', value: 'PJ' },
        { text: 'Cooperando', value: 'COOPERANDO' },
      ],
      experienceTypes: [
        { text: 'Júnior', value: 'JUNIOR' },
        { text: 'Pleno', value: 'PLENO' },
        { text: 'Sênior', value: 'SENIOR' },
        { text: 'Especialista', value: 'ESPECIALISTA' },
      ],
      snackbar: false,
      notification: {
        title: '',
        description: '',
        type: '',
      },
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    nextPage(pageNumber) {
      this.pageIndex = pageNumber
      this.load()
      window.scrollTo(0, 0)
    },
    search() {
      this.pageIndex = 1
      this.load()
    },
    async load() {
      this.loading = true
      const params = this.filter
      params['page-index'] = this.pageIndex
      params['result-size'] = 10

      await this.$api
        .get(`private/admin-jobs`, { params })
        .then((res) => {
          this.jobs = res.data.content
          this.loading = false
          this.resultSize = res.data.totalPages
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
    removeKeyWords(item) {
      this.filter.keyWords.splice(this.filter.keyWords.indexOf(item), 1)
      this.filter.keyWords = [...this.filter.keyWords]
    },
    edit(uuid) {
      this.$router.push('/admin-job/' + uuid)
    },
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
    openCandidates(uuid) {
      this.$router.push('/candidates/' + uuid)
    },
    closeJob(uuid) {
      this.$api
        .post(`private/admin-jobs/close/` + uuid)
        .then((res) => {
          this.load()
        })
        .catch((err) => {
          let message = 'Houve um erro inesperado.'
          if (err.response && err.response.status === 400) {
            message = err.response.data.message
          }

          this.notification.title = 'Erro'
          this.notification.description = message
          this.$refs['message-alert'].showAlert()
        })
    },
    reopenJob(uuid) {
      this.$api
        .post(`private/admin-jobs/reopen/` + uuid)
        .then((res) => {
          this.load()
        })
        .catch((err) => {
          let message = 'Houve um erro inesperado.'
          if (err.response && err.response.status === 400) {
            message = err.response.data.message
          }

          this.notification.title = 'Erro'
          this.notification.description = message
          this.$refs['message-alert'].showAlert()
        })
    },
  },
}
</script>
