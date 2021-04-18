import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export const TextEls = (props) => {
  const { children, ...rest} = props
  return <Container {...rest}>{children}</Container>
}

TextEls.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

// 文本超出显示省略号
const Container = styled.div`
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
