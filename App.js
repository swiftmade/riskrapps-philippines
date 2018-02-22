/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {View} from 'react-native'
import {Router, Stack, Scene} from 'react-native-router-flux'
import {MessageBar, MessageBarManager} from 'react-native-message-bar'

import Launch from './src/Containers/Launch'
import Login from './src/Containers/Login'
import Menu from './src/Containers/Menu'
import Survey from './src/Containers/Survey'
import Upload from './src/Containers/Upload'

export default class App extends Component {

  componentDidMount() {
    // Register the alert located on this master page
    // This MessageBar will be accessible from the current (same) component, and from its child component
    // The MessageBar is then declared only once, in your main component.
    MessageBarManager.registerMessageBar(this.refs.alert);
  }

  componentWillUnmount() {
    // Remove the alert located on this master page from the manager
    MessageBarManager.unregisterMessageBar();
  }

  render() {
    return <View style={{ flex: 1 }}>
        <Router>
          <Stack key="root" hideNavBar={true}>
            <Scene key="launch" component={Launch} />
            <Scene key="login" component={Login} />
            <Scene key="menu" component={Menu} />
            <Scene key="survey" component={Survey} />
            <Scene key="upload" component={Upload} />
          </Stack>
        </Router>
        <MessageBar ref="alert" />
      </View>;
  }
}