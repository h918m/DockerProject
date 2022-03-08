<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-break-point="960"
    app
    mini-variant-width="80"
    width="280"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>
<!--    <v-list-item two-line>-->
<!--      <v-list-item-content>-->
<!--        <v-list-item-title class="text-uppercase font-weight-regular display-2">-->
<!--          <span class="logo-mini">CM</span>-->
<!--          <span class="logo-normal">Condition Monitoring</span>-->
<!--        </v-list-item-title>-->
<!--      </v-list-item-content>-->
<!--    </v-list-item>-->

        <v-list-item class="pt-4 pb-2">
          <v-list-item-content>
            <v-img
              :src="logoImage"
            />
          </v-list-item-content>
        </v-list-item>
    <v-divider class="mb-1" />

    <v-list
      dense
      nav
    >
      <base-item-group :item="profile" />
    </v-list>

    <v-divider class="mb-2" />

    <v-list
      expand
      nav
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        >
          <!--  -->
        </base-item-group>

        <base-item
          v-else
          :key="`item-${i}`"
          :item="item"
        />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapState , mapGetters} from 'vuex'
import ItemGroup from "../../../../components/base/ItemGroup";

export default {
  name: 'DashboardCoreDrawer',
  components: {ItemGroup},
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },


  computed: {
    ...mapState({
      barColor: state => state.settings.barColor,
      barImage: state => state.settings.barImage,
      logoImage: state => state.settings.logoImage,
      }),
    ...mapGetters({
      isAdmin: 'auth/isAdmin',
      isCompany: 'auth/isCompany'
    }),
    items: function() {
      if (this.isCompany) {
        return ([
          {
            group: '/users',
            title: 'Users',
            icon: 'mdi-account-group',
            children: [
              {
                title: 'Users List',
                to: 'users-list',
              },
              {
                title: 'Add User',
                to: 'user-form',
              },
            ],
          },
        ])
      }
      else if (this.isAdmin) {
        return([
          {
            group: '/dashboard',
            title: 'Dashboard',
            icon: 'mdi-view-dashboard-outline',
            children: [
              // {
              //   title: 'Historical Data TEST',
              //   to: 'historical-data/5e74f348f3580f00125b1f30',
              // },
              {
                title: 'Machine Choosing',
                to: 'machines-list',
              },
            ],
          },
          {
            group: '/work-orders',
            title: 'Work Orders',
            icon: 'mdi-clipboard-alert-outline',
            children: [
              {
                title: 'Submit Work order',
                to: 'work-order-form',
              },
              {
                title: 'List Work orders',
                to: 'work-orders-list',
              },
              {
                title: 'List Breakdowns',
                to: 'breakdowns-list',
              },
            ],
          },
          {
            group: '/planned-maintenance',
            title: 'Planned Maintenance',
            icon: 'mdi-clipboard-list-outline',
            children: [
              {
                title: 'PM Cron list',
                to: 'planned-maintenance-cron-list',
              },
              {
                title: 'Add PM Cron',
                to: 'planned-maintenance-cron-form',
              },
              // {
              //   title: 'Current Maintenances List',
              //   to: 'current-maintenances-list',
              // },
              // {
              //   title: 'Current Maintenance Form',
              //   to: 'current-planned-maintenance-form',
              // },

              {
                title: 'PM list ',
                to: 'planned-maintenances-list',
              },
              {
                title: 'Add PM',
                to: 'planned-maintenance-form',
              },
            ],
          },
          {
            icon: 'mdi-access-point',
            group: '/sensor',
            title: 'Sensors',
            children: [
              {
                title: 'Sensors List',
                to: 'sensors-list',
              },
              {
                title: 'Add sensor',
                to: 'sensor-form',
                icon: 'mdi-plus',
              },
            ],
          },

          {
            group: '/sub-machine',
            title: 'SubMachines',
            icon: 'mdi-screw-machine-flat-top',
            children: [
              {
                title: 'SubMachines List',
                to: 'sub-machines-list',
              },
              {
                title: 'Add SubMachine',
                to: 'sub-machine-form',
              },
            ],
          },
          {
            group: '/machine',
            title: 'Machines',
            icon: 'mdi-screw-machine-round-top',
            children: [
              {
                title: 'Machines List',
                to: 'machines-list',
              },
              {
                title: 'Add machine',
                to: 'machine-form',
              },
            ],
          },
          {
            group: '/facilities',
            title: 'Facilities',
            icon: 'mdi-bank',
            children: [
              {
                title: 'Facilities List',
                to: 'facilities-list',
              },
              {
                title: 'Add Facility',
                to: 'facility-form',
              },
            ],
          },
          {
            group: '/spare-parts',
            title: 'Spare Parts',
            icon: 'mdi-cogs',
            children: [
              {
                title: 'Spare Parts List',
                to: 'spareparts-list',
              },
              {
                title: 'Add Spare Part',
                to: 'sparepart-form',
              },
            ],
          },
          //
          // {
          //   group: '/authentication',
          //   title: 'Authentication',
          //   icon: 'mdi-account',
          //   children: [
          //     {
          //       title: 'Login',
          //       to: 'login',
          //     },
          //     {
          //       title: 'Logout',
          //       to: 'logout',
          //     },
          //   ],
          // },
          {
            group: '/analytics ',
            title: 'Analytics',
            icon: 'mdi-google-analytics',
            to: '/analytics'
          },
          {
            group: '/notifications ',
            title: 'Notifications',
            icon: 'mdi-bell',
            to: '/notifications'
          },
        ])
      } else {
        return ([
          {
            group: '/dashboard',
            title: 'Dashboard',
            icon: 'mdi-view-dashboard-outline',
            children: [
              // {
              //   title: 'Historical Data TEST',
              //   to: 'historical-data/5e74f348f3580f00125b1f30',
              // },
              {
                title: 'Machine Choosing',
                to: 'machines-list',
              },
            ],
          },
          {
            group: '/work-orders',
            title: 'Work Orders',
            icon: 'mdi-clipboard-alert-outline',
            children: [
              {
                title: 'Submit Work order',
                to: 'work-order-form',
              },
              {
                title: 'List Work orders',
                to: 'work-orders-list',
              },
              {
                title: 'List Breakdowns',
                to: 'breakdowns-list',
              },
            ],
          },
          // {
          //   group: '/breakdown-record',
          //   title: 'Breakdown Record',
          //   icon: 'mdi-clipboard-alert-outline',
          //   to: '/breakdown-record/breakdown-list',
          //   // children: [
          //   //   {
          //   //     title: 'List Breakdowns',
          //   //     to: 'breakdown-list',
          //   //   },
          //   // ],
          // },
          {
            group: '/planned-maintenance',
            title: 'Planned Maintenance',
            icon: 'mdi-clipboard-list-outline',
            children: [
              {
                title: 'PM Cron list',
                to: 'planned-maintenance-cron-list',
              },
              // {
              //   title: 'Current Maintenances List',
              //   to: 'current-maintenances-list',
              // },
              // {
              //   title: 'Current Maintenance Form',
              //   to: 'current-planned-maintenance-form',
              // },

              {
                title: 'PM list ',
                to: 'planned-maintenances-list',
              },
            ],
          },
          {
            icon: 'mdi-access-point',
            group: '/sensor',
            title: 'Sensors',
            to: '/sensor/sensors-list',
            // children: [
            //   {
            //     title: 'Sensors List',
            //     to: 'sensors-list',
            //   }
            // ],
          },

          {
            group: '/machine',
            title: 'Machines',
            icon: 'mdi-screw-machine-round-top',
            to: '/machine/machines-list',
            // children: [
            //   {
            //     title: 'Machines List',
            //     to: 'machines-list',
            //   },
            // ],
          },
          {
            group: '/facilities',
            title: 'Facilities',
            icon: 'mdi-screw-machine-round-top',
            to: '/facilities/facilities-list'
            // children: [
            //   {
            //     title: 'Facilities List',
            //     to: 'facilities-list',
            //   },
            //   {
            //     title: 'Add Facility',
            //     to: 'facility-form',
            //   },
            // ],
          },
          {
            group: '/spare-parts',
            title: 'Spare Parts',
            icon: 'mdi mdi-transit-connection',
            to: '/spare-parts/spareparts-list',
            // children: [
            //   {
            //     title: 'Spare Parts List',
            //     to: 'spareparts-list',
            //   }
            // ],
          },
          {
            group: '/analytics ',
            title: 'Analytics',
            icon: 'mdi-google-analytics',
            to: '/analytics'
          },
        ])
      }
    },
    drawer: {
      get () {
        return this.$store.state.settings.drawer
      },
      set (val) {
        this.$store.commit('settings/SET_DRAWER', val)
      },
    },
    computedItems () {
      return this.items.map(this.mapItem)
    },
    profile () {
      const user = this.$store.state.auth.user;
      return {
        avatar: false,
        group: '',
        title: `${user.name} ${user.surname}`,
        children: [
          {
            title: 'Logout',
            to: 'authentication/logout',
          },
        ],
      }
    },
  },

  watch: {
    '$vuetify.breakpoint.smAndDown' (val) {
      this.$emit('update:expandOnHover', !val)
    },
  },

  methods: {
    mapItem (item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: item.title,
      }
    },
  },
}
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    &.v-navigation-drawer--mini-variant
      .v-list-item
        justify-content: flex-start !important

      .v-list-group--sub-group
        display: block !important

    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
</style>
