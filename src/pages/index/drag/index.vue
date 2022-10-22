<route>
{
  name: "drag",
  meta: {
    title:'drag'
  }
}
</route>

<script lang="ts" setup>
const { x, y, dragRef } = useDrag()
</script>

<template>
  <div ref="dragRef" bg-blue w-40 h-40 flex-center inline-block>
    drag
    <p>x：{{ x }}</p>
    <p>y：{{ y }}</p>
  </div>
</template>
