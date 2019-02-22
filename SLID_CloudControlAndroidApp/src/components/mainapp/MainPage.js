import React from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import { controlSlide } from '../../actions'
import firebase from 'firebase';

class MainPage extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View
                    style={{
                        alignContent:'center',
                        justifyContent: 'space-between',
                        flexDirection: "row",
                        margin: 10
                    }}
                >
                    <Button
                        title="<"
                        titleStyle={{ fontSize: 30, paddingLeft: 10, paddingRight: 10 }}
                        onPress={
                            () => {
                                this.props.controlSlide("previousSlide")
                            }
                        }
                    />
                    <Button
                        icon={<Icon
                            name="fullscreen"
                            size={40}
                            color="white"
                        />}
                        titleStyle={{ fontSize: 30, paddingLeft: 10, paddingRight: 10 }}
                        onPress={
                            () => {
                                this.props.controlSlide("fullScreen")
                            }
                        }
                    />
                    <Button
                        title=">"
                        titleStyle={{ fontSize: 30, paddingLeft: 10, paddingRight: 10 }}
                        onPress={
                            () => {
                                this.props.controlSlide("nextSlide")
                            }
                        }
                    />
                </View>
                <View
                    style={{
                        alignContent:'center',
                        justifyContent: 'center',
                        flexDirection: "row",
                        margin: 10
                    }}
                >
                    <Button
                        title="Disconnect"
                        titleStyle={{ fontSize: 30, paddingLeft: 10, paddingRight: 10 }}
                        onPress={
                            () => {
                                firebase.auth().signOut();
                            }
                        }
                    />
                </View>
            </View>
        )
    }
}
mapStateToProps = (state) => {
    return { loading: true }
}
export default connect(mapStateToProps, { controlSlide })(MainPage);