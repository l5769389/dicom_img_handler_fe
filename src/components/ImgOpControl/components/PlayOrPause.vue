<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue'
import { PlayCircle, PauseCircle, Stop } from '@vicons/fa'
import { Previous16Regular, Next16Regular } from '@vicons/fluent'
import { useOpStore } from '@/stores/activeOpViewType'
import { MyWebsocket } from '@/MyWebsocket'
import type { opMsgType, windowType } from '@/types'
import { ip, websocket_port } from '@/config'

const store = useOpStore()
const activeLabel = computed(() => store.activeOpRef)
const activeView = computed(() => store.activeViewTypeRef)
const ws = inject('ws') as MyWebsocket

const handleOpen = () => {
  store.setActiveOp({
    type: 'play',
    subType: 'play'
  })
}
const handleClose = () => {
  store.setActiveOp({
    type: '',
    subType: ''
  })
}

watch(
  () => activeLabel.value.subType,
  async (newVal, oldValue) => {
    if (newVal === 'play') {
      if (activeView.value !== '') {
        const msg: opMsgType = {
          type: activeView.value,
          opType: newVal,
          interval: 200
        }
        ws.sendMsg(msg)
      }
    } else  {
      await fetch(`http://${ip}:8000/pause`)
    }
  }
)

const handleToggle = () => {
  if (activeLabel.value.subType === 'play') {
    store.setActiveOp({
      type: 'play',
      subType: 'pause'
    })
  } else {
    store.setActiveOp({
      type: 'play',
      subType: 'play'
    })
  }
}
</script>

<template>
  <n-button
    class="!w-[60px] flex justify-center items-center"
    v-if="activeLabel.type !== 'play'"
    @click="handleOpen"
  >
    <n-icon :component="PlayCircle" size="25"></n-icon>
  </n-button>

  <template v-else>
    <div class="ml-[8px] mr-[8px] h-full">
      <n-button class="!w-[60px]">
        <n-icon :component="Previous16Regular" size="25"></n-icon>
      </n-button>

      <n-button
        v-if="activeLabel.subType === 'play'"
        type="success"
        class="!w-[60px] border-primaryColor bg-primaryColor"
        @click="handleToggle"
      >
        <n-icon :component="PauseCircle" size="25"></n-icon>
      </n-button>
      <n-button v-else class="!w-[60px]" type="success" @click="handleToggle">
        <n-icon :component="PlayCircle" size="25"></n-icon>
      </n-button>

      <n-button class="!w-[60px]">
        <n-icon :component="Next16Regular" size="25"></n-icon>
      </n-button>

      <n-button class="!w-[60px]" @click="handleClose">
        <n-icon :component="Stop" size="25"></n-icon>
      </n-button>
    </div>
  </template>
</template>

<style scoped></style>