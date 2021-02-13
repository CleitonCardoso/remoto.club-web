<template>
<v-flex class="align-start">
<v-card>
<v-card-title style="cursor: pointer;" @click="revealer()">
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
<v-expand-transition>
<v-card v-show="reveal">
<v-container
        style="white-space: pre-wrap; cursor: pointer;"
@click="revealer()"
        >
        {{ job.description }}
</v-container>
</v-card>
</v-expand-transition>
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
<v-stepper-content step="1"> </v-stepper-content>

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
<v-card
        ><template>
<div>
<v-row justify="center" align="center">
<v-subheader>{Mensagens}:</v-subheader>
        {{ messages.length }}
</v-row>
<v-container
        id="scroll-target"
        style="max-height: 400px;"
class="overflow-y-auto"
        >
<v-row
        v-scroll:#scroll-target="onScroll"
        align="center"
        justify="center"
        style="height: 150px;"
        >
</v-row>
<v-alert
        dense
        outlined
        elevation="5"
        border="left"
        :color="colorMessage"
        width="20%"
        >
        {{ messages[0] }}
</v-alert>
<v-alert
        dense
        outlined
        border="right"
        elevation="10"
        width="30%"
        :color="colorMessage"
        :type="vizualized"
        >
        {{ messages[1] }}
</v-alert>
</v-container>
<v-container fluid>
<v-textarea
        name="input-7-1"
        filled
        label="Digite sua mensagem:"
        auto-grow
        value="..."
        ></v-textarea>
</v-container>
</div>
</template>
</v-card>
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
        job: {},
        messages: [],
        reveal: false,
        colorMessage: 'green',
        vizualized: 'success',
        offsetTop: 0,
        }
        },
        mounted() {
        this.load()
        },
        methods: {
        messageReader() {
        const arrayMessages = this.application.messages
        arrayMessages.forEach((m) => {
        this.messages.push(m)
        })
        },
        onScroll(e) {
        this.offsetTop = e.target.scrollTop
        },
        revealer() {
        if (this.reveal == false) {
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
        load() {
        const jobUuid = this.$route.params.uuid
        this.$api
        .get(`private/my-applications/` + jobUuid)
        .then((res) => {
        this.application = res.data
        this.job = res.data.job
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
        }
</script>
