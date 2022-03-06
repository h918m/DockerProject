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
    <excel-component
      v-if="data"
      :template="template"
      name="Planned Maintenances"
      url="/planned-maintenance-tasks-bulk"
      :data="data"
    />
    <base-v-component
      heading="Planned Maintenances - To be finshed"
      link="components/data-tables"
    />

    <base-material-card
      color="blue"
      icon="mdi-poll-box"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Planned Maintenances
        </div>
      </template>
      <v-divider class="mt-3"/>

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
        <template v-slot:top>
          <v-toolbar flat>
            <v-row class="mt-6">
              <v-col>
                <v-text-field
                  v-model="search"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                />
              </v-col>
              <v-col
                lg="3"
                sm="6"
                cols="10"
              >
                <v-select
                  v-model="dataTable.filter"
                  color="secondary"
                  item-color="secondary"
                  label="Filter"
                  :items="filters"
                />
              </v-col>
              <v-col
                lg="1"
                cols="2"
                sm="1"
                v-if="isAdmin"
              >
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
              </v-col>
            </v-row>
          </v-toolbar>
        </template>
        <template v-slot:item="{ item }">
          <tr v-on:click="onClick(item)">
            <td>
              <div
                class="body-1 fw-bold"
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
              >
                <div v-if="item.completed">
                  {{ item.updatedAt | moment("YYYY-MM-DD HH:mm") }}
                </div>
                <div v-else>
                  <v-icon
                    color="red"
                  >
                    mdi-close
                  </v-icon>
                </div>
              </div>
            </td>
            <td>
              <div
                class="body-1"
              >
                <span>{{ item.createdAt | moment("YYYY-MM-DD HH:mm") }}</span>
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
  import ExcelComponent from '@/components/user/ExcelComponent'
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'PlannedMaintenancePlannedMaintenanceCurrentList',
    components: {ExcelComponent},
    props: {
      filter: {
        default: 'notCompleted',
        required: false,
        type: String,
      },
    },
    data: () => ({
      data: [],
      searchedData: [],
      currentId: '',
      template: {
        completed: false,
        type: 'mechanical',
        task: 'Remove Screws',
        component: 'Screws',
        machine: 'Machine ID',
        comment: 'Additional Comment',
      },
      file: null,
      filters: [{text: 'Completed', value: 'completed'}, {text: 'All', value: 'all'}, {
        text: 'Not completed',
        value: 'notCompleted'
      }],
      count: 0,
      search: '',
      loading: true,
      options: {},
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
        filter: null,
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
        if (this.isAdmin) {
          return (
            [
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
                text: 'Completed',
                value: 'completed',
              },
              {
                text: 'Added',
                value: 'createdAt',
              },
              {
                text: 'Options',
                value: 'actions',
                width: '15%',
              },
            ]
          )
        } else {
          return (
            [
              {
                text: 'Task',
                value: 'task',
              },
              {
                text: 'Type',
                value: 'type',
              },
              {
                text: 'Completed',
                value: 'completed',
              },
              {
                text: 'Added',
                value: 'createdAt',
              }
            ]
          )
        }
      },
      getFilter() {
        return this.dataTable.filter;
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
          return this.getMaintenanceInfo().then((res) => {
            if (res) {
              this.data = res;
              this.searchedData = res;
            }
          })
        },
        deep: true,
      },
      getFilter() {
        // Refetch readings for new filter
        return this.getMaintenanceInfo().then((res) => {
          this.data = res;
          this.searchedData = res;
        })
      },
      search: function (newVal) {
        this.searchedData = this.data.filter(item => {
          return item.type.toLowerCase().includes(newVal.toLowerCase());
        })
      }
    },
    async mounted() {
      // Get the Data when mounted
      this.loading = true;
      this.dataTable.filter = this.filter;
      this.data = await this.getMaintenancesData();
      this.searchedData = this.data;
      this.loading = false
    },
    methods: {
      getNames(aray) {
        let name = "";
        if (!aray || aray.length === 0) {
          return false;
        }
        aray.forEach(item => {
          name += item.name + ' ,'
        });
        return name.slice(0, -1);
      },
      getFilterSettingsForFilter(filter) {
        switch (filter) {
          case ('all'):
            return {
              enabled: false,
              value: false,
            };
          case ('completed'):
            return {
              enabled: true,
              value: true,
            };
          case ('notCompleted'):
            return {
              enabled: true,
              value: false,
            }
        }
      },
      onClick(item) {
        if (!this.isAdmin) {
          this.$router.push({name: 'PlannedMaintenancePlannedMaintenanceCurrentFormAction', params: { action: 'modify', id: item.id}})
        }
      },
      remove() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `mutation {
            deletePlannedMaintenanceTask(input:{where: {id: "${this.currentId}"} }) {
              plannedMaintenanceTask{
                createdAt
                id
              }
            }
          }
        `,
          },
        })
          .then(async ({data}) => {
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
      onAddClick() {
        this.$router.push('/planned-maintenance/planned-maintenance-form')
      },
      onEditClick(action, id) {
        this.$router.push({name: 'PlannedMaintenancePlannedMaintenanceCurrentFormAction', params: {action, id}})
      },
      actionClicked(action, id) {
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
      async getMaintenancesData(payload) {
        const {filter} = this.dataTable;
        const filterObject = this.getFilterSettingsForFilter(filter);
        const url = '/graphql';
        if (this.isAdmin) {
          return this.$axios({
            method: 'POST',
            url: url,
            data: {
              query: `
              {
                plannedMaintenanceTasks(sort: "createdAt:desc", ${filterObject.enabled ? `where: {completed: ${filterObject.value}, company: "${this.company}"}` : `where: {company: "${this.company}"}`}){
                  id
                  completed
                  createdAt
                  updatedAt
                  users {
                    id
                    name
                  }
                  machine{
                    id
                    name
                  }
                  type
                  task
                  component
                }
              }`,
            },
          }).then(async (res) => {
            const plannedMaintenanceTasks = res.data.data.plannedMaintenanceTasks;
            // Get data count
            this.count = await this.$axios({
              method: 'POST',
              url: url,
              data: {
                query: `{
                plannedMaintenanceTasksConnection{
                  aggregate{
                    count
                  }
                }
              }`,
              },
            }).then((res) => {
              if (res.data.data.plannedMaintenanceTasksConnection) {
                return res.data.data.plannedMaintenanceTasksConnection.aggregate.count
              } else {
                return 0
              }
            });
            if (plannedMaintenanceTasks) {
              return plannedMaintenanceTasks
            } else {
              return []
            }
          });
        } else {
          return this.$axios({
            method: 'POST',
            url: url,
            data: {
              query: `
              {
                plannedMaintenanceTasks(sort: "createdAt:desc",
                ${filterObject.enabled ? `where: {users: {id: "${this.user.id}"}, completed: ${filterObject.value}, company: "${this.company}"}` : `where: {users: {id: "${this.user.id}"}, company: "${this.company}"}`}
                )
                {
                  id
                  completed
                  createdAt
                  updatedAt
                  machine{
                    id
                    name
                  }
                  type
                  task
                  component
                }
              }`,
            },
          }).then(async (res) => {
            const plannedMaintenanceTasks = res.data.data.plannedMaintenanceTasks;
            // Get data count
            this.count = await this.$axios({
              method: 'POST',
              url: url,
              data: {
                query: `{
                plannedMaintenanceTasksConnection (${filterObject.enabled ? `where: {users: {id: "${this.user.id}"}, completed: ${filterObject.value}}` : `where: {users: {id: "${this.user.id}"}}`}) {
                  aggregate{
                    count
                  }
                }
              }`,
              },
            }).then((res) => {
              if (res.data.data.plannedMaintenanceTasksConnection) {
                return res.data.data.plannedMaintenanceTasksConnection.aggregate.count
              } else {
                return 0
              }
            });
            if (plannedMaintenanceTasks) {
              return plannedMaintenanceTasks
            } else {
              return []
            }
          });
        }

      },

      async getMaintenanceInfo() {
        this.loading = true;
        let {url, limit, sortBy, sortDesc, start, filter} = this.dataTable;
        const filterObject = this.getFilterSettingsForFilter(filter);
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
                plannedMaintenanceTasks(
                limit: ${limit || 10},
                sort: "${sortBy || 'createdAt'}:${sortDesc ? 'desc' : 'asc'}",
                start: ${start || 0},
                ${filterObject.enabled ? `where: {completed: ${filterObject.value}, company: "${this.company}"}` : `where: {company: "${this.company}"}`}
                ){
                  id
                  completed
                  type
                  task
                  createdAt
                  updatedAt
                  component
                  users {
                    id
                    name
                  }
                  machine{
                    id
                    name
                  }
                }
            }`,
            },
          })
            .then((res) => {
              this.loading = false;
              if (res.data.data.plannedMaintenanceTasks) {
                return res.data.data.plannedMaintenanceTasks
              } else {
                return []
              }
            })
            .then(async (result) => {
              // Get new data count
              this.count = await this.$axios({
                method: 'POST',
                url: url || '/graphql',
                data: {
                  query: `{
                    plannedMaintenanceTasksConnection ${filterObject.enabled ?
                    `(where: {completed: ${filterObject.value}, company: "${this.company}"})`
                    : `(where: {company: "${this.company}"})`}
                    {
                      aggregate{
                        count
                      }
                    }
                  }`,
                },
              }).then((res) => {
                if (res.data.data.plannedMaintenanceTasksConnection) {
                  return res.data.data.plannedMaintenanceTasksConnection.aggregate.count
                } else {
                  return 0;
                }
              });
              if (result) {
                return result
              } else {
                return []
              }
            })
        } else {
          return this.$axios({
            method: 'POST',
            url: url || '/graphql',
            data: {
              query: `{
                plannedMaintenanceTasks(
                limit: ${limit || 10},
                sort: "${sortBy || 'createdAt'}:${sortDesc ? 'desc' : 'asc'}",
                start: ${start || 0},
                ${filterObject.enabled ? `where: {users: {id: "${this.user.id}"}, completed: ${filterObject.value}, company: "${this.company}"}` : `where: {users: {id: "${this.user.id}"}, company: "${this.company}"}`}
                ){
                  id
                  completed
                  type
                  task
                  createdAt
                  updatedAt
                  component
                  machine{
                    id
                    name
                  }
                }
            }`,
            },
          })
            .then((res) => {
              this.loading = false;
              if (res.data.data.plannedMaintenanceTasks) {
                return res.data.data.plannedMaintenanceTasks
              } else {
                return []
              }
            })
            .then(async (result) => {
              // Get new data count
              this.count = await this.$axios({
                method: 'POST',
                url: url || '/graphql',
                data: {
                  query: `{
                    plannedMaintenanceTasksConnection (${filterObject.enabled ? `where: {users: {id: "${this.user.id}"}, completed: ${filterObject.value}, company: "${this.company}"}` : `where: {users: {id: "${this.user.id}"}, company: "${this.company}"}`}){
                      aggregate{
                        count
                      }
                    }
                  }`,
                },
              }).then((res) => {
                if (res.data.data.plannedMaintenanceTasksConnection) {
                  return res.data.data.plannedMaintenanceTasksConnection.aggregate.count
                } else {
                  return 0;
                }
              })
              if (result) {
                return result
              } else {
                return []
              }
            })
        }

      },
    },
  }
</script>
