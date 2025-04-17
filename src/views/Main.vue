<script setup lang="ts">
import MprView from '@/components/views/MprView.vue'
import Preview from '@/components/views/Preview.vue'
import ThreeDView from '@/components/views/ThreeDView.vue'

import { MyWebsocket } from '@/MyWebsocket'
import { provide, ref, watch } from 'vue'
import type { mprImgProvideType, msgReceivedType, viewDescType } from '@/types'
import { useOpStore } from '@/stores/activeOpViewType'

const previewImgRef = ref('')
const mprImgRef = ref<mprImgProvideType>({
  sag: '',
  cor: '',
  ax: ''
})

const viewDescMap = ref<viewDescType>({
  preview: {},
  sag: {},
  cor: {},
  ax: {}
})

const mprImgCenterRef = ref({
  sag: [0, 0],
  cor: [0, 0],
  ax: [100, 100]
})

const activeTabName = ref('preview')

const { setActiveViewType } = useOpStore()

watch(
  activeTabName,
  (newVal, oldValue) => {
    if (newVal === 'preview') {
      setActiveViewType('preview')
    } else {
      setActiveViewType('ax')
    }
  },
  {
    immediate: true
  }
)

provide('previewImg', previewImgRef)
provide('mprImg', mprImgRef)
provide('mprImgCenter', mprImgCenterRef)
provide('activeTab', activeTabName)
provide('viewDescMap', viewDescMap)

const handleMsg: (msg: any) => void = (msg) => {
  const { type, imgs, center, desc }: msgReceivedType = JSON.parse(msg)
  if (type === 'preview') {
    previewImgRef.value = imgs as string
    if (typeof imgs === 'string') {
      console.log(`收到图片,大小为${imgs.length}`)
    }
    viewDescMap.value['preview'] = desc
  } else if (type === 'mpr') {
    mprImgRef.value = imgs as mprImgProvideType
    console.log(
      `mpr 大小为：${(imgs as mprImgProvideType).sag.length}, ${
        (imgs as mprImgProvideType).cor.length
      }, ${(imgs as mprImgProvideType).ax.length}`
    )
    viewDescMap.value['ax'] = desc['ax']
    viewDescMap.value['sag'] = desc['sag']
    viewDescMap.value['cor'] = desc['cor']
  } else {
    console.log('single mpr')
    viewDescMap.value[type] = desc
    mprImgRef.value[type] = imgs as string
  }
  if (center) {
    mprImgCenterRef.value = center
  }
}

const ws = new MyWebsocket(handleMsg)
provide('ws', ws)
const handleStart = () => {
  ws.testSend(previewRef.value.aspect)
}
const previewRef = ref()
</script>

<template>
  <n-tabs type="card" animated placement="left" v-model:value="activeTabName">
    <n-tab-pane tab="preview" name="preview" display-directive="show:lazy">
      <preview ref="previewRef" />
    </n-tab-pane>

    <n-tab-pane tab="mpr" name="mpr" display-directive="show:lazy">
      <mpr-view />
    </n-tab-pane>

    <n-tab-pane tab="threed" name="threed" display-directive="show:lazy">
      <three-d-view />
    </n-tab-pane>
  </n-tabs>
  <n-button @click="handleStart">开始</n-button>
</template>

<style scoped>
::v-deep(.n-tab-pane) {
  padding-left: 0px !important;
}

::v-deep(.n-tabs-wrapper) {
  padding-top: 50px;
}
</style>