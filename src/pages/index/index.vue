<route>
{
  name: "home",
  meta: {
    title:'Home'
  }
}
</route>

<script lang="ts" setup>
interface Page {
  name: string
  path: string
}

const pages: Page[] = [
  {
    name: 'Theme',
    path: '/theme'
  },
  {
    name: 'Saas-Theme',
    path: '/saas-theme'
  },
  {
    name: 'Drag',
    path: '/drag'
  }
]

const router = useRouter()
const onPageClick = (page: Page) => {
  const { path } = page
  router.push({ path })
}
</script>

<template>
  <div
    v-for="item in pages"
    :key="item.path"
    border-rounded
    flex-center
    text-30px
    m-16px
    p-16px
    bg-white
    c-dark
    dark:bg-dark-100
    dark:c-light
    cursor-pointer
    @click="onPageClick(item)"
  >
    {{ item.name }}
  </div>
</template>
