<template>
  <section title=" " class="wel_fare">
    <div title="切换" class="change iconfont" @click.stop.prevent="change_data">
      &#xe741;
    </div>
    <div class="wel" ref="wel"></div>

  </section>
</template>

<script>
export default {
  name: 'WelFare',
  data() {
    return {
      edured: ['不限','初中','中专','高中','大专','本科','硕士','博士','其他'],
      responseEdu: null,
      responseAdr: null,
      par: [],
      response:null,
      key:true, // 默认按照职位
      option:{
        tooltip: {
          position: ['30%','5%'],
          padding: 0,
          formatter: function (params) {
            let list = []
            JSON.parse(params.seriesName).forEach(item => {
              list.push(
                {
                  name: item
                }
              )
            })
            params.data.value.forEach((item,index) => {
              list[index]['value'] = item
            })
            let str = ''
            for (let i = 0; i < list.length; i++) {
              str += `<p style="margin:0;padding:3px;">
              ${list[i].name}：
               <span style="color:rgb(15,103,223)">
                ${list[i].value}个
               </span>
              </p>`
            }
            let strs = `
              <div style="box-shadow:0 0 7px rgb(100,100,100);font-size:17px;min-width:150px;background:white;color:blue">
                <p style="padding:5px;margin:0;border-bottom: 1px solid black;text-align:center;color:black">${params.name}情况</p>
                ${str}
              </div>`
            return strs
          }
        },
        radar: {
          center: ['47%','53%'],
          name: {
            textStyle: {
              color: 'rgb(15,153,223)',
              fontSize: 18,
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: null, // list2
        },
        series: {
          type: 'radar',
          lineStyle: {
            show: false,
            color: 'rgb(15,153,213)'
          },
          itemStyle: {
            borderWidth: 5,
            color: 'rgb(15,50,213)'
          },
          areaStyle: {
            color: 'rgb(15,153,213)',
            opacity: 0.2
          },
          data: [
            {
              value : null, //list1
              name : null, //names
            }
          ]
        }
      },
      charts:null,
      city:null,
    }
  },
  methods: {
    createEcharts (list1,list2,names) {
      var myChart = this.$echarts.init(this.$refs.wel)

      this.option.radar.indicator = list2
      this.option.series.name = names
      this.option.series.data[0].name = names
      this.option.series.data[0].value = list1

      myChart.setOption(this.option)

      window.addEventListener('resize', myChart.resize)
    },




    create() {
      //创建图像了
      var myChart = this.$echarts.init(this.$refs.wel)
      this.option.radar.indicator = this.response.indi
      let names = this.response.indi.map(item => item.name)
      this.option.series.name = JSON.stringify(names)
      this.option.series.data[0].name = this.response.name

      this.option.series.data[0].value = this.response.value

      this.charts = myChart
      myChart.setOption(this.option)

      window.addEventListener('resize', myChart.resize)
    },
    async change_data () {
        await this.getDatas()
        this.toggle()
    },

    toggle() {
      let names = this.response.indi.map(item => item.name)
      this.option.series.name = JSON.stringify(names)
      this.option.radar.indicator = this.response.indi
      this.option.series.data[0].name = this.response.name
      this.option.series.data[0].value = this.response.value
      if(this.charts) {
        this.charts.setOption(this.option)
      }
    },

    async getDatas(url) {
      url = this.city ? this.city : `全国`


      let response1,response2
      if(this.key) {
        response1 = await this.$axios.getHttp(`/eduradar?location=${url}`)
        await this.filter(response1.data)
      } else {
        response2 = await this.$axios.getHttp(`/expradar?location=${url}`)
        await this.filter(response2.data)
      }

    },

    async getDatasReact(url) {
      this.city = url
      let indi = []
      let value = []
      let response1,response2
      if(!this.key) {
        response1 = await this.$axios.getHttp(`/eduradar?location=${url}`)
        // await this.filter(response1.data)
        this.option.series.data[0].name = `学历`
        response1.data.forEach(item => {
          indi.push({
            name:this.edured[item.name],
            max:parseInt(item.count) * (Math.random() * (2 - 1.2 + 1) + 1.2)
          })
          value.push(item.count)
          value['name'] = item.name
        })
      } else {
         response2 = await this.$axios.getHttp(`/expradar?location=${url}`)
        this.option.series.data[0].name = `年龄`
        response2.data.forEach(item => {
            indi.push({
              name:this.key ? this.edured[item.name] : item.x == 0 ? `不限` : item.x + '年',
              max:parseInt(item.count) * (Math.random() * (2 - 1.2 + 1) + 1.2)
            })

            value.push(item.count)
          value['name'] = item.name
          })
      }

      this.option.radar.indicator = indi

      this.option.series.data[0].value = value
      if(this.charts) {
        this.charts.setOption(this.option)
      }


    },
    filter(val) {

      let indi = []
      let value = []


        val.forEach(item => {
          indi.push({
            name:this.key ? this.edured[item.name] : item.x == 0 ? `不限` : item.x + '年',
            max:parseInt(item.count) * (Math.random() * (2 - 1.2 + 1) + 1.2)
          })
        })




      val.forEach(item => {
        value['name'] = item.name
        value.push(item.count)
      })



      let res = {
            indi,
            name:this.key ? '学历' : '经验',
            value,
        }

      this.response = res



      this.key = !this.key
    }
  },
  watch:{
    response:{
      deep:true,
      handler(val) {
        //console.log(`更新啦`)

      }
    }
  },
  async mounted () {
    await this.getDatas()
    this.create()
    this.Events.$on('WelFare/getDatas',this.getDatasReact)
    let dom = document.querySelector(`.wel`)
    dom.addEventListener(`dblclick`,() => {
      this.Events.$emit(`change`,{
        key:true,
        option:this.option,
      })
     })
  },
}
</script>

<style lang="stylus" scoped>
  @import '~@/assets/styles/public'
  .wel_fare{
    position: relative
    border_run()
    border-top: 3px solid transparent
    display: flex
    flex: 1
    .wel{
      flex: 1
    }
    .change{
      cursor: pointer
      position: absolute
      z-index: 99999999999
      font-size: .5rem
      right: .5rem
      top: .5rem
      color: rgb(15,223,213)
      transition: all .5s
    }
    .change:hover{
      transform: scale(1.2)
    }
  }
</style>
