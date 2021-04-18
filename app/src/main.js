import React from 'react'
import {render} from 'react-dom'
import {ThemeProvider} from 'styled-components'
import GlobalStyles from 'styled/global'
import * as theme from 'styled/theme'

import App from './App'

render(
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <GlobalStyles />
          <App />
        </React.Fragment>
      </ThemeProvider>
    ,
    document.getElementById('root')
)
