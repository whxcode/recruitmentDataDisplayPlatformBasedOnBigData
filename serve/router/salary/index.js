const sql = `SELECT job_salary_handle FROM jobfinally;`
const mysql = require(`mysql`)
const fs = require(`fs`)
const link = mysql.createConnection({
  host:`172.17.6.101`,
  port:'3306',
  user:'root',
  password:'123456',
  database:'job',
})
global.query =  function(sql) {
  return new Promise((req,res) => {
    link.query(sql,(err,data) => {
      if(err) res(err)
      req(data)
    })
  })
}
let count = 0
let datas
;fs.readFile(__dirname + '/datas.json',async (err,data) => {
    console.log(err)
    datas = JSON.parse(data).slice(0,5)
    console.log(datas.length)

    let asyncArr = []
    for(let i = 0;i < datas.length;i ++) {
        asyncArr.push(query(`update jobfinally set job_salary_handle_int=10`))

    }

  for await( let val of asyncArr) {
      console.log(val)
    }

    link.end()
  })

  //console.log(datas)



;(async () => {
 /*   let datas = await query(sql)
    console.log(datas[0],datas[1])
    datas = datas.map(item =>  item.job_salary_handle ? parseInt(item.job_salary_handle) : 0)
    console.log(datas)*/



   /* fs.writeFile(__dirname + '/datas.json',JSON.stringify(datas),err => {
      console.log(err)
      console.log(link.end())
    })*/
})()
