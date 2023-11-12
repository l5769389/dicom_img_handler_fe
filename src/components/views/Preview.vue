<script setup lang="ts">
import { inject, onActivated, ref } from 'vue'
import type { Ref } from 'vue'
import SingleViewer from '@/components/singleView/SingleViewer.vue'
import ImgHandlerWrapper from '@/components/ImgHandlerWrapper.vue'
import type { aspectType } from '@/types'
import type { resizeViewType } from '@/types'
import { MyWebsocket } from '@/MyWebsocket'

const ws = inject('ws') as MyWebsocket

const aspect = ref<aspectType>({
  width: 0,
  height: 0
})
const imgSrc = inject<Ref<string>>('previewImg')
let count = 0
const getAspect = ({ width, height }: { width: number; height: number }) => {
  notifyResize(width, height)
  aspect.value = {
    width,
    height
  }
}

const notifyResize = (width: number, height: number) => {
  if (count === 0) {
    count++
    return
  }
  const msg: resizeViewType = {
    type: 'preview',
    opType: 'resize',
    size: {
      width,
      height
    }
  }
  ws.sendMsg(msg)
}

defineExpose({
  aspect
})
</script>

<template>
  <img-handler-wrapper>
    <single-viewer @getAspect="getAspect"
                   :img-src="imgSrc" :view-type="'preview'" />
  </img-handler-wrapper>
</template>

<style scoped></style>