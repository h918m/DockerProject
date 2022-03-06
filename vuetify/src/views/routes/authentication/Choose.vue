<template>
  <v-row
    justify="center"
  >
    <v-col
      cols="12"
      md="7"
    >
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-row justify="center">
            <v-card light
            >
              <v-card-title class="mt-3">
                <v-icon
                  large
                  color="green darken-2"
                  class="mr-3"
                >
                  mdi-account-group
                </v-icon>
                &nbsp; Company
              </v-card-title>
              <v-card-text class="mt-5">
                <v-img
                  :src="require('@/assets/business.jpeg')"
                  height="200"
                  width="300"
                >
                </v-img>
              </v-card-text>
              <v-card-actions
                @click="loginAsCompany()"
                class="justify-center"
              >
                <v-btn
                  color="primary"
                  class="mx-0 mb-3"
                >
                  Visit website as Company account
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-row justify="center">
            <v-card light
            >
              <v-card-title class="mt-3">
                <v-icon
                  large
                  color="green darken-2"
                  class="mr-3"
                >
                  mdi-account
                </v-icon>
                Individual
              </v-card-title>
              <v-card-text class="mt-5">
                <v-img
                  :src="require('@/assets/individual.jpeg')"
                  height="200"
                  width="300"
                >
                </v-img>
              </v-card-text>
              <v-card-actions
                @click="loginAsIndividual()"
                class="justify-center"
              >
                <v-btn
                  color="primary"
                  class="mx-0 mb-3"
                >
                  Visit website as Individual account
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

</template>
<script>
  export default {
    name: 'PagesChoose',
    methods: {
      loginAsCompany: function() {
        this.$router.push({name: 'AuthenticationLoginAction', params: {action: 'company'}} )
      },
      loginAsIndividual: function() {
        this.$router.push('/authentication/login')
      }
    }
  }
</script>
