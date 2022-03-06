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
          color="success"
          icon="mdi-plus"
          :title="`${ isAdmin ? getActionName : 'View'} sensor`"
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
              <v-row
              >
                <v-col cols="12">
                  <!-- Sensor name -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Sensor Name"
                  >
                    <v-text-field
                      v-model="form.name"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      color="secondary"
                      label="Friendly name for a Sensor"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12">
                  <!-- MAC Address of the sensor -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="MAC|required"
                    name="MAC"
                  >
                    <v-text-field
                      v-model="form.MAC"
                      :disabled="formIsDisabled"
                      :error-messages="errors"
                      counter="17"
                      color="secondary"
                      label="MAC Address of the Sensor"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12">
                  <!-- Sub Machines list -->
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
                      :error-messages="errors"
                      :items="machines"
                      return-object
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
                            <v-list-item-title v-text="`${item ? item.name : ''}`" />
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>
                  </validation-provider>
                </v-col>

                <v-col cols="12">
                  <!-- Custom or Default error -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Operators Error"
                  >
                    <v-switch
                      v-model="form.customModel"
                      :disabled="formIsDisabled"
                      hide-details
                      :label="`Use custom model: ${form.customModel ? 'Yes' : 'No'}`"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12" v-if="!form.customModel">
                  <!-- Sensor Models list -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Sensor Model"
                  >
                    <v-select
                      v-model="form.model"
                      color="secondary"
                      item-color="secondary"
                      label="Sensor Model"
                      :disabled="formIsDisabled"
                      :error-messages="errors"
                      :items="sensorModels"
                      item-text="label"
                      item-value="value"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="6" v-if="form.customModel">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Custom model name"
                  >
                    <v-text-field
                      v-model="form.customModelValue.name"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      color="secondary"
                      label="Custom model name"
                    />
                  </validation-provider>

                </v-col >
                <v-col cols="6" v-if="form.customModel">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Custom model symbol"
                  >
                    <v-text-field
                      v-model="form.customModelValue.symbol"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      color="secondary"
                      label="Custom model symbol"
                    />
                  </validation-provider>
                </v-col>


<!--                Range-->
                <v-col cols="12" v-if="form.model !== 'indicator' && form.model !== 'call' ">
                  <v-row>
                    <v-col cols="12">
                      <h4>Range</h4>
                    </v-col>
                    <v-col cols="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Minimum value"
                      >
                        <v-text-field
                          v-model="form.range.minimum"
                          :error-messages="errors"
                          :disabled="formIsDisabled"
                          color="secondary"
                          label="Minimum value"
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Maximum value"
                      >
                        <v-text-field
                          v-model="form.range.maximum"
                          :error-messages="errors"
                          :disabled="formIsDisabled"
                          color="secondary"
                          label="Maximum value"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-col>


<!--                Limits-->
                <v-col cols="12" v-if="form.model !== 'indicator' && form.model !== 'call' ">
                  <v-row>
                    <v-col cols="12">
                      <h4>Limit</h4>
                    </v-col>
                    <v-col cols="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Minimum value"
                      >
                        <v-text-field
                          v-model="form.limit.minimum"
                          :error-messages="errors"
                          :disabled="formIsDisabled"
                          color="secondary"
                          label="Minimum value"
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Maximum value"
                      >
                        <v-text-field
                          v-model="form.limit.maximum"
                          :error-messages="errors"
                          :disabled="formIsDisabled"
                          color="secondary"
                          label="Maximum value"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-col>


                <v-col cols="12">
                  <v-card-actions class="pl-0" v-if="isAdmin">
                    <v-btn
                      color="success"
                      min-width="100"
                      type="submit"
                      :disabled="formIsDisabled"
                    >
                      {{ getActionName }} Sensor
                    </v-btn>
                  </v-card-actions>
                </v-col>

              </v-row>
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
  import {mapGetters, mapState} from 'vuex'
  import jsPDF from "jspdf";

  export default {
  name: 'SensorSensorForm',
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
    loading: true,
    machines: [],
    sensorModels: [
      {
        label: 'Temperature (°C)',
        value: "temperature"
      },
      {
        label: 'Vibration (Hz)',
        value: "vibration"
      },
      {
        label: 'Current (A)',
        value: "current"
      },
      {
        label: 'ON/OFF',
        value: "indicator"
      },
      {
        label: 'Call Button',
        value: "call"
      },
    ],
    formIsValid: null,
    formIsDisabled: false,
    form: {
      model: 'temperature',
      machine: null,
      MAC: '',
      name: '',
      customModel: false,
      customModelValue: {
        name: '',
        symbol: ''
      },
      range: {
        minimum: '',
        maximum: ''
      },
      limit: {
        minimum: '',
        maximum: ''
      }
    },
  }),
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
        company: state => state.auth.company.id
      }),
      ...mapGetters({
        isAdmin: 'auth/isAdmin'
      }),
      getActionName () {
        return this.action.replace(/^./, this.action[0].toUpperCase())
      },
    },

  async mounted () {
    this.loading = true;

    if (!this.isAdmin) {
      this.formIsDisabled = true;
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
      const name = "Name:   " + this.form.name;
      const macAddress = "MAC Address:   " + this.form.MAC;
      const machine = "Machine: " + this.form.machine.name;
      const sensorModel = "Sensor model:   " + (!this.form.customModel ? this.sensorModels[this.sensorModels.getIndexBy("value", this.form.model)].label : `${this.form.customModelValue.name} (${this.form.customModelValue.symbol})`);
      const rangeTitle = "Range";
      const minRange = "Minimum:   " + this.form.range.minimum;
      const maxRange = "Maximum:   " + this.form.range.maximum;
      const limitTitle = "Limit";
      const minLimit = "Minimum:   " + this.form.limit.minimum;
      const maxLimit = "Maximum:   " + this.form.limit.maximum;

      doc.setFontSize(15);
      const title = "Sensor - " + this.id.substr(-5,5);
      doc.text(title, 155, 70);
      doc.setFontSize(12);

      doc.text(name, 40, 100);
      doc.text(macAddress, 40, 120);
      doc.text(machine, 40, 140);
      doc.text(sensorModel, 40, 160);
      doc.text(rangeTitle, 40, 180);
      doc.text(minRange, 80, 200);
      doc.text(maxRange, 80, 220);
      doc.text(limitTitle, 40, 240);
      doc.text(minLimit, 80, 260);
      doc.text(maxLimit, 80, 280);
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

    //TODO: export pdf
    doExportPDF(index) {
     if (index === 0) {
       const unit = "pt";
       const size = "A4"; // Use A1, A2, A3 or A4
       const orientation = "portrait"; // portrait or landscape
       const doc = new jsPDF(orientation, unit, size);
       const date = new Date().toISOString().replace(".", "");
       const name = "Name:   " + this.form.name;
       const macAddress = "MAC Address:   " + this.form.MAC;
       const machine = "Machine: " + this.form.machine.name;
       const sensorModel = "Sensor model:   " + (!this.form.customModel ? this.sensorModels[this.sensorModels.getIndexBy("value", this.form.model)].label : `${this.form.customModelValue.name} (${this.form.customModelValue.symbol})`);
       const rangeTitle = "Range";
       const minRange = "Minimum:   " + this.form.range.minimum;
       const maxRange = "Maximum:   " + this.form.range.maximum;
       const limitTitle = "Limit";
       const minLimit = "Minimum:   " + this.form.limit.minimum;
       const maxLimit = "Maximum:   " + this.form.limit.maximum;

       doc.setFontSize(15);
       const title = "Sensor - " + this.id.substr(-5,5);
       doc.text(title, 155, 70);
       doc.setFontSize(12);

       doc.text(name, 40, 100);
       doc.text(macAddress, 40, 120);
       doc.text(machine, 40, 140);
       doc.text(sensorModel, 40, 160);
       doc.text(rangeTitle, 40, 180);
       doc.text(minRange, 80, 200);
       doc.text(maxRange, 80, 220);
       doc.text(limitTitle, 40, 240);
       doc.text(minLimit, 80, 260);
       doc.text(maxLimit, 80, 280);
       doc.save(title + "_" + date);
     } else {
       this.dialog = true;
     }
    },
    async getFormForId (id) {
      return this.$axios({
        method: 'POST',
        url: '/graphql',
        data: {
          query: `{
              sensorsToModel(id: "${id}"){
                name
                MAC
                createdAt
                updatedAt
                machine {
                    name
                    id
                }
                model
                customModel
                customModelValue {
                  name
                  symbol
                }
                range {
                  minimum
                  maximum
                }
                limit {
                  minimum
                  maximum
                }
              }
            }`,
        },
      }).then(({ data }) => {
        const result = data.data.sensorsToModel;
        return {
          model: result.model,
          machine: result.machine,
          MAC: result.MAC,
          name: result.name,
          customModel: result.customModel,
          customModelValue: result.customModelValue ? result.customModelValue : {
            name: '',
            symbol: ''
          },
          range: result.range? result.range : {
            minimum: '',
            maximum: ''
          },
          limit: result.limit? result.limit : {
            minimum: '',
            maximum: ''
          }
        }
      })
    },
    async modifySensor () {
      const { model, machine, MAC, name, customModel, customModelValue, range, limit } = this.form;
      return this.$axios({
        method: 'POST',
        url: '/graphql',
        data: {
          query: `mutation {
            updateSensorsToModel(input:{ where: {id: "${this.id}" },
             data: {MAC: "${MAC}",
             name: "${name}",
             customModel: ${customModel},
             customModelValue: {name: "${customModelValue.name}", symbol: "${customModelValue.symbol}"}
             range: {minimum: ${range.minimum? range.minimum : 0}, maximum: ${range.maximum? range.maximum : 100}}
             limit: {minimum: ${limit.minimum ? limit.minimum : 0}, maximum: ${limit.maximum ? limit.maximum : 100}}
             machine: "${machine.id}",
             company: "${this.company}"
             model:${model}}})
             {
              sensorsToModel{
                name
                MAC
                createdAt
                updatedAt
                machine {
                    name
                    id
                }
                model
              }
            }
          }`,
        },
      })
        .then(({ data }) => {
          this.snackbar = {
            message: 'A Sensor has been successfully modified.',
            type: 'success',
            snackbar: true,
          };
          return data.data.sensorsToModel
          })
        .catch(err => {
          this.snackbar = {
            message: `There was an error adding your request. Message: ${err.message}`,
            type: 'error',
            snackbar: true,
          }
        })
    },
    async addSensor () {
      const { model, machine, MAC, name, customModel, customModelValue, range, limit } = this.form;

      return this.$axios({
        method: 'POST',
        url: '/graphql',
        data: {
          query: `mutation {
            createSensorsToModel(input:{
              data: {
                MAC: "${MAC}",
                name: "${name}",
                model: ${model},
                customModel: ${customModel},
                customModelValue: {name: "${customModelValue.name}", symbol: "${customModelValue.symbol}"},
                range: {minimum: ${range.minimum? range.minimum : 0}, maximum: ${range.maximum? range.maximum : 100}},
                limit: {minimum: ${limit.minimum? limit.minimum : 0}, maximum: ${limit.maximum? limit.maximum : 100}},
                machine : "${machine.id}",
                company: "${this.company}"
                }
                })
                {
                sensorsToModel {
                  name
                }
            }
          }`,
        },
      })
        .then(({ data }) => {
          this.snackbar = {
            message: 'A Sensor has been successfully attached to the machine.',
            type: 'success',
            snackbar: true,
          };
          return data.data.sensorsToModel
          })
        .catch(err => {
          this.snackbar = {
            message: `There was an error adding your request. Message: ${err.message}`,
            type: 'error',
            snackbar: true,
          }
        })
    },
    async sleep (milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    },
    async onSubmit () {
      this.loading = true;
      this.formIsDisabled = true;

      switch (this.action) {
        case 'add':
          await this.addSensor();
          break;
        case 'modify':
          await this.modifySensor();
          break
      }

      this.loading = false;

      return this.sleep(500)
        .then(() => {
            this.$router.push('/sensor/sensors-list')
          })
    },
    async getMachines () {
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
        .then(({ data }) => {
          if (data.data.machines) {
            return data.data.machines
          } else {
            return []
          }
        })
      },
  },
}

Array.prototype.getIndexBy = function (name, value) {
  for (var i = 0; i < this.length; i++) {
    if (this[i][name] == value) {
      return i;
    }
  }
  return -1;
}

</script>
