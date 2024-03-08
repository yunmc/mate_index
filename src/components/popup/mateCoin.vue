<script lang="ts" setup>
    import { getCurrentInstance, ref, watch } from 'vue';
    import { NModal, NSpin } from 'naive-ui';
    import { useChatStore } from '@/stores/chat';
    import { useUserStore } from '@/stores/user';
    import { useOrderStore } from '@/stores/order';
    const app = getCurrentInstance();
    const sensors = app?.appContext.config.globalProperties.$sensors;
    const userStore = useUserStore();
    const ChatStore = useChatStore();
    const oredrStore = useOrderStore();
    const show = ref(false);
    watch(
        () => ChatStore.isPopupCoin,
        () => {
            if (ChatStore.isPopupCoin) {
                sensors.track('h5_my_node_click', {
                    node_name: 'matecoin',
                });
                sensors.track('h5_pay_pop_show', {
                    entrance_source: '首页钱包',
                });
            }
            if (oredrStore.list == '') {
                oredrStore.getPriceList();
            }
        },
        { immediate: true }
    );
    const handleClick = () => {
        if (ChatStore.payToken != '') {
            window.location.href = window.location.origin;
        }
        ChatStore.isPopupCoin = false;
    };
    if (userStore.Token != '') {
        oredrStore.getPriceList();
    }
    const setConins = (index: any, coins: any) => {
        sensors.track('h5_pay_node_click', {
            node_name: coins.usd_price + '/' + coins.coins + '/paypal',
        });
        oredrStore.current = index;
        oredrStore.payCoin = coins;
    };
    const paypal = async () => {
        show.value = true;
        const data: any = await oredrStore.getCreateOrder({
            pay_platform: 'paypal', // 苹果内购, 目前只有一个, 后续会支持多平台
            currencyCode: 'USD', // 货币类型
            rawPrice: oredrStore.payCoin.coins, // 外币金额 单位分
            product_id: oredrStore.payCoin.product_id, // 金币
            is_web: true,
        });
        if (data.code == 200 && data.data.approve_url != '') {
            show.value = false;
            window.location.href = data.data.approve_url;
            // payPay();
        }
    };
</script>

<template>
    <div>
        <NModal v-model:show="ChatStore.isPopupCoin" :on-after-leave="handleClick">
            <NSpin :show="show">
                <div w-456 p-b-20 bg-313255 border-radius-20 overflow-hidden>
                    <div fs-21 font-weight-bold color-fff center p-t-25> MateCoin </div>
                    <div fs-20 color-fff center> <img square-18 m-r-5 src="@/assets/images/coin_icon.webp" />{{ userStore.userInfo.coins_balance }} </div>
                    <div class="list">
                        <div v-for="(item, index) in oredrStore.list" :key="item.coins" @click="setConins(index, item)" :class="index == oredrStore.current ? 'pay_list current' : 'pay_list'">
                            <div class="pay">
                                <p center> <img square-18 m-r-5 src="@/assets/images/coin_icon.webp" />{{ item.coins }} </p>
                                <span>$ {{ item.usd_price }}</span>
                            </div>
                        </div>
                    </div>

                    <div center m-t-18>
                        <img w-236 h-31 c-p @click="paypal" src="@/assets/images/pay.webp" />
                    </div>
                    <p m-t-10 color-9E9E9E fs-12 text-center>
                        By continuing you accept our <a color-B5B1FF target="_blank" href="https://cdn-mate.matelink.com/web/recharge-en.html">ML Coin recharge Terms</a>
                    </p>
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
    .list {
        width: 340px;
        display: grid;
        grid-template-columns: repeat(auto-fill, 165px);
        margin: 0 auto;
        margin-top: 10px;
        justify-content: space-between;
        .pay_list {
            width: 165px;
            height: 54px;
            border-radius: 12px;
            border: solid 2px transparent;
            cursor: pointer;
            overflow: hidden;
            margin-bottom: 10px;
            .pay {
                background: rgba(74, 81, 105, 0.5);
            }
            p {
                color: #ffffff;
                font-size: 20px;
                line-height: 1;
                padding-top: 7px;
                margin-bottom: 1px;
            }
            span {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.5);
                display: block;
                text-align: center;
                padding-bottom: 3px;
            }
        }
    }
    .current {
        background-image: linear-gradient(#18143c, #18143c), linear-gradient(102deg, #8d2cff 7%, #ee2f5d 50%, #ff27d0 100%);
        background-origin: border-box;
        background-clip: content-box, border-box;
    }
</style>
