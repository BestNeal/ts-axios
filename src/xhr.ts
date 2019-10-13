import { AxiosRequestConfig, AxiosPromise } from './types/index'
import { head } from 'shelljs'
import { parseHeaders } from './helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name]) //设置headers
      }
    })

    request.onreadystatechange = function handleLoad() {
      if (request.readyState != 4) {
        return
      }

      const responseHeader = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType != 'text' ? request.response : request.responseText
      const response = {
        data: responseData,
        header: responseHeader,
        status: request.status,
        statusText: request.statusText,
        config,
        request
      }

      resolve(response)
    }

    request.send(data)
  })
}
