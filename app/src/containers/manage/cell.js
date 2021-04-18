import React from 'react'
import PropTypes from 'prop-types'
import {Tag, Select} from 'antd'
import {Flex} from 'styled'

const {Option} = Select

export default class Cell extends React.Component{
  constructor({data}){
    super()
    this.state = { val: data.is_super}
  }

  createOptions = () => {
    const {rules} = this.props
    return Object.keys(rules).map(item => {
      return <Option key={item} value={Number(item)}>{rules[item]}</Option>
    })
  }

  render(){
    const {data} = this.props
    const {val} = this.state
    return (
      <Flex align="center">
        <Select value={val} onSelect={_ => this.setState({val: _})}>
          {this.createOptions()}
        </Select>
        <Tag
          color="#87d068"
          onClick={() => this.props.handle(data.id, val)}
          style={{marginLeft: 5}}
        >确定</Tag>
      </Flex>
    )
  }
}


Cell.propTypes = {
  rules: PropTypes.object.isRequired,
  handle: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}
