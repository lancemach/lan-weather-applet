// components/ec-canvas/gauge/index.js
import echarts from '../lib/echarts'
import defaultConfig from '../../../config/default-config'

const defaultColor = defaultConfig.skin.background

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gauge: {
      type: Object,
      value: {},
      observer(data) {
        this.setData({
          gaugeData: data,
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    gaugeData: {},
    ec: {
      // disableTouch: true,
      lazyLoad: true
    }
  },
  created () {
    this.ecComponent = this.selectComponent('#echarts-gauge')
  },
  ready() {
    if (this.data.gaugeData) {
      this.intChart()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    intChart () {
      const chartData = this.data.gaugeData
      const sunTotal = chartData.sun.total
      const sunset = chartData.sun.sunset

      let sunHeight = 0
      let sunLine = 0

      if (sunset > 0) {
        if (sunset > sunTotal) {
          sunHeight = 30
          sunLine = 1
        } else {
          sunHeight = 30 * sunset / sunTotal
          sunLine = 1 * sunset / sunTotal
        }
      }
      
      // const percent =
      this.ecComponent.init((canvas, width, height, dpr) => {

        const textStyle = {
          fontWeight: 'normal',
          fontSize: 10,
          color: 'rgba(255, 255, 255, .8)'
        }

        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart)
        this.chart = chart
        const option = {
          title: [{
            text: '日出',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 10,
              color: 'rgba(255, 255, 255, .8)'
            },
            top: '79%',
            left: '14%'
          },
          {
            text: chartData.sunrise.time,
            textStyle: {
              fontWeight: 'normal',
              fontSize: 11,
              color: 'rgba(255, 255, 255, .8)'
            },
            top: '78.5%',
            left: '22%'
          },
          {
            text: '日落',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 10,
              color: 'rgba(255, 255, 255, .8)'
            },
            top: '79%',
            right: '25%'
          },
          {
            text: chartData.sunset.time,
            textStyle: {
              fontWeight: 'normal',
              fontSize: 11,
              color: 'rgba(255, 255, 255, .8)'
            },
            top: '78.5%',
            right: '14%'
          }],
          backgroundColor: 'rgba(255, 255, 255, 0)',
          polar: {
              center: ['50%', '200%'], // 控制点的位置
              radius: '368%'
          },
          angleAxis: {
              type: 'value',
              min: 0,
              max: 100,
              startAngle: 144,
              endAngle: 36,
              axisLine: {
                  show: false
              },
              splitLine: {
                  show: false
              },
              axisLabel: {
                  show: false
              },
              axisTick: {
                  show: false
              },
          },
          radiusAxis: {
              min: 0,
              axisLine: {
                  show: false
              },
              splitLine: {
                  show: false
              },
              axisLabel: {
                  show: false
              },
              axisTick: {
                  show: false
              }
          },
          series: [
            {
                type: 'gauge',
                radius: '360%',
                center: ['50%', '200%'],
                splitNumber: 36, //刻度数量
                startAngle: 144,
                endAngle: 36,
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#8ec6ad'
                  }, {
                      offset: 1,
                      color: '#ffe'
                  }])
              },
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 2,
                    color: [
                      [
                        sunLine, new echarts.graphic.LinearGradient(
                          0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgba(225, 225, 225, .9)'
                          },
                          {
                            offset: 1,
                            color: 'rgba(225, 225, 225, .9)'
                          }
                          ]
                        )
                      ]
                    ]
                  }
                },
                //分隔线样式。
                splitLine: {
                  show: false
                },
                axisLabel: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                pointer: {
                  show: false
                },
                detail: {
                    show: false
                }
            },{
              type: 'gauge',
              radius: '360%',
              center: ['50%', '200%'],
              splitNumber: 36, //刻度数量
              startAngle: 142,
              endAngle: 37,
              axisLine: {
                show: false
              },
              //分隔线样式。
              splitLine: {
                show: true,
                length: 2,
                lineStyle: {
                  type: 'dashed',
                  width: 5,
                  color: 'rgba(225, 225, 225, 0.3)'
                }
              },
              axisLabel: {
                show: false
              },
              axisTick: {
                show: false
              },
              pointer: {
                show: false
              },
              detail: {
                  show: false
              }
          },
          {
              name: 'point',
              type: 'scatter',
              coordinateSystem: 'polar',
              symbol: 'path://M100,50.274c-27.464,0-49.727,22.263-49.727,49.727c0,27.462,22.263,49.724,49.727,49.724c27.461,0,49.725-22.262,49.725-49.724C149.727,72.537,127.461,50.274,100,50.274z M100,12.979c3.432,0,6.215,2.782,6.215,6.214v18.648c0,3.432-2.781,6.214-6.217,6.214c-3.433,0-6.216-2.782-6.216-6.214V19.193c0-3.432,2.782-6.214,6.215-6.214C99.998,12.979,100,12.979,100,12.979z M155.604,45.309c1.828,1.73,1.828,4.537,0.004,6.27h-0.004l-9.908,9.403c-1.793,1.762-4.75,1.811-6.606,0.108c-1.854-1.7-1.905-4.508-0.114-6.268l0.111-0.107l9.911-9.407c1.823-1.73,4.778-1.73,6.604,0L155.604,45.309z M187.021,100.001c0,3.433-2.78,6.216-6.215,6.216H162.16c-3.432,0-6.217-2.781-6.217-6.218c0-3.433,2.785-6.217,6.217-6.217h18.646c3.432,0,6.213,2.783,6.213,6.216C187.021,99.999,187.021,100.001,187.021,100.001zM155.43,154.536c-1.804,1.713-4.726,1.713-6.527,0H148.9l-9.795-9.304c-1.785-1.729-1.758-4.5,0.063-6.196c1.796-1.671,4.667-1.671,6.463,0l9.798,9.299c1.803,1.708,1.803,4.485,0,6.197V154.536L155.43,154.536z M100,187.021c-3.433,0-6.216-2.781-6.216-6.215V162.16c0-3.432,2.784-6.217,6.217-6.217c3.435,0,6.215,2.785,6.215,6.217v18.646c0,3.432-2.778,6.215-6.214,6.215C100.001,187.021,100,187.021,100,187.021z M45.288,155.788c-1.734-1.843-1.734-4.831,0-6.673v-0.002l9.418-10.01c1.703-1.875,4.512-1.926,6.276-0.112c1.764,1.806,1.811,4.795,0.108,6.669l-0.108,0.117l-9.414,10.011c-1.733,1.841-4.544,1.841-6.276,0H45.288L45.288,155.788z M12.979,100.001c0-3.433,2.781-6.216,6.213-6.216H37.84c3.432,0,6.215,2.784,6.215,6.217c0,3.436-2.783,6.215-6.215,6.215H19.194c-3.433,0-6.214-2.779-6.214-6.214C12.979,100.002,12.979,100.001,12.979,100.001z M45.071,45.739c1.756-1.688,4.602-1.688,6.356,0l0,0l9.535,9.169c1.787,1.658,1.836,4.395,0.112,6.111c-1.726,1.717-4.571,1.766-6.358,0.106l0,0l-0.108-0.105l-9.537-9.166c-1.755-1.688-1.755-4.422,0-6.108V45.739z',
              symbolSize: 30,
              z: 12,
              hoverAnimation: true,
              cursor: 'pointer',
              itemStyle: {
                color: '#FFCC17',
                opacity: .95
              },
              data: [
                  [9.65, sunHeight] // 0 - 30
              ]
          }]
        }

        chart.setOption(option)
        return chart
      })
    }
  }
})
