import { defineStore } from 'pinia';
import type { ChatState } from './interface';
import { initChat, initUser, chatV3, chatLike, unlockImage, sendSelfie } from '@/api/chat';
import { coreInfo } from '@/api/home';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
export const useChatStore = defineStore({
    id: 'chat',
    state: (): ChatState => ({
        sdkAppId: 1771000113,
        isPopupDl: false,
        isPopupPay: false,
        isPopupCoin: false,
        isPopupAi: false,
        aiInfo: {},
        aiList: '',
        chatIm: '',
        init: {},
        chatList: [],
        isSend: 0,
        originalData: [],
        isScroll: true,
        isAI: true,
        isLoadAi: false,
        payToken: '',
        delAiInfo: '',
    }),
    actions: {
        getCoreInfo(uid: string) {
            const params = {
                ai_uid: uid,
            };
            return new Promise((resolve, reject) => {
                coreInfo(params)
                    .then((response: any) => {
                        this.aiInfo = response.data;
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getInitChat() {
            const params = {
                ai_uid: this.aiInfo.ai_uid,
                is_true: true,
            };
            return new Promise((resolve, reject) => {
                initChat(params)
                    .then((response: any) => {
                        if (response.code === 200) {
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
        getInitIm() {
            return new Promise((resolve, reject) => {
                initUser()
                    .then((response: any) => {
                        this.init = response.data;
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        setAiInfo(item: any) {
            this.aiInfo = '';
            setTimeout(() => {
                this.aiInfo = item;
            }, 100);
        },
        getChatV3(params: any) {
            return new Promise((resolve, reject) => {
                chatV3(params)
                    .then((response: any) => {
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getChatLike(item: any, index: any, behavior: any) {
            const params = {
                ai_uid: this.aiInfo.ai_uid,
                msg_id: item.content.data.extra.messageId,
                pic_id: item.content.data.extra.data.picId,
                user_behavior: behavior,
            };
            return new Promise((resolve, reject) => {
                chatLike(params)
                    .then((response: any) => {
                        this.chatList[index].content.data.extra.data.is_like = behavior;
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getUnlockImage(item: any, index: any) {
            const params = {
                msg_id: item.content.data.extra.messageId,
                pic_id: item.content.data.extra.data.picId,
            };
            return new Promise((resolve, reject) => {
                unlockImage(params)
                    .then((response: any) => {
                        if (response.code == 200) {
                            this.chatList[index].content.data.extra.data.pay_url = response.data.url;
                            userStore.userInfo.coins_balance = response.data.balance;
                            // userStore.setInfoUpdata();
                            this.chatList[index].content.data.extra.data.is_unlock = true;
                            this.chatIm.modifyMessage(index);
                            // setTimeout(() => {
                            //     this.isScroll = true;
                            // }, 500);
                        } else if (response.code == 1011) {
                            // this.isPopupCoin = true;
                            // userStore.paypalOpen = true;
                        } else {
                            // window.$message.success('Cause you walked hand in hand With another man in my place');
                        }
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getSendSelfie() {
            const params = {
                ai_uid: this.aiInfo.ai_uid,
            };
            return new Promise((resolve, reject) => {
                sendSelfie(params)
                    .then((response: any) => {
                        // eslint-disable-next-line no-empty
                        if (response.code == 200) {
                        } else if (response.code == 1011) {
                            // userStore.paypalOpen = true;
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
        strategies: [{ storage: localStorage, paths: ['aiInfo', 'aiList', 'init'] }],
    },
});
