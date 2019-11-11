<template>
  <section class="map_box">
      <address class="map_address">
        <span class="iconfont">&#xe64f;&nbsp;</span>
        {{city}}
      </address>
      <span class="toggle" @click="toggle">
        <strong class="iconfont">&#xe741;</strong>
      </span>
      <div class="map" ref="pos">
      </div>
      <transition>
        <div class="mask" v-show="closeKey" @dblclick="close">
          <div class="global" ref="global">
          </div>
        </div>
      </transition>
  </section>
</template>

<script>
export default {
  name: 'MapPos',
  data() {
    return {
      closeKey:false,
      globalCharts:null,
      globalOption:null,
      text:null,
      charts:null,
      city:'全国',
      key:true,
      url:'/companycount',
      option:{
        title: {
          text: '全国招聘信息一览',
          textStyle: {
            fontSize: 20,
            color:'rgb(15,50,213)',
          },
          y:30,
          x: 'center'
        },
        tooltip: {
          show: true,
          padding: 0,
          formatter: function(params) {
            let str =`<div style="box-shadow:0 0 7px rgb(100,100,100);font-size:17px;min-width:150px;background:white;color:blue">
          <p style="padding:5px;margin:0;border-bottom: 1px solid black;text-align:center;color:black">
            ${params.name}
          </p>
            <p style="padding:5px;margin:0;">
              <span>${params.data.type}数量：</span>
              <span style="color:rgb(15,103,223)">${params.data.count}</span>
            </p>
          </div>`
            return str
          },
        },
        visualMap: {
          show:false,
          type: 'continuous',
          text: ['', ''],
          showLabel:true,
          seriesIndex: [0],
          min: 0,
          max: 7,
          inRange: {
            color: ['rgb(15,50,213)',
            'rgb(15,90,213)',
            // 'rgb(15,110,213)',
            // 'rgb(15,120,213)',
            'rgb(15,130,213)',
            // 'rgb(15,150,213)',
            'rgb(15,170,243)',
            // 'rgb(105,190,213)',
            '#E0FFFF'].reverse()
          },
          textStyle: {
            color: '#000'
          },
          bottom: 30,
          left: 'left',
        },
        grid: {
          right: 10,
          top: 80,
          bottom: 30,
          width: '20%'
        },
        geo: {
          roam: true,
          map: 'china',
          left: 'center',
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            emphasis: {
              show:false,
              areaColor: '#4dfff2'
            }
          },
          regions: [{
            name: '南海诸岛',
            value: 0,
            itemStyle: {
              normal: {
                opacity: 0,
                label: {
                  show: false
                }
              }
            }
          }],
        },
        series: [
          {
            name: 'mapSer',
            type: 'map',
            roam: false,
            geoIndex: 0,
            label: {
              show: false,
            },
            data:[]
          },
        ]
      },
      baseData:[  // 基本数据 和 后端做对应
        {
          name:'北京',
          value:0,
        },
        {
          name: '天津',
          value: 1000
        },
        {
          name: '上海',
          value: 4.6
        },
        {
          name: '重庆',
          value: 3.6
        },
        {
          name: '河北',
          value: 3.4
        },
        {
          name: '河南',
          value: 3.2
        },
        {
          name: '云南',
          value: 1.6
        },
        {
          name: '辽宁',
          value: 4.3
        },
        {
          name: '黑龙江',
          value: 4.1
        },
        {
          name: '湖南',
          value: 2.4
        },
        {
          name: '安徽',
          value: 3.3
        },
        {
          name: '山东',
          value: 3.0
        },
        {
          name: '新疆',
          value: 1
        },
        {
          name: '江苏',
          value: 3.9
        },
        {
          name: '浙江',
          value: 3.5
        },
        {
          name: '江西',
          value: 2.0
        },
        {
          name: '湖北',
          value: 2.1
        },
        {
          name: '广西',
          value: 3.0
        },
        {
          name: '甘肃',
          value: 1.2
        },
        {
          name: '山西',
          value: 3.2
        },
        {
          name: '内蒙古',
          value: 3.5
        },
        {
          name: '陕西',
          value: 2.5
        },
        {
          name: '吉林',
          value: 4.5
        },
        {
          name: '福建',
          value: 2.8
        },
        {
          name: '贵州',
          value: 1.8
        },
        {
          name: '广东',
          value: 3.7
        },
        {
          name: '青海',
          value: 0.6
        },
        {
          name: '西藏',
          value: 0.4
        },
        {
          name: '四川',
          value: 3.3
        },
        {
          name: '宁夏',
          value: 0.8
        },
        {
          name: '海南',
          value: 1.9
        },
        {
          name: '台湾',
          value: 0.1
        },
        {
          name: '香港',
          value: 0.1
        },
        {
          name: '澳门',
          value: 1231
        }
      ],
    }
  },
  methods:{
    async getDatas() {
      try {
        let j = await fetch(`http://172.17.6.101:8080/companycount`,{
          method:'get'
        })
        let d = await j.json()
        console.log(d)
        let j1 = await fetch(`http://172.17.6.101:8080/jobcount`,{
          method:'get'
        })
        let d1 = await j1.json()
        console.log(d1)
      } catch (e) {
        console.log(e)
      }
    },

    async createMap() {
      try {

        let mapJson = (await this.$axios.getMap()).data

        console.log(mapJson,0)
        let j = await fetch(this.url)
        let data = await j.json()

        this.baseData.text = `公司分布点`
        this.text = this.baseData.text
        this.baseData.forEach(item => {
          data.forEach(i => {
            if(i.name.includes(item.name)) {
              item.value = i.count / 1000
              item.city = i.name
              item.count = i.count
              item.type = `公司`
              return
            }
          })
        })
        this.$echarts.registerMap('china', mapJson);
        this.option.title.text = this.text
        this.option.series[0].data = this.baseData
        var myChart = this.$echarts.init(document.querySelector('.map'));
        this.charts = myChart


        myChart.on('click',val => {
            this.city = this.city === val.data.city ? `全国` : val.data.city
            this.Events.$emitAll(this.city)
        })
        myChart.setOption(this.option)
        window.addEventListener('resize',myChart.resize)
      }catch (e) {
        console.log(0,e)
      }
    },

    async toggle() {
      let j,t

      if(this.key) {
        j = await fetch('/jobcount')
        t = `职业分布情况`


      } else {
        j = await fetch(this.url)
        t = `公司分布情况`

      }

      this.key = !this.key
      try {
        let data = await j.json()

        this.baseData.text = t

        this.text = this.baseData.text

        this.baseData.forEach(item => {
          data.forEach(i => {
            if(i.name.includes(item.name)) {
              item.value = i.count / 1000
              item.count = i.count
              item.city = i.name
              if(  t === `职业分布情况`) {
                item.type = `职位`
              } else {
                item.type = '公司'
              }
              return
            }
          })
        })

        this.option.title.text = this.text
        this.option.series[0].data = this.baseData
        this.charts.setOption(this.option)

      } catch (e) {
        console.log(e)
      }
    },

          close() { // 关闭弹出层
         this.closeKey = !this.closeKey
      },

          fopen(datas) { // 打开弹出层
        let dom = document.querySelector(`.global`)
        this.closeKey = datas.key
        this.globalOption = datas.option
        dom.innerHTML = ``
        setTimeout(() => {
          let wrap = document.createElement(`div`)
          wrap.className = `wrap`
          wrap.style.width = `${dom.offsetWidth}px`
          wrap.style.height = `${dom.offsetHeight}px`
          let globalCharts = this.$echarts.init(wrap)
          dom.appendChild(wrap)
          globalCharts.setOption(this.globalOption)
          window.onresize = globalCharts.resize
        })
      },


  },
  mounted() {
   this.createMap()
   this.Events.$on(`change`,this.fopen)

  },
  }
</script>

<style lang="stylus">
  .map_box
    *
      margin 0
      padding 0
    background #fff
    flex: 2.7
    position relative
    .map
      position absolute
      width 100%
      height 100%
    .mask
      position absolute
      width 100%
      height 100%
      left 0
      top 0
      background rgba(0,0,0,.5)
      .close
        background #3399CC
        position absolute
        right 0
        z-index 22
      .global
        width 100%
        height 100%
        position absolute
        background #fff
        z-index 9999
        .wrap
          position absolute
          width 100% !important
          height 100% !important
          top 0
          left 0

    .toggle
      position: absolute;
      top: 1.4rem;
      left: 48%;
      font-size: 0.8rem;
      right: 1rem;
      color: #6ed1e1;
      cursor pointer
      z-index 222
      strong
        font-size .5rem
    .map_address
      position absolute
      z-index 2
      font-size .4rem
      top: 0.5rem;
      left: 1.1rem;
      font-style normal
      color #29bbdf
      .iconfont{
        user-select:none
        font-size: .5rem
      }
    .title
      position: absolute;
      font-size: .4rem;
      background:rgba(0,0,0,.4);
      left: 50%;
      top: 50%;
      z-index: 22;
      padding .1rem
      h3
        font-size .4rem
        padding: .1rem;
        padding-left: 0;
      h5
        font-size .3rem
  .msgs {
    color:#333;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;padding:.1rem 0;
    background: #fefefe;
    box-sizing: border-box;
    overflow: hidden;
    box-shadow: 0 0 6px 2px rgba(0,0,0,.1);

    h3 {
      color:#FF6600;
      text-indent:.1rem;
      font-size: .4rem;
      padding-bottom:4px;
      border-bottom:1px solid #FFCC00;
    }
    p {
      color:#3399CC;
      padding: 1px .2rem;
      text-indent: .2rem;
      font-size: .3rem;
    }
  }
</style>
