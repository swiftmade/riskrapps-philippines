import React, {Component} from 'react'
import Colors from "../Constants/Colors";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'

export default class extends Component {

    renderIcon(style) {
        if (!this.props.icon) {
            return null
        }
        return <Icon name={this.props.icon} color="#fff" style={[style, styles.icon]} />
    }

    render() {

        const classes = ["button"]

        if (this.props.login) {
            classes.push('login')
        }
        if (this.props.menu) {
          classes.push('menu')
        }        
        if (this.props.menu_primary) {
            classes.push("menu_primary");
        }
        if (this.props.menu_grey) {
          classes.push("menu_grey");
        }
        if (this.props.link) {
          classes.push("link");
        }                
        
        const textClasses = classes.map(cls => styles[cls + "_text"]);
        
        return <View style={styles.button_container}>
            <TouchableOpacity style={[styles.wrapper].concat(classes.map(cls => styles[cls + "_container"]))} onPress={this.props.onPress}>
              <View style={styles.contents}>
                {this.renderIcon(textClasses)}
                <Text style={textClasses}>
                  {this.props.title.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>;
    }
}

const styles = StyleSheet.create({
    contents: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        padding: 16
    },
    icon: {
        marginTop:1,
        marginRight: 8,
        fontSize: 16,
    },
    button_container: {
        width: "100%",
        maxWidth: 340,
    },
    button_text: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        color: "#fff"
    },
    login_container: {
        backgroundColor: Colors.darkGreen
    },
    login_text: {},
    menu_container: {
        marginBottom: 8,
        backgroundColor: Colors.lightBlue
    },
    menu_text: {},
    menu_primary_container: {
        backgroundColor: Colors.darkGreen
    },
    menu_primary_text: {},
    menu_grey_container: {
        backgroundColor: '#e9e9e9'
    },
    menu_grey_text: {
        color: Colors.textColor
    },
    link_container: {
        padding:8,
        backgroundColor: '#fff'
    },
    link_text: {
        fontSize: 12,
        color: '#b4b4b4'
    }
});