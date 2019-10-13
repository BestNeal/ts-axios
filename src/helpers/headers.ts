import { isPlainObject } from './util'
import { head } from 'shelljs'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  //判断header的Conent-Type是否一致
  if (!headers) {
    //headers不存在的话 则直接返回
    return
  }

  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}
