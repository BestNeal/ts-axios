import { isDate, isPlainObject } from './util'
import { type } from 'os'

//进行编码并处理特殊字符
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    //如果传参不存在的话 则原样返回url
    return url
  }

  const parts: string[] = [] //存放val的值

  Object.keys(params).forEach(key => {
    const val = params[key] //获取遍历的值
    if (val == null || typeof val == 'undefined') {
      //判断值如果是null或是undefined的情况下 则return 继续下一行的循环
      return
    }

    let valuesArray = []
    if (Array.isArray(val)) {
      //值是数组的情况下 则将上面的变量赋予
      valuesArray = val
      key += '[]'
    } else {
      valuesArray = [val]
    }

    valuesArray.forEach(val => {
      //判断里面的值是否为对象类型或时间类型
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    const markIndex = url.indexOf('#') //查询传参里是否带#
    if (markIndex !== -1) {
      //如果携带# 则拿取url之前的字符串
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams //判断url是否带了参数 如果携带参数则用&来拼接 否则直接用?拼接
  }
  return url
}
