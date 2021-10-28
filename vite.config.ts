// https://vitejs.dev/config/

import { ConfigEnv } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import vitePluginImp from 'vite-plugin-imp'
import path from 'path'
export default ({ command, mode }: ConfigEnv) => {
  // 这里的 command 默认 === 'serve'
  // 当执行 vite build 时，command === 'build'
  // 所以这里可以根据 command 与 mode 做条件判断来导出对应环境的配置
  return {
    plugins: [
      reactRefresh(),
      vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style: (name) => `antd/es/${name}/style`
          }
        ]
      })
    ],
    // @/ 开头，为什么不用 @ 开头，这是为了避免跟业界某些 npm 包名冲突（例如 @vitejs）
    resolve: {
      alias: {
        '@/': path.resolve(__dirname, './src'),
        '@/config': path.resolve(__dirname, './src/config'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/styles': path.resolve(__dirname, './src/styles'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/common': path.resolve(__dirname, './src/common'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/routes': path.resolve(__dirname, './src/routes'),
        '@/layouts': path.resolve(__dirname, './src/layouts'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/store': path.resolve(__dirname, './src/store'),
        '@/constants': path.resolve(__dirname, './src/constants')
      }
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly'
      },
      preprocessorOptions: {
        less: {
          modifyVars: { 'primary-color': '#13c2c2' },
          javascriptEnabled: true
        }
      }
    }
  }
}
