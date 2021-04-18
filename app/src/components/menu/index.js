import React from 'react'
import {Menu, Icon} from 'antd'
import {withRouter} from 'react-router-dom'
import {getCookies} from 'utils'

const {Item} = Menu

@withRouter
export default class SiderMenu extends React.Component{
  handleClick = ({key})=>{
    this.props.history.push(`/interview/${key}`)
  }

  render(){
    const is_super = getCookies('is_super')

    let context = is_super ?
      [
        <Item key="audit">
          <Icon type='audit'/>
          <span>题目审核</span>
        </Item>
        ,
        <Item key="manage">
          <Icon type='user'/>
          <span>用户管理</span>
        </Item>
      ]
     : ''

    return(
      <Menu
        theme='dark'
        onClick={this.handleClick}
      >
        <Item key="typein">
          <Icon type='edit'/>
          <span>内部题库录入</span>
        </Item>
        <Item key="typeto">
          <Icon type='desktop'/>
          <span>外部题库展示</span>
        </Item>
        <Item key="produce">
          <Icon type='copy'/>
          <span>笔试题生成</span>
        </Item>
        <Item key="visit">
          <Icon type='message'/>
          <span>面试邀约</span>
        </Item>
        <Item key="record">
          <Icon type='upload'/>
          <span>提交记录</span>
        </Item>
        {context}
      </Menu>
    )
  }
}
