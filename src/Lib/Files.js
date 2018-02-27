import {Platform} from 'react-native';
import RNFS from "react-native-fs";
import Session from './Session'

class Files {
    
    _iosWwwFolder() {
        return 'file://' + RNFS.MainBundlePath + '/www'
    }

    _androidWwwFolder() {
        // TODO: Implent this for Android
        return 'file:///android_asset/www'
    }

    wwwFolder() {
        return (Platform.OS === 'ios')
            ? this._iosWwwFolder()
            : this._androidWwwFolder()
    }

    surveyJson() {
        return 'file://' + RNFS.DocumentDirectoryPath + "/" + Session.get("domain") + ".json"
    }

    iconPath() {
        return 'file://' + RNFS.DocumentDirectoryPath + '/' + Session.get('domain') + '.png'
    }

    sponsorPaths() {
        return Session.get('sponsors', []).map((_, index) => {
            return 'file://' + RNFS.DocumentDirectoryPath + '/' + Session.get('domain') + '_sponsor_' + index + '.png'
        })
    }
}

export default new Files()