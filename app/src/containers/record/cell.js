import React from 'react'
import PropTypes from 'prop-types'
import {Input, Tag} from 'antd'
import {Flex} from 'styled'

const {TextArea} = Input

export default class Cell extends React.Component{
  constructor(props){
    super()
    this.state = {answer: props.data.answer}
  }

  handleChange(e){
    this.setState({answer: e.target.value})
  }

  render(){
    const {answer} = this.state
    const {id} = this.props.data
    return (
      <Flex align="center">
        <TextArea style={{width: '90%', maxHeight: '100%', marginRight: 10}} value={answer} onChange={_ => this.handleChange(_)}></TextArea>
        <Tag color="#87d068" onClick={() => this.props.handle(id, answer)}>确定</Tag>
      </Flex>
    )
  }
}

Cell.propTypes = {
  handle: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}
