import { ORDER, REGION } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'

/**
 * 获取地区信息
 */
export async function getRegionService () {
  return await request.get(REGION)
}

/**
 * 创建订单
 */
export async function createOrderService (order: any) {
  return await request.post(ORDER, order)
}
