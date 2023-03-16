<template>
  <div class="home-page">
    Home page
    <div></div>
    <van-button type="primary" @click="jumpTo">home</van-button>
    <HelloWorld msg="new"></HelloWorld>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue'

const router = useRouter();
console.log("[App.vue]", `Hello world from Electron ${process.versions.electron}!`)

const jumpTo = () => {
  console.log("----->jumpto");
  router.push("/discover")
}

onMounted(() => {
  console.log("----mounted");
});
</script>
<style scoped lang="scss">
.home-page {

}
</style>
