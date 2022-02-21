// components/ec-canvas/hourly-line/index.js
import echarts from '../lib/echarts'
import defaultConfig from '../../../config/default-config'
import { getArrayLimit, getArrayToFlat } from '../../../utils/util'

const defaultColor = defaultConfig.skin.background

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hourly: {
      type: Object,
      value: {},
      observer(data) {
        this.setData({
          lineData: data,
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lineData: {},
    ec: {
      // disableTouch: true,
      lazyLoad: true
    }
  },
  created () {
    this.ecComponent = this.selectComponent('#echarts-hourly-line')
  },
  ready() {
    if (this.data.lineData) {
      this.intChart()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    intChart () {
      const lineData = this.data.lineData
      const dataArr = lineData.map(i => Math.round(i.temperature.value))
      const maxData = getArrayLimit(dataArr)
      const diffData = maxData - getArrayLimit(dataArr, true)
      const yMin = maxData - diffData * 4.8
      // const yScat = Math.ceil(maxData - diffData * 2.2)
      const chartData = {
        xAxis: lineData.map(i => i.time.now !== true ? i.time.value : '现在'),
        yMax: Math.ceil(maxData),
        yMin: yMin < 0 ? parseInt(yMin) : Math.ceil(yMin)
      }
      // const getScatterArray = getArrayToFlat(lineData.map(i =>i.skycon.value))
      this.ecComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        })
        canvas.setChart(chart)
        this.chart = chart
        const option = {
          color: ["rgba(225, 225, 225, .6)", "rgba(225, 225, 225, .6)"],
          xAxis: [
            {
              type: 'category',
              data: chartData.xAxis || [],
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              boundaryGap : false,
              splitLine: {
                show: true,
                interval: 1,
                lineStyle: {
                  color: 'rgba(255, 255, 255, .06)',
                  width: 1,
                  type: 'dashed'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#ffffff',
                  fontSize: 12
                }
              }
            }
          ],
          yAxis: [
            {
              show: false,
              type: 'value',
              max: chartData.yMax,
              min: chartData.yMin
            }
          ],
          series: [
            {
              name: '逐时气温',
              type: 'line',
              symbol: 'circle',
              label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}°',
                  textStyle: {
                      fontSize: 13,
                      color: '#ffffff',
                  }
              },
              symbolSize: 5,
              lineStyle: {
                  normal: {
                      color: "#ffffff",
                      width: 1
                  },
              },
              itemStyle: {
                color: defaultColor || "rgba(225, 225, 225, 0)",
                borderColor: "#ffffff",
                borderWidth: 1,
              },
              smooth: true,
              data: dataArr || []
            }
          ],
          grid: {
            top: 30,
            left: 25,
            right: 35,
            bottom: 30
          }
        }

        // getScatterArray.forEach(i => {
        //   lineData.map((q, k) => {
        //     if (i === q.skycon.value) {
        //       console.log(q)
        //       option.series.push({
        //           name: '数据点1',
        //           type: 'scatter',
        //           symbolSize: 20,
        //           data: [
        //               [k, yScat]
        //           ]
        //       })
        //     }
        //   })
        // })

        chart.setOption(option)
        return chart
      })
    }
  }
})

