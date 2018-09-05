import { StackNavigator } from 'react-navigation'

import Menu from '../Containers/Menu'
import Login from '../Containers/Login'
import Survey from '../Containers/Survey'
import Launch from '../Containers/Launch'
import Upload from '../Containers/Upload'
import Connect from '../Containers/Connect'

export default StackNavigator({
    Launch: {screen: Launch, navigationOptions: { header: null}},
    Login: {screen: Login, navigationOptions: { header: null}},
    Menu: {screen: Menu, navigationOptions: { header: null}},
    Connect: {screen: Connect, navigationOptions: { header: null}},
    Survey: {screen: Survey, navigationOptions: ({ navigation }) => {
        const {state} = navigation;
        return {
            title: `${state.params.title || 'Loading...'}`,
        };
    }},
    Launch: {screen: Launch, navigationOptions: { header: null}},
    Upload: {screen: Upload, navigationOptions: { header: null}},
}, {
    initialRouteName: 'Launch',
    navigationOptions: {
        gesturesEnabled: false,
    },
})