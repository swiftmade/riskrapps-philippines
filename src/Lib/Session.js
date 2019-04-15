import * as _ from 'lodash'
import RNFS from 'react-native-fs'
import { Platform, AsyncStorage } from 'react-native'

import Api from './Api'
import Themes from '../Constants/Themes'

const sessionKey = '@SSAS:Session'

class Session {

    constructor() {
        this.session = null
    }

    async restoreSession() {
        this.session = await this.load()
    }

    hasValidSession() {
        return this.session !== null
    }

    /**
     * Checks if the connected portal instance requires authentication
     * If that's the case, checks if the user is currently authenticated.
     */
    needsAuthentication() {
        if (!this.session) {
            return false
        }
        return this.get("settings.requires_authentication") && !this.isAuthenticated();
    }

    isAuthenticated() {
        if (!this.session) {
            return false
        }
        return this.session.auth
    }

    isMissingSurvey() {
        return !this.get('survey_downloaded', false)
    }

    async load() {
        const value = await AsyncStorage.getItem(sessionKey)
        if (value !== null){
            // We have data!!
            return JSON.parse(value)
        }
        return null
    }

    async set(session) {
        this.session = session
        await AsyncStorage.setItem(sessionKey, JSON.stringify(session))
    }

    async update(data) {
        return await this.set({...this.session, ...data})
    }

    async destroy() {
        this.session = null
        await AsyncStorage.removeItem(sessionKey)
    }

    get(key, def = null) {
        if (key === 'settings.title.en' || key === 'settings.name.en') {
            return 'RADaR App';
        }
        return _.get(this.session, key, def)
    }

    async login(credentials) {
        const user = await Api.login(credentials)
        await this.update({auth: user})
    }

    async refreshToken() {
        const token = await Api.refreshToken()
        await this.update({
            auth: {
                ...this.session.auth,
                token: token
            }
        })
    }

    async logout() {
        await this.update({auth: null})
    }

    getTheme() {
		return Themes.default
    }

    bgPath() {
        const filename = this.get('domain') + '.png'
        if (Platform.OS === 'android') {
            return 'file:///android_asset/' + filename
        }
        // For iOS
        return 'file://' + RNFS.MainBundlePath + '/' + filename
    }
}



export default new Session()