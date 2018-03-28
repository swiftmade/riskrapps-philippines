import React, { Component } from "react";
import Colors from "../Constants/Colors";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import { View, Text} from "react-native";

export default class extends Component {
    render() {
        return <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Icon name="user" size={20} style={{ color: Colors.textMute, marginTop: 6, marginRight: 8 }} />
            <Text style={{ color: "#333" }}>Guest User</Text>
        </View>        
    }
}