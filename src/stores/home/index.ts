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
                                // // @todo：mock 数据，待删除!
                                // this.list[0].introduce_video = 'https://cdn-mate.matelink.com/video/source/video_feb6e9f61f0140c399a0a5478a.mp4';
                                // this.list[0].introduce_video_cover = 'https://cdn-mate.matelink.com/image/avatar/image_7aa7af63bd2041059dcb95b91c.png';
                                // this.list[0].introduce_image = '';
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
