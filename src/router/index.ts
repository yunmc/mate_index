import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory('/'),
    routes: [
        {
            path: '/',
            redirect: '/',
            component: () => import('@/layout/defaultView.vue'),
            meta: {
                title: '',
                keepAlive: true,
            },
            children: [
                {
                    path: '/',
                    component: () => import('@/views/indexView.vue'),
                    meta: {
                        title: '',
                        keepAlive: false,
                    },
                },
                {
                    path: 'chat',
                    component: () => import('@/views/chatView.vue'),
                    meta: {
                        title: '',
                        keepAlive: false,
                    },
                },
            ],
        },
    ],
});

export default router;
