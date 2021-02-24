<template>
  <v-container fill-height fluid>
    <v-row class="text-center align-center">
      <v-col>
        <h1 class="text-h1">
          <strong>
            Oops... <br />
            essa página não existe!
          </strong>
        </h1>
      </v-col>
    </v-row>
    <br />
    <v-row class="text-center align-center mt-15">
      <v-row class="text-center align-center justify-center">
        <v-btn dark large to="/vagas">Ver outras vagas incríveis</v-btn>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'search',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped></style>
