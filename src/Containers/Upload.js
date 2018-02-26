import React, {Component} from 'react'
import Files from '../Lib/Files'
import Session from "../Lib/Session";
import Query from "../Lib/Query";
import HtmlView from '../Components/HtmlView'

class Upload extends Component
{   
    getSource() {
        const baseUri = Files.wwwFolder()
        const uri = baseUri + "/submissions.html?" + Query({
            base: Session.get('settings.url'),
            server: 'openrosa/submissions',
        });

        return { uri, baseUri }
    }    

    render() {
        return <HtmlView source={this.getSource()} />
    }
}

export default Upload
