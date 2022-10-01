import createDebug from 'debug'
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

export function extractVariable(code: string) {
  const colorVariables = ['#eea2a4']

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
