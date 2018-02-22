import React, { Component } from "react";
import Images from "../Constants/Images";
import { Image } from "react-native";
import Container from "../Components/Container";
import Text from "../Components/Text";
import Session from "../Lib/Session";
import {Actions} from "react-native-router-flux";


const timeout = ms => new Promise(res => setTimeout(res, ms))

class Launch extends Component {

    async componentDidMount() {
        await timeout(250)
        await Session.restoreSession()
        if (Session.hasValidSession()) {
            Actions.reset('menu')
            return
        }
        Actions.reset('login')
    }

    render() {
        return (
            <Container center>
                <Image source={Images.ssas} />
                <Text>Loading...</Text>
            </Container>
        );
    }
}

export default Launch;
