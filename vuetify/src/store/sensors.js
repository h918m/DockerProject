import axios from '@/plugins/axios-interceptor'

export default {
  namespaced: true,
  state: {
    keyValue: 0,
    models: [{
      name: '',
      id: '',
      sensors_to_models: [{
        id: '',
        name: '',
        MAC: '',
        range: {
          minimum: 0,
          maximum: 100
        },
        sensorReadings: [{
          formattedData: {},
          createdAt: '',
          MAC: '',
        }],
      }],
    }],
    notifications: []
  },
  actions: {
    async getSensorModels({commit, dispatch, rootGetters, rootState}) {
      let isAdmin = rootGetters['auth/isAdmin'];
      let userId = rootState['auth'].user.id;
      let company = rootState['auth'].company.id;
      // Get models and set state of models
      //TODO: get data if the user role is isAdmin or not
      if (isAdmin) {
        const url = '/graphql';
        return axios({
          method: 'POST',
          url: url,
          data: {
            query: `
            {
              machines(where: {company: "${company}"}){
                name
                id
                sensors_to_models{
                    id
                    name
                    MAC
                    customModel
                    model
                    customModelValue {
                      name
                      symbol
                    }
                    limit {
                      minimum
                      maximum
                    }
                    range {
                      minimum
                      maximum
                    }
                  }
              }
            }
            `,
          },
        })
          .then(({data}) => {
            if (data.data.machines) {
              commit('setModel', data.data.machines)
            }
            return dispatch('refetchSensorData')
          })
      } else {
        const url = '/graphql';
        return axios({
          method: 'POST',
          url: url,
          data: {
            query: `
            {
              machines (where: {company: "${company}", users: {id: "${userId}"}}){
                name
                id

                sensors_to_models{
                    id
                    name
                    MAC
                    customModel
                    model
                    customModelValue {
                      name
                      symbol
                    }
                     limit {
                      minimum
                      maximum
                    }
                    range {
                      minimum
                      maximum
                    }
                  }
              }
            }
            `,
          },
        })
          .then(({data}) => {
            if (data.data.machines) {
              commit('setModel', data.data.machines)
            }
            return dispatch('refetchSensorData')
          })
      }

    },
    setNewSensorData({state, commit}, payload) {
      //TODO:  Looping through each sensor and updates the data for it
      for (let machineIndex = 0; machineIndex < state.models.length; machineIndex += 1) {
        for (let sensors_to_modelIndex = 0; sensors_to_modelIndex < state.models[machineIndex].sensors_to_models.length; sensors_to_modelIndex += 1) {
          const MAC = state.models[machineIndex].sensors_to_models[sensors_to_modelIndex].MAC;
          if (MAC === payload.MAC) {
            state.models[machineIndex].sensors_to_models[sensors_to_modelIndex].sensorReadings[0].formattedData = payload.formattedData;
            commit('incrementKeyValue');
            return null
          }
        }
      }
    },
    async refetchSensorData({state}) {
      // Looping through each sensor and updates the data for it
      if (!state.models) {
        return;
      }


      for (let machineIndex = 0; machineIndex < state.models.length; machineIndex += 1) {
        for (let sensors_to_modelIndex = 0; sensors_to_modelIndex < state.models[machineIndex].sensors_to_models.length; sensors_to_modelIndex += 1) {
          const MAC = state.models[machineIndex].sensors_to_models[sensors_to_modelIndex].MAC;
          if (MAC !== "") {
            state.models[machineIndex].sensors_to_models[sensors_to_modelIndex].sensorReadings = await axios({
              method: 'POST',
              url: '/graphql',
              data: {
                query: `{
                        sensorData(where: {MAC: "${MAC}" }, limit: 1, sort: "createdAt:desc"){
                            formattedData
                            createdAt
                            MAC
                        }
                    }`,
              },
            }).then((res) => {
              if (res.data.data.sensorData) {
                return res.data.data.sensorData
              } else {
                return []
              }
            })
          }
        }
      }
    },
    async getNewNotifications({state, commit, rootGetters, rootState}) {
      let userId = rootState['auth'].user.id;

      return axios({
        method: 'POST',
        url: '/graphql',
        data: {
          query: `{
              notifications (sort: "createdAt:desc", where: {user: "${userId}", checked: false}){
                id
                eventDescription
                checked
                 user {
                    name
                  }
              }
            }`
        }
      }).then(res => {
        if (res.data.data.notifications) {
          return commit('setNotification', res.data.data.notifications)
        }
      }).catch(err => {
        return []
      })
    }

  },
  mutations: {
    setModel(state, payload) {
      state.models = payload
    },
    setNotification(state, payload) {
      state.notifications = payload
    },
    // This is used to update sensors
    incrementKeyValue(state) {
      state.keyValue += 1
    },
  },
}
