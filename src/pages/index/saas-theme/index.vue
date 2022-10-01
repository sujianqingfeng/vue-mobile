<route>
{
  name: "saas-theme",
  meta: {
    title:'Saas-Theme'
  }
}
</route>

<script lang="ts" setup>
const onChangeTheme = async () => {
  console.log('---theme')
}
</script>

<template>
  <div class="saas-theme-container">
    <div class="bg-color">
      <p class="text">Test</p>
    </div>

    <button @click="onChangeTheme">change theme</button>
  </div>
</template>

<style lang="scss" scoped>
.saas-theme-container {
  .bg-color {
    background-color: #eea2a4;
    padding: 20px;
    .text {
      font-size: 20px;
      color: coral;
    }
  }
}
</style>
