import React, {Component} from 'react'
import Query from '../Lib/Query'
import Files from "../Lib/Files"
import Session from "../Lib/Session"
import HtmlView from "../Components/HtmlView"

class Survey extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            title: null,
            hazard: null
        }
    }

    componentDidMount() {
        const {state, setParams} = this.props.navigation
        const {hazard} = state.params

        const title = hazard.type + ' ' + hazard.name
        setParams({title})

        this.setState({
            title,
            hazard,
        })
    }
    
    getSource() {

        const baseUri = Files.wwwFolder()
        
        const uri = baseUri + "/survey.html?" + Query({
            lang: "en",
            mode: "offline",
            sms: '+639221003107',
            survey: Files.surveyJson(),
            db: Session.get("domain"),
            bg: Session.bgPath(),
            session: this.state.title,
            session_extra: JSON.stringify({
                uid: Session.get('auth.id'),
                hid: this.state.hazard.id,
            })
            //novalidate: true,
        });

        return { uri, baseUri }
    }    

    render() {
        if ( ! this.state.hazard) {
            return null
        }
        return <HtmlView navigation={this.props.navigation} source={this.getSource()} sensitive />
    }
}

export default Survey