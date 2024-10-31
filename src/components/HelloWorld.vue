<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)

const deferredPrompt = ref(null)
const showInstallButton = ref(false)

async function installPWA() {
  // 确保有可用的安装提示
  if (!deferredPrompt.value) return

  try {
    // 显示安装提示
    await deferredPrompt.value.prompt()

    // 等待用户选择
    const choiceResult = await deferredPrompt.value.userChoice

    if (choiceResult.outcome === 'accepted') {
      console.log('用户已安装应用')
    } else {
      console.log('用户拒绝安装')
    }

    // 重置安装提示
    deferredPrompt.value = null
    showInstallButton.value = false
  } catch (error) {
    console.error('安装失败:', error)
  }
}

onMounted(() => {
  // 监听安装提示事件
  window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止默认行为
    e.preventDefault()
    alert('beforeinstallprompt')

    // 保存事件用于后续触发
    deferredPrompt.value = e

    // 显示安装按钮
    showInstallButton.value = true
  })

  // 监听应用安装完成事件  
  window.addEventListener('appinstalled', () => {
    showInstallButton.value = false
    deferredPrompt.value = null

    // 可以在这里添加安装成功的通知
    console.log('应用已成功安装')
  })
})
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>

  <!--在网页模式时，显示安装pwa应用按钮-->
  <button v-if="showInstallButton" @click="installPWA" class="install-btn">
    安装应用
  </button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
