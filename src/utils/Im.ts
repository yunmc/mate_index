import TencentCloudChat from '@tencentcloud/chat';
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user';
import { timestampToDate, getTimeDifference, deepClone } from '@/utils/common';
const userStore = useUserStore();
const ChatStore = useChatStore();
class TencentIM {
    private chat: any;
    private sdkAppId: number;

    private userId: string;

    private userSig: number;

    constructor(options: any) {
        const { sdkAppId, userId, userSig } = options;
        this.sdkAppId = sdkAppId;
        this.chat = null;
        this.userId = userId;
        this.userSig = userSig;
        this.initChat();
    }

    // 初始化
    async initChat() {
        this.chat = await TencentCloudChat.create({
            SDKAppID: this.sdkAppId,
        });
        this.join();
    }
    // 登录成功
    async join() {
        const promise = this.chat.login({ userID: this.userId, userSig: this.userSig });
        promise
            .then((imResponse: any) => {
                setTimeout(() => {
                    this.listenIn();
                    this.getMessageRead();
                    setTimeout(() => {
                        this.getConversationList();
                    }, 200);
                }, 400);
                console.log('登录成功', imResponse.data); // 登录成功
                if (imResponse.data.repeatLogin === true) {
                    // 标识账号已登录，本次登录操作为重复登录。
                    console.log('标识账号已登录，本次登录操作为重复登录。', imResponse.data.errorInfo);
                }
            })
            .catch(function (imError: any) {
                console.warn('login error:', imError); // 登录失败的相关信息
            });
    }
    getConversationList() {
        // 获取全量的会话列表
        const promise = this.chat.getConversationList();
        promise
            .then(function (imResponse: any) {
                // 全量的会话列表，用该列表覆盖原有的会话列表
                const conversationList = imResponse.data.conversationList;
                // 从云端同步会话列表是否完成
                console.log('conversationList', conversationList);
                console.log('conversationList.length >= 1', conversationList.length >= 1);
                if (conversationList.length >= 1) {
                    ChatStore.aiList = [];
                    conversationList.forEach((element: any) => {
                        if (element.userProfile && element.userProfile.nick != 'PushBot') {
                            if (typeof element.lastMessage.payload.data === 'string') {
                                element.lastMessage.payload.data = JSON.parse(element.lastMessage.payload.data);
                            }
                            if (!isNaN(element.lastMessage.lastTime)) {
                                element.lastMessage.lastTime = timestampToDate(element.lastMessage.lastTime);
                            }
                            element.lastMessage.content = element.lastMessage.payload.text ? element.lastMessage.payload.text : element.lastMessage.payload.data.content;
                            ChatStore.aiList.push(element);
                        }
                    });
                    if (ChatStore.aiInfo.ai_uid) {
                        ChatStore.isAI = ChatStore.aiList.some((element: any) => element.userProfile.userID === ChatStore.aiInfo.ai_uid);
                    }
                } else {
                    if (ChatStore.aiInfo.ai_uid) {
                        ChatStore.isAI = false;
                    }
                }
            })
            .catch(function (imError: any) {
                // 获取会话列表失败的相关信息
                console.warn('getConversationList error:', imError);
            });
    }
    //删除会话
    deleteConversation(conversationID: String, index: any) {
        const promise = this.chat.deleteConversation(conversationID);
        promise
            .then(function (imResponse: any) {
                // 删除会话成功
                const { conversationID } = imResponse.data; // 被删除的会话 ID
                ChatStore.aiList.splice(index, 1);
                console.log('conversationID', conversationID);
            })
            .catch(function (imError: any) {
                console.warn('deleteConversation error:', imError); // 删除会话失败的相关信息
            });
    }

    //获取历史聊天记录
    getMessageRead() {
        if (!ChatStore.aiInfo.ai_uid) {
            return false;
        }
        setTimeout(() => {
            this.getConversationList();
        }, 200);
        this.chat.setMessageRead({ conversationID: 'C2C' + ChatStore.aiInfo.ai_uid });
        // 打开某个会话时，第一次拉取消息列表 C2Cai_user_4e8c6209507545e0abeb9f39
        // console.log('conversationID', 'C2C' + ChatStore.aiInfo.ai_uid);
        const promise = this.chat.getMessageList({
            conversationID: 'C2C' + ChatStore.aiInfo.ai_uid,
        });
        promise.then((imResponse: any) => {
            const messageList = imResponse.data.messageList; // 消息列表。
            console.log('打开某个会话时，第一次拉取消息列表');
            console.log(messageList);
            // console.log(chatStore.nextReqMessageID);
            console.log('messageList', messageList);
            messageList.forEach((element: any) => {
                ChatStore.originalData.push(element);

                this.setList(deepClone(element));
            });
        });
    }

    //监听AI回复数据处理
    onMessageReceived(event: any) {
        console.log('event', event);
        // event.data - 存储 Message 对象的数组 - [Message]
        const messageList = event.data;
        messageList.forEach((message: any) => {
            if (message.type === TencentCloudChat.TYPES.MSG_CUSTOM) {
                ChatStore.originalData.push(message);
                this.setList(message);
            }
        });
    }

    //发送消息Im
    sendToAiText(data: any) {
        // 发送文本消息，Web 端与小程序端相同
        // 1. 创建消息实例，接口返回的实例可以上屏
        const message = this.chat.createCustomMessage({
            to: ChatStore.aiInfo.ai_uid,
            conversationType: TencentCloudChat.TYPES.CONV_C2C,
            payload: {
                data: JSON.stringify(data),
                description: String(this.random(1, 6)), // 获取骰子点数
                extension: '',
            },
            // 如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
            // needReadReceipt: true,
            // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到）
            // cloudCustomData: 'your cloud custom data'
        });
        // 2. 发送消息
        const promise = this.chat.sendMessage(message);
        promise
            .then(function (imResponse: any) {
                // 发送成功
                console.log(imResponse);
            })
            .catch(function (imError: any) {
                // 发送失败
                console.warn('sendMessage error:', imError);
            });
    }
    random(min: any, max: any) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // 添加监听事件
    listenIn() {
        console.log('添加监听事件');
        this.chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, this.onMessageReceived.bind(this));
        // this.chat.on(TencentCloudChat.EVENT.SDK_READY, this.onSdkReady.bind(this));
        // this.chat.on(TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated.bind(this));
        // this.chat.on(TencentCloudChat.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, this.onTotalUnreadMessageCountUpdated.bind(this));
    }
    //遍历数据
    setList(item: any) {
        try {
            ChatStore.isSend = 0;
            item._elements.forEach((element: any, index: any) => {
                if (!element.content.data) {
                    return false;
                }
                console.log('遍历数据', element.content.data, index);
                element.content.data = JSON.parse(element.content.data);
                if (element.content.data.extra == undefined) {
                    return false;
                }

                if (element.content.data.extra.dataType == 'text' || element.content.data.extra.dataType == 'audio' || element.content.data.extra.dataType == 'image') {
                    element.content.data.is_ai_reply = true;
                    element.to = item.to;
                    if (getTimeDifference(item.time) != '') {
                        element.time = timestampToDate(item.time);
                    }
                    ChatStore.chatList.push(element);
                    console.log('ChatStore.chatList', ChatStore.chatList);
                }
                // if (element.content.data.extra.dataType == 'mate_coin') {
                //     userStore.info.coins_balance = element.content.data.extra.data.balance;
                //     userStore.setInfoUpdata();
                // }
            });
        } catch (error) {
            // window.location.reload();
        }
    }

    //消息修改
    modifyMessage(index: any) {
        console.log('ChatStore.chatList[index]', ChatStore.chatList[index]);
        const send: any = deepClone(ChatStore.chatList[index]);
        const json = JSON.stringify(send.content.data);
        const data: any = deepClone(ChatStore.originalData[index]);
        data.payload.data = json;
        data._elements[0].content.data = json;
        const promise = this.chat.modifyMessage(data);
        promise
            .then((imResponse: any) => {
                const { message } = imResponse.data;
                // this.deleteMessage(index);
                console.log('修改消息成功，message', message);
                // 修改消息成功，message 是最新的消息
            })
            .catch(function (imError: any) {
                // 修改消息失败
                const { code } = imError;
                console.log('修改消息失败', code);
                if (code === 2480) {
                    // 修改消息发生冲突，data.message 是最新的消息
                } else if (code === 2481) {
                    // 不支持修改直播群消息
                } else if (code === 20026) {
                    // 消息不存在
                }
            });
    }
    deleteMessage(index: any) {
        const data: any = deepClone(ChatStore.originalData[index]);
        const promise = this.chat.deleteMessage([data]);
        promise
            .then((imResponse: any) => {
                this.modifyMessage(index);
                console.log('删除消息成功', imResponse);
                // 删除消息成功
            })
            .catch(function (imError: any) {
                // 删除消息失败
                console.warn('删除消息失败deleteMessage error:', imError);
            });
    }
}

export default TencentIM;
