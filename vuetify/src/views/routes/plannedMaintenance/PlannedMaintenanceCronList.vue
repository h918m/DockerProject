<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <excel-component
      v-if="data"
      :template="template"
      name="Planned Maintenance Time Functions"
      url="/planned-maintenances-bulk"
      :data="data"
    />
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
      heading="Planned Maintenances - Time Functions"
      link="components/data-tables"
    />

    <base-material-card
      color="blue"
      icon="mdi-clock-outline"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Planned Maintenances - Time Functions
        </div>
      </template>
      <v-divider class="mt-3" />

      <v-data-table
        :headers="headers"
        :items="searchedData"
        :server-items-length="count"
        :options.sync="options"
        :loading="loading"
        :footer-props="{
          itemsPerPageOptions: [10, 50, 100]
        }"
      >
        <template v-slot:top v-if="isAdmin">
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              class="mx-4 mt-4"
            />
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
                class="body-1"
              >
                <span>{{ item.task }}</span>
              </div>
            </td>
            <td>
              <div
                class="body-1"
              >
                {{ item.type | capitalize }}
              </div>
            </td>
            <td v-if="isAdmin">
              <div class="body-1" v-if="getNames(item.users)">
                {{ getNames(item.users)}}
              </div>
            </td>
            <td>
              <div
                class="body-1"
                v-text="item.component"
              />
            </td>
            <td>
              <div
                class="body-1"
              >
                {{ item.repeating | capitalize | replaceUnderscoreWithSpace }}
              </div>
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
          <v-spacer />

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
import { mapState, mapGetters } from 'vuex'
import ExcelComponent from '@/components/user/ExcelComponent'

export default {
  name: 'PlannedMaintenancePlannedMaintenanceCronList',
  components: { ExcelComponent },
  data: () => ({
    data: [],
    searchedData: [],
    currentId: '',
    count: 0,
    search: '',
    loading: true,
    options: {},
    template: {
      type: 'mechanical',
      task: 'Check screws',
      component: 'Screws',
      repeating: 'daily_at_9am',
      machine: 'machine name',
      users: 'user name'
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
    dataTable: {
      page: 1,
      start: 0,
      sortDesc: true,
      sortBy: 'received',
      limit: 10,
      url: '/graphql',
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
      user: state => state.auth.user,
      company: state => state.auth.company.id
    }),
    ...mapGetters({
      isAdmin: 'auth/isAdmin'
    }),
    headers: function() {
      if(this.isAdmin) {
        return ( [
          {
            text: 'Task',
            value: 'task',
          },
          {
            text: 'Type',
            value: 'type',
          },
          {
            text: 'Assigned to',
            value: 'users',
          },
          {
            text: 'Component',
            value: 'component',
          },
          {
            text: 'Repeating',
            value: 'repeating',
          },
          {
            text: 'Options',
            value: 'options',
            width: '15%',
          },
        ])
      } else {
        return ([
          {
            text: 'Task',
            value: 'task',
          },
          {
            text: 'Type',
            value: 'type',
          },
          {
            text: 'Component',
            value: 'component',
          },
          {
            text: 'Repeating',
            value: 'repeating',
          },
        ])
      }
    },
    baseAPIUrl () {
      return process.env.VUE_APP_API_BASE_URL
    },
  },
  watch: {
    options: {
      async handler (newOptions) {
          // Set the data to match the database query
          this.dataTable.page = newOptions.page;
          this.dataTable.limit = newOptions.itemsPerPage;
          this.dataTable.sortDesc = newOptions.sortDesc[0];
          this.dataTable.sortBy = newOptions.sortBy[0];
          this.dataTable.start = this.dataTable.limit * (this.dataTable.page - 1);
          // Refetch readings with new options
          return this.getMaintenanceInfo().then((res) => {
            if (res) {
              this.data = res;
              this.searchedData = res;
            }
          })
      },
      deep: true,
    },
    search: function (newVal) {
      this.searchedData = this.data.filter(item => {
        return item.type.toLowerCase().includes(newVal.toLowerCase());
      })
    }
  },
  async mounted () {
    // Get the Data when mounted
    this.loading = true;
    this.data = await this.getMaintenancesData();
    this.searchedData = this.data;
    this.loading = false
  },
  methods: {
    //TODO: get user names from the array
    getNames(aray) {
      let name = " ";
      if (!aray || aray.length === 0) {
        return false;
      }
      aray.forEach(item => {
        name += item.name + ' ,'
      });
      return name.slice(0, -1);
    },


    remove () {
      return this.$axios({
      method: 'POST',
      url: '/graphql',
      data: {
        query: `mutation {
          deletePlannedMaintenance(input:{where: {id: "${this.currentId}"} }) {
            plannedMaintenance{
              id
            }
          }
        }
      `,
      },
    })
      .then(async ({ data }) => {
        this.snackbar = {
          message: 'A Maintenance has been successfully removed.',
          type: 'success',
          snackbar: true,
        };
        // Refetch Maintenances
          await this.getMaintenanceInfo().then((res) => {
            this.data = res;
            this.searchedData = res;
          });
        return data.data.MaintenancesToModel
        })
      .catch(err => {
        this.snackbar = {
          message: `There was an error adding your request. Message: ${err.message}`,
          type: 'error',
          snackbar: true,
        }
      })
    },
    onAddClick () {
      this.$router.push('/planned-maintenance/planned-maintenance-form')
    },
    onEditClick (action, id) {
      this.$router.push({ name: 'PlannedMaintenancePlannedMaintenanceCronFormAction', params: { action, id } })
    },
    onClick(item) {
      if (!this.isAdmin) {
        this.$router.push({ name: 'PlannedMaintenancePlannedMaintenanceCronFormAction', params: { action: 'modify', id: item.id}})
      }
    },
    actionClicked (action, id) {
      // Setting up the current ID which can be accessed from dialog
      this.currentId = id;
      switch (action) {
        case ('modify'):
          this.onEditClick(action, id);
          break;
        case ('remove'):
          this.removeDialog = {
            state: true,
            message: 'Are you sure you want to delete this Repeating Maintenance?',
          };
          break
      }
    },
    async getMaintenancesData (payload) {
      const url = '/graphql';
      if (this.isAdmin) {
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `
            {
              plannedMaintenances(where: {company: "${this.company}"}, sort: "createdAt:desc"){
                  id
                  repeating
                  task
                  type
                  component
                  machine{
                    id
                    name
                  }
                  users {
                      id
                      name
                  }
              }
            }`,
          },
        })
          .then(async (res) => {
            const plannedMaintenances = res.data.data.plannedMaintenances;
            // Get data count
            this.count = await this.$axios({
              method: 'POST',
              url: url,
              data: {
                query: `{
              plannedMaintenancesConnection(where: {company: "${this.company}"}){
                aggregate{
                  count
                }
              }
            }`,
              },
            }).then((res) => {
              if (res.data.data.plannedMaintenancesConnection) {
                return res.data.data.plannedMaintenancesConnection.aggregate.count;
              } else {
                return 0;
              }
            });
            if (plannedMaintenances) {
              return plannedMaintenances
            } else {
              return []
            }
          })
          .catch(err => {
            return []
          })
      } else {
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `
            {
              plannedMaintenances(sort: "createdAt:desc", where: {users: {id: "${this.user.id}"}, company: "${this.company}"}){
                  id
                  repeating
                  task
                  type
                  component
                  machine{
                    id
                    name
                  }
                  users {
                      id
                      name
                  }
              }
            }`,
          },
        })
          .then(async (res) => {
            const plannedMaintenances = res.data.data.plannedMaintenances;
            // Get data count
            this.count = await this.$axios({
              method: 'POST',
              url: url,
              data: {
                query: `{
              plannedMaintenancesConnection(where: {users: {id: "${this.user.id}"}, company: "${this.company}"}){
                aggregate{
                  count
                }
              }
            }`,
              },
            }).then((res) => {
              if (res.data.data.plannedMaintenancesConnection) {
                return res.data.data.plannedMaintenancesConnection.aggregate.count;
              } else {
                return 0;
              }
            });
            return plannedMaintenances
          })
          .catch(err => {
            return []
          })
      }

    },

  async getMaintenanceInfo () {
      this.loading = true;
      let { url, limit, sortBy, sortDesc, start } = this.dataTable;
      // Sort desc when undefined (setting up the first load to be descending to show the latest first)
      if (sortDesc === undefined) {
        sortDesc = true
      }
      if (this.isAdmin) {
        return this.$axios({
          method: 'POST',
          url: url || '/graphql',
          data: {
            query: `{
              plannedMaintenances(where: {company: "${this.company}"}, limit: ${limit || 10}, sort: "${sortBy || 'createdAt'}:${sortDesc ? 'desc' : 'asc'}", start: ${start || 0}){
                  id
                  repeating
                  task
                  type
                  component
                  machine{
                    id
                    name
                  }
                  users {
                      id
                      name
                  }
              }
          }`,
          },
        }).then((res) => {
          this.loading = false;
          return res.data.data.plannedMaintenances
        })
          .catch((err) => console.log('error', err))
      } else {
        return this.$axios({
          method: 'POST',
          url: url || '/graphql',
          data: {
            query: `{
              plannedMaintenances(where: {users: {id: "${this.user.id}"}, company: "${this.company}"}, limit: ${limit || 10}, sort: "${sortBy || 'createdAt'}:${sortDesc ? 'desc' : 'asc'}", start: ${start || 0}){
                  id
                  repeating
                  task
                  type
                  component
                  machine{
                    id
                    name
                  }
                  users {
                      id
                      name
                  }
              }
          }`,
          },
        }).then((res) => {
          this.loading = false;
          return res.data.data.plannedMaintenances
        })
          .catch((err) => console.log('error', err))
      }

    },
  },
}
</script>
