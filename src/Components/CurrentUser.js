import React, { Component } from "react";
import Colors from "../Constants/Colors";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import { View, Text} from "react-native";

import Session from '../Lib/Session'

export default class extends Component {

    constructor(props) {
        super(props);
        let name = 'Guest'
        if (Session.isAuthenticated()) {
            name = Session.get('auth.first_name') + ' ' + Session.get('auth.last_name')
        }
        this.state = {name}
    }
    
    render() {
        return <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Icon name="user" size={20} style={{ color: Colors.textMute, marginRight: 8 }} />
            <Text style={{ marginTop:0, color: "#333" }}>{this.state.name}</Text>
        </View>        
    }
}