<template>
  <v-container>
    <v-layout row wrap>
      <v-flex class="align-start">
        <v-card class="elevation-12">
          <v-toolbar dark flat>
            <v-toolbar-title>
              <router-link
                to="/"
                style="text-decoration: none; color: inherit;"
              >
                <span class="title ml-3 mr-5 text--darken-4">Nova vaga</span>
              </router-link>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Título"
                name="title"
                type="text"
              ></v-text-field>
              <v-select
                :items="contractTypes"
                label="Tipo de contrato"
                name="contractType"
                type="text"
              ></v-select>
              <v-text-field
                label="Descrição"
                name="description"
                type="text"
              ></v-text-field>
              <v-text-field
                label="Faixa salarial"
                name="description"
                type="number"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark class="mr-3" @click="this.login">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  layout: 'search',
  middleware: 'authenticated',
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
      ],
      experienceTypes: [
        { text: 'Júnior', value: 'JUNIOR' },
        { text: 'Pleno', value: 'PLENO' },
        { text: 'Sênior', value: 'SENIOR' },
        { text: 'Especialista', value: 'ESPECIALISTA' },
      ],
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    nextPage(pageNumber) {
      this.pageIndex = pageNumber
      this.load()
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
        .get(`private/my-jobs`, { params })
        .then((res) => {
          this.jobs = res.data.content
          this.loading = false
          this.resultSize = res.data.totalPages
        })
        .catch({})
    },
    remove(item) {
      this.filter.keyWords.splice(this.filter.keyWords.indexOf(item), 1)
      this.filter.keyWords = [...this.filter.keyWords]
    },
  },
}
</script>
