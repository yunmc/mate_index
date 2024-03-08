import type { App } from 'vue';
import { createPinia } from 'pinia';
import { useUserStore } from './user';
const store = createPinia();

export function setupStore(app: App<Element>) {
    app.use(store, useUserStore);
}
// export { store };
