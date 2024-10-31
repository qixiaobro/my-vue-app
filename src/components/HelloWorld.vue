<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
const installPWA = () => {
  navigator.serviceWorker.register('/sw.js')
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>

  <!--在网页模式时，显示安装pwa应用按钮-->
  <button @click="installPWA">安装PWA应用</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
