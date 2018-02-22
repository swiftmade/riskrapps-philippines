import Api from '../Lib/Api'
import Session from "../Lib/Session";
import RNFS from "react-native-fs";

class UpdateLogic {

    async handle() {
        await Promise.all([
            this.downloadSurvey(),
            this.downloadIcon(),
        ])
    }

    async downloadIcon() {
        // TODO: Ignore if the icon download fails, it's not critical
        const icon = Session.get('icon_medium')
        if ( ! icon) {
            return
        }
        await RNFS.downloadFile({
            fromUrl: Session.get('url') + icon,
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

export default new UpdateLogic