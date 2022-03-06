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
        cols="12"
        lg="7"
      >
        <base-material-card
          color="success"
          icon="mdi-plus"
          :title="`${getActionName} User`"
          class="px-5 py-3"
        >
          <validation-observer
            v-slot="{ handleSubmit }"
            slim
          >
            <v-form
              class="mt-5"
              @submit.prevent="handleSubmit(onSubmit)"
            >
              <v-row>
                <v-col
                  cols="12"
                >
                  <!-- First name -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="First name"
                  >
                    <v-text-field
                      v-model="form.name"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      color="secondary"
                      label="First name"
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                >
                  <!-- Surname -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Surname"
                  >
                    <v-text-field
                      v-model="form.surname"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      color="secondary"
                      label="Surname"
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                >
                  <!-- email -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Email"
                  >
                    <v-text-field
                      v-model="form.email"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      color="secondary"
                      label="Email"
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                >
                  <!-- User Role -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="User Role"
                  >
                    <v-select
                      v-model="form.level"
                      color="secondary"
                      item-color="secondary"
                      label="User Role"
                      :disabled="formIsDisabled"
                      :error-messages="errors"
                      :items="roleList"
                      item-text="label"
                      item-value="value"
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                >
                  <!-- Password -->
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="`${action === 'add' ? 'min:6' : ''}`"
                    name="Password"
                  >
                    <v-text-field
                      v-model="form.password"
                      :disabled="formIsDisabled"
                      :error-messages="errors"
                      color="secondary"
                      hint="Minimum 6 characters"
                      :label="`${action === 'add' ? 'Password' : 'New Password (Optional)'}`"
                    />
                  </validation-provider>

                </v-col>
                <v-col
                  cols="12"
                >
                  <v-card-actions class="pl-0">
                    <v-btn
                      color="success"
                      min-width="100"
                      type="submit"
                      :disabled="formIsDisabled"
                    >
                      {{ getActionName }} User
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-form>
          </validation-observer>
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
  import _ from "lodash";

  export default {
    name: "UserFormPage",
    props: {
      id: {
        default: '0',
        type: String
      },
      action: {
        default: 'add',
        type: String
      }
    },
    data: () => ({
      loading: true,
      formIsDisabled: false,
      roleList: [
        {
          label: "Admin",
          value: 1
        },
        {
          label: "Normal",
          value: 2
        }
      ],
      snackbar: {
        snackbar: false,
        type: 'success',
        message: '',
      },
      form: {
        name: '',
        email: '',
        level: 2,
        surname: '',
        password: ''
      },
    }),
    async mounted() {
      this.loading = true;
      // Check action
      switch (this.action) {
        case 'modify':
          this.form = await this.getFormForId(this.id);
          break;
        case 'add':
          break;
        default:
          break;
      }

      this.loading = false
    },
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
        company: state => state.auth.company.id
      }),
      ...mapGetters({
        isSubscribed: 'auth/isSubscribed'
      }),
      getActionName() {
        return this.action.replace(/^./, this.action[0].toUpperCase())
      },
    },
    methods: {
      //TODO: wait for a specific time
      async sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      },


      //TODO: get user information related with the ID
      async getFormForId(id) {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              user(id: "${this.id}") {
                id
                name
                surname
                email
                level
              }
            }
          `,
          },
        }).then(({data}) => {
          const result = data.data.user;
          if (result) {
            return {
              name: result.name,
              surname: result.surname,
              email: result.email,
              level: result.level,
            }
          } else {
            return {}
          }
        }).catch(err => {

        });
      },


      //TODO: add user or modify
      async onSubmit() {
        this.loading = true;
        this.formIsDisabled = true;

        switch (this.action) {
          case 'add':
            await this.addUser();
            break;
          case 'modify':
            await this.modifyUser();
            break
        }

        this.loading = false;

        return this.sleep(2000)
          .then(() => {
            this.$router.push('/users/users-list');
          })
      },


      //TODO: add user
      async addUser() {
        if (this.isSubscribed) {
          await this.doAddUser();
        } else {
          return this.$axios({
            method: 'POST',
            url: 'graphql',
            data: {
              query: `
              {
                usersConnection(where: {company: "${this.company}"}) {
                  aggregate {
                    count
                  }
                }
              }
              `
            }
          }).then(async (res) => {
            if (res.data.data.usersConnection.aggregate.count > 2) {
              this.snackbar = {
                message: `Please upgrade your membership`,
                type: 'error',
                snackbar: true,
              };
            } else {
              await this.doAddUser();
            }
          })
        }
      },


      //TODO: add user action
      async doAddUser() {
        const {
          email, password, level, surname, name
        } = this.form;
        return this.$axios({
          method: 'POST',
          url: 'graphql',
          data: {
            query: `
               mutation {
                createUser(input: {
                  data: {
                    username: "${email}",
                    email: "${email}",
                    name: "${name}",
                    surname: "${surname}",
                    password: "${password}",
                    level: ${level},
                    confirmed: true,
                    company: "${this.company}"
                  }
                }) {
                  user {
                    id
                    name
                    email
                    surname
                  }
                }
              }
            `
          }
        })
          .then(res => {
            this.snackbar = {
              message: 'User has been successfully added.',
              type: 'success',
              snackbar: true,
            };
            return res;
          }).catch(err => {
            this.snackbar = {
              message: `There was an error adding your request. Message: ${err.message}`,
              type: 'error',
              snackbar: true,
            };
            return err;
          })
      },


      //TODO: modify user
      async modifyUser() {
        const {
          email, password, level, surname, name
        } = this.form;
        return this.$axios({
          method: 'POST',
          url: 'graphql',
          data: {
            query: `
               mutation {
                updateUser(input: {
                  where: {id: "${this.id}"},
                  data: {
                    username: "${email}",
                    email: "${email}",
                    name: "${name}",
                    surname: "${surname}",
                    ${password && password.length > 0 ? `password: "${password}",` : ''}
                    level: ${level},
                  }
                }) {
                  user {
                    id
                    name
                  }
                }
              }
            `
          }
        })
          .then(res => {
            this.snackbar = {
              message: 'User has been successfully modified.',
              type: 'success',
              snackbar: true,
            };
            return res;
          }).catch(err => {
            this.snackbar = {
              message: `There was an error modifying your request. Message: ${err.message}`,
              type: 'error',
              snackbar: true,
            };
            return err;
          })
      },
    }
  }
</script>
