import React, {Component} from 'react'
import querystring from 'query-string'
import {View, BackHandler} from 'react-native'
import {NavigationActions} from 'react-navigation'

import Alerts from '../Lib/Alerts'
import CustomWebview from './CustomWebview'

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
            const message = this._extractMessageFromUrl(event.url)
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: "Menu", params: {
                        message
                    }})],
                })
            )            
        }
    }

    _extractMessageFromUrl(url) {
        const query = url.substr(url.indexOf("?") + 1, url.length)
        const params = querystring.parse(query)
        if (!params.message) {
            return null
        }
        return params
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