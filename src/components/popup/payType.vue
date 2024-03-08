<script lang="ts" setup>
    import { NModal, NSpin } from 'naive-ui';
    import { useUserStore } from '@/stores/user';
    import { useChatStore } from '@/stores/chat';
    import { useOrderStore } from '@/stores/order';
    import { getUrlParams } from '@/utils/common';

    import { ref, watch } from 'vue';
    const useStore = useUserStore();
    const ChatStore = useChatStore();
    const oredrStore = useOrderStore();
    const isSuccess = ref(false);
    const show = ref(false);

    watch(
        () => useStore.payType,
        () => {
            if (useStore.payType) {
                show.value = true;
                isSuccess.value = getUrlParams('type') == 'success' ? true : false;
                ChatStore.payToken = getUrlParams('token');
                if (isSuccess.value) {
                    payPaySuccess();
                } else {
                    payPayCancel();
                }
            }
        },
        { immediate: true }
    );
    const payPaySuccess = async () => {
        await oredrStore.getPayPaySuccess({
            token: getUrlParams('token'),
            PayerID: getUrlParams('PayerID'),
        });
        const data: any = await oredrStore.getPayPay({
            pay_platform: 'paypal',
            order_id: oredrStore.orderId,
        });
        if (data.code == 200) {
            await useStore.getUser();
        }
        setTimeout(() => {
            show.value = false;
        }, 1000);
    };
    const payPayCancel = async () => {
        await oredrStore.getPayPayCancel({
            token: getUrlParams('token'),
            PayerID: getUrlParams('PayerID'),
        });
        setTimeout(() => {
            show.value = false;
        }, 1000);
    };

    const handleClick = () => {
        useStore.payType = false;
        if (isSuccess.value) {
            window.location.href = window.location.origin;
        }
    };
    const successBack = () => {
        window.location.href = window.location.origin;
    };
    const failBack = () => {
        useStore.payType = false;
        ChatStore.isPopupCoin = true;
    };
</script>

<template>
    <div>
        <NModal v-model:show="useStore.payType" :on-after-leave="handleClick">
            <NSpin :show="show">
                <div w-388 h-300 bg-313255 border-radius-20 overflow-hidden>
                    <template v-if="!show">
                        <div color-ffffff fs-22 len-35 w-300 text-center m-a p-t-50>
                            <img v-if="isSuccess" square-65 m-a src="@/assets/images/success.webp" />
                            <img v-else square-65 m-a src="@/assets/images/fail.webp" />
                            <p m-t-20> {{ isSuccess ? 'Payment successful' : 'Payment falled' }} </p>
                        </div>
                        <p @click="successBack()" v-if="isSuccess" class="btn" fs-18 color-FFFFFF> Back to Home </p>
                        <p @click="failBack()" v-else class="btn" fs-18 color-FFFFFF> Try Again </p>
                    </template>
                </div>
            </NSpin>
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
