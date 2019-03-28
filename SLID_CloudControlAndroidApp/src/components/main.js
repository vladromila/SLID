import { createMaterialTopTabNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Platform } from 'react-native'
import LoginPage from './auth/LoginPage';

import SplashScreen from './splashscreen/SplashScreen';
import MainPage from './mainapp/MainPage';

export default createAppContainer(createSwitchNavigator({
    Auth: {
        screen: LoginPage
    },
    Splash: {
        screen: SplashScreen
    },
    MainApp: {
        screen: MainPage
    }
}, { initialRouteName: "Splash" }))