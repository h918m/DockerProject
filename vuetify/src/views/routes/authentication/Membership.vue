<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
        xl="6"
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-row justify="center" class="pr-md-3">
              <v-card
                light
                width="380"
                class="px-5 py-3"
              >
                <v-col
                  cols="12"
                  class="ma-0 pa-0"
                >
                  <v-row>
                    <v-col cols="12" class="mt-3">
                      <h2 class="text-center display-3 fw-bold">Free</h2>
                    </v-col>
                    <v-col cols="12" class="mt-3">
                      <h2 class="text-center display-4 fw-bold">$0</h2>
                    </v-col>
                    <v-col cols="12">
                      <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12">
                      <p class="text-center">
                        1 admin account and 1 normal user account maximum sdfsd fsd fsdf sdf sdf sdf sdf sdf sdf sd fsd fsdf
                        sd fsdf sd fsd fsdf sdf sdf sdf sdf sdf sdf sdf
                      </p>
                    </v-col>
                  </v-row>
                  <v-card-actions class="justify-center" @click="$router.push('/users/users-list')">
                    <v-btn color="light-blue darken-4" tile>
                      Start for free
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-card>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-row justify="center" class="pl-md-3">
              <v-card
                light
                width="380"
                class="px-5 py-3"
              >
                <v-col
                  cols="12"
                  class="ma-0 pa-0"
                >
                  <v-row>
                    <v-col cols="12" class="mt-3">
                      <h2 class="text-center display-3 fw-bold">Premium</h2>
                    </v-col>
                    <v-col cols="12" class="mt-3">
                      <h2 class="text-center display-4 fw-bold">$99</h2>
                    </v-col>
                    <v-col cols="12">
                      <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12">
                      <p class="text-center">
                        Unlimited admin accounts and normal user accounts sdfsd fsd fsdf sdf sdf sdf sdf sdf sdf sd fsd fsdf
                        sd fsdf sd fsd fsdf sdf sdf sdf sdf sdf sdf sdf
                      </p>
                    </v-col>
                  </v-row>
                  <v-card-actions class="justify-center" @click="gotoCheckOut()">
                    <v-btn color="light-blue darken-4" tile>
                      Buy Now
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'MembershipPage',
    methods: {
      gotoCheckOut: function() {
        this.$router.push('/authentication/checkout');
      }
    }
  }
</script>
