import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import Colors from "../Constants/Colors";

export default class extends Component {

    render() {
        const classes = [
            styles.text
        ]

        if (this.props.bold) {
            classes.push(styles.bold)
        }

        if (this.props.title) {
            classes.push(styles.title)
        }
        
        if (this.props.wrapTitle) {
            classes.push(styles.wrapTitle)
        }        

        return (
            <Text style={classes.concat([this.props.style])}>{this.props.children}</Text>
        );
    }
}

const styles = StyleSheet.create({
  text: {
      color: Colors.textColor,
      marginTop: 8,
      fontSize: 14,
  },
  bold: {
    fontWeight: 'bold'
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
  },
  wrapTitle: {
    fontSize: 20,
    width:0,
    flexGrow:1,
    flexBasis: 'auto',
    maxWidth: 235,
  }  
});
