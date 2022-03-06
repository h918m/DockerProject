<template>
  <v-container
    id="login"
    class="fill-height justify-center"
    tag="section"
  >
    <v-row justify="center">
      <v-slide-y-transition appear>
        <base-material-card
          color="success"
          light
          max-width="100%"
          width="380"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="text-center">
              <h1 class="display-4">
                Login
              </h1>
            </div>
          </template>

          <v-card-text class="text-center">
            <div class="text-center red--text body-1">
              {{ message }}
            </div>
            <v-text-field
              v-model="form.email"
              color="secondary"
              label="Email..."
              prepend-icon="mdi-email"
              @keyup.enter="onClickLogin"
            />

            <v-text-field
              v-model="form.password"
              type="password"
              class="mb-8"
              color="secondary"
              label="Password..."
              prepend-icon="mdi-lock-outline"
              @keyup.enter="onClickLogin"
            />

            <pages-btn
              large
              color=""
              depressed
              class="v-btn--text success--text"
              @click="onClickLogin"
            >
              Let's Go
            </pages-btn>
          </v-card-text>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'PagesLogin',
    components: {
      PagesBtn: () => import('./components/Btn'),
    },
    props: {
      action: {
        default: 'individual',
        type: String
      }
    },
    data: () => ({
      form: {
        email: '',
        password: '',
      },
      message: '',
      socials: [
        {
          href: '#',
          icon: 'mdi-facebook-box',
        },
        {
          href: '#',
          icon: 'mdi-twitter',
        },
        {
          href: '#',
          icon: 'mdi-github-box',
        },
      ],
    }),
    computed: {
      ...mapState({
        user: state => state.auth.user,
        jwt: state => state.auth.JWTToken,
      }),
      ...mapGetters({
        isCompany: 'auth/isCompany',
        isSubscribed: 'auth/isSubscribed'
      })
    },
    mounted() {
      // if user is logged in, move him somewhere (can be logout page or something)
      if (this.jwt && this.user) {
        if (this.isCompany) {
          if (this.isSubscribed) {
            this.$router.push('/users/users-list');
          } else {
            this.$router.push('/authentication/membership');
          }
        } else {
          this.$router.push('/dashboard/machines-list');
        }
      }
    },
    methods: {
      async onClickLogin() {
        return this.$store.dispatch('auth/login', this.form).then(() => {
          if (!this.jwt || !this.user) {
            this.message = 'Wrong e-mail or password';
            this.form.password = ''
          } else {
            this.message = '';
            if (this.isCompany) {
              if (this.isSubscribed) {
                this.$router.push('/users/users-list');
              } else {
                this.$router.push('/authentication/membership');
              }
            } else {
              this.$router.push('/dashboard/machines-list');
            }
          }
        })
      },
    },
  }
</script>
