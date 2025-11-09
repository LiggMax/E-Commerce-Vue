import { FEATURED, PRODUCT_DETAIL, USER } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'

/**
 * 获取商品
 */
export async function getFeaturedServer (pageNumber: number) {
  return request.get(FEATURED, { pageNumber })
}

/**
 * 获取商品详情
 */
export async function getFeaturedDetailServer (productId: string) {
  return request.get(PRODUCT_DETAIL, {
    productId,
  })
}

/**
 * 获取商品评论
 */
export async function getFeaturedCommentServer (productId: string, pageNumber: number, pageSize: number) {
  return request.get(`${FEATURED}/comment`, {
    productId,
    pageNumber,
    pageSize,
  })
}
