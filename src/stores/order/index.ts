import { defineStore } from 'pinia';
import type { OrderState } from './interface';
import { priceList, createOrder, payPay, payPaySuccess, payPayCancel } from '@/api/order';
export const useOrderStore = defineStore({
    id: 'order',
    state: (): OrderState => ({
        list: [],
        current: 0,
        payCoin: {},
        orderId: '',
    }),
    actions: {
        getPriceList() {
            return new Promise((resolve, reject) => {
                priceList()
                    .then((response: any) => {
                        if (response?.code == 200) {
                            this.list = response.data.priceList;
                            this.payCoin = this.list[0];
                            // eslint-disable-next-line no-empty
                        } else {
                        }
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getCreateOrder(options: any) {
            return new Promise((resolve, reject) => {
                createOrder(options)
                    .then((response: any) => {
                        if (response.code == 200) {
                            this.orderId = response.data.order_id;
                        }
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getPayPay(options: any) {
            return new Promise((resolve, reject) => {
                payPay(options)
                    .then((response: any) => {
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getPayPaySuccess(options: any) {
            return new Promise((resolve, reject) => {
                payPaySuccess(options)
                    .then((response: any) => {
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getPayPayCancel(options: any) {
            return new Promise((resolve, reject) => {
                payPayCancel(options)
                    .then((response: any) => {
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
    },
    persist: {
        enabled: true,
        strategies: [
            // { storage: sessionStorage, paths: ['firstName', 'lastName'] },
            { storage: localStorage, paths: ['orderId', 'list'] },
        ],
    },
});
