import path from 'path'
import { normalizePath } from 'vite'

// const cssLangs = `\\.(css|less|sass|scss|styl|stylus|postcss)($|\\?)`
const cssLangs = `\\.(scss)($|\\?)`

export const VITE_CLIENT_ENTRY = '/@vite/client'
// vite3  css-> __vite__css
export const cssVariableString = `__vite__css = "`

export const cssLangRE = new RegExp(cssLangs)

export const cssBlockRE = /[^}]*\{[^{]*\}/g

export const ruleRE = /(\w+-)*\w+:/
export const cssValueRE = /(\s?[a-z0-9]+\s)*/
export const safeEmptyRE = /\s?/
export const importSafeRE = /(\s*!important)?/

export const VITE_PLUGIN_THEME_CLIENT_ENTRY = normalizePath(
  path.resolve(process.cwd(), 'plugins/theme/client')
)

export const CLIENT_PUBLIC_PATH = `/${VITE_PLUGIN_THEME_CLIENT_ENTRY}/client.ts`
