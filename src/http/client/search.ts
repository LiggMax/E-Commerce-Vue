import type { SearchSort } from '@/composables/enums/Sort.ts'
import { SEARCH } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'

/**
 * 搜索
 * @param keyword
 * @param pageNumber
 * @param sort
 */
export async function searchServer (keyword: string, pageNumber: number, sort: SearchSort) {
  return request.get(SEARCH, { keyword, pageNumber, sort })
}
