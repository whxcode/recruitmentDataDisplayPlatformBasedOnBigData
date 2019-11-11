import axios from 'axios';

/*******全局配置********/
//post下的headers
axios.defaults.headers.post['Content-Type'] = 'application/json';

let urls = '' //请求ip
export default {
  postHttp (url,datas) {
    return axios({
      url: urls + url,
      method: 'POST',
      timeout: 3000,
      data: JSON.stringify(datas)
    })
  },
  getHttp(url,datas) {
    return axios({
      url: urls + url,
      method: 'GET',
      timeout: 10000,
      data: JSON.stringify(datas)
    })
  },
  getEcharts() {
    return axios({
      url: '../../static/ech.json',
      method: 'GET',
      timeout: 3000,
    })
  },

  getMap() {
    return axios({
      url: '../../static/china.json',
      method: 'GET',
      timeout: 3000,
    })
  },
}
