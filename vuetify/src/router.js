import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router);

const router = new Router({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      // Authenticaiton
      path: '/authentication',
      component: () => import('@/views/routes/authentication/Index'),
      children: [
        {
          name: 'AuthenticationLogin',
          path: 'login',
          component: () => import('@/views/routes/authentication/Login'),
        },
        {
          name: 'AuthenticationLoginAction',
          path: 'login/:action',
          component: () => import('@/views/routes/authentication/Login'),
          props: true,
        },
        {
          name: 'AuthenticationChoose',
          path: 'choose',
          component: () => import('@/views/routes/authentication/Choose'),
        },
        {
          name: 'Membership',
          path: 'membership',
          component: () => import('@/views/routes/authentication/Membership'),
        },
        {
          name: 'CheckOut',
          path: 'checkout',
          component: () => import('@/views/routes/authentication/Checkout'),
        },
        {
          name: 'AuthenticationRegister',
          path: 'register',
          component: () => import('@/views/routes/authentication/Register'),
        },
        {
          name: 'AuthenticationLogout',
          path: 'logout',
          component: () => import('@/views/routes/authentication/Logout'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      meta: {
        requiresAuth: true,
      },
      children: [

        // Users List
        {
          name: 'UserForm',
          path: 'users/user-form',
          meta: {
            requiresCompany: true
          },
          component: () => import('@/views/routes/user/UserForm'),
        },

        {
          name: 'UserFormAction',
          path: 'users/user-form/:action/:id',
          meta: {
            requiresCompany: true
          },
          component: () => import('@/views/routes/user/UserForm'),
          props: true,
        },

        {
          name: 'UsersList',
          path: 'users/users-list',
          meta: {
            requiresCompany: true
          },
          component: () => import('@/views/routes/user/UsersList'),
        },

        // SENSOR

        {
          name: 'SensorSensorsList',
          path: 'sensor/sensors-list',
          component: () => import('@/views/routes/sensor/SensorsList'),
          props: true,
        },

        {
          name: 'SensorSensorForm',
          path: 'sensor/sensor-form',
          component: () => import('@/views/routes/sensor/SensorForm'),
        },

        {
          name: 'SensorSensorFormAction',
          path: 'sensor/sensor-form/:action/:id',
          component: () => import('@/views/routes/sensor/SensorForm'),
          props: true,
        },

        // MACHINE

        {
          name: 'MachineMachinesList',
          path: 'machine/machines-list',
          component: () => import('@/views/routes/machine/MachinesList'),
        },

        {
          name: 'MachineMachineQRScanner',
          path: 'machine/qr-scanner',
          component: () => import('@/views/routes/machine/MachineQRScanner'),
        },

        {
          name: 'MachineMachineForm',
          path: 'machine/machine-form',
          component: () => import('@/views/routes/machine/MachineForm'),
        },

        {
          name: 'MachineMachineFormAction',
          path: 'machine/machine-form/:action/:id',
          component: () => import('@/views/routes/machine/MachineForm'),
          props: true,
        },

        // SUBMACHINE

        {
          name: 'SubMachinesList',
          path: 'sub-machine/sub-machines-list',
          component: () => import('@/views/routes/subMachine/SubMachinesList'),
        },

        {
          name: 'SubMachineForm',
          path: 'sub-machine/sub-machine-form',
          component: () => import('@/views/routes/subMachine/SubMachineForm'),
        },

        {
          name: 'MachineSubMachinesForMachine',
          path: 'machine/submachines-list/:id',
          component: () => import('@/views/routes/machine/SubMachinesForMachine'),
          props: true,
        },

        // PLANNED MAINTENANCE

        {
          name: 'PlannedMaintenancePlannedMaintenanceCurrentList',
          path: 'planned-maintenance/planned-maintenances-list',
          component: () => import('@/views/routes/plannedMaintenance/PlannedMaintenanceCurrentList'),
        },

        {
          name: 'PlannedMaintenancePlannedMaintenanceCurrentForm',
          path: 'planned-maintenance/planned-maintenance-form',
          component: () => import('@/views/routes/plannedMaintenance/PlannedMaintenanceCurrentForm'),
        },

        {
          name: 'PlannedMaintenancePlannedMaintenanceCurrentFormAction',
          path: 'planned-maintenance/planned-maintenance-form/:action/:id',
          component: () => import('@/views/routes/plannedMaintenance/PlannedMaintenanceCurrentForm'),
          props: true,
        },


        {
          name: 'PlannedMaintenancePlannedMaintenanceCronForm',
          path: 'planned-maintenance/planned-maintenance-cron-form',
          component: () => import('@/views/routes/plannedMaintenance/PlannedMaintenanceCronForm'),
        },

        {
          name: 'PlannedMaintenancePlannedMaintenanceCronFormAction',
          path: 'planned-maintenance/planned-maintenance-cron-form/:action/:id',
          component: () => import('@/views/routes/plannedMaintenance/PlannedMaintenanceCronForm'),
          props: true,
        },

        {
          name: 'PlannedMaintenancePlannedMaintenanceCronList',
          path: 'planned-maintenance/planned-maintenance-cron-list',
          component: () => import('@/views/routes/plannedMaintenance/PlannedMaintenanceCronList'),
        },

        // BREAKDOWN RECORD
        {
          name: 'BreakdownRecordBreakdownForm',
          path: 'work-orders/work-order-form',
          component: () => import('@/views/routes/breakdownRecord/BreakdownForm'),
        },

        {
          name: 'BreakdownRecordBreakdownFormAction',
          path: 'work-orders/work-order-form/:action/:id',
          component: () => import('@/views/routes/breakdownRecord/BreakdownForm'),
          props: true,
        },

        {
          name: 'BreakdownRecordWorkordersList',
          path: 'work-orders/work-orders-list',
          component: () => import('@/views/routes/breakdownRecord/WorkordersList'),
        },

        {
          name: 'BreakdownRecordBreakdownList',
          path: 'work-orders/breakdowns-list',
          component: () => import('@/views/routes/breakdownRecord/BreakdownsList'),
        },


        // Supplier
        {
          name: 'SupplierForm',
          path: 'supplier/supplier-form',
          component: () => import('@/views/routes/supplier/SupplierForm'),
        },

        {
          name: 'SupplierFormAction',
          path: 'supplier/supplier-form/:action/:id',
          component: () => import('@/views/routes/supplier/SupplierForm'),
          props: true,
        },

        {
          name: 'SuppliersList',
          path: 'supplier/suppliers-list',
          component: () => import('@/views/routes/supplier/SuppliersList'),
        },

        // SPARE PART
        {
          name: 'SparePartForm',
          path: 'spare-parts/sparepart-form',
          component: () => import('@/views/routes/SpareParts/SparePartsForm'),
        },

        {
          name: 'SparePartFormAction',
          path: 'spare-parts/sparepart-form/:action/:id',
          component: () => import('@/views/routes/SpareParts/SparePartsForm'),
          props: true,
        },

        {
          name: 'SparePartsList',
          path: 'spare-parts/spareparts-list',
          component: () => import('@/views/routes/SpareParts/SparePartsList'),
        },


        // Facility
        {
          name: 'FacilityForm',
          path: 'facilities/facility-form',
          component: () => import('@/views/routes/facility/FacilityForm'),
        },

        {
          name: 'FacilityFormAction',
          path: 'facilities/facility-form/:action/:id',
          component: () => import('@/views/routes/facility/FacilityForm'),
          props: true,
        },

        {
          name: 'FacilitiesList',
          path: 'facilities/facilities-list',
          component: () => import('@/views/routes/facility/FacilitiesList'),
        },


        // DASHBOARD
        {
          name: 'DashboardHistoricalData',
          path: 'dashboard/historical-data/:id',
          component: () => import('@/views/routes/dashboard/HistoricalData'),
          props: true,
        },
        {
          name: 'DashboardMachineDetailsView',
          path: 'dashboard/machines-list',
          component: () => import('@/views/routes/dashboard/MachineDetailsView'),
        },
        {
          name: 'DashboardSensorsForMachineDashboard',
          path: 'dashboard/sensor-readings-for-machine/:id',
          component: () => import('@/views/routes/dashboard/SensorsForMachineDashboard'),
          props: true,
        },

        // Analytics
        {
          name: 'Analytics',
          path: 'analytics',
          component: () => import('@/views/routes/Analytics'),
          props: true,
        },
        // Notifications
        {
          name: 'Notifications',
          path: 'notifications',
          component: () => import('@/views/routes/Notifications'),
          props: true,
        },
        // END own routes
      ],
    },
    {
      path: '*',
      component: () => import('@/views/routes/authentication/Index'),
      children: [
        {
          name: '404 Error',
          path: '',
          component: () => import('@/views/pages/Error'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  // Checks if path needs Auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is Logged in (if not, push to login page)
    const isLoggedIn = store.getters['auth/isLoggedIn'];
    const isCompany = store.getters['auth/isCompany'];
    if (!isLoggedIn) {
      next({
        path: '/authentication/choose',
      })
    } else{
      // action for authenticated users
      if (to.matched.some(record => record.meta.requiresCompany)) {
        if (isCompany) {
          next();
        } else {
          next({path: '/authentication/choose'})
        }
      } else {
        next();
      }
    }
  } else {
    // action for not requires authentication routes
    next()
  }
});

export default router
