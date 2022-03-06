<template>
  <line-chart
    :data="sensorData"
    :label="'Value'"
    :minimum="sensor.range? sensor.range.minimum : 0"
    :maximum="sensor.range? sensor.range.maximum : 100"
  />
</template>
<script>
  import LineChart from "../../../components/base/LimitChart";
  import moment from 'moment'
  export default {
    name: 'SensorReadingChart',
    components: {LineChart},
    props: {
      sensor: {
        default: {

        }
      },
      currentOption: {
        default: 'year'
      }
    },
    mounted() {
      this.refreshSensorData();
    },
    data() {
      return {
        sensorData: [
          { "date": "Jan2019", "views": 95 },
          { "date": "Feb2019", "views": 58 },
          { "date": "Mar2019", "views": 12 },
          { "date": "Apr2019", "views": 35 },
          { "date": "May2019", "views": 77 },
          { "date": "Jun2019", "views": 23 },
          { "date": "Jul2019", "views": 12 },
          { "date": "Aug2019", "views": 15 },
          { "date": "Sep2019", "views": 90 },
          { "date": "Oct2019", "views": 45 },
          { "date": "Nov2019", "views": 23 },
          { "date": "Dec2019", "views": 10 }
        ]
      }
    },
    watch: {
      currentOption: function () {
        this.refreshSensorData();
      }
    },
    methods: {
      refreshSensorData: async function() {
        if (this.currentOption === 'year') {
          let returnParam = [];
          const monthFrom = moment().subtract(1, 'years');
          const monthTo = moment(new Date());
          for (let m = moment(monthFrom); m.isBefore(monthTo); m.add(1, 'months')) {
            const month = m.format('MMM YYYY');
            let startOfMonth = m.startOf('month').toISOString();
            let endOfMonth = m.endOf('month').toISOString();
            //TODO: get average value for specific date
            let avgValue = await this.$axios({
              method: 'POST',
              url: '/graphql',
              data: {
                query: `{
                      sensorDataConnection(where: {createdAt_gt:"${startOfMonth}", createdAt_lt: "${endOfMonth}", MAC: "${this.sensor.MAC}"}) {
                        aggregate {
                          avg {
                            value
                          }
                        }
                      }
                    }`
              }}).then(res => {
              if (res.data.data.sensorDataConnection) {
                return res.data.data.sensorDataConnection.aggregate.avg.value
              } else {
                return null
              }
            });
            returnParam.push({ "date": month, "views": avgValue },)
          }
          this.sensorData = returnParam;
        } else if (this.currentOption === 'month') {
          let returnParam = [];
          const monthFrom = moment().subtract(1, 'months');
          const monthTo = moment(new Date());
          for (let m = moment(monthFrom); m.isBefore(monthTo); m.add(1, 'days')) {
            const month = m.format('DD MMM');
            let startOfMonth = m.startOf('day').toISOString();
            let endOfMonth = m.endOf('day').toISOString();
            //TODO: get average value for specific date
            let avgValue = await this.$axios({
              method: 'POST',
              url: '/graphql',
              data: {
                query: `{
                      sensorDataConnection(where: {createdAt_gt:"${startOfMonth}", createdAt_lt: "${endOfMonth}", MAC: "${this.sensor.MAC}"}) {
                        aggregate {
                          avg {
                            value
                          }
                        }
                      }
                    } `
              }}).then(res => {

                return res.data.data.sensorDataConnection.aggregate.avg.value

            });
            returnParam.push({ "date": month, "views": avgValue },)
          }
          this.sensorData = returnParam;
        } else {
          let returnParam = [];
          const monthFrom = moment().subtract(1, 'weeks');
          const monthTo = moment(new Date());
          for (let m = moment(monthFrom); m.isBefore(monthTo); m.add(1, 'days')) {
            const month = m.format('DD MMM');
            let startOfMonth = m.startOf('day').toISOString();
            let endOfMonth = m.endOf('day').toISOString();

            //TODO: get average value for specific date
            let avgValue = await this.$axios({
              method: 'POST',
              url: '/graphql',
              data: {
                query: `{
                      sensorDataConnection(where: {createdAt_gt:"${startOfMonth}", createdAt_lt: "${endOfMonth}", MAC: "${this.sensor.MAC}"}) {
                        aggregate {
                          avg {
                            value
                          }
                        }
                      }
                    } `
              }}).then(res => {
              if (res.data.data.sensorDataConnection.aggregate.avg.value) {
                return res.data.data.sensorDataConnection.aggregate.avg.value
              } else {
                return null
              }
            });
            returnParam.push({ "date": month, "views": avgValue },)
          }
          this.sensorData = returnParam;
        }
      }
    },
  }
</script>
