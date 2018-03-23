import React, { Component } from 'react'
import { Image } from 'react-native'

import Text from '../Components/Text'
import Images from '../Constants/Images'
import Container from '../Components/Container'

import LaunchFlow from '../Flows/LaunchFlow'

class Launch extends Component {

    async componentDidMount() {
        await LaunchFlow(this.props.navigation)
    }

    render() {
        return (
            <Container center>
                <Image source={Images.ssas} />
                <Text>Loading...</Text>
            </Container>
        );
    }
}

export default Launch;
