import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

function createIntance(config: AxiosRequestConfig): AxiosStatic {
  const contenttext = new Axios(config)
  const intance = Axios.prototype.request.bind(contenttext)
  extend(intance, contenttext)
  return intance as AxiosStatic
}

const axios = createIntance(defaults)

axios.create = function(config) {
  return createIntance(mergeConfig(defaults, config))
}

export default axios