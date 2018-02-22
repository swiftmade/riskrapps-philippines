import React, { Component } from "react";
import Container from "../Components/Container";
import {View, Image} from 'react-native'
import Images from '../Constants/Images'
import Text from "../Components/Text";
import Button from "../Components/Button";
import Session from "../Lib/Session";
import {Actions} from "react-native-router-flux";

class Menu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: ''
    }
    this.newSubmission = this.newSubmission.bind(this)
    this.uploadSubmissions = this.uploadSubmissions.bind(this)
    this.checkForUpdates = this.checkForUpdates.bind(this)
    this.exit = this.exit.bind(this)
  }

  componentDidMount() {
      this.setState({
        title: Session.get("title.en", "School Safety Self-Assessment Portal")
      });
  }

  newSubmission() {

  }

  uploadSubmissions() {

  }

  checkForUpdates() {

  }

  async exit() {
    await Session.destroy()
    Actions.reset("launch")
  }

  render() {
    return <Container center>
        <Image source={Images.logo()} defaultSource={Images.ssas} style={{ width: 90, height: 90, marginTop: 8 }} />
        <Text title>{this.state.title}</Text>
        <View style={{ marginTop: 16, width: "100%" }}>
          <Button menu menu_primary title="New Submission" icon="plus" onPress={this.newSubmission} />
          <Button menu title="Upload Submissions" icon="upload" onPress={this.uploadSubmissions} />
          <Button menu menu_grey title="Check for Updates" icon="refresh" style={{ marginTop: 32 }} onPress={this.checkForUpdates} />
          <Button link title="Connect to other domain" icon="chevron-circle-left" style={{ marginTop: 16 }} onPress={this.exit} />
        </View>
      </Container>;
  }
}

export default Menu;
