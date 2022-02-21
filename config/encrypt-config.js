/*
 * @Author: Lance Ma
 * @Date: 2019-12-15 14:42:05
 * @LastEditTime: 2020-04-23 23:33:39
 * @LastEditors: Please set LastEditors
 * @Description: 通信加密验证
 * @FilePath: .\config\encrypt-config.js
 */

// import wxStorages from '../store/storage'
import moment from 'moment'
import MD5 from 'md5'
import defaultSettings from './default-config'

const timestampHour = moment(moment().format("YYYY-MM-DD HH:00:00")).valueOf() / 1000

export const getUserKey = MD5(defaultSettings.secretKey + timestampHour)
export const getUdiKey = MD5(defaultSettings.UdiSecret + timestampHour)
