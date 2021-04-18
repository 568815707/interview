import React from 'react'
import Loadable from 'react-loadable';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import {hasload} from 'utils'

import Auth from 'containers/home/auth'
import Interview from 'containers/interview'


import Home from 'containers/home'
// const Home = Loadable({
//   loader: () => import(/* webpackChunkName: "home" */ 'containers/home'),
//   loading: () => <div>loading....</div>,
// });


import HomePage from 'containers/homepage'
import TypeIn from 'containers/typein'
import Produce from 'containers/produce'
import Audit from 'containers/audit'
import TypeTo from 'containers/typeto'
import Record from 'containers/record'
import Visit from 'containers/visit'
import Manage from 'containers/manage'

import error from './404.jpg'

const App =  () => (
  <Router>
      <Switch>
        <Route path="/" exact render={()=> hasload() ? <Redirect to='/interview' /> : <Home />} />
        <Auth>
            <Interview>
                <Switch>
                  <Route exact path="/interview"  component={HomePage}/>
                  <Route path="/interview/typein" component={TypeIn} />
                  <Route path="/interview/produce" component={Produce} />
                  <Route path="/interview/audit" component={Audit} />
                  <Route path="/interview/record" component={Record} />
                  <Route path="/interview/typeto" component={TypeTo}/>
                  <Route path="/interview/visit" component={Visit}/>
                  <Route path="/interview/manage" component={Manage}/>
                  <Route render={()=>            
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'rgb(51,48,57)'}}>
                    <img src={error} style={{ marginLeft: '35%' }}/>
                  </div>} />
                </Switch>
            </Interview>
        </Auth>
      </Switch>
  </Router>
)

export default App
