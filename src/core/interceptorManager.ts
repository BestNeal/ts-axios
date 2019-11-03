import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export class InterceptorManager<T> {
  private interceptor: Array<Interceptor<T> | null>

  constructor() {
    this.interceptor = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    //增加拦截器
    this.interceptor.push({
      resolved,
      rejected
    })
    return this.interceptor.length - 1
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptor.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    //删除拦截器
    if (this.interceptor[id]) {
      this.interceptor[id] = null
    }
  }
}
