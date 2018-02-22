import axios from 'axios'
import { SERVER_URL } from 'react-native-dotenv'

class Api {
    
    constructor() {
        this.baseUrl = null
    }

    _configure() {
        axios.defaults.baseURL = this.baseUrl
    }

    setDomain(domain) {
        this.baseUrl = SERVER_URL.replace('{domain}', domain) + '/api/v1'
        this._configure()
    }

    setDomainFromSession(session) {
        // TODO: Implement
        this._configure()
    }

    connect() {
        return axios.get('connect').then((response) => {
            return respones.data
        })
    }
}

export default new Api()