import { isPlainObject, deepMerge } from './util'
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
  //处理传递的headers
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function fulltenHeaders(headers: any, method: any): any {
  //处理公共headers配置
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common, headers[method], headers)

  let methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}

//将headers进行解析成对象并返回
export function parseHeaders(headers: string): any {
  const parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    const val = vals.join(':').trim()
    parsed[key] = val
  })
  return parsed
}
