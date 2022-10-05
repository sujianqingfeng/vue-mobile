import type { Plugin, ResolvedConfig } from 'vite'
import createDebug from 'debug'
import path from 'path'
import fs from 'fs-extra'
import colors from 'picocolors'
import {
  CLIENT_PUBLIC_PATH,
  cssLangRE,
  cssVariableString,
  VITE_CLIENT_ENTRY
} from './constants'

import { createFileHash, extractVariable, formatCss, minifyCss } from './utils'
import injectClientPlugin from './inject-client-plugin'

export interface ViteThemeOptions {
  colorVariables: string[]
  fileName?: string
}

const debug = createDebug('vite-theme')

function Theme(opt: ViteThemeOptions): Plugin[] {
  const options: ViteThemeOptions = Object.assign(
    {
      colorVariables: [],
      fileName: 'app-theme-style'
    },
    opt
  )

  const { colorVariables, fileName } = options

  let config: ResolvedConfig
  let clientPath = ''
  let isServer = false

  const styleMap = new Map<string, string>()
  const extCssSet = new Set<string>()

  return [
    injectClientPlugin({
      themePluginOptions: options
    }),
    {
      name: 'vite-theme',
      // build mode: post css is empty
      // enforce: 'post',
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

        const clientCode = isServer
          ? await getClientStyleString(code)
          : code.replace('export default', '').replace('"', '')

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
            // TODO
            map: null,
            code: retCode.join('\n')
          }
        } else {
          // build
          if (!styleMap.has(id)) {
            extCssSet.add(extractCssCodeTemplate)
          }
          styleMap.set(id, extractCssCodeTemplate)
        }
      },
      // rollup hook
      async writeBundle() {
        const {
          root,
          build: { outDir, assetsDir, minify },
          logger
        } = config

        let extCssString = ''
        for (const css of extCssSet) {
          extCssString += css
        }

        if (minify) {
          extCssString = await minifyCss(extCssString, config)
        }

        const cssOutputName = `${fileName}.${createFileHash(extCssString)}.css`

        const cssOutputPath = path.resolve(
          root,
          outDir,
          assetsDir,
          cssOutputName
        )
        fs.writeFileSync(cssOutputPath, extCssString)

        const cssLogOutputPath = path.resolve(outDir, assetsDir, cssOutputName)

        logger.info(
          colors.green(`[vite-theme] css output path: ${cssLogOutputPath}`)
        )
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
