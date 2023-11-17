type windowType = 'preview' | 'sag' | 'cor' | 'ax'
type mprViewType = 'sag' | 'cor' | 'ax'
type mprWindowPositionType = 'left1' | 'left2' | 'right'
type activeTabType = 'preview' | 'mpr'
type actionType = 'down' | 'move' | 'up'

interface opMsgType {
  type: windowType
  opType: string
  subOpType?: string
  x?: number
  y?: number
  zoom?: number
  scroll?: number
  actionType?: actionType
  interval?: number
}

interface mprImgProvideType {
  sag: string
  cor: string
  ax: string
}

interface mprImgProvideCenterType {
  sag: number[]
  cor: number[]
  ax: number[]
}

type viewDescType = {
  [key in windowType]: Map<string, any>
}

interface aspectType {
  width: number
  height: number
}

type mprAspectType = {
  [key in mprViewType]?: aspectType
}

type singleViewAspectType = aspectType

type loadImgType = loadSingleViewType | loadImgMprType | resizeViewType

interface loadSingleViewType {
  type: windowType
  opType: 'getImg'
  address?: string
  size?: singleViewAspectType
}

interface resizeViewType {
  type: windowType | 'mpr'
  opType: 'resize'
  size?: singleViewAspectType | mprAspectType
}

interface loadImgMprType {
  type: 'mpr'
  opType: 'getImg'
  address?: string
  size?: mprAspectType
}

interface resetViewType {
  type: activeTabType
  opType?: 'reset'
}

interface windowArrType {
  type: windowType
  imgSrc: string
  ref: string
  position: mprWindowPositionType
}

interface msgReceivedType {
  type: 'preview' | 'mpr' | 'ax' | 'sag' | 'cor'
  imgs: mprImgProvideType | string
  center?: any
  desc?: any
}

export type {
  windowType,
  opMsgType,
  loadImgType,
  aspectType,
  mprImgProvideType,
  windowArrType,
  loadImgMprType,
  mprAspectType,
  msgReceivedType,
  mprImgProvideCenterType,
  resetViewType,
  activeTabType,
  actionType,
  mprViewType,
  loadSingleViewType,
  resizeViewType,
  viewDescType
}
