/*
 * @Author: Lance Ma
 * @Date: 2020-03-16 16:02:00
 * @LastEditTime: 2020-03-16 19:34:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\router\routers.js
 */

import pagesURL from '../config/page-urls'

const routers = (data = '', type = 'navigateTo') => {
    if (!data) {
        return console.error('当前跳转页面参数错误！')
    }
    if (type === 'navigateBack') {
        wx.navigateBack({
            delta: data,
            success (res) {
                
            },
            fail (err) {

            }
        })
    } else {
        const getURL = pagesURL(data)
        if (!getURL) {
            return console.error('当前跳转页面地址错误！')
        }
        
        wx[type]({
            url: getURL,
            // events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                // acceptDataFromOpenedPage (acceptData = {}) {
                //     console.log(acceptData)
                // }
            // },
            success (res) {
                // 通过eventChannel向被打开页面传送数据
                const resData = {}
                res.eventChannel.emit('acceptDataFromOpenerPage', resData)
            }
        })
    }
}

export default routers
