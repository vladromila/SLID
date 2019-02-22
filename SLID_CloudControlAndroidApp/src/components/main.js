import { createMaterialTopTabNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Platform } from 'react-native'
import LoginPage from './auth/LoginPage';
import SignUpPage from './auth/SignUpPage';

import SplashScreen from './splashscreen/SplashScreen';
import MainPage from './mainapp/MainPage';

let Auth = createAppContainer(
    createMaterialTopTabNavigator({
        LoginPage: {
            screen: LoginPage
        }
    },
        {
            animationEnabled: true,
            swipeEnabled: true,
            tabBarPosition: "bottom",
            tabBarOptions: {
                style: {
                    ...Platform.select({
                        android: {
                            backgroundColor: 'white'
                        }
                    })
                },
                indicatorStyle: {
                    backgroundColor: '#1E6EC7'
                },
                activeTintColor: '#1E6EC7',
                inactiveTintColor: '#d1cece',
                pressColor: '#1E6EC7',
                showLabel: true,
            }
        })
)

export default createAppContainer(createSwitchNavigator({
    Auth: {
        screen: Auth
    },
    Splash: {
        screen: SplashScreen
    },
    MainApp: {
        screen: MainPage
    }
}, { initialRouteName: "Splash" }))