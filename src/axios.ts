import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import Cancel, { isCancel } from './cancel/Cancel'
import CancelToken from './cancel/cancelToken'

function createIntance(config: AxiosRequestConfig): AxiosStatic {
  //(工厂模式)
  const contenttext = new Axios(config)
  const intance = Axios.prototype.request.bind(contenttext) //使intance本身具有request方法
  extend(intance, contenttext) //再继承Axios里内置的方法
  return intance as AxiosStatic
}

const axios = createIntance(defaults)

axios.create = function(config) {
  return createIntance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function(promises) {
  return Promise.all(promises)
}

axios.spread = function(callback) {
  return function warp(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
