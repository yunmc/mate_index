<script lang="ts" setup>
    import { ref, nextTick, watch, getCurrentInstance } from 'vue';
    import { NConfigProvider, NImage, NInput, useMessage, NSpin, NScrollbar } from 'naive-ui';
    import { useChatStore } from '@/stores/chat';
    import { randomRange } from '@/utils/common';
    import { useUserStore } from '@/stores/user';
    const app = getCurrentInstance();
    const sensors = app?.appContext.config.globalProperties.$sensors;
    const userStore = useUserStore();
    const ChatStore = useChatStore();
    const message = ref('');
    const useMsg = useMessage();
    const iskey = ref(false);
    const openApp = (name: string) => {
        if (name != '') {
            sensors.track('h5_AI_function_click', {
                node_name: name,
                ai_name: ChatStore.aiInfo.name,
                ai_id: ChatStore.aiInfo.ai_uid,
            });
            sensors.track('h5_download_pop', {
                entrance_source: name,
            });
        } else {
            sensors.track('h5_AI_chat_msg_voice', {
                ai_name: ChatStore.aiInfo.name,
                ai_id: ChatStore.aiInfo.ai_uid,
            });
            sensors.track('h5_download_pop', {
                entrance_source: 'chat',
            });
        }
        if (name != 'Selfie') {
            ChatStore.isPopupDl = true;
        }
    };
    watch(
        () => ChatStore.chatList,
        () => {
            if (!ChatStore.isScroll) {
                return false;
            }
            nextTick(() => {
                handleScrollToPosition();
            });
        },
        { deep: true }
    );
    const loadRequest = ref(false);
    const loadSend = ref(false);
    const sendMessage = async () => {
        if (message.value != '' && ChatStore.isSend == 0) {
            loadSend.value = true;
            const params = {
                targetId: ChatStore.aiInfo?.ai_uid,
                content: {
                    content: message.value,
                    extra: {
                        messageId: randomRange(10),
                        dataType: 'text',
                        data: {
                            context: message.value,
                        },
                    },
                },
            };
            ChatStore.isSend = 1;
            const response: any = await ChatStore.getChatV3(params);
            loadSend.value = false;
            if (response.code == 200) {
                ChatStore.chatList.push({
                    content: {
                        data: {
                            targetId: ChatStore.aiInfo?.ai_uid,
                            content: {
                                content: message.value,
                            },
                            extra: {
                                messageId: randomRange(10),
                                dataType: 'text',
                                data: {
                                    context: message.value,
                                },
                            },
                        },
                        description: '',
                        extension: '',
                    },
                    to: ChatStore.aiInfo?.ai_uid,
                });
                ChatStore.chatIm.sendToAiText({
                    targetId: ChatStore.aiInfo?.ai_uid,
                    content: {
                        content: message.value,
                    },
                    extra: {
                        messageId: randomRange(10),
                        dataType: 'text',
                        data: {
                            context: message.value,
                        },
                    },
                });
                message.value = '';
                ChatStore.isSend = 2;
            }
        }
    };

    const unlockImage = async (item: any, index: any) => {
        loadRequest.value = true;
        ChatStore.isScroll = false;
        const response: any = await ChatStore.getUnlockImage(item, index);
        loadRequest.value = false;
        if (response.code != 200) {
            if (response.code == 1011) {
                //余额不足
                ChatStore.isPopupCoin = true;
            } else {
                useMsg.error(response.msg);
            }
        }
        nextTick(() => {
            ChatStore.isScroll = false;
        });
    };

    const chatLike = async (item: any, index: any, type: any) => {
        loadRequest.value = true;
        const response: any = await ChatStore.getChatLike(item, index, type);
        loadRequest.value = false;
        if (response.code != 200) {
            useMsg.error(response.msg);
        }
        nextTick(() => {
            ChatStore.isScroll = false;
        });
    };

    const sendSelfie = async () => {
        loadRequest.value = true;
        const response: any = await ChatStore.getSendSelfie();
        loadRequest.value = false;
        if (response.code != 200) {
            // response.code = 1011;
            if (response.code == 1011) {
                //余额不足
                ChatStore.isPopupCoin = true;
            } else {
                useMsg.error(response.msg);
            }
        }
        nextTick(() => {
            ChatStore.isScroll = false;
        });
    };
    const NScrollbarRef = ref();
    const handleScrollToPosition = () => {
        NScrollbarRef.value?.scrollBy({ top: 10000 });
    };
    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 && iskey.value) {
            sendMessage();
        }
    });
    const darkThemeOverrides = {
        common: {
            primaryColor: '#8650D0',
            primaryColorHover: '#8650D0',
        },
    };
</script>

<template>
    <div h-100p position-absolute w-100p>
        <div class="top" h-80 font-weight-bold fs-20 color-ffffff flex-flex-start-center position-absolute z-10 bg-13102b w-100p left-0 top-0>
            <img square-45 border-radius-50p m-l-15 m-r-12 :src="ChatStore.aiInfo.avatar" />
            {{ ChatStore.aiInfo.ai_name }}
        </div>
        <NScrollbar ref="NScrollbarRef" h-100p>
            <div class="main" p-x-15>
                <div class="tips"> All chats and related services are Al-generated, and some may incur charges. Please ensure sufficient balance.</div>
                <template v-for="(item, index) in ChatStore.chatList" :key="index">
                    <div m-t-24 color-ffffff op50 text-center w-100p> {{ item.time }} </div>
                    <template v-if="item.to == userStore.userInfo.uid">
                        <div class="dialogue" v-if="item.content.data.extra.dataType == 'text' || item.content.data.extra.dataType == 'audio'">
                            <div>
                                <img class="video" square-20 v-if="item.content.data.extra.dataType == 'audio'" @click="openApp('')" src="@/assets/images/voice.webp" />
                                <span v-if="item.content.data.extra.dataType == 'text'">{{ item.content.data.extra.data.context }}</span>
                                <span v-else>{{ item.content.data.extra.data.audioContext }}</span>
                            </div>
                            <p class="icon" v-if="item.content.data.extra.data.is_like">
                                <img c-p v-if="item.content.data.extra.data.is_like == 'dislike'" src="@/assets/images/chat_icon_2.webp" />
                                <img c-p v-else src="@/assets/images/chat_icon_1.webp" />
                            </p>
                            <div class="icon" v-else>
                                <img v-if="index == ChatStore.chatList.length - 1" @click="chatLike(item, index, 'dislike')" src="@/assets/images/chat_icon_2.webp" />
                                <img v-if="index == ChatStore.chatList.length - 1" @click="chatLike(item, index, 'like')" src="@/assets/images/chat_icon_1.webp" />
                            </div>
                        </div>
                        <div class="imgPrice flex" v-else-if="item.content.data.extra.dataType == 'image'">
                            <div class="coin" v-if="item.content.data.extra.data.price == 0">
                                <NImage class="nimage" width="150" height="230" :src="item.content.data.extra.data.url" />
                            </div>
                            <div v-else>
                                <NImage class="nimage" width="150" height="230" v-if="item.content.data.extra.data.pay_url" :src="item.content.data.extra.data.pay_url" />
                                <NImage class="nimage" width="150" height="230" preview-disabled v-else :src="item.content.data.extra.data.url" />
                                <div class="buy" v-if="!item.content.data.extra.data.is_unlock" @click.stop="unlockImage(item, index)">
                                    <div center>
                                        <p center> {{ item.content.data.extra.data.price }}<img square-18 m-l-3 src="@/assets/images/coin.webp" /> </p>
                                    </div>
                                    Tap to see what's inside
                                </div>
                                <p class="icon" v-if="item.content.data.extra.data.is_like">
                                    <img c-p v-if="item.content.data.extra.data.is_like == 'dislike'" src="@/assets/images/chat_icon_2.webp" />
                                    <img c-p v-else src="@/assets/images/chat_icon_1.webp" />
                                </p>
                                <div class="icon" v-else>
                                    <img v-if="index == ChatStore.chatList.length - 1" @click="chatLike(item, index, 'dislike')" src="@/assets/images/chat_icon_2.webp" />
                                    <img v-if="index == ChatStore.chatList.length - 1" @click="chatLike(item, index, 'like')" src="@/assets/images/chat_icon_1.webp" />
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else class="reply">
                        <span> {{ item.content.data.extra.data.context }} </span>
                    </div>
                </template>
                <!--  -->
                <div class="dialogue flex dialogue_login" v-if="ChatStore.isSend == 2">
                    <div class="content">
                        <div class="text">
                            <img width="30" src="@/assets/images/loading.gif" />
                        </div>
                    </div>
                </div>
            </div>
        </NScrollbar>
    </div>
    <div class="send" position-absolute left-0 bottom-0 w-100p p-b-25 bg-13102b p-10 z-10>
        <div d-flex m-b-10>
            <img @click="sendSelfie(), openApp('Selfie')" h-26 m-r-5 c-p src="@/assets/images/fig_icon_1.webp" />
            <img v-if="ChatStore.aiInfo.generate_photo_btn" h-26 m-r-5 c-p src="@/assets/images/fig_icon_2.webp" @click="openApp('Generate Photo')" />
            <img v-if="ChatStore.aiInfo.role_play_btn" h-26 m-r-5 c-p src="@/assets/images/fig_icon_3.webp" @click="openApp('Role Play')" />
            <img v-if="ChatStore.aiInfo.private_date_btn" h-26 m-r-5 c-p src="@/assets/images/fig_icon_4.webp" @click="openApp('Date')" />
        </div>
        <div position-relative>
            <NConfigProvider preflight-style-disabled>
                <NInput
                    placeholder="Say something…"
                    type="textarea"
                    class="textarea"
                    v-model:value="message"
                    :autosize="{
                        minRows: 1,
                        maxRows: 3,
                    }"
                    :theme-overrides="darkThemeOverrides"
                    @blur="iskey = false"
                    @focus="iskey = true"
                    onkeydown="if(event.keyCode==13)return false;"
                />
            </NConfigProvider>
            <n-spin v-if="loadSend" class="send_message" square-26 position-absolute r-10 top-50p size="small" />
            <img v-else class="send_message" square-26 @click="sendMessage()" c-p position-absolute r-10 top-50p src="@/assets/images/send.webp" />
        </div>
    </div>
    <div v-if="loadRequest" position-absolute top-50p left-50p>
        <NSpin size="large" />
    </div>
</template>

<style lang="less">
    .send {
        .n-input__border {
            border: 0 !important;
        }
        .n-input .n-input-wrapper {
            padding-left: 0 !important;
            padding-right: 25px !important;
        }
        .n-input__textarea-el {
            // background: rgba(74, 81, 105, 0.5) !important;
            color: #fff !important;
        }
        .n-input:not(.n-input--disabled).n-input--focus {
            background: none !important;
        }
    }
</style>
<style lang="less" scoped>
    .textarea {
        width: 100%;
        background: rgba(74, 81, 105, 0.5);
        border-radius: 18px;
        // height: 36px;
        color: #ffffff;
        line-height: 18px;
        padding: 0 15px;
    }
    .input {
        background: rgba(74, 81, 105, 0.5);
        border: 1px solid rgba(74, 81, 105, 0.5);
        color: #ffffff;
        :hover {
            background: rgba(74, 81, 105, 0.5);
            border: 1px solid rgba(74, 81, 105, 0.5);
        }
    }
    .dialogue {
        padding: 12px;
        border-radius: 18px;
        background: radial-gradient(28% 141% at 111% 79%, #dc48a6 0%, #8650d0 50%);
        color: #ffffff;
        font-size: 15px;
        max-width: 360px;
        margin-top: 18px;
        line-height: 22px;
        margin-bottom: 10px;
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .video {
            display: inline-block;
            margin-right: 7px;
            vertical-align: top;
            margin-top: 2px;
            cursor: pointer;
        }
        span {
            font-size: 15px;
            line-height: 22px;
        }
    }
    .reply {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 18px;
        span {
            background: #393655;
            border-radius: 18px;
            padding: 12px;
            color: #ffffff;
            line-height: 22px;
            font-size: 16px;
            max-width: 300px;
            word-wrap: break-word;
            word-break: normal;
        }
    }
    .imgPrice {
        width: 150px;
        height: 230px;
        border-radius: 12px;
        color: #ffffff;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 12px;
        // overflow: hidden;
        .nimage {
            position: absolute;
            left: 0;
            top: 0;
            border-radius: 12px;
        }
        .buy {
            z-index: 1;
            position: relative;
            width: 120px;
            text-align: center;
            cursor: pointer;
            p {
                background: rgba(255, 255, 255, 0.4);
                border-radius: 16px;
                padding: 3px 6px;
                margin-bottom: 6px;
            }
        }
    }
    .icon {
        position: absolute;
        right: -80px;
        bottom: 2px;
        width: 70px;
        img {
            width: 24px;
            margin-right: 5px;
            cursor: pointer;
        }
    }

    .dialogue_login {
        width: auto;
        display: inline-block;
        padding: 8px 12px;
        .content {
            img {
                display: block;
            }
        }
    }
    .top {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    .main {
        padding-top: 85px;
        padding-bottom: 130px;
    }
    .tips {
        color: #afafaf;
        font-size: 15px;
        width: 400px;
        margin: 0 auto;
        text-align: center;
        margin-top: 24px;
        margin-bottom: 18px;
    }
    .send_message {
        margin-top: -13px;
    }
</style>
