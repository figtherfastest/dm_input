import axios from "axios"
import * as urls from './url'
export function getInputSceneDatas(data) {
  var url = urls.beautifulFills.data
  console.log(data)
  return axios.put(url,data).then((res)=>{
    return Promise.resolve(res)
  })
}


// export function getInputSceneDatas(data){
//   var url = urls.beautifulFills.data
//   var param = data
//   console.log(param)
//   return jsonp(url, param, options)
// }
