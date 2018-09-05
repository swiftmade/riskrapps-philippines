import React, {Component} from 'react'
import Query from '../Lib/Query'
import Files from "../Lib/Files"
import Session from "../Lib/Session"
import HtmlView from "../Components/HtmlView"

class Survey extends Component
{
    getSource() {

        console.log(this.props)

        const {hazard} = this.props.navigation.state.params

        const baseUri = Files.wwwFolder()
        
        const uri = baseUri + "/survey.html?" + Query({
            lang: "en",
            mode: "offline",
            survey: Files.surveyJson(),
            db: Session.get("domain"),
            bg: Session.bgPath(),
            session: hazard.type + ' ' + hazard.name,
            session_extra: JSON.stringify({
                hazardId: hazard.id
            })
            //novalidate: true,
        });

        return { uri, baseUri }
    }    

    render() {
        return <HtmlView navigation={this.props.navigation} source={this.getSource()} sensitive />
    }
}

export default Survey