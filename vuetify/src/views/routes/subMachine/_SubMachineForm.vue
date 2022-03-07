/* eslint-disable vue/no-unused-vars */
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
        cols="6"
      >
        <base-material-card
          color="success"
          icon="mdi-plus"
          :title="`${ isAdmin ? getActionName : 'View'} Sub Machine`"
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
              <v-row>
                <v-col
                  cols="12"
                >
                  <!-- Machine name -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Sub Machine Name"
                  >
                    <v-text-field
                      v-model="form.name"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      color="secondary"
                      label="Friendly name for a Sub Machine"
                    />
                  </validation-provider>

                </v-col>
              </v-row>
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
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'SubMachineSubMachineForm',
    props: {
      id: {
        default: '0',
        type: String,
      },
      action: {
        default: 'add',
        type: String,
      },
      machineId: {
        default: '0',
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
      machines: [],
      formIsValid: null,
      formIsDisabled: false,
      form: {
        machine: null,
        name: '',
      },
    }),
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
      }),
      ...mapGetters({
        isAdmin: 'auth/isAdmin'
      }),
      getActionName() {
        return this.action.replace(/^./, this.action[0].toUpperCase())
      },
      getBaseUrl() {
        return process.env.VUE_APP_API_BASE_URL
      },
    },

    async mounted() {
      this.loading = true;
      if(!this.isAdmin) {
        this.formIsDisabled = true;
      }
      // Load form data
      this.machines = await this.getMachines();

      // This happens if the MachineId was provided (new record for particular machine)
      if (this.machineId !== '0') {
        this.form.machine = await this.getMachineForId(this.machineId)
      }

      // Check action
      switch (this.action) {
        case 'modify':
          this.form = await this.getFormForId(this.id)
          break
        case 'add':
          break
        default:
          break
      }

      this.loading = false
    },

    methods: {
      async onImageChange(val) {
        const {valid} = await this.$refs.provider.validate(val)
        if (valid) {
          const value = val.target.files[0]

          if (!value) {
            return (this.form.image = null)
          }
          this.form.image = value
          this.form.imageUrl = URL.createObjectURL(this.form.image)
          return true
        } else return (this.form.image = null)
      },
      async getMachineForId(machineId) {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
            machine(id: "${machineId}"){
              id
              name
            }
          }`,
          },
        }).then(({data}) => {
          if (data.data.machine) {
            return data.data.machine
          } else {
            return {}
          }
        })
      },
      async getFormForId(id) {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
            subMachine(id: "${id}"){
              id
              name
              machine{
                id
                name
              }
            }
          }
          `,
          },
        }).then(({data}) => {
          const result = data.data.subMachine
          if(result) {
            return {
              machine: result.machine,
              name: result.name,
            }
          } else {
            return {};
          }

        })
      },
      async addSubMachine() {
        const {machine, name} = this.form
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `mutation {
            createSubMachine(input:{data: {name: "${name}",machine: "${machine.id}"}}){
              subMachine{
                name
                id
                machine{
                  id
                  name
                }
              }
            }
          }`,
          },
        })
          .then(({data}) => {
            this.snackbar = {
              message: 'A Sub Machine has been successfully attached to the machine.',
              type: 'success',
              snackbar: true,
            };
            return data.data.subMachine
          })
          .catch(err => {
            this.snackbar = {
              message: `There was an error adding your request. Message: ${err.message}`,
              type: 'error',
              snackbar: true,
            }
          })
      },
      async modifyMachine() {
        const {machine, name} = this.form
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `mutation {
            updateSubMachine(input: {where: {id: "${this.id}"},data: {name: "${name}",machine: "${machine.id}"}}){
              subMachine{
                name
                id
                machine{
                  id
                  name
                }
              }
            }
          }`,
          },
        })
          .then(({data}) => {
            this.snackbar = {
              message: 'A Sub Machine has been successfully modified.',
              type: 'success',
              snackbar: true,
            }
            return data.data.subMachine
          })
          .catch(err => {
            this.snackbar = {
              message: `There was an error adding your request. Message: ${err.message}`,
              type: 'error',
              snackbar: true,
            }
          })
      },
      async sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      },
      async onSubmit() {
        this.loading = true;
        this.formIsDisabled = true;

        switch (this.action) {
          case 'add':
            await this.addSubMachine();
            break;
          case 'modify':
            await this.modifyMachine();
            break
        }

        this.loading = false;
        return this.sleep(500)
          .then(() => {
            this.$router.push({name: 'MachineSubMachinesForMachine', params: {id: this.form.machine.id}})
          })
      },
      async getMachines() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              machines{
                name
                id
              }
            }
          `,
          },
        })
          .then(({data}) => {
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
