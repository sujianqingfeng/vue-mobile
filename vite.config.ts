import path from 'path'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import PostcssPxToViewport from 'postcss-px-to-viewport-8-plugin'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

import colors from './src/config/theme-color'

const resolve = (dir) => path.resolve(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  plugins: [
    Vue({
      reactivityTransform: true
    }),
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
      },
      safelist: [
        ...colors.map((item) => `c-${item.value}`),
        ...colors.map((item) => `bg-${item.value}`)
      ]
    }),
    Pages(),
    Components({
      dts: true
    }),
    AutoImport({
      dts: true,
      imports: ['vue', 'vue-router', 'vue/macros'],
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
