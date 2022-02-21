/*
 * @Author: Lance Ma
 * @Date: 2020-01-13 20:42:39
 * @LastEditTime: 2020-03-31 12:34:08
 * @LastEditors: Please set LastEditors
 * @Description: 天气数据处理
 * @FilePath: .\utils\weather-util.js
 */
import WeatherDict from './weather-dict'
import moment from 'moment'
import { getArrayLimit } from './util'

// 空气质量
// const airQuality = (data = '', type = 'speed') => {

// }
// 风向风力
const getWeatherWind = data => {
  if (!data) {
    return console.error('缺少风力风速风向等级参数！')
  }
  const level = WeatherDict.wind.speed.filter(i => data.speed >= i.value[0] && data.speed < i.value[1])[0]
  const type = WeatherDict.wind.direction.filter(i => data.direction >= i.angle[0] && data.direction < i.angle[1] || data.direction <= 11.25 || data.direction >= 348.76)[0]
  const wind = {
    text: level ? level['text'] : '未知',
    speed: (data.speed / 3.6).toFixed(1), // 换算 m/s
    direction: type ? type['text'] : '未知'
  }
  return wind
}
// 生活指数
const getWeatherLifeIndex = data => {
  const lifeIndex = {
    comfort: []
  }
  return lifeIndex
}

// 天气数组
const getDailyTempArr = (data, type = '') => {
  const temp = {
    max: data.map(i => Math.round(i.max)),
    min: data.map(i => Math.round(i.min))
  }
  return type === 'max' || type === 'min' ? temp[type] : temp
}

// 天气日期
const getDateArray = data => {
  return data.map(i => i.date)
}

// 获取当日零点时间 （返回时间戳）
const getDayZeroPoint = date => {
  return date ? moment(date).startOf('day').format('X') : moment().startOf('day').format('X')
}

// 获取当天日出
const getDaysData = (data, key = '') => {
  const daysData = (key ? data[key] : data).filter(i => getDayZeroPoint(i.date) === getDayZeroPoint())[0]
  const sunMinutes = getTimeDiff([daysData.date.replace(/00:00/, daysData.sunrise.time), daysData.date.replace(/00:00/, daysData.sunset.time)])
  daysData.sun = {
    total: sunMinutes,
    sunset: getTimeDiff([daysData.date.replace(/00:00/, daysData.sunrise.time), moment()])
  }
  return daysData ? daysData : false
}

// 获取时间差
const getTimeDiff = data => {
  if (data.length !== 2) { return false }
  const duration = moment(data[1]).diff(moment(data[0]), 'seconds')
  return duration
}


// 天气状态
const getSkyConIcon = data => {
  return data.toLowerCase().indexOf('haze') !== -1 ? 'haze' : data.toLowerCase()
}

// 天气质量
const getSkyType = data => {
  const text = WeatherDict.air_aqi.filter(i => data >= i.min && data < i.max)[0]
  return text && text['text'] ? text['text'] : '未知'
}

// 降水概率，是否需要雨伞
const getRainfall = data => {
  const raining = WeatherDict.raining
  // return raining.indexOf(data) !== -1 ? true : false
}

// 户外状态，是否适合户外运动（关键因素：雨水/雾霾/大风/气温/紫外线）
const getSport = data => {
  const { skycon, temperature, haze, ultraviolet, wind } = data
  if (WeatherDict.skycon[skycon].raining === true) {
    return false
  }
  if (temperature > 26 || temperature < 7) {
    return false
  }
  if (haze > 150) {
    return false
  }
  if (ultraviolet > 9) {
    return false
  }
  if (wind > 28) {
    return false
  }
  return true
}

// 每日 天气数据
const getDailyData = data => {
  const mergeData = (field, x, z, d = data) => (Object.keys(x[0]).length > 1 ? x : d[x]).reduce((out, v, i) => {
    if (Object.keys(x[0]).length > 1) {
      const key = v[Object.keys(v)[0]]
      const match = key[field] !== undefined && d[z].find(c => c[field] === key[field])
      if (match) {
        out.push({...x[i], ...{[z]: match}})
      }
    } else {
      const match = v[field] !== undefined && d[z].find(c => c[field] === v[field])
      if (match) {
        out.push({...{[x]: v}, ...{[z]: match}})
      }
    }
    return out
  }, [])

  const mergeBigger = (str, array) => {
    let a = []
    let b = []
    for (let index = 0; index < array.length - 1; index++) {
      if (index === 0) {
        a = mergeData(str, array[index], array[index + 1])
      } else {
        if (index % 2 !== 0) {
            b = mergeData(str, a, array[index + 1])
        } else {
            a = mergeData(str, b, array[index + 1])
        }
      }
    }
    return array.length - 1 % 2 === 0 ? b : a
  }
  
  const mergeObj = mergeBigger('date', ['temperature', 'skycon', 'skycon_08h_20h', 'skycon_20h_32h']) //[...mergeData('date', 'temperature', 'skycon')]

  let customDaily = []
  data['air_quality']['aqi'].map(a => {
    mergeObj.map((m, i) => {
      const skycon = m['skycon']
      const wind =  data['wind'][i]
      if(a['date'] === skycon['date'] || a['date'] === wind['date']) {
        m['wind'] = getWeatherWind(wind['avg'])
        skycon['days'] = moment(skycon['date']).format('M[月]D[日]')
        skycon['text'] = WeatherDict.skycon[skycon['value']]['text']
        skycon['icon'] = getSkyConIcon(skycon['value'])
        const skycon_08h_20h = m['skycon_08h_20h']
        const skycon_20h_32h = m['skycon_20h_32h']
        skycon_08h_20h['icon'] = getSkyConIcon(skycon_08h_20h['value'])
        skycon_08h_20h['text'] = WeatherDict.skycon[skycon_08h_20h['value']]['text']
        skycon_20h_32h['icon'] = getSkyConIcon(skycon_20h_32h['value'])
        skycon_20h_32h['text'] = WeatherDict.skycon[skycon_20h_32h['value']]['text']
        if (i === 0) {
          skycon['week'] = '今天'
        } else if (i === 1) {
          skycon['week'] = '明天'
        } else {
          skycon['week'] = ["周日","周一","周二","周三","周四","周五","周六"][moment(skycon['date']).format('d')]
        }
        customDaily.push({...m, ...{aqi: {...a, ...{text: getSkyType(a['avg']['chn'])}}}})
      }
    })
  })

  return customDaily
}

// 每时 天气数据
const getHourlyData = data => {
  const mergeData = (field, x, z, d = data) => (Object.keys(x[0]).length > 1 ? x : d[x]).reduce((out, v, i) => {
    if (Object.keys(x[0]).length > 1) {
      const key = v[Object.keys(v)[0]]
      const match = key[field] !== undefined && d[z].find(c => c[field] === key[field])
      if (match) {
        out.push({...x[i], ...{[z]: match}})
      }
    } else {
      const match = v[field] !== undefined && d[z].find(c => c[field] === v[field])

      if (match) {
        out.push({...{[x]: v}, ...{[z]: match}})
      }
    }
    return out
  }, [])

  const mergeBigger = (str, array) => {
    let a = []
    let b = []
    for (let index = 0; index < array.length - 1; index++) {
      if (index === 0) {
        a = mergeData(str, array[index], array[index + 1])
      } else {
        if (index % 2 !== 0) {
            b = mergeData(str, a, array[index + 1])
        } else {
            a = mergeData(str, b, array[index + 1])
        }
      }
    }
    return array.length - 1 % 2 === 0 ? b : a
  }
  
  const mergeObj = mergeBigger('datetime', ['temperature', 'skycon'])

  let customHourly = []
  data['air_quality']['aqi'].map((a, k) => {
    if (k < 24) {
      mergeObj.map((m, i) => {
        if (i < 24) {
          const skycon = m['skycon']
          const wind =  data['wind'][i]
          if(a['datetime'] === skycon['datetime'] || a['datetime'] === wind['datetime']) {
            m['wind'] = getWeatherWind(wind)
            const datetime = moment(skycon['datetime']).format('H')
            const nowtime = moment().format('H')
            m['time'] = {
              value: moment(skycon['datetime']).format('HH:mm'),
              now: datetime === nowtime ? true : false 
            }
            skycon['text'] = WeatherDict.skycon[skycon['value']]['text']
            skycon['icon'] = getSkyConIcon(skycon['value'])
            customHourly.push({...m, ...{aqi: {...a, ...{text: getSkyType(a['value']['chn'])}}}})
          }
        }
      })
    }
  })

  return customHourly
}


/* 解析处理 天气数据
* @realtime: 实时数据
* @minutely: 详细数据
*/ 

const parseWeatherData = data => {

  const AQICHN = data.realtime.air_quality.aqi.chn
  const AQIUSA = data.realtime.air_quality.aqi.usa
  const dailyTempArrMax = getDailyTempArr(data.daily.temperature, 'max')
  const dailyTempArrMin = getDailyTempArr(data.daily.temperature, 'min')

  const parseData = {
    realtime: {
      aqi: {
        chn: [AQICHN, data.realtime.air_quality.description.chn],
        usa: [AQIUSA, data.realtime.air_quality.description.usa],
        type: AQICHN < 100 ? 'secure' : AQICHN < 200 ? 'warning' : 'alarm',
        color: AQICHN < 100 ? 'rgba(57, 196, 108, .96)' : AQICHN < 200 ? 'rgba(248, 204, 72, .96)' : 'rgba(242, 70, 86, .96)'
      },
      temperature: Math.round(data.realtime.temperature),
      pressure: Math.round(data.realtime.pressure / 100),
      visibility: data.realtime.visibility,
      skycon: WeatherDict.skycon[data.realtime.skycon]['text'],
      wind: getWeatherWind(data.realtime.wind),
      life_index: data.realtime.life_index,
      lifeIndex: {
        ultraviolet: data.realtime.life_index.ultraviolet.desc,
        comfort: data.realtime.life_index.comfort.desc,
        carWashing: data.daily.life_index.carWashing[0].desc,
        coldRisk: data.daily.life_index.coldRisk[0].desc,
        rainfall: getRainfall(data.realtime.skycon),
        sport: getSport({
          skycon: data.realtime.skycon,
          temperature:  data.realtime.temperature,
          wind: data.realtime.wind.speed,
          haze: data.realtime.air_quality.aqi.chn,
          ultraviolet: data.realtime.life_index.ultraviolet.index
        })
      },
      humidity: (data.realtime.humidity * 100).toFixed(1),
      astro: getDaysData(data.daily, 'astro')
    },
    forecast_keypoint: data.forecast_keypoint,
    hourly: getHourlyData(data.hourly),
    daily: getDailyData(data.daily),
    echarts: {
      daily: {
        xAxis: getDateArray(data.daily.skycon),
        morn: dailyTempArrMax,
        night: dailyTempArrMin,
        max: getArrayLimit([...dailyTempArrMax, ...dailyTempArrMin]),
        min: getArrayLimit([...dailyTempArrMax, ...dailyTempArrMin], true)
      }
    }
  }
  return parseData
}

export default parseWeatherData