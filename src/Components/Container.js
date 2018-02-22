import React, {Component} from 'react'
import {KeyboardAvoidingView, StyleSheet} from 'react-native'
import Colors from '../Constants/Colors'

class Container extends Component {
    render() {

        const classes = [styles.container]

        if (this.props.center) {
            classes.push(styles.center)
        }

        return (
            <KeyboardAvoidingView behavior="padding" style={classes.concat([this.props.style])}>
                {this.props.children}
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    flex: 1
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Container