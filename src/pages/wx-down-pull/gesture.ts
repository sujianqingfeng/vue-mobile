export function creteGesture(
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const dx = endX - startX
  const dy = endY - startY

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI

  const isFromTopToBottom = () => {
    const isOk = angle >= 45 && angle < 135
    const offsetY = Math.abs(startY - endY)
    return {
      isOk,
      offsetY
    }
  }

  const isFromBottomToTop = () => {
    const isOk = angle >= -135 && angle < -45
    const offsetY = Math.abs(startY - endY)
    return {
      isOk,
      offsetY
    }
  }

  const isFromLeftToRight = () => {
    const isOk =
      (angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)
    const offsetX = Math.abs(startX - endX)
    return {
      isOk,
      offsetX
    }
  }

  const isFromRightToLeft = () => {
    const isOk = angle >= -45 && angle < 45
    const offsetX = Math.abs(startX - endX)
    return {
      isOk,
      offsetX
    }
  }

  return {
    isFromBottomToTop,
    isFromTopToBottom,
    isFromLeftToRight,
    isFromRightToLeft
  }
}
