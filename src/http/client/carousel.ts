import { GET_CAROUSEL } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'

/**
 * 获取轮播图
 */
export async function getCarouselServer () {
  return await request.get(GET_CAROUSEL)
}
