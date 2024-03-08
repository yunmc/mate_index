import http from '@/api';

// 登陆
export const userLogin = (params: any) => {
    return http.post(`user/login`, params);
};

export const getUserCenter = () => {
    return http.post(`/user/center`);
};
