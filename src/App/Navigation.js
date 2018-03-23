import { StackNavigator } from 'react-navigation'

import Menu from '../Containers/Menu'
import Login from '../Containers/Login'
import Survey from '../Containers/Survey'
import Launch from '../Containers/Launch'
import Upload from '../Containers/Upload'
import Connect from '../Containers/Connect'

export default StackNavigator({
    Launch: {screen: Launch},
    Login: {screen: Login},
    Menu: {screen: Menu},
    Connect: {screen: Connect},
    Survey: {screen: Survey},
    Launch: {screen: Launch},
    Upload: {screen: Upload},
}, {
    initialRouteName: 'Launch',
    headerMode: 'none',
    navigationOptions: {
        gesturesEnabled: false,
    },
})