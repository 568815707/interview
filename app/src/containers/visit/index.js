/**
 * 面试邀约记录
 * @author: osenki
 */

import React from 'react'
import { Header } from 'styled'
import { Table, message, Button, Divider, Input, Select, DatePicker, Row, Col  } from 'antd'
import { k2n, teches, levels, meetingRoom } from 'utils/tech.json'
import locale from 'components/locale/zh'
import moment from 'moment'
import { request } from 'utils'

const Option = Select.Option;

export default class Visit extends React.Component{
  constructor() {
    super()
    this.state = {
      visible: false,
      data: [],
      name: '',
      jobs: 'Web',
      level: 0,
      time: '',
      home: 'mke',
      page: 1,
      total: 0,
    }
    this.columns = [
      {
        title: '序号',
        dataIndex: 'id'
      },
      {
        title: '面试者',
        dataIndex: 'name',
      },
      {
        title: '面试岗位',
        dataIndex: 'jobs',
        render: (text, _) => <span>{k2n[text]}</span>
      },
      {
        title: '面试题级别',
        dataIndex: 'level',
        render: (text, _) => <span>{k2n[text]}</span>
      },
      {
        title: '面试时间',
        dataIndex: 'time',
        render: (text, _) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
        title: '会议室',
        dataIndex: 'hoom',
        render: (text, _) => <span>{k2n[text]}</span>
      },
      {
        title: '操作',
        render: (text, record) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button 
              style={{ width: 80, marginBottom: 10 }} 
              type='primary'
              onClick={this.missFunc.bind(this, record)}
              disabled = {Number(record.status) === 0 ? false : true}
            >
              爽约
            </Button>
            <Button 
              style={{ width: 80 }} 
              type='danger'
              onClick={this.deleteFunc.bind(this, record)}
            >
              删除
            </Button>
          </div>
        )
      }
    ]
  }

  componentDidMount() {
    request({
      url: '/get_visit',
      method: 'GET',
      data: {
        page: this.state.page
      }
    }).then( ({ data, total }) => {
      this.setState({ data, total })
    })
  }

  /**
   * 爽约
   */
  missFunc ({ id, name, jobs, time }) {
    const { page } = this.state
    request({
      url: '/is_miss',
      method: 'POST',
      data: {
        id,
        name,
        jobs,
        time,
        type: 'miss',
        page
      }
    }).then(({ data, total }) => {  
      this.setState({ data, total, page })
    })
  }

   /**
   * 删除
   * @param {Number} id 
   */
  deleteFunc ({ id }) {
    const { page } = this.state
    request({
      url: '/is_miss',
      method: 'POST',
      data: {
        id,
        type: 'delete',
        page
      }
    }).then(({ data, total }) => {  
      this.setState({ data, total, page })
    })
  }

  // 岗位
  jobsFunc () {
    return (
      <Select defaultValue='Web' style={{ width: 200, marginRight: 20 }} onChange={value => this.setState({ jobs: value })}>
        {
          teches.map( value => 
            <Option key={value} value={value}>{k2n[value]}</Option>  
          )
        }
      </Select>
    )
  }

  // 会议室
  meetingRooms () {
    return (
      <Select defaultValue='mke' style={{ width: 200, marginRight: 20 }} onChange={value => this.setState({ home: value })}>
      {
        meetingRoom.map( value => 
          <Option key={value} value={value}>{k2n[value]}</Option>  
        )
      }
    </Select>
    )
  }

  // 面试题级别
  levelFunc() {
    return (
      <Select defaultValue='0' style={{ width: 200, marginRight: 20 }} onChange={value => this.setState({ level: value })}>
        {
          levels.map( value => 
            <Option key={value} value={value}>{k2n[value]}</Option>  
          )
        }
      </Select>
    )
  }

  // table变化
  changeFun = (pagination) => {
    this.setState({ page: pagination.current })
    request({
      url: '/get_visit',
      method: 'GET',
      data: {
        page: pagination.current
      }
    }).then( ({ data, total }) => {
      this.setState({ data, total })
    })
    
  }

  // 添加面试信息
  handleSubmit = _ =>{
    const { name, jobs, level, time, home } = this.state
    if (name && time && home) {
      request({
        url: '/add_visit',
        method: 'POST',
        data: {
          name,
          jobs,
          level,
          time,
          home
        }
      }).then( ({ data, total }) => {
        this.setState({ data, total})
      })
    } else {
      message.error('请填写完整面试信息')
    }
  }
  render() {
    const { data, total, page } = this.state

    return(
      <div>
         <Header 
          title='面试邀约记录'
        />
        <Divider orientation="left">填写面试信息</Divider>
        <Row style={{ marginLeft: 20 }}>
          <Col span={6}>
            <span>面试者：</span>
            <Input placeholder='请输入面试者姓名' style={{ width: 200, marginRight: 20 }} onChange={e => this.setState({ name: e.target.value })}/>
          </Col>

          <Col span={6}>
            <span>面试岗位：</span>
            {this.jobsFunc()}
          </Col>

          <Col span={6}>
            <span>面试题级别：</span>
            {this.levelFunc()}
          </Col>

          <Col span={6}>
           <span>面试时间：</span>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择时间"
              onChange={(value, dataString) => this.setState({ time: dataString })}
              locale={locale}
              style={{ marginRight: 20 }}
            />
          </Col>

        </Row>
        <Row style={{ margin: '10px 20px' }}>
          <Col span={6}>
            <span>会议室：</span>
            {this.meetingRooms()}
          </Col>
          <Col span={18}>
            <Button type='primary' style={{ marginLeft: 50, marginTop: 18 }} onClick={this.handleSubmit} >添加</Button>
          </Col>
        </Row>

        <Divider/>
        <Table
          rowKey='id'
          columns={this.columns}
          dataSource={data}
          pagination={{
            current: page,
            defaultPageSize: 10,
            total: total
          }}
          loading={!data}
          onChange={this.changeFun}
          total={total}
        />
      </div>
    )
  }
}