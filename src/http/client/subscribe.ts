import { SUBSCRIBE } from '@/http/client/api.ts'
import request from '@/http/request.ts'

/**
 * 订阅
 */
export async function subscribeServer (data: FormData) {
  return request.post(SUBSCRIBE, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
