<template>
  <section class="wages_box">
      <div class="wages" ref="wages">

      </div>
  </section>
</template>

<script>
export default {
  name: 'WageS',

  data() {
    return {
      option: {
        backgroundColor: '#fff',
        // title: {
        //   text: '地区经济',
        // },
        legend: {
          right: 10,
          data: [],
        },
        xAxis: {
          splitLine: {
            data: [11, 22, 33, 44],
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          scale: true
        },
        series: []
      },
      data: null,
      charts:null,
      title:[],
    }
  },
  methods:{
    async create() {
      const myCharts = this.$echarts.init(this.$refs.wages)
      // 数据配置
      this.option.series[0].data = this.datas.data[0]
      this.option.series[1].data = this.datas.data[1]
      this.option.series[0].itemStyle.normal.color =  new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
        offset: 0,
        color: 'rgb(251, 118, 123)'
      }, {
        offset: 1,
        color: 'rgb(204, 46, 72)'
      }]);
      this.option.series[1].itemStyle.normal.color = new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
          offset: 0,
          color: 'rgb(129, 227, 238)'
        }, {
          offset: 1,
          color: 'rgb(25, 183, 207)'
        }])
      //显示图标
      window.addEventListener(`resize`,myCharts.resize)

    },
    async getDatas(url) {
      url = url ? url : `全国`
      let j = await fetch(`/eesjscatter?location=${url}`)
      let d = await j.json()
      let jobTag = new Set()
      const datas = []
      d.forEach(item => {
          jobTag.add(item.jobtag)
      })
      jobTag = [...jobTag]
      jobTag.forEach(item => {
        let arr = []
        let ass = []
        d.forEach(i => {

          if(i.jobtag === item) {
            ass.push([i.edu + 1,i.exp + 1,i.salary,i.jobtag,i.jobtag])
          }

        })
        if(ass.length) {
          arr.push(ass)
        }
        datas.push(arr)
      })
      let res = {
        datas,
        titleData:jobTag,
      }

      this.data = res
      return  res
    },
    async create01() {
      function getColors() {
        let color = ``
        return `#${color}`
      }
      const myCharts = this.$echarts.init(this.$refs.wages)
     // this.option.legend.data = this.data.titleData

      this.data.datas.forEach(item => {
        this.option.series.push( {
          show:false,
          name: item[0][4][3],
          data: item[0],
          type: 'scatter',
          symbolSize: function (data) {
            let size = data[2] / 35000;
            size = size <= 5 ? 10 : size
            return size
          },
          label: {
            emphasis: {
              show: true,
              formatter: function (param) {
                return param.data[3];
              },
              position: 'top'
            }
          },
          itemStyle: {
            show:false,
            normal: {
              shadowBlur: 10,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: 5,
              color: function () {
                  return 'rgb(' + [
                    15,
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * (230-200+1)+200)
                  ].join(',') + ')'
                }
            }
          }
        },)
      })
      this.charts = myCharts
      myCharts.setOption(this.option)
      window.addEventListener(`resize`,myCharts.resize)
    },
    update() {
      if(this.charts) {
        function getColors() {
          return 'rgb(' + [
                    Math.round(Math.random() * (30-5+1)+5),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * (230-200+1)+200)
                  ].join(',') + ')'
        }
        this.option.legend.data = this.data.titleData
        this.option.series = []
        this.data.datas.forEach(item => {
          this.option.series.push( {
            name: item[0][4],
            data: item[0],
            type: 'scatter',
            symbolSize: function (data) {
              let size = data[2] / 15000;
              size = size <= 5 ? 10 : size
              return size
            },
            label: {
              emphasis: {
                show: true,
                formatter: function (param) {
                  return param.data[3];
                },
                position: 'top'
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color:  new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: getColors()
                }, {
                  offset: 1,
                  color: getColors()
                }])
              }
            }
          },)
        })
        this.charts.setOption(this.option)
      }
    }
},
watch:{
  data:{
    deep:true,
    handler(val) {
      this.update()
    }
  }
},
  async mounted() {
    await this.getDatas()
    this.create01()
    this.Events.$on(`WageS/getDatas`,this.getDatas)
    this.$refs.wages.addEventListener(`dblclick`,() => {
      this.option.legend.data = this.data.titleData
      this.Events.$emit(`change`,{
        key:true,
        option:this.option,
      })
    })
}
}
</script>

<style lang="stylus" scoped>
  .wages_box
    flex 1
    position relative
    .wages
      position absolute
      width 100%
      height 100%
</style>
