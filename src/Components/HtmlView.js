import React, {Component} from 'react'
import {Alert} from 'react-native'
import RNFS from 'react-native-fs'
import Files from '../Lib/Files'
import {Platform, View, BackHandler} from 'react-native'
import CustomWebview from './CustomWebview'
import {Container, Content} from 'native-base'

class HtmlView extends Component
{
    constructor(props) {
        super(props)
        this.intercept = this.intercept.bind(this)
        this.rejectBackButton = this.rejectBackButton.bind(this)
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.rejectBackButton)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.rejectBackButton)
    }

    rejectBackButton() {
        return !this.props.hasOwnProperty('allowBackButton')
    }

    intercept(request) {
        if (request.url.indexOf("www/index.html") >= 0) {
            this.props.navigation.goBack(null)
            return false
        }
        return true
    }

    
    render() {
        return <View style={{flex:1}}>
                {this.renderiOSStatusBarMargin()}
                <CustomWebview source={this.props.source}
                bounces={false}
                domStorageEnabled={true}
                onShouldStartLoadWithRequest={this.intercept}
                allowUniversalAccessFromFileURLs={true} onError={() => {
                    this.props.navigation.goBack(null)
                }}  />
        </View>
    }

    renderiOSStatusBarMargin() {
        if (Platform.OS !== 'ios') {
            return null
        }
        return <View style={{height:20}} />
    }
}

export default HtmlView