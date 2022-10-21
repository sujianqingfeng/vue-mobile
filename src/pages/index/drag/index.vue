<script lang="ts" setup>
const dragRef = ref<HTMLElement>()
useDrag(dragRef)
</script>

<template>
  <div ref="dragRef" bg-blue w-20 h-20 flex-center inline-block>drag</div>
</template>
