/*
 * @Author: Lance Ma
 * @Date: 2019-12-10 11:27:37
 * @LastEditTime: 2020-04-26 22:46:43
 * @LastEditors: Please set LastEditors
 * @Description: 网络接口 配置
 * @FilePath: .\utils\api.js
 */
// import defaultConfig from '../config/default-config'
import requests from './request'

const apis = {
  // 'getUserOpenID': `authCode2Session`,
  'getUserOpenID': `getUDIUserInfo`,
  'getWeatherRealtime': `caiyunapp/index`
}

// 获取 用户 openID 
export function getUserOpenID (param) {
  return requests.requestGet(apis.getUserOpenID, param)
}


// 获取 指定城市/区（gps） 天气数据 
export function getWeatherRealtime (param) {
  return requests.requestGet(apis.getWeatherRealtime, param)
}

