/*
 * @Author: Lance Ma
 * @Date: 2020-01-21 22:51:15
 * @LastEditTime: 2020-03-31 12:08:27
 * @LastEditors: Please set LastEditors
 * @Description: 彩云天气 字典常量 v2.4
 * @FilePath: .\utils\weather-dict.js
 */

export default {
  skycon: {
    CLEAR_DAY: {
      text: '晴',
      raining: false
    },
    CLEAR_NIGHT: {
      text: '晴',
      raining: false
    },
    PARTLY_CLOUDY_DAY: {
      text: '多云',
      raining: false
    },
    PARTLY_CLOUDY_NIGHT: {
      text: '多云',
      raining: false
    },
    CLOUDY: {
      text: '阴',
      raining: false
    },
    LIGHT_HAZE: {
      text: '轻雾霾',
      raining: false
    },
    MODERATE_HAZE: {
      text: '中雾霾',
      raining: false
    },
    HEAVY_HAZE: {
      text: '重雾霾',
      raining: false
    },
    LIGHT_RAIN: {
      text: '小雨',
      raining: true
    },
    MODERATE_RAIN: {
      text: '中雨',
      raining: true
    },
    HEAVY_RAIN: {
      text: '大雨',
      raining: true
    },
    STORM_RAIN: {
      text: '暴雨',
      raining: true
    },
    FOG: {
      text: '雾',
      raining: false
    },
    LIGHT_SNOW: {
      text: '小雪',
      raining: true
    },
    MODERATE_SNOW: {
      text: '中雪',
      raining: true
    },
    HEAVY_SNOW: {
      text: '大雪',
      raining: true
    },
    STORM_SNOW: {
      text: '暴雪',
      raining: true
    },
    DUST: {
      text: '浮尘',
      raining: false
    },
    SAND: {
      text: '沙尘',
      raining: false
    },
    WIND: {
      text: '大风',
      raining: false
    }
  },
  air_aqi: [
    {
      min: 0,
      max: 50,
      letter: ' Good',
      text: '优'
    },
    {
      min: 50,
      max: 100,
      letter: 'Moderate',
      text: '良'
    },
    {
      min: 100,
      max: 150,
      letter: 'Unhealthy for Sensitive Groups',
      text: '轻度'
    },
    {
      min: 150,
      max: 200,
      letter: 'Unhealthy',
      text: '中度'
    },
    {
      min: 200,
      max: 300,
      letter: 'Very Unhealthy',
      text: '重度'
    },
    {
      min: 300,
      max: 99999,
      letter: 'Hazardous',
      text: '有害'
    }
  ],
  wind: {
    speed: [
      {
        value: [0, 1],
        text: '无风'
      },
      {
        value: [1, 6],
        text: '微风徐徐'
      },
      {
        value: [6, 12],
        text: '清风'
      },
      {
        value: [12, 20],
        text: '树叶摇摆'
      },
      {
        value: [20, 29],
        text: '树枝摇动'
      },
      {
        value: [29, 39],
        text: '风力强劲'
      },
      {
        value: [39, 50],
        text: '风力强劲'
      },
      {
        value: [50, 62],
        text: '风力超强'
      },
      {
        value: [62, 76],
        text: '狂风大作'
      },
      {
        value: [76, 89],
        text: '狂风呼啸'
      },
      {
        value: [89, 103],
        text: '暴风毁树'
      },
      {
        value: [103, 118],
        text: '暴风毁树'
      },
      {
        value: [118, 134],
        text: '飓风'
      },
      {
        value: [134, 150],
        text: '台风'
      },
      {
        value: [150, 167],
        text: '强台风'
      },
      {
        value: [167, 184],
        text: '强台风'
      },
      {
        value: [184, 202],
        text: '超强台风'
      },
      {
        value: [202, 221],
        // value: [202, 9999],
        text: '超强台风'
      }
    ],
    direction: [
      {
        text: '北',
        sign: 'N',
        centre: 0,
        angle: [348.76, 11.25]
      },
      {
        text: '北东北',
        sign: 'NNE',
        centre: 22.5,
        angle: [11.26, 33.75]
      },
      {
        text: '东北',
        sign: 'NE',
        centre: 45,
        angle: [33.76, 56.25]
      },
      {
        text: '东东北',
        sign: 'ENE',
        centre: 67.5,
        angle: [56.26, 78.75]
      },
      {
        text: '东',
        sign: 'E',
        centre: 90,
        angle: [78.76, 101.25]
      },
      {
        text: '东东南',
        sign: 'ESE',
        centre: 112.5,
        angle: [101.26, 123.75]
      },
      {
        text: '东南',
        sign: 'SE',
        centre: 135,
        angle: [123.76, 146.25]
      },
      {
        text: '南东南',
        sign: 'SSE',
        centre: 157.5,
        angle: [146.26, 168.75]
      },
      {
        text: '南',
        sign: 'S',
        centre: 180,
        angle: [168.76, 191.25]
      },
      {
        text: '南西南',
        sign: 'SSW',
        centre: 202.5,
        angle: [191.26, 213.75]
      },
      {
        text: '西南',
        sign: 'SW',
        centre: 225,
        angle: [213.76, 236.25]
      },
      {
        text: '西西南',
        sign: 'WSW',
        centre: 247.5,
        angle: [236.26, 258.75]
      },
      {
        text: '西',
        sign: 'W',
        centre: 270,
        angle: [258.76, 281.25]
      },
      {
        text: '西西北',
        sign: 'WNW',
        centre: 295.5,
        angle: [281.26, 303.75]
      },
      {
        text: '西北',
        sign: 'NW',
        centre: 315,
        angle: [303.76, 326.25]
      },
      {
        text: '北西北',
        sign: 'NNW',
        centre: 337.5,
        angle: [326.26, 348.75]
      }
    ]
  }
}
