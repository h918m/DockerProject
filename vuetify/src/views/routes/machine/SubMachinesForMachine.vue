<template>
  <v-container
    id="data-tables"
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

    <machines-form
      :id="id"
      action="modify"
    />
    <base-v-component
      heading="Sub Machines"
      link="components/data-tables"
    />

    <base-material-card
      color="purple"
      icon="mdi-cog"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          {{ data ? data.name : ''}} - Sub Machines
        </div>
      </template>
      <v-divider class="mt-3"/>

      <v-data-table
        :headers="headers"
        :items="data.subMachines"
        :server-items-length="count"
        :options.sync="options"
        :loading="loading"
        :footer-props="{
          itemsPerPageOptions: [10, 50, 100]
        }"
      >
        <template v-slot:top v-if="isAdmin">
          <v-toolbar flat>
            <v-spacer/>
            <v-btn
              elevation="1"
              color="green"
              dark
              min-width="0"
              max-width="41"
            >
              <v-icon
                @click="onAddClick"
                v-text="'mdi-plus'"
              />
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item="{ item }">
          <tr v-on:click="onClick(item)">
            <td>
              <div
                class="purple--text headline"
                v-text="item ? item.name : ''"
              />
            </td>
            <td v-if="isAdmin">
              <v-btn
                v-for="(action, actionIndex) in actions"
                :key="actionIndex"
                fab
                icon
                @click="actionClicked(action.action, item.id)"
              >
                <v-icon
                  large
                  :color="action.color"
                  v-text="action.icon"
                />
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </base-material-card>
    <v-dialog
      v-model="removeDialog.state"
      max-width="300"
    >
      <v-card>
        <v-card-title>
          {{ removeDialog.message }}
          <v-spacer/>

          <v-icon
            aria-label="Close"
            @click="dialog3 = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text class="pb-6 pt-12 text-center">
          <v-btn
            class="mr-3"
            text
            @click="removeDialog.state = false"
          >
            No
          </v-btn>

          <v-btn
            color="success"
            text
            @click="[removeDialog.state = false, remove()]"
          >
            Yes
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
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
  import MachinesForm from '@/views/routes/machine/MachineForm'

  export default {
    name: 'MachineSubMachinesForMachine',
    components: {MachinesForm},
    props: {
      id: {
        default: '0',
        type: String,
        required: true,
      },
    },
    data: () => ({
      data: [],
      count: 0,
      search: undefined,
      loading: true,
      options: {},
      currentId: null,
      dataTable: {
        page: 1,
        start: 0,
        sortDesc: true,
        sortBy: 'received',
        limit: 10,
        url: '/graphql',
      },
      removeDialog: {
        state: false,
        message: '',
      },
      snackbar: {
        snackbar: false,
        type: 'success',
        message: '',
      },
      actions: [
        {
          color: 'blue',
          icon: 'mdi-cog',
          action: 'modify',
        },
        {
          color: 'red',
          icon: 'mdi-minus-circle-outline',
          action: 'remove',
        },
      ],
    }),
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
      }),
      ...mapGetters({
        isAdmin: 'auth/isAdmin'
      }),
      headers: function() {
        if (this.isAdmin) {
          return ( [
            {
              text: 'Name',
              value: 'name',
              width: '85%',
            },
            {
              text: 'Options',
              value: 'options',
              width: '15%',
            },
          ])
        } else {
          return (
            [
              {
                text: 'Name',
                value: 'name',
              }
            ]
          )
        }
      },
      baseAPIUrl() {
        return process.env.VUE_APP_API_BASE_URL
      },
    },
    watch: {
      options: {
        async handler(newOptions) {
          // Set the data to match the database query
          this.dataTable.page = newOptions.page;
          this.dataTable.limit = newOptions.itemsPerPage;
          this.dataTable.sortDesc = newOptions.sortDesc[0];
          this.dataTable.sortBy = newOptions.sortBy[0];
          this.dataTable.start = this.dataTable.limit * (this.dataTable.page - 1);
          // Refetch readings with new options
          this.getMachineReadings().then((res) => {
            if (res) {
              this.data = res
            }
          })
        },
        deep: true,
      },
    },
    async mounted() {
      // Get the Data when mounted
      this.loading = true;
      this.data = await this.getMachinesData();
      this.loading = false
    },
    methods: {
      onAddClick() {
        this.$router.push('/sub-machine/submachine-form')
      },
      actionClicked(action, id) {
        this.currentId = id;
        switch (action) {
          case ('modify'):
            this.modifySubMachine(id);
            break;
          case 'remove':
            this.removeDialog = {
              state: true,
              message: 'Are you sure you want to delete this sub machine?',
            };
            break;
          default:
            break
        }
      },
      modifySubMachine(id) {
        this.$router.push({name: 'SubMachineSubMachineFormAction', params: {action: 'modify', id, machineId: this.id}})
      },
      onClick(item) {
        if (!this.isAdmin) {
          this.$router.push({name: 'SubMachineSubMachineFormAction', params: { action: 'modify', id: item.id, machineId: this.id}});
        }
      },
      remove() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `mutation {
              deleteSubMachine(input:{where: {id: "${this.currentId}"} }) {
                subMachine{
                  name
                }
              }
            }
          `,
          },
        })
          .then(async ({data}) => {
            this.snackbar = {
              message: 'Sub Machine has been successfully removed.',
              type: 'success',
              snackbar: true,
            };
            // Refetch Sensors
            await this.getMachineReadings().then((res) => {
              this.data = res
            });
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
      async getMachinesData(payload) {
        const url = '/graphql';
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `
              {
                machine(id: "${this.id}"){
                  name
                  subMachines{
                    id
                    name
                  }
                }
            }`,
          },
        }).then(async (res) => {
          const machine = res.data.data.machine;
          // Get data count
          this.count = await this.$axios({
            method: 'POST',
            url: url,
            data: {
              query: `{
                subMachinesConnection(where: {machine: "${this.id}"}){
                  aggregate{
                    count
                  }
                }
              }`,
            },
          }).then((res) => {
            if (res.data.data.subMachinesConnection.aggregate.count) {
              return res.data.data.subMachinesConnection.aggregate.count
            } else {
              return 0
            }
          });
          if (machine) {
            return machine
          } else {
            return []
          }
        })
      },

      async getMachineReadings() {
        this.loading = true;
        let {url, limit, sortBy, sortDesc, start} = this.dataTable;
        // Sort desc when undefined (setting up the first load to be descending to show the latest first)
        if (sortDesc === undefined) {
          sortDesc = true
        }
        return this.$axios({
          method: 'POST',
          url: url || '/graphql',
          data: {
            query: `{
                machine(id: "${this.id}"){
                  name
                  subMachines(limit: ${limit || 10}, sort: "${sortBy || 'name'}:${sortDesc ? 'desc' : 'asc'}", start: ${start || 0}){
                    id
                    name
                  }
                }
              }`,
          },
        }).then((res) => {
          this.loading = false;
          return res.data.data.machine
        })
          .catch((err) => console.log('error', err))
      },
    },
  }
</script>

<style>
  .table-img {
    width: 128px;
    height: 128px;
  }
</style>
