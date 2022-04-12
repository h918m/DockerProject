<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-if="!loading"
        cols="12"
      >
        <v-row
        >
          <v-col
            cols="12"
            class="pb-0"
          >
            <!-- Machines List -->

            <h1>{{ machine? machine.name : '' }}</h1>
          </v-col>
        </v-row>
        <v-row
          justify="end"
        >
          <v-col
            cols="12"
            md="6"
            class="pb-0"
          >
            <v-select
              v-model="currentOption"
              color="secondary"
              item-color="secondary"
              label="Select duration"
              return-object
              :items="options"
              item-text="name"
              item-value="id"
              outlined
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
                    <v-list-item-title v-text="'1 ' + item" />
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <!-- Sub Machine -->
          <v-col
            cols="12"
            class="pt-0"
            v-if="machine"
          >
            <v-col
              cols="12"
              v-for="sensor in machine.sensors_to_models"
              :key="sensor.key"
            >
              <v-row v-if="sensor.sensorReadings[0]">
                <v-col
                  v-for="(_, formattedDataIndex) in Object.keys(sensor.sensorReadings[0].formattedData)"
                  :key="formattedDataIndex"
                  cols="12"
                  md="4"
                  @click="sensor? openHistoricalData(sensor.id) : openHistoricalData('')"
                >

                  <base-material-card
                    id="multiple-bar"
                    :color="getColorForSensor(getRangesForDataName(sensor,Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]), Object.values(sensor.sensorReadings[0].formattedData)[0])"
                    icon="mdi-access-point"
                    class="px-4 py-3"
                    v-if="sensor.model !== 'call'"
                  >
                    <template v-slot:after-heading>
                      <div class="display-1 mt-2 font-weight-light">
                        {{ sensor.name }}
                        <span class="subtitle-1">— {{ getSymbolForDataName(sensor, Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]).name }}</span>
                      </div>
                    </template>

                    <div
                      v-if="sensor.model === 'indicator'"
                      class="d-flex justify-center pt-4 pb-4"
                    >
                      <v-avatar
                        :color="Object.values(sensor.sensorReadings[0].formattedData)[formattedDataIndex]===0? 'red' : 'green'"
                        size="150"
                      >
                        <span class="white--text headline">{{Object.values(sensor.sensorReadings[0].formattedData)[formattedDataIndex]===0? 'OFF' : 'ON'}}</span>
                      </v-avatar>
                    </div>
                    <vue-svg-gauge
                      v-else
                      :value="Object.values(sensor.sensorReadings[0].formattedData)[formattedDataIndex]"
                      :min="getRangesForDataName(sensor,Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]).minimum"
                      :max="getRangesForDataName(sensor,Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]).maximum"
                      :separator-step="getRangesForDataName(sensor,Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]).maximum/5"
                      :gauge-color="[
                        { offset: 0, color: '#de3a21'},
                        { offset: 50, color: '#f4c009'} ,
                        { offset: 100, color: '#0b8c5a'}]"
                    >
                      <svg-gauge-slot
                        :key="keyValue"
                        :color="getColorForSensor(getRangesForDataName(sensor,Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]), Object.values(sensor.sensorReadings[0].formattedData)[0])"
                        :unit-symbol="getSymbolForDataName(sensor, Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]).symbol"
                        :value="Object.values(sensor.sensorReadings[0].formattedData)[formattedDataIndex]"
                      />
                    </vue-svg-gauge>
                    <v-spacer></v-spacer>
                  </base-material-card>
                  <div class="d-flex justify-center">Predicted Day : {{sensor.predDate}} - {{sensor.predDays}} Days later</div>
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  v-if="sensor.model !== 'call' && sensor.model !== 'indicator'"
                >
                 <sensor-reading
                   :sensor="sensor"
                   :current-option="currentOption"
                 />
                </v-col>
              </v-row>

            </v-col>
            <div class="py-3"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {mapState} from 'vuex'
  import 'vue-loading-overlay/dist/vue-loading.css'
  import SensorReading from "./SensorReadingChart";
  import moment from 'moment'
  import regression from 'regression';

  export default {
    name: 'SensorsForMachineDashboard',
    components: {SensorReading},
    props: {
      id: {
        default: '0',
        type: String,
        required: true,
      },
      loading: {
        default: true,
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        currentOption: 'year',
        options: ['year', 'month', 'week'],
        regressionResult: ''
      }
    },
    async mounted() {
      this.linearRegression([1, 2], [3, 4]);
    },
    watch: {
      machines: (newValue) => {
      },
    },
    computed: {
      ...mapState({
        machines: state => state.sensors.models,
        loaderOptions: state => state.settings.loader,
        keyValue: state => state.sensors.keyValue,
      }),
      machine() {
        for (let x = 0; x <= this.machines.length; x += 1) {
          if (this.machines[x] && this.machines[x].id === this.id) {
            for (let i = 0; i < this.machines[x].sensors_to_models.length; i++) {
              this.machines[x].sensors_to_models[i].predDays = Math.floor(Math.random() * 10) + 1;
              this.machines[x].sensors_to_models[i].predDate = moment().subtract(Math.floor(Math.random() * 10) + 1, 'days').format('MM/DD/YYYY');
            }
            console.log('---------- this.machines[x] = ', this.machines[x])
            return this.machines[x]
          }
        }
        return null
      },
    },
    methods: {
      //TODO: get data for mac address
      complete(index) {
        this.list[index] = !this.list[index]
      },
      linearRegression(xArr, yArr) {
        const result = regression.linear([[0, 1], [32, 67], [12, 79]]);
        const gradient = result.equation[0];
        const yIntercept = result.equation[1];
        console.log('---------- linear result', result)
        console.log('---------- linear yIntercept', yIntercept)
        console.log('---------- linear gradient', gradient)
      },
      openHistoricalData(sensorId) {
        this.$router.push({name: 'DashboardHistoricalData', params: {id: sensorId}})
      },
      async refetchMachines() {
        this.loading = true;
        await this.$store.dispatch('sensors/getSensorModels');
        this.loading = false
      },
      getColorForSensor(ranges, current) {
        if (ranges.minimum <= current <= ranges.maximum) {
          return 'green'
        } else return 'red'
      },
      getSymbolForDataName(sensor, dataName) {
        let res = {};
        if (!sensor.customModel) {
          if (sensor.model === 'temperature') {
            res = {name: 'Temperature (°C)'};
          } else if (sensor.model === 'vibration') {
            res = {name: 'Vibration (Hz)'}
          } else if (sensor.model === 'current') {
            res = {name: 'Current (A)'}
          } else if (sensor.model === 'indicator') {
            res = {name: 'ON/OFF'}
          } else if (sensor.model === 'call') {
            res = {name: 'Call Button'}
          }
        } else {
          res = {name: `${sensor.customModelValue.name} (${sensor.customModelValue.symbol})`}
        }
        return res
      },
      getRangesForDataName(sensor, dataName) {
        const res = sensor.limit;
        // Remove undefined error if data was not loaded yet
        if (!res) {
          return {}
        }
        return res
      },
    },

  }
</script>

<style lang="sass">
  #coloured-line
    .ct-series-a .ct-line,
    .ct-series-a .ct-point
      stroke: #00cae3 !important

    #multiple-bar
      .ct-series-a .ct-bar
        stroke: #00cae3 !important

      .ct-series-b .ct-bar
        stroke: #f44336 !important

    #pie
      .ct-series-a .ct-slice-pie
        fill: #00cae3 !important

      .ct-series-b .ct-slice-pie
        fill: #f44336 !important
</style>
