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
        cols="10"
      >
        <base-material-card
          color="success"
          icon="mdi-desktop-mac-dashboard"
          title=""
          class="px-5 py-3"
        >
          <template v-slot:after-heading>
            <div class="display-2 font-weight-light">
              Machine Learning Result View
            </div>
          </template>
          <div id="period">
            <v-select
              v-model="currentSubmachine"
              color="secondary"
              item-color="secondary"
              label="Select Submachine"
              return-object
              :items="options"
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
                    <v-list-item-title v-text="item.toUpperCase()"/>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
          </div>
          <v-divider class="mt-3"/>
          <v-row>
            <v-col md="4">
              <v-card elevation="5" style="height: 27rem">
                <v-card-title class="justify-center">Work Orders Status</v-card-title>
                <v-divider class="mx-4"></v-divider>
                <v-card-text class="text-center">
                  <v-progress-circular
                    :value="wo_completed_percent"
                    size="300"
                    width="40"
                    color="deep-orange lighten-2"
                    style="max-width: 100%"
                  >
                    <p style="font-size: 4rem">{{wo_completed_count + '/' + wo_total_count }}</p>
                  </v-progress-circular>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="4">
              <v-layout row wrap class="mt-3">
                <v-flex d-flex>
                  <v-card elevation="5" style="width: 100%;height:10rem">
                    <v-card-title class="justify-center">Completed Work Orders</v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-text class="text-center mt-4">
                      <p style="font-size: 4rem">{{wo_completed_count}}</p>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex d-flex>
                  <v-card elevation="5" style="width: 100%;height:10rem">
                    <v-card-title class="justify-center">InCompleted Work Orders</v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-text class="text-center mt-4">
                      <p style="font-size: 4rem">{{wo_incompleted_count}}</p>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-col>
            <v-col md="4">
              <v-card elevation="5" style="height: 27rem">
                <v-card-title class="justify-center">Total Work Orders</v-card-title>
                <v-divider class="mx-4"></v-divider>
                <v-card-text class="text-center mt-15">
                  <p style="font-size: 6rem;color:#990000" class="mt-10">{{wo_total_count }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
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
  import moment from 'moment'

  export default {
    name: 'DashboardML',
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
      data: [],
      firstday: '',
      lastday: '',
      workOrders: [],
      plannedMaintenances: [],
      searchedData: [],
      wo_total_count: 0,
      wo_completed_count: 0,
      wo_incompleted_count: 0,
      wo_completed_percent: 0,
      wo_incompleted_percent: 0,
      search: '',
      loading: true,
      dataTable: {
        page: 1,
        start: 0,
        sortDesc: true,
        sortBy: 'received',
        limit: 10,
        url: '/graphql',
      },
      snackbar: {
        snackbar: false,
        type: 'success',
        message: '',
      },
      options: ['year', 'month', 'week', 'day'],
      currentSubmachine: 'week'
      
    }),
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
        company: state => state.auth.company.id
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
      headers: function() {
        return (     [
          {
            text: 'Status',
            value: 'status',
          },
          {
            text: 'Completed',
            value: 'completed',
          },
          {
            text: 'In Progress',
            value: 'incomplete',
          },
          {
            text: 'Total',
            value: 'total',
          },
        ])
      }
    },
    watch: {
      currentSubmachine: function () {
        this.getWorkOrders();
      },
    },
    async mounted() {
      this.loading = true;
      // Load form data
      this.wo_total_count = await this.getWorkOrders();
      this.loading = false
    },

    methods: {
      async getSubmachines () {
        this.loading = true;
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
                subMachines(where: { company: "${this.company}"})
                  {
                    id
                    name
                    
                  }
              }`,
          },
        }).then(async (res) => {
          console.log(res)
          this.wo_completed_count = await this.$axios({
            method: 'POST',
            url: '/graphql',
            data: {
              query: `{
                failureRecordsConnection(where: {workorderState: "completed", company: "${this.company}", endDateTime_gte: "${this.firstday}", endDateTime_lte: "${this.lastday}"}){
                  aggregate{
                    count
                  }
                }
              }`,
            },
          });
          this.wo_total_count = res.data.data.failureRecordsConnection.aggregate.count
          this.wo_completed_count = this.wo_completed_count.data.data.failureRecordsConnection.aggregate.count
          this.wo_incompleted_count = this.wo_total_count - this.wo_completed_count
          this.wo_completed_percent = this.wo_completed_count / this.wo_total_count *100
          if (this.wo_total_count == 0) {
            this.wo_completed_count = 0
            this.wo_completed_percent = 0
          }
          this.wo_incompleted_percent = this.wo_incompleted_count / this.wo_total_count *100
          this.loading = false;
          return res.data.data.failureRecordsConnection.aggregate.count
        })
      },
      async getWorkOrders() {
        this.loading = true;
        this.setDuration()
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
                failureRecordsConnection(where: { company: "${this.company}", endDateTime_gt: "${this.firstday}", endDateTime_lt: "${this.lastday}",})
                  {
                    aggregate {
                      count
                    }
                  }
              }`,
          },
        }).then(async (res) => {
          console.log(res)
          this.wo_completed_count = await this.$axios({
            method: 'POST',
            url: '/graphql',
            data: {
              query: `{
                failureRecordsConnection(where: {workorderState: "completed", company: "${this.company}", endDateTime_gte: "${this.firstday}", endDateTime_lte: "${this.lastday}"}){
                  aggregate{
                    count
                  }
                }
              }`,
            },
          });
          this.wo_total_count = res.data.data.failureRecordsConnection.aggregate.count
          this.wo_completed_count = this.wo_completed_count.data.data.failureRecordsConnection.aggregate.count
          this.wo_incompleted_count = this.wo_total_count - this.wo_completed_count
          this.wo_completed_percent = this.wo_completed_count / this.wo_total_count *100
          if (this.wo_total_count == 0) {
            this.wo_completed_count = 0
            this.wo_completed_percent = 0
          }
          this.wo_incompleted_percent = this.wo_incompleted_count / this.wo_total_count *100
          this.loading = false;
          return res.data.data.failureRecordsConnection.aggregate.count
        })
      },
      setDuration() {
        switch (this.currentSubmachine) {
          case ('year'):
            this.firstday = moment().subtract(0, 'years').startOf('year').toISOString();
            this.lastday = moment().subtract(0, 'years').endOf('year').toISOString();
            break;
          case ('month'):
            this.firstday = moment().subtract(0, 'months').startOf('month').toISOString();
            this.lastday = moment().subtract(0, 'months').endOf('month').toISOString();
            break;
          case ('week'):
            this.firstday = moment().subtract(0, 'weeks').startOf('week').toISOString();
            this.lastday = moment().subtract(0, 'weeks').endOf('week').toISOString();
            break;
          case ('day'):
            this.firstday = moment().subtract(0, 'days').startOf('day').toISOString();
            this.lastday = moment().subtract(0, 'days').endOf('day').toISOString();
            break;
        }
      }
    },
  }
</script>
