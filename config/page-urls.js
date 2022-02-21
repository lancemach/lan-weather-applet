/*
 * @Author: Lance Ma
 * @Date: 2020-03-16 15:54:06
 * @LastEditTime: 2020-03-16 19:34:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\config\page-urls.js
 */

const pageConfig = {
    index: '/pages/index/index',
    daily: '/pages/daily/daily'
}

const pageUrl = data => {
    return pageConfig[data]
}

export default pageUrl
