function isColor(color: string) {
  return /^#[0-9A-F]{6}$/i.test(color)
}

function colorComputed(start: number, end: number, rate: number) {
  const distance = Math.abs(end - start)
  if (end > start) {
    return ~~Math.min(start + rate * distance, end)
  } else {
    return ~~Math.max(start - rate * distance, end)
  }
}

export function transition(start: string, end: string, rate: number) {
  if (!isColor(start) || !isColor(end)) {
    throw new Error('color is not valid')
  }

  const startR = parseInt(start.slice(1, 3), 16)
  const startG = parseInt(start.slice(3, 5), 16)
  const startB = parseInt(start.slice(5, 7), 16)

  const endR = parseInt(end.slice(1, 3), 16)
  const endG = parseInt(end.slice(3, 5), 16)
  const endB = parseInt(end.slice(5, 7), 16)

  const r = colorComputed(startR, endR, rate)
  const g = colorComputed(startG, endG, rate)
  const b = colorComputed(startB, endB, rate)

  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
}
