import axios from "axios"
import * as urls from './url'

export function getIndexDatas(data) {
  var url = urls.projectIndex.data+"startTime="+data.startTime+"&"+"endTime="+data.endTime
  console.log(url)
  return axios.get(url,data).then((res) => {
    return Promise.resolve(res)
  })
}
export function goBeautyFillResult(data) {
  var url = urls.projectIndex.goBeautyFillResult+data
  return axios.get(url,data).then((res) => {
    return Promise.resolve(res)
  })
}
