<script setup lang="ts">

import ImgOpControl from "@/components/ImgOpControl/ImgOpControl.vue";
</script>

<template>
  <div class="w-full h-[650px] flex flex-col">
      <div class="h-[34px] flex items-center">
        <img-op-control/>
      </div>
      <div class="flex-1 border overflow-hidden">
        <slot/>
      </div>
  </div>
</template>

<style scoped>

</style>