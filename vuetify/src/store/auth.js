import axios from '@/plugins/axios-interceptor'

export default {
  namespaced: true,
  state: {
    JWTToken: '',
    user: {},
    company: {}
  },
  actions: {
    async login({commit, dispatch}, payload) {
      // Send request to API to login
      return axios({
        url: '/graphql',
        removeAuthToken: true,
        method: 'POST',
        data: {
          query: `mutation{
                        login(input: {
                            identifier: "${payload.email}",
                            password: "${payload.password}"
                        }){
                            jwt
                            user{
                                id
                                email
                                name
                                surname
                            }
                        }
                    }`,
        },
      }).then(async ({data}) => {
        commit('setJWT', data.data.login.jwt);
        await axios({
          url: '/graphql',
          method: 'POST',
          data: {
            query: `{
              user(id: "${data.data.login.user.id}") {
                id
                name
                surname
                email
                level
                company {
                  id
                  membership
                }
              }
            }
                    `
          }
        }).then(res => {
          console.log("=====================", res);
          commit('setUser', res.data.data.user);
          commit('setCompany', res.data.data.user.company);
        });
      }).catch((err) => {
        // Clear user and JWT
        dispatch('logout');
        console.error('loginError', err)
      })
    },
    logout({commit}) {
      commit('setUser', '');
      commit('setJWT', '');
      commit('setCompany', '');
    },
    register({commit, dispatch}, payload) {
      return axios({
        url: '/graphql',
        removeAuthToken: true,
        method: 'POST',
        data: {
          query: `mutation{
                        register(input: {
                            username: "${payload.email}",
                            email: "${payload.email}",
                            name: "${payload.name}",
                            surname: "${payload.surname}",
                            password: "${payload.password}",
                            level: 0
                        }){
                            jwt
                            user{
                                id
                                email
                                name
                                surname
                            }
                        }
                    }`,
        },
      }).then(async ({data}) => {
        commit('setUser', {...data.data.register.user, level: 0});
        commit('setJWT', data.data.register.jwt);
        await axios({
          url: '/graphql',
          method: 'POST',
          data: {
            query: `
                    mutation {
                      createCompany(input: {
                        data: {
                          users: "${data.data.register.user.id}"
                        }
                      }){
                        company {
                          id
                          membership
                        }
                      }
                    }
                    `
          }
        }).then(res => {
          commit('setCompany', res.data.data.createCompany.company)
        }).catch(e => {
          console.error('companyError', err)
        })
      }).catch((err) => {
        // Clear user and JWT
        dispatch('logout');
        console.error('loginError', err)
      })
    },
  },
  getters: {
    isLoggedIn(state) {
      return !(!state.JWTToken || !state.user);
    },
    isAdmin(state) {
      if (state) {
        return state.user.level === 1;
      } else {
        return null;
      }
    },
    isCompany(state) {
      if (state) {
        return state.user.level === 0;
      } else {
        return null;
      }
    },
    isSubscribed(state) {
      return state.company.membership !== 0;
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setJWT(state, payload) {
      state.JWTToken = payload
    },
    setCompany(state, payload) {
      state.company = payload
    },
    modifyCompany(state, payload) {
      state.company = {...state.company, membership: payload}
    }
  },
}
