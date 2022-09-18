import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import PostcssPxToViewport from 'postcss-px-to-viewport-8-plugin'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      inspector: true,
      presets: [presetAttributify(), presetUno()]
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
