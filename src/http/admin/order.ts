import type { OrderStatus } from '@/composables/enums/orderStatus.ts'
import type { Sort } from '@/composables/enums/Sort.ts'
import { ORDERS } from '@/http/admin/api.ts'
import request from './adminRequest.ts'

/**
 * 获取订单列表
 */
export async function getOrderList (pageNumber: number, pageSize: number, status?: OrderStatus, keyword?: string, sortOrder?: Sort) {
  return await request.get(ORDERS, {
    pageNumber,
    pageSize,
    status,
    keyword,
    sortOrder,
  })
}
