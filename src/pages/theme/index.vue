<script lang="ts" setup>
const colors = ref([
  {
    name: '1'
  }
])
</script>

<template>
  <div>theme</div>

  <div v-for="item in colors" :key="item.name">{{ item.name }}</div>
</template>
