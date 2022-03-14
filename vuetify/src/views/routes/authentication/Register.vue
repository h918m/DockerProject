<template>
  <v-container
    id="register"
    class="fill-height justify-center"
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="9"
      >
        <v-slide-y-transition appear>
          <base-material-card
            class="pa-3 pa-md-5 mx-auto"
            max-width="100%"
            width="450"
            light
          >
            <template v-slot:heading>
              <div class="text-center">
                <h1 class="display-4">
                  Register
                </h1>
              </div>
            </template>

            <v-row>
              <v-col
                cols="12"
              >
                <div class="text-center red--text body-1">
                  {{ message }}
                </div>
                <div class="text-center">
                  <validation-observer
                    v-slot="{ handleSubmit }"
                    slim
                  >
                    <v-form @submit.prevent="handleSubmit(onSubmit)">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="First Name"
                      >
                        <v-text-field
                          v-model="form.name"
                          color="secondary"
                          label="First Name"
                          prepend-icon="mdi-face"
                          :error-messages="errors"
                        />
                      </validation-provider>

                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Surname"
                      >
                        <v-text-field
                          v-model="form.surname"
                          color="secondary"
                          label="Surname"
                          prepend-icon="mdi-face"
                          :error-messages="errors"
                        />
                      </validation-provider>
                      <validation-provider
                        v-slot="{ errors }"
                        rules="email|required"
                        name="E-mail"
                      >
                        <v-text-field
                          v-model="form.email"
                          color="secondary"
                          label="Email"
                          prepend-icon="mdi-email"
                          :error-messages="errors"
                        />
                      </validation-provider>

                      <validation-provider
                        name="Password"
                      >
                        <v-text-field
                          v-model="form.password"
                          class="mb-8"
                          type="password"
                          color="secondary"
                          label="Password"
                          prepend-icon="mdi-lock-outline"
                          :rules="[rules.password]"
                        />
                      </validation-provider>

                      <pages-btn
                        color="success"
                        type="submit"
                      >
                        Create Account
                      </pages-btn>
                    </v-form>
                  </validation-observer>
                </div>
              </v-col>
            </v-row>
          </base-material-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
  export default {
    name: 'PagesRegister',

    components: {
      PagesBtn: () => import('./components/Btn'),
    },

    data: () => ({
      form: {
        name: '',
        surname: '',
        email: '',
        password: '',
      },
      message: '',
      rules: {
        required: value => !!value || "Required.",
        password: value => {
          const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
          return (
            pattern.test(value) ||
            "Min. 8 characters with at least one capital letter, a number and a special character."
          );
        }
      }
    }),
    methods: {
      ...mapActions('auth', ['register']),
      onSubmit () {
        return this.register(this.form)
          .then(() => this.$router.push('/authentication/membership'))
          .catch(() => (this.message = 'user already exists'))
      },
    },
  }
</script>

<style lang="sass">
  #register
    .v-list-item__subtitle
      -webkic-line-clamp: initial
      -webkit-box-orient: initial
</style>
