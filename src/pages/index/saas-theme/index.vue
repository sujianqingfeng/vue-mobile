<route>
{
  name: "saas-theme",
  meta: {
    title:'Saas-Theme'
  }
}
</route>

<script lang="ts" setup>
import { replaceStyleVariables } from '../../../../plugins/theme/client/client'
const onChangeTheme = async () => {
  replaceStyleVariables({
    colorVariables: ['#5cb3cc', '#584717']
  })
}
</script>

<template>
  <div class="saas-theme-container">
    <div class="bg-color">
      <p class="text">Test</p>
    </div>

    <div class="btn-container">
      <button class="btn" @click="onChangeTheme">Change Theme</button>
    </div>
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

  .btn-container {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
