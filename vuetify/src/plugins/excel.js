import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import Vue from 'vue'

Vue.prototype.$xlsx = XLSX
Vue.prototype.$filesaver = FileSaver
