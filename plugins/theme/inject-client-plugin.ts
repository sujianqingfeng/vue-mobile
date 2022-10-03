import type { Plugin, ResolvedConfig } from 'vite'
import { normalizePath } from 'vite'
import createDebug from 'debug'
import { ViteThemeOptions } from '.'

interface InjectClientOptions {
  themePluginOptions?: ViteThemeOptions
}

const debug = createDebug('vite-theme')

export function injectClientPlugin(options: InjectClientOptions): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vite:inject-vite-plugin-theme',
    enforce: 'pre',
    configResolved(resolveConfig) {
      config = resolveConfig
    },

    transform(code, id) {
      const nid = normalizePath(id)
      const clientPartPath = normalizePath('theme/client/client.ts')

      if (nid.endsWith(clientPartPath)) {
        debug('transform client.ts', nid)

        code = code.replace(
          '= __COLOR_PLUGIN_OPTIONS__',
          `= ${JSON.stringify(options.themePluginOptions)}`
        )
      }

      return {
        code,
        map: null
      }
    }
  }
}

export default injectClientPlugin
