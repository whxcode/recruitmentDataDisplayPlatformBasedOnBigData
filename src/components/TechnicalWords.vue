<template>
<section class="technical_words">
    <div class="words" title=" ">

    </div>
</section>
</template>

<script>


export default {
  name: 'TechnicalWords',
  data() {
    return {
      listData:null,
      name:null,
      charts:null,
      city:'全国',
      option:{
        baseOption: {
          backgroundColor: '#fff',
          timeline: {
            show: true,
            axisType: 'category',

            autoPlay: true,
            currentIndex: 0,
            playInterval: 5000,
            label: {
              normal: {
                show: false,
              },
            },
            lineStyle:{
              color:"#f0f0f0"
            },
            itemStyle:{
              show:false,
              color:'#ccc',
            },
            checkpointStyle:{
              color:"rgba(64,64,64,0.89)",
              borderColor:"#fefefe"
            },
            controlStyle:{
              show:false,
            },
            emphasis:{
              itemStyle:{
                color:"rgba(38,51,249,0.55)"
              }
            },
            data: [],
          },
          title: {
            top:15,
            left:30,
            textStyle: {
              color: '#10b3db',
              fontSize: 18,
            },
          },
          legend: {
            data: ['福利', '技术'],
            top: 15,
            left: 'center',
            textStyle: {
              color: '#3477db',
            },
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            formatter: '{b}<br/>{a}: {c}个',
            axisPointer: {
              type: 'shadow',
            }
          },
          toolbox: {
            right: 20,
            feature: {
              dataZoom: {
                show:false,
              },
              // brush: {},
            }
          },
          grid: [
            {
              show: false,
              left: '0',
              top: 60,
              bottom: 60,
              containLabel: true,
              width: '38%',
            },
            {
              show: false,
              left: '50.5%',
              top: 80,
              bottom: 60,
              width: '0%',
            },
            {
              show: false,
              right: '0',
              top: 60,
              bottom: 60,
              containLabel: true,
              width: '38%',
            },
          ],
          xAxis: [
            {
              type: 'value',
              inverse: true,
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              position: 'top',
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#2d9cea',
                  fontSize: 10, // 左边上面的字体大小
                },
              },
              splitLine: {
                show: false,
              },
            },
            {
              gridIndex: 1,
              show: true,
            },
            {
              gridIndex: 2,
           //   inverse: true,
              type: 'value',
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              position: 'top',
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#2d9cea',
                  fontSize: 10,
                },
              },
              splitLine: {
                show: false,
              },
            },
          ],
       //   yAxis: [],
          series: [],
        },
        options: [],
      },
    }
  },
  methods:{
     async getDatas(url) {
        url = url ? url : '全国'
        this.city = url
        let jWelfare = await fetch(`/welfare?location=${url}`)
        let jInfo = await fetch(`/info?location=${url}`)
        let dWelfare = await jWelfare.json()
        let dInfo = await jInfo.json()
        const timeLineData = []
        let ftitleDatas = []
        dInfo.forEach(item => {
          timeLineData.push(item.name)
        })
        const ztitleDatas = [] // 职位和福利需求
          //  ['五险一金 人工智能', 'java', 'c/c++', 'R', 'php', 'py', 'Go', 'abc', 'P', 'web'],

        for(let i = 0;i < dInfo.length;i ++) {
         let arr = []
         for(let j = 0;j < dInfo[i].data.length;j ++) {
           arr.push(`${dInfo[i].data[j].name}`)
         }
         ztitleDatas.push(arr)
       }

        for(let i = 0;i < dWelfare.length;i ++) {
          let arr = []
          for(let j = 0;j < dWelfare[i].data.length;j ++) {
            arr.push(`${dWelfare[i].data[j].name}`)
          }
          ftitleDatas.push(arr)
        }

        // 处理数据 职位
        let infoData = {}
        dInfo.forEach(item => {
            infoData[item.name] = []
            item.data.forEach(i => {
              infoData[item.name].push(i.count)
            })
        })

        // 处理数据 福利
        let fData = {}
        dWelfare.forEach(item => {
          fData[item.name] = []
          item.data.forEach(i => {
            fData[item.name].push(i.count)
          })
        })

        let res = {
          timeLineData, //标题
          ztitleDatas,
          ftitleDatas,
          infoData,
          fData,
        }


        Object.keys(res.fData).forEach(item => {
          if(res.fData[item].length !== 10) {
              for(let i = res.fData[item].length;i < 10;i ++) {
                res.fData[item].push(0)
              }
          }
        })

        res.ftitleDatas.forEach(item => {
          if(item.length !== 10) {
            for(let i = item.length;i < 10;i ++) {
              item.push('')
            }
          }
        })

       res.ztitleDatas.forEach(item => {
         if(item.length !== 10) {
           for(let i = item.length;i < 10;i ++) {
             item.push('')
           }
         }
       })

        console.log(timeLineData.length)

        this.listData = res
      // console.log(this.listData)
        return res
      },
     create01(val) {
          for (var i = 0; i < this.listData.timeLineData.length; i++) {
            this.option.baseOption.timeline.data.push(this.listData.timeLineData[i]);
            this.option.options.push(
              {
                title: {
                  text: `${this.listData.timeLineData[i]}`,
                },
                tooltip : {
          padding: 0,
          margin: 0,
          trigger: 'item',
          formatter: `
          <div style="box-shadow:0 0 7px rgb(100,100,100);font-size:17px;min-width:150px;background:white;color:blue">
          <p style="padding:5px;margin:0;border-bottom: 1px solid black;text-align:center;color:black">
            ${this.listData.timeLineData[i]}
          </p>
            <p style="padding:5px;margin:0;">
              <span>技术：</span>
              <span style="color:rgb(15,103,223)">{b}</span>
            </p>
            <p style="padding:5px;margin:0;">
              <span>数量：</span>
              <span style="color:rgb(15,103,223)">{c}</span>
            </p>
          </div>
          `
        },
                series: [
                  {
                    name: '福利',
                    type: 'bar',
                    barGap: 20,
                    barWidth: 20,
                    itemStyle: {
                      normal: {
                        color: 'rgb(15,183,213)',
                      },
                    },
                    emphasis: {
                      label:{
                        show:true,
                        color: 'rgb(15,5,213)',
                        verticalAlign: 'middle',
                        position: 'inside'
                      },
                      itemStyle: {
                        color: 'rgb(15,243,213)'
                      }
                    },
                    data: this.listData.fData[this.listData.timeLineData[i]],
                  },
                  {
                    name: '技术',
                    type: 'bar',
                    barGap: 20,
                    barWidth: 20,
                    barMinHeight: 50,
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    itemStyle: {
                      color: 'rgb(15,70,213)'
                    },
                    emphasis: {
                      label:{
                        show:true,
                        color: 'rgb(15,5,213)',
                        verticalAlign: 'middle',
                        position: 'inside'
                      },
                      itemStyle: {
                        color: 'rgb(15,243,213)'
                      }
                    },
                    data: this.listData.infoData[this.listData.timeLineData[i]],
                  }
                ],
                yAxis:[
                  {
                    type: 'category',
                    inverse: true,
                    position: 'right',
                    axisLine: {
                      show: false
                    },
                    axisTick: {
                      show: false
                    },
                    axisLabel: {
                      show: false,
                      margin: 8,
                      textStyle: {
                        color: '#2d9cea',
                        fontSize: 8,
                      },

                    },
                    data: this.listData.ztitleDatas[i],
                  },
                  {
                    gridIndex: 1,
                    type: 'category',
                    inverse: true,
                    position: 'left',
                    axisLine: {
                      show: false
                    },
                    axisTick: {
                      show: false
                    },
                    axisLabel: {
                      show: true,
                      formatter: function(value) { // 如果Y轴值过长，超出部分就省略号显示
                        if (value.length > 4) {
                          return value.substring(0, 4) + '...'
                        } else {
                          return value
                        }
                      },
                      textStyle: {
                        color: '#81ddfb',
                        fontSize: 12,
                      },
                    },
                    data: this.listData.ztitleDatas[i].map(function(value) {
                      return {
                        value: value,
                        textStyle: {
                          align: 'left',
                        }
                      }
                    }),
                  },
                  {
                    gridIndex: 2,
                    type: 'category',
                    inverse: true,
                    position: 'left',
                    axisLine: {
                      show: false
                    },
                    axisTick: {
                      show: false
                    },
                    axisLabel: {
                      show: false,
                      textStyle: {
                        color: '#2d9cea',
                        fontSize: 12,
                      },
                    },
                    data:this.listData.ztitleDatas[i],
                  },
                  {
                    type: 'category',
                    inverse: true,
                    position: 'left',
                    axisLine: {
                      show: false
                    },
                    axisTick: {
                      show: false
                    },
                    axisLabel: {
                      show: false,
                      margin: 8,
                      formatter: function(value) { // 如果Y轴值过长，超出部分就省略号显示
                        console.log('1',value)
                        if (value.length > 4) {
                          return value.substring(0, 4) + '...'
                        } else {
                          return value
                        }
                      },
                      textStyle: {
                        color: '#2d9cea',
                        fontSize: 8,
                      },

                    },
                    data: this.listData.ftitleDatas[i],
                  },
                  {
                    gridIndex: 1,
                    type: 'category',
                    inverse: true,
                    position: 'left',
                    axisLine: {
                      show: false
                    },
                    axisTick: {
                      show: false
                    },
                    axisLabel: {
                      show: true,
                      textStyle: {
                        color: '#81ddfb',
                        fontSize: 12,
                      },
                    },
                    data:this.listData.ftitleDatas[i].map(function(value) {
                      console.log()
                      return {
                        value: value,
                        textStyle: {
                          padding:10,
                          align: 'right',
                        }
                      }
                    }),
                  },
                  {
                    gridIndex: 2,
                    type: 'category',
                    inverse: true,
                    position: 'right',
                    axisLine: {
                      show: false
                    },
                    axisTick: {
                      show: false
                    },
                    axisLabel: {
                      show: false,
                      textStyle: {
                        color: '#2d9cea',
                        fontSize: 12,
                      },
                    },
                    data: this.listData.ftitleDatas[i],
                  },
              ]
              }
            );
          }
          var myCharts = this.$echarts.init(document.querySelector(`.words`))
          myCharts.clear()
          myCharts.setOption(this.option)
          this.charts = myCharts
          window.addEventListener(`resize`,myCharts.resize)
     },
     update() {
       if(this.charts) {
         console.log(this.listData)
         this.option.baseOption.timeline.data = [];
         this.option.options = []
         try {
           for (var i = 0; i < this.listData.timeLineData.length; i++) {
             this.option.baseOption.timeline.data.push(this.listData.timeLineData[i]);
             this.option.options.push(
               {
                 title: {
                   text: `${this.listData.timeLineData[i]}`,
                 },
                 tooltip : {
                   padding: 0,
                   margin: 0,
                   trigger: 'item',
                   formatter: `
          <div style="box-shadow:0 0 7px rgb(100,100,100);font-size:17px;min-width:150px;background:white;color:blue">
          <p style="padding:5px;margin:0;border-bottom: 1px solid black;text-align:center;color:black">
            ${this.listData.timeLineData[i]}
          </p>
            <p style="padding:5px;margin:0;">
              <span>技术：</span>
              <span style="color:rgb(15,103,223)">{b}</span>
            </p>
            <p style="padding:5px;margin:0;">
              <span>数量：</span>
              <span style="color:rgb(15,103,223)">{c}</span>
            </p>
          </div>
          `
                 },
                 series: [
                   {
                     name: '福利',
                     type: 'bar',
                     barGap: 20,
                     barWidth: 20,
                     itemStyle: {
                       normal: {
                         color: 'rgb(15,183,213)',
                       },
                     },
                     emphasis: {
                       label:{
                         show:true,
                         color: 'rgb(15,5,213)',
                         verticalAlign: 'middle',
                         position: 'inside'
                       },
                       itemStyle: {
                         color: 'rgb(15,243,213)'
                       }
                     },
                     data: this.listData.fData[this.listData.timeLineData[i]],
                   },
                   {
                     name: '技术',
                     type: 'bar',
                     barGap: 20,
                     barWidth: 20,
                     barMinHeight: 50,
                     xAxisIndex: 2,
                     yAxisIndex: 2,
                     itemStyle: {
                       color: 'rgb(15,70,213)'
                     },
                     emphasis: {
                       label:{
                         show:true,
                         color: 'rgb(15,5,213)',
                         verticalAlign: 'middle',
                         position: 'inside'
                       },
                       itemStyle: {
                         color: 'rgb(15,243,213)'
                       }
                     },
                     data: this.listData.infoData[this.listData.timeLineData[i]],
                   }
                 ],
                 yAxis:[
                   {
                     type: 'category',
                     inverse: true,
                     position: 'right',
                     axisLine: {
                       show: false
                     },
                     axisTick: {
                       show: false
                     },
                     axisLabel: {
                       show: false,
                       margin: 8,
                       textStyle: {
                         color: '#2d9cea',
                         fontSize: 8,
                       },

                     },
                     data: this.listData.ztitleDatas[i],
                   },
                   {
                     gridIndex: 1,
                     type: 'category',
                     inverse: true,
                     position: 'left',
                     axisLine: {
                       show: false
                     },
                     axisTick: {
                       show: false
                     },
                     axisLabel: {
                       show: true,
                       formatter: function(value) { // 如果Y轴值过长，超出部分就省略号显示
                         if (value.length > 4) {
                           return value.substring(0, 4) + '...'
                         } else {
                           return value
                         }
                       },
                       textStyle: {
                         color: '#81ddfb',
                         fontSize: 12,
                       },
                     },
                     data: this.listData.ztitleDatas[i] && this.listData.ztitleDatas[i].map(function(value) {
                       return {
                         value: value,
                         textStyle: {
                           align: 'left',
                         }
                       }
                     }),
                   },
                   {
                     gridIndex: 2,
                     type: 'category',
                     inverse: true,
                     position: 'left',
                     axisLine: {
                       show: false
                     },
                     axisTick: {
                       show: false
                     },
                     axisLabel: {
                       show: false,
                       textStyle: {
                         color: '#2d9cea',
                         fontSize: 12,
                       },
                     },
                     data:this.listData.ztitleDatas[i],
                   },
                   {
                     type: 'category',
                     inverse: true,
                     position: 'left',
                     axisLine: {
                       show: false
                     },
                     axisTick: {
                       show: false
                     },
                     axisLabel: {
                       show: false,
                       margin: 8,
                       formatter: function(value) { // 如果Y轴值过长，超出部分就省略号显示
                         console.log('1',value)
                         if (value.length > 4) {
                           return value.substring(0, 4) + '...'
                         } else {
                           return value
                         }
                       },
                       textStyle: {
                         color: '#2d9cea',
                         fontSize: 8,
                       },

                     },
                     data: this.listData.ftitleDatas[i],
                   },
                   {
                     gridIndex: 1,
                     type: 'category',
                     inverse: true,
                     position: 'left',
                     axisLine: {
                       show: false
                     },
                     axisTick: {
                       show: false
                     },
                     axisLabel: {
                       show: true,
                       textStyle: {
                         color: '#81ddfb',
                         fontSize: 12,
                       },
                     },
                     data:   this.listData.ftitleDatas[i] && this.listData.ftitleDatas[i].map(function(value) {
                       console.log()
                       return {
                         value: value,
                         textStyle: {
                           padding:10,
                           align: 'right',
                         }
                       }
                     }),
                   },
                   {
                     gridIndex: 2,
                     type: 'category',
                     inverse: true,
                     position: 'right',
                     axisLine: {
                       show: false
                     },
                     axisTick: {
                       show: false
                     },
                     axisLabel: {
                       show: false,
                       textStyle: {
                         color: '#2d9cea',
                         fontSize: 12,
                       },
                     },
                     data: this.listData.ftitleDatas[i],
                   },
                 ]
               }
             );
           }
         } catch (e) {
           console.log(e,123)
         }

         this.charts.setOption(this.option)
       }
      }
  },
  async mounted() {
      await this.getDatas()
      this.create01()
      this.Events.$on(`TechnicalWords/getDatas`,this.getDatas)
  },
  watch:{
    listData:{
      deep:true,
      handler(val) {
        this.update()
      }
    },
  }

}
</script>

<style lang="stylus" scoped>
  .technical_words
      flex 1.5
      position relative
      z-index 2
      //box-shadow 0 0 5px 2px rgba(0,0,0,.2)
      .words
        position absolute
        width 100%
        height 100%
        padding .2rem
        transition all .2s
</style>

