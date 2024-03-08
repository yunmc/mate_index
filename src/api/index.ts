import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ResultData } from './interface';
import { ResultEnum } from '@/enums/httpEnum';
import { checkStatus } from './helper/checkStatus';
import router from '@/router';
import { GenerateKey } from '@/utils/common';
// const { VITE_API_URL } = import.meta.env;
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    noLoading?: boolean;
}

const config = {
    // 默认地址请求地址，可在 .env.** 文件中修改
    baseURL: import.meta.env.VITE_API_URL as string,
    // 设置超时时间
    timeout: ResultEnum.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: false,
};

class RequestHttp {
    service: AxiosInstance;
    public constructor(config: AxiosRequestConfig) {
        // instantiation
        this.service = axios.create(config);

        /**
         * @description 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
         */
        this.service.interceptors.request.use(
            (config: CustomAxiosRequestConfig) => {
                config.data = Object.assign({}, config.data, GenerateKey());
                config.headers!['x-client'] = 'h5';
                config.headers!['X-Version'] = '1.2.5';
                return config;
            },
            (error: AxiosError) => {
                console.log('error,error', error);
                return Promise.reject(error);
            }
        );

        /**
         * @description 响应拦截器
         *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data } = response;
                if (data.code == 1003) {
                    // window.localStorage.clear();
                    // window.location.reload();
                } else {
                    return data;
                }
            },
            async (error: AxiosError) => {
                const { response } = error;
                // 请求超时 && 网络错误单独判断，没有 response
                // 根据服务器响应的错误状态码，做不同的处理
                if (response) checkStatus(response.status);
                // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
                if (!window.navigator.onLine) router.replace('/500');
                return Promise.reject(error);
            }
        );
    }

    /**
     * @description 常用请求方法封装
     */
    get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
        return this.service.get(url, { params, ..._object });
    }
    post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
        return this.service.post(url, params, _object);
    }
    put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
        return this.service.put(url, params, _object);
    }
    delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
        return this.service.delete(url, { params, ..._object });
    }
    download(url: string, params?: object, _object = {}): Promise<BlobPart> {
        return this.service.post(url, params, { ..._object, responseType: 'blob' });
    }
}

export default new RequestHttp(config);
