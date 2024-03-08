import { defineStore } from 'pinia';
import type { HomeState } from './interface';
import { getIndexList } from '@/api/home';
import { setTags } from '@/utils/common';
export const useHomeStore = defineStore({
    id: 'home',
    state: (): HomeState => ({
        list: [],
        page: 1,
        pageSize: 12,
        loading: false,
        finish: false,
    }),
    actions: {
        getList() {
            this.loading = true;

            const params = {
                page: this.page,
                pageSize: this.pageSize,
            };
            return new Promise((resolve, reject) => {
                getIndexList(params)
                    .then((response: any) => {
                        if (response.code === 200) {
                            if (response.data.length < 1) {
                                this.finish = true;
                                this.loading = false;
                            } else {
                                response.data.forEach((element: any) => {
                                    element.tags = setTags(element.tags);
                                    this.list.push(element);
                                    this.loading = false;
                                });
                            }

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
    },
    persist: {
        enabled: true,
        strategies: [
            // { storage: sessionStorage, paths: ['firstName', 'lastName'] },
            { storage: localStorage, paths: [] },
        ],
    },
});
