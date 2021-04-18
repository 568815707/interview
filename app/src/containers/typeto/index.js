/**
 * 录入题库
 * @author：osenki
 * @description: 展示外部题库中的题目，并且可以加入到公司内部题库中
 * 
 */

import React from 'react'
import { Table, Button, message, Modal, Select, Input, Pagination } from 'antd'
import moment from 'moment'
import { Header } from 'styled'
import {request, filter} from 'utils'
import jsonData from 'utils/tech.json'

const {k2n} = jsonData

const Option = Select.Option;
const { TextArea } = Input;

export default class Typeto extends React.Component {
  constructor() {
    super()
    this.state = {
      data: [],
      visible: false,
      id: '',
      level: '0',
      answer: '',
      total: 0,
      checkValues: '',
      page: 1 // 默认为第一页
    }
    this.columns = [{
      title: '序号',
      dataIndex: 'id'
    },{
      title: '题目',
      dataIndex: 'question'
    }, {
      title: '类型',
      dataIndex: 'type',
      render: text =>  k2n[text.toLowerCase()],
      filters: filter()
    }, {
      title: '作者',
      dataIndex: 'author'
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      render: (text, _) => <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
    }, {
      title: '操作',
      render: (_, record) => 
        <div>
          <Button 
            type='danger' 
            style={{ width: 100, marginBottom: 10 }} 
            onClick={this.delFun.bind(this, record.id)}
          >
            删除
          </Button>
          <br/>
          <Button 
            type='primary' 
            style={{ width: 100 }}
            onClick={this.add_internal.bind(this, record.id)}
          >
            加入题库
          </Button>
        </div>
    }]
  }

  // 加入内部题库
  add_internal (id) {
    this.setState({
      visible: true,
      id
    })
  }

  // 筛选类型
  checkedFunc = (pagination, filters, sorter) => {
    request({
      url: '/filter_data',
      method: 'POST',
      data: {
        page: this.state.page,
        checkValues: filters.type
      }
    }).then( ({data, count}) => {
      this.setState({
        data,
        total: count,
        checkValues: filters.type
      })
    })
  }

  // 删除
  delFun (id) {
    request({
      url: '/del',
      method: 'POST',
      data: {
        id,
        page: this.state.page
      }
    }).then( ({ code, data }) => {
      code === 200 ? message.success('删除成功') : message.error('删除失败') 
      this.setState({ 
        data
      })
    })
  }

  // 翻页
  changePage = (page, pageSize) => {
    if (this.state.checkValues) {
      request({
        url: '/filter_data',
        method: 'POST',
        data: {
          page,
          checkValues: this.state.checkValues
        }
      }).then( ({ data, count }) => {
        this.setState({
          data,
          count,
          page
        })
      })
    } else {
      request({
        url: '/get_internal',
        method: 'GET',
        data: {
          page
        }
      }).then( ({ data, count }) => {
        this.setState({
          data,
          total: count,
          page
        })
      })
    }
  }

  // 提交
  handleOk = _ => {
    const { page, answer, id, level } = this.state
    request({
      url: '/add_internal',
      method: 'POST',
      data: {
        answer,
        id,
        level,
        page
      }
    }).then(({ data, count }) => {
      message.success('加入成功')
      this.setState({
        data,
        page,
        total: count,
        visible: false
      })

    }
    )
  }

  componentDidMount() {
    request({
      url: '/get_internal',
      method: 'GET',
      data: {
        page: this.state.page
      }
    }).then( ({ data, count }) => {
      data && this.setState({ data: data, total: count })
    })
  }

  render() {
    const { data, id, visible, total, page } = this.state
    return (
      <div>
        <Header 
          title='录入题库'
        />
        <Table
          rowKey='id'
          dataSource={data}
          columns={this.columns}
          pagination={false}
          onChange={this.checkedFunc}
          locale={{ 
            filterConfirm: '确定',
            filterReset: '重置' 
          }}
        />

        <Pagination 
          style={{ float: 'right', marginTop: 20 }} 
          current={page} 
          total={total} 
          onChange={this.changePage}
        />

        <Modal
          title='添加至内部题库'
          visible={visible}
          width={460}
          okText='确定'
          cancelText='取消'
          onOk={this.handleOk}
          onCancel={_ => this.setState({ visible: false })}
          destroyOnClose={true}
        >
          <div>
            <span>选择等级：</span>
            <Select 
              onChange={value => this.setState({ level: value })} 
              style={{ width: 300 }}
              defaultValue='0'
            >
              <Option value='0'>初级</Option>
              <Option value='1'>中级</Option>
              <Option value='2'>高级</Option>
            </Select>
            <br/>
            <span>答案：</span>
            <TextArea
              placeholder='请输入答案'
              autosize={{ minRows: 2, maxRows: 6 }}
              style={{ width: 300, top: 20, left: 28, }}
              onChange={ e => this.setState({ answer: e.target.value })}
            />
          </div>
        </Modal>
      </div>
    )
  }
}