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
              v-model="currentMachine"
              color="secondary"
              item-color="secondary"
              label="Select Machine"
              return-object
              :items="options"
              item-text="name"
              item-value="id"
              @change="setCurrentOptions"
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
                    <v-list-item-title v-text="item.name.toUpperCase()"/>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
          </div>
          <v-divider class="mt-3"/>
          <v-data-table
            :headers="headers"
            :items="currentSubmachines"
            :server-items-length="count"
            :loading="loading"
            :footer-props="{
              itemsPerPageOptions: [10, 50, 100]
            }"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <div v-text="item.name"></div>
                </td>
                <td>
                  <div v-text="`2022-03-05`"></div>
                </td>
                <td>
                  <div v-text="`4`"></div>
                </td>
              </tr>
            </template>
          </v-data-table>
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
  import regression from 'regression'

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
      count: 0,
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
      options: [],
      currentMachine: {},
      currentSubmachines: []
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
            text: 'SubMachine',
            value: 'submachine_name',
          },
          {
            text: 'Predicted Date',
            value: 'pred_date',
          },
          {
            text: 'From Now',
            value: 'num_days',
          },
        ])
      }
    },
    watch: {
      currentMachine: function () {
        this.getMachines();
      },
    },
    async mounted() {
      this.loading = true;
      // Load form data
      this.options = await this.getMachines();
      this.currentMachine = this.options[0]
      await this.setCurrentOptions();
      this.loading = false
    },

    methods: {
      async setCurrentOptions () {
        this.currentSubmachines = this.currentMachine.submachines;
        this.count = this.currentSubmachines.length;
      },
      async getMachines () {
        this.loading = true;
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
                machines(where: { company: "${this.company}"})
                  {
                    id
                    name
                    submachines {
                      id
                      name
                      
                    }
                  }
              }`,
          },
        }).then(async (res) => {
          this.loading = false;
          return res.data.data.machines
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
        switch (this.currentMachine) {
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
