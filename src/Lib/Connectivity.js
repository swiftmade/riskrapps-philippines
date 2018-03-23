import {NetInfo} from 'react-native'

class Connectivity {

    constructor() {

        this.firstChecked = false
        this.waitFirst = new Promise((resolve) => {
            this.firstResolver = resolve
        })

        NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => {
            this.isConnected = isConnected
            if ( ! this.firstChecked) {
                this.firstResolver()
                this.firstChecked = true
            }
        })
    }

    async check() {
        await this.waitFirst
        return this.isConnected
    }
    
}

export default new Connectivity()