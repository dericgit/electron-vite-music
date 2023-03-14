import type { App } from 'vue';
import { createPinia } from 'pinia';

export const pinia = createPinia();
export const usePinia =  (app: App) => {
  app.use(pinia);
}
