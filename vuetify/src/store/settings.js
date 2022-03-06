export default {
    namespaced: true,
    state: {
        barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
        barImage: require('@/assets/background.jpg'),
        logoImage: require('@/assets/Logo.png'),
        drawer: null,
        // Options for loader
        loader: {
          color: 'indigo',
          backgroundColor: '#DDDDDD',
          width: 180,
          height: 180,
          loader: 'spinner',
          isFullPage: false,
        },
      },
      mutations: {
        SET_DRAWER (state, payload) {
          state.drawer = payload
        },
        SET_SCRIM (state, payload) {
          state.barColor = payload
        },
      },
      actions: {

      },
}
