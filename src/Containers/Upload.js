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
            db: Session.get('domain'),
            server: 'openrosa/submissions',
            base: Session.get('settings.url'),
        })
        
        return { uri, baseUri }
    }    

    render() {
        return <HtmlView source={this.getSource()} />
    }
}

export default Upload
