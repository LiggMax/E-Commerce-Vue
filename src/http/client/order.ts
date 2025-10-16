import { ORDER } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'
/**
 * 创建订单
 */
export async function createOrderService (order: any) {
  return await request.post(ORDER, order)
}
