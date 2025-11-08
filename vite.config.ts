import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: './',
    
    build: {
        outDir: 'dist',
        assetsDir: 'assets'
      }
    // server: {
    //     proxy: {
    //         // 天聚数行API代理（如果需要通过代理访问）
    //         // '/api/tianapi': {
    //         //     target: 'https://apis.tianapi.com',
    //         //     changeOrigin: true,
    //         //     rewrite: (path) => path.replace(/^\/api\/tianapi/, ''),
    //         //     configure: (proxy, _options) => {
    //         //         proxy.on('error', (err, _req, _res) => {
                       
    //         //         });
    //         //         proxy.on('proxyReq', (proxyReq, req, _res) => {
                       
    //         //         });
    //         //         proxy.on('proxyRes', (proxyRes, req, _res) => {
                        
    //         //         });
    //         //     },
    //         // }
    //     }
    // }
});
