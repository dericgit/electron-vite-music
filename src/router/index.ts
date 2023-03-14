import type {App} from 'vue'
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory} from 'vue-router';

import Discover from '@/pages/discover/Discover.vue';

const musicRoutes: RouteRecordRaw[] = [
  {
    path: '/discover',
    name: 'discover',
    component: Discover,
    meta: {
      keepAlive: true
    }
  }
];

export function useRouter(app: App) {
  const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior: (to, from , savedPosition) => {},
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
        children: musicRoutes,
        redirect: {
          path: '/discover'
        }
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: <div>notFound</div>
      }
    ]
  });

  router.beforeEach(({meta}, from, next) => {
    next();
  });
  router.afterEach((to, from, failed) => {
    console.log('router failed', failed);
  });

  app.use(router);
  return router;
}