import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flex from './flex'

const Wrapper = styled(Flex)`
  height: 40px;
  line-height: 40px;
  align-items: center;
  padding-left: 10px;
  margin: 10px 0 20px 20px ;

  & h2{
    margin-bottom: 0;
    display: inline-block;
  }

  & .auto-left{
    margin-left: auto;
    margin-right: 10px;
  }
`

const Header = ({title, children}) => {
  return (
    <Wrapper>
      <h2>{title}</h2>
      <div className="auto-left">
        {children}
      </div>
    </Wrapper>
  )
}

Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
}

export default Header
