import React, {Component} from 'react'
import Files from '../Lib/Files'
import HtmlView from '../Components/HtmlView'

class Upload extends Component
{
    getSource() {
        const baseUri = Files.wwwFolder()
        const uri = baseUri + '/submissions.html'
        return { uri, baseUri }
    }    
    
    render() {
        return <HtmlView source={this.getSource()} />
    }
}

export default Upload   