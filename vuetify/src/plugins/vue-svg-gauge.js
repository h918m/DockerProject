import Vue from 'vue'
import VueSvgGauge from 'vue-svg-gauge'
import SvgGaugeSlot from './../components/user/SvgGaugeSlot'

// Custom slot component
Vue.component('svg-gauge-slot', SvgGaugeSlot)
Vue.use(VueSvgGauge)
