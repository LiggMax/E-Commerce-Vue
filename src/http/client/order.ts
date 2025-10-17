import { ORDER } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'

/**
 * 创建订单
 */
export async function createOrderService (orderData: any) {
  return await request.post(ORDER, orderData)
}

/**
 * 获取订单详情
 */
export async function getOrderDetailService (orderNo: string) {
  return await request.get(`${ORDER}/info`, { orderNo })
}

/**
 * 支付订单
 */
export async function payOrderService (payData: any) {
  return await request.post(`${ORDER}/pay`, payData)
}

/**
 * 获取订单列表
 */
export async function getOrderListService (params?: any) {
  return await request.get(ORDER, { params })
}

/**
 * 取消订单
 */
export async function cancelOrderService (orderNo: string) {
  return await request.put(`${ORDER}/${orderNo}/cancel`)
}

/**
 * 确认收货
 */
export async function confirmOrderService (orderNo: string) {
  return await request.put(`${ORDER}/${orderNo}/confirm`)
}
