import axios from "axios"
import Session from "./Session"
import RNFS from "react-native-fs"
import { SERVER_URL } from "react-native-dotenv"

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

    configureFromSession() {
        this.setDomain(Session.get('domain'))
    }

    meta() {
        return axios.get('meta').then((response) => {
            return response.data
        })
    }

    surveyJsonUrl() {
        return axios.defaults.baseURL + '/survey_download'
    }

    login(credentials) {
        if (!credentials.email || !credentials.password) {
            throw new Error('Fill in both e-mail and password fields!')
        }
        return axios.post('login', credentials)
            .then((response) => {
                return response.data
            })
            .catch((e) => {
                throw new Error(this._loginErrorFromHttpStatus(
                    e.response.status
                ))
            })
    }

    _loginErrorFromHttpStatus(status) {
        const errors = {
            404: 'Resource not found.',
            429: 'Too many attempts. Please try again later.',
            500: 'Internal error occured.',
            422: 'Invalid e-mail or password.',
        }
        return errors.hasOwnProperty(status)
            ? errors[status]
            : 'Unknown error occured.'
    }

    refreshToken() {
        return axios.get('refresh_token?token=' + Session.get('auth.token'))
            .then((response) => {
                return response.data.token.replace('Bearer ', '')
            })
            .catch(() => {
                throw new Error('Session expired!')
            })
    }

    requestHeaders() {
        const headers = {}
        if(Session.get('auth.token')) {
            headers['Authorization'] = 'Bearer ' + Session.get('auth.token')
        }
        return headers
    }

    async downloadSurvey() {
        // TODO: Add token if found
        const result = await RNFS.downloadFile({
            fromUrl: this.surveyJsonUrl(),
            headers: this.requestHeaders(),
            toFile: RNFS.DocumentDirectoryPath + '/' + Session.get('domain') + '.json'
        }).promise

        if (result.statusCode !== 200) {
            throw new Error('Survey could not be downloaded. Code: ' + result.statusCode)
        }
    }
}

export default new Api()