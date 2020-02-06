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

export function extend<T, U>(to: T, from: U): T & U {
  //继承
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  //深拷贝
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}

export function isFormData(val: any): val is FormData {
  //判断是否为 formData类型
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  //判断是否为 URLSearchParams类型
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
