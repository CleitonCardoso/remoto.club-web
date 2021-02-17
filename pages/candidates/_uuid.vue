<template>
  <v-container>
    <v-layout row wrap>
      <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
      <v-flex class="align-start">
        <v-spacer></v-spacer>
        <v-row>
          <v-col>
            <v-btn
              dark
              :to="
                this.$auth.user.role === 'ADMIN' ? '/admin-jobs' : '/my-jobs'
              "
            >
              <span>
                <v-icon>mdi-arrow-left</v-icon>
                Voltar
              </span>
            </v-btn>
          </v-col>
        </v-row>

        <v-card class="elevation-12">
          <v-toolbar dark flat>
            <v-toolbar-title>
              <router-link
                to="/"
                style="text-decoration: none; color: inherit;"
              >
                <span class="title ml-3 mr-5 text--darken-4">Candidatos</span>
              </router-link>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              class="row-pointer"
              :headers="headers"
              item-key="uuid"
              :items="candidates"
              :items-per-page="20"
              @click:row="openCandidate"
            >
              <!-- <template v-slot:[`item.actions`]="{ item }">
                <v-select
                  v-model="select"
                  :items="items"
                  item-text="state"
                  item-value="abbr"
                  label="Select"
                  persistent-hint
                  return-object
                  single-line
                ></v-select>
              </template> -->

              <template v-slot:[`item.linkedInUrl`]="{ item }">
                <a :href="item.linkedInUrl" target="_blank">
                  {{ item.linkedInUrl }}
                </a>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
      jobUuid: null,
      candidates: [],
      headers: [
        { text: 'Nome', value: 'name' },
        { text: 'Url linkedin', value: 'linkedInUrl' },
        { text: 'Ações', value: 'actions', sortable: false },
      ],
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
    load() {
      this.jobUuid = this.$route.params.uuid
      const isAdmin = this.$auth.user.role === 'ADMIN'
      this.$api
        .get(
          `private` +
            (isAdmin ? `/admin-jobs/` : `/my-jobs/`) +
            this.jobUuid +
            `/candidates`
        )
        .then((res) => {
          this.candidates = res.data
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
    openCandidate(candidate) {
      window.open(`/candidate/${this.jobUuid}/${candidate.uuid}`, '_blank')
    },
  },
}
</script>
<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
