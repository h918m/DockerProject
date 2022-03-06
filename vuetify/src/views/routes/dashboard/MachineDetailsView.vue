<template>
  <v-container fluid>
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
      heading="Machine Dashboard"
      link="components/forms"
    />
    <qr-scanner
      :handleResult="selectMachine"
    />
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          color="blue"
          icon="mdi-poll-box"
          title="Choose Machine"
          class="px-5 py-3"
        >
          <v-select
            v-if="machines"
            v-model="currentMachine"
            color="secondary"
            item-color="secondary"
            label="Machine"
            return-object
            :items="machines"
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
                  <v-list-item-title v-text="item.name" />
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
          <v-btn @click="refetchMachines">
            Refresh Machines
          </v-btn>
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
    <sensors-for-machine
      v-if="currentMachine"
      :id="currentMachine.id"
      :loading="loading"
    />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SensorsForMachine from '@/views/routes/dashboard/SensorsForMachineDashboard'
import store from '@/store'
import 'vue-loading-overlay/dist/vue-loading.css'
import QrScanner from '@/views/routes/dashboard/DashboardQRScanner'

export default {
  name: 'DashboardMachineDetailsView',
  components: { SensorsForMachine, QrScanner },
  data () {
    return {
      loading: true,
      currentMachine: null,
      snackbar: {
        snackbar: false,
        type: 'success',
        message: '',
      },
    }
  },
  computed: {
    ...mapState({
      machines: state => state.sensors.models,
      loaderOptions: state => state.settings.loader,
    }),
  },
  async created () {
    // Get models when not in store
    if (!this.machines) {
      await this.$store.dispatch('sensors/getSensorModels')
    }
    await this.$store.dispatch('sensors/refetchSensorData');
    if (this.machines) {
      this.currentMachine = this.machines[0];
    }
    this.loading = false
  },
  sockets: {
    sensorReading: (reading) => {
      store.dispatch('sensors/setNewSensorData', reading)
    },
  },
  methods: {
    ...mapActions('sensors', ['setNewSensorData']),

    //TODO: handle qr code scan result
    selectMachine(id) {
      this.currentMachine = id;
    },
    complete (index) {
      this.list[index] = !this.list[index]
    },
    openHistoricalData (sensorId) {
      this.$router.push({ name: 'DashboardHistoricalData', params: { id: sensorId } })
    },
    async refetchMachines () {
      this.loading = true;
      await this.$store.dispatch('sensors/getSensorModels');
      this.loading = false
    },
    getColorForSensor (ranges, current) {
    if (ranges.minimum <= current <= ranges.maximum) {
        return 'green'
      } else return 'red'
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
