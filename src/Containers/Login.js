import React, { Component } from "react";
import Images from "../Constants/Images";
import Colors from "../Constants/Colors";
import Container from "../Components/Container";
import Button from "../Components/Button";
import Text from "../Components/Text";
import ConnectLogic from '../Logic/ConnectLogic'
import { Actions } from "react-native-router-flux";
import Alerts from "../Lib/Alerts"

import {
  Image,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";

class Login extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            domain: '',
            busy: false
        }

        this.login = this.login.bind(this)
    }

    async login() {
        this.setState({busy: true})

        try {
            await ConnectLogic.handle(this.state.domain)
            Actions.reset("menu");
        } catch (error) {
            Alerts.error('Oops', error.toString())
            // TODO: Show error
            this.setState({busy: false})
        }
    }
    
    renderButton() {
        if (this.state.busy) {
            return <ActivityIndicator size="large" color={Colors.darkBlue} style={{marginTop:15}} />
        }
        return <Button login title="Connect" onPress={this.login} />
    }
    
    render() {
        return <Container center>
            <Image source={Images.ssas} />
            <Text title>School Safety Self Assessment Portal</Text>

            <View style={styles.inputWrapper}>
              
              <TextInput editable={!this.state.busy}
              value={this.state.domain}
              onChangeText={(text) => this.setState({domain: text})}
              style={styles.input}
              placeholderTextColor="rgba(0,0,0,0.4)"
              placeholder="enter domain"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false} />
              
              <Text style={styles.domain}>.riskrapps.net</Text>
            </View>
            {this.renderButton()}
          </Container>;
    }
}

const styles = StyleSheet.create({
    inputWrapper: {
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.darkBlue,
        flexDirection: 'row',
        padding:16,
        marginTop:32,
        marginBottom: 8,
    },
    input: {
        flex: 1,
        color: Colors.darkBlue,
        borderBottomWidth: 1,
        fontSize: 22,
        textAlign: 'center',
        borderColor: 'rgba(0,0,0,0.4)',
        marginRight: 4,
    },
    domain: {
        marginTop:0,
        fontSize: 22,
        color: Colors.darkBlue,
    },
})

export default Login