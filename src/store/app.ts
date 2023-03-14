import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore('app', () => {
  const count = ref(0);
  const increate = () => {
    count.value++
  }
  return { count, increate }
})