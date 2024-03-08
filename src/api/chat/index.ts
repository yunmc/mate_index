import http from '@/api';

// 初始化
export const initChat = (params: any) => {
    return http.post(`chat/chat/init_chat`, params);
};

export const initUser = () => {
    return http.post(`user/init/im_user`);
};

export const chatV3 = (params: any) => {
    return http.post(`chat/chat/v3`, params);
};

export const chatLike = (params: any) => {
    return http.post(`chat/chat/like`, params);
};

export const unlockImage = (params: any) => {
    return http.post(`chat/chat/unlock_image`, params);
};
export const sendSelfie = (params: any) => {
    return http.post(`chat/chat/send_selfie`, params);
};
