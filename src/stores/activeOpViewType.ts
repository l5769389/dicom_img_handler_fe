import { ref, computed, watch, inject } from 'vue'
import { defineStore } from 'pinia'
import type { mprViewType, windowType } from '@/types'


export const useOpStore = defineStore('op', () => {
  const activeOpRef = ref({
    type: '',
    subType: ''
  })

  function setActiveOp(activeOp) {
    Object.assign(activeOpRef.value, activeOp)
  }

  const isPlayingStatus = computed(() => {
    return activeOpRef.value.type === 'play'
  })

  const activeViewTypeRef = ref<windowType | ''>('')

  function setActiveViewType(viewType: windowType) {
    activeViewTypeRef.value = viewType
  }

  return {
    activeOpRef,
    setActiveOp,
    isPlayingStatus,
    activeViewTypeRef,
    setActiveViewType
  }
})
