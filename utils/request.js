/*
 * @Author: Lance Ma
 * @Date: 2019-12-02 15:15:21
 * @LastEditTime: 2020-04-26 22:08:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\utils\request.js     
 */

const lanceMa = getApp()
import defaultConfig from '../config/default-config'

// 用于前后端 接口通信 权限 KEY 以实际业务为准 可忽略
// import { getUserKey, getUdiKey } from '../config/encrypt-config'

class Request {
  constructor (parms) {
    this.withBaseURL = parms.withBaseURL
    this.baseURL = parms.baseURL
    this.wxShowToast = parms.wxShowToast
  }
  /**
   * 设置统一的异常 状态码
   */
  statusCodeCompatable (code) {
    const status = {
      200: '请求成功',
      400: '请求失败',
      401: '用户权限验证失败',
      403: '服务器拒绝请求',
      404: '请求不存在或已删除',
      405: '当前用户未登录',
      500: '服务器内部错误'
    }
    if (!Object.keys(status).includes(`${code}`)) {
      return '网络通信异常'
    }
    return `${code}：` + status[code]
  }
  /**
   * 设置统一的异常处理
   */
  errorHandler (message) {
    const data = Object.assign({ title: '操作提示', icon: 'none' }, message)
    wx.showToast(data)
  }
  requestGet (url, data, type) {
    return this.request('GET', url, data, type)
  }
  requestPost (url, data, type) {
    return this.request('POST', url, data, type)
  }
  requestPut (url, data, type) {
    return this.request('PUT', url, data, type)
  }
  requestDelete (url, data, type) {
    return this.request('DELETE', url, data, type)
  }
  request (method = 'GET', url = '', data = {}, type = 'application/json') {
    const that = this
    const URL = that.withBaseURL ? that.baseURL + url : url
    const header = { 'content-type': type }
    if (defaultConfig.headerToken) {
      const Token = lanceMa.globalData.token
      header[defaultConfig.headerToken] = Token ? Token : wx.getStorageSync('token')
    }

    if (defaultConfig.AppUUID && defaultConfig.AppUUID.name && defaultConfig.AppUUID.id) {
      header[defaultConfig.AppUUID.name] = defaultConfig.AppUUID.id
    }
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: URL,
        data,
        header,
        method,
        success (res) {
          if (res.statusCode !== 200) {
            //其它错误，提示用户错误信息
            if (that.wxShowToast === true) { that.errorHandler({ title: that.statusCodeCompatable(res.statusCode) || res.data}) }
            return reject(res)
          }

          // 通信成功 数据结果异常 处理
          if (defaultConfig.requesCode.status === true && that.withBaseURL === true && res.data[defaultConfig.requesCode.keycode] !== defaultConfig.requesCode.statusCode) {
            if (that.wxShowToast === true) { that.errorHandler({ title: res.data[defaultConfig.requesCode.keyMsg] || res.errMsg}) }
            return reject(res.data)
          }
          resolve(res.data)
        },
        fail (res) {
          if (that.wxShowToast === true) {
            that.errorHandler({ title: res.errMsg.includes(`fail`) === true ? that.statusCodeCompatable() : res.errMsg})
          }
          reject(res)
        }
      })
    })
  }
}

const request = new Request({
  baseURL: defaultConfig.hostURL,
  withBaseURL: true,
  wxShowToast: true
})

export default request
