/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {Router, Stack, Scene} from 'react-native-router-flux'

import Launch from './src/Containers/Launch'
import Login from './src/Containers/Login'
import Menu from './src/Containers/Menu'
import Survey from './src/Containers/Survey'
import Upload from './src/Containers/Upload'

export default class App extends Component {
  render() {
    return <Router>
        <Stack key="root" hideNavBar={true}>
          <Scene key="launch" component={Launch} />
          <Scene key="login" component={Login} />
          <Scene key="menu" component={Menu} />
          <Scene key="survey" component={Survey} />
          <Scene key="upload" component={Upload} />
        </Stack>
      </Router>;
  }
}