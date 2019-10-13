import { type } from 'os'
import { head } from 'shelljs'

const toString = Object.prototype.toString

// 判断是否为时间格式
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// 判断是否为对象格式
// export function isObject(val:any): val is Object{
//     return val !== null && typeof val === 'object'; //针对formData会有问题
//     // return toString.call(val) === '[object Object]';
// }

//判断是否为对象格式
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

//将headers进行解析成对象并返回
export function parseHeaders(headers: string): any {
  const parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })
  return parsed
}
