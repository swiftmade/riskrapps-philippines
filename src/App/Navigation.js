import { StackNavigator } from 'react-navigation'

import Login from 'ssas-app-core/src/Containers/Login'
import Survey from 'ssas-app-core/src/Containers/Survey'
import Launch from 'ssas-app-core/src/Containers/Launch'
import Connect from 'ssas-app-core/src/Containers/Connect'

import Menu from '../Containers/Menu'

export default StackNavigator({
    Launch: {screen: Launch, navigationOptions: {header: null}},
    Login: {screen: Login, navigationOptions: {header: null}},
    Menu: {screen: Menu, navigationOptions: {header: null}},
    Connect: {screen: Connect, navigationOptions: {header: null}},
    Survey: {screen: Survey, navigationOptions: ({ navigation }) => {
        const {state} = navigation;
        return {
            title: `${state.params.title || 'Loading...'}`,
        };
    }},
}, {
    initialRouteName: 'Launch',
    navigationOptions: {
        gesturesEnabled: false,
    },
})