<template>
  <v-container>
    <v-layout row>
      <ErrorAlert ref="message-alert" :notification="notification"></ErrorAlert>
      <v-flex class="align-start">
        <v-card class="elevation-12" height="100%" style="position: relative;">
          <v-toolbar dark flat>
            <v-text-field
              v-model="mailTemplate.title"
              label="Título"
              name="title"
              solo
              hide-details
              single-line
              light
            ></v-text-field>
          </v-toolbar>
          <v-card-text style="height: 72vh;">
            <EmailEditor
              ref="emailEditor"
              style="height: 100%;"
              locale="pt-BR"
              @load="editorLoaded"
            />
          </v-card-text>
          <v-card-actions>
            <v-icon
              v-if="mailTemplate.uuid"
              dark
              color="red darken-4"
              class="mr-3"
              @click="remove"
              >mdi-trash-can</v-icon
            >
            <v-spacer></v-spacer>
            <v-btn dark class="mr-3" @click="goBack">Voltar</v-btn>
            <v-btn dark class="mr-3" @click="testTemplate"
              >Enviar email de teste</v-btn
            >
            <v-btn dark class="mr-3" @click="saveDesign">Salvar template</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-dialog v-model="removeDialog" max-width="290">
        <v-card>
          <v-card-title class="headline"
            >Certeza de que deseja remover?</v-card-title
          >

          <v-card-text>
            Remover o teplate de email?
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn dark class="mr-3" @click="removeDialog = false"
              >Cancelar</v-btn
            >
            <v-btn dark class="mr-3 red darken-1" @click="confirmRemove"
              >Prosseguir</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="goBackDialog" max-width="290">
        <v-card>
          <v-card-title class="headline"
            >Descartar alterações não salvas?</v-card-title
          >

          <v-card-text>
            Ao voltar todas as alterações não salvas serão perdidas, confirmar?
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn dark class="mr-3" @click="goBackDialog = false"
              >Cancelar</v-btn
            >
            <v-btn dark class="mr-3 red darken-1" @click="confirmGoBack"
              >Prosseguir</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import { EmailEditor } from 'vue-email-editor'
import ErrorAlert from '~/components/ErrorAlert'

export default {
  layout: 'search',
  components: { ErrorAlert, EmailEditor },
  data() {
    return {
      mailTemplate: {
        title: '',
        design: '',
      },
      removeDialog: false,
      goBackDialog: false,
      snackbar: false,
      notification: {
        title: '',
        description: '',
        type: '',
      },
    }
  },
  mounted() {},
  methods: {
    loadMailTemplate() {
      this.$refs.emailEditor.editor.loadDesign('')
      const uuid = this.$route.params.uuid
      if (uuid) {
        this.$api
          .get(`private/admin/mail-template/` + uuid)
          .then((res) => {
            this.mailTemplate = res.data
            this.$refs.emailEditor.editor.loadDesign(
              JSON.parse(this.mailTemplate.design)
            )
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
        this.$refs.emailEditor.editor.loadDesign('')
      }
    },
    editorLoaded() {
      this.loadMailTemplate()
    },
    saveDesign() {
      this.$refs.emailEditor.editor.exportHtml((data) => {
        this.mailTemplate.design = JSON.stringify(data.design)
        this.mailTemplate.html = data.html
        this.$api
          .post(`private/admin/mail-template`, this.mailTemplate)
          .then((res) => {
            this.mailTemplate = res.data
            this.notification.title = 'Salvo'
            this.notification.description = 'Salvo com sucesso!'
            this.notification.type = 'success'
            this.$refs['message-alert'].showAlert()
            this.editorLoaded()
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

        console.log(JSON.stringify(design))
      })
    },
    remove() {
      this.removeDialog = true
    },
    confirmRemove() {
      this.$api
        .delete(`private/admin/mail-template/${this.mailTemplate.uuid}`)
        .then((res) => {
          this.$router.push('/mail-templates/all')
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
    goBack() {
      this.goBackDialog = true
    },
    confirmGoBack() {
      this.$router.push('/mail-templates/all')
    },
    testTemplate() {
      this.$refs.emailEditor.editor.exportHtml((data) => {
        debugger
        this.$api
          .post(`private/admin/mail-template/test`, data.html, {
            headers: { 'Content-Type': 'text/plain' },
          })
          .then((res) => {
            this.mailTemplate = res.data
            this.notification.title = 'Enviado com sucesso'
            this.notification.description = 'Enviado com sucesso!'
            this.notification.type = 'success'
            this.$refs['message-alert'].showAlert()
            this.editorLoaded()
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
      })
    },
  },
}
</script>
