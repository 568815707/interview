/**
 * filename: configuration flex
 * author: lyf
 */

 import React from 'react'
 import PropTypes from 'prop-types'
 import styled from 'styled-components'


const justifyValues = ['center', 'space-around', 'space-between', 'flex-start', 'flex-end']
const alignValues = ['stretch', 'center', 'baseline', 'flex-start', 'flex-end']

const Flex = (props) => {
    const { children, ...restProps} = props;
    return <Container {...restProps}>{children}</Container>
}

Flex.propTypes = {
    column: PropTypes.bool,
    auto: PropTypes.bool,
    align: PropTypes.oneOf(alignValues),
    justify: PropTypes.oneOf(justifyValues),
    className: PropTypes.string,
    children: PropTypes.node
}

const Container = styled.div`
    display: flex;
    flex: ${({auto}) => (auto ? '1 1 auto' : 'initial')};
    flex-direction: ${({column}) => (column ? 'column' : 'row')};
    align-items: ${({align}) => align};
    justify-content: ${({justify}) => justify};
    min-height: 0;
    min-width: 0;
`

export default Flex