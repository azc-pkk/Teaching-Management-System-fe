import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/components.d.ts',
      }),
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          // rewrite: (p) => p.replace(/^\/api/, '')  // 若后端无 /api 前缀则启用
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log(
                `\x1b[36m[proxy →]\x1b[0m ${req.method} ${req.url}  ⇒  ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
              )
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(
                `\x1b[32m[proxy ←]\x1b[0m ${proxyRes.statusCode} ${req.url}`,
              )
            })
            proxy.on('error', (err, _req, res) => {
              console.error(`\x1b[31m[proxy ✗]\x1b[0m`, err.message)
              if (!res || res.destroyed) return
              try {
                ;(res as any).writeHead(502, { 'Content-Type': 'application/json' })
                ;(res as any).end(JSON.stringify({ message: err.message }))
              } catch {}
            })
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' } as any,
      },
    },
  }
})
