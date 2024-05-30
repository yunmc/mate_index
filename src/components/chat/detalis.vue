<script lang="ts" setup>
    import { NCarousel } from 'naive-ui';
    import { useChatStore } from '@/stores/chat';
    import { getCurrentInstance, watch } from 'vue';
    import { useRouter } from 'vue-router';
    
    const app = getCurrentInstance();
    const sensors = app?.appContext.config.globalProperties.$sensors;
    const ChatStore = useChatStore();

    const router = useRouter();
    const refName = router.currentRoute.value.query.ref; // 合作渠道名称

    watch(
        () => ChatStore.aiInfo,
        () => {
            if (ChatStore.aiInfo) {
                if (ChatStore.aiInfo.name) {
                    sensors.track('h5_chat_page_view', {
                        entrance_source: 'AI详情页',
                        ai_name: ChatStore.aiInfo.name,
                        ai_id: ChatStore.aiInfo.ai_uid,
                        ref_name: refName,
                    });
                }
            }
        },
        { immediate: true }
    );
</script>

<template>
    <div class="banner" v-if="ChatStore.aiInfo">
        <NCarousel show-arrow v-if="ChatStore.aiInfo.posters">
            <img v-for="item in ChatStore.aiInfo.posters" :key="item" class="carousel-img" :src="item" />
            <template #arrow="{ prev, next }">
                <div class="custom-arrow" v-if="ChatStore.aiInfo.posters.length > 1" flex-between-center>
                    <img square-34 m-l-12 c-p class="prev" @click="prev" src="@/assets/images/arrow.webp" />
                    <img square-34 m-r-12 c-p class="next" @click="next" src="@/assets/images/arrow.webp" />
                </div>
            </template>
            <template #dots="{ total, currentIndex, to }">
                <ul class="custom-dots" center>
                    <li v-for="index of total" :key="index" :class="{ ['is-active']: currentIndex === index - 1 }" @click="to(index - 1)" />
                </ul>
            </template>
        </NCarousel>
    </div>
    <div class="details" w-100p h-280 position-absolute bottom-0 left-0>
        <div p-y-20 p-x-15>
            <div color-fff fs-22 font-weight-bold flex-between-center m-b-10>
                {{ ChatStore.aiInfo.ai_name }}
                <p flex-end-center>
                    <img square-18 src="@/assets/images/hot.webp" /><span color-fff fs-16 m-l-4>{{ ChatStore.aiInfo.heat }}</span>
                </p>
            </div>

            <div class="tag" flex-flex-start-center flex-wrap>
                <span v-for="item in ChatStore.aiInfo.tags" :key="item" fs-12 p-x-12 p-y-6>{{ item }}</span>
            </div>

            <div class="introduce" m-t-10 fs-14 line-height-24 m-b-80>
                {{ ChatStore.aiInfo.ai_desc }}
            </div>
        </div>
    </div>
    <!-- </div> -->
</template>

<style lang="less" scoped>
    .banner {
        height: calc(100vh - 280px);
    }
    .carousel-img {
        width: 100%;
        object-fit: cover;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .details {
        background: url(@/assets/images/detalis_bg.webp) no-repeat;
        background-size: 100% 100%;
    }
    .tag {
        span {
            border-radius: 30px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            color: rgba(255, 255, 255, 0.75);
            margin-bottom: 6px;
            margin-right: 6px;
        }
    }
    .introduce {
        color: rgba(255, 255, 255, 0.8);
    }
    .custom-arrow {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        .next {
            transform: scaleX(-1) scaleY(-1);
            &:hover {
                opacity: 0.5;
            }
        }
        .prev {
            &:hover {
                opacity: 0.5;
            }
        }
    }
    .custom-dots {
        position: absolute;
        left: 0;
        bottom: 80px;
        width: 100%;
        li {
            width: 8px;
            height: 8px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            margin: 0 3px;
            &::marker {
                content: '';
            }
        }
        .is-active {
            background: rgba(255, 255, 255, 1);
        }
    }
</style>
