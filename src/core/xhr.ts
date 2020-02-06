import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { isFormData } from '../helpers/util'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { processHeaders } from '../helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method,
      headers = {},
      responseType, //请求类型
      timeout, //超时
      cancelToken, //取消请求
      withCredentials, //设置跨域携带cookie
      xsrfCookieName, //防止xsrf攻击
      xsrfHeaderName, //防止xsrf攻击
      onDownloadProgress, //实时下载事件
      onUploadProgress, //实时上传事件
      auth, //http授权
      validateStatus //自定义状态码
    } = config

    const request = new XMLHttpRequest() //创建request实例

    request.open(method!.toUpperCase(), url!, true) //执行request方法初始化

    configureRequest() //配置request对象

    addEvents() //request添加事件处理函数

    processHeaders() //处理请求headers

    processCancel() //处理请求取消逻辑

    request.send(data) //执行发送请求

    function configureRequest(): void {
      //config配置项
      if (responseType) {
        //设置传递类型
        request.responseType = responseType
      }

      if (timeout) {
        //设置超时时间
        request.timeout = timeout
      }

      if (withCredentials) {
        //设置跨域/同源可携带cookie
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      //事件函数
      request.onreadystatechange = function handleLoad() {
        if (request.readyState != 4) {
          return
        }

        if (request.status == 0) {
          return
        }

        //处理服务端返回值
        const responseHeader = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          responseType && responseType != 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          headers: responseHeader,
          status: request.status,
          statusText: request.statusText,
          config,
          request
        }
        handleResponse(response)
      }
      request.onerror = function handleError() {
        //监听错误
        reject(createError('NetWork Error', config, null, request))
      }
      request.ontimeout = function handleTimeout() {
        //监听超时
        reject(
          createError(`Timeout of ${request.timeout} ms exceeded`, config, 'ECONNABORTED', request)
        )
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      //处理请求头
      //如果请求的数据是 FormData 类型，我们应该主动删除请求 headers 中的 Content-Type 字段，让浏览器自动根据请求数据设置 Content-Type
      //当我们通过 FormData 上传文件的时候，浏览器会把请求 headers 中的 Content-Type 设置为 multipart/form-data
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        //防止xsrf攻击
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        //http授权
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name]) //设置headers
        }
      })
    }

    function processCancel(): void {
      //设置取消请求
      if (cancelToken) {
        //取消请求
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(
            /* istanbul ignore next */
            () => {
              // do nothing
            }
          )
      }
    }

    function handleResponse(response: AxiosResponse) {
      //状态请求成功
      if (!validateStatus || validateStatus(response.status)) {
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
