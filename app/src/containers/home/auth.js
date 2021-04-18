import React from 'react'
import { withRouter } from 'react-router-dom'
import { hasload, getCookies } from 'utils'
import error from '../../404.jpg'
@withRouter
export default class Auth extends React.Component{
    render(){
        const {pathname} = this.props.location
        const is_super = getCookies('is_super')
        const unPermissonPath = ['/interview/manage', '/interview/audit']
        if(!hasload()){
          this.props.history.push('/')
          return null
        }
        if( Number(is_super) !== 1 && unPermissonPath.includes(pathname)) {
        return (
            <div style={{ width: '100%', height: '100%', backgroundColor: 'rgb(51,48,57)'}}>
                <img src={error} style={{ marginLeft: '35%', marginTop: '10%'}}/>
            </div>
        )
        }
        // 校验
        return this.props.children
    }
}
