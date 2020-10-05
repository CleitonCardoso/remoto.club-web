<template>
  <v-container>
    <v-layout row wrap>
      <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
      <v-flex class="align-start">
        <v-card class="elevation-12">
          <v-toolbar dark flat>
            <v-toolbar-title>
              <span v-if="!job.uuid" class="title ml-3 mr-5 text--darken-4"
                >Nova vaga</span
              >
              <span v-if="job.uuid" class="title ml-3 mr-5 text--darken-4"
                >Editando</span
              >
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="job_form">
              <v-text-field
                v-model="job.title"
                label="Título"
                name="title"
                type="text"
                :rules="notEmptyRule"
              ></v-text-field>
              <v-select
                v-model="job.contractType"
                :items="contractTypes"
                label="Tipo de contrato"
                name="contractType"
                type="text"
                :rules="notEmptyRule"
              ></v-select>
              <v-select
                v-model="job.experienceRequired"
                :items="experienceTypes"
                label="Experiência desejada"
                name="experienceType"
                :rules="notEmptyRule"
              ></v-select>
              <v-textarea
                v-model="job.description"
                label="Descrição"
                name="description"
                type="text"
                :rules="notEmptyRule"
              ></v-textarea>
              <v-row>
                <v-col cols="4">
                  <v-select
                    v-model="job.compensationType"
                    :items="compensationTypes"
                    label="Unidade"
                    name="compensationType"
                    :rules="notEmptyRule"
                  ></v-select>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="job.salary"
                    label="Faixa salarial"
                    name="description"
                    type="number"
                    :rules="notEmptyRule"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-icon
              v-if="job.uuid"
              dark
              color="red darken-4"
              class="mr-3"
              @click="remove"
              >mdi-trash-can</v-icon
            >
            <v-spacer></v-spacer>
            <v-btn dark class="mr-3" to="/my-jobs">Cancelar</v-btn>
            <v-btn dark class="mr-3" @click="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline"
          >Certeza de que deseja remover?</v-card-title
        >

        <v-card-text>
          Ao remover a vaga os candidatos existentes NÃO SERÃO INFORMADOS. Evite
          deixar seus candidatos sem um feedback. Prosseguir?
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn dark class="mr-3" @click="dialog = false">Cancelar</v-btn>
          <v-btn dark class="mr-3 red darken-1" @click="confirmRemove"
            >Prosseguir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import ErrorAlert from '~/components/ErrorAlert'

export default {
  layout: 'search',
  middleware: 'auth',
  components: { ErrorAlert },
  data() {
    return {
      dialog: false,
      job: {
        title: null,
        contractType: null,
        experienceRequired: null,
        description: null,
        salary: null,
      },
      contractTypes: [
        { text: 'CLT', value: 'CLT' },
        { text: 'PJ', value: 'PJ' },
      ],
      experienceTypes: [
        { text: 'Júnior', value: 'JUNIOR' },
        { text: 'Pleno', value: 'PLENO' },
        { text: 'Sênior', value: 'SENIOR' },
        { text: 'Especialista', value: 'ESPECIALISTA' },
      ],
      compensationTypes: [
        { text: 'Por hora', value: 'PER_HOUR' },
        { text: 'Por mês', value: 'PER_MONTH' },
        { text: 'Por ano', value: 'PER_YEAR' },
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
    this.loadJob()
  },
  methods: {
    loadJob() {
      const uuid = this.$route.params.uuid
      if (uuid) {
        this.$api
          .get(`private/my-jobs/` + uuid)
          .then((res) => {
            this.job = res.data
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
      }
    },
    save() {
      const valid = this.$refs.job_form.validate()
      if (valid) {
        this.$api
          .post(`private/my-jobs`, this.job)
          .then((res) => {
            this.$router.push('/my-jobs')
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
      } else {
        this.notification.title = 'Erro'
        this.notification.description = 'Verifique os erros no formulário'
        this.notification.type = 'error'
        this.$refs['message-alert'].showAlert()
      }
    },
    remove() {
      this.dialog = true
    },
    confirmRemove() {
      this.$api
        .delete(`private/my-jobs/${this.job.uuid}`)
        .then((res) => {
          this.$router.push('/my-jobs')
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
