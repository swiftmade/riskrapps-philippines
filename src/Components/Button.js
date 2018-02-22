import React, {Component} from 'react'
import Colors from "../Constants/Colors";
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'

export default class extends Component {

    render() {

        const classes = ['button']

        if (this.props.login) {
            classes.push('login')
        }

        return <View style={classes.map(cls => styles[cls + "_container"])}>
            <TouchableOpacity onPress={this.props.onPress}>
              <Text style={classes.map(cls => styles[cls+"_text"])}>
                {this.props.title.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>;
    }
}

const styles = StyleSheet.create({
    button_container: {},
    button_text: {},
    login_container: {
        padding: 16,
        width: '100%',
        backgroundColor: Colors.lightBlue
    },
    login_text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});