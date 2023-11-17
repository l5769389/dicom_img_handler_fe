<script setup lang="ts">
import type { dropDownOptionItem, dropDownPropType } from '@/components/ImgOpControl/types/types'
import { h, markRaw, computed, inject } from 'vue'
import { NIcon } from 'naive-ui'
import type { PropType } from 'vue'
import { CaretDown16Filled } from '@vicons/fluent'
import type { DropdownOption } from 'naive-ui'
import { useOpStore } from '@/stores/activeOpViewType'
import type { opMsgType } from '@/types'
import { MyWebsocket } from '@/MyWebsocket'

const props = defineProps({
  selection: {
    type: Object as PropType<dropDownPropType>,
    default: () => {
      return {
        label: String, // 该下拉框的种类
        value: String, // 细分种类是哪种
        icon: Object,
        default_icon: Object,
        options: [],
        type: String
      }
    }
  }
})

const handleSelect = (key: string | number, option: dropDownOptionItem) => {
  sendToServer(option.value)
  emits('select', {
    type: props.selection?.label,
    option: option
  })
}

const handleClick = () => {
  sendToServer(props.selection.value)
  store.setActiveOp({
    type: props.selection?.label,
    subType: props.selection?.value
  })
}

const sendToServer = (subType: string) => {
  if (activeView.value === '') {
    return
  }
  const msg: opMsgType = {
    type: activeView.value,
    opType: props.selection.label,
    subOpType: subType
  }
  ws.sendMsg(msg)
}

const store = useOpStore()
const activeLabel = computed(() => store.activeOpRef)
const allFuncAble = computed(() => store.isPlayingStatus)

const renderDropdownIcon = (option: DropdownOption) => {
  return h(
    NIcon,
    {},
    {
      default: () => h(option.icon || '')
    }
  )
}


const activeView = computed(() => store.activeViewTypeRef)
const ws = inject('ws') as MyWebsocket



const activeFlag = computed(() => {
  return activeLabel.value.type === props.selection?.label
})

const emits = defineEmits(['select'])
</script>

<template>
  <div class="flex items-center mr-[10px]">
    <n-button :type="activeFlag ? 'success' : ''" @click="handleClick" :disabled="allFuncAble">
      <template v-if="selection.icon">
        <n-icon :component="selection.icon" size="20"></n-icon>
      </template>
      <template v-else-if="selection.default_icon">
        <n-icon :component="selection.default_icon" size="20"></n-icon>
      </template>
      <template v-else-if="selection.value">
        {{ selection.value }}
      </template>
      <template v-else>
        {{ selection.label }}
      </template>
    </n-button>

    <n-dropdown
      trigger="click"
      :disabled="allFuncAble"
      :options="selection.options"
      :render-icon="renderDropdownIcon"
      @select="handleSelect"
    >
      <n-button text :disabled="allFuncAble">
        <n-icon :component="markRaw(CaretDown16Filled)" size="20"></n-icon>
      </n-button>
    </n-dropdown>
  </div>
</template>

<style scoped></style>