<script setup lang="ts">
    import { NDialogProvider, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMessageProvider } from 'naive-ui';
    import HeaderView from '../components/HeaderView.vue';
    import SiderView from '../components/SiderView.vue';

    import PopupDownload from '../components/popup/downLoad.vue';
    import PopupPayType from '../components/popup/payType.vue';
    import PopupMateCoin from '../components/popup/mateCoin.vue';
</script>

<template>
    <NDialogProvider>
        <NMessageProvider>
            <NLayout position="absolute">
                <NLayoutHeader style="height: 60px">
                    <HeaderView />
                </NLayoutHeader>
                <NLayout has-sider position="absolute" style="top: 60px; bottom: 0">
                    <NLayoutSider class="sider">
                        <SiderView />
                    </NLayoutSider>
                    <NLayoutContent style="background: #13102b">
                        <router-view v-slot="{ Component }">
                            <keep-alive>
                                <component :is="Component" v-if="$route.meta.keepAlive" />
                            </keep-alive>
                            <component :is="Component" v-if="!$route.meta.keepAlive" />
                        </router-view>
                    </NLayoutContent>
                </NLayout>
            </NLayout>
        </NMessageProvider>
    </NDialogProvider>
    <PopupDownload />
    <PopupPayType />
    <PopupMateCoin />
</template>

<style lang="less">
    .sider {
        width: 212px !important;
        .n-layout-sider-scroll-container {
            width: 100% !important;
            min-width: 212px !important;
        }
    }
</style>
