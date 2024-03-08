import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'virtual:uno.css';
import App from './App.vue';
import router from './router';
import piniaPersist from 'pinia-plugin-persist';
import GoogleSignInPlugin from 'vue3-google-signin';
import { senSorsInit } from '@/utils/sensors';
import './assets/main.css';
import '@/utils/fb';
const { VITE_GOOGLE_ID } = import.meta.env;
const app = createApp(App);
app.config.globalProperties.$sensors = senSorsInit();
const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);
app.use(router);
app.use(GoogleSignInPlugin, {
    clientId: VITE_GOOGLE_ID,
});
app.mount('#app');
