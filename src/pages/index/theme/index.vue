<script lang="ts" setup>
import colors, { Color } from '@/config/theme-color'
import ThemeItem from './components/ThemeItem.vue'

const { setThemeColor, isCheck } = useTheme()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const onColorClick = (item: Color) => {
  setThemeColor(item.value)
}

const onModeClick = () => {
  toggleDark()
}
</script>

<template>
  <div class="dark-switch" flex-center p-8>
    <div
      class="i-carbon-sun dark:i-carbon-moon"
      text-100px
      dark:c-light
      @click="onModeClick"
    ></div>
  </div>

  <theme-item
    v-for="item in colors"
    :key="item.name"
    :theme="item"
    :is-check="isCheck(item.value)"
    @click="onColorClick(item)"
  />
</template>
