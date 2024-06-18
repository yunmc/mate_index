<script lang="ts" setup>
    import { ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    // const options = [
    //     {
    //         id: 0,
    //         label: 'Home',
    //         img: 'home',
    //         link: '/',
    //     },
    //     {
    //         id: 1,
    //         label: 'Chat',
    //         img: 'chat',
    //         link: 'chat',
    //     },
    // ];

    const links = [
        {
            id: 'x',
            label: 'X',
            icon: '@/assets/images/x-icon.webp',
            link: 'https://x.com/Matelink280248',
        },
        {
            id: 'discord',
            label: '',
            icon: '',
            link: '',
        },
        {
            id: 'ins',
            label: '',
            icon: '',
            link: '',
        },
        {
            id: 'tt',
            label: 'Tik Tok',
            icon: '@/assets/images/tt-icon.webp',
            link: '',
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

    const goto = (link: string) => {
        window.open(link, '_blank');
    };
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
        <div style="
            position: absolute;
            bottom: 55px;
            left: 50%;
            transform: translateX(-50%);
        ">
            <div 
                style="
                    width: 170px;
                    height: 48px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 6px 12px;
                    cursor: pointer;
                "
                @click="goto('https://x.com/Matelink280248')"
            >
                <img 
                    style="
                        display: block;
                        width: 36px;
                        height: 36px;
                    "
                    src="@/assets/images/x-icon.webp"
                    alt=""
                >
                <span style="
                    color: rgba(209, 209, 209, 1);
                    font-size: 13px;
                    font-weight: 500;
                ">X</span>
            </div>
            <div 
                style="
                    width: 170px;
                    height: 48px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 6px 12px;
                    cursor: pointer;
                    margin-top: 8px;
                "
                @click="goto('https://discord.gg/DwE7UVbAFe')"
            >
                <img 
                    style="
                        display: block;
                        width: 36px;
                        height: 36px;
                    "
                    src="@/assets/images/discord-icon.webp"
                    alt=""
                >
                <span style="
                    color: rgba(209, 209, 209, 1);
                    font-size: 13px;
                    font-weight: 500;
                ">Discord</span>
            </div>
            <div 
                style="
                    width: 170px;
                    height: 48px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 6px 12px;
                    cursor: pointer;
                    margin-top: 8px;
                "
                @click="goto('https://www.instagram.com/matelinkwithai')"
            >
                <img 
                    style="
                        display: block;
                        width: 36px;
                        height: 36px;
                    "
                    src="@/assets/images/ins-icon.webp"
                    alt=""
                >
                <span style="
                    color: rgba(209, 209, 209, 1);
                    font-size: 13px;
                    font-weight: 500;
                ">Instagram</span>
            </div>
        </div>
    </div>
</template>
