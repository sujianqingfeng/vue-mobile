export const useDrag = () => {
  let isInit = false
  let dragStartX = 0,
    dragStartY = 0,
    minLeft = 0,
    minTop = 0,
    maxLeft = 0,
    maxTop = 0,
    originalX = 0,
    originalY = 0

  const dragRef = ref<HTMLElement>()
  const x = ref(0)
  const y = ref(0)

  watch([x, y], ([x, y]) => {
    // console.log('watch', x, y)
    changeStyle('position', 'relative')
    changeStyle('left', `${x}px`)
    changeStyle('top', `${y}px`)
  })

  const changeStyle = (
    key: Exclude<keyof CSSStyleDeclaration, 'length' | 'parentRule'>,
    value: any
  ) => {
    dragRef.value!.style[key] = value
  }

  const getOriginal = (key: 'left' | 'top') => {
    const val = dragRef.value!.style[key]

    if (val) {
      return +val.toString().replace(/px/g, '')
    }
    return 0
  }

  const onMouseDown = (e: MouseEvent) => {
    // console.log('mouseDown')
    dragStartX = e.clientX
    dragStartY = e.clientY

    originalX = getOriginal('left')
    originalY = getOriginal('top')

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  // throttle
  const onMouseMove = (e: MouseEvent) => {
    // console.log('move')
    const left = originalX + e.pageX - dragStartX
    const top = originalY + e.pageY - dragStartY

    x.value = left < minLeft ? minLeft : left > maxLeft ? maxLeft : left
    y.value = top < minTop ? minTop : top > maxTop ? maxTop : top
  }

  const onMouseUp = () => {
    disposeMoveAndUp()
  }

  onMounted(() => {
    const el = dragRef.value!
    if (!isInit) {
      minLeft = -el.offsetLeft
      minTop = -el.offsetTop
      maxLeft = document.body.clientWidth - el.offsetLeft - el.clientWidth
      maxTop = document.body.clientHeight - el.offsetTop - el.clientHeight
      isInit = true
    }
    el.addEventListener('mousedown', onMouseDown)
  })

  const disposeMoveAndUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  const disposeAll = () => {
    disposeMoveAndUp()
    dragRef.value?.removeEventListener('mousedown', onMouseDown)
  }

  onUnmounted(disposeAll)

  return {
    dragRef,
    x,
    y
  }
}
