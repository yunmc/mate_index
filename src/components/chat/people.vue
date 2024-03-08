<script lang="ts" setup>
    import { nextTick, onMounted } from 'vue';
    import { NImage, useMessage } from 'naive-ui';
    import { useChatStore } from '@/stores/chat';
    import delAi from '../popup/delAi.vue';
    const ChatStore = useChatStore();
    const useMsg = useMessage();
    const setAiUser = async (item: any) => {
        ChatStore.chatList = [];
        ChatStore.isSend = 0;
        ChatStore.isScroll = true;
        ChatStore.isLoadAi = true;
        const response: any = await ChatStore.getCoreInfo(item.userProfile.userID);
        ChatStore.isLoadAi = false;
        if (response.code == 200) {
            ChatStore.chatIm.getMessageRead();
        } else {
            useMsg.error(response.msg);
        }
    };

    const deleteConver = (item: any, index: any) => {
        console.log('item', item);
        ChatStore.delAiInfo = item;
        ChatStore.delAiInfo.index = index;
        ChatStore.isPopupAi = true;
        // ChatStore.chatIm.deleteConversation(item.conversationID, index);
    };

    onMounted(async () => {
        nextTick(() => {
            if (!ChatStore.aiInfo.ai_uid && ChatStore.aiList != '') {
                setAiUser(ChatStore.aiList[0]);
            }
        });
    });
    const offset = [-15, 5] as const;
</script>

<template>
    <div p-x-12 min-w-250 p-t-33 h-100p overflow-auto flex-column>
        <div color-fff fs-20 font-weight-bold> Chat</div>
        <p color-B5B1FF op30 fs-15 v-if="ChatStore.aiList == '' && ChatStore.isAI"> It's empty </p>
        <div v-else m-t-13>
            <div v-if="!ChatStore.isAI" h-54 m-b-10 flex-flex-start-center c-p :class="!ChatStore.isAI ? 'border current' : 'border'">
                <NImage width="37" height="37" m-x-8 border-radius-50p preview-disabled object-fit="cover" :src="ChatStore.aiInfo.avatar" />
                <div w-100p m-r-8>
                    <p line-height-18 flex-between-center>
                        <span color-FFF fs-14>{{ ChatStore.aiInfo.name }}</span>
                        <span fs-10>{{}}</span>
                    </p>
                    <p line-height-18 flex-between-center>
                        <!-- <span class="overflow" fs-12>{{ item.lastMessage.content }}</span> -->
                    </p>
                </div>
            </div>
            <div
                v-for="(item, index) in ChatStore.aiList"
                :key="index"
                :class="item.userProfile.userID === ChatStore.aiInfo.ai_uid ? 'border current' : 'border'"
                h-54
                m-b-10
                flex-flex-start-center
                c-p
                @click="setAiUser(item)"
            >
                <!-- <NAvatar round m-x-8 :size="37" object-fit="contain" :src="item.userProfile.avatar" /> -->
                <!-- <NBadge :value="item.unreadCount" :offset="offset" :max="9"> -->
                <NImage width="37" height="37" m-x-8 border-radius-50p preview-disabled object-fit="cover" :src="item.userProfile.avatar" />
                <!-- </NBadge> -->
                <div w-100p m-r-8>
                    <p line-height-18 flex-between-center>
                        <span color-FFF fs-14>{{ item.userProfile.nick }}</span>
                        <span fs-10>{{ item.lastMessage.lastTime }}</span>
                    </p>
                    <p line-height-18 flex-between-center>
                        <span class="overflow" fs-12>{{ item.lastMessage.content }}</span>
                        <span v-if="item.userProfile.userID != ChatStore.aiInfo.ai_uid" @click.stop="deleteConver(item, index)"
                            ><img square-12 border-radius-50p src="@/assets/images/delete.webp"
                        /></span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <delAi></delAi>
</template>

<style lang="less" scoped>
    .border {
        border: solid 1px transparent;
        border-radius: 10px;
        color: rgba(255, 255, 255, 0.6);
    }
    .current {
        background-image: linear-gradient(#18143c, #18143c), linear-gradient(102deg, #8d2cff 7%, #ee2f5d 50%, #ff27d0 100%);
        background-origin: border-box;
        background-clip: content-box, border-box;
    }
    .overflow {
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
