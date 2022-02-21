/*
 * @Author: Lance Ma
 * @Date: 2019-12-07 09:46:51
 * @LastEditTime: 2020-04-26 17:02:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\pages\index\index.js
 */
//获取应用实例
const lanceMa = getApp()
import moment from 'moment'
import defaultConfig from '../../config/default-config'
import { getWeatherRealtime } from '../../utils/api'
import { setUserInfo, setUserWeather, getStoreUserLocation, getStoreUserWeather, setUserLandmark, getSafeMainHeight, setLoadingClose, setLoadingStart, getUserAuthSetting, setLoadingType, getOpenSetting, setUpdateTimestamp, getUpdateStatus, setShowShareMenu } from '../../utils/util'
import { getUserLocation, getOpenID } from '../../utils/request-utils'
import parseWeatherData from '../../utils/weather-util'
import router from '../../router/routers'

Page({
  data: {
    defaultConfig,
    loadingStart: true,
    loadingType: '',
    safeMainHeight: getSafeMainHeight(),
    userInfo: {},
    hasUserInfo: false,
    getLocation: {},
    userLocation: {
      district: '读取当前位置...',
      landmark: ''
    },
    checkTime: false,
    updateTime: '正在',
    updateStatus: getUpdateStatus(lanceMa) || false,
    hasUserLocation: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userWeather: {},
    weatherData: {},
    aqi: {
      type: null,
      color: 'rgba(255, 255, 255, 96)'
    }
  },
  onLoad () {
    const that = this
    setLoadingStart(that)
    setShowShareMenu()
    getOpenID(lanceMa)
    // const loading = getPageSelectorNode('.loading-box', this).then(res => {
    //   console.log('get', res)
    // })
    // if (!lanceMa.globalData.openid) {
    //   getOpenID(lanceMa)
    // }
    // if (lanceMa.globalData.userInfo) {
    //   setUserInfo(this, lanceMa, { userInfo: lanceMa.globalData.userInfo, status: true })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   lanceMa.userInfoReadyCallback = res => {
    //     setUserInfo(this, lanceMa, { userInfo: res.userInfo, status: true })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       lanceMa.globalData.userInfo = res.userInfo
    //       setUserInfo(this, lanceMa, { userInfo: res.userInfo, status: true })
    //     }
    //   })
    // }
    const TenMinutes = Number(moment().format("mm"))

    if (that.data.updateStatus !== true) {
      const Difference = TenMinutes - TenMinutes % 10
      const getLocation = getStoreUserLocation(lanceMa) || false
      const getWeather = getStoreUserWeather(lanceMa) || false
      if (getWeather && getWeather.realtime && getLocation && getLocation.userLocation) {
        that.setData({
          userLocation: setUserLandmark(getLocation),
          userWeather: getWeather,
          weatherData: parseWeatherData(getWeather),
          updateTime: moment().format("HH") + ':' + (TenMinutes % 10 === 0 ? TenMinutes : (Difference < 10 ? Difference + '0' : Difference))
        })
        that.updateInterval(that)
        setTimeout(() =>{
          setLoadingClose(that)
        }, 260)
        return 
      }
    }

    const userLocation = getUserAuthSetting('userLocation').then(res => {
      if (!res) {
        setLoadingType(that, 'location-out')
        return
      }
    }).catch(e => {})

    getUserLocation(lanceMa).then(res => {
      const location = res.location
      if (!location.lat || !location.lng) {
        console.log('获取用户位置城市/区县(失败)：', res)
        setLoadingType(that, 'location-out')
        return
      }
      // 获取 用户当前位置 天气
      this.bindGetWeather(res)
    })
  },
  // 绑定Loading组件数据通信
  bindLoadingDataCom (e) {
    const detail = e.detail
    const { pageOnLoad, opneSetting } = detail
    if (pageOnLoad === true) {
      this.onLoad()
    }
    if (opneSetting === 'userLocation') {
      getOpenSetting(opneSetting).then(res => {
        if (res) {
          this.onLoad()
        } else {
          wx.showToast({ title: '用户已取消地理位置授权', icon: 'none' })
        }
      }).catch(e => {})
    }
    this.setData(detail)
  },
  getUserInfo (e) {
    lanceMa.globalData.userInfo = e.detail.userInfo
    setUserInfo(this, lanceMa, { userInfo: e.detail.userInfo, status: true })
  },
  // data = true 更新当前区域天气数据
  bindGetWeather (data = {}) {
    const that = this
    const location = data !== true ? data.location : getStoreUserLocation(lanceMa).userLocation.location
    getWeatherRealtime({
      type: `weather`,
      dailysteps: 15,
      location: `${location.lng},${location.lat}`
    }).then(resWeather => {
      if (data !== true) {
        that.setData({ 
          userLocation: setUserLandmark({ userLocation: data }),
          hasUserLocation: true
        })
      }
      const weather = resWeather.data.result
      console.log(weather)
      if (weather) {
        const TenMinutes = Number(moment().format("mm"))
        const Difference = TenMinutes - TenMinutes % 10
        weather.realtime.temperature = Math.round(weather.realtime.temperature)

        const weatherData = parseWeatherData(weather)
        if (weatherData) {
          setLoadingClose(that)
        }
        setUpdateTimestamp(lanceMa, moment())
        that.setData({
          weatherData,
          userWeather: weather,
          updateTime: moment().format("HH") + ':' + (TenMinutes % 10 === 0 ? TenMinutes : (Difference < 10 ? Difference + '0' : Difference))
        })
        setUserWeather(lanceMa, weather)
        // 解析、筛选天气预报所需数据
        if (TenMinutes % 10 === 0 && moment().get('second') === 0 || data === true) {
          that.TenMinutesSetInterval(data)
        } else {
          that.updateInterval(that)
        }
      } else {
        console.err('天气更新失败，请下拉更新数据！')
        // 下拉更新数据
      }
    }).catch(e => {})
  },
  // 数据更新计时器
  updateInterval (that) {
    let integralMinutes
    var compileTime = setInterval(() => {
      integralMinutes = moment().format("mm")
      // console.log(moment().get('second'))
      if (integralMinutes % 10 === 0 && moment().get('second') === 0) {
        that.TenMinutesSetInterval()
        clearInterval(compileTime)
        return
      }
      // console.log('开始守护自动更新...', integralMinutes)
    }, 1000)
  },
  // 开始整时(10分钟) 动态更新数据
  TenMinutesSetInterval (type = false) {
    const that = this
    const getCompileTenTime = () => {
      // console.log('正在计时 10分钟后更新数据 ...')
      setUpdateTimestamp(lanceMa, moment())
      const minute = moment().format("mm")
      that.setData({
        updateTime: moment().format("H") + ':' + minute.length === 1 ? minute + '0' : minute,
        updateStatus: 1
      })
      that.bindGetWeather(true)
    }
    if (type !== true) {
      getCompileTenTime()
      return
    }
    const compileTenTime = setInterval(() => {
      getCompileTenTime()
    }, 10 * 60 * 1000)
  },
  handleCheckDailyPage () {
    router('daily')
  },
  onGotUserInfo: function (e) {
    console.log('获取用户信息：', e)
  }
})
