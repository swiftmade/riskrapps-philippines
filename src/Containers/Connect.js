import React, { Component } from "react";
import {NavigationActions} from 'react-navigation';

import Container from '../Components/Container'
import Images from "../Constants/Images";
import Colors from "../Constants/Colors";
import Button from "../Components/Button";
import Text from "../Components/Text";
import ConnectFlow from '../Flows/ConnectFlow'
import Alerts from "../Lib/Alerts"

import {
  Image,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";


class Connect extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            domain: '',
            busy: false
        }
        this.connect = this.connect.bind(this)
    }

    async connect() {

        if ( ! this.state.domain.trim()) {
            Alerts.error('Domain is empty', 'Please enter your domain before pressing connect.')
            return
        }

        this.setState({busy: true})

        try {
            await ConnectFlow.handle(this.state.domain)
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: "Launch",})],
                })
            )
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
        return <Button login title="Connect" onPress={this.connect} />
    }
    
    render() {
        return <Container center>
            <Image source={Images.ssas} />
            <Text title>RiskRapps</Text>

            <View style={styles.inputWrapper}>
              
              <TextInput editable={!this.state.busy}
              value={this.state.domain}
              onChangeText={(text) => this.setState({domain: text})}
              style={styles.input}
              placeholderTextColor="rgba(255,255,255,0.5)"
              underlineColorAndroid="transparent"
              placeholder="enter domain"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false} />
              
              <Text style={styles.domain}>.riskrapps.net</Text>
            </View>
            {this.renderButton()}
          </Container>
    }
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.lightBlue,
    flexDirection: "row",
    marginTop: 32,
    marginBottom: 8,
    maxWidth: 340,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 22,
    textAlign: "center",
    marginRight: 4,
    backgroundColor: Colors.lightBlue,
  },
  domain: {
    fontSize: 22,
    color: Colors.darkBlue,
    margin: 8,
  }
});

export default Connect