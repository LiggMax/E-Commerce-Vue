import { FEATURED, PRODUCT_DETAIL } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'

/**
 * 获取精选商品
 */
export async function getFeaturedServer (pageNumber: number) {
  return request.get(FEATURED, { pageNumber })
}

/**
 * 获取精选商品详情
 */
export async function getFeaturedDetailServer (productId: string) {
  return request.get(PRODUCT_DETAIL, {
    productId,
  })
}
