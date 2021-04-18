import React from 'react'
import { Table, Button } from 'antd'
import { Flex, Header } from 'styled'
import { request, getCookies } from 'utils'
import Cell from './cell'

const rules = {
  0: '普通用户',
  1: '超级用户'
}

export default class Manage extends React.Component{
  constructor(){
    super()
    this.state = {
      loading: true,
      dataSource: [],
      pagination: {
        current: 1
      }
    }

    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 100
      },
      {
        title: '账号',
        dataIndex: 'user',
        key: 'user',
        align: 'center'
      },
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '权限',
        dataIndex: 'is_super',
        key: 'is_super',
        width: 200,
        render: (text,record) => {
          if(this.state[record.id]){
            return <Cell rules={rules} handle={this.handleRuleChange} data={record}/>
          }else{
            return rules[text]
          }
        }
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'op',
        key: 'op',
        width: 100,
        render: (text, record) => (
          <span>
            {
              getCookies('user') === record.user
              ? ''
              : (
                <div>
                  <Button type="danger" style={{width:'100%', marginBottom: 5}} onClick={()=>this.handleDelUser(record.id)}>删除</Button>
                  <Button type='primary' style={{width:'100%'}} onClick={_=> this.setState({[record.id]: true})}>修改权限</Button>
                </div>
                )
            }
          </span>
        )
      }
    ]
  }

  componentDidMount(){
    this._getUserData()
  }

  _getUserData = (data) => {
    request({
      url: '/get_user_data',
      data
    }).then(res => {
      res && this.setState({dataSource: res.data, loading: false, pagination: {total: res.total, current: Number(res.page)}})
    })
  }

  handleChange = (pagination) => {
    const {current} = pagination
    this._getUserData({
      page: current
    })
  }

  handleDelUser = (id) => {
    request({
      url: '/del_user',
      method: 'POST',
      data: {id, page: this.state.pagination.current}
    }).then(res => {
      res && this.setState({dataSource: res.data, loading: false, pagination: {total: res.total, current: Number(res.page)}})
    })
  }

  handleRuleChange = (id, is_super) => {
    request({
      url: '/edit_user',
      method: 'POST',
      data: {id, is_super}
    }).then(res => {
      let {dataSource} = this.state
      const index = dataSource.findIndex(item => item.id === id)
      dataSource[index] = {...dataSource[index], is_super}
      this.setState({[id]: false, dataSource})
    })
  }

  render(){
    const {dataSource, loading, pagination} = this.state

    return (
      <Flex column>
        <Header title="用户管理"/>
        <Table
          columns={this.columns}
          rowKey="id"
          dataSource={dataSource}
          pagination={pagination}
          onChange={this.handleChange}
          loading={loading}
        />
      </Flex>
    )
  }
}
