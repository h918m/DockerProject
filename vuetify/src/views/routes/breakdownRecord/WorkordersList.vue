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
      name="Breakdown Records"
      url="/failure-records-bulk"
      :data="data"
    />
    <base-v-component
      heading="Work orders List"
      link="components/data-tables"
    />

    <base-material-card
      color="purple"
      icon="mdi-wifi"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Work orders List
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
              class="mx-4"
              v-if="isAdmin"
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
                <span>{{item.createdAt | moment("YYYY-MM-DD HH:mm")}}</span>
              </div>
            </td>
            <td>
              <div
                class="fw-bold"
              >
                {{ item.machine ? item.machine.name : '' }}
              </div>
            </td>
            <td v-if="isAdmin">
              <div
                v-if="item.users"
              >

                <div class="body-1" v-if="getNames(item.users)">
                  {{ getNames(item.users)}}
                </div>
                <div v-else>
                  <v-icon
                    large
                    color="orange darken-2"
                  >
                    mdi-cancel
                  </v-icon>
                </div>
              </div>
            </td>
            <td v-if="isAdmin">
              <div class="body-1">
                {{item.submittedBy? item.submittedBy.name : ''}}
              </div>
            </td>
            <td>
              <div class="body-1">
                {{getWorkOrderStateText(item.workorderState)}}
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
      color="purple"
      icon="mdi-calendar"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Calendar View
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
    name: 'BreakdownRecordWorkordersList',
    components: {ExcelComponent},
    data: () => ({
      data: [],
      gotData: false,
      searchedData: [],
      currentId: '',
      count: 0,
      search: '',
      loading: true,
      options: {},
      template: {
        typeOfWork: 'mechanical',
        natureOfWork: 'planned',
        severity: 5,
        occurance: 5,
        detection: 5,
        operatorsError: false,
        startDateTime: '2007-12-03T10:15:30Z',
        endDateTime: '2007-12-03T10:16:30Z',
        requiredFollowUp: 'Description of required followup',
        stateDescription: 'State Description',
        workCarriedOut: 'Work Carried Out',
        user: 'UserID of person',
        subMachine: 'ID of SubMachine',
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
      colors: ['blue', 'indigo', 'deep-purple', 'red', 'green', 'orange'],
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
          return       ([
            {
              text: 'Work order requested',
              value: 'createdAt',
              width: '20%',
            },
            {
              text: 'Machine',
              value: 'subMachine',
            },
            {
              text: 'Assigned to',
              value: 'users',
            },
            {
              text: 'Submitted by',
              value: 'submittedBy',
            },
            {
              text: 'Status',
              value: 'workorderState',
            },
            {
              text: 'Options',
              value: 'options',
              width: '15%',
            },
          ]);
        } else {
          return  ([
            {
              text: 'Work order requested',
              value: 'createdAt',
              width: '30%',
            },
            {
              text: 'Machine',
              value: 'subMachine',
            },
            {
              text: 'Status',
              value: 'workorderState',
            },
          ])
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
          return this.getBreakdownInfo().then((res) => {
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
          return item.machine.name.toLowerCase().includes(newVal.toLowerCase());
        })
      }
    },
    async mounted() {
      // Get the Data when mounted
      this.loading = true;
      this.$refs.calendar.checkChange()
      this.data = await this.getMachinesData();
      this.searchedData = this.data;
      this.loading = false
      this.updateRange('start', 'end')
    },
    methods: {
      //TODO: get wor order state from the enum
      getWorkOrderStateText(text) {
        if (text === 'onHold') {
          return 'On hold'
        } else if (text === 'inProgress') {
          return 'In progress'
        } else if (text === 'waitingForParts') {
          return 'Waiting for parts'
        } else if (text === 'rejected') {
          return 'Rejected'
        } else if (text === 'completed') {
          return 'Completed'
        } else if (text === 'inProgress') {
          return 'In progress'
        }
      },
      getNames(aray) {
        let name = "";
        if (aray.length === 0) {
          return false;
        }
        aray.forEach(item => {
          name += item.name + ' ,'
        });
        return name.slice(0, -1);
      },
      remove() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `mutation {
            deleteFailureRecord(input:{where: {id: "${this.currentId}"} }) {
              failureRecord{
                createdAt
              }
            }
          }
        `,
          },
        })
          .then(async ({data}) => {
            this.snackbar = {
              message: 'A Breakdown has been successfully removed.',
              type: 'success',
              snackbar: true,
            };
            // Refetch Breakdowns
            await this.getBreakdownInfo().then((res) => {
              this.data = res;
              this.searchedData = res;
            });
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
        this.$router.push('/work-orders/work-order-form')
      },
      onEditClick(action, id) {
        this.$router.push({name: 'BreakdownRecordBreakdownFormAction', params: {action, id}})
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
              message: 'Are you sure you want to delete this Breakdown?',
            };
            break
        }
      },
      onClick(item) {
        if (!this.isAdmin) {
          this.$router.push({name: 'BreakdownRecordBreakdownFormAction', params: { action: 'modify', id: item.id}})
        }
      },
      async getMachinesData(payload) {
        const url = '/graphql';
        if (this.isAdmin) {
          return this.$axios({
            method: 'POST',
            url: url,
            data: {
              query: `
              {
                failureRecords(sort: "createdAt:desc", where: {natureOfWork_ne: "breakdown", company: "${this.company}"}){
                  id
                  occurance
                  createdAt
                  machine{
                    name
                    id
                  }
                  natureOfWork
                  typeOfWork
                  severity
                  detection
                  users {
                    id
                    name
                  }
                  workTime{
                    startDateTime
                    endDateTime
                  }
                  stateDescription
                  workCarriedOut
                  workorderState
                  operatorsError
                  requiredFollowUp
                   submittedBy {
                    id
                    name
                  }
                }
              }`,
            },
          })
            .then(async (res) => {
              const failureRecords = res.data.data.failureRecords;
              // Get data count
              this.count = await this.$axios({
                method: 'POST',
                url: url,
                data: {
                  query: `{
                failureRecordsConnection(where: {natureOfWork_ne: "breakdown", company: "${this.company}"}){
                  aggregate{
                    count
                  }
                }
              }`,
                },
              }).then((res) => {
                if (res.data.data.failureRecordsConnection) {
                  return res.data.data.failureRecordsConnection.aggregate.count
                } else {
                  return 0
                }
              });
              if (failureRecords) {
                return failureRecords
              } else {
                return []
              }
            })
        } else {
          return this.$axios({
            method: 'POST',
            url: url,
            data: {
              query: `
              {
                failureRecords(sort: "createdAt:desc" ,  where: {natureOfWork_ne: "breakdown", users: {id: "${this.user.id}"}, company: "${this.company}"}){
                  id
                  occurance
                  createdAt
                  machine{
                    name
                    id
                  }
                  natureOfWork
                  typeOfWork
                  severity
                  detection
                  users {
                    id
                    name
                  }
                  workTime{
                    startDateTime
                    endDateTime
                  }
                  stateDescription
                  workCarriedOut
                  workorderState
                  operatorsError
                  stateDescription
                  requiredFollowUp
                }
              }`,
            },
          })
            .then(async (res) => {
              const failureRecords = res.data.data.failureRecords;
              // Get data count
              this.count = await this.$axios({
                method: 'POST',
                url: url,
                data: {
                  query: `{
                failureRecordsConnection(where: {natureOfWork_ne: "breakdown", users: {id: "${this.user.id}"}, company: "${this.company}"}){
                  aggregate{
                    count
                  }
                }
              }`,
                },
              }).then((res) => {
                if (res.data.data.failureRecordsConnection) {
                  return res.data.data.failureRecordsConnection.aggregate.count
                } else {
                  return 0
                }
              });
              if (failureRecords) {
                return failureRecords
              } else {
                return []
              }
            })
        }

      },

      async getBreakdownInfo() {
        this.loading = true;
        let {url, limit, sortBy, sortDesc, start} = this.dataTable;
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
                  failureRecords(where: {natureOfWork_ne: "breakdown", company: "${this.company}"}, limit: ${limit || 10}, sort: "${sortBy || 'createdAt'}:${sortDesc ? 'desc' : 'asc'}", start: ${start || 0}){
                    id
                    occurance
                    createdAt
                    machine {
                      name
                      id
                    }
                    workTime{
                      startDateTime
                      endDateTime
                    }
                    users{
                      id
                      name
                    }
                    natureOfWork
                    typeOfWork
                    severity
                    detection
                    stateDescription
                    workCarriedOut
                    workorderState
                    operatorsError
                    stateDescription
                    requiredFollowUp
                    submittedBy {
                    id
                    name
                  }
                  }
                }
              `,
            },
          }).then((res) => {
            this.loading = false;
            return res.data.data.failureRecords
          }).catch((err) => console.log('error', err))
        } else {
          return this.$axios({
            method: 'POST',
            url: url || '/graphql',
            data: {
              query: `{
                  failureRecords(limit: ${limit || 10}, sort: "${sortBy || 'createdAt'}:${sortDesc ? 'desc' : 'asc'}", start: ${start || 0} , where: {natureOfWork_ne: "breakdown", users: {id: "${this.user.id}"}, company: "${this.company}"}){
                    id
                    occurance
                    createdAt
                    machine{
                      name
                      id
                    }
                    workTime{
                      startDateTime
                      endDateTime
                    }
                    users{
                      id
                      name
                    }
                    natureOfWork
                    typeOfWork
                    severity
                    detection
                    stateDescription
                    workCarriedOut
                    operatorsError
                    requiredFollowUp
                  }
                }
              `,
            },
          }).then((res) => {
            this.loading = false;
            return res.data.data.failureRecords
          }).catch((err) => console.log('error', err))
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
        const eventCount = this.count

        for (let i = 0; i < eventCount; i++) {
          const allDay = false
          const first = new Date(this.data[i].workTime.startDateTime)
          const second = new Date(this.data[i].workTime.endDateTime)
          let users = this.data[i].users.map(user => user.name)
          const name = this.data[i].typeOfWork.toUpperCase() + ' :: ' + users.toString()
          let workState = this.data[i].workorderState
          let color = 0
          const details = '<p>' + 'Machine: ' + this.data[i].machine.name + '</p>'
                        + '<p>' + 'Nature of Work: ' + this.data[i].natureOfWork + '</p>'
                        + '<p>' + 'Type of Work: ' + this.data[i].typeOfWork + '</p>'
                        + '<p>' + 'Assigned to: ' + users.toString() + '</p>'
                        + '<p>' + 'Work Time: Start: ' + first.toLocaleString() + ', End: ' + second.toLocaleString() + '</p>'
                        + '<p>' + 'Work Status: ' + this.data[i].workorderState + '</p>'
          switch (workState) {
            case ('onHold'):
              color = 0
              break;
            case ('inProgress'):
              color = 1
              break;
            case ('waitingForParts'):
              color = 2
              break;
            case ('rejected'):
              color = 3
              break;
            case ('completed'):
              color = 4
              break;
            case ('addMultiplePhotosOrAVideo'):
              color = 5
              break;
          }

          events.push({
            name: name,
            start: first,
            end: second,
            color: this.colors[color],
            timed: allDay,
            details: details
          })
        }

        this.events = events
      },
    },
  }
</script>
