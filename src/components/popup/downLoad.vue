<script lang="ts" setup>
    import { NModal } from 'naive-ui';
    import { useChatStore } from '@/stores/chat';
    import { getCurrentInstance } from 'vue';
    const ChatStore = useChatStore();
    const app = getCurrentInstance();
    const sensors = app?.appContext.config.globalProperties.$sensors;
    const handleClick = () => {
        ChatStore.isPopupDl = false;
    };
    const DownloadUrl = () => {
        sensors.track('h5_download_pop_click', {
            node_name: 'MateLink App',
        });
        window.open('https://app.adjust.com/17i7dbt8');
    };
</script>

<template>
    <div>
        <NModal v-model:show="ChatStore.isPopupDl" :on-after-leave="handleClick">
            <div w-388 h-300 bg-313255 border-radius-20 overflow-hidden>
                <p color-ffffff fs-22 len-35 w-300 text-center m-a p-t-60>
                    Download the app to <br />
                    experience <br />
                    full functionality
                </p>
                <p class="btn" fs-18 color-FFFFFF @click="DownloadUrl"> MateLink App </p>
            </div>
        </NModal>
    </div>
</template>

<style lang="less" scoped>
    .btn {
        width: 280px;
        height: 54px;
        background: url(@/assets/images/btn.webp) no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
        margin-top: 40px;
        text-align: center;
        line-height: 54px;
        cursor: pointer;
    }
</style>
