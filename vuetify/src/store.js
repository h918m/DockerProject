import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// Modules
import sensors from './store/sensors'
import settings from './store/settings'
import auth from './store/auth'

// import * as Cookies from 'js-cookie'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    sensors,
    settings,
    auth,
  },
  plugins: [createPersistedState({
    /*
    storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
        removeItem: key => Cookies.remove(key),
    },
    */
    paths: ['sensors.models'],
  })],

  /*
   plugins: [createPersistedState()],
   */
})
