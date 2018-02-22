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
}



export default new Session()