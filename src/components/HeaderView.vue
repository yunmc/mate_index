<script lang="ts" setup>
    import PopupProfile from '../components/popup/proFile.vue';
    import Login from '../components/login/index.vue';
    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();

    const login = (): void => {
        userStore.isPopupLogin = true;
    };
</script>

<template>
    <header h-60 bg-1C1935 class="header">
        <div h-60 flex-between-center p-x-30>
            <RouterLink to="/">
                <div color="#fff" fs-25 font-italic font-weight-bold flex-left-center c-p> <img square-40 m-r-12 src="@/assets/images/logo.webp" /> MateLink </div>
            </RouterLink>
            <div v-if="!userStore.Token" flex-end-center>
                <span w-112 h-40 color="#8D2CFF" center border-8D2CFF border-solid border-1 border-radius-10 fs-18 m-r-22 c-p @click="login">Register</span>
                <span w-112 h-40 color="#fff" center border-1 border-8D2CFF bg-8D2CFF border-radius-10 fs-18 c-p @click="login">Login</span>
            </div>
            <div v-else>
                <div class="user" h-60 color-ffffff fs-15 flex-end-center c-p position-relative>
                    <img square-33 m-r-12 border-radius-50p :src="userStore.userInfo.avatar" /> {{ userStore.userInfo.user_account }} <img square-15 m-l-5 src="@/assets/images/arrow_button.webp" />
                    <div class="person" w-140 p-b-10 position-absolute bg-313255 top-58 z-10 p-l-10 border-radius-14>
                        <p w-120 h-40 fs-14 border-radius-10 center m-t-10 c-p @click="userStore.isPopupInfo = true"> Profile </p>
                        <p w-120 h-40 fs-14 border-radius-10 center m-t-10 c-p @click="userStore.logOut()"> Logout </p>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <Login />
    <PopupProfile />
</template>

<style lang="less" scoped>
    .user {
        .person {
            display: none;
            p {
                &:hover {
                    background: #201d3d;
                }
            }
        }
        &:hover .person {
            display: block;
        }
    }
    .header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
</style>
