<template>
  <section title=" " class="word_cloud" ref="cloud">
    <div class="cloud" ref="cloud"></div>
  </section>
</template>

<script>
export default {
  name: 'WordCloud',
  data () {
    return {
      city: '全国',
      option:{
        toolip:{
          show: true,
          formatter: `<div>123213</div>`
        },
        series: [

        ]
      },
      data:null,
    }
  },
  methods: {
    createEcharts (json) {
      var myChart = this.$echarts.init(this.$refs.cloud)
      myChart.setOption({
        toolip:{
          show: true,
          formatter: `<div>123213</div>`
        },
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          right: null,
          bottom: null,
          sizeRange: [12, 60],
          rotationRange: [0, 0],
          rotationStep: 45,
          gridSize: 8,
          drawOutOfBound: false,
          textStyle: {
            normal: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              color: function () {
                return 'rgb(' + [
                  15,
                  Math.round(Math.random() * 255),
                  Math.round(Math.random() * (230-200+1)+200)
                ].join(',') + ')';
              }
            },
            emphasis: {
              shadowBlur: 4,
              shadowColor: 'rgb(15,153,223)'
            }
          },
          data: json
        }]
      })
      window.addEventListener('resize', myChart.resize)
    },
    filter_data (json) {
      let data = []
      data = json.map((item) => {
        return {
          name: item.name,
          value: item.count
        }
      })
      this.createEcharts(data)
      return data
    },
    async getData () {
      let response = await this.$axios.getHttp('/inforank/?location=' + this.city)
      this.filter_data(response.data)
    },
    create() {

        for(let i = 0;i < 1;i ++) {
          this.option.series.push(        {
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            right: null,
            bottom: null,
            sizeRange: [20, 50],
            rotationRange: [0, 0],
            rotationStep: 20,
            gridSize: 10,
            drawOutOfBound: false,
            textStyle: {
              normal: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function () {
                  return 'rgb(' + [
                    15,
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * (230-200+1)+200)
                  ].join(',') + ')';
                }
              },
              emphasis: {
                shadowBlur: 4,
                shadowColor: 'rgb(15,153,223)'
              }
            },
            data:this.data,
          })
        }


        var myChart = this.$echarts.init(this.$refs.cloud)
        myChart.setOption(this.option)
        window.addEventListener('resize', myChart.resize)

    },
    async getDatas(url) {
      try {
        url = url ? url : `全国`
        let j = await fetch(`/inforank?location=${url}`)
        let d = await j.json()
        this.data = this.filter_data(d)

      } catch(err)  {
        console.log(err)
      }
    },

    update() {
      if(this.charts) {
        this.option.series[0] = this.data
        this.charts.setOption(this.option)
      }
    },
  },
  watch:{
    data:{
      deep:true,
      handler(val) {
        this.update()
      }
    }
  },
  async mounted () {
    await this.getDatas()
    this.create()
    this.Events.$on(`WordCloud/getDatas`,this.getDatas)
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/assets/styles/public'
  .word_cloud{
    position:relative
    z-index: 99999999999
    border_run()
    border-left: 3px solid transparent
    flex: 1.2
    display: flex
    .cloud{
      flex: 1
    }
  }
</style>
