<template>
  <section class="education_box">

      <div class="education" ref="education">

      </div>
  </section>
</template>

<script>
export default {
  name: 'EducaTion',
  data() {
    return {
      option:{
        // title: {
        //   text: '工作经验',
        //   link: '',
        //   fontSize:14,
        //   itemStyle:{
        //     fontSize:14,
        //   }
        // },
        legend: {
          data: ['学历 / 薪资'],
          left: 'right'
        },
        polar:{
          center:['49%','50%']
        },
        tooltip: {
          padding: 0,
          formatter: function (params) {
            let str =`<div style="box-shadow:0 0 7px rgb(100,100,100);font-size:17px;min-width:150px;background:white;color:blue">
          <p style="padding:5px;margin:0;border-bottom: 1px solid black;text-align:center;color:black">
            工作经验
          </p>
            <p style="padding:5px;margin:0;">
              <span>经验：</span>
              <span style="color:rgb(15,103,223)">${params.data[0]}年</span>
            </p>
            <p style="padding:5px;margin:0;">
              <span>薪资：</span>
              <span style="color:rgb(15,103,223)">${params.data[2]}元</span>
            </p>
          </div>`
            return str
          }
        },
        angleAxis: {
          type: 'category',
          data:[], // hours
          boundaryGap: false,
          axisLabel: {
            color: 'rgb(15,50,213)',
            fontSize: 17
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#00cedb',
              type: 'dashed'
            }
          },
          axisLine: {
            show: false
          }
        },
        radiusAxis: {
          type: 'category',
          data: [], //days
          axisLine: {
            show: false
          },
          axisLabel: {
            rotate: 45
          }
        },
        series: [{
          name: '学历 / 薪资',
          type: 'scatter',
          coordinateSystem: 'polar',
          symbolSize: function (val) {
            return val[2] / 40000;
          },
          itemStyle: {
              normal: {
                borderWidth: 10,
                color: function () {
                  return 'rgb(' + [
                    Math.round(Math.random() * (0-50+1)+50),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * (230-150+1)+150)
                  ].join(',') + ')'
                }
              }
            },
          data:[], //data
          animationDelay: function (idx) {
            return idx * 5;
          }
        }]
      },
      data:null,
      charts:null
    }
  },
  methods:{
    async getDatas(url) {
      url = url ? url : '全国'
      let j = await fetch(`/eesjscatter?location=${url}`)
      let d = await j.json()
      let jobTag = new Set()
      const datas = []
      let xueLi = ["不限","初中", "中专", "高中", "大专", "本科", "硕士", "博士", "其他"]
      d.forEach(item => {
        jobTag.add(xueLi[item.edu] ? xueLi[item.edu] : `暂无`)
      })
      jobTag = [...jobTag]
      d.forEach(item => {
        datas.push([
          item.edu,
          item.exp, // 经验
          item.salary,
          xueLi[item.edu] ? xueLi[item.edu] : `暂无`
        ])
      })
      let res = {
        data:datas,
        hours:jobTag,
        days:[],
      }
      this.data = res
      return res
    },

    async create01() {
      const myCharts = this.$echarts.init(this.$refs.education)
      // 修改数据集
      this.option.angleAxis.data = this.data.hours
      this.option.radiusAxis.data = this.data.days
      this.option.series[0].data = this.data.data

      // 显示图标并监听事件
      myCharts.setOption(this.option)
      this.charts = myCharts
      window.addEventListener(`resize`,myCharts.resize)
    },
    update() {
      if(this.charts) {
        this.option.angleAxis.data = this.data.hours
        this.option.radiusAxis.data = this.data.days
        this.option.series[0].data = this.data.data
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
   // this.create()

      await this.getDatas()
      this.create01()

      this.Events.$on(`EducaTion/getDatas`,this.getDatas)

      this.$refs.education.addEventListener(`dblclick`,() => {
       this.Events.$emit(`change`,{
           key:true,
           option:this.option, // 全局配置项 必须在本组件配置 在穿入
         })

    })
  }
}
</script>

<style lang="stylus">
  .education_box
    flex 1
    position relative
    .education
      position absolute
      width 100%
      height 100%
    .edtitle
      position: absolute;
      z-index: 88;
      padding: 0;
      width: 100px;
      background: rgba(0,0,0,0.4);
      font-size: 0.3rem;
      h4,small
        margin: 0
        padding .05rem

</style>
