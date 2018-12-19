import React, {Component} from 'react'
import {
    Container,
    Content,
    Header,
    Body,
    Title,
    Left,
    Right,
    Form,
    Item,
    Label,
    Input,
    Button,
    Icon,
} from 'native-base'

export default class Settings extends Component {

    constructor(props) {
        super(props)
    }

    goBack() {
        this.props.navigation.goBack(null)
    }

    render() {
        return <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => this.goBack()}>
                    <Icon name='arrow-back' />
                    </Button>
                </Left>                
                <Body>
                    <Title>SETTINGS</Title>
                </Body>
                <Right>
                    <Button transparent>
                        <Icon name='refresh' />
                    </Button>
                </Right>
            </Header>
            <Content padder>
                <Form>
                    <Item stackedLabel  last>
                        <Label>SMS Gateway Number</Label>
                        <Input placeholder="test" keyboardType="phone-pad" />
                    </Item>
                </Form>
            </Content>
        </Container>
    }
}
