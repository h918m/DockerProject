<template>
  <v-container>
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
    >
      <v-card light width="380px" class="px-3 py-5">
        <div class="d-flex flex-column align-items-center">
          <v-col cols="12">
            <h2 class="display-3 fw-bold text-center">{{payAmount}}</h2>
          </v-col>
          <form id="payment-form" class="w-75 px-5 d-flex flex-column align-items-center" >
            <v-col class="pt-10 px-0">
              <div ref="card" class="form-control m-2">
                <!-- A Stripe Element will be inserted here. -->
              </div>
            </v-col>

            <v-col cols="12" class="pt-5">
              <p>{{errorMsg}}</p>
              <v-row justify="center">
                <v-btn block :disabled="lockSubmit" color="success" v-on:click.prevent="purchase" class="ma-0">
                  Pay
                </v-btn>
              </v-row>
            </v-col>
          </form>
        </div>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
  import {mapState, mapMutations, mapGetters} from "vuex";

  export default {
    name: "CheckoutPage",
    data () {
      return {
        spk:"pk_test_51I3HBHLZAfZEWAJWvjjZ0RFO8vsfLoUeCWsUbq3VYmmZ1SKoyzF96P8HiHQt7z2KxfoC21afZIXkRGlHy29SCBpK00rZq95WV9",
        stripe:undefined,
        card:undefined,
        msg: 'Donate Here',
        payAmount:"£40.00",
        lockSubmit:false,
        errorMsg: null,
        loading: false
      }
    },
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
        company: state => state.auth.company.id
      }),
      ...mapGetters({
        isSubscribed: 'auth/isSubscribed'
      }),
    },

    mounted: function () {
      var self=this;
      if (self.isSubscribed) {
        self.$router.push('/users/users-list')
      }
      self.stripe= Stripe(self.spk);
      self.card = self.stripe.elements().create('card');
      self.card.mount(self.$refs.card);
    },

    methods:{
      // ...mapMutations([
      //   'modifyCompany'
      // ]),

      purchase() {
        var self = this;
        self.loading = true;
        self.errorMsg = '';
        self.lockSubmit=true;

        self.stripe.createToken(self.card).then(function(result) {
          if (result.error) {
            self.errorMsg = result.error.message;
            self.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
            self.lockSubmit=false;
            self.loading = false;
          }
          else{
            self.processTransaction(result.token.id)
          }
        })
          .catch((err) => {
            self.lockSubmit=false;
            self.loading = false;
          });
      },

      async processTransaction(transactionToken){
        var self=this;
        await this.$axios({
          url: '/graphql',
          method: 'POST',
          data: {
            query: `
              mutation {
                createOrder(input: {
                  data: {
                    company: "${self.company}",
                    amount: 40,
                    token: "${transactionToken}"
                  }
                }) {
                  order {
                    id
                    company {
                      id
                    }
                    amount
                  }
                }
              }
            `
          }
        }).then(res => {
            self.$store.commit('auth/modifyCompany', 1);
            self.$router.push('/users/users-list');
        }).catch(err => {

        });
        self.loading = false;
      },
    },
  }
</script>
<style scoped>
  .StripeElement {
    box-sizing: border-box;

    height: 40px;

    padding: 10px 12px;

    border: 1px solid transparent;
    border-radius: 4px;
    background-color: white;

    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
  }

  .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
  }

  .StripeElement--invalid {
    border-color: #fa755a;
  }

  .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
  }

  .hide {
    visibility: hidden;
  }
</style>
