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
    <base-material-card
      color="purple"
      icon="mdi-wifi"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Users list
        </div>
      </template>
      <v-divider class="mt-3" />

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
          <tr>
            <td>
              <div
                class="body-1 fw-bold"
                v-text="item.name"
              />
            </td>
            <td>
              <div
                class="body-1"
                v-text="item.surname"
              />
            </td>
            <td>
              <div
                class="body-1"
                v-text="item.email"
              />
            </td>
            <td>
              <div
                class="body-1"
                v-text="item.level===1? 'Admin' : 'Normal'"
              />
            </td>
            <td>
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
          <v-spacer />

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
  import { mapState ,mapGetters} from 'vuex'
  export default {
    name: 'UsersListPage',
    data: () => ({
      data: [],
      searchedData: [],
      currentId: '',
      count: 0,
      search: '',
      loading: true,
      options: {},
      removeDialog: {
        state: false,
        message: '',
      },
      snackbar: {
        snackbar: false,
        type: 'success',
        message: '',
      },
      dataTable: {
        page: 1,
        start: 0,
        sortDesc: true,
        sortBy: 'received',
        limit: 10,
        url: '/graphql',
      },
      actions: [
        {
          color: 'blue',
          icon: 'mdi-cog',
          action: 'modify',
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
        isAdmin: 'auth/isAdmin'
      }),
      headers: function() {
          return ([
            {
              text: 'Name',
              value: 'name',
            },
            {
              text: 'Surname',
              value: 'surname',
            },
            {
              text: 'Email',
              value: 'email',
            },
            {
              text: 'Role',
              value: 'level',
            },
            {
              text: 'Options',
              value: 'options',
            },
          ])
      },
      baseAPIUrl () {
        return process.env.VUE_APP_API_BASE_URL
      },
    },
    watch: {
      options: {
        async handler (newOptions) {
          // Set the data to match the database query
          this.dataTable.page = newOptions.page;
          this.dataTable.limit = newOptions.itemsPerPage;
          this.dataTable.sortDesc = newOptions.sortDesc[0];
          this.dataTable.sortBy = newOptions.sortBy[0];
          this.dataTable.start = this.dataTable.limit * (this.dataTable.page - 1);
          // Refetch readings with new options
          return this.getUsersFilter().then((res) => {
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
          return item.name.toLowerCase().includes(newVal.toLowerCase()) || item.email.toLowerCase().includes(newVal.toLowerCase());
        })
      }
    },
    async mounted () {
      // Get the Data when mounted
      this.loading = true;
      this.data = await this.UsersList();
      this.searchedData = this.data;
      this.loading = false
    },
    methods: {
      remove () {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `mutation {
            deleteUser(input:{where: {id: "${this.currentId}"} }) {
              user {
                id
              }
            }
          }
        `,
          },
        })
          .then(async ({ data }) => {
            this.snackbar = {
              message: 'A User has been successfully removed.',
              type: 'success',
              snackbar: true,
            };
            // Refetch Sensors
            await this.getUsersFilter().then((res) => {
              this.data = res;
              this.searchedData = res;
            });
            return data.data.spareParts
          })
          .catch(err => {
            this.snackbar = {
              message: `There was an error adding your request. Message: ${err.message}`,
              type: 'error',
              snackbar: true,
            }
          })
      },
      onAddClick () {
        this.$router.push('/users/user-form')
      },
      onEditClick (action, id) {
        this.$router.push({ name: 'UserFormAction', params: { action, id } })
        // alert("add")
      },
      actionClicked (action, id) {
        // Setting up the current ID which can be accessed from dialog
        this.currentId = id;
        switch (action) {
          case ('modify'):
            this.onEditClick(action, id);
            break;
          case ('remove'):
            this.removeDialog = {
              state: true,
              message: 'Are you sure you want to delete this user?',
            };
            break
        }
      },
      async UsersList () {
        const url = '/graphql';
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `
              {
              users(where: {company: "${this.company}", level_ne: 0}) {
                id
                name
                surname
                email
                level
              }
            }`,
          },
        }).then(async (res) => {
          const users = res.data.data.users;
          // Get data count
          this.count = await this.$axios({
            method: 'POST',
            url: url,
            data: {
              query: `{
                usersConnection(where: {company: "${this.company}", level_ne: 0}){
                  aggregate{
                    count
                  }
                }
              }`,
            },
          }).then((res) => {
            if (res.data.data.usersConnection) {
              return res.data.data.usersConnection.aggregate.count
            } else {
              return 0
            }
          });
          if (users) {
            return users
          } else {
            return []
          }
        })
      },

      async getUsersFilter () {
        this.loading = true;
        let { url, limit, sortBy, sortDesc, start } = this.dataTable;

        // Sort desc when undefined (setting up the first load to be descending to show the latest first)
        if (sortDesc === undefined) {
          sortDesc = true
        }
        return this.$axios({
          method: 'POST',
          url: url || '/graphql',
          data: {
            query: `{
                  users (where: {company: "${this.company}", level_ne: 0}, limit: ${limit || 10}, sort: "${sortBy || 'name'}:${sortDesc ? 'desc' : 'asc'}", start: ${start || 0})
                  {
                    id
                    name
                    surname
                    email
                    level
                  }
                }
              `,
          },
        }).then((res) => {
          this.loading = false;
          return res.data.data.users
        })
          .catch((err) => console.log('error', err))
      },
    },
  }
</script>
