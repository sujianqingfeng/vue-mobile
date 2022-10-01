import type { Plugin, ResolvedConfig } from 'vite'
import createDebug from 'debug'
import { cssLangRE, cssVariableString, VITE_CLIENT_ENTRY } from './constants'
import { extractVariable } from './utils'

const debug = createDebug('vite-theme')

function Theme(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vite-theme',
    enforce: 'post',
    configResolved(resolveConfig) {
      config = resolveConfig
    },
    async transform(code, id) {
      if (!cssLangRE.test(id)) {
        return null
      }
      debug('id', id)
      debug('code', code)

      const clientCode = await getClientStyleString(code)
      debug('clientCode ', clientCode)

      const extractCssCodeTemplate = extractVariable(clientCode)
      if (!extractCssCodeTemplate) {
        return null
      }
    }
  }
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
