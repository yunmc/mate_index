<script setup lang="ts">
    import { onMounted } from 'vue';
    import { NGi, NGrid, NSpin } from 'naive-ui';
    import { useChatStore } from '@/stores/chat';
    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
    const ChatStore = useChatStore();
    import ChatPeople from '../components/chat/people.vue';
    import ChatDialogue from '../components/chat/dialogue.vue';
    import ChatDetalis from '../components/chat/detalis.vue';
    import ChatNull from '../components/chat/null.vue';
    import TencentIM from '@/utils/Im';
    ChatStore.chatList = [];
    ChatStore.isSend = 0;
    onMounted(async () => {
        if (userStore.Token != '') {
            // await ChatStore.getInitChat();
            await ChatStore.getInitIm();
            ChatStore.chatIm = await new TencentIM({
                sdkAppId: ChatStore.sdkAppId,
                userId: userStore.userInfo.uid,
                userSig: ChatStore.init.userSig,
            });
        }
    });
</script>

<template>
    <NGrid h-100p overflow-hidden x-gap="0" :cols="24">
        <NGi :span="5" style="background: #18143c; height: 100%; position: relative">
            <ChatPeople />
        </NGi>

        <template v-if="userStore.Token != '' && (ChatStore.aiList != '' || !ChatStore.isAI) && ChatStore.aiInfo.ai_uid">
            <NGi :span="13">
                <div class="light-green" style="background: #13102b; height: 100%; position: relative; overflow: scroll">
                    <ChatDialogue />
                </div>
            </NGi>
            <NGi :span="6">
                <div class="light-green" style="background: #18143c; height: 100%; position: relative">
                    <ChatDetalis />
                </div>
            </NGi>
        </template>
        <template v-else>
            <NGi :span="19">
                <ChatNull />
            </NGi>
        </template>
    </NGrid>
    <NSpin v-if="ChatStore.isLoadAi && ChatStore.aiList != ''" position-absolute left-0 top-0 w-100p h-100p z-6> </NSpin>
</template>
