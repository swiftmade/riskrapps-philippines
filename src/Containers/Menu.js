import React, { Component } from "react";
import Colors from "../Constants/Colors";
import Images from '../Constants/Images'
import Text from "../Components/Text";
import PortalLogo from "../Components/PortalLogo";
import Button from "../Components/Button";
import Session from "../Lib/Session";
import ConnectFlow from "../Flows/ConnectFlow";
import Alerts from "../Lib/Alerts";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";
import {NavigationActions} from 'react-navigation'

import {Container, Content, Header, Footer} from 'native-base'

import CurrentUser from '../Components/CurrentUser'

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
    this.props.navigation.navigate('Survey', {title: 'New Submission'})
  }

  uploadSubmissions() {
    this.props.navigation.navigate('Upload', {title: 'Upload Submissions'})
  }

  async checkForUpdates() {
    this.setState({updating: true})
    try {
      await ConnectFlow.handle(Session.get('domain'))
      this.reset()
    } catch(error) {
      Alerts.error("Oops", error.toString());
      this.setState({ updating: false });
    }
  }

  async exit() {
    await Session.destroy()
    this.reset()
  }

  reset() {
    this.props.navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: "Launch",})],
        })
    )
  }
  
  renderMenu() {
    return <Container style={{backgroundColor:'white'}}>
        <Header style={{backgroundColor:'white', alignItems:'center'}}>
			<View style={{flex:1}}>
				<CurrentUser />
			</View>
			<View style={{flex:1,marginTop:6}}>
				<Button link title="Logout" icon="sign-out" style={styles.exitButton} onPress={this.exit} />
			</View>
        </Header>
        <Content contentContainerStyle={{flex:1, alignItems:'center', padding:16}}>
        <PortalLogo />
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
        </View>
        </Content>
        <Footer style={{backgroundColor: 'white', flexDirection:'column'}}>
          <Text style={styles.footerText}>
            Survey version: {this.state.version}
          </Text>        
          <Button link title="Connect to other domain" icon="chevron-circle-left" style={styles.exitButton} onPress={this.exit} />
        </Footer>
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
  buttons: {
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sponsors: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  sponsor: {
    marginTop: 8,
    marginRight: 4,
    marginLeft: 4,
    marginBottom: 8
  },
  exitButton: {
    marginBottom: 0,
    padding: 0
  },
  footer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "column"
  },
  footerText: {
    flex: 1,
    textAlign: "center",
    color: Colors.textMute
  }
});

export default Menu;
