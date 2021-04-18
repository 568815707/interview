import jsonData from 'utils/tech.json'
const {k2n, teches} = jsonData

export const filter = ()=>{
  let filters = []
  let spots =  teches.reduce((total,item)=>{
    const spots = jsonData[item]
    if(spots){
      total = total.concat(spots)
    }
    return total
  },[])

  spots = new Set(spots)
  for (let spot of spots) {
    filters.push({text: k2n[spot], value: spot})
  }
  return filters
}
