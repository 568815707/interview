import React from 'react'
import {TransitionMotion, spring} from 'react-motion'
import {Flex} from 'styled'

export default class Animation extends React.Component{

  render(){
    return (
      <TransitionMotion
        defaultStyles={[{key:'web',style: {moveY: -100}}]}
        styles={[{key:'web',style: {moveY: spring(0, {stiffness: 90, damping: 7})}}]}
        // willEnter={this.willEnter}
        // willLeave={this.willLeave}
        // didLeave={this.didLeave}
      >
        {instyles => {

          return  instyles[0] ? <Flex style={{transform:`translate(0,${instyles[0].style.moveY}%)`, height:'100%'}} >{this.props.children}</Flex> : null
        }}
      </TransitionMotion>
    )
  }
}
