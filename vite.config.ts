import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import PostcssPxToViewport from 'postcss-px-to-viewport-8-plugin'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      inspector: true,
      presets: [presetAttributify(), presetUno()]
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
