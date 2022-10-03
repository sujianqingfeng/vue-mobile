import createDebug from 'debug'

const debug = createDebug('vite-theme')

export const globalField = '__VITE_THEME__'
export const styleTagId = '__VITE_PLUGIN_THEME_TAG_ID__'

interface Options {
  colorVariables: string[]
}

export interface GlobalConfig {
  styleIdMap?: Map<string, string>
  styleRenderQueueMap?: Map<string, string>
  colorVariables: string[]
  defaultOptions: Options
}

declare global {
  interface Window {
    [globalField]: GlobalConfig
  }
}

declare const __COLOR_PLUGIN_OPTIONS__: Options

const colorPluginOptions = __COLOR_PLUGIN_OPTIONS__

const debounceThemeRender = debounce(200, renderTheme)

// iife init
;(() => {
  console.log('init')

  if (!window[globalField]) {
    window[globalField] = {
      styleIdMap: new Map(),
      styleRenderQueueMap: new Map()
    } as any
  }

  if (!getGlobalOptions('defaultOptions')) {
    console.log('set defaultOptions', colorPluginOptions)

    setGlobalOptions('defaultOptions', colorPluginOptions)
  }
})()

function getGlobalOptions<T extends keyof GlobalConfig = any>(
  key: T
): GlobalConfig[T] {
  return window[globalField][key]
}

function setGlobalOptions<T extends keyof GlobalConfig = any>(
  key: T,
  value: GlobalConfig[T]
) {
  window[globalField][key] = value
}

export function addCssToQueue(id: string, styleString: string) {
  const styleIdMap = getGlobalOptions('styleIdMap')
  if (!styleIdMap!.has(id)) {
    window[globalField].styleRenderQueueMap!.set(id, styleString)
    debounceThemeRender()
  }
}

export function renderTheme() {
  console.log('renderTheme')

  const variables = getGlobalOptions('colorVariables')
  console.log('variables ', variables)

  if (!variables) {
    return
  }

  const styleRenderQueueMap = getGlobalOptions('styleRenderQueueMap')
  const styleDom = getStyleDom(styleTagId)

  let html = styleDom.innerHTML

  for (const [id, css] of styleRenderQueueMap!.entries()) {
    html += css
    window[globalField].styleRenderQueueMap?.delete(id)
    window[globalField].styleIdMap?.set(id, css)
  }

  replaceCssColors(html, variables)
}

function replaceCssColors(css: string, colors: string[]) {
  const retCss = css
  const defaultOptions = getGlobalOptions('defaultOptions')

  const colorVariables = defaultOptions
    ? defaultOptions.colorVariables || []
    : []

  debug('----------------------', colorVariables)
  console.log('001111111')

  colorVariables.forEach((color, index) => {})

  return retCss
}

export function getStyleDom(id: string) {
  let style = document.getElementById(id) as HTMLStyleElement

  if (!style) {
    style = document.createElement('style')
    style.setAttribute('id', id)
  }

  return style
}

function debounce(delay: number, fn: (...arg: any[]) => any) {
  let timer
  return function (...args) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ctx = this
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(ctx, args)
    }, delay)
  }
}
