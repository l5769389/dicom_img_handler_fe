<script setup lang="ts">
import ImgHandlerWrapper from '@/components/ImgHandlerWrapper.vue'
import MultiView from '@/components/multiView/MultiView.vue'
import { inject, onMounted, ref, watch } from 'vue'
import type { MyWebsocket } from '@/MyWebsocket'
import type { loadImgMprType, loadImgType, mprAspectType } from '@/types'

/**
 * 得到三个视图的宽高数据
 * @param args
 */
const aspects = ref()
const getAspects = (args: any) => {
  aspects.value = args
}

const ws = inject('ws') as MyWebsocket

onMounted(() => {
  watchAspectChange()
})

const watchAspectChange = () => {
  watch(
    aspects,
    (newVal, oldValue) => {
      const msg: loadImgMprType = {
        type: 'mpr',
        opType: 'getImg',
        size: {
          sag: newVal.get('sag'),
          cor: newVal.get('cor'),
          ax: newVal.get('ax')
        }
      }
      getNew(msg)
    },
    {
      deep: true
    }
  )
}
const getNew = (msg: loadImgMprType) => {
  ws.sendMsg(msg)
}
</script>

<template>
  <img-handler-wrapper>
    <multi-view
      @get-aspects="getAspects"
    />
  </img-handler-wrapper>
</template>

<style scoped></style>