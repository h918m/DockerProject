<template>
  <v-container
    id="regular-forms"
    fluid
    tag="section"
  >
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
        md="6"
      >
        <base-material-card
          color="blue"
          icon="mdi-plus"
          title="Import from/Export to Excel Sheet"
          class="px-5 py-3"
        >
          <div class="mt-5" />
          <v-btn
            v-if="data"
            @click.prevent="exportTable(name)"
          >
            Export to Excel
          </v-btn>
          <v-btn
            v-if="data"
            @click="uploadData()"
          >
            Upload Data
          </v-btn>
          <div class="mt-5" />
          <v-file-input
            id="sheetjs-input"
            label="Upload Excel Sheet"
            ref="uploadFile"
            hint="Use provided template"
            prepend-icon="mdi-paperclip"
            type="file"
            outlined
            accept=".xlsx,.csv,.xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            color="deep-purple accent-4"
            @change="importTable($event,url)"
          />
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
import { mapState } from 'vuex'
import ExcelMixin from '@/mixins/excelMixin'

export default {
  name: 'PlannedMaintenancePlannedMaintenanceCurrentExcel',
  mixins: [ExcelMixin],
  props: {
    template: {
      default: null,
      type: Object,
      required: true,
    },
    url: {
      default: '',
      type: String,
      required: true,
    },
    name: {
      default: '',
      type: String,
      required: true,
    },
    data: {
      default: null,
      type: Array,
      required: true,
    },
  },
  data: () => ({
    snackbar: {
      snackbar: false,
      type: 'success',
      message: '',
    },
    loading: true,
    formIsValid: null,
    formIsDisabled: false,
    action: 'add',
  }),
  computed: {
    ...mapState({
      loaderOptions: state => state.settings.loader,
      user: state => state.auth.user,
    }),
    getActionName () {
      return this.action.replace(/^./, this.action[0].toUpperCase())
    },
  },

  async mounted () {
    this.loading = false
  },

  methods: {
    importTable : function($event,url) {
      this.$emit('excelFile', $event, url);
    },
    uploadData : function($event) {
      this.$refs.uploadFile.reset();
      this.$emit('uploadData', $event)
    }
  },
}

</script>
