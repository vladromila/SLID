import React from 'react';

import { ActivityIndicator, View } from 'react-native'
import firebase from 'firebase';

class SplashScreen extends React.Component {
    constructor() {
        super();
    }
    onStateChange(user) {
        if (user)
            this.props.navigation.navigate("MainApp");
        else
            this.props.navigation.navigate("Auth")
    }
    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => this.onStateChange(user));
    }
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                    justifyContent: "center"
                }}
            >
                <ActivityIndicator
                    size="large" color="#1E6EC7"
                />
            </View>)
    }
}

export default SplashScreen;