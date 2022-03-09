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
          icon="mdi-bell"
          title="Notifications"
          class="px-5 py-3"
        >
          <template v-slot:after-heading>
            <div class="display-2 font-weight-light">
              Notifications list
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
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <div v-text="item.eventDescription"></div>
                </td>
                <td>
                  <div v-text="item.eventDate"></div>
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

  export default {
    name: 'Notifications',
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
      searchedData: [],
      count: 0,
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
      snackbar: {
        snackbar: false,
        type: 'success',
        message: '',
      },
    }),
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
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
            text: 'Content',
            value: 'content',
          },
          {
            text: 'Date',
            value: 'date',
          },
        ])
      }
    },
    watch: {
      options: {
        async handler(newOptions) {
          // Set the data to match the database query
          this.dataTable.page = newOptions.page;
          this.dataTable.limit = newOptions.itemsPerPage;
          // this.dataTable.sortDesc = newOptions.sortDesc[0];
          // this.dataTable.sortBy = newOptions.sortBy[0];
          this.dataTable.start = this.dataTable.limit * (this.dataTable.page - 1);
          // Refetch readings with new options
          this.getNotifications().then((res) => {
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
      this.loading = true;
      // Load form data
      this.data = await this.getNotifications();
      this.searchedData = this.data;
      this.loading = false
    },

    methods: {
      // async onImageChange(val) {
      //   const {valid} = await this.$refs.provider.validate(val)
      //   if (valid) {
      //     const value = val.target.files[0]

      //     if (!value) {
      //       return (this.form.image = null)
      //     }
      //     this.form.image = value
      //     this.form.imageUrl = URL.createObjectURL(this.form.image)
      //     return true
      //   } else return (this.form.image = null)
      // },
      // async getMachineForId(machineId) {
      //   return this.$axios({
      //     method: 'POST',
      //     url: '/graphql',
      //     data: {
      //       query: `{
      //       machine(id: "${machineId}"){
      //         id
      //         name
      //       }
      //     }`,
      //     },
      //   }).then(({data}) => {
      //     if (data.data.machine) {
      //       return data.data.machine
      //     } else {
      //       return {}
      //     }
      //   })
      // },
      // async getFormForId(id) {
      //   return this.$axios({
      //     method: 'POST',
      //     url: '/graphql',
      //     data: {
      //       query: `{
      //       subMachine(id: "${id}"){
      //         id
      //         name
      //         machine{
      //           id
      //           name
      //         }
      //       }
      //     }
      //     `,
      //     },
      //   }).then(({data}) => {
      //     const result = data.data.subMachine
      //     if(result) {
      //       return {
      //         machine: result.machine,
      //         name: result.name,
      //       }
      //     } else {
      //       return {};
      //     }

      //   })
      // },
      // async addSubMachine() {
      //   const {machine, name} = this.form
      //   return this.$axios({
      //     method: 'POST',
      //     url: '/graphql',
      //     data: {
      //       query: `mutation {
      //       createSubMachine(input:{data: {name: "${name}",machine: "${machine.id}"}}){
      //         subMachine{
      //           name
      //           id
      //           machine{
      //             id
      //             name
      //           }
      //         }
      //       }
      //     }`,
      //     },
      //   })
      //     .then(({data}) => {
      //       this.snackbar = {
      //         message: 'A Sub Machine has been successfully attached to the machine.',
      //         type: 'success',
      //         snackbar: true,
      //       };
      //       return data.data.subMachine
      //     })
      //     .catch(err => {
      //       this.snackbar = {
      //         message: `There was an error adding your request. Message: ${err.message}`,
      //         type: 'error',
      //         snackbar: true,
      //       }
      //     })
      // },
      // async modifyMachine() {
      //   const {machine, name} = this.form
      //   return this.$axios({
      //     method: 'POST',
      //     url: '/graphql',
      //     data: {
      //       query: `mutation {
      //       updateSubMachine(input: {where: {id: "${this.id}"},data: {name: "${name}",machine: "${machine.id}"}}){
      //         subMachine{
      //           name
      //           id
      //           machine{
      //             id
      //             name
      //           }
      //         }
      //       }
      //     }`,
      //     },
      //   })
      //     .then(({data}) => {
      //       this.snackbar = {
      //         message: 'A Sub Machine has been successfully modified.',
      //         type: 'success',
      //         snackbar: true,
      //       }
      //       return data.data.subMachine
      //     })
      //     .catch(err => {
      //       this.snackbar = {
      //         message: `There was an error adding your request. Message: ${err.message}`,
      //         type: 'error',
      //         snackbar: true,
      //       }
      //     })
      // },
      // async sleep(milliseconds) {
      //   return new Promise(resolve => setTimeout(resolve, milliseconds))
      // },
      // async onSubmit() {
      //   this.loading = true;
      //   this.formIsDisabled = true;

      //   switch (this.action) {
      //     case 'add':
      //       await this.addSubMachine();
      //       break;
      //     case 'modify':
      //       await this.modifyMachine();
      //       break
      //   }

      //   this.loading = false;
      //   return this.sleep(500)
      //     .then(() => {
      //       this.$router.push({name: 'MachineSubMachinesForMachine', params: {id: this.form.machine.id}})
      //     })
      // },
      // async getNotifications() {
      //   return this.$axios({
      //     method: 'POST',
      //     url: '/graphql',
      //     data: {
      //       query: `{
      //         notifications{
      //           eventDescription
      //           createdAt
      //         }
      //       }
      //     `,
      //     },
      //   })
      //     .then(({data}) => {
      //       if (data.data.notifications) {
      //         return data.data.notifications
      //       } else {
      //         return []
      //       }
      //     })
      // },
      async getNotifications() {
        this.loading = true;
        let {url, limit, sortBy, sortDesc, start} = this.dataTable;
        // Sort desc when undefined (setting up the first load to be descending to show the latest first)
        // if (sortDesc === undefined) {
        //   sortDesc = true
        // }
        return this.$axios({
          method: 'POST',
          url: url || '/graphql',
          data: {
            query: `{
                notifications(limit: ${limit || 10}, start: ${start || 0}){
                  eventDescription
                  eventDate
                  checked
                }
              }`,
          },
        }).then(async (res) => {
          let count = await this.$axios({
            method: 'POST',
            url: url,
            data: {
              query: `{
                notificationsConnection{
                  aggregate{
                    count
                  }
                }
              }`,
            },
          });
          this.count = count.data.data.notificationsConnection.aggregate.count;
          this.loading = false;
          return res.data.data.notifications
        })
      },
    },
  }
</script>
