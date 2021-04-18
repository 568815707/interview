import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import {Table, Button, Popover} from 'antd'
import {Header, Flex, TextEls} from 'styled'
import {request, filter} from 'utils'
import jsonData from 'utils/tech.json'

const {k2n} = jsonData

export default class Audit extends React.Component{
  constructor(){
    super()

    this.state = {
      dataSource: [],
      loading: true,
      pagination: {
        current: 1
      }
    }

    this.filters = ''

    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 100
      },
      {
        title: '题目',
        dataIndex: 'question',
        key: 'question',
        width: 400,
        render: text => <Popover content={text} trigger="hover" placement="bottomLeft"><Text>{text}</Text></Popover>
      },
      {
        title: '答案',
        dataIndex: 'answer',
        key: 'answer',
        render: text => <Popover content={text} trigger="hover" placement="bottomLeft"><Text>{text}</Text></Popover>
      },
      {
        title: '类型',
        align: 'center',
        dataIndex: 'type',
        width: 150,
        key:'type',
        render: text =>  k2n[text.toLowerCase()],
        filters: filter()
      },
      {
        title: '作者',
        align: 'center',
        width: 150,
        dataIndex: 'author',
        key:'author'
      },
      {
        title: '提交时间',
        align: 'center',
        dataIndex: 'create_time',
        key:'create_time',
        width: 200,
        render: text => moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'op',
        key: 'op',
        width: 100,
        render: (text, record) => (
          <span>
            <Button type="danger" style={{width:'100%',marginBottom: 5}} onClick={()=>this.handleAudit(record.id, true)}>通过</Button>
            <Button type="primary" onClick={()=>this.handleAudit(record.id)} >不通过</Button>
          </span>
        )
      }
    ]
  }

  componentDidMount(){
    this._getPageData()
  }

  _getPageData = (data) => {
    return request({
      url: '/get_audit_data',
      data
    }).then(res => {
      res && this.setState({dataSource: res.data, loading: false, pagination: {total: res.total, current: Number(res.page)}})
    })
  }

  handleChange = (pagination, filters)=>{
    const { current } = pagination
    let { type } = filters
    type = type ? type.join() : ''

    this._getPageData({
      page: current,
      type
    }).then(_ => this.filters = type)
  }

  handleAudit = (id, audit) => {
    request({
      method: 'POST',
      url: '/audit',
      data: {
        id,
        audit,
        page: this.state.pagination.current,
        type: this.filters
      }
    }).then(res => {
      res && this.setState({dataSource: res.data, loading: false, pagination: {total: res.total, current: res.page}})
    })
  }

  render(){
    const {dataSource, loading, pagination} = this.state

    return (
      <Flex column>
        <Header title="审核" />
        <Table
          columns={this.columns}
          rowKey="id"
          dataSource={dataSource}
          pagination={pagination}
          onChange={this.handleChange}
          loading={loading}
          locale={{filterConfirm: '确定', filterReset: '重置'}}
        />
      </Flex>
    )
  }
}


const Text = styled(TextEls)`
  max-width: 400px;
`
