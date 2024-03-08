import { defineStore } from 'pinia';
import type { UserState } from './interface';
import { userLogin, getUserCenter } from '@/api/user/index';

export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        isModal: false,
        isPopupLogin: false,
        isPopupInfo: false,
        Token: '',
        userInfo: {},
        payType: false,
    }),
    actions: {
        logOut() {
            window.localStorage.clear();
            window.location.reload();
        },
        getUser() {
            return new Promise((resolve, reject) => {
                getUserCenter()
                    .then((response: any) => {
                        if (response.code == 200) {
                            this.userInfo.coins_balance = response.data.coins_balance;
                            resolve(response);
                        }
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getUserInfo(params: any) {
            return new Promise((resolve, reject) => {
                userLogin(params)
                    .then((response: any) => {
                        if (response.code === 200) {
                            this.userInfo = response.data;
                            this.Token = response.data.apikey;
                            this.isPopupLogin = false;
                            resolve(response);
                        } else {
                            resolve(response);
                        }
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
        strategies: [{ storage: localStorage, paths: ['Token', 'userInfo'] }],
    },
});
