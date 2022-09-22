<script lang="ts" setup>
import colors, { Color } from '@/config/theme-color'

let activeColor = $ref('#a8456b')

const isCheck = (item: Color) => activeColor === item.value
const onColorClick = (item: Color) => {
  activeColor = item.value
}
</script>

<template>
  <div dark:color-blue>{{ activeColor }}</div>
  <div class="i-carbon-sun dark:i-carbon-moon"></div>

  <div
    v-for="item in colors"
    :key="item.name"
    p-20px
    m-20px
    border-rounded
    :class="[
      isCheck(item) ? 'c-white' : 'c-' + item.value,
      isCheck(item) ? 'bg-' + item.value : 'bg-white'
    ]"
    @click="onColorClick(item)"
  >
    {{ item.name }}
  </div>
</template>
