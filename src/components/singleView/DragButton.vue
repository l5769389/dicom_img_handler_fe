<script setup lang="ts">
import type { PropType } from 'vue'
import { inject, ref } from 'vue'
import { MyWebsocket } from '@/MyWebsocket'
import type { windowType } from '@/types'
import _ from 'lodash'

const ws = inject('ws') as MyWebsocket
const props = defineProps({
  center: {
    type: Array,
    default: () => [0, 0]
  },
  viewType: {
    type: String as PropType<windowType>,
    default: () => 'preview'
  }
})

const getStyle = () => {
  const left = props.center[0]
  const top = props.center[1]
  return {
    left: `${left}px`,
    top: `${top}px`
  }
}
const isMousedown = ref(false)
const handleMousedown = () => {
  console.log('drag button down')
  isMousedown.value = true
  document.addEventListener('mousemove', handleMousemove)
  document.addEventListener('touchmove', handleMousemove)

  document.addEventListener('mouseup', handleMouseup)
  document.addEventListener('touchend', handleMouseup)
  document.addEventListener('touchcancel', handleMouseup)
}

const handleMouseup = () => {
  console.log('取消移动drag but')
  isMousedown.value = false
  reset()
  document.removeEventListener('touchmove', handleMousemove)
  document.removeEventListener('mousemove', handleMousemove)
  document.removeEventListener('mouseup', handleMouseup)
}
let preMoveStartPosition = {
  x: 0,
  y: 0,
  isRecord: false
}
const recordPreState = (x: number, y: number) => {
  preMoveStartPosition.x = x
  preMoveStartPosition.y = y
}

const reset = () => {
  preMoveStartPosition = {
    x: 0,
    y: 0,
    isRecord: false
  }
}

const handleMousemove = _.throttle((e: MouseEvent | TouchEvent) => {
  update(e)
}, 20)

const update = (e: MouseEvent | TouchEvent) => {
  const { x, y } = getPosition(e)
  if (!preMoveStartPosition.isRecord) {
    preMoveStartPosition.x = x
    preMoveStartPosition.y = y
    preMoveStartPosition.isRecord = true
  }
  const currentPosition = {
    x,
    y
  }
  const offset_x = currentPosition.x - preMoveStartPosition.x
  const offset_y = currentPosition.y - preMoveStartPosition.y
  recordPreState(currentPosition.x, currentPosition.y)
  const msg = {
    type: props.viewType,
    opType: 'move_scroll',
    x: offset_x,
    y: offset_y
  }
  ws.sendMsg(msg)
}

const getPosition = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    return {
      x: Math.round(e.clientX),
      y: Math.round(e.clientY)
    }
  } else {
    return {
      x: Math.round(e.targetTouches[0].clientX),
      y: Math.round(e.targetTouches[0].clientY)
    }
  }
}

const btnRef = ref()
</script>

<template>
  <div
    class="w-[20px] h-[20px] absolute hover:cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
    :style="getStyle()"
    ref="btnRef"
    @mousedown.stop="handleMousedown"
    @touchstart.stop="handleMousedown"
  ></div>
</template>

<style scoped></style>