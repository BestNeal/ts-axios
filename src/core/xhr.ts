import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { head } from 'shelljs'
import { parseHeaders } from '../helpers/util'
import { resolve } from 'path'
import { rejects } from 'assert'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials
    } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    if (withCredentials) {
      //设置跨域
      request.withCredentials = withCredentials
    }

    request.open(method.toUpperCase(), url!, true)

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

      if (request.status == 0) {
        return
      }

      const responseHeader = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType != 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        headers: responseHeader,
        status: request.status,
        statusText: request.statusText,
        config,
        request
      }

      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }

      handleResponse(response)
    }
    request.onerror = function handleError() {
      reject(createError('NetWork Error', config, null, request))
    }
    request.ontimeout = function handleTimeout() {
      reject(
        createError(`Timeout of ${request.timeout} ms exceeded`, config, 'ECONNABORTED', request)
      )
    }

    request.send(data)

    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
