<script setup lang="ts">
import SingleViewer from '@/components/singleView/SingleViewer.vue'
import { computed, inject, reactive, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type {
  mprImgProvideCenterType,
  mprImgProvideType,
  mprViewType,
  resizeViewType
} from '@/types'
import { MyWebsocket } from '@/MyWebsocket'
import { useOpStore } from '@/stores/activeOpViewType'

const ws = inject('ws') as MyWebsocket

const mprImg = inject<Ref<mprImgProvideType>>('mprImg')
const mprImgCenter = inject<Ref<mprImgProvideCenterType>>(
  'mprImgCenter',
  ref({
    sag: [],
    ax: [],
    cor: []
  })
)

const axImgSrc = computed(() => {
  return mprImg?.value?.ax
})
const sagImgSrc = computed(() => {
  return mprImg?.value?.sag
})
const corImgSrc = computed(() => {
  return mprImg?.value?.cor
})

interface windowEachType {
  type: mprViewType
  imgSrc: string | undefined
  ref: string
  position: string
}

const windowArr = computed<windowEachType[]>(() => {
  return [
    {
      type: 'ax',
      imgSrc: axImgSrc.value,
      ref: 'axRef',
      position: 'left1'
    },
    {
      type: 'sag',
      imgSrc: sagImgSrc.value,
      ref: 'sagRef',
      position: 'left2'
    },
    {
      type: 'cor',
      imgSrc: corImgSrc.value,
      ref: 'corRef',
      position: 'right'
    }
  ]
})

const getImgSrcByViewType = (viewType: mprViewType) => {
  const map = {
    ax: axImgSrc.value,
    sag: sagImgSrc.value,
    cor: corImgSrc.value
  }
  return map[viewType]
}

const { setActiveViewType } = useOpStore()

const store = useOpStore()
const activeViewTypeRef = computed(() => {
  return store.activeViewTypeRef as mprViewType
})

const toggleActiveView = (type: any) => {
  setActiveViewType(type)
}

const mprAspects = reactive<Map<string, any>>(new Map())

const getAspect = (type: string, { width, height }: { width: number; height: number }) => {
  mprAspects.set(type, {
    width,
    height
  })
}
const handleAspectChange = (newVal: Map<string, any>) => {
  if (newVal?.has('ax') && newVal?.has('sag') && newVal?.has('cor')) {
    emits('getAspects', newVal)
  }
}

watch(
  mprAspects,
  (newVal, oldValue) => {
    handleAspectChange(newVal)
  },
  {
    immediate: true
  }
)

const handleToggleFullScreen = (viewType: mprViewType) => {
  isFullScreen.value = !isFullScreen.value
}

const getFullScreenAspect = ({ width, height }: { width: number; height: number }) => {
  const msg: resizeViewType = {
    type: activeViewTypeRef.value,
    opType: 'resize',
    size: {
      width,
      height
    }
  }
  ws.sendMsg(msg)
}

const isFullScreen = ref(false)

const emits = defineEmits(['getAspects'])
</script>

<template>
  <div v-if="!isFullScreen" class="mpr-container w-full h-full">
    <template v-for="item in windowArr" :key="item.type">
      <div
        :class="[activeViewTypeRef === item.type ? 'active' : 'inactive', item.position, item.type]"
        class="img-operate-container box-border"
        @click="toggleActiveView(item.type)"
        @dblclick="handleToggleFullScreen(item.type)"
      >
        <single-viewer
          :view-type="item.type"
          :img-src="item.imgSrc"
          :center="mprImgCenter[item.type]"
          @getAspect="(args) => getAspect(item.type, args)"
        />
      </div>
    </template>
  </div>
  <div v-else class="w-full h-full">
    <single-viewer
      @dblclick="handleToggleFullScreen(activeViewTypeRef)"
      :img-src="getImgSrcByViewType(activeViewTypeRef)"
      :view-type="activeViewTypeRef"
      @getAspect="(args) => getFullScreenAspect(args)"
    />
  </div>
</template>

<style scoped>
.mpr-container {
  display: grid;
  grid-template-columns: 2fr 2fr;
  grid-template-rows: 1fr 1fr;
}

.right {
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 2;
  grid-column-end: 3;
}

.left1,
.left2,
.right {
  border: 4px solid transparent;
  box-sizing: border-box;
  overflow: hidden;
}

.active {
  border: 4px solid cornflowerblue;
}

.inactive {
  border: 4px solid transparent;
}
</style>
`