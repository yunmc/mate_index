import { defineConfig, loadEnv } from 'vite';
import type { UserConfig, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite'; //自动引入ref,reactive等等等
import { resolve } from 'path';
import { typeEnv } from './build/env';
import { globalStyle } from './build/style';
// defineConfig 工具函数，这样不用 jsdoc 注解也可以获取类型提示
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
    const root = process.cwd();
    const env = loadEnv(mode, root); // 环境变量对象
    console.log('环境变量------', env);
    console.log('文件路径（ process.cwd()）------', root);
    console.log('文件路径（dirname）------', __dirname + '/src');
    const VITE_DROP_CONSOLE = typeEnv(mode);
    console.log('VITE_DROP_CONSOLE', VITE_DROP_CONSOLE);
    // dev 独有配置
    return {
        root, //项目根目录（index.html 文件所在的位置） 默认： process.cwd()
        base: '/', //  开发或生产环境服务的公共基础路径：默认'/'
        publicDir: resolve(__dirname, './public'), //默认'public'  作为静态资源服务的文件夹  (打包public文件夹会没有，里面得东西会直接编译在dist文件下)
        assetsInclude: resolve(__dirname, './src/assets'), // 静态资源处理
        // ******插件配置******
        plugins: [
            vue(),
            vueJsx(),
            UnoCSS(),
            AutoImport({
                imports: [
                    'vue',
                    'vue-router',
                    'pinia',
                    {
                        axios: [
                            ['default', 'axios'], // import { default as axios } from 'axios',
                        ],
                    },
                ],
                dts: 'types/auto-import.d.ts', //生成全局引入的文件
            }),
        ], //配置插件
        // ******开发服务器配置******
        server: {
            https: false, //(使用https)启用 TLS + HTTP/2。注意：当 server.proxy 选项 也被使用时，将会仅使用 TLS
            host: true, // 监听所有地址
            port: 8080, //指定开发服务器端口：默认3000
            open: true, //启动时自动在浏览器中打开
            cors: false, //为开发服务器配置 CORS
            proxy: {
                //配置自定义代理规则
                '/api': {
                    target: 'https://test-api-mate.flyai.com/',
                    changeOrigin: true, //是否跨域
                    rewrite: path => path.replace(/^\/api/, ''),
                },
            },
        },
        // ******项目构建配置******
        build: {
            target: 'modules', //设置最终构建的浏览器兼容目标  //es2015(编译成es5) | modules
            outDir: 'dist', // 构建得包名  默认：dist
            assetsDir: 'assets', // 静态资源得存放路径文件名  assets
            sourcemap: false, //构建后是否生成 source map 文件
            minify: 'esbuild', // 项目压缩 :boolean | 'terser' | 'esbuild'
            chunkSizeWarningLimit: 1000, //chunk 大小警告的限制（以 kbs 为单位）默认：500
            cssTarget: 'chrome61', //防止 vite 将 rgba() 颜色转化为 #RGBA 十六进制符号的形式  (要兼容的场景是安卓微信中的 webview 时,它不支持 CSS 中的 #RGBA 十六进制颜色符号)
        },
        // ******resolver配置******
        resolve: {
            alias: {
                // 别名配置
                // 键必须以斜线开始和结束
                '@': resolve(__dirname, 'src'),
                'components': resolve(__dirname, './src/components'),
                'assets': resolve(__dirname, './src/assets'),
                '#': resolve(__dirname, 'types'),
                'build': resolve(__dirname, 'build'),
            },
        },
        // 测试环境保留打印
        esbuild: {
            pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
        },

        css: {
            // 全局变量+全局引入less
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                    modifyVars: globalStyle,
                },
            },
        },
    };
});
