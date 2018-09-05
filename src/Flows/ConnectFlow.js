import Api from '../Lib/Api'
import Session from "../Lib/Session";
import RNFS from "react-native-fs";

class ConnectFlow {

    async handle() {

        const domain = 'philippines'
        
        Api.setDomain(domain)

        const session = await Api.meta()
        session.domain = domain

        try {        
            await Promise.all([
                Session.set(session),
                this.downloadIcon(),
                this.downloadSponsorLogos(),
            ])
        } catch(error) {
            // If any of these steps fail,
            // Destroy the active session
            Session.destroy()
            throw error
        }
    }

    async downloadIcon() {
        // TODO: Ignore if the icon download fails, it's not critical
        const icon = Session.get('settings.icon_medium')
        if ( ! icon) {
            return
        }
        await RNFS.downloadFile({
            fromUrl: Session.get('settings.url') + encodeURI(icon),
            toFile: RNFS.DocumentDirectoryPath + '/' + Session.get('domain') + '.png'
        }).promise
    }

    async downloadSponsorLogos() {
        const logoDownloads = Session.get('sponsors', []).map((photo, index) => {
            return RNFS.downloadFile({
                fromUrl: Session.get('settings.url') + encodeURI(photo),
                toFile: RNFS.DocumentDirectoryPath + '/' + Session.get('domain') + '_sponsor_' + index + '.png'
            }).promise
        })

        await Promise.all(logoDownloads)
    }
}

export default new ConnectFlow