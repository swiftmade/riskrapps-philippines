import React, {Component} from 'react'
import {KeyboardAvoidingView, StyleSheet} from 'react-native'
import Colors from '../Constants/Colors'

import {Container as NContainer, Content} from 'native-base'

class Container extends Component {
    render() {

        const classes = [styles.container]

        if (this.props.center) {
            classes.push(styles.center)
        }

        return (
            <NContainer style={{backgroundColor:'white'}}>
                <Content contentContainerStyle={classes}>
                    {this.props.children}
                </Content>
            </NContainer>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    minHeight: '100%',
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Container