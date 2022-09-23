<script lang="ts" setup>
import { Color } from '@/config/theme-color'

interface Props {
  isCheck: boolean
  theme: Color
}

withDefaults(defineProps<Props>(), {
  isCheck: false
})
</script>

<template>
  <div
    cursor-pointer
    p-20px
    m-20px
    border-rounded
    dark:c-light
    dark:bg-dark-100
    :class="[
      isCheck ? 'c-white' : 'c-' + theme.value,
      isCheck ? 'bg-' + theme.value : 'bg-white'
    ]"
  >
    {{ theme.name }}
  </div>
</template>
