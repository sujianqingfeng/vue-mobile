import type { Plugin, ResolvedConfig } from 'vite'
import createDebug from 'debug'
import path from 'path'
import {
  CLIENT_PUBLIC_PATH,
  cssLangRE,
  cssVariableString,
  VITE_CLIENT_ENTRY
} from './constants'
import { extractVariable, formatCss } from './utils'
import injectClientPlugin from './inject-client-plugin'

export interface ViteThemeOptions {
  colorVariables: string[]
}

const debug = createDebug('vite-theme')

function Theme(opt: ViteThemeOptions): Plugin[] {
  const options: ViteThemeOptions = Object.assign(
    {
      colorVariables: []
    },
    opt
  )

  const { colorVariables } = options

  let config: ResolvedConfig
  let clientPath = ''
  let isServer = false

  return [
    injectClientPlugin({
      themePluginOptions: options
    }),
    {
      name: 'vite-theme',
      enforce: 'post',
      configResolved(resolveConfig) {
        config = resolveConfig
        clientPath = JSON.stringify(
          path.posix.join(config.base, CLIENT_PUBLIC_PATH)
        )
        isServer = config.command === 'serve'
        debug('clientPath', clientPath)
      },
      async transform(code, id) {
        if (!cssLangRE.test(id)) {
          return null
        }
        debug('id', id)
        debug('code', code)

        const clientCode = await getClientStyleString(code)
        debug('clientCode ', clientCode)

        const extractCssCodeTemplate = extractVariable(
          clientCode,
          colorVariables
        )
        if (!extractCssCodeTemplate) {
          return null
        }

        if (isServer) {
          const retCode = [
            `import { addCssToQueue } from ${clientPath}`,
            `const themeCssId = ${JSON.stringify(id)}`,
            `const themeCssStr = ${JSON.stringify(
              formatCss(extractCssCodeTemplate)
            )}`,
            `addCssToQueue(themeCssId, themeCssStr)`,
            code
          ]

          return {
            map: null,
            code: retCode.join('\n')
          }
        }
      }
    }
  ]
}

async function getClientStyleString(code: string) {
  if (!code.includes(VITE_CLIENT_ENTRY)) {
    return code
  }
  code = code.replace(/\\n/g, '')

  const cssPrefix = cssVariableString
  const cssPrefixLen = cssPrefix.length

  const cssPrefixIndex = code.indexOf(cssPrefix)
  const len = cssPrefixIndex + cssPrefixLen
  const cssLastIndex = code.indexOf('\n', len + 1)

  if (cssPrefixIndex !== -1) {
    code = code.slice(len, cssLastIndex)
  }
  return code
}

export default Theme
