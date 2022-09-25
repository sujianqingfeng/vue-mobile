<script lang="ts" setup>
const route = useRoute()

const title = computed(() => route.meta.title)

const router = useRouter()
const onBackClick = () => {
  router.go(-1)
}

const showLeftArrow = computed(() => {
  const current = route.matched[getLastIndex(route.matched)]
  if (current) {
    return current.path !== '/'
  }
  return false
})
</script>

<template>
  <header h-80px flex justify-between items-center bg-primary dark:bg-dark>
    <div flex-1>
      <div v-if="showLeftArrow" p-16px @click="onBackClick">
        <div class="i-carbon-arrow-left" c-light text-32px></div>
      </div>
    </div>
    <div flex-center c-white>
      {{ title }}
    </div>
    <div flex-1></div>
  </header>
</template>
