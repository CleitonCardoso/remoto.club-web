<template>
  <v-container>
    <v-layout row wrap>
      <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
      <v-flex class="align-start">
        <v-expansion-panels multiple dark color="black darken-1">
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
            <v-card dark color="black darken-1" elevation="5">
              <v-card-title>
                <strong>{{ job.title }} - {{ job.contractType }}</strong>

                <v-spacer></v-spacer>

                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      dark
                      color="gray darken-4"
                      class="mr-3"
                      v-bind="attrs"
                      v-on="on"
                      @click="reportJob(job.uuid)"
                      >mdi-alert-octagon</v-icon
                    >
                  </template>
                  <span>Reportar vaga</span>
                </v-tooltip>
              </v-card-title>
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

                <div v-if="true" class="my-4">
                  <p style="white-space: pre-wrap;">{{ job.description }}</p>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="
                    !$auth.loggedIn || $auth.$state.user.role === 'CANDIDATE'
                  "
                  dark
                  block
                  grey
                  @click="apply(job.uuid)"
                >
                  Candidatar-se
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
          class="mb-10"
          @input="nextPage"
        ></v-pagination>
      </v-flex>
    </v-layout>
    <v-dialog v-model="applyModal" width="500" dark color="black darken-1">
      <v-card dark color="black darken-1">
        <v-card-title>
          Aplicar à vaga
        </v-card-title>

        <v-card-text v-if="this.$auth.loggedIn">
          Confirmar aplicação?
        </v-card-text>

        <v-card-text v-if="!this.$auth.loggedIn">
          Para aplicar-se à vaga você <strong>precisa estar logado</strong>,
          clique no botão de login para ser redirecionado.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark grey @click="cancelApply">
            Cancelar
          </v-btn>
          <v-btn
            v-if="this.$auth.loggedIn"
            dark
            class="green"
            @click="confirmApply(selectedJobUuid)"
          >
            Confirmar
          </v-btn>

          <v-btn v-if="!this.$auth.loggedIn" dark class="green" to="/login">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="reportModal" width="500" dark color="black darken-1">
      <v-card dark color="black darken-1">
        <v-card-title>
          Reportar
        </v-card-title>

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-select
              v-model="report.reason"
              :items="reasonTypes"
              label="Motivo"
              name="reason"
              :rules="notEmptyRule"
            ></v-select>
            <v-textarea
              v-model="report.description"
              label="Descrição"
              name="description"
              type="text"
              :rules="notEmptyRule"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark grey @click="cancelReport">
            Cancelar
          </v-btn>
          <v-btn dark class="red" @click="confirmReport">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  components: { ErrorAlert },
  data() {
    return {
      expand: false,
      loading: false,
      pageIndex: 1,
      resultSize: 10,
      applyModal: false,
      reportModal: false,
      linkedInUrl: '',
      selectedJobUuid: null,
      report: {
        jobUuid: null,
        reason: null,
        description: null,
      },
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
      reasonTypes: [
        { text: 'Não é trabalho remoto', value: 'NOT_REMOTE' },
        { text: 'Valor incompatível', value: 'VALUE_TOO_LOW' },
        { text: 'Descrição incompleta', value: 'INVALID_DESCRIPTION' },
        { text: 'Me desrespeita de alguma forma', value: 'DISRESPECT' },
        { text: 'Outro motivo...', value: 'SOMETHING_ELSE' },
      ],
      snackbar: false,
      notification: {
        title: '',
        description: '',
        type: '',
      },
      notEmptyRule: [(v) => !!v || 'O campo precisa ser preenchido!'],
    }
  },
  mounted() {
    this.filter.keyWords = this.$route.query.keyWords
    this.filter.contractTypes = this.$route.query.contractTypes
    this.filter.experienceTypes = this.$route.query.experienceTypes
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
        .get(`public/jobs`, { params })
        .then((res) => {
          this.jobs = res.data.content
          this.loading = false
          this.resultSize = res.data.totalPages

          this.jobs.forEach((element) => {
            this.$set(element, 'showDescription', false)
          })
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
    apply(jobUuid) {
      this.selectedJobUuid = jobUuid
      this.applyModal = true
    },
    cancelApply() {
      this.applyModal = false
    },
    async confirmApply(jobUuid) {
      await this.$api
        .post(`private/jobs/` + jobUuid + `/apply`)
        .then((res) => {
          this.notification.title = 'Feito'
          this.notification.description = 'Você aplicou para esta vaga!'
          this.notification.type = 'success'
          this.$refs['message-alert'].showAlert()
          this.applyModal = false
        })
        .catch((err) => {
          let message = 'Houve um erro inesperado.'
          if (err.response && err.response.status === 400) {
            message = err.response.data.message
          }

          this.notification.title = 'Erro'
          this.notification.description = message || ''
          this.notification.type = 'error'
          this.$refs['message-alert'].showAlert()
          this.applyModal = false
        })
    },
    reportJob(jobUuid) {
      this.report.jobUuid = jobUuid
      this.reportModal = true
    },
    cancelReport() {
      this.reportModal = false
      this.$refs.form.reset()
    },
    confirmReport() {
      const valid = this.$refs.form.validate()
      if (valid) {
        this.$api
          .post(`public/report/`, this.report)
          .then((res) => {
            this.notification.title = 'Feito'
            this.notification.description =
              'Você reportou essa vaga! Nossa equipe estará analisando sua denúncia e daremos uma posição o mais breve posível.'
            this.notification.type = 'success'
            this.$refs['message-alert'].showAlert()
            this.cancelReport()
          })
          .catch((err) => {
            let message = 'Houve um erro inesperado.'
            if (err.response && err.response.status === 400) {
              message = err.response.data.message
            }

            this.notification.title = 'Erro'
            this.notification.description = message || ''
            this.notification.type = 'error'
            this.$refs['message-alert'].showAlert()
            this.cancelReport()
          })
      } else {
        this.notification.title = 'Erro'
        this.notification.description = 'Verifique os erros no formulário'
        this.notification.type = 'error'
        this.$refs['message-alert'].showAlert()
      }
    },
  },
}
</script>
