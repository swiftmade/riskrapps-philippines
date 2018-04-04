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
            this.confirmLeave()
            return false    
        }
        return true
    }

    async confirmLeave() {

        if ( ! this.props.sensitive) {
            return this.props.navigation.goBack(null)
        }

        const promise = new Promise((resolve, reject) => {
        Alert.alert(
          "Do you really want to leave?",
          "Any unsaved progress will be LOST. Do you want to exit now?",
          [
            { text: "Yes, Leave", onPress: () => {resolve(true); this.props.navigation.goBack(null)} },
            { text: "Cancel", onPress: () => {resolve(false)}, style: "cancel" }
          ],
          { cancelable: true }
        );
        
        })

        return promise
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