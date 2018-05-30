import React, {Component} from 'react'
import Query from '../Lib/Query'
import Files from "../Lib/Files"
import Session from "../Lib/Session"
import HtmlView from "../Components/HtmlView"

class Survey extends Component
{
    getSource() {
        const baseUri = Files.wwwFolder()
        const uri = baseUri + "/survey.html?" + Query({
            lang: "en",
            json: Files.surveyJson(),
            db: Session.get("domain"),
            bg: Session.bgPath(),
            //novalidate: true,
        });

        return { uri, baseUri }
    }    

    render() {
        return <HtmlView navigation={this.props.navigation} source={this.getSource()} sensitive />
    }
}

export default Survey