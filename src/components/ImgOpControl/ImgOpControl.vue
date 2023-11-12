<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, ref, h, markRaw } from 'vue'
import { useOpStore } from '@/stores/activeOpViewType'
import type { activeTabType, opMsgType, resetViewType, windowType } from '@/types'
import { MyWebsocket } from '@/MyWebsocket'
import PlayOrPause from '@/components/ImgOpControl/components/PlayOrPause.vue'
import DropDownBtn from '@/components/ImgOpControl/components/DropDownBtn.vue'
import { EllipseOutline } from '@vicons/ionicons5'
import { HandMove, Contrast, Angle, ZoomIn, FlipHorizontal, Trash, TrashX } from '@vicons/tabler'
import {
  ChevronUpDown16Filled,
  RectangleLandscape12Regular,
  FlipHorizontal16Filled,
} from '@vicons/fluent'
import {
  RotateCounterclockwise,
  RotateClockwise,
  Reset,
  Export
} from '@vicons/carbon'
import { PlayCircle, Ruler } from '@vicons/fa'
import { NIcon } from 'naive-ui'
import type {
  dropDownOptionItem,
  dropDownPropType,
  opBtnType
} from '@/components/ImgOpControl/types/types'

const ws = inject('ws') as MyWebsocket
const fontSize = '25px'
const opArr = ref<(opBtnType | dropDownPropType)[]>([
  {
    type: 'button',
    label: 'window',
    icon: markRaw(Contrast)
  },
  {
    type: 'button',
    label: 'pan',
    icon: markRaw(HandMove)
  },
  {
    type: 'button',
    label: 'scroll',
    icon: markRaw(ChevronUpDown16Filled)
  },
  {
    type: 'button',
    label: 'zoom',
    icon: markRaw(ZoomIn)
  },
  {
    // item
    type: 'playOrPause',
    label: 'play',
    icon: markRaw(PlayCircle)
  },
  {
    type: 'dropdown',
    label: 'measure',
    icon: markRaw(Ruler),
    default_icon: markRaw(Ruler),
    value: 'line',
    options: [
      {
        label: 'line',
        value: 'line',
        icon: markRaw(Ruler),
        style: {
          fontSize: fontSize
        }
      },
      {
        label: 'angle',
        value: 'angle',
        icon: markRaw(Angle),
        style: {
          fontSize: fontSize
        }
      },
      {
        label: 'ellipse',
        value: 'ellipse',
        icon: markRaw(EllipseOutline),
        style: {
          fontSize: fontSize
        }
      },
      {
        label: 'rectangle',
        value: 'rectangle',
        icon: markRaw(RectangleLandscape12Regular),
        style: {
          fontSize: fontSize
        }
      }
    ]
  },
  {
    type: 'dropdown',
    label: 'rotate',
    icon: markRaw(FlipHorizontal16Filled),
    default_icon: markRaw(FlipHorizontal16Filled),
    value: 'hor flip',
    options: [
      {
        label: 'hor flip',
        value: 'hor flip',
        icon: markRaw(FlipHorizontal16Filled),
        style: {
          fontSize: fontSize
        }
      },
      {
        label: 'ver flip',
        value: 'ver flip',
        icon: markRaw(FlipHorizontal),
        style: {
          fontSize: fontSize
        }
      },
      {
        label: 'counterClockwise90',
        value: 'counterClockwise90',
        icon: markRaw(RotateCounterclockwise),
        style: {
          fontSize: fontSize
        }
      },
      {
        label: 'clockwise90',
        value: 'clockwise90',
        icon: markRaw(RotateClockwise),
        style: {
          fontSize: fontSize
        }
      }
    ]
  },
  {
    type: 'dropdown',
    label: 'pseudo',
    icon: '',
    default_icon: '',
    value: 'bw',
    options: [
      {
        label: 'bw',
        value: 'BW',
        icon: '',
        style: {
          fontSize: '14px',
          padding: '0px 0px 0px 3px'
        }
      },
      {
        label: 'rainbow',
        value: 'rainbow',
        icon: '',
        style: {
          fontSize: '14px',
          padding: '0px 0px 0px 3px',
          width: '200px'
        }
      }
    ]
  },
  {
    type: 'dropdown',
    label: 'export',
    icon: markRaw(Export),
    default_icon: markRaw(Export),
    value: 'export',
    options: [
      {
        label: 'export',
        icon: markRaw(Export),
        value: 'export',
        style: {
          fontSize: fontSize
        }
      }
    ]
  }
])

const activeMode = inject<Ref<activeTabType>>('activeTab')
const store = useOpStore()

const activeLabel = computed(() => store.activeOpRef)

const allFuncAble = computed(() => store.isPlayingStatus)

const activeViewTypeRef = computed(() => store.activeViewTypeRef)

const handleOp = (item: opBtnType) => {
  store.setActiveOp({
    type: item.label,
    subType: item.label
  })
}

const handleClearLine = () => {
  const msg: opMsgType = {
    type: activeViewTypeRef.value as windowType,
    opType: 'clearLine'
  }
  ws.sendMsg(msg)
}

const handleClearAllLine = () => {
  const msg: opMsgType = {
    type: activeViewTypeRef.value as windowType,
    opType: 'clearAllLine'
  }
  ws.sendMsg(msg)
}

const handleClearAllRotate = () => {
  const msg: opMsgType = {
    type: activeViewTypeRef.value as windowType,
    opType: 'clearAllRotate'
  }
  ws.sendMsg(msg)
}

const reset = () => {
  const msg: resetViewType = {
    type: activeMode!.value,
    opType: 'reset'
  }
  ws.sendMsg(msg)
}

const handleSelect = ({ type, option }: { type: string; option: dropDownOptionItem }) => {
  const index = opArr.value.findIndex((item) => item.label == type)
  const opType = opArr.value[index] as dropDownPropType
  opType.value = option.label
  opType.icon = option.icon
  store.setActiveOp({
    type,
    subType: option.label
  })
}
</script>

<template>
  <div class="w-full flex h-full items-center">
    <template v-for="item in opArr">
      <template v-if="item.type === 'button'">
        <n-button
          :disabled="allFuncAble"
          class="!w-[60px] h-full flex justify-center items-center !mr-[3px]"
          @click="handleOp(item as opBtnType)"
          :type="activeLabel.type === item.label ? 'success' : ''"
          :key="item.label"
        >
          <n-icon :component="item.icon" size="25"></n-icon>
        </n-button>
      </template>
      <template v-else-if="item.type === 'dropdown'">
        <div
          class="box-border flex justify-center items-center"
          :class="activeLabel.type === item.label ? 'active' : ''"
          :key="item.label"
        >
          <drop-down-btn
            :selection="item as dropDownPropType"
            @select="handleSelect"
          ></drop-down-btn>
        </div>
        <!-- 显示meausre情况的下的清除、清除所有线条按钮       -->
        <div class="mr-[20px]" :key="item.label">
          <template v-if="item.label === 'measure' && activeLabel.type === 'measure'">
            <n-button
              @click="handleClearLine"
              class="!w-[60px] h-full flex justify-center items-center !mr-[3px]"
            >
              <n-icon :component="Trash" size="25"></n-icon>
            </n-button>
            <n-button
              @click="handleClearAllLine"
              class="!w-[60px] h-full flex justify-center items-center !mr-[3px]"
            >
              <n-icon :component="TrashX" size="25"></n-icon>
            </n-button>
          </template>
          <template v-else-if="item.label === 'rotate' && activeLabel.type === 'rotate'">
            <n-button
              @click="handleClearAllRotate"
              class="!w-[60px] h-full flex justify-center items-center !mr-[3px]"
            >
              <n-icon :component="TrashX" size="25"></n-icon>
            </n-button>
          </template>
        </div>
      </template>
      <template v-else-if="item.type === 'playOrPause'">
        <play-or-pause :key="item.label" class="!mr-[10px]"></play-or-pause>
      </template>
    </template>
    <n-button strong class="!ml-auto !w-[60px]" @click="reset">
      <n-icon :component="Reset" size="25"></n-icon>
    </n-button>
  </div>
</template>

<style scoped>
::v-deep(.n-base-selection-input__content svg) {
  font-size: 23px; /* 修改字体大小 */
}

.active ::v-deep(.n-base-selection-label) {
  @apply bg-primaryColor !important;
}

.active ::v-deep(.n-base-selection-input__content) {
  color: white !important;
}
</style>