<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'
import type { viewDescType, windowType } from '@/types'
import FourCornerItem from '@/components/singleView/fourCorner/FourCornerItem.vue'

interface propsType {
  viewType: windowType
}

const props = defineProps<propsType>()

const viewDesc = inject<Ref<viewDescType>>(
  'viewDescMap',
  ref({
    preview: new Map(),
    sag: new Map(),
    ax: new Map(),
    cor: new Map()
  })
)
const descInfo = computed(() => viewDesc.value[props.viewType])
</script>

<template>
  <div class="w-full h-full flex flex-col p-[5px]">
    <div class="flex justify-between flex-1">
      <four-corner-item
        class="flex-1"
        v-for="item in ['lt', 'tm', 'rt']"
        :key="item"
        :info="descInfo.get(item)"
      ></four-corner-item>
    </div>
    <div class="flex justify-between h-[30px]">
      <four-corner-item
        v-for="item in ['lm', 'rm']"
        :key="item"
        :info="descInfo.get(item)"
      ></four-corner-item>
    </div>
    <div class="flex justify-between flex-1 items-end">
      <four-corner-item
        v-for="item in ['lb', 'bm', 'rb']"
        :key="item"
        :info="descInfo.get(item)"
      ></four-corner-item>
    </div>
  </div>
</template>

<style scoped></style>