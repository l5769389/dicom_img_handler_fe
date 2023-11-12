import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'
import { MyWebsocket } from '@/MyWebsocket'
import { useOpStore } from '@/stores/activeOpViewType'
import _ from 'lodash'
import type { opMsgType, windowType } from '@/types'

interface positionType {
  x: number
  y: number
}

export const useHandlerTouchOrMouseOp = (rect: Ref, viewType: windowType) => {
  const ws = inject('ws') as MyWebsocket
  const store = useOpStore()
  const operationType = computed(() => store.activeOpRef)
  let currentScale = 1
  const currentPosition: positionType = {
    x: 0,
    y: 0
  }
  const preMoveStartPosition = {
    x: 0,
    y: 0,
    scale: 1,
    isRecord: false
  }

  let isDown = false
  let currentActionType = ''

  const handleMousedown = (e: MouseEvent | TouchEvent) => {
    console.log('mousedown')
    handleDown(e)
  }
  const handleTouchStart = (e: TouchEvent) => {
    console.log('touchstart')
    handleDown(e)
  }
  const handleDown = (e: MouseEvent | TouchEvent) => {
    isDown = true
    currentActionType = 'down'
  }

  const handleMousemove = (e: MouseEvent) => {
    handleMove(e)
  }

  const handleTouchmove = (e: TouchEvent) => {
    handleMove(e)
  }

  const handleMove = _.throttle((e: MouseEvent | TouchEvent) => {
    updateCurrentPosition(e)
    if (isDown) {
      currentActionType = 'drag'
      updateDrag()
    } else {
      currentActionType = 'move'
      updateMove()
    }
  }, 50)

  const updateCurrentPosition = (e: MouseEvent | TouchEvent) => {
    const { x, y } = getPosition(e)
    Object.assign(currentPosition, {
      x,
      y
    })
  }

  const updateMove = () => {
    console.log('move')
    const msg: opMsgType = {
      type: viewType,
      opType: 'mouseover',
      x: currentPosition.x,
      y: currentPosition.y
    }
    ws.sendMsg(msg)
  }

  const updateDrag = () => {
    const { x, y } = currentPosition
    if (!preMoveStartPosition.isRecord) {
      preMoveStartPosition.x = x
      preMoveStartPosition.y = y
      preMoveStartPosition.isRecord = true
    }
    switch (operationType.value.type) {
      case 'window':
        handleWindowOp()
        break
      case 'pan':
        handlePanOp()
        break
      case 'zoom':
        handleScaleOp()
        break
      case 'scroll':
        handleScrollOp()
        break
      case 'measure':
        handleDrawOp()
        break
      default:
        break
    }
  }

  const recordPreData = (map: Map<string, number | boolean>) => {
    Object.assign(preMoveStartPosition, map)
  }

  const handleWindowOp = () => {
    const directionX = currentPosition.x - preMoveStartPosition.x
    const directionY = currentPosition.y - preMoveStartPosition.y
    recordPreData({
      x: currentPosition.x,
      y: currentPosition.y,
      isRecord: true
    })
    const msg: opMsgType = {
      type: viewType,
      opType: 'window',
      x: directionX,
      y: directionY
    }
    ws.sendMsg(msg)
  }

  const handlePanOp = () => {
    const offset_x = currentPosition.x - preMoveStartPosition.x
    const offset_y = currentPosition.y - preMoveStartPosition.y
    recordPreData({
      x: currentPosition.x,
      y: currentPosition.y,
      isRecord: true
    })
    const msg: opMsgType = {
      type: viewType,
      opType: 'pan',
      x: offset_x,
      y: offset_y
    }
    ws.sendMsg(msg)
  }
  const handleScaleOp = () => {
    const deltY = currentPosition.y - preMoveStartPosition.y
    const initScale = preMoveStartPosition.scale
    let scale
    if (deltY > 0) {
      scale = Number((initScale + Math.abs(deltY) / 200).toFixed(2))
      scale = scale > 2 ? 2 : scale
    } else {
      scale = Number((initScale - Math.abs(deltY) / 200).toFixed(2))
      scale = scale < 0.5 ? 0.5 : scale
    }
    currentScale = scale
    const msg: opMsgType = {
      type: viewType,
      opType: 'zoom',
      zoom: scale
    }
    ws.sendMsg(msg)
  }
  const handleScrollOp = () => {
    const directionY = currentPosition.y - preMoveStartPosition.y > 0 ? 1 : -1
    recordPreData({
      x: currentPosition.x,
      y: currentPosition.y,
      isRecord: true
    })
    const msg: opMsgType = {
      type: viewType,
      opType: 'scroll',
      scroll: directionY
    }
    ws.sendMsg(msg)
  }

  const handleMouseup = (e: MouseEvent) => {
    console.log('up')
    handleUp()
  }

  const handleTouchEnd = (e: TouchEvent) => {
    console.log('touch end')
    handleUp()
  }

  const handleUp = () => {
    isDown = false
    recordPreData({
      x: 0,
      y: 0,
      scale: currentScale,
      isRecord: false
    })
    if (currentActionType == 'drag') {
      currentActionType = 'up'
      handleDrawOp()
    } else {
      currentActionType = ''
    }
  }
  const handleDrawOp = () => {
    if (operationType.value.type !== 'measure') {
      return
    }
    const msg: opMsgType = {
      type: viewType,
      opType: 'draw',
      subOpType: operationType.value.subType,
      actionType: currentActionType,
      x: currentPosition.x,
      y: currentPosition.y
    }
    ws.sendMsg(msg)
  }

  const getPosition = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      const xVal = Math.round(e.clientX - rect.value.left)
      const yVal = Math.round(e.clientY - rect.value.top)
      return {
        x: xVal,
        y: yVal
      }
    } else {
      if (e.targetTouches && e.targetTouches.length > 0) {
        return {
          x: Math.round(e.targetTouches[0].clientX - rect.value.left),
          y: Math.round(e.targetTouches[0].clientY - rect.value.top)
        }
      } else {
        return {
          x: Math.round(e.changedTouches[0].clientX - rect.value.left),
          y: Math.round(e.changedTouches[0].clientY - rect.value.top)
        }
      }
    }
  }

  const handleClick = (e: MouseEvent) => {
    isDown = false
    console.log(operationType.value)
    if (currentActionType == 'up' || operationType.value.type !== 'measure') {
      return
    }
    console.log('click')
    const msg: opMsgType = {
      type: viewType,
      opType: 'draw',
      subOpType: operationType.value.subType,
      actionType: 'click',
      x: currentPosition.x,
      y: currentPosition.y
    }
    ws.sendMsg(msg)
  }

  return {
    handleMousedown,
    handleMousemove,
    handleMouseup,

    handleTouchStart,
    handleTouchEnd,
    handleTouchmove,
    handleClick
  }
}
