<template>
  <div>
    <v-row>
      <v-col>
        <v-card v-if="candidature">
          <v-card-title style="cursor: pointer;" @click="revealer()">
            <div>
              <div>
                <strong>
                  {{ candidature.job.title }} -
                  {{ candidature.job.contractType }}
                </strong>
              </div>
              {{ candidature.job.company }}
              <span v-if="candidature.job.officeLocation">
                | {{ candidature.job.officeLocation }}</span
              >
            </div>
            <v-spacer></v-spacer>
            <div>
              <div>
                Nível:
                {{ candidature.job.experienceRequired }}
              </div>
              <strong>
                {{
                  format(candidature.job.salary) +
                  '/' +
                  getCompensationTypeLabel(candidature.job)
                }}</strong
              >
            </div>
          </v-card-title>

          <v-expand-transition>
            <v-card v-show="reveal" class="elevation-0">
              <v-container
                style="white-space: pre-wrap; cursor: pointer;"
                @click="revealer()"
              >
                {{ candidature.job.description }}
              </v-container>
            </v-card>
          </v-expand-transition>
          <v-col>
            <v-stepper
              v-if="candidature"
              v-model="e1"
              class="elevation-0"
              alt-labels
            >
              <v-stepper-header>
                <v-stepper-step step="1" complete>
                  Houve interesse na sua vaga!
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                  :complete="
                    ['ACCEPTED', 'OFFERED', 'HIRED'].includes(
                      candidature.status
                    )
                  "
                  step="2"
                >
                  Conhecendo melhor o candidato
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                  :complete="['OFFERED', 'HIRED'].includes(candidature.status)"
                  step="3"
                >
                  Hora da oferta
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                  :complete="candidature.status === 'HIRED'"
                  step="4"
                >
                  Contratado!
                </v-stepper-step>
              </v-stepper-header>

              <!-- <v-stepper-items>
              <v-stepper-content step="1"> </v-stepper-content>

              <v-stepper-content step="2">
                <v-card
                  class="mb-12"
                  color="grey lighten-1"
                  height="200px"
                ></v-card>

                <v-btn @click="e1 = 3"> Continue </v-btn>

                <v-btn text> Cancel </v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card
                  class="mb-12"
                  color="grey lighten-1"
                  height="200px"
                ></v-card>

                <v-btn color="primary" @click="e1 = 1"> Continue </v-btn>

                <v-btn text> Cancel </v-btn>
              </v-stepper-content>
            </v-stepper-items> -->
            </v-stepper>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="6" md="12" sm="12" xs="12">
        <v-card height="100%" class="fill-height">
          <v-card-title>
            <h1>Detalhes do candidato</h1>
          </v-card-title>
          <v-card-text v-if="candidature">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  {{ candidature.candidate.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <a :href="candidature.candidate.linkedInUrl">LinkedIn</a>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-text></v-card
        >
      </v-col>
      <v-col lg="6" md="12" sm="12" xs="12">
        <v-card
          height="100%"
          class="d-flex flex-column fill-height"
          style="height: 55vh; max-height: 55vh;"
        >
          <v-card-title class="elevation-5">
            <h1>Mensagens</h1>
          </v-card-title>
          <v-card-text
            ref="messagesContent"
            style="height: 55vh; max-height: 55vh;"
          >
            <div
              v-for="(item, index) in chat"
              :key="index"
              :class="[
                'd-flex flex-row align-center my-2',
                item.me ? 'justify-end' : null,
              ]"
            >
              <span v-if="item.me" class="black--text mr-3">
                <v-chip>{{ item.msg }}</v-chip>
              </span>
              <v-tooltip :left="item.me" :right="!item.me">
                <template v-slot:activator="{ on }">
                  <v-avatar
                    :color="item.me ? 'black' : 'grey'"
                    size="36"
                    v-on="on"
                  >
                    <span class="white--text">{{ item.from[0] }}</span>
                  </v-avatar>
                </template>
                <span>{{ item.from }}</span>
              </v-tooltip>
              <span v-if="!item.me" class="blue--text ml-3">
                <v-chip>{{ item.msg }}</v-chip>
              </span>
            </div>
          </v-card-text>
          <v-card-actions class="elevation-5">
            <v-text-field
              v-model="msg"
              placeholder="Mensagem.."
              append-icon="mdi-send"
              class="px-5"
              @click:append="send"
              @keypress.enter="send"
            ></v-text-field>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

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
      messages: [],
      reveal: false,
      colorMessage: 'green',
      vizualized: 'success',
      offsetTop: 0,
      chat: [],
      msg: null,
      connected: false,
      stompClient: null,
    }
  },
  async mounted() {
    await this.load()
    await this.loadMessages()
    this.openChat()
  },
  methods: {
    send() {
      if (this.msg) {
        this.stompClient.send(
          '/app/chat',
          JSON.stringify({ content: this.msg }),
          {}
        )
      }
    },
    messageReader() {
      const arrayMessages = this.candidature.messages
      arrayMessages.forEach((m) => {
        this.messages.push(m)
      })
    },
    onScroll(e) {
      this.offsetTop = e.target.scrollTop
    },
    revealer() {
      if (this.reveal === false) {
        this.reveal = true
      } else {
        this.reveal = false
      }
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
    async load() {
      const jobUuid = this.$route.params.jobuuid
      const candidateUuid = this.$route.params.candidateuuid
      await this.$api
        .get(`private/my-jobs/${jobUuid}/candidates/${candidateUuid}`)
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
    async loadMessages() {
      const loggedUserUuid = this.$auth.user.uuid
      const candidatureUuid = this.candidature.uuid
      await this.$api
        .get(`private/messages/candidature/${candidatureUuid}`)
        .then((res) => {
          res.data.forEach((message) => {
            this.chat.push({
              from: message.sender,
              msg: message.content,
              me: loggedUserUuid === message.loginUuid,
            })
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
      this.scrollToBottom()
    },
    openChat() {
      const loggedUserUuid = this.$auth.user.uuid
      this.socket = new SockJS(
        `${
          this.$api.defaults.baseURL
        }/public/ws?authorization=${this.$auth.getToken('local')}&candidature=${
          this.candidature.uuid
        }`
      )
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.connect(
        {},
        (frame) => {
          this.connected = true
          this.stompClient.subscribe(
            `/queue/messages/${this.candidature.uuid}`,
            (tick) => {
              const message = JSON.parse(tick.body)
              this.chat.push({
                from: message.sender,
                msg: message.content,
                me: loggedUserUuid === message.loginUuid,
              })
              this.msg = null
              this.scrollToBottom()
            }
          )
        },
        (error) => {
          console.log(error)
          this.connected = false
        }
      )
    },
    scrollToBottom() {
      const messagesContentElement = this.$refs.messagesContent
      if (messagesContentElement)
        this.$nextTick(() => {
          messagesContentElement.scrollTop = messagesContentElement.scrollHeight
        })
    },
  },
}
</script>
<style lang="css">
.card-spacer {
  margin-top: 10px;
  margin-bottom: 10px;
}

.v-card__text {
  overflow: auto;
}
</style>
