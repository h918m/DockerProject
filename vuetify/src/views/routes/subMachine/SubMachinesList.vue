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
    <qr-scanner/>
    <base-v-component
      heading="List of SubMachines"
      link="components/data-tables"
    />

    <base-material-card
      color="purple"
      icon="mdi-cog"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          SubMachines list
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
              <v-img
                class="table-img"
                :src="baseAPIUrl + item.image.url"
              />
            </td>
            <td>
              <div
                class="purple--text headline"
                v-text="item.name"
              />
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
  import {mapState, mapGetters} from 'vuex'
  import QrScanner from '@/views/routes/subMachine/SubMachineQRScanner'

  export default {
    name: 'SubMachinesList',
    components: {QrScanner},
    data: () => ({
      data: [],
      searchedData: [],
      count: 0,
      currentId: '',
      search: '',
      loading: true,
      options: {},
      dataTable: {
        page: 1,
        start: 0,
        sortDesc: true,
        sortBy: 'received',
        limit: 10,
        url: '/graphql',
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
      actions: [
        {
          color: 'blue',
          icon: 'mdi-cog',
          action: 'subMachinesForMachine',
        },
        {
          color: 'red',
          icon: 'mdi-minus-circle-outline',
          action: 'remove',
        },
      ],
    }),
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
        company: state => state.auth.company.id
      }),
      ...mapGetters({
        isAdmin: 'auth/isAdmin',
      }),
      headers: function() {
        if (this.isAdmin) {
          return (     [
            {
              text: 'Image',
              value: 'img',
            },
            {
              text: 'Name',
              value: 'name',
            },
            {
              text: 'Assigned to',
              value: 'users',
            },
            {
              text: 'Options',
              value: 'options',
            },
          ])
        } else {
          return (     [
            {
              text: 'Image',
              value: 'img',
            },
            {
              text: 'Name',
              value: 'name',
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
          this.getSubMachineReadings().then((res) => {
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
          return item.name.toLowerCase().includes(newVal.toLowerCase());
        })
      }
    },
    async mounted() {
      // Get the Data when mounted
      this.loading = true;
      this.data = await this.getSubMachinesData();
      this.searchedData = this.data;
      this.loading = false
    },
    methods: {
      onAddClick() {
        this.$router.push('/sub-machine/sub-machine-form')
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
              deleteSubMachine(input:{where: {id: "${this.currentId}"} }) {
                subMachine{
                  name
                }
              }
            }
          `,
          },
        })
          .then(async ({data}) => {
            this.snackbar = {
              message: 'SubMachine has been successfully removed.',
              type: 'success',
              snackbar: true,
            };
            // Refetch Sensors
            await this.getSubMachineReadings().then((res) => {
              this.data = res;
              this.searchedData = res;
            });
            return data.data.machine
          })
          .catch(err => {
            this.snackbar = {
              message: `There was an error adding your request. Message: ${err.message}`,
              type: 'error',
              snackbar: true,
            }
          })
      },
      actionClicked(action, id) {
        this.currentId = id;
        switch (action) {
          case 'subMachinesForMachine':
            this.openHistoricalData(id);
            break;
          case 'remove':
            this.removeDialog = {
              state: true,
              message: 'Are you sure you want to delete this subMachine?',
            };
            break;
          default:
            break
        }
      },
      openHistoricalData(id) {
        this.$router.push({name: 'MachineMachineFormAction', params: {action: 'modify',id: id}})
      },
      onClick(item) {
        if (!this.isAdmin) {
          this.$router.push({ name: 'MachineMachineFormAction', params: {action: 'modify', id: item.id}});
        }
      },
      async getSubMachinesData(payload) {
        const url = '/graphql';
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `
              {
                subMachines(where: {company: "${this.company}"}){
                  id
                  name
                  QR
                  image{
                    url
                  }
                  users {
                    id
                    name
                  }
                }
            }`,
          },
        }).then(async (res) => {
          const subMachines = res.data.data.subMachines;
          // Get data count
          let count = await this.$axios({
            method: 'POST',
            url: url,
            data: {
              query: `{
                subMachinesConnection(where: {company: "${this.company}"}){
                  aggregate{
                    count
                  }
                }
              }`,
            },
          });
          this.count = count.data.data.subMachinesConnection.aggregate.count;

          return subMachines
        }).catch(err => {
          return [];
        })
      },

      async getSubMachineReadings() {
        this.loading = true;
        let {url, limit, sortBy, sortDesc, start} = this.dataTable;
        // Sort desc when undefined (setting up the first load to be descending to show the latest first)
        if (sortDesc === undefined) {
          sortDesc = true
        }
        return this.$axios({
          method: 'POST',
          url: url || '/graphql',
          data: {
            query: `{
                subMachines(where: {company: "${this.company}"}, limit: ${limit || 10}, sort: "${sortBy || 'name'}:${sortDesc ? 'desc' : 'asc'}", start: ${start || 0}){
                  id
                  name
                  QR
                  image{
                    url
                  }
                  users {
                    id
                    name
                  }
                }
              }`,
          },
        }).then((res) => {
          this.loading = false;
          return res.data.data.subMachines
        })
      },
    },
  }
</script>

<style>
  .table-img {
    width: 128px;
    height: 128px;
  }
</style>
