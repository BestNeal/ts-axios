import { isPlainObject } from './util'
import { type } from 'os'

export function transformRequest(data: any): any {
  //发送的数据来进行特殊处理
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any): any {
  //服务端返回的数据
  //如返回的data是字符串类型的数据 则更改为对象类型
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      //
    }
  }
  return data
}
