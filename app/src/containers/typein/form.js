import React from 'react'
import PropTypes from 'prop-types'
import {Form, Radio, Input, Col, Button} from 'antd'
import {Header} from 'styled'
import jsonData, {teches, k2n, levels} from 'utils/tech.json'

const {Item} = Form
const RadioGroup = Radio.Group
const {TextArea} = Input

@Form.create()
export default class TypeinForm extends React.PureComponent{

  constructor(){
    super()
    this.state={
      techid: teches[0]
    }
  }

  static getDerivedStateFromProps({editQuestion,form}, state){
    let derState = {}
    if(editQuestion && editQuestion!== state.editQuestion){
      const {techid, techspotid, level, question, answer} = editQuestion
      form.setFieldsValue({
        tech: techid, techspot: techspotid, level, question, answer
      })
      derState = {editQuestion, techid}
    }

    return derState
  }

  handleChange = ({target})=>{
    const techid = target.value
    this.setState({techid},()=>{
      this.props.form.setFieldsValue({'techspot':jsonData[techid][0]})
    })
  }

  handleOnSubmit=(evt)=>{
    const {handleAddQuestion, form} = this.props
    evt.preventDefault();
    form.validateFields((err, {tech, techspot, level, question, answer}) => {
      if (!err) {
        form.resetFields(['question', 'answer'])
        handleAddQuestion({techid: tech, techspotid: techspot, level, question, answer})
      }
    });
  }

  createRadios=(data)=>{
    return data.map(item => (
      <Radio value={item} key={item}>{k2n[item]}</Radio>
    ))
  }

  getTechSpots=()=>{
    const {techid} = this.state
    return jsonData[techid];
  }

  render(){
    const {getFieldDecorator} = this.props.form

    const formItemlayoput = {
      labelCol: {span: 3},
      wrapperCol: {span: 21}
    }

    // 技术点改变
    const techSpots = this.getTechSpots()

    return (
      <Form
        style={{width:'100%'}}
        onSubmit={this.handleOnSubmit}
      >
        <Header title="问题添加">
            <Button type="primary" htmlType='submit'>添加</Button>
        </Header>
        <Item label="岗位" {...formItemlayoput}>
          {getFieldDecorator('tech',{initialValue: this.state.techid})(
            <RadioGroup onChange={this.handleChange}>
              {this.createRadios(teches)}
            </RadioGroup>
          )}
        </Item>
        <Item label="技术点" {...formItemlayoput}>
          {getFieldDecorator('techspot',{initialValue: techSpots[0]})(
            <RadioGroup>
              {this.createRadios(techSpots)}
            </RadioGroup>
          )}
        </Item>
        <Item label="级别" {...formItemlayoput}>
          {getFieldDecorator('level',{initialValue: levels[0]})(
            <RadioGroup>
              {this.createRadios(jsonData.levels)}
            </RadioGroup>
          )}
        </Item>
        <Item label="问题录入" {...formItemlayoput}>
          {getFieldDecorator('question',{
            rules: [{ required: true, message: '请输入问题!' }]
          })(
            <TextArea
              autosize={{minRows:5,maxRows:10}}
              style={{width:'80%',marginTop:15,resize:'none'}}></TextArea>
          )}
        </Item>
        <Item label="输入答案" {...formItemlayoput}>
          {getFieldDecorator('answer',{
            rules: [{ required: true, message: '请输入答案!' }]
          })(
            <TextArea
              autosize={{minRows:5,maxRows:10}}
              style={{width:'80%',marginTop:15, resize:'none'}}></TextArea>
          )}
        </Item>
      </Form>
    )
  }
}

TypeinForm.propTypes = {
  handleAddQuestion: PropTypes.func.isRequired,
  editQuestion: PropTypes.func.isRequired
}
