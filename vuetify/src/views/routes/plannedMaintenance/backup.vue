
<template>
  <v-container
    id="regular-forms"
    fluid
    tag="section"
  >
    <loading
      :active.sync="loading"
      :loader="loaderOptions.loader"
      :color="loaderOptions.color"
      :width="loaderOptions.width"
      :height="loaderOptions.height"
      :background-color="loaderOptions.backgroundColor"
      :is-full-page="loaderOptions.isFullPage"
    />
    <base-v-component
      heading="Forms"
      link="components/forms"
    />

    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          color="blue"
          icon="mdi-plus"
          :title="`${ isAdmin ? getActionName  : 'View'} Planned Maintenance`"
          class="px-5 py-3"
        >
          <validation-observer
            v-slot="{ handleSubmit }"
            slim
          >
            <v-form
              class="mt-5"
              @submit.prevent="handleSubmit(onSubmit)"
            >
              <v-col
                cols="12"
                class="ma-0 pa-0"
              >
                <!-- Sub Machines list -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Machine"
                >
                  <v-select
                    v-model="form.machine"
                    color="secondary"
                    item-color="secondary"
                    label="Machine"
                    :disabled="formIsDisabled"
                    return-object
                    :error-messages="errors"
                    :items="machines"
                    item-text="name"
                    item-value="id"
                  >
                    <template v-slot:item="{ attrs, item, on }">
                      <v-list-item
                        v-bind="attrs"
                        active-class="secondary elevation-4 white--text"
                        class="mx-3 mb-3 v-sheet"
                        elevation="0"
                        v-on="on"
                      >
                        <v-list-item-content>
                          <v-list-item-title v-text="`${item ? item.name: ''} - ${item? item.machine ? item.machine.name : '' : ''}`" />
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </validation-provider>
                <!-- Task Description -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Task Description"
                >
                  <v-text-field
                    v-model="form.task"
                    :error-messages="errors"
                    :disabled="formIsDisabled"
                    color="secondary"
                    label="Task to be added for Planned Maintenance"
                  />
                </validation-provider>
                <!-- Component Description -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Component Description"
                >
                  <v-text-field
                    v-model="form.component"
                    :error-messages="errors"
                    :disabled="formIsDisabled"
                    color="secondary"
                    label="Component Description"
                  />
                </validation-provider>
                <!-- Task type -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Task type"
                >
                  <v-select
                    v-model="form.type"
                    color="secondary"
                    item-color="secondary"
                    label="Task type"
                    :disabled="formIsDisabled"
                    :error-messages="errors"
                    :items="maintenanceTypes"
                  >
                    <template v-slot:item="{ attrs, item, on }">
                      <v-list-item
                        v-bind="attrs"
                        active-class="secondary elevation-4 white--text"
                        class="mx-3 mb-3 v-sheet"
                        elevation="0"
                        v-on="on"
                      >
                        <v-list-item-content>
                          <v-list-item-title> {{ item | capitalize }} </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template v-slot:selection="{item}">
                      <div>{{ item | replaceUnderscoreWithSpace }}</div>
                    </template>
                  </v-select>
                </validation-provider>
                <!-- Repeating -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Repeating"
                >
                  <v-select
                    v-model="form.repeating"
                    color="secondary"
                    item-color="secondary"
                    label="Repeating"
                    :disabled="formIsDisabled"
                    :error-messages="errors"
                    :items="repeating"
                  >
                    <template v-slot:item="{ attrs, item, on }">
                      <v-list-item
                        v-bind="attrs"
                        active-class="secondary elevation-4 white--text"
                        class="mx-3 mb-3 v-sheet"
                        elevation="0"
                        v-on="on"
                      >
                        <v-list-item-content>
                          <v-list-item-title> {{ item | capitalize | replaceUnderscoreWithSpace }} </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template v-slot:selection="{item}">
                      <div>{{ item | replaceUnderscoreWithSpace }}</div>
                    </template>
                  </v-select>
                </validation-provider>
              </v-col>
              <v-card-actions class="pl-0" v-if="isAdmin">
                <v-btn
                  color="success"
                  min-width="100"
                  type="submit"
                  :disabled="formIsDisabled"
                >
                  {{ getActionName }} Planned Maintenance
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </base-material-card>
      </v-col>
    </v-row>
    <base-material-snackbar
      v-model="snackbar.snackbar"
      :type="snackbar.type"
      v-bind="{
        top : true
      }"
    >
      {{ snackbar.message }}
    </base-material-snackbar>
  </v-container>
</template>

<script>
import { mapState , mapGetters} from 'vuex'

export default {
  name: 'PlannedMaintenancePlannedMaintenanceCronForm',
  props: {
    id: {
      default: '0',
      type: String,
    },
    action: {
      default: 'add',
      type: String,
    },
  },
  data: () => ({
    snackbar: {
      snackbar: false,
      type: 'success',
      message: '',
    },
    loading: true,
    formIsValid: null,
    formIsDisabled: false,
    machines: [],
    form: {
      type: '',
      repeating: '',
      task: '',
      component: '',
      machine: null,
    },
    maintenanceTypes: ['mechanical', 'electrical', 'pneumatic', 'steam', 'control', 'sensor'],
    repeating: ['every_minute',
      'daily_at_9am',
      'every_monday_at_9am',
      'first_day_of_month',
      'first_day_of_every_2_months',
      'first_day_of_every_year',
      'first_day_of_every_second_year'],
  }),
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
      }),
      ...mapGetters({
        isAdmin: 'auth/isAdmin'
      }),
      getActionName () {
        return this.action.replace(/^./, this.action[0].toUpperCase())
      },
    },

  async mounted () {
    this.loading = true;
    if (!this.isAdmin) {
      this.formIsDisabled = true;
    }
    // Load form data
    this.machines = await this.getMachines();

    // Check action
    switch (this.action) {
      case 'modify':
        this.form = await this.getFormForId(this.id);
        break;
      case 'add':
        break;
      default:
        break
    }

    this.loading = false
  },

  methods: {
    async getFormForId (id) {
      return this.$axios({
        method: 'POST',
        url: '/graphql',
        data: {
          query: `{
              plannedMaintenance(id: "${id}"){
                repeating
                task
                type
                subMachine{
                  name
                  id
                  machine{
                      name
                  }
                }
                component
              }
            }`,
        },
      }).then(({ data }) => {
        const result = data.data.plannedMaintenance;
        if(result) {
          return {
            repeating: result.repeating,
            task: result.task,
            type: result.type,
            component: result.component,
            machine: result.subMachine,
          }
        } else {
          return {}
        }
      })
    },
    async modifyPlannedMaintenance () {
      const { type, repeating, task, component, machine } = this.form
      return this.$axios({
        method: 'POST',
        url: '/graphql',
        data: {
          query: `mutation {
            updatePlannedMaintenance(input:{ where: {id: "${this.id}" }, data: {type: ${type}, subMachine:"${machine.id}", repeating: ${repeating}, task: "${task}", component: "${component}"}}){
              plannedMaintenance{
                id
              }
            }
          }`,
        },
      })
        .then(({ data }) => {
          this.snackbar = {
            message: 'A Planned Maintenance has been successfully modified.',
            type: 'success',
            snackbar: true,
          }
          return data.data.plannedMaintenance
          })
        .catch(err => {
          this.snackbar = {
            message: `There was an error adding your request. Message: ${err.message}`,
            type: 'error',
            snackbar: true,
          }
        })
    },
    async addPlannedMaintenance () {
      const { type, repeating, task, component, machine } = this.form
      return this.$axios({
        method: 'POST',
        url: '/graphql',
        data: {
          query: `mutation {
            createPlannedMaintenance(input:{data: {type: ${type},
            subMachine:"${machine.id}", repeating: ${repeating}, task: "${task}",
            component: "${component}"}}){
              plannedMaintenance{
                id
              }
            }
          }`,
        },
      })
        .then(({ data }) => {
          this.snackbar = {
            message: 'A Planned Maintenance has been successfully created.',
            type: 'success',
            snackbar: true,
          }
          return data.data.plannedMaintenance
          })
        .catch(err => {
          this.snackbar = {
            message: `There was an error adding your request. Message: ${err.message}`,
            type: 'error',
            snackbar: true,
          }
        })
    },
    async sleep (milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    },
    async onSubmit () {
      this.loading = true;
      this.formIsDisabled = true;

      switch (this.action) {
        case 'add':
          await this.addPlannedMaintenance();
          break;
        case 'modify':
          await this.modifyPlannedMaintenance();
          break
      }

      this.loading = false;

      return this.sleep(3000)
        .then(() => {
            this.$router.push('/planned-maintenance/planned-maintenance-list')
          })
    },
    async getMachines () {
      return this.$axios({
        method: 'POST',
        url: '/graphql',
        data: {
          query: `{
              machines{
                  name
                  id
              }
          }`,
        },
      }).then(({ data }) => {
          if (data.data.machines) {
            return data.data.machines
          } else {
            return []
          }
        })
    },
  },
}
</script>
