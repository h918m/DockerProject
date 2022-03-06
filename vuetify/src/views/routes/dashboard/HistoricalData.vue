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
      v-if="items"
      :template="template"
      name="Sensor Reading"
      url="/failure-records-bulk"
      :data="items"
    />
    <base-v-component
      :heading="data ? data.name : ''"
      link="components/data-tables"
    />

    <base-material-card
      color="indigo"
      icon="mdi-database"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          {{ data ? data.name : "There is no Machine"}}
        </div>
      </template>
      <v-divider class="mt-3"/>

      <v-data-table
        :headers="headers"
        :items="items"
        :server-items-length="count"
        :options.sync="options"
        :loading="loading"
        :footer-props="{
          itemsPerPageOptions: [10, 50, 100]
        }"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <div
                class="body-1"
              >
                <span>{{item.createdAt | moment("YYYY-MM-DD HH:mm")}}</span>
              </div>
            </td>
            <td>
              <div
                class="body-1"
              >
                <span>{{item.value}}</span>
              </div>
            </td>
<!--            <td>-->
<!--              <div-->
<!--                class="fw-bold"-->
<!--              >-->
<!--                {{ item.machine ? item.machine.name : '' }}-->
<!--              </div>-->
<!--            </td>-->
          </tr>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import ExcelComponent from '@/components/user/ExcelComponent'
  import {mapState} from 'vuex'

  export default {
    name: 'DashboardHistoricalData',
    components: {ExcelComponent},
    props: {
      id: {
        default: '0',
        type: String,
        required: true,
      },
    },
    data: () => ({
      data: {sensorModelInfo: {}},
      count: 0,
      search: undefined,
      loading: true,
      options: {},
      template: {
        createdAt: '2007-12-03T10:15:30Z',
        value: 0,
        MAC: '12:12:12:12:12:12'
      },
      dataTable: {
        MAC: '',
        page: 1,
        start: 0,
        sortDesc: true,
        sortBy: 'createdAt',
        limit: 10,
        url: '/graphql',
      },
    }),
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
      }),
      items() {
        const res = [];
        try {
          this.data.sensorReadings.forEach((reading) => {
            res.push({...reading, createdAt: reading.createdAt})
          })
        } catch (err) {
        }
        return res
      },
      headers() {
        // Res will be headers object in format text + value
        const res = [];
        res.push(
          {
            text: 'Received',
            value: 'createdAt',
          },
          {
            text: 'Value',
            value: 'value',
          },
        );
        return res
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
          this.getSensorReadings().then((res) => {
            this.data.sensorReadings = res
          })
        },
        deep: true,
      },
    },
    async mounted() {
      // Get the Data when mounted
      this.loading = true;
      this.data = await this.getSensorData();
      this.loading = false
    },
    methods: {
      async getSensorData(payload) {
        const url = '/graphql';
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `
              {
              sensorsToModels(where:{id:"${this.id}"},){
                name
                MAC
              }
            }`,
          },
        })
          .then(async (res) => {
            const sensorReadings = res.data.data.sensorsToModels[0];
            if (sensorReadings) {
              this.dataTable.MAC = sensorReadings.MAC;

              // Get data count
              this.count = await this.$axios({
                method: 'POST',
                url: url,
                data: {
                  query: `{
                sensorDataConnection(where:{MAC:"${this.dataTable.MAC}"}){
                  aggregate{
                    count
                  }
                }
              }`,
                },
              }).then((res) => {
                if (res.data.data.sensorDataConnection) {
                  return res.data.data.sensorDataConnection.aggregate.count
                } else {
                  return 0
                }
              });

              // Get data for MAC address
              sensorReadings.sensorReadings = await this.getSensorReadings();
              return sensorReadings;
            } else {
              return []
            }

          })
      },

      async getSensorReadings() {
        this.loading = true;
        let {url, MAC, limit, sortBy, sortDesc, start} = this.dataTable;
        // Sort desc when undefined (setting up the first load to be descending to show the latest first)
        if (sortDesc === undefined) {
          sortDesc = true
        }
        return this.$axios({
          method: 'POST',
          url: url || '/graphql',
          data: {
            query: `{
                sensorData(where: {MAC:"${MAC}"}, limit: ${limit || 10}, sort: "${sortBy || 'createdAt'}:${sortDesc ? 'desc' : 'asc'}", start: ${start || 0}){
                  formattedData
                  value
                  createdAt
                  MAC
                }
              }`,
          },
        }).then((res) => {
          this.loading = false;
          if (res.data.data.sensorData) {
            return res.data.data.sensorData
          } else {
            return []
          }
        })
      },
    },
  }
</script>
