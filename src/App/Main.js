import React, {Component} from 'react'
import {View, Linking} from 'react-native'
import {MessageBar, MessageBarManager} from 'react-native-message-bar'

import Hazards from '../Lib/Hazards'
import Navigation from './Navigation'

export default class Main extends Component
{
    constructor(props) {
        super(props)
        this.handleUrl = this.handleUrl.bind(this)
        this.handleOpenURL = this.handleOpenURL.bind(this)
    }
    componentDidMount() {
        // Register the alert located on this master page
        // This MessageBar will be accessible from the current (same) component, and from its child component
        // The MessageBar is then declared only once, in your main component.
        MessageBarManager.registerMessageBar(this.refs.alert)
        Linking.addEventListener('url', this.handleOpenURL)
    }

    componentWillUnmount() {
        // Remove the alert located on this master page from the manager
        MessageBarManager.unregisterMessageBar()
        Linking.removeEventListener('url', this.handleOpenURL)
    }

    handleOpenURL(event) {
        return this.handleUrl(event.url)
    }

    async handleUrl(url) {
        if (!url) {
            return
        }
        await Hazards.parseAndAddFromUrl(url)
        this.navigator.navigate('Survey', {title: 'New Submission'})
    }

    render() {
        return <View style={{flex:1}}>
            <Navigation ref={nav => this.navigator = nav._navigation} />
            <MessageBar ref="alert" />
        </View>
    }
}