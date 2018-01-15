import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import VueYoutube from 'vue-youtube'

import router from './router';

Vue.use(Vuetify);
Vue.use(VueLodash, lodash);
Vue.use(VueYoutube);

localStorage.apiKey = 'AIzaSyBfsWqd9ciMTZm-bd4113AZRJS_HGU0INo';
localStorage.token = 'EAACW5Fg5N2IBAPdOFLb8YhoSO8CDs5lHBKAFZClDeioquQOYXBCxaxMV5Glk7TYMnxZBnLACSkxokALOK0ps0kbQtisNQnbW4aVWP6CZCypTCZByrl1JBJ9zN7zbmt2zWTQuApLWePZC1mvkSwdgNS5YFV1pateUkXmUzHH6lZCrqZAMZBfyw8YV';

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
