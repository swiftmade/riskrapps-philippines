import React, { Component } from "react";
import Container from "../Components/Container";
import Colors from "../Constants/Colors";
import Images from '../Constants/Images'
import Text from "../Components/Text";
import Button from "../Components/Button";
import Session from "../Lib/Session";
import ConnectLogic from "../Logic/ConnectLogic";
import {Actions} from "react-native-router-flux";
import Alerts from "../Lib/Alerts";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";

class Menu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      version: '',
      updating: false,
      sponsors: [],
    }
    this.newSubmission = this.newSubmission.bind(this)
    this.uploadSubmissions = this.uploadSubmissions.bind(this)
    this.checkForUpdates = this.checkForUpdates.bind(this)
    this.exit = this.exit.bind(this)
  }

  componentWillMount() {
      this.setState({
        title: Session.get("settings.title.en", "School Safety Self-Assessment Portal"),
        version: Session.get('survey.version'),
      });

      const sponsorLogos = Images.sponsors().map(sponsor => {
        return new Promise((resolve) => {
          Image.getSize(sponsor.uri, (width, height) => {
            return resolve({sponsor, ratio: width / height})
          })
        })
      })

      Promise.all(sponsorLogos).then((all) => {
        this.setState({
          sponsors: all
        })
      })
  }

  newSubmission() {
    Actions.push('survey', {title: 'New Submission'})
  }

  uploadSubmissions() {
    Actions.push("upload", {title: 'Upload Submissions'})
  }

  async checkForUpdates() {
    this.setState({updating: true})
    try {
      await ConnectLogic.handle(Session.get('domain'))
      Actions.reset('launch')
    } catch(error) {
      Alerts.error("Oops", error.toString());
      this.setState({ updating: false });
    }
  }

  async exit() {
    await Session.destroy()
    Actions.reset("launch")
  }
  
  renderMenu() {
    return <Container center>
        <Image source={Images.logo()} defaultSource={Images.ssas} style={styles.logo} />
        <Text title>{this.state.title}</Text>
        <View style={styles.buttons}>
          <Button menu menu_primary title="New Submission" icon="plus" onPress={this.newSubmission} />
          <Button menu title="Upload Submissions" icon="upload" onPress={this.uploadSubmissions} />
          <Button menu menu_grey title="Check for Updates" icon="refresh" style={{ marginTop: 32 }} onPress={this.checkForUpdates} />          
        </View>
      
        <View style={styles.footer}>
          <View style={styles.sponsors}>
          {this.renderSponsorLogos()}
          </View>
          <Button link title="Connect to other domain" icon="chevron-circle-left" style={styles.exitButton} onPress={this.exit} />
          <Text style={styles.footerText}>
            Survey version: {this.state.version}
          </Text>
        </View>
      </Container>;
  }

  renderLoading() {
    return <Container center>
        <ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: 15 }} />
        <Text>Updating...</Text>
      </Container>;
  }

  renderSponsorLogos() {
    return this.state.sponsors.map((item, index) => {
        return <Image key={index} source={item.sponsor} style={[styles.sponsor, {aspectRatio: item.ratio, height: 60}]} />
    })
  }

  render() {
    return <View style={{flex:1}}>
        {this.state.updating ? this.renderLoading() : this.renderMenu()}
      </View>;
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 90,
    height: 90,
    marginTop: 8,
  },
  buttons: {
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 160,
  },
  sponsors: {
    flexDirection: "row",
    alignItems: "stretch",
    flexWrap: "wrap"
  },
  sponsor: {
    marginTop: 16,
    marginRight: 4,
    marginLeft: 4,
    marginBottom: 16
  },
  exitButton: {
    marginBottom: 0,
    padding: 0
  },
  footer: {
    position: "absolute",
    bottom: 8,
    flexDirection: "column"
  },
  footerText: {
    flex: 1,
    textAlign: "center",
    color: Colors.textMute
  }
});

export default Menu;
