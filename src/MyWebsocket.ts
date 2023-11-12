import { websocket_port, websocket_url } from '@/config'
import type { aspectType, loadImgType, opMsgType, resetViewType } from '@/types'
import { Debounced, Throttled } from '@/utils/util'

class MyWebsocket {
  ws: WebSocket | null = null
  connected = false
  handleMsg

  constructor(handleMsg: (args: any) => void) {
    this.ws = new WebSocket(`${websocket_url}:${websocket_port}/ws/123`)
    this.handleMsg = handleMsg
    this.ws.onopen = () => {
      console.log('open')
      this.connected = true
    }
    this.ws.onmessage = (ev) => {
      this.handleMsg(ev.data)
    }
    this.ws.onclose = () => {
      this.connected = false
      console.log('close')
    }
  }

  @Throttled(15)
  sendMsg(msg: opMsgType | loadImgType | resetViewType) {
    const str = JSON.stringify(msg)
    if (!this.connected) {
      throw new Error()
    }
    console.log(str)
    this.ws?.send(str)
  }

  testSend(aspect: aspectType) {
    const prefix = 'C:\\Users\\57693\\Desktop\\123\\SYNO0'
    // const prefix = 'C:\\Users\\test\\Desktop\\123\\SYNO0'
    const suffix = '.dcm'
    let count = 1
    const handler = setInterval(() => {
      const full_path = `${prefix}${count.toString().padStart(3, '0')}${suffix}`
      const msg: loadImgType = {
        type: 'preview',
        opType: 'getImg',
        address: full_path,
        size: {
          width: Math.round(aspect.width),
          height: Math.round(aspect.height)
        }
      }
      this.sendMsg(msg)
      count++
      if (count === 100) {
        // if (count === 321) {
        clearInterval(handler)
      }
    }, 50)
  }
}

export { MyWebsocket }
