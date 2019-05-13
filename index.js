import { AppRegistry } from 'react-native';

import { AppCore } from 'ssas-app-core';
import Themes from 'ssas-app-core/src/Constants/Themes';

import AppMain from './src/App/Main';
import surveyParams from './src/Extend/surveyParams';

AppCore.configure({
    theme: Themes.philippines,
    domainLock: "philippines",
    defaultLaunchName: "RADaR",
    navigation: require('./src/App/Navigation').default,
    defaultLaunchLogo: require('./src/Assets/philippines.png'),

    extendSurveyParams: surveyParams,
});

AppRegistry.registerComponent('riskrapps_philippines', () => AppMain);
