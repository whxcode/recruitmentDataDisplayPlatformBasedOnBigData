<template>
  <section title=" " class="pos_rank">
    <div class="pos" ref="pos"></div>
  </section>
</template>

<script>
export default {
  name: 'PosRank',

  data() {
    return {
      option:{
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series : [
          {
            type: 'graph',
            itemStyle: {
              normal: {
                color: function () {
                  return 'rgb(' + [
                    Math.round(Math.random() * (0-50+1)+50),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * (230-150+1)+150)
                  ].join(',') + ')'
                }
              }
            },
            layout: 'none',
            progressiveThreshold: 10000000,
            data:[],  // nodes
            edges:[],// edges
            label: {
              normal: {
                fontSize: 15,
                color: 'black'
              },
              emphasis: {
                position: 'right',
                show: true
              }
            },
            symbol: 'circle',
            roam: true,
            focusNodeAdjacency: true,
            lineStyle: {
              normal: {
                color: 'rgb(15,193,213)',
                width: 0.5,
                curveness: 0.3,
                opacity: 1
              }
            }
          },
          {
            type: 'graph',
            itemStyle: {
              normal: {
                color: function () {
                  return 'rgb(' + [
                    Math.round(Math.random() * (0-50+1)+50),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * (230-150+1)+150)
                  ].join(',') + ')'
                }
              }
            },
            layout: 'none',
            progressiveThreshold: 10000000,
            data:[],  // nodes
            edges:[],// edges
            label: {
              normal: {
                fontSize: 15,
                color: 'black'
              },
              emphasis: {
                position: 'right',
                show: true
              }
            },
            symbol: 'circle',
            roam: true,
            focusNodeAdjacency: true,
            lineStyle: {
              normal: {
                color: 'rgb(15,193,213)',
                width: 0.5,
                curveness: 0.3,
                opacity: 1
              }
            }
          },
        ]
      },
      listData:[],
      charts:null,

    }
  },

  methods: {
    createEcharts () {
      try {
        var myChart = this.$echarts.init(this.$refs.pos)
        this.option.series[0].data = this.listData[0].nodes.map(function (node) {
           return {
             x: node.x,
             y: node.y,
             id: node.id,
             name: node.label,
             symbolSize: node.size,
           };
         });
        this.option.series[0].edges = this.listData[0].edges.map(function (edge) {
           return {
             source: edge.sourceID,
             target: edge.targetID,
           };
         })

        this.option.series[1].data = this.listData[1].nodes.map(function (node) {
          return {
            x: node.x,
            y: node.y,
            id: node.id,
            name: node.label,
            symbolSize: node.size,
          };
        });
        this.option.series[1].edges = this.listData[1].edges.map(function (edge) {
          return {
            source: edge.sourceID,
            target: edge.targetID,
          };
        })

        this.charts = myChart
        myChart.setOption(this.option)
        window.addEventListener('resize', myChart.resize)
      } catch (e) {
         console.log(0,e)
      }

    },


    update() {
        if(this.charts) {
          this.option.series[0].data = this.listData[0].nodes.map(function (node) {
            return {
              x: node.x,
              y: node.y,
              id: node.id,
              name: node.label,
              symbolSize: node.size,
            };
          });
          this.option.series[0].edges = this.listData[0].edges.map(function (edge) {
            return {
              source: edge.sourceID,
              target: edge.targetID,
            };
          })

          this.option.series[1].data = this.listData[1].nodes.map(function (node) {
            return {
              x: node.x,
              y: node.y,
              id: node.id,
              name: node.label,
              symbolSize: node.size,
            };
          });
          this.option.series[1].edges = this.listData[1].edges.map(function (edge) {
            return {
              source: edge.sourceID,
              target: edge.targetID,
            };
          })
          this.charts.setOption(this.option)
        }
    },


    async getDatas(url) {
      try {
        url = url ? url : '全国'
        let j = await fetch(`/welfare?location=${url}`)

        let ji = await fetch(`/info?location=${url}`)

        let jWelfare = await j.json()
        let dInfo = await ji.json()
        //  let jInfo =    await (await fetch(`http://172.17.6.125:5000/pos`)).json()
        function getColors() {
          let colors = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f']
          let color = ``
          for(let i = 0;i < 6;i ++) {
            color += colors[Math.ceil(Math.random() * colors.length - 1)]
          }
          return `#${color}`
        }
        const data = {
          nodes:[],
          edges:[],
        }
        const data1 = {
          nodes:[],
          edges:[],
        }
        let id = null

        let set = new Set()

        jWelfare.forEach(item => {


            if(!set.has("node_"+item.name)) {
              data.nodes.push({
                attributes: {},
                color: getColors(),
                id: "node_"+item.name,
                label: item.name,
                size:item.data.length * Math.random() * 5,
                x: Math.random() > .5 ?  Math.random() * 100 :-( Math.random() * 100),
                y: Math.random() > .5 ?  Math.random() * 100 :-( Math.random() * 100),
              })
              set.add("node_"+item.name)
            }

            item.data.forEach(i => {
               if(!set.has(i.name)) {
                 data.nodes.push({
                   attributes: {},
                   color: getColors(),
                   id: i.name,
                   label: i.name,
                   size: 4.7252817 + Math.random() * 5,
                   x: Math.random() > .5 ?  Math.random() * 300 :-( Math.random() * 300),
                   y: Math.random() > .5 ?  Math.random() * 300 :-( Math.random() * 300),
                 })
                 set.add(i.name)
               }

               if(!set.has("edges_"+item.name+i.name)) {
                 data.edges.push({
                   attributes: {},
                   size: 1,
                   sourceID: "node_"+item.name,
                   targetID: i.name,
                 })
                set.add("edges_"+item.name+i.name)
               }
               })


        })

        this.listData = []



        set.clear()


        dInfo.forEach(item => {


          if(!set.has("node_"+item.name)) {
            data1.nodes.push({
              attributes: {},
              color: getColors(),
              id: "node_"+item.name,
              label: item.name,
              size:item.data.length * Math.random() *5,
              x: Math.random() > .5 ?  Math.random() * 150 :-( Math.random() * 150),
              y: Math.random() > .5 ?  Math.random() * 150 :-( Math.random() * 150),
            })
            set.add("node_"+item.name)
          }

          item.data.forEach(i => {
            if(!set.has(i.name)) {
              data1.nodes.push({
                attributes: {},
                color: getColors(),
                id: i.name,
                label: i.name,
                size: 4.7252817 + Math.random() * 5,
                x: Math.random() > .5 ?  Math.random() * 350 :-( Math.random() * 350),
                y: Math.random() > .5 ?  Math.random() * 350 :-( Math.random() * 350),
              })
              set.add(i.name)
            }

            if(!set.has("edges_"+item.name+i.name)) {
              data1.edges.push({
                attributes: {},
                size: 1,
                sourceID: "node_"+item.name,
                targetID: i.name,
              })
              set.add("edges_"+item.name+i.name)
            }
          })


        })

        this.listData.push(data,data1)

      } catch (e) {
        console.log(1,e)
      }

      //console.log(0,data)
    }
  },

  async mounted () {
    try {
      await this.getDatas()
      this.createEcharts()
      let dom = document.querySelector(`.pos_rank`)
      dom.addEventListener(`dblclick`,() => {
        this.Events.$emit(`change`,{
          key:true,
          option:this.option,
        })
      })
      this.Events.$on(`PosRank/getDatas`,this.getDatas)
      // this.createEcharts(response.data)
     //  console.log(JSON.stringify(d,null,1))
    } catch (e) {
        console.log(e)
    }
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
  @import '~@/assets/styles/public'
  .pos_rank{
    border_run()
    display: flex
    flex: 1
    .pos{
      flex: 1
    }
  }
</style>
