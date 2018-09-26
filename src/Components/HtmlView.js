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

    _handleStateChange(event) {
        if(event.url.indexOf('/index.html') >= 0) {
            this.props.navigation.goBack(null)
        }
    }
 
    render() {
        return <View style={{flex:1}}>
                {this.renderiOSStatusBarMargin()}
                <CustomWebview source={this.props.source}
                bounces={false}
                domStorageEnabled={true}
                onNavigationStateChange={this._handleStateChange.bind(this)}
                allowUniversalAccessFromFileURLs={true}  />
        </View>
    }

    renderiOSStatusBarMargin() {
        return null
    }
}

export default HtmlView