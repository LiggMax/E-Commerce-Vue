import { EventSourcePolyfill } from 'event-source-polyfill'
import { userTokenStore } from '@/stores/admin/adminToken.ts'

const tokenStore = userTokenStore()

interface SystemInfo {
  systemUptime: number
  cpuUsage: number
  totalMemory: number
  usedMemory: number
  totalDisk: number
  usedDisk: number
  cpuModel: string
  cpuTemperature: number
  networkInfo: Array<{
    name: string
    macAddr: string
    ipv4Addr: string[]
    bytesSent: number
    bytesRecv: number
    uploadSpeed: number
    downloadSpeed: number
  }>
}
/**
 * 获取系统状态信息
 * @param callback 接收到数据时的回调函数
 */
export function getSystemInfoServer (callback: (data: SystemInfo) => void) {
  const evtSource = new EventSourcePolyfill('/api/admin/system/status', {
    heartbeatTimeout: 60_000,
    headers: {
      Authorization: tokenStore.token,
    },
  })

  // 监听 system-info 事件
  evtSource.addEventListener('system-info', (event: any) => {
    try {
      const data = JSON.parse(event.data)
      callback(data)
    } catch (error) {
      console.error('解析SSE数据失败:', error)
    }
  })

  evtSource.addEventListener('error', error => {
    console.error('SSE连接错误:', error)
  })

  // 返回关闭函数
  return () => {
    evtSource.close()
  }
}
