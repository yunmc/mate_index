<script lang="ts" setup>
    import { ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    const options = [
        {
            id: 0,
            label: 'Home',
            img: 'home',
            link: '/',
        },
        {
            id: 1,
            label: 'Chat',
            img: 'chat',
            link: 'chat',
        },
    ];
    const type = ref(0);
    const route = useRoute();
    watch(
        route,
        to => {
            if (to.path === '/') type.value = 0;
            if (to.path === '/chat') type.value = 1;
        },
        { flush: 'pre', immediate: true, deep: true }
    );
</script>

<template>
    <div h-100p w-100p bg-1D1E3E>
        <div p-30>
            <RouterLink to="/">
                <p flex-flex-start-center h-48 w-100p border-1 border-414267 color-FFFFFF fs-15 border-radius-12 c-p m-b-16 :style="{ background: type === 0 ? '#414267' : '' }">
                    <img src="@/assets/images/Home.webp" m-l-20 m-r-10 square-16 /> Home
                </p>
            </RouterLink>
            <RouterLink to="chat">
                <p flex-flex-start-center h-48 w-100p border-1 border-414267 color-FFFFFF fs-15 border-radius-12 c-p m-b-16 :style="{ background: type === 1 ? '#414267' : '' }">
                    <img src="@/assets/images/chat.webp" m-l-20 m-r-10 square-16 /> Chat
                </p>
            </RouterLink>
        </div>
    </div>
</template>
