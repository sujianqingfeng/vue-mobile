<script setup lang="ts">
import { creteGesture } from './gesture'
import { createAnimation } from './animation'
import { transition } from './color-transition'

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

const navBarBgColor = ref('#e879f9')
watch(mainTop, (value) => {
  const threshold = canMoveHeight - toggleThreshold
  if (value > threshold) {
    const rate = (value - threshold) / toggleThreshold
    const bgColor = transition('#e879f9', '#818cf8', rate)

    navBarBgColor.value = bgColor
  }
})

const dotMinThreshold = 100
const dotMaxThreshold = 200
const dotNormalThreshold = 250
const dotMaxSize = 30
const dotNormalSize = 20
const dotGap = 30
const downPullOpacityThreshold = 300

const dotSize = ref(0)
const dotsDistance = ref(0)
const downPullOpacity = ref(1)
const bottomViewScale = ref(0.75)

const getDotRate = (value: number, end: number, start: number) => {
  const distance = end - start
  const offset = Math.min(value - start, distance)
  const rate = offset / distance
  return rate
}

watch(mainTop, (value) => {
  if (value === 0) {
    dotsDistance.value = 0
  }
  if (value > dotMinThreshold) {
    const rate = getDotRate(value, dotMaxThreshold, dotMinThreshold)
    const size = dotMaxSize * rate
    dotSize.value = size
  }

  if (value > dotMaxThreshold) {
    const rate = getDotRate(value, dotNormalThreshold, dotMaxThreshold)
    const size = dotMaxSize - rate * (dotMaxSize - dotNormalSize)
    dotSize.value = size

    const gap = dotGap * rate
    dotsDistance.value = gap
  }

  if (value > dotNormalThreshold) {
    const rate = getDotRate(value, downPullOpacityThreshold, dotMaxThreshold)
    const opacity = 1 - rate
    downPullOpacity.value = opacity

    const scaleRate = getDotRate(value, canMoveHeight, downPullOpacityThreshold)
    const scale = 0.75 + scaleRate * 0.25
    bottomViewScale.value = scale
  }
})

const showDownPull = computed(() => {
  return mainTop.value < downPullOpacityThreshold
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
  if (!isMainView.value) {
    bottomTouchStart(e)
    return
  }
  startTouchEvent = e
}

const mainTouchMove = (e: TouchEvent) => {
  if (!isMainView.value) {
    bottomTouchMove(e)
    return
  }
  const [startX, startY, endX, endY] = getPoints(startTouchEvent!, e)
  const gesture = creteGesture(startX, startY, endX, endY)
  const { isOk, offsetY } = gesture.isFromTopToBottom()

  if (!isOk) {
    return
  }

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
  if (!isMainView.value) {
    bottomTouchEnd()
    return
  }
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
      <div ref="bottomRef" class="bottom-view border">
        bottom view

        <div class="bottom-nav-bar">bottom nav bar</div>
        <div v-if="showDownPull" class="pull-loading">
          <div class="dot dot-left"></div>
          <div class="dot"></div>
          <div class="dot dot-right"></div>
        </div>
      </div>

      <div ref="mainRef" class="main-view">
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
      transform: v-bind('"scale("+bottomViewScale+")"');
      transform-origin: top;
      top: 0;

      .bottom-nav-bar {
        height: v-bind('navBarHeight+ "px"');
        position: absolute;
        bottom: 0;
        left: 0;
      }

      .pull-loading {
        height: v-bind('mainTop + "px"');
        opacity: v-bind('downPullOpacity');
        position: relative;
        .dot {
          width: v-bind('dotSize + "px"');
          height: v-bind('dotSize + "px"');
          border-radius: 100%;
          background-color: wheat;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .dot-left {
          left: v-bind('"calc(50% - "+dotsDistance+"px)"');
        }
        .dot-right {
          left: v-bind('"calc(50% + "+dotsDistance+"px)"');
        }
      }
    }
    .main-view {
      position: absolute;
      top: v-bind('mainTop + "px"');
      width: 100%;
      height: v-bind('mainViewHeight + "px"');
      background-color: #e879f9;
      .nav-bar {
        height: v-bind('navBarHeight+ "px"');
        background-color: v-bind('navBarBgColor');
      }
    }
  }
}
</style>
