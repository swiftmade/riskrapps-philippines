import {Linking} from 'react-native'
import {App} from "ssas-app-core"

import Hazards from '../Lib/Hazards'
import {openHazardSurvey} from '../Flows/LaunchFlow'

export default class AppMain extends App
{
    constructor(props) {
        super(props)
        this.handleUrl = this.handleUrl.bind(this)
        this.handleOpenURL = this.handleOpenURL.bind(this)
    }
    
    componentDidMount() {
        super.componentDidMount()
        Linking.addEventListener('url', this.handleOpenURL)
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        Linking.removeEventListener('url', this.handleOpenURL)
    }

    handleOpenURL(event) {
        return this.handleUrl(event.url)
    }

    async handleUrl(url) {
        if (!url) {
            return
        }
        const hazard = await Hazards.parseAndAddFromUrl(url)
        openHazardSurvey(this.navigator, hazard)
    }

}