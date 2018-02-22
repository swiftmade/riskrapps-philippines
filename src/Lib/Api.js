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

    meta() {
        return axios.get('meta').then((response) => {
            return response.data.settings
        })
    }

    surveyJsonUrl() {
        return axios.defaults.baseURL + '/survey_download'
    }
}

export default new Api()