import type { Plugin, ResolvedConfig } from 'vite'
import { normalizePath } from 'vite'
import createDebug from 'debug'
import { ViteThemeOptions } from '.'

interface InjectClientOptions {
  themePluginOptions?: ViteThemeOptions
  colorPluginCssOutputName?: string
}

const debug = createDebug('vite-theme')

export function injectClientPlugin(options: InjectClientOptions): Plugin {
  let config: ResolvedConfig

  let isServer = false
  return {
    name: 'vite:inject-vite-plugin-theme',
    enforce: 'pre',
    configResolved(resolveConfig) {
      config = resolveConfig
      isServer = resolveConfig.command === 'serve'
    },

    transform(code, id) {
      const nid = normalizePath(id)
      const clientPartPath = normalizePath('theme/client/client.ts')

      if (nid.endsWith(clientPartPath)) {
        debug('transform client.ts', nid)

        const {
          build: { assetsDir }
        } = config

        const getOutputFile = (name?: string) => {
          return JSON.stringify(`${config.base}${assetsDir}/${name}`)
        }

        code = code
          .replace(
            '= __COLOR_PLUGIN_OPTIONS__',
            `= ${JSON.stringify(options.themePluginOptions)}`
          )
          .replace(
            '= __COLOR_PLUGIN_OUTPUT_FILE_NAME__',
            `= ${getOutputFile(options.colorPluginCssOutputName)}`
          )
      }

      return {
        code: code.replace('= __PROD__', `= ${!isServer}`),
        // TODO
        map: null
      }
    }
  }
}

export default injectClientPlugin
