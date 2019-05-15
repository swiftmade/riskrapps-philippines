import React, { Component } from "react"
import {
    View,
    Image,
    ActivityIndicator,
    StyleSheet,
    ImageBackground
} from "react-native"

import {NavigationActions} from 'react-navigation'

import {
    Container,
    Content,
    Header,
    Footer
} from 'native-base'

import { AppCore } from "ssas-app-core";
import Alerts from "ssas-app-core/src/Lib/Alerts";
import Session from "ssas-app-core/src/Lib/Session"
import Text from "ssas-app-core/src/Components/Text"
import Images from 'ssas-app-core/src/Constants/Images'
import Colors from "ssas-app-core/src/Constants/Colors"
import Button from "ssas-app-core/src/Components/Button"
import ConnectFlow from "ssas-app-core/src/Flows/ConnectFlow"
import PortalLogo from "ssas-app-core/src/Components/PortalLogo"
import CurrentUser from 'ssas-app-core/src/Components/CurrentUser'

import Hazards from "../Lib/Hazards"

class Menu extends Component {

	constructor(props) {
		super(props)
		this.state = {
			title: '',
			version: '',
			updating: false,
			sponsors: [],
			hazards: [],
		}

		this.exit = this.exit.bind(this)
		this.login = this.login.bind(this)
		this.logout = this.logout.bind(this)
		this.checkForUpdates = this.checkForUpdates.bind(this)
		this.uploadSubmissions = this.uploadSubmissions.bind(this)
	}


	componentDidMount() {
		if (this.props.navigation.state.params && this.props.navigation.state.params.message) {
			const {message_type, message} = this.props.navigation.state.params.message
			Alerts.show(message_type, message)
		}
	}	

	componentWillMount() {
		this.setState({
			title: Session.get("settings.title.en", "School Safety Self-Assessment Portal"),
			version: Session.get('survey.version'),
		})

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

		Hazards.allHazards().then(hazards => this.setState({
			hazards: hazards.reverse().slice(0, 3)
		}))
	}

	gotoSurvey(hazard) {
		this.props.navigation.navigate('Survey', {hazard})
	}

	uploadSubmissions() {
		this.props.navigation.navigate('Upload', {title: 'Upload Submissions'})
	}

	async checkForUpdates() {
		this.setState({updating: true})
		const auth = Session.session.auth
		try {
			await ConnectFlow.handle(Session.get('domain'))
			await Session.update({auth})
			this.reset()
		} catch(error) {
			Alerts.error("Oops", error.toString());
			this.setState({ updating: false });
		}
	}

	async logout() {
		await Session.logout()
		this.reset()
	}

	async exit() {
		await Session.destroy()
		this.reset()
	}

	reset(to = 'Launch', params = {}) {
		this.props.navigation.dispatch(
			NavigationActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({routeName: to, params})],
			})
		)
	}

	login() {
		this.reset('Login', {optional: true})
	}

	renderAuthButton() {
		if (Session.isAuthenticated()) {
			return  <Button link title="Sign Out" icon="sign-out" style={styles.exitButton} onPress={this.logout} />
		}
		return <Button link title="Sign In" icon="sign-in" style={styles.exitButton} onPress={this.login} />
	}

	renderMenu() {

		const {background, buttonStyles} = AppCore.get('theme')
		
		return <Container style={{backgroundColor:'white'}}>
			<Header style={{backgroundColor:'white', alignItems:'center'}}>
			<View style={{flex:1}}>
				<CurrentUser />
			</View>
			<View>
				{this.renderAuthButton()}
			</View>
			</Header>
			<ImageBackground source={background} style={{flex:1}} opacity={0.4}>
			<Content contentContainerStyle={{ alignItems:'center', padding:16}}>

				<View style={{flexDirection:'row', alignItems:'center',}}>
				<PortalLogo />
				<Text wrapTitle style={{marginLeft:16}}>{this.state.title}</Text>
				</View>
				
				<View style={styles.buttons}>
				{this.renderHazardButtons()}
				
				{/*
				<Button menu theme={buttonStyles.secondary} title="Upload Submissions" icon="upload" onPress={this.uploadSubmissions} />
				<Button menu theme={buttonStyles.other} title="Check for Updates" icon="refresh" style={{ marginTop: 32 }} onPress={this.checkForUpdates} />          
				*/}
				</View>

				<View style={styles.footer}>
				<View style={styles.sponsors}>
					{this.renderSponsorLogos()}
				</View>
				</View>
			</Content>
			</ImageBackground>
			<Footer style={{backgroundColor: 'white', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
				<Text style={styles.footerText}>
					Survey version: {this.state.version}
				</Text>
			</Footer>
		</Container>
  	}

	renderHazardButtons() {
		if (!this.state.hazards.length) {
			return null
		}

		const {buttonStyles} = AppCore.get('theme')

		return this.state.hazards.map(hazard => <Button menu
			icon="exclamation"
			key={hazard.id}
			theme={buttonStyles.primary}
			title={hazard.type + ' ' + hazard.name}
			onPress={() => {
				this.gotoSurvey(hazard)
			}} />)
	}
	renderLoading() {
		return <Container>
			<Content contentContainerStyle={{ alignItems:'center', padding:16}}>
				<ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: 15 }} />
				<Text>Updating...</Text>
			</Content>
		</Container>
	}

	renderSponsorLogos() {
		return this.state.sponsors.map((item, index) => {
			return <Image key={index} source={item.sponsor} style={[styles.sponsor, {aspectRatio: item.ratio, height: 50}]} />
		})
	}

	render() {
		return <View style={{flex:1}}>
			{this.state.updating ? this.renderLoading() : this.renderMenu()}
		</View>
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
	marginTop:32,
	maxWidth:340,
    flexDirection: "row",
	alignItems: "stretch",
	justifyContent:'center',
    flexWrap: 'wrap',
  },
  sponsor: {
    marginTop: 8,
    marginRight: 4,
    marginLeft: 4,
    marginBottom: 8
  },
  exitButton: {
    marginBottom: 0,
    padding: 0,
    textAlign: 'right',
  },
  footerText: {
    flex: 1,
    textAlign: "center",
    color: Colors.textMute
  }
});

export default Menu;
