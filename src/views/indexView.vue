<script setup lang="ts">
    import { getCurrentInstance, onMounted, ref } from 'vue';
    import { NImage, NSpin } from 'naive-ui';
    import { useUserStore } from '@/stores/user';
    import { useHomeStore } from '@/stores/home';
    import { useChatStore } from '@/stores/chat';
    import { useRouter } from 'vue-router';
    import { getUrlParams } from '@/utils/common';

    const router = useRouter();
    const userStore = useUserStore();
    const homeStore = useHomeStore();
    const ChatStore = useChatStore();
    const app = getCurrentInstance();
    const sensors = app?.appContext.config.globalProperties.$sensors;

    let refName = router.currentRoute.value.query.ref; // 合作渠道名称
    if (!refName) {
        refName = window.location.href.match(/[?&]ref=([^=?&\/#]+)/)?.[1] ?? '';
    }

    // @tips：更新一下 user profile。
    if (refName) {
        sensors.setProfile({ ref_name: refName });
    }
    
    const toDetails = (item: any) => {
        if (!userStore.Token) {
            userStore.isPopupLogin = true;
        } else if (item) {
            ChatStore.setAiInfo(item);
            sensors.track('h5_AI_node_click', {
                node_name: 'AI聊天',
                ai_name: item.name,
                ai_id: item.ai_uid,
                ref_name: refName,
            });
            sensors.track('h5_chat_page_view', {
                entrance_source: '首页',
                ai_name: item.name,
                ai_id: item.ai_uid,
                ref_name: refName,
            });
            setTimeout(() => {
                router.push(`/chat`);
                sensors.track('h5_AI_node_click', {
                    node_name: 'AI详情',
                    ai_name: item.name,
                    ai_id: item.ai_uid,
                    ref_name: refName,
                });
            }, 300);
        }
    };
    const gotoDevin = () => {
        const devin = homeStore.list.find((item: any) => item.ai_uid === 'ai_user_f9f55d887c3c453ebf4b00f7');
        if (!devin) return;
        toDetails(devin);
    };

    onMounted(() => {
        if (homeStore.list.length < 1) {
            homeStore.getList();
        }
        if (getUrlParams('type')) {
            userStore.payType = true;
        }
        sensors.track('h5_homepage_view', {
            ref_name: refName,
        });
    });
    const mainRef = ref(null);
    const handleScroll = (event: any) => {
        const scrollHeight = event.target.scrollHeight;
        const scrollTop = event.target.scrollTop;
        const clientHeight = event.target.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
            if (!homeStore.loading && !homeStore.finish) {
                homeStore.page++;
                homeStore.getList();
            }
        }
    };
    const audio = ref();
    const audioUrl = ref('https://cdn-mate.matelink.com/audio/source/audio_cf355ab59d2044d9bbf91e348a.mp3');
    const onMouseenter = (item: any) => {
        // console.log('11111111');
        item.enterShow = true;
        item.leaveShow = false;
        audioUrl.value = item.voice_introduct;
        if (audio.value) {
            audio.value.load();
            audio.value.play();
        }
        if (video$ref.value[`video#${item.name}`]) {
            const $video = video$ref.value[`video#${item.name}`];
            // @todo：mouseenter 事件仍然会提示需要用户交互才能进行播放。
        }
    };
    const onMouseleave = (item: any) => {
        // console.log('22222222');
        item.enterShow = false;
        item.leaveShow = true;
        if (audio.value.play) {
            audio.value.pause();
        }
        audioUrl.value = '';
    };
    const video$ref = ref({} as any);
    const handle$ref = (e, item) => {
        if (!e) return;
        video$ref.value[`video#${item.name}`] = e;
    };
</script>

<template>
    <div p-t-20 m-a p-b-20 h-100p overflow-auto class="main" ref="mainRef" @scroll="handleScroll">
        <audio control ref="audio" loop>
            <source :src="audioUrl" type="audio/mpeg" />
        </audio>
        <div max-w-1120 m-a>
            <img 
                v-if="router.currentRoute.value.query.to === 'devinai'" 
                src="@/assets/images/banner_devin.webp" 
                w-100p 
                m-b-18 
                @click="gotoDevin()"
            />
            <img v-else src="@/assets/images/banner.webp" w-100p m-b-18 />
            <div d-grid justify-content-space-between style="grid-template-columns: repeat(auto-fill, 262px)">
                <div v-for="item in homeStore.list" :key="item.name">
                    <div
                        :class="[item.enterShow ? 'animate__pulse__diy' : '', item.leaveShow ? 'animate__subse__diy' : '', 'boxplus']"
                        @mouseenter="onMouseenter(item)"
                        @mouseleave="onMouseleave(item)"
                        transition-ease-in-out
                        w-262
                        h-420
                        border-radius-20
                        overflow-hidden
                        position-relative
                        m-b-18
                        c-p
                        @click="toDetails(item)"
                    >
                        <div position-absolute w-76 h-34 r-18 t-18 fs-14 center color-fff class="chat"> Chat <img m-l-3 square-12 src="@/assets/images/fly.webp" /> </div>
                        <!-- 视频 -->
                        <video-player
                            v-if="item.introduce_video"
                            class="c-video-player"
                            :ref="e => handle$ref(e, item)"
                            :width="262"
                            :height="420"
                            :src="item.introduce_video"
                            :poster="item.introduce_video_cover"
                            :autoplay="true"
                            :muted="true"
                            :loop="true"
                        />
                        <!-- 图片 -->
                        <NImage v-else-if="item.introduce_image" width="262" height="420" preview-disabled object-fit="cover" :src="item.introduce_image" />
                        <div class="bg" position-absolute w-100p left-0 p-b-16 bottom-0 p-x-15 color-ffffff>
                            <img class="play" w-62 src="@/assets/images/paly.webp" />
                            <div fs-21 font-weight-bold m-b-12 line-height-20>
                                {{ item.name }}
                            </div>
                            <div fs-12 len-16 m-b-10 class="moment">
                                {{ item.moment ? item.moment : item.introduce }}
                            </div>
                            <div flex-flex-start-center>
                                <p v-for="t in item.tags" :key="t" p-x-8 p-y-4 fs-10 center m-r-4 class="tab_bg">
                                    {{ t }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div center m-y-10 v-if="homeStore.loading">
                <NSpin size="medium" />
            </div>
            <div v-if="homeStore.finish" center m-y-10 color-fff> -.- </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .tab_bg {
        background: rgba(255, 255, 255, 0.16);
        border-radius: 12px;
    }
    .bg {
        background: linear-gradient(180deg, rgba(53, 37, 75, 0) 0%, #40273e 80%);
    }
    .virtualListInst {
        display: grid;
        grid-template-columns: repeat(auto-fill, 262px);
    }
    .main {
        scroll-behavior: smooth;
    }

    .boxplus {
        border: solid 1px #9780ff;
        .chat {
            background: linear-gradient(113deg, #8d2cff 7%, #ee2f5d 50%, #ff27d0 100%);
            backdrop-filter: blur(7.5px);
            border-radius: 16.5px;
            font-weight: bold;
            opacity: 0;
        }
        .play {
            display: none;
        }
        &:hover .chat {
            opacity: 1;
        }
        &:hover .play {
            display: block;
        }
    }

    @-webkit-keyframes pulses {
        from {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
        to {
            -webkit-transform: scale3d(1.05, 1.05, 1.05);
            transform: scale3d(1.05, 1.05, 1.05);
        }
    }
    @keyframes pulses {
        from {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
        to {
            -webkit-transform: scale3d(1.05, 1.05, 1.05);
            transform: scale3d(1.05, 1.05, 1.05);
        }
    }
    @-webkit-keyframes subses {
        from {
            -webkit-transform: scale3d(105%, 105%, 105%);
            transform: scale3d(105%, 105%, 105%);
        }
        to {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
    }
    @keyframes subses {
        from {
            -webkit-transform: scale3d(105%, 105%, 105%);
            transform: scale3d(105%, 105%, 105%);
        }
        to {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
    }
    .animate__pulse__diy {
        -webkit-animation-name: pulses;
        animation-name: pulses;
        -webkit-animation-timing-function: ease-in-out;
        animation-timing-function: ease-in-out;
        animation: pulses 0.3s;
        animation-fill-mode: both;
        border: 1px solid #9780ff !important;
    }
    .animate__subse__diy {
        -webkit-animation-name: subses;
        animation-name: subses;
        -webkit-animation-timing-function: ease-in-out;
        animation-timing-function: ease-in-out;
        animation: subses 0.4s;
        animation-fill-mode: both;
        border: solid 1px #9780ff;
    }
    .moment {
        display: -webkit-box; /* WebKit内核浏览器支持 */
        -webkit-line-clamp: 3; /* 显示三行 */
        -webkit-box-orient: vertical; /* 垂直方向展示 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
    }
    .c-video-player {
        ::v-deep img {
            object-fit: cover;
        }
        ::v-deep video {
            object-fit: cover;
        }
    }
</style>
