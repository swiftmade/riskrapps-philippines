import React, {Component} from 'react'
import {WebView} from 'react-native'
import RNFS from 'react-native-fs'
import Files from '../Lib/Files'
import Container from '../Components/Container'

class Survey extends Component
{
    getSource() {
        const baseUri = Files.wwwFolder()
        const uri = baseUri + '/survey.html?json=' + Files.surveyJson()
        return { uri, baseUri }
    }
    
    render() {
        return <WebView source={this.getSource()} />
    }
}

export default Survey