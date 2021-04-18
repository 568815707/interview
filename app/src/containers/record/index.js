import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import {Table, Button, Popover, Tag} from 'antd'
import {Header, Flex, TextEls} from 'styled'
import {request, getCookies} from 'utils'
import Cell from './cell'

const status = {
  '0': <Tag color='blue' style={{width:60}}>待审核</Tag>,
  '1': <Tag color='green' style={{width:60}}>通过</Tag>,
  '2': <Tag color='red' style={{width:60}}>未通过</Tag>,
  '3': <Tag color='gold' style={{width:60}}>已提交</Tag>
}

export default class Record extends React.Component{
  constructor(){
    super()

    this.state = {
      dataSource: [],
      loading: true,
      pagination: {
        current: 1
      },
      editRecord: ''
    }

    this.author = getCookies('name')

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
        render: text => <Popover content={text} trigger="hover" placement="bottomLeft"><Text>{text}</Text></Popover>
      },
      {
        title: '答案',
        dataIndex: 'answer',
        key: 'answer',
        render: (text, record) => {
          if(this.state[record.id]){
            return <Cell data={record} handle={this.handleEdit} key={Math.random()}/>
          }else{
            return <Popover content={text} trigger="hover" placement="bottomLeft"><Text title={text}>{text}</Text></Popover>
          }
        }
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
        title: '状态',
        align: 'center',
        dataIndex: 'audit',
        key:'audit',
        width: 150,
        render: text => status[text],
        filters: [
          {text: '待审核', value: 0},
          {text: '通过', value: 1},
          {text: '未通过', value: 2},
          {text: '已提交', value: 3}
        ]
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'op',
        key: 'op',
        width: 100,
        render: (text, record) => {
          const status = record.audit
          if(status === 0){
            return (
              <span>
                <Button type="danger" onClick={() => this.handleDelRecord(record.id)} style={{width:'100%'}}>删除</Button>
              </span>
            )
          }else if(status === 1){
            return '不能操作'
          }else if(status === 2 || status === 3){
            return (
              <span>
                  <Button type="danger" style={{width:'100%',marginBottom: 5}} onClick={() => this.handleDelRecord(record.id)}>删除</Button>
                  <Button style={{width:'100%',marginBottom: 5}} onClick={_ => this.setState({[record.id]: true})}>修改</Button>
                  <Button type="primary" onClick={()=>this.handle2EditRecord(record)}>再次提交</Button>
              </span>
            )
          }
        }
      }
    ]
  }

  componentDidMount(){
    this._getRecordData()
  }

  _getRecordData = (data) => {
    return request({
      url: '/get_record_data',
      data: {...data, author: this.author}
    }).then(res => {
      res && this.setState({dataSource: res.data, loading: false, pagination: {total: res.total, current: Number(res.page)}})
    })
  }

  handleChange= (pagination, filters) => {
    const { current } = pagination
    let { audit } = filters
    audit = audit ? audit.join() : ''
    this._getRecordData({
      page: current,
      audit
    }).then(_ => this.filters = audit)
  }

  handleDelRecord = (id) => {
    return request({
      url: '/del_record',
      method: 'POST',
      data: {id, page: this.state.pagination.current, author: this.author, audit: this.filters}
    }).then(res => {
      res && this.setState({dataSource: res.data, loading: false, pagination: {total: res.total, current: Number(res.page)}})
    })
  }

  handleEdit = (id, answer) => {
    let {dataSource} = this.state
    const index = dataSource.findIndex(item => item.id === id)
    dataSource[index] = {...dataSource[index], answer}
    this.setState({[id]: false, dataSource})
  }

  handle2EditRecord = ({id, answer}) => {
    request({
      url: '/edit_record',
      method: 'POST',
      data: {id, answer}
    }).then(res => {
      let {dataSource} = this.state
      const index = dataSource.findIndex(item => item.id === id)
      dataSource[index] = {...dataSource[index], audit: 3}
      this.setState({dataSource})
    })
  }

  render(){
    const {dataSource, loading, pagination} = this.state

    return (
      <Flex column>
        <Header title="提交记录" />

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
  max-width: 250px;

  @media screen and (min-device-width: 1500px) {
    max-width: 400px;
  }
`
