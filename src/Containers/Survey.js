import React, {Component} from 'react'
import {WebView, Alert} from 'react-native'
import RNFS from 'react-native-fs'
import Files from '../Lib/Files'
import Container from '../Components/Container'
import {Actions} from 'react-native-router-flux'

class Survey extends Component
{
    constructor(props) {
        super(props)
        this.intercept = this.intercept.bind(this)
    }

    intercept(request) {
        if (request.url.indexOf("www/index.html") >= 0) {
            this.confirmLeave()
            return false    
        }
        return true
    }

    async confirmLeave() {

        Alert.alert(
          "Do you really want to leave?",
          "Any unsaved progress will be LOST. Do you want to exit now?",
          [
            { text: "Yes, Leave", onPress: () => Actions.pop() },
            { text: "Cancel", onPress: () => {}, style: "cancel" }
          ],
          { cancelable: true }
        );
    }

    getSource() {
        const baseUri = Files.wwwFolder()
        const uri = baseUri + '/survey.html?lang=en&json=' + Files.surveyJson()
        return { uri, baseUri }
    }
    
    render() {
        return <WebView source={this.getSource()} bounces={false} onShouldStartLoadWithRequest={this.intercept} style={{marginTop:20}} />;
    }
}

export default Survey