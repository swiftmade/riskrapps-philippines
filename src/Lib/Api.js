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
                return response.data.token
            })
            .catch(() => {
                throw new Error('Invalid e-mail or password.')
            })
    }

    refreshToken() {
        return axios.post('refresh_token?token=' + Session.get('auth.token'))
            .then((response) => {
                let token = response.headers.authorization
                token = token.replace('Bearer ', '')
                return token
            })
    }

    async downloadSurvey() {
        // TODO: Add token if found
        await RNFS.downloadFile({
            fromUrl: this.surveyJsonUrl(),
            toFile: RNFS.DocumentDirectoryPath + '/' + Session.get('domain') + '.json'
        }).promise
    }
}

export default new Api()