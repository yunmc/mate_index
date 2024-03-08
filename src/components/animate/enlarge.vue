<template>
    <div :class="[enterShow ? 'animate__pulse__diy' : '', leaveShow ? 'animate__subse__diy' : '', 'boxplus']" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
        <slot></slot>
    </div>
</template>
<script>
    import { ref } from 'vue';
    export default {
        setup() {
            const enterShow = ref(false);
            const leaveShow = ref(false);
            const onMouseenter = () => {
                enterShow.value = true;
                leaveShow.value = false;
            };
            const onMouseleave = () => {
                enterShow.value = false;
                leaveShow.value = true;
            };
            return {
                enterShow,
                leaveShow,
                onMouseenter,
                onMouseleave,
            };
        },
    };
</script>
<style lang="less" scoped>
    @-webkit-keyframes pulses {
        from {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
        to {
            -webkit-transform: scale3d(1.05, 1.05, 1.05);
            transform: scale3d(1.05, 1.05, 1.05);
        }
    }
    @keyframes pulses {
        from {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
        to {
            -webkit-transform: scale3d(1.05, 1.05, 1.05);
            transform: scale3d(1.05, 1.05, 1.05);
        }
    }
    @-webkit-keyframes subses {
        from {
            -webkit-transform: scale3d(105%, 105%, 105%);
            transform: scale3d(105%, 105%, 105%);
        }
        to {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
    }
    @keyframes subses {
        from {
            -webkit-transform: scale3d(105%, 105%, 105%);
            transform: scale3d(105%, 105%, 105%);
        }
        to {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
    }
    .animate__pulse__diy {
        -webkit-animation-name: pulses;
        animation-name: pulses;
        -webkit-animation-timing-function: ease-in-out;
        animation-timing-function: ease-in-out;
        animation: pulses 0.3s;
        animation-fill-mode: both;
        border: 1px solid #fef679 !important;
    }
    .animate__subse__diy {
        -webkit-animation-name: subses;
        animation-name: subses;
        -webkit-animation-timing-function: ease-in-out;
        animation-timing-function: ease-in-out;
        animation: subses 0.4s;
        animation-fill-mode: both;
        border: solid 1px #9780ff;
    }
    .boxplus {
        cursor: pointer;
        border: solid 1px #9780ff;
    }
</style>
