import * as _ from 'lodash'
import {AsyncStorage} from 'react-native'

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

    async destroy() {
        this.session = null
        await AsyncStorage.removeItem(sessionKey)
    }

    get(key) {
        return _.get(this.session, key)
    }
}



export default new Session()