/*
 * @Author: Lance Ma
 * @Date: 2020-03-16 15:47:09
 * @LastEditTime: 2020-03-31 17:45:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\pages\daily\daily.js
 */
// pages/daily.js
//获取应用实例
const lanceMa = getApp()
import defaultConfig from '../../config/default-config'
import { getStoreUserLocation, getStoreUserWeather, setUserLandmark, getSystemInfo } from '../../utils/util'
import parseWeatherData from '../../utils/weather-util'
import router from '../../router/routers'
const SystemInfo = getSystemInfo()
Page({
  data: {
    defaultConfig,
    dailyWidth: 152,
    canvasTop: 0
  },
  onLoad () {
    const getlocation = getStoreUserLocation(lanceMa)
    const getWeather = getStoreUserWeather(lanceMa)
    if (!getlocation || !getlocation.userLocation || !getWeather || !getWeather.realtime) {
      return this.onClickLeft()
    }
    this.setData({ 
      userLocation: setUserLandmark(getlocation),
      weatherData: parseWeatherData(getWeather)
    })
  },
  onReady () {
    let mainTop
    const query = wx.createSelectorQuery().in(this)
    query.select('.daily-morn').boundingClientRect(res => {
      if (res.bottom) {
        this.setData({ canvasTop: (res.bottom - SystemInfo.statusBarHeight - 44) / SystemInfo.devicePixelRatio})
      }
    }).exec()
  },
  onClickLeft () {
    router(1, 'navigateBack')
  }
})