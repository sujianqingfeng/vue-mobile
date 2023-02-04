<script setup lang="ts">
import { creteGesture } from './gesture'
import { createAnimation } from './animation'
const mainRef = ref()
const bottomRef = ref()
const mainTop = ref(0)
const isMainView = ref(true)

const windowHeight = window.innerHeight

const statusHeight = 30
const navBarHeight = 50
const mainViewHeight = windowHeight - statusHeight

// 移动阈值
const moveThreshold = 50
// 切换阈值
const toggleThreshold = 200

const canMoveHeight = mainViewHeight - navBarHeight

const mainNavBarOpacity = ref(1)
watch(mainTop, (value) => {
  const threshold = canMoveHeight - toggleThreshold
  if (value > threshold) {
    const opacity = 1 - (value - threshold) / toggleThreshold / 2 - 0.2
    mainNavBarOpacity.value = opacity
  }
})

let startTouchEvent: TouchEvent | null = null

const getPoints = (startTouchEvent: TouchEvent, endTouchEvent: TouchEvent) => {
  const { touches: startTouches } = startTouchEvent
  const { pageX: startX, pageY: startY } = startTouches[0]

  const { touches: endTouches } = endTouchEvent
  const { pageX: endX, pageY: endY } = endTouches[0]

  return [startX, startY, endX, endY]
}

const mainTouchStart = (e: TouchEvent) => {
  startTouchEvent = e
}

const mainTouchMove = (e: TouchEvent) => {
  const [startX, startY, endX, endY] = getPoints(startTouchEvent!, e)
  const gesture = creteGesture(startX, startY, endX, endY)
  const { isOk, offsetY } = gesture.isFromTopToBottom()

  if (!isOk) {
    return
  }
  console.log('下拉', offsetY)

  if (offsetY < moveThreshold) {
    return
  }

  mainTop.value = offsetY - moveThreshold
}

const { startAnimation } = createAnimation()

const mainAnimationValueChange = (value: number) => {
  mainTop.value = value
}

const mainTouchEnd = () => {
  if (mainTop.value < toggleThreshold) {
    // 恢复原位
    console.log('恢复原位', mainTop.value)

    startAnimation({
      startValue: mainTop.value,
      targetValue: 0,
      valueChange: mainAnimationValueChange
    })
    return
  }

  // 切换
  console.log('切换')

  isMainView.value = false
  startAnimation({
    startValue: mainTop.value,
    targetValue: canMoveHeight,
    valueChange: mainAnimationValueChange
  })
}

const bottomTouchStart = (e: TouchEvent) => {
  startTouchEvent = e
}

const bottomTouchMove = (e: TouchEvent) => {
  const [startX, startY, endX, endY] = getPoints(startTouchEvent!, e)
  const gesture = creteGesture(startX, startY, endX, endY)
  const { isOk, offsetY } = gesture.isFromBottomToTop()

  if (!isOk) {
    return
  }
  console.log('上拉', offsetY)

  if (offsetY < moveThreshold) {
    return
  }

  const offset = offsetY - moveThreshold
  mainTop.value = canMoveHeight - offset
}

const bottomTouchEnd = () => {
  if (canMoveHeight - mainTop.value < toggleThreshold) {
    // 恢复原位
    console.log('恢复原位', mainTop.value)

    startAnimation({
      startValue: mainTop.value,
      targetValue: canMoveHeight,
      valueChange: mainAnimationValueChange
    })
    return
  }

  // 切换
  console.log('切换', mainTop.value)

  isMainView.value = true
  startAnimation({
    startValue: mainTop.value,
    targetValue: 0,
    valueChange: mainAnimationValueChange
  })
}

onMounted(() => {
  mainRef.value.addEventListener('touchstart', mainTouchStart)
  mainRef.value.addEventListener('touchmove', mainTouchMove)
  mainRef.value.addEventListener('touchend', mainTouchEnd)

  bottomRef.value.addEventListener('touchstart', bottomTouchStart)
  bottomRef.value.addEventListener('touchmove', bottomTouchMove)
  bottomRef.value.addEventListener('touchend', bottomTouchEnd)
})
</script>

<template>
  <div class="wx-down-pull bg-gray">
    <div class="status-bar">status-bar</div>

    <div class="main-view-box">
      <div ref="bottomRef" class="bottom-view">
        bottom view

        <div class="bottom-nav-bar">bottom nav bar</div>
      </div>

      <div ref="mainRef" class="main-view bg-blue">
        <div class="nav-bar border">nav-bar</div>
        <div class="main">main content</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wx-down-pull {
  height: 100vh;
  overflow: hidden;

  .status-bar {
    height: v-bind('statusHeight + "px"');
  }
  .main-view-box {
    position: relative;

    .bottom-view {
      position: absolute;
      width: 100%;
      height: v-bind('mainViewHeight + "px"');

      .bottom-nav-bar {
        height: v-bind('navBarHeight+ "px"');
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
    .main-view {
      position: absolute;
      top: v-bind('mainTop + "px"');
      width: 100%;
      height: v-bind('mainViewHeight + "px"');
      .nav-bar {
        height: v-bind('navBarHeight+ "px"');
        opacity: v-bind('mainNavBarOpacity');
      }
    }
  }
}
</style>
