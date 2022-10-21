import type { Ref } from 'vue'

export const useDrag = (dragRef: Ref<HTMLElement | undefined>) => {
  let isDrag = false
  let dragStartX = 0,
    dragStartY = 0,
    initLeft = 0,
    initTop = 0

  const changeStyle = (
    key: Exclude<keyof CSSStyleDeclaration, 'length' | 'parentRule'>,
    value: any
  ) => {
    dragRef.value!.style[key] = value
  }

  // TODO
  const getAttr = (key: keyof CSSStyleDeclaration) => {
    const val = dragRef.value!.style[key]
    console.log('getAttr', val)

    if (val) {
      return +val.toString().replace(/px/g, '')
    }
    return 0
  }

  const onMouseDown = (e: MouseEvent) => {
    console.log('mouseDown')
    isDrag = true
    dragStartX = e.pageX
    dragStartY = e.pageY
    initLeft = dragRef.value!.offsetLeft
    initTop = dragRef.value!.offsetTop
    console.log('pagex', e.pageX, 'clientX', e.clientX, 'offsetTop', initTop)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!isDrag) return
    console.log('move')

    const x = e.pageX - dragStartX
    const y = e.pageY - dragStartY
    console.log('x', x, 'y', y)

    console.log(dragRef.value?.style.left)
    console.log('----')
    const left = getAttr('left')
    const top = getAttr('top')

    changeStyle('position', 'relative')
    changeStyle('left', `${x}px`)
    changeStyle('top', `${y}px`)
  }

  const onMouseUp = () => {
    console.log('mouseUp')
    isDrag = false
  }

  onMounted(() => {
    console.log('mounted')
    dragRef.value!.addEventListener('mousedown', onMouseDown)
    dragRef.value!.addEventListener('mousemove', onMouseMove)
    dragRef.value!.addEventListener('mouseup', onMouseUp)
  })

  onUnmounted(() => {
    console.log('unmounted')
  })
}
