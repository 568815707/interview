import {
  createGlobalStyle
} from 'styled-components'

const GlobalStyle = createGlobalStyle `
  *{
      box-sizing: border-box;
  }

  html,body{
    width:100%;
    min-height: 100vh;
    margin:0;
    padding:0;
  }

  body{
    color: ${({theme}) => theme.base_color};
    /* 字体抗锯齿 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ul {
    padding-left: 0;
    list-style: none;
  }

  #root{
    height: 100%;
    width: 100%;
    min-width: 1080px;
  }
`

export default GlobalStyle
