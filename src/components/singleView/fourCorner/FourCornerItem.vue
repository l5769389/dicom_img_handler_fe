<script setup lang="ts">
type infoItemType = Map<string, string> | string

const props = defineProps({
  info: {
    type: Array<infoItemType>
  }
})
</script>

<template>
  <div>
    <div v-for="item in props.info" :key="item.toString()">
      <div v-if="typeof item === 'string'" class="desc flex justify-center">
        {{ item }}
      </div>
      <template v-else>
        <template v-for="(val, attr) in item" :key="attr.toString()">
          <div v-if="attr.toString() === ''">
            <div class="desc flex">{{ val }}</div>
          </div>
          <div v-else-if="attr.toString() === 'direction'">
            <div class="desc flex justify-center">{{ val }}</div>
          </div>
          <div v-else>
            <div class="desc justify-center">{{ attr }}: {{ val }}</div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.desc {
  @apply text-fourCornerColor;
}
</style>