import Vue from 'vue'
import {
  extend,
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate'
import {
  email,
  max,
  min,
  numeric,
  required,
} from 'vee-validate/dist/rules'

extend('email', email);
extend('max', max);
extend('min', min);
extend('numeric', numeric);
extend('required', required);
extend('MAC', value => /(?:[0-9A-F]{2}[:]){5}(?:[0-9A-F]{2})/.test(value) && value.length === 17);
extend('currency', value => /^\d+(?:\.\d{0,2})$/.test(value));
extend('operationTime', value => value>=0 && value <= 24);

Vue.component('validation-provider', ValidationProvider);
Vue.component('validation-observer', ValidationObserver);
