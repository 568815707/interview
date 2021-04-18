import React from 'react'
import {Form, Radio, Button, Col, Divider, Icon, List} from 'antd'
import {Flex, Header} from 'styled'
import jsonData,{teches, levels, k2n} from 'utils/tech.json'
import {request} from 'utils'

const {Item} = Form
const RadioGroup = Radio.Group
@Form.create()
export default class Produce extends React.Component{

    constructor(){
      super()

      this.state = {
        print: false
      }
    }

    _createRadios = (data)=>{
      return data.map(item => (
        <Radio value={item} key={item}>{k2n[item]}</Radio>
      ))
    }

    handlePreview = () => {
      const {form} = this.props
      const {tech, level} = form.getFieldsValue()
      request({
        url: '/get_preview_data',
        data: {level, tech: jsonData[tech].join()}
      }).then(res => {
        this.setState({data: res.data, print: true})
      })
    }

    create_print = () => {
      const {data} = this.state
      return Object.keys(data).map(tech => (
        <List
          key={tech}
          header={<h2>{k2n[tech]}</h2>}
          dataSource={data[tech]}
          renderItem={(item,index) => (
            <List.Item key={item.id}>
              <span>{index+1}.</span>{item.question}
            </List.Item>
          )}
        />
      ))
    }

    print = () => {

      const title = k2n[this.props.form.getFieldsValue().tech]
      const pf = document.getElementById('print_iframe')
      if(pf){
        document.body.removeChild(pf)
      }
      const iframe = document.createElement('iframe')
      document.body.appendChild(iframe)
      iframe.style = 'position: fixed; left: -200%;height:100%;width:100%;'
      iframe.id = 'print_iframe'

      const el = document.getElementById('print').innerHTML
      const bg = `<div style='position:fixed;top:35%;left:10%;opacity:0.1;font-size:10rem;font-weight:bold;transform:rotate(-45deg)'>BLUED</div>`
      iframe.contentWindow.document.write(`${bg}<h2 style='text-align:center;'>${title}(面试题)</h2>${el}`)
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
    }

    render(){
      const {getFieldDecorator} = this.props.form
      const {print} = this.state
      const formItemlayoput = {
        labelCol: {span: 3},
        wrapperCol: {span: 21}
      }

      const print_dom = print
        ? (
          <React.Fragment>
            <Divider/>
            <Header title='试题预览'>
              <Button type='primary' onClick={this.handlePreview} style={{marginRight: 10}}><Icon type="reload" theme="outlined" />换一批</Button>
              <Button type='primary' onClick={this.print}><Icon type="printer" theme="outlined" />打印</Button>
            </Header>
            <Flex column id='print' style={{marginLeft: 30}}>
              {this.create_print()}
            </Flex>
          </React.Fragment>
        ): ''

      return (
        <Flex column>
          <Header title='生成试题'/>
          <Form>
            <Item label="岗位" {...formItemlayoput}>
              {getFieldDecorator('tech', {initialValue: teches[0]})(
                <RadioGroup>
                  {this._createRadios(teches)}
                </RadioGroup>
              )}
            </Item>
            <Item label="级别" {...formItemlayoput}>
              {getFieldDecorator('level', {initialValue: levels[0]})(
                <RadioGroup>
                  {this._createRadios(levels)}
                </RadioGroup>
              )}
            </Item>
            <Item>
              <Col span={3} style={{textAlign: 'right'}}>
                <Button type="primary" style={{marginRight: '-24px'}} onClick={this.handlePreview}>生成</Button>
              </Col>
            </Item>
          </Form>
          {print_dom}
        </Flex>
      )
    }
}
