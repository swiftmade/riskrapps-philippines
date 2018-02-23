import React, {Component} from 'react'
import Files from '../Lib/Files'
import Session from "../Lib/Session";
import HtmlView from '../Components/HtmlView'

class Upload extends Component
{

    openRosaUrl() {
        return Session.get("settings.url") + "/openrosa/submissions";
    }
    
    getSource() {
        const baseUri = Files.wwwFolder()
        const uri = baseUri + "/submissions.html?submission_url=" + this.openRosaUrl();
        return { uri, baseUri }
    }    

    render() {
        return <HtmlView source={this.getSource()} />
    }
}

export default Upload
