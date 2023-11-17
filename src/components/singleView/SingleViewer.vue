<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { windowType } from '@/types'
import DragButton from '@/components/singleView/DragButton.vue'
import { useHandlerTouchOrMouseOp } from '@/components/singleView/useHandlerTouchOrMouseOp'
import _ from 'lodash'
import FourCornerLayer from '@/components/singleView/fourCorner/FourCornerLayer.vue'

const props = defineProps({
  imgSrc: {
    type: String as PropType<string>
  },
  viewType: {
    type: String as PropType<windowType>,
    default: () => 'preview'
  },
  center: {
    type: Array,
    default: () => [100, 100]
  }
})

const imgSrc = computed(() => {
  return `data:image/jpeg;base64,${props.imgSrc}`
})

const viewerRef = ref()
const rect = ref()

const {
  handleMousedown,
  handleMousemove,
  handleMouseup,
  handleTouchStart,
  handleTouchEnd,
  handleTouchmove,
  handleClick
} = useHandlerTouchOrMouseOp(rect, props.viewType)

const notifyAspect = (width: number, height: number) => {
  const w = Math.round(width)
  const h = Math.round(height)
  if (w === 0 || h === 0) {
    return
  }
  emit('getAspect', {
    width,
    height
  })
}
let resizeObserver: ResizeObserver
const watchResize = () => {
  resizeObserver = new ResizeObserver(
    _.debounce((entries) => {
      const { width, height } = entries[0].contentRect
      rect.value = viewerRef.value.getBoundingClientRect()
      notifyAspect(width, height)
    }, 200)
  )
  // 绑定监听的dom
  resizeObserver.observe(viewerRef.value)
}

onMounted(() => {
  watchResize()
})
onBeforeUnmount(() => {
  resizeObserver.disconnect()
})

const emit = defineEmits(['getAspect'])
</script>

<template>
  <div
    @mousedown="handleMousedown"
    @mousemove="handleMousemove"
    @mouseup="handleMouseup"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchmove"
    @touchend="handleTouchEnd"
    @click="handleClick"
    class="w-full h-full relative touch-manipulation"
    ref="viewerRef"
  >
    <img
      v-if="imgSrc !== ''"
      draggable="false"
      :src="imgSrc"
      class="w-full h-full"
      @load="console.log('load')"
    />
    <drag-button v-if="center[0] !== 0 && center[1] !== 0" :viewType="viewType" :center="center" class="z-10"/>
    <four-corner-layer class="absolute left-0 top-0" :viewType="props.viewType" />
  </div>
</template>

<style scoped></style>