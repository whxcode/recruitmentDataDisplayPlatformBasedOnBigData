<template>
  <section title=" " class="position_rank">
    <div class="rank" ref="rank"></div>
  </section>
</template>

<script>
export default {
  name: 'PositionRank',
  data() {
    return {
      option:{
        angleAxis: {
          type: 'category',
          data:[],
          z: 10,
          axisLabel:{
            show: true,
            textStyle:{
              color: 'rgb(15,153,213)',
            },
            fontSize: 15
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine:{
            show: true
          }
        },
        tooltip : {
          padding: 0,
          margin: 0,
          trigger: 'item',
          formatter: `
          <div style="box-shadow:0 0 7px rgb(100,100,100);font-size:17px;min-width:150px;background:white;color:blue">
          <p style="padding:5px;margin:0;border-bottom: 1px solid black;text-align:center;color:black">前十职位排行</p>
            <p style="padding:5px;margin:0;">
              <span>职位：</span>
              <span style="color:rgb(15,103,223)">{b}</span>
            </p>
            <p style="padding:5px;margin:0;">
              <span>数量：</span>
              <span style="color:rgb(15,103,223)">{c}</span>
            </p>
          </div>
          `
        },
        radiusAxis: {
          show: false,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        polar: {
          radius: '70%'
        },
        series: [
          {
            type: 'bar',
            barMinHeight:20,
            data:[],
            itemStyle: {
              color: function(params) {
                let colorList = [
                  'rgb(15,243,213)',
                  'rgb(15,223,213)',
                  'rgb(15,203,213)',
                  'rgb(15,183,213)',
                  'rgb(15,163,213)',
                  'rgb(15,143,213)',
                  'rgb(15,123,213)',
                  'rgb(15,103,213)',
                  'rgb(15,83,213)',
                  'rgb(15,63,213)'
                ]
                return colorList[params.dataIndex]
              }
            },
            coordinateSystem: 'polar'
          }]
      },
      list: [],
      name: [],
      charts:null,
    }
  },

  methods: {
    createEcharts () {
      var myCharts = this.$echarts.init(document.querySelector(`.rank`))
      this.list.forEach(item => {
        item.value = Math.sqrt(item.value)

      })
      this.option.series[0].data = this.list // 获取数据
      this.option.angleAxis.data = this.name
      myCharts.setOption(this.option)
      this.charts = myCharts
      window.addEventListener('resize', myCharts.resize)
    },
    filter_data(res){
      this.list = res.map(item => {
        return {
          name: item.name,
          value: item.count
        }
      })
      this.name = res.map(item => {
        return item.name
      })
      this.createEcharts()
    },
    async getData () {
      let response = await this.$axios.getHttp('/jobrank?location=全国')
      this.filter_data(response.data)
    },
    async getDatas(url) {
      url = url ? url : '全国'
      let response = await this.$axios.getHttp(`/jobrank?location=${url}`)
      this.filter_data(response.data)
    },
    update() {
      if(this.charts) {
        this.option.series[0].data = this.list // 获取数据
        this.option.angleAxis.data = this.name
        this.charts.setOption(this.option)
      }
    }
  },
  watch: {
    list:{
      deep:true,
      handler(val) {
        this.update()
      }
    }
  },
  mounted () {
    this.createEcharts()
    let dom = document.querySelector(`.position_rank`)

    this.Events.$on(`PositionRank/getDatas`,this.getDatas)

    dom.addEventListener(`dblclick`,() => {
      this.Events.$emit(`change`,{
        key:true,
        option:this.option,
      })
    })
    this.getData()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/assets/styles/public'
  .position_rank{
    position:relative
    z-index: 99999999999
    border_run()
    display: flex
    flex: 1
    .rank{
      flex 1
      position absolute
      width 100%
      height 100%
    }
  }
</style>
