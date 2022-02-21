/*
 * @Author: your name
 * @Date: 2020-03-19 13:11:21
 * @LastEditTime: 2020-03-31 12:11:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\components\ec-canvas\line\index.js
 */
// components/ec-canvas/line/index.js
import echarts from '../lib/echarts'
import defaultConfig from '../../../config/default-config'

const defaultColor = defaultConfig.skin.background

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    line: {
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
    this.ecComponent = this.selectComponent('#echarts-line')
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
      const chartData = this.data.lineData

      this.ecComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart)
        this.chart = chart
        const option = {
          color: ["rgba(225, 225, 225, .6)", "rgba(225, 225, 225, .6)"],
          xAxis: [
            {
              type: 'category',
              show: false,
              data: chartData.xAxis || []
            },
            {
              type: 'category',
              show: false,
              data: chartData.xAxis || []
            }
          ],
          yAxis: [
            {
              show: false,
              type: 'value',
              max: chartData.max,
              min: chartData.min
            }
          ],
          series: [
            {
              name: '最高气温',
              type: 'line',
              symbol: 'circle',
              label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}°',
                  textStyle: {
                      color: 'rgba(225, 225, 225, .92)',
                  }
              },
              symbolSize: 5,
              lineStyle: {
                  normal: {
                      color: "rgba(225, 225, 225, .8)",
                      shadowColor: 'rgba(0, 0, 0, .05)',
                      width: 1
                  },
              },
              itemStyle: {
                color: defaultColor || "rgba(225, 225, 225, 0)",
                borderColor: "rgba(225, 225, 225, .8)",
                borderWidth: 1,
              },
              smooth: true,
              data: chartData.morn || []
            },
            {
              name: '最低气温',
              type: 'line',
              symbol: 'circle',
              label: {
                show: true,
                position: 'bottom',
                formatter: '{c}°',
                textStyle: {
                    color: 'rgba(225, 225, 225, .92)',
                }
            },
              symbolSize: 5,
              lineStyle: {
                  normal: {
                      color: "rgba(225, 225, 225, .8)",
                      shadowColor: 'rgba(0, 0, 0, .05)',
                      width: 1
                  },
              },
              itemStyle: {
                color: defaultColor || "rgba(225, 225, 225, 0)",
                borderColor: "rgba(225, 225, 225, .8)",
                borderWidth: 1,
              },
              smooth: true,
              data: chartData.night || []
            }
          ],
          grid: {
            top: 30,
            left: 5,
            right: 5,
            bottom: 30
          }
        }

        chart.setOption(option)
        return chart
      })
    }
  }
})
