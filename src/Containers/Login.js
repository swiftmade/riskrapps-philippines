import React, {Component} from "react"
import Images from '../Constants/Images'
import Colors from '../Constants/Colors'
import Container from '../Components/Container'
import Button from '../Components/Button'
import Text from '../Components/Text'
import PortalLogo from '../Components/PortalLogo'
import Session from '../Lib/Session'
import Alerts from '../Lib/Alerts'
import {NavigationActions} from 'react-navigation'

import {
  Image,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from "react-native";

class Login extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            busy: false,
            email: null,
            password: null,
        }
        this.reset = this.reset.bind(this)
        this.login = this.login.bind(this)
    }

    async login() {
        if (this.state.busy) {
            return
        }
        this.setState({busy: true})
        try {
            await Session.login(this.getCredentials())
        } catch(error) {
            Alerts.error('Oops', error.toString())
            this.setState({busy: false})
            return
        }
        // Login successful! Go back to launch
        this.reset()
    }

    reset() {
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: "Launch",})],
            })
        )        
    }

    getCredentials() {
        return {
            email: this.state.email,
            password: this.state.password,
        }
    }    
    
    render() {

        const instanceName = Session.get(
            "settings.name.en",
            Session.get('settings.url')
        )

        return <Container center>
            <PortalLogo />
            <Text title>Login to { instanceName }</Text>

            <View style={[styles.inputWrapper, {marginTop:16}]}>

              <Text style={styles.label}>email</Text>
              
              <TextInput editable={!this.state.busy}
              value={this.state.email}
              onChangeText={(text) => this.setState({email: text})}
              style={styles.input}
              keyboardType="email-address"
              placeholderTextColor="rgba(0,0,0,0.5)"
              underlineColorAndroid="transparent"
              placeholder="user@example.com"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false} />
              
            </View>
            <View style={[styles.inputWrapper, {marginBottom:32}]}>

              <Text style={styles.label}>password</Text>
              
              <TextInput editable={!this.state.busy}
              value={this.state.password}
              onChangeText={(text) => this.setState({password: text})}
              style={styles.input}
              placeholderTextColor="rgba(0,0,0,0.5)"
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              placeholder="password"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false} />
              
            </View>
            {this.renderButton()}
            {this.renderCancelButton()}
          </Container>;
    }
    
    renderButton() {
        if (this.state.busy) {
            return <ActivityIndicator size="large" color={Colors.darkBlue} style={{marginTop:15}} />
        }
        return <Button login title="Connect" onPress={this.login} />
    }

    renderCancelButton() {
        try {
            if(this.props.navigation.state.params.optional) {
                return <Button link title="Cancel" onPress={this.reset} />
            }
        } catch(e) {
            return null
        }
    }
}


const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.lightBlue,
    flexDirection: "row",
    marginBottom: 4,
    maxWidth: 340,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 14,
    textAlign: "left",
    marginLeft: 4,
    paddingTop: 8,
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.darkBlue,
    margin: 8,
    width: 80,
    padding: 8,
  }
});

export default Login