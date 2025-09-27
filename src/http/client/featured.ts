import { FEATURED } from '@/http/client/api.ts'
import request from '@/http/request.ts'

/**
 * 获取精选商品
 */
export async function getFeaturedServer () {
  return request.get(FEATURED)
}
