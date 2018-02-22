import Api from '../Lib/Api'
import Session from "../Lib/Session";
import RNFS from "react-native-fs";

class ConnectLogic {

    async handle(domain) {
        
        Api.setDomain(domain)

        const session = await Api.meta()
        session.domain = domain

        await Promise.all([
            Session.set(session),
            this.downloadSurvey(),
            this.downloadIcon(),
        ])
    }

    async downloadIcon() {
        // TODO: Ignore if the icon download fails, it's not critical
        const icon = Session.get('settings.icon_medium')
        if ( ! icon) {
            return
        }
        await RNFS.downloadFile({
            fromUrl: Session.get('settings.url') + icon,
            toFile: RNFS.DocumentDirectoryPath + '/' + Session.get('domain') + '.png'
        })
    }

    async downloadSurvey() {
        await RNFS.downloadFile({
            fromUrl: Api.surveyJsonUrl(),
            toFile: RNFS.DocumentDirectoryPath + '/' + Session.get('domain') + '.json'
        })
    }
}

export default new ConnectLogic