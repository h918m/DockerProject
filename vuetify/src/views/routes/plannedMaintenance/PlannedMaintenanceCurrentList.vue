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
      icon="mdi-chart-box"
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
              <v-col
                lg="8"
                sm="8"
                cols="4"
                xs="4"
              >
                <v-text-field
                  v-model="search"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                />
              </v-col>
              <v-col
                lg="3"
                sm="3"
                cols="6"
                xs="6"
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
                xs="2"
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
    <base-material-card
      color="blue"
      icon="mdi-calendar"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Calendar viewDay
        </div>
      </template>
      <v-divider class="mt-3"/>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
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
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
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
              this.updateRange('start', 'end')
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
          this.updateRange('start', 'end')
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
      this.updateRange('start', 'end')
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
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      async updateRange ({ start, end }) {
        const events = []
        const eventCount = this.searchedData.length

        for (let i = 0; i < eventCount; i++) {
          const allDay = false
          const first = new Date(this.data[i].createdAt)
          let second = new Date()
          let color = 'blue'
          if (this.data[i].completed) {
            second = new Date(this.data[i].updatedAt)
            color = 'green'
          }
          else  {
            second = new Date()
          }
          let users = this.data[i].users.map(user => user.name)
          const name = this.data[i].type.toUpperCase() + ' :: ' + users.toString()
          const details = '<p>' + 'Machine: ' + this.data[i].machine.name + '</p>'
                        + '<p>' + 'Type of Work: ' + this.data[i].type + '</p>'
                        + '<p>' + 'Assigned to: ' + users.toString() + '</p>'
                        + '<p>' + 'Task: ' + this.data[i].task + '</p>'
                        + '<p>' + 'Completed: ' + `${ this.data[i].completed ? 'Yes' : 'No'}` + '</p>'
          events.push({
            name: name,
            start: first,
            end: second,
            color: color,
            timed: allDay,
            details: details
          })
        }

        this.events = events
      },
    },
  }
</script>
