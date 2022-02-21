/*
 * @Author: Lance Ma
 * @Date: 2019-12-09 20:29:29
 * @LastEditTime: 2020-04-26 22:10:54
 * @LastEditors: Please set LastEditors
 * @Description: 通用资源请求方法库
 * @FilePath: .\utils\request-utils.js
 */

import { getUserOpenID } from './api'
import wxStorages from '../store/storage'
import { qqMapSdk, setUserLocation } from './util'

// 获取 用户 OpenID
const getOpenID = that => {
  // 登录
  wx.login({
    success(res) {
      console.log('login:', res)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        wx.getUserInfo({
          withCredentials: true,
          success(res) {
            console.log(res)
            //发起网络请求
            getUserOpenID({ code: res.code, action: 'code2Session' }).then(res => {
              const openid = res.data.openid
              if (openid) {
                that.globalData.openid = openid
                wxStorages.set('openid', openid)
              } else {
                wxStorages.remove('openid')
              }
            }).catch(e => {
              wxStorages.remove('openid')
              console.log('登录失败！', e)
            })
          },
          fail(e) {
            console.log(e)
          }
        })
        
      }
    }
  })
}

// 获取用户位置
const getUserLocation = (app, type) => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        getGeographic(app, res, type).then(location => {
          resolve(location)
        })
      },
      fail (e) {
        console.log('位置获取失败：', e)
        e.location = false
        resolve(e)
      }
    })
  })
}

// 腾讯地图 经纬度（location）获得当前地理位置
const getGeographic = (app, pos, type) => {
  return new Promise((resolve, reject) => {
    qqMapSdk.mapObj.reverseGeocoder({
      location: {
        latitude: pos.latitude,
        longitude: pos.longitude
      },
      success (res) {
        setUserLocation(app, { userLocation: res.result, status: true }, type)
        resolve(res.result)
      },
      fail (e) {
        wx.showToast({ title: e.message.includes(`fail`) === true ? '获取用户位置失败' : e.message, icon: 'none' })
        reject(e)
      }
    })
  })
} 

export { getUserLocation, getOpenID }
