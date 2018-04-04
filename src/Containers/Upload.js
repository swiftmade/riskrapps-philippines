import React, {Component} from 'react'
import Files from '../Lib/Files'
import Session from "../Lib/Session";
import Query from "../Lib/Query";
import HtmlView from '../Components/HtmlView'

class Upload extends Component
{   
    getSource() {
        const baseUri = Files.wwwFolder()
        const uri = baseUri + "/submissions.html?" + Query(this.queryParams())        
        return { uri, baseUri }
    }    

    queryParams() {
        const params = {
            db: Session.get("domain"),
            server: "openrosa/submissions",
            base: Session.get("settings.url"),
        }
        let token = Session.get('auth.token')
        // Only set the token if the user is authorized
        if (token) {
            params['token'] = token
        }
        return params
    }
    
    render() {
        return <HtmlView navigation={this.props.navigation} source={this.getSource()} allowBackButton />
    }
}

export default Upload
