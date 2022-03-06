import Vue from 'vue'

// Import component
import Loading from 'vue-loading-overlay'
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css'

// Setting defaults of loader
// Loading.props.loader = 'bars'

// Custom slot component
Vue.component('loading', Loading)
