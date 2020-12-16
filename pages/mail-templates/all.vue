<template>
  <v-container>
    <v-layout row wrap>
      <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
      <v-flex class="align-start">
        <v-card class="elevation-12">
          <v-toolbar dark flat>
            <span class="title ml-3 mr-5 text--darken-4"
              >Templates de email</span
            >
            <v-spacer></v-spacer>
            <v-btn light @click="newTemplate">Novo template</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              :headers="headers"
              item-key="uuid"
              :items="templates"
              :items-per-page="20"
              class="row-pointer"
              @click:row="openTemplate"
            >
              <template v-slot:[`item.actions`]="{ item }">
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
              </template>

              <template v-slot:[`item.linkedInUrl`]="{ item }">
                <a :href="item.linkedInUrl" target="_blank">
                  {{ item.linkedInUrl }}
                </a>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark class="mr-3" to="/my-jobs">Voltar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import ErrorAlert from '~/components/ErrorAlert'

export default {
  layout: 'search',
  components: { ErrorAlert },
  data() {
    return {
      dialog: false,
      templates: [],
      headers: [
        { text: 'Título', value: 'title' },
        { text: 'Status', value: 'status' },
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
      this.$api
        .get(`private/admin/mail-template/`)
        .then((res) => {
          this.templates = res.data
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
    openTemplate(value) {
      this.$router.push('/mail-templates/' + value.uuid)
    },
    newTemplate() {
      this.$router.push('/mail-templates/')
    },
  },
}
</script>
<style lang="css">
.row-pointer > .v-data-table__wrapper > table > tbody > tr :hover {
  cursor: pointer;
}
</style>
