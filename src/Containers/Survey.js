import React, {Component} from 'react'
import Files from '../Lib/Files'
import HtmlView from '../Components/HtmlView'
import Query from '../Lib/Query'

class Survey extends Component
{
    getSource() {
        const baseUri = Files.wwwFolder()
        const uri = baseUri + '/survey.html?' + Query({
            lang: 'en',
            json: Files.surveyJson()
        })
        
        return { uri, baseUri }
    }    

    render() {
        return <HtmlView source={this.getSource()} sensitive />
    }
}

export default Survey