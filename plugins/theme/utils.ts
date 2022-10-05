import createDebug from 'debug'
import { transform } from 'esbuild'
import type { TransformOptions } from 'esbuild'
import type { ResolvedConfig, ESBuildOptions } from 'vite'
import hashSum from 'hash-sum'

import {
  cssBlockRE,
  cssValueRE,
  importSafeRE,
  ruleRE,
  safeEmptyRE
} from './constants'

const debug = createDebug('vite-theme')

export function getVariablesReg(colors: string[]) {
  const regExps = colors
    .map(
      (i) =>
        `(${i
          .replace(/\s/g, ' ?')
          .replace(/\(/g, `\\(`)
          .replace(/\)/g, `\\)`)
          .replace(/0?\./g, `0?\\.`)})`
    )
    .join('|')
  return new RegExp(regExps)
}

export function combineRegExps(decorator = '', separator = '', ...args: any[]) {
  const regString = args
    .map((arg) => {
      const str = arg.toString()
      return `(${str.slice(1, str.length - 1)})`
    })
    .join(separator)

  return new RegExp(regString, decorator)
}

export function extractVariable(code: string, colorVariables: string[]) {
  const cssBlocks = code.match(cssBlockRE)

  debug('cssBlocks', cssBlocks)

  if (!cssBlocks || !cssBlocks.length) {
    return ''
  }

  const variableRegExps = getVariablesReg(colorVariables)
  debug('variableRegExps', variableRegExps)

  let allExtractedVariables = ''

  for (const cssBlock of cssBlocks) {
    if (!variableRegExps.test(cssBlock) || !cssBlock) {
      continue
    }
    debug('cssBlock', cssBlock)

    const cssSelector = cssBlock.match(/[^{]*/)?.[0] ?? ''
    debug('cssSelector', cssSelector)

    if (!cssSelector) {
      continue
    }

    const colorPrototypeReg = combineRegExps(
      'g',
      '',
      ruleRE,
      cssValueRE,
      safeEmptyRE,
      variableRegExps,
      importSafeRE
    )

    const colorReplaceTemplates = cssBlock.match(colorPrototypeReg)
    debug('colorReplaceTemplates', colorReplaceTemplates)

    if (!colorReplaceTemplates) {
      continue
    }

    const colorPrototypes = colorReplaceTemplates.join(';')
    allExtractedVariables += `${cssSelector}{${colorPrototypes}}`
  }

  debug('allExtractedVariables', allExtractedVariables)
  return allExtractedVariables
}

export function formatCss(s: string) {
  s = s.replace(/\s*([{}:;,])\s*/g, '$1')
  s = s.replace(/;\s*;/g, ';')
  s = s.replace(/,[\s.#\d]*{/g, '{')
  s = s.replace(/([^\s])\{([^\s])/g, '$1 {\n\t$2')
  s = s.replace(/([^\s])\}([^\n]*)/g, '$1\n}\n$2')
  s = s.replace(/([^\s]);([^\s}])/g, '$1;\n\t$2')
  return s
}

export async function minifyCss(css: string, config: ResolvedConfig) {
  try {
    // vite3 use esbuild to minify css
    const result = await transform(css, {
      loader: 'css',
      target: config.build.cssTarget || undefined,
      ...resolveEsbuildMinifyOptions(config.esbuild || {})
    })

    result.warnings?.forEach((warn) => {
      config.logger.warn(`vite-theme warnings when minifying css:\n${warn}`)
    })

    return result.code
  } catch (e) {
    if (e.errors) {
      e.message = `[vite-theme esbuild css minify] ${e.message}`
    }
    throw e
  }
}

function resolveEsbuildMinifyOptions(
  options: ESBuildOptions
): TransformOptions {
  const base: TransformOptions = {
    logLevel: options.logLevel,
    logLimit: options.logLimit,
    logOverride: options.logOverride
  }

  if (
    options.minifyIdentifiers != null ||
    options.minifySyntax != null ||
    options.minifyWhitespace != null
  ) {
    return {
      ...base,
      minifyIdentifiers: options.minifyIdentifiers ?? true,
      minifySyntax: options.minifySyntax ?? true,
      minifyWhitespace: options.minifyWhitespace ?? true
    }
  } else {
    return { ...base, minify: true }
  }
}

export function createFileHash(content: string) {
  return hashSum(content)
}
