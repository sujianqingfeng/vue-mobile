<script lang="ts" setup>
import colors from '@/config/theme-color'
</script>

<template>
  <div dark:color-blue>theme</div>
  <div class="i-carbon-sun dark:i-carbon-moon"></div>

  <div
    v-for="item in colors"
    :key="item.name"
    :style="{ backgroundColor: item.value }"
    c-white
    p-20px
    m-20px
  >
    {{ item.name }}
  </div>
</template>
