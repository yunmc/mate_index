// fb.ts
//  引入登录SDK
export const fbJsdk = () => {
    (function (d: any, s: any, id: any) {
        let js: any;
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        // eslint-disable-next-line prefer-const
        js = d.createElement(s);
        js.id = id;
        (js as any).src = 'https://connect.facebook.net/zh_CN/sdk.js';
        (fjs as any).parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
    // 初始化
    (window as any).fbAsyncInit = function () {
        // @ts-ignore：
        // eslint-disable-next-line no-undef
        FB.init({
            appId: '173769148980844', // 应用编号
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v16.0',
        });
    };
};
fbJsdk();
