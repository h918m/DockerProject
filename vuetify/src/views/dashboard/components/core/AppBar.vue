<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="$vuetify.breakpoint.smAndDown ? setDrawer(!drawer) : $emit('input', !value)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
    />

    <v-spacer/>
    <div class="mx-3"/>
<!--    <v-btn-->
<!--      class="ml-2"-->
<!--      min-width="0"-->
<!--      text-->
<!--      @click="createSensorRead()"-->
<!--    >-->
<!--      <v-icon>mdi-phone-plus</v-icon>-->
<!--    </v-btn>-->

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            color="red"
            v-if="notifications.length>0"
          >
            <template v-slot:badge>
              <span>{{notifications.length}}</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
          <v-icon
            v-else
          >mdi-bell</v-icon>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        nav
        max-height="350"
      >
        <div
          style="background: white"
        >
          <app-bar-item
            v-for="(n, i) in notifications"
            :key="`item-${i}`"
          >
            <v-list-item-title
              @click="removeNotification(i)"
              v-text="n.eventDescription"
            />
          </app-bar-item>
        </div>
      </v-list>
    </v-menu>
    <v-menu
      bottom
      left
      min-width="200"
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        flat
        nav
      >
        <template v-for="(p, i) in profile">
          <v-divider
            v-if="p.divider"
            :key="`divider-${i}`"
            class="mb-2 mt-2"
          />

          <app-bar-item
            v-else
            :key="`item-${i}`"
            :to="p.to"
          >
            <v-list-item-title v-text="p.title"/>
          </app-bar-item>
        </template>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
  // Components
  import {VHover, VListItem} from 'vuetify/lib'
  import store from '@/store'
  // Utilities
  import {mapState, mapMutations, mapGetters} from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
      AppBarItem: {
        render(h) {
          return h(VHover, {
            scopedSlots: {
              default: ({hover}) => {
                return h(VListItem, {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                }, this.$slots.default)
              },
            },
          })
        },
      },
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      profile: [
        {title: 'Log out', to: '/authentication/logout'},
      ],
    }),

    computed: {
      ...mapState({
        drawer: state => state.settings.drawer,
        user: state => state.auth.user,
        notifications: state => state.sensors.notifications,
      }),
      ...mapGetters({
        isAdmin: 'auth/isAdmin'
      }),
    },
    async mounted() {
      if (this.notifications.length === 0) {
        await this.$store.dispatch('sensors/getNewNotifications')
      }
    },

    sockets: {
      notificationsRefresh: (data) => {
        store.dispatch('sensors/getNewNotifications')
      }
    },
    methods: {
      ...mapMutations({
        setDrawer: 'settings/SET_DRAWER',
      }),

      //TODO: to remove notifications after user click
      removeNotification: function(index) {
        const data = {
          checked: true
        };
        let formData = new FormData();
        formData.append('data', JSON.stringify(data));
        return this.$axios({
          method: 'put',
          url: `/notifications/${this.notifications[index].id}`,
          data: formData,
        }).then(async (res) => {
          await this.$store.dispatch('sensors/getNewNotifications')
        }).catch(err => {
        })
      },

      //TODO: to send test sensor reading data to the server
      createSensorRead: function () {
        // const data = {
        const data = {
          'value': -20
        };
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('topic', "data/12:12:12:12:12:12");
        return this.$axios({
            method: 'post',
            url: '/sensor-data',
            data: formData,
            headers: {'Content-Type': 'application/json'},
          },
        ).then(res => {
        }).catch(err => {
        })
      },

    },


  }
</script>
