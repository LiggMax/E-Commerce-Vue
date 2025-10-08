import { SEARCH } from '@/http/client/api.ts'
import request from '@/http/request.ts'

/**
 * 搜索
 * @param keyword
 * @param pageNumber
 * @param sort
 */
export async function searchServer (keyword: string, pageNumber: number, sort: number) {
  return request.get(SEARCH, { keyword, pageNumber, sort })
}
