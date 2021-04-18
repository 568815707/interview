import axios from 'axios'
import {message} from 'antd'

// axios.defaults.baseURL = 'http://localhost:9000'

const request = ({url, method='GET', data})=>{

  url = '/view' + url
  let config = method === 'GET' ? {url, method: 'GET', params:data} : {url, method, data}
  const token = localStorage.getItem('token')
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
  axios.defaults.withCredentials = true

  return axios(config).then(res=>{
    if(res.data.code === Number(200)){ // 请求数据成功
      message.success('操作成功')
      return res.data
    }else{ // 请求数据失败
      message.error(res.data.msg)
      return
    }
  }).catch(res=>{
    message.error('操作失败')
  })
}

export default request
