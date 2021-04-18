import React from 'react'
import {Layout, Divider, Avatar} from 'antd'
import {withRouter} from 'react-router-dom'
import styled from 'styled-components'
import Flex from 'styled/flex'
import Menu from 'components/menu'
import Animation from 'components/animation'
import {getCookies} from 'utils/checkAuth'
import request from 'utils/request'
import logoimg from './logo.png'

const {Header, Sider, Content}  = Layout

@withRouter
export default class Interview extends React.Component{
  constructor(){
    super()
    this.state = {collapsed:false}
  }

  handleCollapse = ()=>{
    this.setState(prev=>({
      collapsed: !prev.collapsed
    }))
  }

  handleOut = ()=>{
    const data = getCookies(['name', 'user'])
    request({
      url: '/logout',
      method: 'POST',
      data
    }).then(res=>{
      if(res){
        localStorage.setItem('token', '')
        localStorage.setItem('token_exp', '');
        this.props.history.push('/')
      }
    })
  }

  render(){
    const {collapsed} = this.state

    const exstyle = this.props.location.pathname === '/interview' ? {display: 'flex'} : {}

    const logo = collapsed
      ? (
        <Logo>
          <Avatar src={logoimg} style={{ marginLeft: '30%' }}/>
        </Logo>
      )
      : (
        <User>
          <Avatar src={logoimg} style={{ marginRight: 10 }}/>
          <span>{getCookies('name')}</span>
          <Divider type='vertical'/>
          <LogoutBtn onClick={this.handleOut}>退出</LogoutBtn>
        </User>
      )

    return (
      <Layout style={{minHeight: '100vh'}}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={this.handleCollapse}
          width={200}
          collapsedWidth={80}
        >
          {logo}
          <Menu />
        </Sider>
        <Layout>
          <Animation>
          <Content
            style={{padding:'10 30 20', ...exstyle}}
          >{this.props.children}</Content>
          </Animation>
        </Layout>
      </Layout>
    )
  }
}

const Logo = styled(Flex)`
  height: 64px;
  background-color: #001529;
  flex-direction: column;
  justify-content: center;
`

const User = styled.div`
  color: #fff;
  height: 64px;
  font-weight: bold;
  line-height: 64px;
  font-size: 16px;
  margin-left: 16px;
`
const LogoutBtn = styled.a`
  cursor: pointer;
  font-size: 14px;
`
