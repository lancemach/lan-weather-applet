/*
 * @Author: Lance Ma
 * @Date: 2019-12-01 14:56:14
 * @LastEditTime : 2022-02-21 14:15:51
 * @LastEditors  : Lance Ma
 * @Description: 默认配置 文件
 * @FilePath     : \config\default-config.js
 */
export default {
  hostURL: 'https://lan-weather.lancema.com/',
  headerToken: '', // 'Access-Token', // 不使用 ''
  AppUUID: '6mxfgu4tkp7eo3sc9hvwi52dlzqa1jyb',
  mainPath: '/index/index',
  requesCode: {
    keycode: 'errcode',
    statusCode: 100200,
    loginOutCode: 100403,
    keyMsg: 'errmsg',
    keyData: 'data'
  },
  qqMapKey: 'PAREB-UW0XB-3G9FA-G8XVT-X1O2Y-JO7ZF',
  userLocation: {
    location: {
      lat: '34.251576',
      lng: '108.947028'
    }
  },
  skin: {
    background: '#2662B3',
    color: 'rgba(255, 255, 255, .96)'
  },
  version: 'Bata 1.012.02.1507',
  copyright: {
    date: 'Copyright © 2016 - ' + new Date().getFullYear(),
    data: '彩云天气强力驱动',
    author: '蓝思同学'
  }
}
