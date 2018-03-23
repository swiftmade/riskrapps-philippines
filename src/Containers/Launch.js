import React, { Component } from "react";
import Images from "../Constants/Images";
import { Image } from "react-native";
import Container from "../Components/Container";
import Text from "../Components/Text";
import Api from "../Lib/Api";
import Session from "../Lib/Session";
import {Actions} from "react-native-router-flux";
import Connectivity from '../Lib/Connectivity';

const timeout = ms => new Promise(res => setTimeout(res, ms))

class Launch extends Component {

    async componentDidMount() {
        await timeout(250)
        await Session.restoreSession()
        // Sets the active domain, and if exists, token
        Api.configureFromSession()        
        
        // Check the current session
        if (!Session.hasValidSession()) {
            // There's no session.
            // Go to the initial connection page.
            Actions.reset('login')
            return
        }

        // If the session indicates that authentication is necessary
        // And the user is not currently authenticated, authenticate first.
        if (Session.needsAuthentication()) {
            Actions.reset('auth')
            return
        }
        
        if (Session.isAuthenticated()) {
            // Check internet connectivity...
            const isConnected = await Connectivity.check()
            if (isConnected) {
                try {
                    // If connected, refresh the token first.
                    await Session.refreshToken()
                } catch(error) {
                    // Token could not be refreshed, logout the user
                    await Session.logout()
                    // Go back to login if needed.
                    if (Session.needsAuthentication()) {
                        Actions.reset('auth')
                        return
                    }
                }
            }
        }
        // Otherwise, just go to the menu.
        Actions.reset('menu')
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
