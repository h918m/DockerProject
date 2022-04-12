/* eslint-disable vue/no-unused-vars */
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
          :title="`${ isAdmin ? getActionName : 'View' } Purchase Order`"
          class="px-5 py-3"
        >
          <div id="period" v-if="action === 'add'">
            <v-select
              v-model="currentOption"
              color="secondary"
              item-color="secondary"
              label="Select Machine"
              return-object
              :items="options"
              item-text="name"
              item-value="id"
              @change="setExisting"
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
                    <v-list-item-title v-text="item.toUpperCase()"/>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
          </div>
          <validation-observer
            v-slot="{ handleSubmit }"
            slim
          >
            <v-form
              class="mt-5"
              @submit.prevent="handleSubmit(onSubmit)"
            >
              <v-row v-if="currentOption === 'Existing one'">
                <v-col
                  cols="12"
                  md="6"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Users"
                  >
                    <v-select
                      v-model="form.supplier"
                      color="secondary"
                      item-color="secondary"
                      label="Suppliers relation (optional)"
                      :disabled="formIsDisabled"
                      :error-messages="errors"
                      return-object
                      :items="suppliers"
                      item-text="name"
                      item-value="id"
                      @change="getSpareParts"
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
                  md="6"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Users"
                  >
                    <v-select
                      v-model="form.spareParts"
                      color="secondary"
                      item-color="secondary"
                      label="Spare Parts relation"
                      :disabled="formIsDisabled"
                      return-object
                      :items="spareParts"
                      :error-messages="errors"
                      item-text="name"
                      item-value="id"
                      @change="setCurrentOptions"
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
                
              </v-row>
              <v-row>
                <!--                Assign to specific user-->
                <v-col
                  cols="12"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Users"
                  >
                    <v-select
                      v-model="form.users"
                      color="secondary"
                      item-color="secondary"
                      label="User"
                      :disabled="formIsDisabled"
                      return-object
                      :error-messages="errors"
                      :items="isAdmin? userList : form.users"
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
                </v-col>

                <v-col
                  cols="12"
                >
                  <!-- Machine name -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Part Name"
                  >
                    <v-text-field
                      v-model="form.name"
                      :error-messages="errors"
                      :disabled="formIsDisabled"
                      color="secondary"
                      label="Friendly name for a Part"
                    />
                  </validation-provider>
                </v-col>


                <v-col
                  cols="12"
                  lg="8"
                  xl="6"
                >
                  <!-- QR Code Generator -->
                  <div class="font-weight-bold grey--text">
                    QR Code to access the part
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
                      Take a Picture of the Part
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

                <!--                Purchasing information-->
                <v-col
                  cols="12"
                >
                  <h3>Purchasing </h3>
                  <!-- Purchasing date -->
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="`required`"
                    name="Purchase Date"
                  >
                    <v-menu
                      ref="dateMenu1"
                      v-model="dateMenu1"
                      :close-on-content-click="false"
                      :return-value.sync="date"
                      transition="scale-transition"
                      min-width="290px"
                      offset-y
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.purchaseDate"
                          label="Purchase Date"
                          :disabled="formIsDisabled"
                          color="secondary"
                          prepend-icon="mdi-calendar-outline"
                          readonly
                          :error-messages="errors"
                          v-on="on"
                        />
                      </template>

                      <v-date-picker
                        v-model="form.purchaseDate"
                        color="secondary"
                        landscape
                        scrollable
                        @input="dateMenu1 = false"
                      >
                        <v-spacer/>

                        <v-btn
                          color="secondary"
                          large
                          @click="dateMenu1 = false"
                        >
                          Cancel
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </validation-provider>

                  <v-row v-if="currentOption === 'New Part'">
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Users"
                      >
                        <v-select
                          v-model="form.supplier"
                          color="secondary"
                          item-color="secondary"
                          label="Suppliers relation (optional)"
                          :disabled="formIsDisabled"
                          return-object
                          :error-messages="errors"
                          :items="suppliers"
                          item-text="name"
                          item-value="id"
                          @change="getSpareParts"
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
                      md="6"
                    >
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Users"
                      >
                        <v-select
                          v-model="form.spareParts"
                          color="secondary"
                          item-color="secondary"
                          label="Spare Parts relation"
                          :error-messages="errors"
                          :disabled="formIsDisabled"
                          return-object
                          :items="spareParts"
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
                    
                  </v-row>
                  
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Price"
                      >
                        <v-text-field
                          v-model="form.price"
                          :error-messages="errors"
                          label="Price"
                          color="secondary"
                          type="number"
                          prefix="$"
                          :disabled="formIsDisabled"
                        />
                      </validation-provider>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <validation-provider
                        v-slot="{ errors }"
                        name="Quantity"
                        rules="required|numeric"
                      >
                        <v-text-field
                          v-model="form.quantity"
                          :error-messages="errors"
                          label="Quantity"
                          :disabled="formIsDisabled"
                          color="secondary"
                          type="number"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                  <validation-provider
                    v-slot="{ errors }"
                    name="File upload"
                    :rules="`${action === 'add' ? 'required' : ''}`"
                  >
                    <v-file-input
                      :error-messages="errors"
                      label="Upload document"
                      prepend-icon="mdi-paperclip"
                      type="file"
                      accept=".doc, .docx, application/msword, .xlsx, .pdf"
                      color="deep-purple accent-4"
                      v-model="form.purchaseFile"
                      :disabled="formIsDisabled"
                      @change="onFileChange($event)"
                    />
                  </validation-provider>
                </v-col>

                <!--                Description-->
                <v-col cols="12">
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
                <v-col cols="12">
                  <v-card-actions class="pl-0" v-if="isAdmin">
                    <v-btn
                      color="success"
                      min-width="100"
                      type="submit"
                      :disabled="formIsDisabled"
                    >
                      {{ getActionName }} Purchase Order
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
  import moment from "moment";

  export default {
    name: 'PurchaseOrderForm',
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
      options: ['New Part', 'Existing one'],
      date: '',
      dateMenu1: false,
      snackbar: {
        snackbar: false,
        type: 'success',
        message: '',
      },
      currentOption: 'New Part',
      userList: [],
      loading: true,
      spareParts: [],
      submachines: [],
      suppliers: [],
      facilities: [],
      formIsValid: null,
      formIsDisabled: false,
      form: {
        machineModel: null,
        operationTime: 8,
        name: '',
        image: null,
        imageUrl: null,
        description: '',
        warranty: '',
        location: '',
        users: null,
        manufacturer: '',
        model: '',
        serialCode: '',
        purchaseDate: '',
        seller: '',
        price: '',
        spareParts: null,
        submachines: null,
        supplier: null,
        facility: null,
        purchaseFile: null,
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
      getActionName() {
        return this.action.replace(/^./, this.action[0].toUpperCase())
      },
      getBaseUrl() {
        return process.env.VUE_APP_API_BASE_URL
      },
    },

    async mounted() {
      this.loading = true;
      if (!this.isAdmin) {
        this.formIsDisabled = true;
      } else {
        this.userList = await this.getUserList();

      }

      this.submachines = await this.getSubMachines();
      this.suppliers = await this.getSuppliers();
      this.facilities = await this.getFacilities();
      // Check action
      switch (this.action) {
        case 'modify':
          this.form = await this.getFormForId(this.id);
          this.spareParts = await this.getSpareParts();
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
      async setCurrentOptions () {
        if (this.currentOption === 'New Part') this.form = new FormData()
        else this.form = await this.getCurrentSparePart(this.form.spareParts.id)
      },
      async setExisting () {
        if (this.currentOption === 'New Part') this.form = new FormData()
      },
      async getLabourCost(duration) {
        if (duration === 'month') {
          const monthFrom = moment().subtract(1, 'months').startOf('month').toISOString();
          const monthTo = moment().subtract(1, 'months').endOf('month').toISOString();
          return this.$axios({
            method: 'POST',
            url: '/graphql',
            data: {
              query: `{
                failureRecordsConnection(where: {startDateTime_gt: "${monthFrom}", endDateTime_lt: "${monthTo}", machine: "${this.id}"})
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
          return this.$axios({
            method: 'POST',
            url: '/graphql',
            data: {
              query: `{
                failureRecordsConnection(where: {startDateTime_gt: "${monthFrom}", endDateTime_lt: "${monthTo}", machine: "${this.id}"})
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
                failureRecordsConnection(where: {machine: "${this.id}"})
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

        const machine = "Machine: " + this.form.name;
        const assignedTo = "Assigned to:   " + this.getUserName(this.form.users);
        const facility = "Facilities:   " + this.getUserName(this.form.facility);
        const manufactureTitle = "Manufacture Information" ;
        const manufacturer = "Manufacturer:   " + this.form.manufacturer;
        const model = "Model:   " + this.form.model;
        const sn = "Serial code:   " + this.form.serialCode;
        const purchasingTitle = "Purchasing";
        const purchDate = "Date:   " + this.form.purchaseDate;
        const purchSeller = "Seller:   " + this.form.seller;
        const price = "Price:   " + this.form.price;
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
        const warranty = "Warranty:   " + this.form.warranty;
        var splitWarranty = doc.splitTextToSize(warranty, 550);
        const location = "Location:   " + this.form.location;
        doc.setFontSize(15);
        const title = "Machine - " + this.id.substr(-5, 5);
        doc.text(title, 155, 70);
        doc.setFontSize(12);

        doc.text(assignedTo, 40, 100);
        doc.text(machine, 40, 120);
        doc.text(facility, 40, 160);
        doc.text(manufactureTitle, 40, 180);
        doc.text(manufacturer, 80, 200);
        doc.text(model, 80, 240);
        doc.text(sn, 80, 260);
        doc.text(purchasingTitle, 40, 280);
        doc.text(purchDate, 80, 300);
        doc.text(purchSeller, 80, 320);
        doc.text(price, 80, 340);
        doc.text(financialTitle, 40, 360);
        doc.text(labourTitle, 80, 380);
        doc.text(labour, 100, 400);
        doc.text(spareTitle, 80, 420);
        doc.text(spare, 100, 440);
        doc.text(miscTitle, 80, 460);
        doc.text(misc, 100, 480);
        doc.text(splitDescription, 40, 500);
        doc.text(splitWarranty, 40, 560);
        doc.text(location, 40, 620);
        doc.addImage(this.form.imageUrl, "JPEG", 350, 150, 200, 200);
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


      //TODO: get names in the array
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

          const machine = "Machine: " + this.form.name;
          const assignedTo = "Assigned to:   " + this.getUserName(this.form.users);
          const facility = "Facility:   " + this.getUserName(Array(this.form.facility));
          const manufactureTitle = "Manufacture Information" ;
          const manufacturer = "Manufacturer:   " + this.form.manufacturer;
          const model = "Model:   " + this.form.model;
          const sn = "Serial code:   " + this.form.serialCode;
          const purchasingTitle = "Purchasing";
          const purchDate = "Date:   " + this.form.purchaseDate;
          const purchSeller = "Seller:   " + this.form.seller;
          const price = "Price:   " + this.form.price;
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
          const warranty = "Warranty:   " + this.form.warranty;
          var splitWarranty = doc.splitTextToSize(warranty, 550);
          const location = "Location:   " + this.form.location;
          doc.setFontSize(15);
          const title = "Machine - " + this.id.substr(-5, 5);
          doc.text(title, 155, 70);
          doc.setFontSize(12);

          doc.text(assignedTo, 40, 100);
          doc.text(machine, 40, 120);
          doc.text(facility, 40, 180);
          doc.text(manufactureTitle, 40, 200);
          doc.text(manufacturer, 80, 220);
          doc.text(model, 80, 240);
          doc.text(sn, 80, 260);
          doc.text(purchasingTitle, 40, 280);
          doc.text(purchDate, 80, 300);
          doc.text(purchSeller, 80, 320);
          doc.text(price, 80, 340);
          doc.text(financialTitle, 40, 360);
          doc.text(labourTitle, 80, 380);
          doc.text(labour, 100, 400);
          doc.text(spareTitle, 80, 420);
          doc.text(spare, 100, 440);
          doc.text(miscTitle, 80, 460);
          doc.text(misc, 100, 480);
          doc.text(splitDescription, 40, 500);
          doc.text(splitWarranty, 40, 560);
          doc.text(location, 40, 620);
          doc.addImage(this.form.imageUrl, "JPEG", 350, 150, 200, 200);
          doc.save(title + "_" +  date);
        } else {
          this.dialog = true;
        }
      },
      async onFileChange (event) {
        if (!event.length) return;
        this.form.purchaseFile = event[0];
        return true;
      },
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

      // TODO: get users list whose role is Authenticated
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
            return res.data.data.users;
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
            purchaseOrder(id: "${id}"){
              name
              id
              image{
                url
              }
              description
              location
              users {
                id
                name
              }
              supplier {
                id
                name
              }
              purchaseDate
              price
              quantity
              spare_part {
                id
                name
              }
            }
          }
          `,
          },
        }).then(async ({data}) => {
          const result = data.data.purchaseOrder;
          if (result) {
            return {
              name: result.name,
              imageUrl: this.getBaseUrl + result.image.url,
              users: result.users,
              description: result.description,
              location: result.location,
              purchaseDate: result.purchaseDate,
              price: result.price,
              quantity: result.quantity,
              supplier: result.supplier,
              spareParts: result.spare_part
            }
          } else {
            return {}
          }
        })
      },
      async getCurrentSparePart(id) {
        let temp_supplier = this.form.supplier
        let temp_sparePart = this.form.spareParts
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
            sparePart(id: "${id}"){
              name
              id
              photo{
                url
                id
              }
              description
              price
            }
          }
          `,
          },
        }).then(async ({data}) => {
          const result = data.data.sparePart;
          if (result) {
            return {
              name: result.name,
              // imageUrl: this.getBaseUrl + result.photo.url,
              description: result.description,
              price: result.price,
              supplier: temp_supplier,
              spareParts: temp_sparePart
            }
          } else {
            return {}
          }
        })
      },
      async addMachine() {
        const { name, image, description, users, location, purchaseDate, price, purchaseFile,
          supplier, quantity, spareParts
        } = this.form;

        const formData = new FormData();
        let userParam = [];
        if (users) {
          users.forEach(item => {
            userParam.push(item.id)
          });
        }
        let smParam = [];
        const data = {
          name: name,
          description: description,
          location: location,
          users: userParam,
          purchaseDate: purchaseDate,
          spare_part: spareParts.id,
          price: price,
          quantity: quantity,
          supplier: supplier.id,
          company: this.company
        };

        formData.append('files.image', image, image.name);
        formData.append('files.purchaseFile', purchaseFile, purchaseFile.name);
        formData.append('data', JSON.stringify(data));

        return this.$axios({
            method: 'post',
            url: '/purchase-orders',
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'},
          },
        ).then(({data}) => {
          this.snackbar = {
            message: 'Purchase Order has been successfully Added.',
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
      async modifyMachine() {
        const { name, image, description, users, location,
          purchaseDate, price, purchaseFile,
          supplier, quantity
        } = this.form;
        const formData = new FormData();
        let userParam = [];
        if (users) {
          users.forEach(item => {
            userParam.push(item.id)
          });
        }
        const data = {
          name,
          description: description,
          location: location,
          users: userParam,
          purchaseDate: purchaseDate,
          price: price,
          quantity: quantity,
          supplier: supplier.id,
          company: this.company
        };
        // This checks if image was updated (image will be null if no new image was uploaded)
        // This is because image thumbnail is generated from URL not from file, so fill is null
        // Unless new one was uploaded
        if (image) {
          formData.append('files.image', image, image.name)
        }
        if (purchaseFile) {
          formData.append('files.purchaseFile', purchaseFile, purchaseFile.name);
        }
        formData.append('data', JSON.stringify(data));

        return this.$axios({
            method: 'PUT',
            // The this.id points on the ID from props
            url: `/purchase-orders/${this.id}`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'},
          },
        ).then(({data}) => {
          this.snackbar = {
            message: 'Purchase Order has been successfully updated.',
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

      async sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      },
      async onSubmit() {
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
            this.$router.push('/purchase-orders/purchaseorders-list')
          })
      },
      async getSpareParts() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              spareParts (where: {company: "${this.company}", suppliers: {id: "${this.form.supplier.id}"}}){
                id
                name
              }
            }`,
          },
        })
          .then(({data}) => {
            if (data.data.spareParts) {
              this.spareParts = data.data.spareParts;
              return data.data.spareParts;
            } else {
              return [];
            }
          })
      },
      async getSubMachines() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              subMachines (where: {company: "${this.company}"}){
                id
                name
              }
            }`,
          },
        })
          .then(({data}) => {
            if (data.data.subMachines) {
              return data.data.subMachines;
            } else {
              return [];
            }
          })
      },
      async getSuppliers() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              suppliers (where: {company: "${this.company}"}){
                id
                name
              }
            }`,
          },
        })
          .then(({data}) => {
            if (data.data.suppliers) {
              return data.data.suppliers;
            } else {
              return [];
            }
          })
      },
      async getFacilities() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
              facilities (where: {company: "${this.company}"}){
                id
                name
              }
            }`,
          },
        })
          .then(({data}) => {
            if (data.data.facilities) {
              return data.data.facilities;
            } else {
              return [];
            }
          })
      },
    },
  }
</script>
