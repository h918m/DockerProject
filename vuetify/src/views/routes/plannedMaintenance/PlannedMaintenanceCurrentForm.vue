<template>
  <v-container
    id="regular-forms"
    fluid
    tag="section"
  >
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Please enter your email address
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <validation-provider
                  v-slot="{ errors }"
                  rules="email"
                  name="Email address"
                >
                  <v-text-field
                    v-model="emailAddress"
                    label="Email address*"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>


        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="confirmMail()"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <loading
      :active.sync="loading"
      :loader="loaderOptions.loader"
      :color="loaderOptions.color"
      :width="loaderOptions.width"
      :height="loaderOptions.height"
      :background-color="loaderOptions.backgroundColor"
      :is-full-page="loaderOptions.isFullPage"
    />
    <base-v-component
      heading="Forms"
      link="components/forms"
    />

    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        lg="7"
        align="right"
        v-if="this.action === 'modify'"
      >
        <v-menu
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Export to PDF
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in optionsForExport"
              :key="index"
              @click="doExportPDF(index)"
            >
              <v-list-item-title
              >{{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col
        cols="12"
        md="7"
      >
        <base-material-card
          color="blue"
          icon="mdi-plus"
          :title="`${ isAdmin ? getActionName : 'View'} Planned Maintenance`"
          class="px-5 py-3"
        >
          <validation-observer
            v-slot="{ handleSubmit }"
            slim
          >
            <v-form
              class="mt-5"
              @submit.prevent="handleSubmit(onSubmit)"
            >
              <v-col
                cols="12"
                class="ma-0 pa-0"
              >
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="User"
                  v-if="isAdmin"
                >
                  <v-select
                    v-model="form.user"
                    color="secondary"
                    item-color="secondary"
                    label="User"
                    :disabled="formIsDisabled"
                    return-object
                    :error-messages="errors"
                    :items="userList"
                    item-text="name"
                    item-value="id"
                    multiple
                    class="text-transform-normal"
                  >
                    <template v-slot:item="{ attrs, item, on }">
                      <v-list-item
                        v-bind="attrs"
                        active-class="secondary elevation-4 white--text"
                        class="mx-3 mb-3 v-sheet"
                        elevation="0"
                        v-on="on"
                      >
                        <v-list-item-content>
                          <v-list-item-title v-text="`${item ? item.name : ''}`"/>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </validation-provider>
                
                <v-row>
                  <!-- Machines list -->
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="Machine"
                    >
                      <v-select
                        v-model="form.machine"
                        color="secondary"
                        item-color="secondary"
                        label="Machine"
                        :disabled="formIsDisabled"
                        return-object
                        :error-messages="errors"
                        :items="machines"
                        item-text="name"
                        item-value="id"
                        @change="getSubMachines"
                      >
                        <template v-slot:item="{ attrs, item, on }">
                          <v-list-item
                            v-bind="attrs"
                            active-class="secondary elevation-4 white--text"
                            class="mx-3 mb-3 v-sheet"
                            elevation="0"
                            v-on="on"
                          >
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="`${item ? item.name : ''}`"/>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>
                    </validation-provider>
                  </v-col>

                  <!-- SubMachines list -->
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="Submachines"
                    >
                      <v-select
                        v-model="form.submachine"
                        color="secondary"
                        item-color="secondary"
                        label="SubMachines"
                        :disabled="formIsDisabled"
                        return-object
                        :error-messages="errors"
                        :items="submachines"
                        item-text="name"
                        item-value="id"
                      >
                        <template v-slot:item="{ attrs, item, on }">
                          <v-list-item
                            v-bind="attrs"
                            active-class="secondary elevation-4 white--text"
                            class="mx-3 mb-3 v-sheet"
                            elevation="0"
                            v-on="on"
                          >
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="`${item ? item.name : ''}`"/>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>
                    </validation-provider>
                  </v-col>

                </v-row>

                <!--Maintenance Image-->
                <v-col cols="8">
                  <validation-provider
                    v-slot="{ errors }"
                    ref="provider"
                    :rules="`${action === 'add' ? 'required' : ''}`"
                    name="Work order Image"
                  >
                    <div class="font-weight-bold grey--text">
                      Take a Picture of the planned maintenance
                    </div>
                    <input
                      ref="file"
                      type="file"
                      class="d-none"
                      accept="image/*"
                      :disabled="formIsDisabled"
                      @change="onImageChange"
                    >
                    <v-card
                      :class="form.image ? 'success--text' : 'grey--text'"
                      class="mx-auto mt-0 d-inline-flex v-card--account"
                      outlined
                      @click="$refs.file.click()"
                    >
                      <v-img
                        v-if="form.imageUrl"
                        :src="form.imageUrl"
                        height="100%"
                        width="100%"
                      />
                      <v-icon
                        v-else
                        class="mx-auto"
                        :disabled="formIsDisabled"
                        size="280"
                      >
                        mdi-camera
                      </v-icon>
                    </v-card>
                    <div
                      class="red--text"
                      v-text="errors[0]"
                    />
                  </validation-provider>
                </v-col>

                <!-- Task Description -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="min:1"
                  name="Task Description"
                >
                  <v-text-field
                    v-model="form.task"
                    :error-messages="errors"
                    :disabled="formIsDisabled"
                    color="secondary"
                    label="Task to be added for Planned Maintenance"
                  />
                </validation-provider>
                <!-- Component Description -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="min:1"
                  name="Component Description"
                >
                  <v-text-field
                    v-model="form.component"
                    :error-messages="errors"
                    :disabled="formIsDisabled"
                    color="secondary"
                    label="Component Description"
                  />
                </validation-provider>
                <!-- Task type -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Task type"
                >
                  <v-select
                    v-model="form.type"
                    color="secondary"
                    item-color="secondary"
                    label="Task type"
                    :disabled="formIsDisabled"
                    :error-messages="errors"
                    :items="maintenanceTypes"
                  >
                    <template v-slot:item="{ attrs, item, on }">
                      <v-list-item
                        v-bind="attrs"
                        active-class="secondary elevation-4 white--text"
                        class="mx-3 mb-3 v-sheet"
                        elevation="0"
                        v-on="on"
                      >
                        <v-list-item-content>
                          <v-list-item-title> {{ item | capitalize }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template v-slot:selection="{item}">
                      <div>{{ item | replaceUnderscoreWithSpace }}</div>
                    </template>
                  </v-select>
                </validation-provider>
                <!-- Completed -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Completed"
                >
                  <v-switch
                    v-model="form.completed"
                    :disabled="isAdmin? formIsDisabled : false"
                    hide-details
                    :label="`Completed: ${form.completed ? 'Yes' : 'No'}`"
                    :error-messages="errors"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  rules="min:1"
                  name="Additional Comments"
                >
                  <v-textarea
                    v-model="form.comment"
                    name="textarea-1"
                    :error-messages="errors"
                    :disabled="formIsDisabled"
                    label="Additional Comments"
                  />
                </validation-provider>
              </v-col>
              <v-card-actions class="pl-0">
                <v-btn
                  color="success"
                  min-width="100"
                  type="submit"
                  :disabled="isAdmin ? formIsDisabled : (originalValue === form.completed)"
                >
                  {{ getActionName }} Planned Maintenance
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </base-material-card>
      </v-col>
    </v-row>
    <base-material-snackbar
      v-model="snackbar.snackbar"
      :type="snackbar.type"
      v-bind="{
        top : true
      }"
    >
      {{ snackbar.message }}
    </base-material-snackbar>
  </v-container>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';
  import jsPDF from "jspdf";

  export default {
    name: 'PlannedMaintenancePlannedMaintenanceCurrentForm',
    props: {
      id: {
        default: '0',
        type: String,
      },
      action: {
        default: 'add',
        type: String,
      },
    },
    data: () => ({
      emailAddress: '',
      originalValue: null, // used for normal user if he changed the status
      dialog: false,
      optionsForExport: [
        { title: 'Save to PC' },
        { title: 'Send to Email' },
      ],
      snackbar: {
        snackbar: false,
        type: 'success',
        message: '',
      },
      userList: [],
      loading: true,
      formIsValid: null,
      formIsDisabled: false,
      maintenanceTypes: ['mechanical', 'electrical', 'pneumatic', 'steam', 'control', 'sensor'],
      machines: [],
      submachines: [],
      form: {
        image: null,
        imageUrl: null,
        type: '',
        completed: false,
        machine: null,
        submachine: null,
        task: '',
        component: '',
        comment: '',
        user: null,
        submachine: null
      },
    }),
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
        user: state => state.auth.user,
        company: state => state.auth.company.id
      }),
      ...mapGetters({
        isAdmin: 'auth/isAdmin'
      }),
      getActionName() {
        return this.action.replace(/^./, this.action[0].toUpperCase())
      },
    },

    async mounted() {
      this.loading = true;
      if (!this.isAdmin) {
        this.formIsDisabled = true;
      } else {
        this.userList = await this.getUserList();
      }
      // Load form data
      this.machines = await this.getMachines();

      // Check action
      switch (this.action) {
        case 'modify':
          this.form = await this.getFormForId(this.id);
          break;
        case 'add':
          break;
        default:
          break
      }

      this.loading = false
    },

    methods: {
      //get pdf
      getPDF() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        const date = new Date().toISOString().replace(".", "");
        const machine = "Machine: " + (this.form.machine? this.form.machine.name: '');
        const assignedTo = "Assigned to:   " + this.getUserName(this.form.user);
        const taskToBeAdded = "Task to be added for Planned Maintenance:   " + this.form.task;
        const componentDesk = "Component Description:   " + this.form.component;
        const taskType = "Task type:   " + this.form.type;
        const completed = "Is this task completed?   " + (this.form.completed ? "Yes" : "No");
        const additionalComments = "Additional comments:   " + this.form.comment;
        var splitAdditions = doc.splitTextToSize(additionalComments, 550);

        doc.setFontSize(15);
        const title = "Planned Maintenance - " + this.id.substr(-5,5);
        doc.text(title, 155, 70);
        doc.setFontSize(12);

        doc.text(assignedTo, 40, 100);
        doc.text(machine, 40, 120);
        doc.text(taskToBeAdded, 40, 140);
        doc.text(componentDesk, 40, 160);
        doc.text(taskType, 40, 180);
        doc.text(completed, 40, 200);
        doc.text(splitAdditions, 40, 220);
        if (this.form.imageUrl) {
          doc.addImage(this.form.imageUrl, "JPEG", 350, 150, 200, 200);
        }
        return [doc.output('dataurl'), title];

      },


      //TODO: get file object from base64
      dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);

        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {type:mime});
      },


      //TODO: COnfirm mail
      confirmMail() {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(this.emailAddress)) {
          return ;
        }
        this.dialog = false;
        const [pdf, title] = this.getPDF();
        var file = this.dataURLtoFile(pdf,'attachment.pdf');
        const formData = new FormData();
        const data = {
          text: "completed",
          mail: this.emailAddress
        };
        formData.append('data', JSON.stringify(data));
        formData.append('files.pdf', file, file.name);
        return this.$axios({
            method: 'POST',
            url: `/send-pdfs`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'},
          },
        ).then(({data}) => {
          this.snackbar = {
            message: 'Successfully sent sent PDF to your mail',
            type: 'success',
            snackbar: true,
          };
          return data
        })
          .catch(err => {
            this.snackbar = {
              message: `There was an error adding your request. Message: ${err.message}`,
              type: 'error',
              snackbar: true,
            }
          });
      },


      //TODO: handle image changes
      async onImageChange(val) {
        const {valid} = await this.$refs.provider.validate(val);
        if (valid) {
          const value = val.target.files[0];

          if (!value) {
            return (this.form.image = null)
          }
          this.form.image = value;
          this.form.imageUrl = URL.createObjectURL(this.form.image);
          return true
        } else return (this.form.image = null)
      },

      getUserName(data) {
        if (!data || data.length === 0) {
          return ''
        } else {
          let name = "";
          data.forEach(item => {
            name += item.name + ' ,'
          });
          return name.slice(0, -1);
        }
      },
      doExportPDF(index) {
        if (index === 0) {
          const unit = "pt";
          const size = "A4"; // Use A1, A2, A3 or A4
          const orientation = "portrait"; // portrait or landscape
          const doc = new jsPDF(orientation, unit, size);
          const date = new Date().toISOString().replace(".", "");
          const machine = "Machine: " + (this.form.machine? this.form.machine.name: '');
          const assignedTo = "Assigned to:   " + this.getUserName(this.form.user);
          const taskToBeAdded = "Task to be added for Planned Maintenance:   " + this.form.task;
          const componentDesk = "Component Description:   " + this.form.component;
          const taskType = "Task type:   " + this.form.type;
          const completed = "Is this task completed?   " + (this.form.completed ? "Yes" : "No");
          const additionalComments = "Additional comments:   " + this.form.comment;
          var splitAdditions = doc.splitTextToSize(additionalComments, 550);

          doc.setFontSize(15);
          const title = "Planned Maintenance - " + this.id.substr(-5,5);
          doc.text(title, 155, 70);
          doc.setFontSize(12);

          doc.text(assignedTo, 40, 100);
          doc.text(machine, 40, 120);
          doc.text(taskToBeAdded, 40, 140);
          doc.text(componentDesk, 40, 160);
          doc.text(taskType, 40, 180);
          doc.text(completed, 40, 200);
          doc.text(splitAdditions, 40, 220);
          if (this.form.imageUrl) {
            doc.addImage(this.form.imageUrl, "JPEG", 350, 150, 200, 200);
          }
          doc.save(title + "_" + date);
        } else {
          this.dialog = true;
        }
      },
      async getSubMachines() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              subMachines(where: {company: "${this.company}", machine: {id: "${this.form.machine.id}"}}) {
                  name
                  id
              }
          }`,
          },
        })
          .then(({data}) => {
            if (data.data.subMachines) {
              this.submachines = data.data.subMachines
              return data.data.subMachines
            } else {
              return []
            }
          })
      },
      async getUserList() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
            users(where: {level: 2, company: "${this.company}"}) {
              id
              name
            }
          }`,
          },
        }).then(res => {
          if (res.data.data.users) {
            return res.data.data.users
          } else {
            return [];
          }
        })
      },
      async getFormForId(id) {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              plannedMaintenanceTask(id: "${id}"){
                completed
                createdAt
                type
                task
                component
                machine{
                    name
                    id
                }
                image {
                  id
                  name
                  url
                }
                users {
                  id
                  name
                }
                comment
              }
            }`,
          },
        }).then(({data}) => {
          const result = data.data.plannedMaintenanceTask;
          this.originalValue = result.completed;
          return {
            task: result.task,
            completed: result.completed,
            type: result.type,
            imageUrl: result.image?(process.env.VUE_APP_API_BASE_URL + result.image.url) : null,
            component: result.component,
            machine: result.machine,
            comment: result.comment,
            user: result.users
          }
        })
      },
      async modifyPlannedMaintenance() {
        const {type, task, component, completed, machine, submachine, comment, user, image} = this.form;
        let userParam = [];
        if (user) {
          user.forEach(item => {
            userParam.push(item.id)
          });
        }
        const data = {
          type: type,
          comment: comment,
          task: task,
          machine: machine.id,
          submachine: submachine.id,
          component: component,
          completed: completed,
          users: userParam,
          company: this.company
        };
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (image) {
          formData.append('files.image', image, image.name);
        }
        return this.$axios({
            method: 'PUT',
            // The this.id points on the ID from props
            url: `/planned-maintenance-tasks/${this.id}`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'},
          },
        ).then(({data}) => {
          this.snackbar = {
            message: 'Planned maintenance has been successfully added.',
            type: 'success',
            snackbar: true,
          };
          return data
        })
          .catch(err => {
            this.snackbar = {
              message: `There was an error adding your request. Message: ${err.message}`,
              type: 'error',
              snackbar: true,
            }
          });
      },
      async addPlannedMaintenance() {
        const {type, task, component, completed, machine, submachine, comment, user, image} = this.form;
        let userParam = [];
        if (user) {
          user.forEach(item => {
            userParam.push(item.id)
          });
        }
        const data = {
          type: type,
          comment: comment,
          task: task,
          machine: machine.id,
          submachine: submachine.id,
          component: component,
          completed: completed,
          users: userParam,
          company: this.company
        };
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('files.image', image, image.name);
        return this.$axios({
            method: 'POST',
            // The this.id points on the ID from props
            url: `/planned-maintenance-tasks`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'},
          },
        ).then(({data}) => {
          this.snackbar = {
            message: 'Planned maintenance has been successfully added.',
            type: 'success',
            snackbar: true,
          };
          return data
        })
          .catch(err => {
            this.snackbar = {
              message: `There was an error adding your request. Message: ${err.message}`,
              type: 'error',
              snackbar: true,
            }
          });
      },
      async sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      },
      async onSubmit() {
        this.loading = true;
        this.formIsDisabled = true;

        switch (this.action) {
          case 'add':
            await this.addPlannedMaintenance();
            break;
          case 'modify':
            await this.modifyPlannedMaintenance();
            break
        }

        this.loading = false;

        return this.sleep(500)
          .then(() => {
            this.$router.push('/planned-maintenance/planned-maintenances-list')
          })
      },
      async getMachines() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              machines(where: {company: "${this.company}"}) {
                  name
                  id
              }
          }`,
          },
        })
          .then(({data}) => {
            if (data.data.machines) {
              return data.data.machines
            } else {
              return []
            }
          })
      },
    },
  }

</script>
