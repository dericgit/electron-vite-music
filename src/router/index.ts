import type {App} from 'vue'
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory} from 'vue-router';

import Discover from '@/pages/discover/Discover.vue';
import Home from '../pages/Home.vue';
import List from '../pages/list/list.vue'
import NotFound from '../pages/NotFound.vue';
import About from '../pages/About.vue';

const musicRoutes: RouteRecordRaw[] = [
  {
    path: '/list',
    name: 'list',
    component: List,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      keepAlive: true
    }
  },
];

export function useRouter(app: App) {
  const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior: (to, from, savedPosition) => savedPosition || ({ x: 0, y: 0 } as any),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
        children: musicRoutes,
        redirect: {
          path: '/list'
        }
      },
      {
        path: '/discover',
        name: 'discover',
        component: Discover,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
      }
    ]
  });

  router.beforeEach((to, from, next) => {
    next();
  });
  router.afterEach((to, from, failure) => {
    console.log('router failed',to, from, failure);
  });

  app.use(router);
  console.log("---加载路由");
  
  return router;
}