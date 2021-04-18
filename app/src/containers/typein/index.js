import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import {List, Button, Divider, message} from 'antd'
import Form from './form'
import {k2n} from 'utils/tech.json'
import * as Styled from 'styled'
import * as Utils from 'utils'

const {Flex, TextEls, Header } = Styled
const {backTop, getCookies, request} = Utils

export default class TypeIn extends React.Component{

  constructor(){
    super()
    this.state = {
      questions: [],
      editQuestion: ''
    }
  }

  handleAddQuestion = (question)=>{
    let questions = [...this.state.questions, question]
    this.setState({questions})
  }

  handleEditQuestion = (question)=>{
    let {editQuestion, questions} = this.state
    if(editQuestion !== question){
      backTop()
      questions = questions.filter(item => item !== question)
      this.setState({editQuestion: question, questions})
    }
  }

  handleDelQuestion = (question)=>{
    let questions = this.state.questions
    questions = questions.filter(item => item !== question)

    this.setState({questions})
  }

  getName = (techid,spotid)=>{
    let tech = teches.filter(item => item.id === techid)[0]
    if(!spotid){
      return tech.name
    }
    let spot = tech.spots.filter(item => item.id === spotid)[0]

    return spot.name
  }

  getLevelName = (id)=>{
    return levels[id]
  }

  handleCommit = ()=>{
    const {questions} = this.state

    if(!questions.length){
      message.warn('请先添加问题, 在进行提交')
      return
    }

    request({
      method: 'POST',
      url: '/typein',
      data:{
        questions,
        author: getCookies('name'),
        create_time: moment().unix()
      }
    }).then(res=>{
      if(res){
        this.setState({questions:[]})
      }
    })
  }

  render(){

    return (
      <Container column>
        <Flex column>
          <Form handleAddQuestion={this.handleAddQuestion} editQuestion={this.state.editQuestion}/>
        </Flex>
        <Divider/>
        <Flex column>
          <Header title="列表展示">
            <Button type="primary" onClick={this.handleCommit} disabled={!this.state.questions.length}>提交</Button>
          </Header>
          <List
            itemLayout="horizontal"
            dataSource={this.state.questions}
            renderItem={item=>(
              <List.Item actions={[<a onClick={()=>this.handleDelQuestion(item)}>删除</a>,<a onClick={()=>this.handleEditQuestion(item)}>修改</a>]}>
              <List.Item.Meta
                title={k2n[item.techspotid]}
                description={<Text>{item.question}</Text>}
              />
              <ItemContent align="center">
                <h3>{k2n[item.techid]}</h3>
                <Divider type='vertical'/>
                <h3>{k2n[item.level]}</h3>
                <Divider type='vertical'/>
                <h3>{getCookies('name')}</h3>
              </ItemContent>
            </List.Item>
            )}
          >
          </List>
        </Flex>
      </Container>
    )
  }
}


const Container = styled(Flex)`
  height: 100%;

  & .ant-row.ant-form-item{
    margin-bottom: 0;
  }
`
const ItemContent = styled(Flex)`
  & h3{
    display: inline-block;
    margin: 0;
  }
`
const Text = styled(TextEls)`
  width: 400px;
  margin-left: 20px;
`

