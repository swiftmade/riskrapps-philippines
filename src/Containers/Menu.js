import React, { Component } from "react";
import Container from "../Components/Container";
import {View, Image} from 'react-native'
import Images from '../Constants/Images'
import Text from "../Components/Text";
import Button from "../Components/Button";
import Session from "../Lib/Session";

class Menu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: 'School Safety Self-Assessment Portal'
    }
  }

  componentDidMount() {
    if (Session.session.hasOwnProperty('title')) {
      if (Session.session.title.hasOwnProperty('en')) {
        this.setState({
          title: Session.session.title.en
        })
      }
    }
  }

  render() {
    return <Container center>
        <Image source={Images.ssas} style={{ marginTop: 32 }} />
        <Text title>{this.state.title}</Text>
        <View style={{ marginTop: 32, width: "100%" }}>
          <Button menu menu_primary title="New Submission" icon="plus" />
          <Button menu title="Upload Submissions" icon="upload" />
          <Button menu menu_grey title="Check for Updates" icon="refresh" style={{marginTop:32}} />
        </View>
      </Container>;
  }
}

export default Menu;
