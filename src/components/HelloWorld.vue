<script setup lang="ts">
defineProps<{ msg: string }>()
</script>

<template>
  <div bg-blue inline w-11px>
    {{ msg }}
  </div>

  <div bg-fuchsia inline>
    {{ msg }}
  </div>
</template>

<style scoped>
.container {
  display: inline-block;
}
</style>
