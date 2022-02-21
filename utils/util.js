/*
 * @Author: Lance Ma
 * @Date: 2019-12-09 20:29:29
 * @LastEditTime: 2021-04-07 15:54:36
 * @LastEditors: Please set LastEditors
 * @Description: 通用公共方法库
 * @FilePath: .\utils\util.js
 */
const lanceMa = getApp()

import defaultConfig from '../config/default-config'
import QQMapWX from './qqmap-wx-jssdk'
import wxStorages from '../store/storage'
import moment from 'moment'

const qqMapSdk =  {
  mapObj: new QQMapWX({ key: defaultConfig.qqMapKey })
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 数组去重
const getArrayToFlat = arr => {
  return Array.from(new Set(arr))
}

// 调起客户端小程序设置界面，返回用户设置的操作结果

const getOpenSetting = (type = true) => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      withSubscriptions: type === 'subscriptionsSetting' ? true : false,
      success (res) {
        if (type === 'subscriptionsSetting') {
          resolve(res.subscriptionsSetting)
        } else {
          if (type === true) {
            resolve(res)
          } else {
            const scope = res.authSetting[`scope.${type}`]
            console.log(scope)
            if (scope) {
              resolve(scope)
            } else {
              reject(f)
            }
          }
        }
      },
      fail (f) {
        reject(f)
      }
    })
  })
}

// 获取 用户当前权限
const getUserAuthSetting = (type = true) => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      withSubscriptions: type === 'subscriptionsSetting' ? true : false,
      success (res) {
        if (type === 'subscriptionsSetting') {
          resolve(res.subscriptionsSetting)
        } else {
          if (type === true) {
            resolve(res)
          } else {
            const scope = res.authSetting[`scope.${type}`]
            if (scope) {
              resolve(scope)
            } else {
              reject(f)
            }
          }
        }
      },
      fail (f) {
        reject(f)
      }
    })
  })
}

// 储存 用户信息
const setUserInfo = (that, app, data) => {
  app.userInfo = data.userInfo
  app.hasUserInfo = data.status
  that.setData({
    userInfo: data.userInfo,
    hasUserInfo: data.status
  })
}

// 储存 用户位置信息 
const setUserLocation = (app, data, type = 'default') => {
  const storeType = `location.${type}`
  app.globalData.storeType = data
  wxStorages.set(storeType, data)
  app.hasLocation = true
}

const getStoreUserLocation = (app, type = 'default') => {
  const storeType = `location.${type}`
  return app.globalData.storeType || wxStorages.get(storeType)
}

// 处理用户当前位置 (地标)
const setUserLandmark = data => {

  const getLocation = data.userLocation
  const district = getLocation.address_component.district
  const landmark_l1Title = getLocation.address_reference.landmark_l1 ? getLocation.address_reference.landmark_l1.title : ''
  const landmark_l2Title = getLocation.address_reference.landmark_l2 ? getLocation.address_reference.landmark_l2.title : ''
  const landmark_title = landmark_l2Title ? (
    landmark_l2Title.indexOf(district) !== -1 ? landmark_l2Title.substring(landmark_l2Title.indexOf(district) + district.length) : landmark_l2Title
  ) : (
    landmark_l1Title.indexOf(district) !== -1 ? landmark_l1Title.substring(landmark_l1Title.indexOf(district) + district.length) : landmark_l1Title
  )
  const userLocation = {
    district: district || getLocation.address_component.city,
    landmark: landmark_title.length < 9 ? landmark_title : landmark_title.substr(0, 8) + ' ...'
  }
  return userLocation
}

// 设置更新时间
const setUpdateTimestamp = (app, timestamp = moment()) => {
  app.globalData.updateTimestamp = timestamp
  wxStorages.set('updateTimestamp', timestamp)
}

const getUpdateTimestamp = (app) => {
  return app.globalData.updateTimestamp || wxStorages.get('updateTimestamp')
}
const getUpdateStatus = (app) => {
  const updateTimestamp = getUpdateTimestamp(app)
  if (!updateTimestamp) {
    return true
  }
  const duration = moment().diff(moment(updateTimestamp), 'seconds')
  return duration > 600 ? true : false
}

// 储存 用户位置天气 
const setUserWeather = (app, data) => {
  const weather = `location.weather`
  app.globalData.weather = data
  wxStorages.set(weather, data)
}

// 获取 用户位置天气 
const getStoreUserWeather = app => {
  const weather = `location.weather`
  return app.globalData.weather || wxStorages.get(weather)
}

// 获取用户设备信息
const getSystemInfo = () => {
  return disSystemInfo()
}

// 获取数组中数值的(最大/最小值) type: true(最大值) false（最小值）
const getArrayLimit = (data = [], min = false) => {
  return min === true ? Math.min.apply(null, data) : Math.max.apply(null, data)
}

// 获取页面安全区高度
const getSafeMainHeight = () => {
  return disSystemInfo().screenHeight - disSystemInfo().statusBarHeight - 45
}

// 处理设备信息
const disSystemInfo = () => {
  const userSystemInfo = wx.getSystemInfoSync()
  Object.assign(userSystemInfo, {
    systemAbbr: userSystemInfo.system.split(' ')[0].toLowerCase(),
    menuButtonBounding: wx.getMenuButtonBoundingClientRect(),
    devicePixelRatio: userSystemInfo.windowWidth / 750
  })
  return userSystemInfo
}

// 开启 Loading 状态
const setLoadingStart = (that, delayTime = 5) => {
  const boole = true
  that.setData({ loadingStart: boole })
  lanceMa.globalData.loadingStart = boole
  setLoadingType(that, 'loading')

  let i = 0
  const timer = setInterval(() => {
    const loadingStart = lanceMa.globalData.loadingStart
    const loadingType = lanceMa.globalData.loadingType
    if (loadingType !== 'loading' || loadingStart !== boole) {
      // console.log('清除定时器：加载；类型' + loadingType + ' 加载开始' + loadingStart)
      return clearInterval(timer)
      
    }
    if (i >= delayTime) {
      // console.log('定时器守护结束')
      if (loadingStart === boole) {
        setLoadingType(that, 'network-out')
      }
      clearInterval(timer)
    }

    i++

  }, 1000)
}

// 关闭 Loading 状态
const setLoadingClose = (that, time = 460) => {
  setTimeout(() => {
    that.setData({ loadingStart: false })
    lanceMa.globalData.loadingType = ''
    lanceMa.globalData.loadingStart = false
  }, time)
}

// 设置 Loading 类型
const setLoadingType = (that, type) => {
  setTimeout(() => {
    that.setData({ loadingType: type })
    lanceMa.globalData.loadingType = type
  }, 120)
}

// 获取页面节点
const getPageSelectorNode = (id, that) => {
  const query = wx.createSelectorQuery().in(that)
  return new Promise((resolve, reject) => {
    query.select(id).boundingClientRect(res => {
      resolve(res)
    }).exec()
  })
}

// 显示转发页面 配置
const setShowShareMenu = () => {
  return new Promise((resolve, reject) => {
    wx.showShareMenu({
      withShareTicket: true,
      success (res) {
        resolve(res)
      },
      fail (e) {
        reject(e)
      }
    })
  })
}

// 获取 #loadin-box 页面节点
// const getLoadingBoxNode = that => {
//   return getPageSelectorNode('.loading-box', that)
// }

export { 
  setUserInfo,
  setUserLocation,
  qqMapSdk,
  getSystemInfo,
  getSafeMainHeight,
  getStoreUserLocation,
  setUserLandmark,
  setUserWeather,
  getStoreUserWeather,
  getArrayLimit,
  getArrayToFlat,
  getPageSelectorNode,
  setLoadingClose,
  setLoadingType,
  setLoadingStart,
  getUserAuthSetting,
  getOpenSetting,
  setUpdateTimestamp,
  getUpdateStatus,
  setShowShareMenu
}
