interface AnimationOptions {
  duration?: number
}

type ValueChange = (value: number) => void

interface Animation {
  startValue: number
  targetValue: number
  valueChange: ValueChange
}

const createLinearInterpolator = (rate: number) => {
  const getValue = (startValue: number, targetValue: number) => {
    let distance = 0
    let isAdd = true
    if (targetValue > startValue) {
      distance = targetValue - startValue
      isAdd = true
    } else {
      distance = startValue - targetValue
      isAdd = false
    }
    const value = Math.min(rate * distance, distance)

    return isAdd ? startValue + value : startValue - value
  }

  return {
    getValue
  }
}

export const createAnimation = (options: AnimationOptions = {}) => {
  const { duration = 500 } = options
  let startTimestamp: number | null = null
  let previousTimeStamp = 0
  let startValue: number | null = null
  let targetValue: number | null = null
  let valueChange: ValueChange | null = null

  const step = (timestamp: number) => {
    if (startValue === null || targetValue === null || valueChange === null) {
      return
    }

    if (startTimestamp === null) {
      startTimestamp = timestamp
    }

    const elapsed = timestamp - startTimestamp
    // console.log('elapsed ', elapsed)

    // 匀速动画
    if (previousTimeStamp !== timestamp) {
      const rate = elapsed / duration
      const { getValue } = createLinearInterpolator(rate)
      const value = getValue(startValue, targetValue)
      valueChange(value)
    }

    if (elapsed < duration) {
      previousTimeStamp = timestamp
      requestAnimationFrame(step)
    }
  }

  const startAnimation = (animation: Animation) => {
    startTimestamp = null
    startValue = animation.startValue
    targetValue = animation.targetValue
    valueChange = animation.valueChange
    requestAnimationFrame(step)
  }

  return {
    startAnimation
  }
}
