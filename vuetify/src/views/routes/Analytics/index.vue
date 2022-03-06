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
        </base-material-card>
      </v-col>
    </v-row>
    <submachines-for-machine
      :id="currentMachine? currentMachine.id : '0'"
      :loading="loading"
    />
  </v-container>
</template>

<script>
  import {mapState} from 'vuex'
  import SubmachinesForMachine from '@/views/routes/Analytics/SubmachinesForMachine'

  export default {
    name: "AnalyticsMachines",
    components: {SubmachinesForMachine},
    data() {
      return {
        loading: true,
        data : [],
        machineId: '',
        machines: [],
        currentMachine: null,
        snackbar: {
          snackbar: false,
          type: 'success',
          message: '',
        }
      }
    },
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
        company: state => state.auth.company.id
      })
    },
    async mounted() {
      this.loading = true;
      this.machines = await this.getMachines();
      if (this.machines.length > 0) {
        this.currentMachine = this.machines[0]
      }
      this.loading = false;
    },
    methods: {
      async getMachines() {
        const url = '/graphql';
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `
              {
                machines(where: {company: "${this.company}"}){
                  id
                  name
                }
            }`,
          },
        }).then(res => {
          if (res.data.data.machines) {
            return res.data.data.machines
          } else {
            return [];
          }
        })
      }
    }
  }
</script>
