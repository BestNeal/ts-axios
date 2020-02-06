import { isDate, isPlainObject, isURLSearchParams } from './util'
import { type } from 'os'
import { resolve } from 'dns'

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

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    //如果传参不存在的话 则原样返回url
    return url
  }
  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
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

    serializedParams = parts.join('&')
  }

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

/* 处理xsrf攻击 start */

interface URLOrigin {
  protocol: string
  host: string
}

//通过本地的url 与 请求的url 里 protocol，host 进行对比是否一致
export function isURLSameOrigin(requestUrl: string): boolean {
  const parseOrigin = resolveUrl(requestUrl)
  return currentOrigin.protocol === parseOrigin.protocol && currentOrigin.host === parseOrigin.host
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveUrl(window.location.href)

function resolveUrl(url: string): URLOrigin {
  //获取url的protocol，host属性
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}

/* 处理xsrf攻击 end */

/* 处理相对路径和绝对路径 start */
export function isAbsoluteURL(url: string): boolean {
  //判断是否为绝对路径的请求头
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseUrl: string, relativeURL?: string): string {
  return relativeURL ? baseUrl.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseUrl
}
