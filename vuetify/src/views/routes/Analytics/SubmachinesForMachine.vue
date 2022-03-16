<template>
  <v-container fluid>
    <v-row v-if="!loading">
      <v-col cols="12">
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="currentOption"
              color="secondary"
              item-color="secondary"
              label="Select duration"
              return-object
              :items="options"
              item-text="name"
              item-value="id"
              outlined
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
                    <v-list-item-title v-text="'1 ' + item"/>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        v-if="subMachine"
      >
        <v-row>
          <v-col cols="12">
            <h1>{{subMachine.name}}</h1>
          </v-col>
          <v-col cols="12" md="3">
            <h2>RCM</h2>
          </v-col>
          <v-col cols="12" md="9" class="pb-10">
            <v-btn
              color="primary"
              @click="exportRCM()"
            >
              Export to PDF
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <chart
              :data="dataMTBF"
              :label="'MTBF'"
            />
          </v-col>
          <v-col cols="12" md="6">
            <chart
              :data="dataMTTR"
              :label="'MTTR'"
            />
          </v-col>
          <v-col cols="12" md="6">
            <chart
              :data="dataMTTF"
              :label="'MTTF'"
            />
          </v-col>
        </v-row>


        <v-row class="pt-12">
          <v-col cols="12" md="3">
            <h2>FMEA</h2>
          </v-col>
          <v-col cols="12" md="9" class="pb-10">
            <v-btn
              color="primary"
              @click="exportFMEA()"
            >
              Export to PDF
            </v-btn>
          </v-col >
          <v-col cols="12" md="10" xl="6">
            <pie-chart
              :data="dataRPN"
            />
          </v-col>
        </v-row>


        <v-row class="pt-12">
          <v-col cols="12" md="3">
            <h2>OEE </h2>
          </v-col>
          <v-col cols="12" md="9" class="pb-10">
            <v-btn
              color="primary"
              @click="exportOEE()"
            >
              Export to PDF
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <chart
              :data="dataMA"
              :label="'Machines Availability'"
            />
          </v-col>
          <v-col cols="12" md="6">
            <chart
              :data="dataOee"
              :label="'OEE'"
            />
          </v-col>
        </v-row>
      </v-col>


      <v-col class="pt-12">
        <v-row>
          <v-col cols="12">
            <h2>OTHERS </h2>
          </v-col>
          <v-col cols="12" md="4">
            <h3>Maintenance tasks completion</h3>
          </v-col>
          <v-col cols="12" md="8" class="pb-10">
            <v-btn
              color="primary"
              @click="exportMTC()"
            >
              Export to PDF
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <h5>
              complete
            </h5>
            <bar-chart
              :data="dataMTC"
              :label="'completion'"
            />
          </v-col>
          <v-col cols="12" md="6">
            <h5>
              incomplete
            </h5>
            <bar-chart
              :data="dataMTCIncomplete"
              :label="'incomplete'"
            />
          </v-col>
          <!--          <v-col cols="12" md="6">-->
          <!--            <h5>-->
          <!--              in progress-->
          <!--            </h5>-->
          <!--            <bar-chart-->
          <!--              :data="dataMTCInprogress"-->
          <!--              :label="'in progress'"-->
          <!--            />-->
          <!--          </v-col>-->
          <v-col cols="12" class="pt-12 pb-6">
            <h3>Labour hours and Cost graph</h3>
          </v-col>
          <v-col cols="12">
            <h4>Labour hours</h4>
          </v-col>
          <v-col cols="12" class="pb-12">
            <bar-chart
              :data="dataLH"
            />
          </v-col>
          <v-col cols="12" md="3">
            <h4>Cost graph</h4>
          </v-col>
          <v-col cols="12" md="9" class="pb-10">
            <v-btn
              color="primary"
              @click="exportCost()"
            >
              Export to PDF
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <h5>Labour</h5>
            <bar-chart
              :data="labourCostData"
              :label="'Labour Cost'"
            />
          </v-col>
          <v-col cols="12" md="6">
            <h5>Spare parts</h5>
            <bar-chart
              :data="sparePartsCostData"
              :label="'Spare parts cost'"
            />
          </v-col>
          <v-col cols="12" md="6">
            <h5>MISC</h5>
            <bar-chart
              :data="miscCostData"
              :label="'MISC'"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
  import {mapGetters, mapState} from 'vuex'
  import Chart from "../../../components/base/Chart";
  import moment from 'moment'
  import PieChart from "../../../components/base/PiChart";
  import jsPDF from "jspdf";
  import BarChart from "../../../components/base/BarChart";

  const colors = [
    "#0074D9",
    "#FF4136",
    "#2ECC40",
    "#FF851B",
    "#7FDBFF",
    "#B10DC9",
    "#FFDC00",
    "#001f3f",
    "#39CCCC",
    "#01FF70",
    "#85144b",
    "#F012BE",
    "#3D9970",
    "#111111",
    "#AAAAAA"
  ];
  export default {
    name: "SubmachinesForMachine",
    components: {BarChart, PieChart, Chart},
    props: {
      id: {
        default: '0',
        type: String,
        required: true
      },
      loading: {
        default: true,
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
        data: [],
        subMachine: null,
        currentOption: 'year',
        breakDowns: [],
        totalMachines: [],
        options: ['year', 'month', 'week'],
        dataMTBF: [
          {"date": "Jan2019", "views": 39101},
          {"date": "Feb2019", "views": 42983},
          {"date": "Mar2019", "views": 58741},
          {"date": "Apr2019", "views": 48071},
          {"date": "May2019", "views": 46391},
          {"date": "Jun2019", "views": 62001},
          {"date": "Jul2019", "views": 61829},
          {"date": "Aug2019", "views": 22412},
          {"date": "Sep2019", "views": 78547},
          {"date": "Oct2019", "views": 72190},
          {"date": "Nov2019", "views": 53291},
          {"date": "Dec2019", "views": 69341}
        ],
        dataMTTR: [
          {"date": "Jan2019", "views": 39101},
          {"date": "Feb2019", "views": 42983},
          {"date": "Mar2019", "views": 58741},
          {"date": "Apr2019", "views": 48071},
          {"date": "May2019", "views": 46391},
          {"date": "Jun2019", "views": 62001},
          {"date": "Jul2019", "views": 61829},
          {"date": "Aug2019", "views": 22412},
          {"date": "Sep2019", "views": 78547},
          {"date": "Oct2019", "views": 72190},
          {"date": "Nov2019", "views": 53291},
          {"date": "Dec2019", "views": 69341}
        ],
        dataMTTF: [
          {"date": "Jan2019", "views": 39101},
          {"date": "Feb2019", "views": 42983},
          {"date": "Mar2019", "views": 58741},
          {"date": "Apr2019", "views": 48071},
          {"date": "May2019", "views": 46391},
          {"date": "Jun2019", "views": 62001},
          {"date": "Jul2019", "views": 61829},
          {"date": "Aug2019", "views": 22412},
          {"date": "Sep2019", "views": 78547},
          {"date": "Oct2019", "views": 72190},
          {"date": "Nov2019", "views": 53291},
          {"date": "Dec2019", "views": 69341}
        ],
        dataMTC: {
          labels: [],
          datasets: [
            {
              label: "New",
              backgroundColor: "#f87979",
              data: []
            },
            {
              label: "Old",
              backgroundColor: "#c0c0c0",
              data: []
            }
          ]
        },
        dataMTCIncomplete: {
          labels: [],
          datasets: [
            {
              label: "New",
              backgroundColor: "#f87979",
              data: []
            },
            {
              label: "Old",
              backgroundColor: "#c0c0c0",
              data: []
            }
          ]
        },
        labourCostData: {
          labels: ['Past month', 'Past year', 'Total'],
          datasets: [
            {
              label: "New",
              backgroundColor: "#f87979",
              data: []
            },
            {
              label: "Old",
              backgroundColor: "#c0c0c0",
              data: []
            }
          ]
        },
        sparePartsCostData: {
          labels: ['Past month', 'Past year', 'Total'],
          datasets: [
            {
              label: "New",
              backgroundColor: "#f87979",
              data: []
            },
            {
              label: "Old",
              backgroundColor: "#c0c0c0",
              data: []
            }
          ]
        },
        miscCostData: {
          labels: ['Past month', 'Past year', 'Total'],
          datasets: [
            {
              label: "New",
              backgroundColor: "#f87979",
              data: []
            },
            {
              label: "Old",
              backgroundColor: "#c0c0c0",
              data: []
            }
          ]
        },
        dataMTCInprogress: {
          labels: [],
          datasets: [
            {
              label: "New",
              backgroundColor: "#f87979",
              data: []
            },
            {
              label: "Old",
              backgroundColor: "#c0c0c0",
              data: []
            }
          ]
        },
        dataLH: {
          labels: [],
          datasets: [
            {
              label: "New",
              backgroundColor: "#f87979",
              data: []
            },
          ]
        },
        dataC: [
          {"date": "Jan2019", "views": 39101},
          {"date": "Feb2019", "views": 42983},
          {"date": "Mar2019", "views": 58741},
          {"date": "Apr2019", "views": 48071},
          {"date": "May2019", "views": 46391},
          {"date": "Jun2019", "views": 62001},
          {"date": "Jul2019", "views": 61829},
          {"date": "Aug2019", "views": 22412},
          {"date": "Sep2019", "views": 78547},
          {"date": "Oct2019", "views": 72190},
          {"date": "Nov2019", "views": 53291},
          {"date": "Dec2019", "views": 69341}
        ],
        dataRPN: {
          "vue": 51290,
          "javascript": 89125,
          "movies": 10892,
          "music": 7901,
          "cats": 49901
        },
        dataMA: [
          {"date": "Jan2019", "views": 39101},
          {"date": "Feb2019", "views": 42983},
          {"date": "Mar2019", "views": 58741},
          {"date": "Apr2019", "views": 48071},
          {"date": "May2019", "views": 46391},
          {"date": "Jun2019", "views": 62001},
          {"date": "Jul2019", "views": 61829},
          {"date": "Aug2019", "views": 22412},
          {"date": "Sep2019", "views": 78547},
          {"date": "Oct2019", "views": 72190},
          {"date": "Nov2019", "views": 53291},
          {"date": "Dec2019", "views": 69341}
        ],
        dataOee: [
          {"date": "Jan2019", "views": 39101},
          {"date": "Feb2019", "views": 42983},
          {"date": "Mar2019", "views": 58741},
          {"date": "Apr2019", "views": 48071},
          {"date": "May2019", "views": 46391},
          {"date": "Jun2019", "views": 62001},
          {"date": "Jul2019", "views": 61829},
          {"date": "Aug2019", "views": 22412},
          {"date": "Sep2019", "views": 78547},
          {"date": "Oct2019", "views": 72190},
          {"date": "Nov2019", "views": 53291},
          {"date": "Dec2019", "views": 69341}
        ],
        taskList: [],
        users: [],
      }
    },
    mounted: async function () {
      this.taskList = await this.getTaskList();
      this.users = await this.getUsers();
      await this.getBreakdowns();
      this.getRPN();
      this.getMTC();
      this.getLH();
      this.getCostData();
    },
    computed: {
      ...mapState({
        loaderOptions: state => state.settings.loader,
        company: state => state.auth.company.id
      }),
      ...mapGetters({
        isAdmin: 'auth/isAdmin'
      }),
      ddddd: function () {
        let header = [];
        for (let i = 0; i < 12; i++) {
          header.push(moment().subtract((11 - i), 'months').format('MMM YYYY'))
        }
        return header
      }
    },
    watch: {
      id: async function (newValue, oldValue) {
        this.subMachine = await this.getMachineInfo();
      },
      currentOption: function () {
        this.getMTBF();
        this.getMTC();
      },
      subMachine: function () {
        this.getMTBF();
      }
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
                failureRecordsConnection(where: {startDateTime_gt: "2022-03-01T05:00:00.000Z", endDateTime_lt: "${monthTo}", machine: "${machineId}"})
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



      //TODO: to export RCM graphs
      exportRCM: function () {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        const title = `RCM(1 ${this.currentOption}) - ` + this.id.substr(-5, 5);
        doc.setFontSize(15);
        doc.text(title, 200, 70);
        doc.setFontSize(13);
        doc.text("MTBF", 40, 100);
        doc.text("MTTR", 200, 100);
        doc.text("MTTF", 360, 100);
        doc.setFontSize(12);
        for (let i = 0; i < this.dataMTBF.length; i++) {
          let mtvfLabel = this.dataMTBF[i].date + ": ";
          let mtvfValue = this.dataMTBF[i].views.toFixed(0);
          let mttrLabel = this.dataMTTR[i].date + ": ";
          let mttrValue = this.dataMTTR[i].views.toFixed(0);
          let mttfLabel = this.dataMTTF[i].date + ": ";
          let mttfValue = this.dataMTTF[i].views.toFixed(0);
          doc.text(mtvfLabel, 40, 120 + 20 * i);
          doc.text(mtvfValue, 110, 120 + 20 * i);
          doc.text(mttrLabel, 200, 120 + 20 * i);
          doc.text(mttrValue, 270, 120 + 20 * i);
          doc.text(mttfLabel, 360, 120 + 20 * i);
          doc.text(mttfValue, 430, 120 + 20 * i);
        }
        doc.save(title);
      },


      //TODO: to export FMEA graphs
      exportFMEA: function () {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        const title = `FMEA`;
        console.log("data MTBF===>", Object.keys(this.dataRPN));
        doc.setFontSize(15);
        doc.text(title, 200, 70);
        doc.setFontSize(12);
        for (let i = 0; i < Object.keys(this.dataRPN).length; i++) {
          let key = Object.keys(this.dataRPN)[i];
          doc.text(key + ": ", 40, (120 + 20 * i));
          let value = this.dataRPN[key].toFixed(0);
          doc.text(value, 110, (120 + 20 * i))
        }
        doc.save(title);
      },


      //TODO: to export OEE graphs
      exportOEE: function () {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        const title = `OEE(1 ${this.currentOption}) - ` + this.id.substr(-5, 5);
        doc.setFontSize(15);
        doc.text(title, 200, 70);
        doc.setFontSize(13);
        doc.text("OEE", 40, 100);
        doc.text("Machine Availability", 250, 100);
        doc.setFontSize(12);
        for (let i = 0; i < this.dataMTBF.length; i++) {
          let oeeLabel = this.dataOee[i].date + ": ";
          let oeeValue = this.dataOee[i].views.toFixed(0) + " %";
          let maLavel = this.dataMA[i].date + ": ";
          let maValue = this.dataMA[i].views.toFixed(0) + " %";
          doc.text(oeeLabel, 40, 120 + 20 * i);
          doc.text(oeeValue, 110, 120 + 20 * i);
          doc.text(maLavel, 250, 120 + 20 * i);
          doc.text(maValue, 320, 120 + 20 * i);
        }
        doc.save(title);
      },


      //TODO: to export MTC graphs
      exportMTC: function () {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const docComplete = new jsPDF(orientation, unit, size);
        const docInComplete = new jsPDF(orientation, unit, size);
        const titleComplete = `Maintenance task comple(1 ${this.currentOption})`;
        const titleInComplete = `Maintenance task incomplete(1 ${this.currentOption})`;
        console.log("====>", this.dataMTC);
        docComplete.setFontSize(15);
        docInComplete.setFontSize(15);
        docComplete.text(titleComplete, 200, 70);
        docInComplete.text(titleInComplete, 200, 70);
        docComplete.setFontSize(12);
        docInComplete.setFontSize(12);
        for (let i = 0; i < this.dataMTC.labels.length; i++) {
          docComplete.text(this.dataMTC.labels[i], 40, 150 + i*20);
          docInComplete.text(this.dataMTCIncomplete.labels[i], 40, 150 + i*20);
        }
        for (let j = 0; j < this.dataMTC.datasets.length; j++) {
          docComplete.text(this.dataMTC.datasets[j].label, 120 + j*30, 120);
          docInComplete.text(this.dataMTCIncomplete.datasets[j].label, 120 + j*30, 120);
          for (let i = 0; i < this.dataMTC.labels.length; i++) {
            docComplete.text(this.dataMTC.datasets[j].data[i].toFixed(0), 120 + j*30, 150 + i*20);
            docInComplete.text(this.dataMTCIncomplete.datasets[j].data[i].toFixed(0), 120 + j*30, 150 + i*20);
          }
        }
        docComplete.save(titleComplete);
        docInComplete.save(titleInComplete);
      },


      //TODO: to export COST graph
      exportCost: function() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        const title = `Cost for machines`;
        console.log("====>", this.labourCostData);
        doc.setFontSize(15);
        doc.text(title, 200, 70);

        doc.setFontSize(13);
        doc.text("Labour", 120, 120);
        doc.text("Spare part", 270, 120);
        doc.text("MISC", 420, 120);
        doc.setFontSize(12);
        doc.text("month", 120, 150);
        doc.text("year", 165, 150);
        doc.text("total", 210, 150);
        doc.text("month", 270, 150);
        doc.text("year", 315, 150);
        doc.text("total", 360, 150);
        doc.text("month", 420, 150);
        doc.text("year", 465, 150);
        doc.text("total", 510, 150);
        for(let i=0; i < this.labourCostData.datasets.length; i++) {
          doc.text(this.labourCostData.datasets[i].label, 40, 170+20*i);
          for (let j=0; j < 3; j++) {
            doc.text(this.labourCostData.datasets[i].data[j].toFixed(0), 120 + 45 * j, 170+20*i);
            doc.text(this.sparePartsCostData.datasets[i].data[j].toFixed(0), 270 + 45 * j, 170+20*i);
            doc.text(this.miscCostData.datasets[i].data[j].toFixed(0), 420 + 45 * j, 170+20*i);
          }
        }
        doc.save(title);
      },


      getMachineInfo: async function () {
        const url = '/graphql';
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `
              {
                machine(id: "${this.id}") {
                  operationTime
                  failure_records {
                    id
                    natureOfWork
                    severity
                    occurance
                    detection
                    operatorsError
                    workTime {
                      startDateTime
                      endDateTime
                    }
                  }
                  planned_maintenance_tasks {
                    id
                    completed
                    type
                    task
                  }
                }
              }`,
          },
        }).then(res => {
          if (res.data.data.machine) {
            return res.data.data.machine;
          } else {
            return {};
          }
        }).catch(err => {

        })

      },
      getTaskList: async function () {
        const url = '/graphql';
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `{
            plannedMaintenanceTasks(where: {company: "${this.company}"}) {
              id
              completed
              type
              task
              users {
                id
                name
              }
              createdAt
            }
          }`,
          },
        }).then(res => {
          if (res.data.data.plannedMaintenanceTasks) {
            return res.data.data.plannedMaintenanceTasks;
          } else {
            return [];
          }
        }).catch(err => {

        })

      },

      // TODO: get users list whose role is Authenticated
      getUsers: async function () {
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
      getBreakdowns: async function () {
        const url = '/graphql';
        return this.$axios({
          method: 'POST',
          url: url,
          data: {
            query: `{
                failureRecords(where: {company: "${this.company}"}) {
                  id
                  machine {
                    name
                  }
                  workTime {
                    startDateTime
                    endDateTime
                  }
                }
                machines(where: {company: "${this.company}"}) {
                  id
                  name
                  failure_records {
                    id
                    natureOfWork
                    severity
                    occurance
                    detection
                    operatorsError
                    workTime {
                      startDateTime
                      endDateTime
                    }
                  }
                }
            }`,
          },
        }).then(res => {
          if (res.data.data.failureRecords) {
            this.breakDowns = res.data.data.failureRecords;
          }
          if (res.data.data.machines) {
            this.totalMachines = res.data.data.machines;
          }

        }).catch(err => {

        })
      },

      getMTBF: function () {
        if (!this.subMachine) {
          return;
        }
        if (this.currentOption === 'year') {
          let data = [];
          let dataMttr = [];
          let dataMttf = [];
          let dataOEE = [];
          const monthFrom = moment().subtract(1, 'years');
          const monthTo = moment(new Date());
          let breakHrs = 0;
          let plannedHrs = 0;
          let breakTimes = 0;
          let repaireHrs = 0;
          let repairTimes = 0;
          let mtbf = 0;
          let mttr = 0;
          for (let m = moment(monthFrom); m.isBefore(monthTo); m.add(1, 'months')) {
            const month = m.format('MMM YYYY');
            let startOfMonth = moment(m.startOf('month').format('YYYY-MM-DD hh:mm a'));
            let endOfMonth = moment(m.endOf('month').format('YYYY-MM-DD hh:mm a'));
            const totalHrs = moment.duration(endOfMonth.diff(startOfMonth)).days() * this.subMachine.operationTime;

            let runningHrs = totalHrs;
            let expectedHrs = totalHrs;
            // initialize variables
            breakHrs = 0;
            plannedHrs = 0;
            breakTimes = 0;
            repaireHrs = 0;
            repairTimes = 0;
            mtbf = 0;
            mttr = 0;
            for (let i = 0; i < this.subMachine.failure_records.length; i++) {
              let failureRecord = this.subMachine.failure_records[i];
              //TODO: calculate total running time and stopped time
              let startedTime = moment(moment(failureRecord.workTime.startDateTime).format('YYYY-MM-DD hh:mm a'));
              let endedTime = moment(moment(failureRecord.workTime.endDateTime).format('YYYY-MM-DD hh:mm a'));
              let stopedHrs = 0;

              function checkIfBreak() {
                if (failureRecord.natureOfWork === 'breakdown') {
                  breakHrs = breakHrs + stopedHrs;
                  breakTimes = breakTimes + 1;
                } else if (failureRecord.natureOfWork === 'planned') {
                  expectedHrs = expectedHrs - stopedHrs;
                } else if (failureRecord.natureOfWork === 'setup') {
                  expectedHrs = expectedHrs - stopedHrs;
                } else if (failureRecord.natureOfWork === 'repair') {
                  expectedHrs = expectedHrs - stopedHrs;
                  // save for repair hours
                  repaireHrs = repaireHrs + stopedHrs;
                  repairTimes = repairTimes + 1;
                }
              }

              // Check if started time is after startOfMonth and before of month
              if (startedTime.isAfter(startOfMonth) && endedTime.isBefore(endOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endedTime.diff(startedTime)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }


              // Check if started time is before month and ended time is within the month
              else if (startedTime.isBefore(startOfMonth) && endedTime.isBefore(endOfMonth) && endedTime.isAfter(startOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endedTime.diff(startOfMonth)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }


              // Check if started time is before month and ended time is after the month
              else if (startedTime.isBefore(startOfMonth) && endedTime.isAfter(endOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endOfMonth.diff(startOfMonth)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }

              // Check if started time is within month and ended time is after month
              else if (startedTime.isAfter(startOfMonth) && startedTime.isBefore(endOfMonth) && endedTime.isAfter(endOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endOfMonth.diff(startedTime)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }

              runningHrs = runningHrs - stopedHrs;
              //breakdown planned setup repair
            }

            mtbf = breakTimes !== 0 ? (runningHrs / Math.floor(breakTimes)) : runningHrs;
            let formatedMtbf = Number(mtbf.toFixed(2));

            mttr = breakTimes !== 0 ? (breakHrs / Math.floor(breakTimes)) : 0;
            let formatedMttr = Number(mttr.toFixed(2));

            //TODO: to get OEE

            let availavility = Math.floor((runningHrs / totalHrs) * 100);
            dataOEE.push({
              "date": month,
              "views": availavility
            });
            this.dataMA = dataOEE;
            this.dataOee = dataOEE;

            //TODO: get months
            data.push({
              "date": month,
              "views": formatedMtbf
            });
            dataMttr.push({
              "date": month,
              "views": formatedMttr
            });
            dataMttf.push({
              "date": month,
              "views": null
            })
          }
          this.dataMTBF = data;
          this.dataMTTR = dataMttr;
          this.dataMTTF = dataMttr;

        } else if (this.currentOption === 'month') {
          let data = [];
          let dataMttr = [];
          let dataMttf = [];
          let dataOEE = [];
          const monthFrom = moment().subtract(1, 'months');
          const monthTo = moment(new Date());
          let breakHrs = 0;
          let plannedHrs = 0;
          let breakTimes = 0;
          let repaireHrs = 0;
          let repairTimes = 0;
          let mtbf = 0;
          let mttr = 0;
          for (let m = moment(monthFrom); m.isBefore(monthTo); m.add(1, 'days')) {
            const month = m.format('DD MMM');
            let startOfMonth = moment(m.startOf('day').format('YYYY-MM-DD hh:mm a'));
            let endOfMonth = moment(m.endOf('day').format('YYYY-MM-DD hh:mm a'));
            const totalHrs = this.subMachine.operationTime;
            let runningHrs = totalHrs;
            let expectedHrs = totalHrs;
            // initialize variables
            breakHrs = 0;
            plannedHrs = 0;
            breakTimes = 0;
            repaireHrs = 0;
            repairTimes = 0;
            mtbf = 0;
            mttr = 0;

            for (let i = 0; i < this.subMachine.failure_records.length; i++) {
              let failureRecord = this.subMachine.failure_records[i];
              //TODO: calculate total running time and stopped time
              let startedTime = moment(moment(failureRecord.workTime.startDateTime).format('YYYY-MM-DD hh:mm a'));
              let endedTime = moment(moment(failureRecord.workTime.endDateTime).format('YYYY-MM-DD hh:mm a'));
              let stopedHrs = 0;

              function checkIfBreak() {
                if (failureRecord.natureOfWork === 'breakdown') {
                  breakHrs = breakHrs + stopedHrs;
                  breakTimes = breakTimes + 1;
                } else if (failureRecord.natureOfWork === 'planned') {
                  expectedHrs = expectedHrs - stopedHrs;
                } else if (failureRecord.natureOfWork === 'setup') {
                  expectedHrs = expectedHrs - stopedHrs;
                } else if (failureRecord.natureOfWork === 'repair') {
                  expectedHrs = expectedHrs - stopedHrs;
                  // save for repair hours
                  repaireHrs = repaireHrs + stopedHrs;
                  repairTimes = repairTimes + 1;
                }
              }

              // Check if started time is after startOfMonth and before of month
              if (startedTime.isAfter(startOfMonth) && endedTime.isBefore(endOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endedTime.diff(startedTime)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }


              // Check if started time is before month and ended time is within the month
              else if (startedTime.isBefore(startOfMonth) && endedTime.isBefore(endOfMonth) && endedTime.isAfter(startOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endedTime.diff(startOfMonth)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }


              // Check if started time is before month and ended time is after the month
              else if (startedTime.isBefore(startOfMonth) && endedTime.isAfter(endOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endOfMonth.diff(startOfMonth)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }

              // Check if started time is within month and ended time is after month
              else if (startedTime.isAfter(startOfMonth) && startedTime.isBefore(endOfMonth) && endedTime.isAfter(endOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endOfMonth.diff(startedTime)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }

              runningHrs = runningHrs - stopedHrs;
              //breakdown planned setup repair
            }

            mtbf = breakTimes !== 0 ? (runningHrs / Math.floor(breakTimes)) : runningHrs;
            let formatedMtbf = Number(mtbf.toFixed(2));

            mttr = breakTimes !== 0 ? (breakHrs / Math.floor(breakTimes)) : 0;
            let formatedMttr = Number(mttr.toFixed(2));

            //TODO: to get OEE

            let availavility = Math.floor((runningHrs / totalHrs) * 100);
            dataOEE.push({
              "date": month,
              "views": availavility
            });
            this.dataMA = dataOEE;
            this.dataOee = dataOEE;

            //TODO: get months
            data.push({
              "date": month,
              "views": formatedMtbf
            });
            dataMttr.push({
              "date": month,
              "views": formatedMttr
            });
            dataMttf.push({
              "date": month,
              "views": null
            })
          }
          this.dataMTBF = data;
          this.dataMTTR = dataMttr;
          this.dataMTTF = dataMttr;
        } else {
          let data = [];
          let dataMttr = [];
          let dataMttf = [];
          let dataOEE = [];
          const monthFrom = moment().subtract(1, 'weeks');
          const monthTo = moment(new Date());
          let breakHrs = 0;
          let plannedHrs = 0;
          let breakTimes = 0;
          let repaireHrs = 0;
          let repairTimes = 0;
          let mtbf = 0;
          let mttr = 0;
          for (let m = moment(monthFrom); m.isBefore(monthTo); m.add(1, 'days')) {
            const month = m.format('DD MMM');
            let startOfMonth = moment(m.startOf('day').format('YYYY-MM-DD hh:mm a'));
            let endOfMonth = moment(m.endOf('day').format('YYYY-MM-DD hh:mm a'));
            const totalHrs = this.subMachine.operationTime;
            let runningHrs = totalHrs;
            let expectedHrs = totalHrs;
            // initialize variables
            breakHrs = 0;
            plannedHrs = 0;
            breakTimes = 0;
            repaireHrs = 0;
            repairTimes = 0;
            mtbf = 0;
            mttr = 0;

            for (let i = 0; i < this.subMachine.failure_records.length; i++) {
              let failureRecord = this.subMachine.failure_records[i];
              //TODO: calculate total running time and stopped time
              let startedTime = moment(moment(failureRecord.workTime.startDateTime).format('YYYY-MM-DD hh:mm a'));
              let endedTime = moment(moment(failureRecord.workTime.endDateTime).format('YYYY-MM-DD hh:mm a'));
              let stopedHrs = 0;

              function checkIfBreak() {
                if (failureRecord.natureOfWork === 'breakdown') {
                  breakHrs = breakHrs + stopedHrs;
                  breakTimes = breakTimes + 1;
                } else if (failureRecord.natureOfWork === 'planned') {
                  expectedHrs = expectedHrs - stopedHrs;
                } else if (failureRecord.natureOfWork === 'setup') {
                  expectedHrs = expectedHrs - stopedHrs;
                } else if (failureRecord.natureOfWork === 'repair') {
                  expectedHrs = expectedHrs - stopedHrs;
                  // save for repair hours
                  repaireHrs = repaireHrs + stopedHrs;
                  repairTimes = repairTimes + 1;
                }
              }

              // Check if started time is after startOfMonth and before of month
              if (startedTime.isAfter(startOfMonth) && endedTime.isBefore(endOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endedTime.diff(startedTime)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }


              // Check if started time is before month and ended time is within the month
              else if (startedTime.isBefore(startOfMonth) && endedTime.isBefore(endOfMonth) && endedTime.isAfter(startOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endedTime.diff(startOfMonth)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }


              // Check if started time is before month and ended time is after the month
              else if (startedTime.isBefore(startOfMonth) && endedTime.isAfter(endOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endOfMonth.diff(startOfMonth)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }

              // Check if started time is within month and ended time is after month
              else if (startedTime.isAfter(startOfMonth) && startedTime.isBefore(endOfMonth) && endedTime.isAfter(endOfMonth)) {
                stopedHrs = Math.abs(moment.duration(endOfMonth.diff(startedTime)).asHours());
                if (stopedHrs > this.subMachine.operationTime) {
                  stopedHrs = this.subMachine.operationTime
                }
                checkIfBreak();
              }

              runningHrs = runningHrs - stopedHrs;
              //breakdown planned setup repair
            }
            mtbf = breakTimes !== 0 ? (runningHrs / Math.floor(breakTimes)) : runningHrs;
            let formatedMtbf = Number(mtbf.toFixed(2));

            mttr = breakTimes !== 0 ? (breakHrs / Math.floor(breakTimes)) : 0;
            let formatedMttr = Number(mttr.toFixed(2));

            //TODO: to get OEE

            let availavility = Math.floor((runningHrs / totalHrs) * 100);
            dataOEE.push({
              "date": month,
              "views": availavility
            });
            this.dataMA = dataOEE;
            this.dataOee = dataOEE;

            //TODO: get months
            data.push({
              "date": month,
              "views": formatedMtbf
            });
            dataMttr.push({
              "date": month,
              "views": formatedMttr
            });
            dataMttf.push({
              "date": month,
              "views": null
            })
          }
          this.dataMTBF = data;
          this.dataMTTR = dataMttr;
          this.dataMTTF = dataMttr;
        }
      },
      getRPN: function () {
        let result = {};
        for (let i = 0; i < this.totalMachines.length; i++) {
          let subOne = this.totalMachines[i];
          let totalRPN = 0;
          subOne.failure_records.map((item) => {
            totalRPN = totalRPN + item.severity * item.occurance * item.detection;
          });
          result[subOne.name] = totalRPN;
        }
        this.dataRPN = result;
      },
      getMTC: function () {
        if (this.users.length === 0) {
          return;
        }
        let labels = this.users.map((item, index) => {
          return item.name
        });
        let userLength = labels.length;

        let chartData = {
          labels: [],
          datasets: []
        };
        let chartDataInComplete = {
          labels: [],
          datasets: []
        };
        let chartDataInProgress = {
          labels: [],
          datasets: []
        };
        //initializing chart data
        for (let i = 0; i < userLength; i++) {
          chartData.datasets.push({
            label: labels[i],
            backgroundColor: colors[i],
            data: []
          });
          chartDataInComplete.datasets.push({
            label: labels[i],
            backgroundColor: colors[i],
            data: []
          });
          chartDataInProgress.datasets.push({
            label: labels[i],
            backgroundColor: colors[i],
            data: []
          });
        }


        if (this.currentOption === 'year') {
          const monthFrom = moment().subtract(1, 'years');
          const monthTo = moment(new Date());
          for (let m = moment(monthFrom); m.isBefore(monthTo); m.add(1, 'months')) {
            const month = m.format('MMM YYYY');
            let dataArrayComplete = new Array(userLength).fill(0);
            let dataArrayInComplete = new Array(userLength).fill(0);
            let dataArrayInProgress = new Array(userLength).fill(0);
            let startOfMonth = moment(m.startOf('month').format('YYYY-MM-DD hh:mm a'));
            let endOfMonth = moment(m.endOf('month').format('YYYY-MM-DD hh:mm a'));

            for (let i = 0; i < this.taskList.length; i++) {
              let task = this.taskList[i];
              //TODO: calculate total running time and stopped time
              let completedTime = moment(moment(task.createdAt).format('YYYY-MM-DD hh:mm a'));
              // Check if started time is after startOfMonth and before of month
              if (completedTime.isAfter(startOfMonth) && completedTime.isBefore(endOfMonth)) {
                if (task.users) {
                  for (let j = 0; j < task.users.length; j++) {
                    let userName = task.users[j].name;
                    let userIndex = labels.indexOf(userName);
                    if (task.completed) {
                      dataArrayComplete[userIndex] = dataArrayComplete[userIndex] + 1;
                    } else {
                      dataArrayInComplete[userIndex] = dataArrayInProgress[userIndex] + 1;
                    }
                  }
                }
              }
            }
            chartData.labels.push(month);
            chartDataInComplete.labels.push(month);
            chartDataInProgress.labels.push(month);
            labels.forEach((item, index) => {
              chartData.datasets[index].data.push(dataArrayComplete[index]);
              chartDataInComplete.datasets[index].data.push(dataArrayInComplete[index]);
              chartDataInProgress.datasets[index].data.push(dataArrayInProgress[index]);
            });
          }

          this.dataMTC = chartData;
          this.dataMTCIncomplete = chartDataInComplete;
          this.dataMTCInprogress = chartDataInProgress;
        }
        if (this.currentOption === 'month') {
          const monthFrom = moment().subtract(1, 'months');
          const monthTo = moment(new Date());
          for (let m = moment(monthFrom); m.isBefore(monthTo); m.add(1, 'days')) {
            const month = m.format('DD MMM');
            let dataArrayComplete = new Array(userLength).fill(0);
            let dataArrayInComplete = new Array(userLength).fill(0);
            let dataArrayInProgress = new Array(userLength).fill(0);
            let startOfMonth = moment(m.startOf('day').format('YYYY-MM-DD hh:mm a'));
            let endOfMonth = moment(m.endOf('day').format('YYYY-MM-DD hh:mm a'));

            for (let i = 0; i < this.taskList.length; i++) {
              let task = this.taskList[i];
              //TODO: calculate total running time and stopped time
              let completedTime = moment(moment(task.createdAt).format('YYYY-MM-DD hh:mm a'));
              // Check if started time is after startOfMonth and before of month
              if (completedTime.isAfter(startOfMonth) && completedTime.isBefore(endOfMonth)) {
                if (task.users) {
                  for (let j = 0; j < task.users.length; j++) {
                    let userName = task.users[j].name;
                    let userIndex = labels.indexOf(userName);
                    if (task.completed) {
                      dataArrayComplete[userIndex] = dataArrayComplete[userIndex] + 1;
                    } else {
                      dataArrayInComplete[userIndex] = dataArrayInProgress[userIndex] + 1;
                    }
                  }
                }
              }
            }
            chartData.labels.push(month);
            chartDataInComplete.labels.push(month);
            chartDataInProgress.labels.push(month);
            labels.forEach((item, index) => {
              chartData.datasets[index].data.push(dataArrayComplete[index]);
              chartDataInComplete.datasets[index].data.push(dataArrayInComplete[index]);
              chartDataInProgress.datasets[index].data.push(dataArrayInProgress[index]);
            });
          }

          this.dataMTC = chartData;
          this.dataMTCIncomplete = chartDataInComplete;
          this.dataMTCInprogress = chartDataInProgress;

        }
        if (this.currentOption === 'week') {
          const monthFrom = moment().subtract(1, 'weeks');
          const monthTo = moment(new Date());
          for (let m = moment(monthFrom); m.isBefore(monthTo); m.add(1, 'days')) {
            const month = m.format('DD MMM');
            let dataArrayComplete = new Array(userLength).fill(0);
            let dataArrayInComplete = new Array(userLength).fill(0);
            let dataArrayInProgress = new Array(userLength).fill(0);
            let startOfMonth = moment(m.startOf('day').format('YYYY-MM-DD hh:mm a'));
            let endOfMonth = moment(m.endOf('day').format('YYYY-MM-DD hh:mm a'));

            for (let i = 0; i < this.taskList.length; i++) {
              let task = this.taskList[i];
              //TODO: calculate total running time and stopped time
              let completedTime = moment(moment(task.createdAt).format('YYYY-MM-DD hh:mm a'));
              // Check if started time is after startOfMonth and before of month
              if (completedTime.isAfter(startOfMonth) && completedTime.isBefore(endOfMonth)) {
                if (task.users) {
                  for (let j = 0; j < task.users.length; j++) {
                    let userName = task.users[j].name;
                    let userIndex = labels.indexOf(userName);
                    if (task.completed) {
                      dataArrayComplete[userIndex] = dataArrayComplete[userIndex] + 1;
                    } else {
                      dataArrayInComplete[userIndex] = dataArrayInProgress[userIndex] + 1;
                    }
                  }
                }
              }
            }
            chartData.labels.push(month);
            chartDataInComplete.labels.push(month);
            chartDataInProgress.labels.push(month);
            labels.forEach((item, index) => {
              chartData.datasets[index].data.push(dataArrayComplete[index]);
              chartDataInComplete.datasets[index].data.push(dataArrayInComplete[index]);
              chartDataInProgress.datasets[index].data.push(dataArrayInProgress[index]);
            });
          }

          this.dataMTC = chartData;
          this.dataMTCIncomplete = chartDataInComplete;
          this.dataMTCInprogress = chartDataInProgress;
        }
      },
      getLH: function () {
        const labels = this.totalMachines.map((item) => {
          return item.name;
        });
        let chartData = {
          labels: labels,
          datasets: [
            {
              label: "Labour hours",
              backgroundColor: "#f87979",
              data: []
            },
          ]
        };
        let totalHrs = new Array(labels.length).fill(0);
        for (let i = 0; i < this.breakDowns.length; i++) {
          let breakdown = this.breakDowns[i];
          let subname = breakdown.machine.name;
          let startTime = moment(moment(breakdown.workTime.startDateTime).format('YYYY-MM-DD hh:mm a'));
          let endTime = moment(moment(breakdown.workTime.endDateTime).format('YYYY-MM-DD hh:mm a'));
          let duration = Number(Math.abs(moment.duration(endTime.diff(startTime)).asHours()).toFixed(2));
          let machineIndex = labels.indexOf(subname);
          totalHrs[machineIndex] += duration;
        }
        chartData.datasets[0].data = [...totalHrs];
        this.dataLH = chartData;
      },
      getCostData: async function () {
        if (this.totalMachines.length === 0) {
          return;
        }


        const labels = this.totalMachines.map((item) => {
          return item.name;
        });
        let chartDataLabour = {
          labels: ['Past month', 'Past year', 'Total'],
          datasets: []
        };
        let chartDataSpare = {
          labels: ['Past month', 'Past year', 'Total'],
          datasets: []
        };
        let chartDataMisc = {
          labels: ['Past month', 'Past year', 'Total'],
          datasets: []
        };

        for (let i = 0; i < labels.length; i++) {
          let machineId = this.totalMachines[i].id;
          let [labourPastMonth, sparePastMonth] = await this.getLabourCost('month', machineId);
          let [labourPastYear, sparePastYear] = await this.getLabourCost('year', machineId);
          let [labourTotal, spareTotal] = await this.getLabourCost('total', machineId);
          chartDataLabour.datasets.push({
            label: labels[i],
            backgroundColor: colors[i],
            data: [labourPastMonth, labourPastYear, labourTotal]
          });
          chartDataSpare.datasets.push({
            label: labels[i],
            backgroundColor: colors[i],
            data: [sparePastMonth, sparePastYear, spareTotal]
          });
          chartDataMisc.datasets.push({
            label: labels[i],
            backgroundColor: colors[i],
            data: [0, 0, 0]
          });
        }
        this.labourCostData = chartDataLabour;
        this.sparePartsCostData = chartDataSpare;
        this.miscCostData = chartDataMisc;
      }
    }
  }
</script>
