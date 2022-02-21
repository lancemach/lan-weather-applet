/*
 * @Author: your name
 * @Date: 2020-01-03 20:43:22
 * @LastEditTime: 2020-03-26 03:39:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \weather-wechat-applet\components\navBar\index.js
 */
// component/navBar.js
const lanceMa = getApp()
import { getSystemInfo } from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userSystemInfo: {}
  },
  /**
   * 组件的方法列表
   */
  attached () {
    this.setData({
      userSystemInfo: getSystemInfo()
    })
    lanceMa.globalData.userSystemInfo = this.data.userSystemInfo
  },
  methods: {

  }
})
