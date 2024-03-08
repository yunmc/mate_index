import http from '@/api';

// 获取用户ai列表
export const getIndexList = (params: any) => {
    return http.post(`index/home`, params);
};

export const coreInfo = (params: any) => {
    return http.post(`aiUser/core/info`, params);
};
