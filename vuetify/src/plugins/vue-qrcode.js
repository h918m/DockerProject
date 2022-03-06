import Vue from 'vue'
// Generator
import VueQrcode from '@chenfengyuan/vue-qrcode'
// Scanner
import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueQrcodeReader);

Vue.component(VueQrcode.name, VueQrcode);
