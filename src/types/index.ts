export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'put'
  | 'PUT'
  | 'post'
  | 'POST'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  //声明axios传递的config参数定义
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType //typescript 定义好的类型 比如json，text
  timeout?: number
  [propName: string]: any //其他传递参数

  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]

  cancelToken?: CancelToken //取消接口
  withCredentials?: boolean //设置跨域是否可携带cookie
  //防止xsrf攻击
  xsrfCookieName?: string
  xsrfHeaderName?: string

  onDownloadProgress?: (e: ProgressEvent) => void //监听实时下载事件
  onUploadProgress?: (e: ProgressEvent) => void //监听实时上传事件

  auth?: AxiosBasicCredentials //http授权

  validateStatus?: (status: number) => boolean //自定义状态码规则

  paramsSerializer?: (params: any) => string //自定义参数序列化

  baseURL?: string //绝对路径的请求头
}

export interface AxiosResponse<T = any> {
  //处理服务端返回的数据
  data: T //返回的参数
  status: number //http响应码
  statusText: string //提示语句
  headers: any
  config: AxiosRequestConfig //配置项
  request: any //xhr实例
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {} //声明promise

export interface AxiosError extends Error {
  //处理axios异常
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response: AxiosResponse
  isAxiosError: boolean
}

export interface Axios {
  //axios扩展接口
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  getUri(config?: AxiosRequestConfig): string
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

//拦截器功能接口

export interface AxiosStatic extends AxiosInstance {
  //改变单例模式
  create(config?: AxiosRequestConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean

  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void //删除拦截器
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

//合并功能接口

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

//取消发送功能接口

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

// HTTP授权
export interface AxiosBasicCredentials {
  username: string
  password: string
}
