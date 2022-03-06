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
        lg="7"
      >
        <base-material-card
          color="success"
          icon="mdi-plus"
          :title="`${ isAdmin ? getActionName : 'View'} facility`"
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
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <!-- Facility name -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Facility Name"
                  >
                    <v-text-field
                      v-model="form.name"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      color="secondary"
                      label="Friendly name for a facility"
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <!-- Machine Models list -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="Machines"
                  >
                    <v-select
                      v-model="form.machine"
                      color="secondary"
                      item-color="secondary"
                      label="Machines"
                      :disabled="formIsDisabled"
                      return-object
                      :error-messages="errors"
                      :items="machines"
                      multiple
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
                <v-col
                  cols="12"
                  lg="8"
                  xl="6"
                >
                  <!-- QR Code Generator -->
                  <div class="font-weight-bold grey--text">
                    QR Code to access the machine
                  </div>
                  <qrcode
                    :value="id"
                    :options="{ width: 250 }"
                  />
                </v-col>
                <v-col
                  cols="12"
                  lg="8"
                  xl="6"
                >
                  <!-- Image upload -->
                  <validation-provider
                    v-slot="{ errors }"
                    ref="provider"
                    :rules="`${action === 'add' ? 'required' : ''}`"
                    name="Machine Image"
                  >
                    <div class="font-weight-bold grey--text">
                      Take a Picture of the Spare part
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

                <!--file to upload-->
                <v-col
                  cols="12"
                  md="6"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    name="File to upload"
                    :rules="`${action === 'add' ? 'required' : ''}`"
                  >
                    <v-file-input
                      id="sheetjs-input"
                      :error-messages="errors"
                      label="Upload document"
                      prepend-icon="mdi-paperclip"
                      type="file"
                      multiple="false"
                      accept=".doc, .docx, application/msword, .xlsx, .pdf"
                      color="deep-purple accent-4"
                      v-model="form.document"
                      :disabled="formIsDisabled"
                      @change="onFileChange($event)"
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  v-if="action === 'modify'"
                >
                  <!-- Labour list -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="Labour list"
                  >
                    <v-select
                      v-model="form.labour"
                      color="secondary"
                      item-color="secondary"
                      label="Labour list"
                      :disabled="formIsDisabled"
                      return-object
                      :error-messages="errors"
                      :items="form.labour"
                      multiple
                      item-text="name"
                      item-value="id"
                    >
                      <template v-slot:item="{ attrs, item, on }">
                        <v-list-item
                          v-bind="attrs"
                          active-class="secondary elevation-4 white--text"
                          class="mx-3 mb-3 v-sheet"
                          elevation="0"
                        >
                          <v-list-item-content>
                            <v-list-item-title v-text="`${item ? item.name : ''}`" />
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Description"
                  >
                    <v-textarea
                      v-model="form.description"
                      name="textarea-1"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      label="Description"
                    />
                  </validation-provider>
                </v-col>

                <!--                location-->
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Location"
                  >
                    <v-text-field
                      v-model="form.location"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      label="Location"
                    />
                  </validation-provider>
                </v-col>

                <!--                Financial information-->
                <v-col
                  cols="12"
                  v-if="action === 'modify'"
                >
                  <h3>Financial (optional)</h3>
                  <!--                  Labour cost-->
                  <v-row>
                    <v-col cols="12">
                      <h4>Labour cost</h4>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        readonly
                        v-model="form.financialLabourPastMonth"
                        :disabled="formIsDisabled"
                        label="Past month"
                        color="secondary"
                        type="number"
                        prefix="$"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="form.financialLabourPastYear"
                        readonly
                        :disabled="formIsDisabled"
                        label="Past month"
                        color="secondary"
                        type="number"
                        prefix="$"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="form.financialLabourTotal"
                        readonly
                        :disabled="formIsDisabled"
                        label="Past month"
                        color="secondary"
                        type="number"
                        prefix="$"
                      />
                    </v-col>
                  </v-row>

                  <!--                  Spare parts cost-->
                  <v-row>
                    <v-col cols="12">
                      <h4>Spare parts cost</h4>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        v-model="form.financialSparePastMonth"
                        readonly
                        :disabled="formIsDisabled"
                        label="Past month"
                        color="secondary"
                        type="number"
                        prefix="$"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="form.financialSparePastYear"
                        readonly
                        :disabled="formIsDisabled"
                        label="Past month"
                        color="secondary"
                        type="number"
                        prefix="$"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="form.financialSpareTotal"
                        readonly
                        :disabled="formIsDisabled"
                        label="Past month"
                        color="secondary"
                        type="number"
                        prefix="$"
                      />
                    </v-col>
                  </v-row>

                  <!--                  MISC-->
                  <v-row>
                    <v-col cols="12">
                      <h4>Labour cost</h4>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        v-model="form.financialMiscPastMonth"
                        readonly
                        :disabled="formIsDisabled"
                        label="Past month"
                        color="secondary"
                        type="number"
                        prefix="$"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="form.financialMiscPastYear"
                        readonly
                        :disabled="formIsDisabled"
                        label="Past month"
                        color="secondary"
                        type="number"
                        prefix="$"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="form.financialMiscTotal"
                        readonly
                        :disabled="formIsDisabled"
                        label="Past month"
                        color="secondary"
                        type="number"
                        prefix="$"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-card-actions class="pl-0" v-if="isAdmin">
                    <v-btn
                      color="success"
                      min-width="100"
                      type="submit"
                      :disabled="formIsDisabled"
                    >
                      {{ getActionName }} Facility
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
  import _ from 'lodash';
  import moment from "moment";

  export default {
    name: 'FacilityForm',
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
      userList: [],
      formIsValid: null,
      formIsDisabled: false,
      form: {
        machine: null,
        name: '',
        image: null,
        imageUrl: null,
        description: null,
        location: '',
        document: null,
        labour: [],
        financialLabourPastMonth: '',
        financialLabourPastYear: '',
        financialLabourTotal: '',
        financialSparePastMonth: '',
        financialSparePastYear: '',
        financialSpareTotal: '',
        financialMiscPastMonth: '',
        financialMiscPastYear: '',
        financialMiscTotal: ''
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
      getBaseUrl () {
        return process.env.VUE_APP_API_BASE_URL
      },
    },

    async mounted () {
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
      //TODO: get Labour Cost data
      async getLabourCost(duration, machineId) {
        if (duration === 'month') {
          const monthFrom = moment().subtract(1, 'months').startOf('month').toISOString();
          const monthTo = moment().subtract(1, 'months').endOf('month').toISOString();
          console.log("monthFrom", monthFrom);
          console.log("monthTo", monthTo);
          return this.$axios({
            method: 'POST',
            url: '/graphql',
            data: {
              query: `{
                failureRecordsConnection(where: {startDateTime_gt: "${monthFrom}", endDateTime_lt: "${monthTo}", machine: "${machineId}"})
                {
                    aggregate {
                      sum {
                        labourCost
                        spareCost
                      }
                    }
                }
              }`
            }
          }).then(res => {
            if(res.data.data.failureRecordsConnection) {
              return [Math.round(res.data.data.failureRecordsConnection.aggregate.sum.labourCost * 100)/100, Math.round(res.data.data.failureRecordsConnection.aggregate.sum.spareCost * 100)/100];
            } else {
              return 0;
            }
          }).catch(err => {
            return 0;
          })
        } else if (duration === 'year') {
          const monthFrom = moment().subtract(1, 'years').startOf('year').toISOString();
          const monthTo = moment().subtract(1, 'years').endOf('year').toISOString();
          console.log("monthFrom", monthFrom);
          console.log("monthTo", monthTo);
          return this.$axios({
            method: 'POST',
            url: '/graphql',
            data: {
              query: `{
                failureRecordsConnection(where: {startDateTime_gt: "${monthFrom}", endDateTime_lt: "${monthTo}", machine: "${machineId}"})
                {
                    aggregate {
                      sum {
                        labourCost
                        spareCost
                      }
                    }
                }
              }`
            }
          }).then(res => {
            if(res.data.data.failureRecordsConnection) {
              return [Math.round(res.data.data.failureRecordsConnection.aggregate.sum.labourCost * 100)/100, Math.round(res.data.data.failureRecordsConnection.aggregate.sum.spareCost * 100)/100];
            } else {
              return 0;
            }
          }).catch(err => {
            return 0;
          })
        } else {
          return this.$axios({
            method: 'POST',
            url: '/graphql',
            data: {
              query: `{
                failureRecordsConnection(where: {machine: "${machineId}"})
                {
                    aggregate {
                      sum {
                        labourCost
                        spareCost
                      }
                    }
                }
              }`
            }
          }).then(res => {
            if(res.data.data.failureRecordsConnection) {
              return [Math.round(res.data.data.failureRecordsConnection.aggregate.sum.labourCost * 100)/100, Math.round(res.data.data.failureRecordsConnection.aggregate.sum.spareCost * 100)/100];
            } else {
              return 0;
            }
          }).catch(err => {
            return 0;
          })
        }


      },



      getPDF() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        const date = new Date().toISOString().replace(".", "");

        const machine = "Machines: " + this.getUserName(this.form.machine);
        const facility = "Facility:   " + this.form.name;
        const labourList = "Labour list:   " + this.getUserName(this.form.labour);

        const financialTitle = "Financial";
        const labourTitle = "Labour cost";
        const labour = "Past Month:   " + this.form.financialLabourPastMonth + "       " + "Past Year:   " +
          this.form.financialLabourPastYear + "       " + "Total:   " + this.form.financialLabourTotal;
        const spareTitle = "Spare parts cost";
        const spare = "Past Month:   " + this.form.financialSparePastMonth + "       " + "Past Year:   " +
          this.form.financialSparePastYear + "       " + "Total:   " + this.form.financialSpareTotal;
        const miscTitle = "MISC";
        const misc = "Past Month:   " + this.form.financialMiscPastMonth + "       " + "Past Year:   " +
          this.form.financialMiscPastYear + "       " + "Total:   " + this.form.financialMiscTotal;
        const description = "Description:   " + this.form.description;
        var splitDescription = doc.splitTextToSize(description, 550);
        const location = "Location:   " + this.form.location;
        doc.setFontSize(15);
        const title = "Facility - " + this.id.substr(-5, 5);
        doc.text(title, 155, 70);
        doc.setFontSize(12);

        doc.text(facility, 40, 100);
        doc.text(machine, 40, 120);
        doc.text(labourList, 40, 140);

        doc.text(financialTitle, 40, 420);
        doc.text(labourTitle, 80, 440);
        doc.text(labour, 100, 460);
        doc.text(spareTitle, 80, 480);
        doc.text(spare, 100, 500);
        doc.text(miscTitle, 80, 520);
        doc.text(misc, 100, 540);
        doc.text(splitDescription, 40, 560);
        doc.text(location, 40, 620);
        doc.addImage(this.form.imageUrl, "JPEG", 150, 200, 200, 200);
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

      //TODO: get names from an array
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

          const machine = "Machines: " + this.getUserName(this.form.machine);
          const facility = "Facility:   " + this.form.name;
          const labourList = "Labour list:   " + this.getUserName(this.form.labour);

          const financialTitle = "Financial";
          const labourTitle = "Labour cost";
          const labour = "Past Month:   " + this.form.financialLabourPastMonth + "       " + "Past Year:   " +
            this.form.financialLabourPastYear + "       " + "Total:   " + this.form.financialLabourTotal;
          const spareTitle = "Spare parts cost";
          const spare = "Past Month:   " + this.form.financialSparePastMonth + "       " + "Past Year:   " +
            this.form.financialSparePastYear + "       " + "Total:   " + this.form.financialSpareTotal;
          const miscTitle = "MISC";
          const misc = "Past Month:   " + this.form.financialMiscPastMonth + "       " + "Past Year:   " +
            this.form.financialMiscPastYear + "       " + "Total:   " + this.form.financialMiscTotal;
          const description = "Description:   " + this.form.description;
          var splitDescription = doc.splitTextToSize(description, 550);
          const location = "Location:   " + this.form.location;
          doc.setFontSize(15);
          const title = "Facility - " + this.id.substr(-5, 5);
          doc.text(title, 155, 70);
          doc.setFontSize(12);

          doc.text(facility, 40, 100);
          doc.text(machine, 40, 120);
          doc.text(labourList, 40, 140);

          doc.text(financialTitle, 40, 420);
          doc.text(labourTitle, 80, 440);
          doc.text(labour, 100, 460);
          doc.text(spareTitle, 80, 480);
          doc.text(spare, 100, 500);
          doc.text(miscTitle, 80, 520);
          doc.text(misc, 100, 540);
          doc.text(splitDescription, 40, 560);
          doc.text(location, 40, 620);
          doc.addImage(this.form.imageUrl, "JPEG", 150, 200, 200, 200);
          doc.save(title + "_" + date);
        } else {
          this.dialog = true;
        }
      },
      async onImageChange (val) {
        const { valid } = await this.$refs.provider.validate(val);
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
      async onFileChange (event) {
        if (!event.length) return;
        this.form.document = event[0];
        return true;
      },
      async getFormForId (id) {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
            facility (id: "${this.id}") {
                id
                name
                QR
                photo {
                  id
                  url
                }
                labour {
                  id
                  name
                }
                machines {
                  id
                  name
                  users {
                    id
                    name
                  }
                }
                description
                location
            }
          }
          `,
          },
        }).then(async ({ data }) => {
          const result = data.data.facility;
          let temp = [];
          let tempBuff = [];
          result.machines.forEach(item => {
            temp = temp.concat(item.users)
          });
          tempBuff = _.uniqBy(temp, 'id');

          //Get financial params
          let labourPastMonthParam = 0;
          let labourPastYearParam = 0;
          let labourTotalParam = 0;
          let sparePastMonthParam = 0;
          let sparePastYearParam = 0;
          let spareTotalParam = 0;
          for (let item of result.machines) {
            let machineId = item.id;
            let [labourPastMonth, sparePastMonth] = await this.getLabourCost('month', machineId);
            let [labourPastYear, sparePastYear] = await this.getLabourCost('year', machineId);
            let [labourTotal, spareTotal] = await this.getLabourCost('total', machineId);
            labourPastMonthParam += labourPastMonth;
            labourPastYearParam += labourPastYear;
            labourTotalParam += labourTotal;
            sparePastMonthParam += sparePastMonth;
            sparePastYearParam += sparePastYear;
            spareTotalParam += spareTotal;
          }
          if(result) {
            return {
              machine: result.machines,
              name: result.name,
              image: null,
              imageUrl: process.env.VUE_APP_API_BASE_URL + result.photo.url,
              description: result.description,
              location: result.location,
              document: null,
              labour: tempBuff,
              financialLabourPastMonth: labourPastMonthParam,
              financialLabourPastYear: labourPastYearParam,
              financialLabourTotal: labourTotalParam,
              financialSparePastMonth: sparePastMonthParam,
              financialSpareTotal: spareTotalParam,
              financialSparePastYear: sparePastYearParam
            }
          } else {
            return {}
          }

        })
      },
      async addMachine () {
        const { machine, name, document, description, location, image} = this.form;



        //For labour list
        let temp = [];
        let tempBuff = [];
        machine.forEach(item => {
          temp = temp.concat(item.users);
        });
        tempBuff = _.uniqBy(temp, 'id');


        let machineParam = [];
        if (machine) {
          machine.forEach(item => {
            machineParam.push(item.id)
          });
        }
        let labourParam = [];
        if (tempBuff) {
          tempBuff.forEach(item => {
            labourParam.push(item.id)
          });
        }
        const formData = new FormData();
        const data = {
          name: name,
          machines: machineParam,
          description: description,
          location: location,
          labour: labourParam,
          company: this.company
        };

        formData.append('files.photo', image, image.name);
        formData.append('files.fileUpload', document, document.name);
        formData.append('data', JSON.stringify(data));

        return this.$axios({
            method: 'post',
            url: '/facilities',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        ).then(({ data }) => {
          this.snackbar = {
            message: 'Facility has been successfully Added.',
            type: 'success',
            snackbar: true,
          };
          return data
        })
          .catch(err => {
            this.snackbar = {
              message: `There was an error adding your request. Message: ${err.message}`,
              duration: 5000,
              type: 'error',
              snackbar: true,
            }
          })
      },
      async modifyMachine () {
        const {
          machine, name, document, description, location, image
        } = this.form;


        //For labour list
        let temp = [];
        let tempBuff = [];
        machine.forEach(item => {
          temp = temp.concat(item.users);
        });
        tempBuff = _.uniqBy(temp, 'id');
        let machineParam = [];
        if (machine) {
          machine.forEach(item => {
            machineParam.push(item.id)
          });
        }

        let labourParam = [];
        if (tempBuff) {
          tempBuff.forEach(item => {
            labourParam.push(item.id)
          });
        }
        const formData = new FormData();
        const data = {
          name: name,
          machines: machineParam,
          description: description,
          location: location,
          labour: labourParam,
          company: this.company
        };




        // formData.append('files.filesToUpload', document, document.name);

        // This checks if image was updated (image will be null if no new image was uploaded)
        // This is because image thumbnail is generated from URL not from file, so fill is null
        // Unless new one was uploaded
        if (image) {
          formData.append('files.photo', image, image.name);
        }
        if (document) {
          formData.append('files.fileUpload', document, document.name);
        }
        formData.append('data', JSON.stringify(data));

        return this.$axios({
            method: 'PUT',
            // The this.id points on the ID from props
            url: `/facilities/${this.id}`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        ).then(({ data }) => {
          this.snackbar = {
            message: 'Machine has been successfully updated.',
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
            await this.addMachine();
            break;
          case 'modify':
            await this.modifyMachine();
            break
        }

        this.loading = false;
        return this.sleep(500)
          .then(() => {
            this.$router.push('/facilities/facilities-list')
          })
      },
      async getMachines () {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              machines(where: {company: "${this.company}"}){
                 id
                  name
                  users {
                    id
                    name
                  }
              }
          }`,
          },
        })
          .then(({ data }) => {
            if (data.data.machines) {
              return data.data.machines;
            } else {
              return [];
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
    },
  }
</script>
