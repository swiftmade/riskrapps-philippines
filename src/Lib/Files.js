import {Platform} from 'react-native';
import RNFS from "react-native-fs";
import Session from './Session'

class Files {
    
    _iosWwwFolder() {
        return 'file://' + RNFS.MainBundlePath + '/www'
    }

    _androidWwwFolder() {
        // TODO: Implent this for Android
    }

    wwwFolder() {
        return (Platform.OS === 'ios')
            ? this._iosWwwFolder()
            : this._androidWwwFolder()
    }

    surveyJson() {
        return 'file://' + RNFS.DocumentDirectoryPath + "/" + Session.get("domain") + ".json";
    }
}

export default new Files()