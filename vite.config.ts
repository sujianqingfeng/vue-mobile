import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import PostcssPxToViewport from 'postcss-px-to-viewport-8-plugin'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': './src'
    }
  },
  plugins: [
    vue(),
    Unocss({
      inspector: true,
      presets: [presetAttributify(), presetUno(), presetIcons()],
      shortcuts: [
        ['root', 'selector-[:root]:[--primary-color:#158bb8]'],
        { 'flex-center': 'flex justify-center items-center' }
      ],
      theme: {
        colors: {
          primary: 'var(--primary-color)'
        }
      }
    }),
    Pages(),
    Components({
      dts: true
    }),
    AutoImport({
      dts: true,
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        PostcssPxToViewport({
          viewportWidth: 750,
          minPixelValue: 1,
          mediaQuery: false
        })
      ]
    }
  }
})
