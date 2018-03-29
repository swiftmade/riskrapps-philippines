import {NavigationActions} from 'react-navigation'

import Api from '../Lib/Api'
import Alerts from '../Lib/Alerts'
import Session from '../Lib/Session'
import Connectivity from '../Lib/Connectivity'

export default async (navigation) => {
    // Resets the navigation stack
    const resetTo = (screenName) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: screenName }),
            ]
        })
        navigation.dispatch(resetAction)            
    }

    const refreshTokenAndStart = async () => {
        
        if ( ! await Connectivity.check()) {
            return resetTo('Menu') // Do nothing, because there's no connection
        }
        
        try {
            await Session.refreshToken()
        } catch(error) {
            Alerts.error("Oops", error.toString())
            // TODO: Only logout if it's a token issue.
            await Session.logout()
            // If after logging out, login is required, go to login page.
            if (Session.needsAuthentication()) {
                return resetTo("Login")
            }
        }

        return resetTo('Menu')
    }

    await Session.restoreSession()

    // Check the current session
    if (!Session.hasValidSession()) {
        // There's no session.
        // Go to the initial connection page.
        return resetTo("Connect")
    }
    
    // Sets the active domain, and if exists, token
    Api.configureFromSession()
    
    // If the session indicates that authentication is necessary
    // And the user is not currently authenticated, authenticate first.
    if (Session.needsAuthentication()) {
        return resetTo("Login")
    }
    
    if (Session.isAuthenticated()) {
        // Check internet connectivity...
        return await refreshTokenAndStart()
    }
    
    // Otherwise, just go to the menu.
    resetTo('Menu')
}