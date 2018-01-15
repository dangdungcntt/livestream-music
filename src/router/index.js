import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Livestream from 'components/Livestream'



const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/livestream',
            component: Livestream
        },
        {
            path: '/livestream/:pid',
            component: Livestream
        }
    ]
});

export default router;