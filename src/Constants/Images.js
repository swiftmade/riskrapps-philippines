import Files from '../Lib/Files'
import Session from '../Lib/Session'

export default {
    ssas: require('../Assets/ssas.png'),
    logo() {
        return {uri: Files.iconPath(), scale: 1}
    },
    sponsors() {
        return Files.sponsorPaths().map(path => {
            return {uri: path, scale: 1}
        })
    },
}