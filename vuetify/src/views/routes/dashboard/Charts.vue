<template>
<!--  <v-container fluid>-->
<!--    <v-btn @click="refetchMachines">-->
<!--      Refetch-->
<!--    </v-btn>-->
<!--    &lt;!&ndash;-->
<!--    <loading-->
<!--      :active.sync="loading"-->
<!--      :loader="loaderOptions.loader"-->
<!--      :color="loaderOptions.color"-->
<!--      :width="loaderOptions.width"-->
<!--      :height="loaderOptions.height"-->
<!--      :background-color="loaderOptions.backgroundColor"-->
<!--      :is-full-page="loaderOptions.isFullPage"-->
<!--    />-->
<!--    &ndash;&gt;-->
<!--    <v-row>-->
<!--      <v-col-->
<!--        v-if="!loading"-->
<!--        cols="12"-->
<!--      >-->
<!--        <v-row-->
<!--          v-for="machine in machines"-->
<!--          :key="machine.index"-->
<!--        >-->
<!--          <v-col-->
<!--            cols="12"-->
<!--            class="pb-0"-->
<!--          >-->
<!--            &lt;!&ndash; Machines List &ndash;&gt;-->

<!--            <h1>{{ machine.name }}</h1>-->
<!--          </v-col>-->
<!--          &lt;!&ndash; Sub Machine &ndash;&gt;-->
<!--          <v-col-->
<!--            cols="12"-->
<!--            class="pt-0"-->
<!--          >-->
<!--            <v-row-->
<!--              v-for="subMachine in machine.subMachines"-->
<!--              :key="subMachine.key"-->
<!--            >-->
<!--              <v-col-->
<!--                cols="12"-->
<!--              >-->
<!--                <h2>{{ subMachine.name }}</h2>-->
<!--              </v-col>-->
<!--              <v-row-->
<!--                v-for="sensor in subMachine.sensorsToModels"-->
<!--                :key="sensor.key"-->
<!--              >-->
<!--                <v-col-->
<!--                  v-for="(_, formattedDataIndex) in Object.keys(sensor.sensorReadings[0].formattedData)"-->
<!--                  :key="formattedDataIndex"-->
<!--                  cols="12"-->
<!--                  md="6"-->
<!--                  lg="4"-->
<!--                  @click="openHistoricalData(sensor.id)"-->
<!--                >-->
<!--                  &lt;!&ndash; Here will go loop for each sensordata in sensor &ndash;&gt;-->
<!--                  <base-material-card-->
<!--                    id="multiple-bar"-->
<!--                    :color="getColorForSensor(getRangesForDataName(machine,Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]), Object.values(sensor.sensorReadings[0].formattedData)[0])"-->
<!--                    icon="mdi-poll-box"-->
<!--                    class="px-4 py-3"-->
<!--                  >-->
<!--                    <template v-slot:after-heading>-->
<!--                      <div class="display-1 mt-2 font-weight-light">-->
<!--                        {{ sensor.name }}-->
<!--                        &lt;!&ndash; TODO check for multiple different types (if sensor is temperature + vibration it should get both as different gauges) &ndash;&gt;-->
<!--                        <span class="subtitle-1">— {{ getSymbolForDataName(sensor, Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]).name }}</span>-->
<!--                      </div>-->
<!--                    </template>-->
<!--                    <vue-svg-gauge-->
<!--                      :value="Object.values(sensor.sensorReadings[0].formattedData)[formattedDataIndex]"-->
<!--                      :min="getRangesForDataName(machine,Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]).minimum"-->
<!--                      :max="getRangesForDataName(machine,Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]).maximum"-->
<!--                      :gauge-color="[{ offset: 0, color: '#de3a21'}, { offset: 10, color: '#f4c009'} , { offset: 100, color: '#0b8c5a'}]"-->
<!--                    >-->
<!--                      <svg-gauge-slot-->
<!--                        :color="getColorForSensor(getRangesForDataName(machine,Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]), Object.values(sensor.sensorReadings[0].formattedData)[0])"-->
<!--                        :unit-symbol="getSymbolForDataName(sensor, Object.keys(sensor.sensorReadings[0].formattedData)[formattedDataIndex]).symbol"-->
<!--                        :value="Object.values(sensor.sensorReadings[0].formattedData)[formattedDataIndex]"-->
<!--                      />-->
<!--                    </vue-svg-gauge>-->
<!--                  </base-material-card>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--              <div class="py-3" />-->
<!--            </v-row>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--      </v-col>-->
<!--    </v-row>-->
<!--  </v-container>-->
</template>

<script>
// import { mapState } from 'vuex'
// import 'vue-loading-overlay/dist/vue-loading.css'
//   export default {
//     name: 'DashboardCharts',
//     data () {
//       return {
//         loading: true,
//       }
//     },
//     computed: {
//       ...mapState({
//         value: state => state.sensors.value,
//         machines: state => state.sensors.models,
//         loaderOptions: state => state.settings.loader,
//       }),
//     },
//     sockets: {
//       sensorReading: (reading) => {
//
//       },
//     },
//     async created () {
//       // Get models when not in store
//       if (this.machines.length === 0) {
//       await this.$store.dispatch('sensors/getSensorModels')
//       }
//       this.loading = false
//     },
//     methods: {
//       complete (index) {
//         this.list[index] = !this.list[index]
//       },
//       openHistoricalData (sensorId) {
//         this.$router.push({ name: 'DashboardHistoricalData', params: { id: sensorId } })
//       },
//       async refetchMachines () {
//         this.loading = true;
//         await this.$store.dispatch('sensors/getSensorModels')
//         this.loading = false
//       },
//       getColorForSensor (ranges, current) {
//       if (ranges.minimum <= current <= ranges.maximum) {
//           return 'green'
//         } else return 'red'
//       },
//       getSymbolForDataName (sensor, dataName) {
//         const res = sensor.sensorModelInfo.unitsInfo.symbols.find((symbol) => symbol.unitType === dataName)
//         // Remove undefined error if data was not loaded yet
//         if (!res) {
//           return {}
//         }
//         return res
//       },
//       getRangesForDataName (machine, dataName) {
//         const res = machine.machineModelInfo.ranges.find((range) => range.rangeType === dataName);
//         // Remove undefined error if data was not loaded yet
//         if (!res) {
//           console.error('no res');
//           return {}
//         }
//         return res
//       },
//     },
//
//   }
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
