/*
 * @Author: Lance Ma
 * @Date: 2020-03-26 22:10:04
 * @LastEditTime: 2020-03-30 17:42:37
 * @LastEditors: Please set LastEditors
 * @Description: Loading
 * @FilePath: .\components\loading\index.js
 */
// components/loading/index.js
import defaultConfig from '../../config/default-config'
import { setLoadingType } from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loadingStart: {
      type: Boolean,
      value: false,
      observer(data) {
        if (data) {
          this.setData({ loadingStart: data })
        }
      }
    },
    loadingType: {
      type: String,
      value: '',
      observer(data) {
        if (data) {
          console.log('组件状态：', data)
          this.setData({ loadingType: data })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultConfig,
    loadingType: '',
    loadingStart: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // myEventDetail detail对象，提供给事件监听函数 // myEventOption  detail对象，提供给事件监听函数
    setLoadingDataCom (myEventDetail = {}, myEventOption = {}) {
      // 触发事件的选项
      this.triggerEvent('getLoadingDataCom', myEventDetail, myEventOption)
    },
    // 重新获取网络数据
    getLinkedNetwork () {
      this.triggerEvent('getLoadingDataCom', { pageOnLoad: true })
    },
    getOpenSettingLocation () {
      this.triggerEvent('getLoadingDataCom', { opneSetting: 'userLocation' })
    }
  }
})
