import Session from '../Lib/Session'
import RNFS from 'react-native-fs'

export default {
    ssas: require('../Assets/ssas.png'),
    logo() {
        return {uri: 'file://' + RNFS.DocumentDirectoryPath + '/' + Session.get('domain') + '.png', scale: 1}
    }
}