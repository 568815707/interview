export const hasload = ()=>{
  const cookies = _getCookies()
  // 有这个cookie,切值不为空
  return cookies.hasOwnProperty('user') && cookies['user']
}

const _getCookies = ()=>{
  const cookies = document.cookie;
  return cookies.split(';').reduce((total,next)=>{
    let key = next.split('=')[0]
    let val = next.split('=')[1]

    if(val){
      total[key.trim()] = val.trim()
    }
    return total
  },{})
}
export const getCookies = (key)=>{
  const cookies = _getCookies()

  if(key instanceof Array){
    return key.reduce((total,item)=>{
      total[item] = decodeURIComponent(cookies[item])
      return total
    },{})
  }
  return decodeURIComponent(cookies[key] ? cookies[key] : '')
}
