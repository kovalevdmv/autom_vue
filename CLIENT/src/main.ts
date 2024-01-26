import './assets/main.css'
import 'primevue/resources/themes/lara-light-green/theme.css'

import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
    components,
    directives,
  })

const app = createApp(App)

app.use(PrimeVue);

app.use(vuetify);

import Button from "primevue/button"
import Editor from 'primevue/editor';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputNumber from 'primevue/inputnumber';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import Dialog from 'primevue/dialog';
app.component('Dialog', Dialog);

app.use(ToastService);
app.component('Button', Button);
app.component('Editor', Editor);
app.component('InputText', InputText);
app.component('Textarea', Textarea);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('InputNumber', InputNumber);
app.component('Toast', Toast);

import Toolbar from 'primevue/toolbar';
app.component('Toolbar', Toolbar);

import Divider from 'primevue/divider';
app.component('Divider', Divider);


import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);


app.mount('#app')
