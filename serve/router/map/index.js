const KoaRouter = require(`koa-router`)
const map = new KoaRouter()
const mysql = require(`mysql`)
const fetch = require(`node-fetch`)
const fs = require(`fs`)
const util = require(`util`)
const readFile = util.promisify(fs.readFile)
console.log(fetch)

const baseData = [
  {
  name: '北京',
  value: 5.3
  },
  {
    name: '天津',
    value: 3.8
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
    value: 0.1
  }
];

baseData.forEach(item => {
  item.value = 0
})


map.get(`/companycount`,async ctx => {
  try {
    let j = await fetch(`http://172.17.6.101:8080/companycount`)
    let data = await j.json()

    baseData.forEach(item => {

      data.forEach(i => {
          if(i.name.includes(item.name)) {
            item.value = i.count
            return
          }
      })

    })


    ctx.body = baseData
  } catch (e) {

  }
})

map.get(`/jobcount`,async ctx => {
  try {
    let j = await fetch(`http://172.17.6.101:8080/jobcount`)
    let data = await j.json()
    data.forEach(item => {
      item.value = item.count
      delete item.count
    })
    data.sort((a,b) => {
      return b.value - a.value
    })
    ctx.body = data
  } catch (e) {

  }
})

map.get(`/pos`,async ctx => {
      try {
        let text = await readFile('http://172.17.6.101:8080/info?location=全国')

        ctx.body = text
      }catch (e) {
        console.log(0,e)
      }
})

module.exports = {
  map,
}

