import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import devConfig from './config/dev';
import prodConfig from './config/prod';
import path from 'path';
import svgLoader from 'vite-svg-loader';


let globalConfig;
if (process.env.CONTEXT === 'production') {
  globalConfig = prodConfig;
} else {
  globalConfig = devConfig;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  server: {},
  define: {
    GLOBALCONFIG: globalConfig,
    EMULATE_FIRESTORE: process.env.EMULATE_FIRESTORE,
    EMULATE_FUNCTIONS: process.env.EMULATE_FUNCTIONS,
    EMULATE_AUTH: process.env.EMULATE_AUTH,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
