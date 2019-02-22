import React, { Component } from 'react';
import { KeyboardAvoidingView, View, Text, Image, Modal } from 'react-native'
import { Container, Content, Form, Item, Input, Label } from 'native-base';
import { Header, SocialIcon } from 'react-native-elements';
import { connect } from 'react-redux';
import { login } from '../../actions'

class LoginPage extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        };
    }
    onButtonPress = () => {
        const { email, password } = this.state;
        this.props.login({ email: email.trim(), password });
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0)' }}>
                    <Header centerComponent={<Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>Login</Text>} backgroundColor="#1E6EC7" />
                    <Content>
                        <Form>
                            <Item stackedLabel>
                                <Label style={{ color: '#1E6EC7', fontSize: 20 }}>Email</Label>
                                <Input value={this.state.email} style={{ color: '#1E6EC7', fontSize: 18 }} onChangeText={(email) => { this.setState({ email: email }) }} />
                            </Item>
                            <Item stackedLabel>
                                <Label style={{ color: '#1E6EC7', fontSize: 20 }}>Parola</Label>
                                <Input style={{ color: '#1E6EC7', fontSize: 18 }} onChangeText={(password) => { this.setState({ password: password }) }} secureTextEntry />
                            </Item>
                            <SocialIcon
                                title='Logheaza-te'
                                button
                                onPress={() => this.onButtonPress()
                                }
                                underlayColor={'#1E6EC7'}
                                loading={this.props.loading}
                                style={{ backgroundColor: '#1E6EC7' }}
                            />
                        </Form>
                    </Content>
                </View>
            </View>
        );
    }
}
mapStateToProps = (state) => {
    const { loading } = state.Auth;
    return { loading };
}
export default connect(mapStateToProps, { login })(LoginPage);