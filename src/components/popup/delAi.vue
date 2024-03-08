<script lang="ts" setup>
    import { NModal } from 'naive-ui';
    import { useChatStore } from '@/stores/chat';
    const ChatStore = useChatStore();
    const handleClick = () => {
        ChatStore.isPopupAi = false;
    };

    const delConver = () => {
        ChatStore.chatIm.deleteConversation(ChatStore.delAiInfo.conversationID, ChatStore.delAiInfo.index);
        setTimeout(() => {
            handleClick();
        }, 300);
    };
</script>

<template>
    <div>
        <NModal v-model:show="ChatStore.isPopupAi" :on-after-leave="handleClick">
            <div w-388 p-b-40 bg-313255 border-radius-20 overflow-hidden>
                <p color-ffffff fs-22 len-35 w-300 text-center m-a p-t-40>
                    Are you sure you want to <br />
                    delete the conversation with <br />
                    {{ ChatStore.delAiInfo.userProfile.nick }} ? All messages <br />
                    will be lost
                </p>
                <div class="btn" center>
                    <p @click="handleClick">Cancel</p>
                    <p @click="delConver">Continue</p>
                </div>
                <!-- <p class="btn" fs-18 color-FFFFFF @click="DownloadUrl"> MateLink App </p> -->
            </div>
        </NModal>
    </div>
</template>

<style lang="less" scoped>
    .btn {
        margin-top: 25px;
        p {
            width: 153px;
            height: 54px;
            border-radius: 27px;
            border: 1px solid rgba(255, 255, 255, 0.8);
            text-align: center;
            line-height: 54px;
            font-size: 18px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            margin: 0 7.5px;
            &:last-child {
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0);
                background: linear-gradient(109deg, #8d2cff 7%, #ee2f5d 50%, #ff27d0 100%);
            }
        }
    }
</style>
