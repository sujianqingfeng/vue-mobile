import createDebug from 'debug'

const debug = createDebug('vite-theme-plugin:client')

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
declare const __COLOR_PLUGIN_OUTPUT_FILE_NAME__: string
declare const __PROD__: boolean

const isProd = __PROD__
const colorPluginOutputFileName = __COLOR_PLUGIN_OUTPUT_FILE_NAME__
const colorPluginOptions = __COLOR_PLUGIN_OPTIONS__

const debounceThemeRender = debounce(200, renderTheme)

// iife init
;(() => {
  debug('init client')

  if (!window[globalField]) {
    window[globalField] = {
      styleIdMap: new Map(),
      styleRenderQueueMap: new Map()
    } as any
  }

  if (!getGlobalOptions('defaultOptions')) {
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
  const variables = getGlobalOptions('colorVariables')

  if (!variables) {
    return
  }

  const styleRenderQueueMap = getGlobalOptions('styleRenderQueueMap')
  const styleDom = getStyleDom(styleTagId)

  // let html = styleDom.innerHTML
  let html = ''

  for (const [id, css] of styleRenderQueueMap!.entries()) {
    html += css
    window[globalField].styleRenderQueueMap?.delete(id)
    window[globalField].styleIdMap?.set(id, css)
  }

  const processCss = replaceCssColors(html, variables)
  appendCssToDom(styleDom, processCss)
}

function appendCssToDom(styleDom: HTMLElement, cssText: string) {
  styleDom.innerHTML = cssText
  document.body.appendChild(styleDom)
}

function replaceCssColors(css: string, colors: string[]) {
  let retCss = css
  const defaultOptions = getGlobalOptions('defaultOptions')

  const colorVariables = defaultOptions
    ? defaultOptions.colorVariables || []
    : []

  colorVariables.forEach((color, index) => {
    const regStr = `${color
      .replace(/,/g, ',\\s*')
      .replace(/\s/g, '')
      .replace('(', `\\(`)
      .replace(')', `\\)`)}([\\da-f]{2})?(\\b|\\)|,|\\s)?` // 后面这个暂不知道干什么用的
    debug('regStr', regStr)

    const reg = new RegExp(regStr, 'ig')

    retCss = retCss.replace(reg, `${colors[index]}$1$2`).replace('$1$2', '')
  })

  debug('replaceCssColors', retCss)
  return retCss
}

export async function replaceStyleVariables({
  colorVariables
}: {
  colorVariables: string[]
}) {
  setGlobalOptions('colorVariables', colorVariables)

  const styleIdMap = getGlobalOptions('styleIdMap')
  const styleRenderQueueMap = getGlobalOptions('styleRenderQueueMap')

  if (isProd) {
    const cssText = await fetchCss(colorPluginOutputFileName)
    const styleDom = getStyleDom(styleTagId)
    const processCss = replaceCssColors(cssText, colorVariables)
    appendCssToDom(styleDom, processCss)
  } else {
    for (const [id, css] of styleIdMap!.entries()) {
      styleRenderQueueMap?.set(id, css)
    }
    renderTheme()
  }
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
  let timer: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

function fetchCss(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.responseText)
      } else {
        reject(xhr.statusText)
      }
    }

    const onReject = (e: ProgressEvent) => {
      reject(e)
    }

    xhr.onerror = onReject
    xhr.ontimeout = onReject

    xhr.open('GET', fileName, true)
    xhr.send()
  })
}
