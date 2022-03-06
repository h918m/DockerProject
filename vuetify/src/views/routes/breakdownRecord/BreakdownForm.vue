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
          :title="`${ isAdmin ? getActionName : this.action==='add' ? 'Submit' : 'View'} Work order`"
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
                <v-row v-if="isAdmin">
                  <!-- Users list -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="User"
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
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Machines list -->
                  <v-col
                    cols="12"
                    sm="6"
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

                  <!-- Sparepart list -->
                  <v-col
                    cols="12"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="Spare part"
                    >
                      <v-select
                        v-model="form.spareParts"
                        color="secondary"
                        item-color="secondary"
                        label="Spare part"
                        :disabled="formIsDisabled"
                        return-object
                        multiple
                        :error-messages="errors"
                        :items="sparePartsList"
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
                                v-text="`${item ? item.stockAmount > 0 ? item.name : item.name + ' (stock) ': ''}`"
                                :class="item ? item.stockAmount ===0 ? 'text-red' : '': ''"/>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>
                    </validation-provider>
                  </v-col>
                </v-row>


                <!-- Type of Work -->
                <v-row>
                  <v-col>
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="Type of Work"
                    >
                      <v-select
                        v-model="form.typeOfWork"
                        color="secondary"
                        item-color="secondary"
                        label="Type of Work"
                        :disabled="formIsDisabled"
                        :error-messages="errors"
                        :items="typesOfWork"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col>
                    <!-- Nature of Work -->
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="Nature of Work"
                    >
                      <v-select
                        v-model="form.natureOfWork"
                        color="secondary"
                        item-color="secondary"
                        label="Nature of Work"
                        :disabled="formIsDisabled"
                        :error-messages="errors"
                        :items="naturesOfWork"
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <!-- Operators error -->
                <v-col cols="4" v-if="form.natureOfWork === 'breakdown'">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Operators Error"
                  >
                    <v-switch
                      v-model="form.operatorsError"
                      :disabled="formIsDisabled"
                      hide-details
                      :label="`Operators Error: ${form.operatorsError ? 'Yes' : 'No'}`"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
                <!-- Sliders -->

                <!-- Severity -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Severity"
                  v-if="form.natureOfWork === 'breakdown'"
                >
                  <v-slider
                    v-model="form.severity"
                    label="Severity"
                    :disabled="formIsDisabled"
                    :max="sliders.max"
                    :min="sliders.min"
                    :error-messages="errors"
                    color="secondary"
                  >
                    <template v-slot:append>
                      <h1>{{ form.severity }}</h1>
                    </template>
                  </v-slider>
                </validation-provider>

                <!-- Occurance -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Occurance"
                  v-if="form.natureOfWork === 'breakdown'"
                >
                  <v-slider
                    v-model="form.occurance"
                    :max="sliders.max"
                    :min="sliders.min"
                    :disabled="formIsDisabled"
                    label="Occurance"
                    color="secondary"
                    :error-messages="errors"
                  >
                    <template v-slot:append>
                      <h1>{{ form.occurance }}</h1>
                    </template>
                  </v-slider>
                </validation-provider>

                <!-- Detection -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Detection"
                  v-if="form.natureOfWork === 'breakdown'"
                >
                  <v-slider
                    v-model="form.detection"
                    :max="sliders.max"
                    :min="sliders.min"
                    label="Detection"
                    color="secondary"
                    :disabled="formIsDisabled"
                    :error-messages="errors"
                  >
                    <template v-slot:append>
                      <h1>{{ form.detection }}</h1>
                    </template>
                  </v-slider>
                </validation-provider>
                <!-- Date Time Pickers -->

                <v-row class="mt-6">
                  <!-- Start date -->
                  <v-col cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      :rules="`required`"
                      name="Start Date"
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
                            v-model="form.workTime.startDate"
                            label="Start Date"
                            :disabled="formIsDisabled"
                            color="secondary"
                            prepend-icon="mdi-calendar-outline"
                            readonly
                            :error-messages="errors"
                            v-on="on"
                          />
                        </template>

                        <v-date-picker
                          v-model="form.workTime.startDate"
                          color="secondary"
                          :max="form.workTime.endDate"
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
                  </v-col>
                  <!-- Start time -->
                  <v-col cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="Start time"
                    >
                      <v-menu
                        ref="timeMenu1"
                        v-model="timeMenu1"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="form.workTime.startTime"
                            label="Start time"
                            prepend-icon="mdi-clock"
                            :disabled="formIsDisabled"
                            :error-messages="errors"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-if="timeMenu1"
                          v-model="form.workTime.startTime"
                          full-width
                          :max="form.workTime.endTime"
                          @click:minute="$refs.timeMenu1.save(form.workTime.startTime)"
                        />
                      </v-menu>
                    </validation-provider>
                  </v-col>
                  <!-- End date -->
                  <v-col cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="End date"
                    >
                      <v-menu
                        ref="dateMenu2"
                        v-model="dateMenu2"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        min-width="290px"
                        offset-y
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="form.workTime.endDate"
                            label="End Date"
                            color="secondary"
                            prepend-icon="mdi-calendar-outline"
                            :disabled="formIsDisabled"
                            readonly
                            :error-messages="errors"
                            v-on="on"
                          />
                        </template>

                        <v-date-picker
                          v-model="form.workTime.endDate"
                          color="secondary"
                          :min="form.workTime.startDate"
                          landscape
                          scrollable
                          @input="dateMenu2 = false"
                        >
                          <v-spacer/>

                          <v-btn
                            color="secondary"
                            large
                            @click="dateMenu2 = false"
                          >
                            Cancel
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </validation-provider>
                  </v-col>
                  <!-- End time -->
                  <v-col cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="End time"
                    >
                      <v-menu
                        ref="timeMenu2"
                        v-model="timeMenu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="form.workTime.endTime"
                            label="End time"
                            prepend-icon="mdi-clock"
                            :error-messages="errors"
                            :disabled="formIsDisabled"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-if="timeMenu2"
                          v-model="form.workTime.endTime"
                          :min="form.workTime.startTime"
                          full-width
                          @click:minute="$refs.timeMenu2.save(form.workTime.endTime)"
                        />
                      </v-menu>
                    </validation-provider>
                  </v-col>
                </v-row>
                <v-row>
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
                      name="Work order Image"
                    >
                      <div class="font-weight-bold grey--text">
                        Take a Picture of the work order
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
                  <v-col
                    size="12"
                    lg="8"
                    xl="6"
                  >
                    <template>
                      <div>Priority</div>
                    </template>
                    <v-radio-group
                      v-model="form.priority"
                      :disabled="formIsDisabled"
                      row
                    >
                      <v-radio
                        label="Low"
                        color="green"
                        value="low"
                        class="color-green"
                      />
                      <v-radio
                        label="Medium"
                        color="yellow"
                        value="medium"
                        class="color-yellow"
                      />
                      <v-radio
                        label="High"
                        color="red"
                        value="high"
                        class="color-red"
                      />
                    </v-radio-group>
                  </v-col>
                </v-row>
                <!--                <v-col size="12">-->
                <!--                  &lt;!&ndash; Completed &ndash;&gt;-->
                <!--                  <validation-provider-->
                <!--                    v-slot="{ errors }"-->
                <!--                    rules="required"-->
                <!--                    name="Completed"-->
                <!--                  >-->
                <!--                    <v-switch-->
                <!--                      v-model="form.completed"-->
                <!--                      :disabled="formIsDisabled"-->
                <!--                      hide-details-->
                <!--                      :label="`Completed: ${form.completed ? 'Yes' : 'No'}`"-->
                <!--                      :error-messages="errors"-->
                <!--                    />-->
                <!--                  </validation-provider>-->
                <!--                </v-col>-->

                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Root cause"
                >
                  <v-textarea
                    v-model="form.rootCause"
                    name="textarea-4"
                    :error-messages="errors"
                    :disabled="formIsDisabled"
                    label="Root cause"
                  />
                </validation-provider>
                <!-- Textareas -->
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="State Description"
                >
                  <v-textarea
                    v-model="form.stateDescription"
                    name="textarea-1"
                    :error-messages="errors"
                    :disabled="formIsDisabled"
                    label="State Description"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Work order state"
                >
                  <v-select
                    v-model="form.workorderState"
                    color="secondary"
                    item-color="secondary"
                    label="Work order state"
                    :error-messages="errors"
                    :items="orderStateTypes"
                    item-text="label"
                    item-value="value"
                  />
                </validation-provider>
              </v-col>

              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="Work Carried Out"
              >
                <v-textarea
                  v-model="form.workCarriedOut"
                  :disabled="formIsDisabled"
                  name="textarea-2"
                  :error-messages="errors"
                  label="Work Carried Out"
                />
              </validation-provider>

              <v-card-actions class="pl-0">
                <v-btn
                  color="success"
                  min-width="100"
                  type="submit"
                  :disabled="isAdmin? formIsDisabled : (originalValue === form.workorderState)"
                >
                  {{isAdmin ? getActionName : 'Submit'}} Work order
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
    name: 'BreakdownRecordBreakdownForm',
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
      originalSpareParts: null, // used for spare parts stock amount increasement
      dialog: false,
      optionsForExport: [
        {title: 'Save to PC'},
        {title: 'Send to Email'},
      ],
      exporting: false,
      date: '',
      filename: "",
      dateMenu1: false,
      timeMenu1: false,
      dateMenu2: false,
      timeMenu2: false,
      typesOfWork: [
        'mechanical',
        'electrical',
        'pneumatic',
        'steam',
        'control',
      ],
      orderStateTypes: [
        {
          label: 'On hold',
          value: "onHold"
        },
        {
          label: 'In progress',
          value: "inProgress"
        },
        {
          label: 'Waiting for parts',
          value: "waitingForParts"
        },
        {
          label: 'Rejected',
          value: "rejected"
        },
        {
          label: 'Completed',
          value: "completed"
        }
      ],
      naturesOfWork: [
        'breakdown',
        'setup',
        'repair',
      ],
      sliders: {
        min: 1,
        max: 10,
      },
      snackbar: {
        snackbar: false,
        type: 'success',
        message: '',
      },
      loading: true,
      machines: [],
      formIsValid: null,
      formIsDisabled: false,
      userList: [],
      sparePartsList: [],
      form: {
        completed: false,
        image: null,
        imageUrl: null,
        typeOfWork: '',
        natureOfWork: '',
        severity: 5,
        occurance: 5,
        detection: 5,
        operatorsError: false,
        createdBy: '',
        workTime: {
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
        },
        machine: null,
        spareParts: null,
        requiredFollowUp: '',
        stateDescription: '',
        workCarriedOut: '',
        user: null,
        priority: 'medium',
        rootCause: '',
        workorderState: null,
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
      startDateTime() {
        const {startDate, startTime} = this.form.workTime;
        return this.$moment.utc(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm').toISOString()
      },
      endDateTime() {
        const {endDate, endTime} = this.form.workTime;
        return this.$moment.utc(`${endDate} ${endTime}`, 'YYYY-MM-DD HH:mm').toISOString()
      },
    },

    async mounted() {
      this.loading = true;
      if (!this.isAdmin && this.action === 'modify') {
        this.formIsDisabled = true;
      }
      this.userList = await this.getUserList();
      this.sparePartsList = await this.getSparePartsList();

      // Set default date times (dateTimes now as default)
      this.setDefaults();

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
      // TODO: generate pdf
      processPDF() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        const date = new Date().toISOString().replace(".", "");

        const natureOfWork = "Nature of work:   " + this.form.natureOfWork;
        const machine = "Machine: " + this.form.machine.name;
        const assignedTo = "Assigned to:   " + this.getUserName(this.form.user);
        const typeOfWork = "Type of work:   " + this.form.typeOfWork;
        const startDateTime = "Start Datetime:   " + this.startDateTime;
        const endDateTime = "End Datetime:   " + this.endDateTime;
        const priority = "Priority:   " + this.form.priority;
        const workOrderState = "Work order state:   " + this.form.workorderState;
        const stateDescription = "State description:   " + this.form.stateDescription;
        var splitStateDescription = doc.splitTextToSize(stateDescription, 550);
        const rootCause = "Root cause:   " + this.form.rootCause;
        var splitRootCause = doc.splitTextToSize(rootCause, 550);
        const workCarriedOut = "Work carried out:   " + this.form.workCarriedOut;
        var splitWorkCarriedOut = doc.splitTextToSize(workCarriedOut, 550);
        const severity = "Severity:   " + this.form.severity;
        const detection = "Detection:   " + this.form.detection;
        const occurance = "Occurance:   " + this.form.occurance;
        const operationError = "Is this operation error?   " + (this.form.operatorsError ? "Yes" : "No");
        if (this.form.natureOfWork === 'breakdown') {
          doc.setFontSize(15);
          const title = "Breakdown - " + this.id.substr(-5, 5);
          doc.text(title, 155, 70);
          doc.setFontSize(12);
          doc.text(natureOfWork, 40, 100);
          doc.text(operationError, 40, 120);
          doc.text(occurance, 40, 140);
          doc.text(severity, 40, 160);
          doc.text(detection, 40, 180);
          doc.text(assignedTo, 40, 220);
          doc.text(machine, 40, 240);
          doc.text(typeOfWork, 40, 280);
          doc.text(startDateTime, 40, 300);
          doc.text(endDateTime, 40, 320);
          doc.text(priority, 40, 340);
          doc.text(workOrderState, 40, 360);
          doc.text(splitStateDescription, 40, 380);
          doc.text(splitRootCause, 40, 440);
          doc.text(splitWorkCarriedOut, 40, 500);
          doc.addImage(this.form.imageUrl, "JPEG", 350, 150, 200, 200);
          doc.save(title + "_" + date);
        }
        else {
          doc.setFontSize(15);
          const title = "Work order - " + this.id.substr(-5, 5);
          doc.text(title, 155, 70);
          doc.setFontSize(12);
          doc.text(natureOfWork, 40, 100);
          doc.text(assignedTo, 40, 140);
          doc.text(machine, 40, 160);
          doc.text(typeOfWork, 40, 200);
          doc.text(startDateTime, 40, 220);
          doc.text(endDateTime, 40, 240);
          doc.text(priority, 40, 260);
          doc.text(workOrderState, 40, 280);
          doc.text(splitStateDescription, 40, 300);
          doc.text(splitRootCause, 40, 360);
          doc.text(splitWorkCarriedOut, 40, 420);
          doc.addImage(this.form.imageUrl, "JPEG", 350, 150, 200, 200);
          doc.save(title + "_" + date);
        }
      },


      // TODO: get pdf
      getPDF() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        const date = new Date().toISOString().replace(".", "");

        const natureOfWork = "Nature of work:   " + this.form.natureOfWork;
        const machine = "Machine: " + this.form.machine.name;
        const assignedTo = "Assigned to:   " + this.getUserName(this.form.user);
        const typeOfWork = "Type of work:   " + this.form.typeOfWork;
        const startDateTime = "Start Datetime:   " + this.startDateTime;
        const endDateTime = "End Datetime:   " + this.endDateTime;
        const priority = "Priority:   " + this.form.priority;
        const workOrderState = "Work order state:   " + this.form.workorderState;
        const stateDescription = "State description:   " + this.form.stateDescription;
        var splitStateDescription = doc.splitTextToSize(stateDescription, 550);
        const rootCause = "Root cause:   " + this.form.rootCause;
        var splitRootCause = doc.splitTextToSize(rootCause, 550);
        const workCarriedOut = "Work carried out:   " + this.form.workCarriedOut;
        var splitWorkCarriedOut = doc.splitTextToSize(workCarriedOut, 550);
        const severity = "Severity:   " + this.form.severity;
        const detection = "Detection:   " + this.form.detection;
        const occurance = "Occurance:   " + this.form.occurance;
        const operationError = "Is this operation error?   " + (this.form.operatorsError ? "Yes" : "No");
        if (this.form.natureOfWork === 'breakdown') {
          doc.setFontSize(15);
          const title = "Breakdown-" + this.id.substr(-5, 5);
          doc.text(title, 155, 70);
          doc.setFontSize(12);
          doc.text(natureOfWork, 40, 100);
          doc.text(operationError, 40, 120);
          doc.text(occurance, 40, 140);
          doc.text(severity, 40, 160);
          doc.text(detection, 40, 180);
          doc.text(assignedTo, 40, 220);
          doc.text(machine, 40, 240);
          doc.text(typeOfWork, 40, 280);
          doc.text(startDateTime, 40, 300);
          doc.text(endDateTime, 40, 320);
          doc.text(priority, 40, 340);
          doc.text(workOrderState, 40, 360);
          doc.text(splitStateDescription, 40, 380);
          doc.text(splitRootCause, 40, 440);
          doc.text(splitWorkCarriedOut, 40, 500);
          doc.addImage(this.form.imageUrl, "JPEG", 350, 150, 200, 200);
          return [doc.output('dataurl'), title];
        }
        else {
          doc.setFontSize(15);
          const title = "Workorder-" + this.id.substr(-5, 5);
          doc.text(title, 155, 70);
          doc.setFontSize(12);
          doc.text(natureOfWork, 40, 100);
          doc.text(assignedTo, 40, 140);
          doc.text(machine, 40, 160);
          doc.text(typeOfWork, 40, 200);
          doc.text(startDateTime, 40, 220);
          doc.text(endDateTime, 40, 240);
          doc.text(priority, 40, 260);
          doc.text(workOrderState, 40, 280);
          doc.text(splitStateDescription, 40, 300);
          doc.text(splitRootCause, 40, 360);
          doc.text(splitWorkCarriedOut, 40, 420);
          doc.addImage(this.form.imageUrl, "JPEG", 350, 150, 200, 200);
          return [doc.output('dataurl'), title];
        }
      },


      //TODO: check if item is in array
      checkIfNonExist(id, compareArray) {
        let machedArray = compareArray.filter(item => {
          return item.id === id;
        });
        return machedArray.length === 0;
      },


      //TODO: reduce stock amount by 1 according to spare part's id
      async reduceStockAmount(id, originalAmount) {
        return this.$axios({
          method: "POSt",
          url: "graphql",
          data: {
            query: `
              mutation {
                updateSparePart(input:
                  {
                    where: {id: "${id}"},
                    data: {
                      stockAmount: ${originalAmount - 1}
                    }
                  }){
                  sparePart{
                    id
                    stockAmount
                  }
                }
              }
            `
          }
        }).then(res => {
          return res;
        })
      },

      //TODO: reduce stock amount by 1 according to spare part's id
      async increaseStockAmount(id, originalAmount) {
        return this.$axios({
          method: "POSt",
          url: "graphql",
          data: {
            query: `
              mutation {
                updateSparePart(input:
                  {
                    where: {id: "${id}"},
                    data: {
                      stockAmount: ${originalAmount + 1}
                    }
                  }){
                  sparePart{
                    id
                    stockAmount
                  }
                }
              }
            `
          }
        }).then(res => {
          return res;
        })
      },

      //TODO: get spare part's stock amount by id
      getOriginaAmount(id) {
        let machedArray = this.sparePartsList.filter(item => {
          return item.id === id;
        });
        return machedArray[0].stockAmount;
      },


      //'TODO: get user's hourly rate
      getCostById(id) {
        let machedArray = this.userList.filter(item => {
          return item.id === id;
        });
        return machedArray[0].cost;
      },


      //'TODO: get spare part's price
      getSpareCostById(id) {
        let machedArray = this.sparePartsList.filter(item => {
          return item.id === id;
        });
        return machedArray[0].price;
      },


      //TODO: get hours difference between 2 dates
      diff_hours(dt2, dt1) {
        let date2 = new Date(dt2);
        let date1 = new Date(dt1);
        let diff = (date2.getTime() - date1.getTime()) / 1000;
        diff /= (60 * 60);
        return Math.abs(diff);
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
          console.log("value==========", value);
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
          this.processPDF();
        } else {
          this.dialog = true;
        }
      },
      setDefaults() {
        this.form.workTime.startDate = this.$moment().format('YYYY-MM-DD').toString();
        this.form.workTime.startTime = this.$moment().format('HH:mm');
        this.form.workTime.endTime = this.$moment().format('HH:mm');
        this.form.workTime.endDate = this.$moment().format('YYYY-MM-DD').toString()
      },
      getDateForDateTime(dateTime) {
        return this.$moment(dateTime).format('YYYY-MM-DD')
      },
      getTimeForDateTime(dateTime) {
        return this.$moment(dateTime).format('HH:mm')
      },
      //TODO: get workorder for the speficif ID
      async getFormForId(id) {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
            failureRecord(id: "${id}"){
              occurance
              createdAt
              machine {
                id
                name
              }
              spare_parts {
                id
                name
              }
              completed
              natureOfWork
              typeOfWork
              severity
              detection
              stateDescription
              image {
                id
                name
                url
              }
              workTime{
                startDateTime
                endDateTime
              }
              workCarriedOut
              users{
                id
                name
              }
              operatorsError
              stateDescription
              requiredFollowUp
              priority
              rootCause
              workorderState
            }
          }`,
          },
        }).then(({data}) => {
          const result = data.data.failureRecord;
          this.originalValue = result.workorderState;
          this.originalSpareParts = result.spare_parts;
          return {
            completed: result.completed,
            typeOfWork: result.typeOfWork,
            natureOfWork: result.natureOfWork,
            severity: result.severity,
            occurance: result.occurance,
            detection: result.detection,
            operatorsError: result.operatorsError,
            imageUrl: process.env.VUE_APP_API_BASE_URL + result.image.url,
            createdBy: result.user,
            workTime: {
              startDate: this.getDateForDateTime(result.workTime.startDateTime),
              startTime: this.getTimeForDateTime(result.workTime.startDateTime),
              endDate: this.getDateForDateTime(result.workTime.endDateTime),
              endTime: this.getTimeForDateTime(result.workTime.endDateTime),
            },
            machine: result.machine,
            requiredFollowUp: result.requiredFollowUp,
            stateDescription: result.stateDescription,
            workCarriedOut: result.workCarriedOut,
            priority: result.priority,
            rootCause: result.rootCause,
            workorderState: result.workorderState,
            user: result.users,
            spareParts: result.spare_parts
          }
        }).catch(err => console.error('Error occured', err))
      },
      async modifyBreakdown() {
        const {
          typeOfWork, natureOfWork, severity, occurance,
          detection, operatorsError, machine, requiredFollowUp,
          stateDescription, workCarriedOut, user,
          priority, workorderState, rootCause, image, completed, spareParts
        } = this.form;
        const startDateTime = this.startDateTime;
        const endDateTime = this.endDateTime;
        const duration = this.diff_hours(startDateTime, endDateTime);
        let labourPrice = 0;
        if (user) {
          user.forEach(item => {
            let userCost = this.getCostById(item.id);
            labourPrice += duration * userCost;
          })
        }
        let labourPriceParam = Math.round(labourPrice * 100) / 100;

        let userParam = [];
        if (user) {
          user.forEach(item => {
            userParam.push(item.id)
          });
        }

        let sparePartsParam = [];
        let spareCost = 0;
        if (spareParts) {
          spareParts.forEach(item => {
            let originaAmount = this.getOriginaAmount(item.id);
            if (originaAmount > 0) {
              sparePartsParam.push(item.id);

              let singCost = this.getSpareCostById(item.id);
              spareCost += singCost
            } else {
              if (!this.checkIfNonExist(item.id, this.originalSpareParts)) {
                sparePartsParam.push(item.id);

                let singCost = this.getSpareCostById(item.id);
                spareCost += singCost
              }
            }
          });
        }
        let spareCostParam = Math.round(spareCost * 100) / 100;

        //Increase amount if original item is removed
        for (let item of this.originalSpareParts) {
          let flag = this.checkIfNonExist(item.id, spareParts);
          if (flag) {
            let originaAmount = this.getOriginaAmount(item.id);
            this.increaseStockAmount(item.id, originaAmount)
          }
        }

        //reduce amount if new item is added
        for (let item of spareParts) {
          let flag = this.checkIfNonExist(item.id, this.originalSpareParts);
          if (flag) {
            let originaAmount = this.getOriginaAmount(item.id);
            if (originaAmount > 0) {
              this.reduceStockAmount(item.id, originaAmount)
            }
          }
        }


        const formData = new FormData();
        const data = {
          completed: completed,
          typeOfWork: typeOfWork,
          natureOfWork: natureOfWork,
          severity: severity,
          occurance: occurance,
          detection: detection,
          operatorsError: operatorsError,
          users: userParam,
          workTime: {
            startDateTime: startDateTime,
            endDateTime: endDateTime
          },
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          priority: priority,
          rootCause: rootCause,
          workorderState: workorderState,
          machine: machine.id,
          requiredFollowUp: requiredFollowUp,
          stateDescription: stateDescription,
          workCarriedOut: workCarriedOut,
          labourCost: labourPriceParam,
          spare_parts: sparePartsParam,
          spareCost: spareCostParam
        };
        formData.append('data', JSON.stringify(data));
        if (image) {
          formData.append('files.image', image, image.name)
        }
        return this.$axios({
            method: 'PUT',
            // The this.id points on the ID from props
            url: `/failure-records/${this.id}`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'},
          },
        ).then(({data}) => {
          this.snackbar = {
            message: 'Work order has been successfully updated.',
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
      async addBreakdown() {
        const {
          typeOfWork, natureOfWork, severity, occurance,
          detection, operatorsError, machine, requiredFollowUp,
          stateDescription, workCarriedOut, user,
          priority, workorderState, rootCause, image, completed, spareParts
        } = this.form;
        const startDateTime = this.startDateTime;
        const endDateTime = this.endDateTime;
        const duration = this.diff_hours(startDateTime, endDateTime);
        let labourPrice = 0;
        if (user) {
          user.forEach(item => {
            let userCost = this.getCostById(item.id);
            labourPrice += duration * userCost;
          })
        }
        let labourPriceParam = Math.round(labourPrice * 100) / 100;

        let userParam = [];
        if (user) {
          user.forEach(item => {
            userParam.push(item.id)
          });
        }

        let sparePartsParam = [];
        let spareCost = 0;
        if (spareParts) {
          spareParts.forEach(item => {
            let originaAmount = this.getOriginaAmount(item.id);
            if (originaAmount > 0) {
              sparePartsParam.push(item.id);

              let singCost = this.getSpareCostById(item.id);
              spareCost += singCost
            }
          });
        }
        let spareCostParam = Math.round(spareCost * 100) / 100;

        for (let item of spareParts) {
          let originaAmount = this.getOriginaAmount(item.id);
          if (originaAmount > 0) {
            await this.reduceStockAmount(item.id, originaAmount)
          }
        }
        if (this.isAdmin) {
          const formData = new FormData();
          const data = {
            completed: completed,
            typeOfWork: typeOfWork,
            natureOfWork: natureOfWork,
            severity: severity,
            occurance: occurance,
            detection: detection,
            operatorsError: operatorsError,
            users: userParam,
            workTime: {
              startDateTime: startDateTime,
              endDateTime: endDateTime
            },
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            priority: priority,
            rootCause: rootCause,
            workorderState: workorderState,
            machine: machine.id,
            requiredFollowUp: requiredFollowUp,
            stateDescription: stateDescription,
            workCarriedOut: workCarriedOut,
            company: this.company,
            labourCost: labourPriceParam,
            spare_parts: sparePartsParam,
            spareCost: spareCostParam
          };
          formData.append('data', JSON.stringify(data));
          formData.append('files.image', image, image.name);
          return this.$axios({
              method: 'POST',
              // The this.id points on the ID from props
              url: `/failure-records`,
              data: formData,
              headers: {'Content-Type': 'multipart/form-data'},
            },
          ).then(({data}) => {
            this.snackbar = {
              message: 'Work order has been successfully added.',
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
        } else {
          const formData = new FormData();
          const data = {
            completed: completed,
            typeOfWork: typeOfWork,
            natureOfWork: natureOfWork,
            severity: severity,
            occurance: occurance,
            detection: detection,
            operatorsError: operatorsError,
            users: userParam,
            workTime: {
              startDateTime: startDateTime,
              endDateTime: endDateTime
            },
            submittedBy: this.user.id,
            priority: priority,
            rootCause: rootCause,
            workorderState: workorderState,
            machine: machine.id,
            requiredFollowUp: requiredFollowUp,
            stateDescription: stateDescription,
            workCarriedOut: workCarriedOut,
            company: this.company,
            labourCost: labourPriceParam,
            spare_parts: sparePartsParam,
            spareCost: spareCostParam
          };
          formData.append('data', JSON.stringify(data));
          formData.append('files.image', image, image.name);
          return this.$axios({
              method: 'POST',
              // The this.id points on the ID from props
              url: `/failure-records`,
              data: formData,
              headers: {'Content-Type': 'multipart/form-data'},
            },
          ).then(({data}) => {
            this.snackbar = {
              message: 'Work order has been successfully added.',
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
        }

      },
      async sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      },
      async onSubmit() {
        this.loading = true;
        this.formIsDisabled = true;

        switch (this.action) {
          case 'add':
            await this.addBreakdown();
            break;
          case 'modify':
            await this.modifyBreakdown();
            break
        }

        this.loading = false;

        return this.sleep(500)
          .then(() => {
            if (this.form.natureOfWork === 'breakdown') {
              this.$router.push('/work-orders/breakdowns-list')
            } else {
              this.$router.push('/work-orders/work-orders-list')
            }
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
      async getUserList() {
        return this.$axios({
          method: 'POST',
          url: '/graphql',
          data: {
            query: `{
            users(where: {level: 2, company: "${this.company}"}) {
              id
              name
              cost
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

      //TODO: get spare parts list for a company which it's stock amount is greater than 0
      async getSparePartsList() {
        return this.$axios({
          method: 'POST',
          url: 'graphql',
          data: {
            query: `
          {
            spareParts(where: {company: "${this.company}"}) {
              id
              stockAmount
              name
              price
            }
          }`
          }
        }).then(res => {
          if (res.data.data.spareParts) {
            return res.data.data.spareParts;
          } else {
            return [];
          }
        })
      },
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
      }
    },

  }
</script>
