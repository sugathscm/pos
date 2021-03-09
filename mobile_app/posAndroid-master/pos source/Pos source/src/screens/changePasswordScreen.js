import React, { Component } from 'react';
import {
    ImageBackground, View, Image, TouchableNativeFeedback, KeyboardAvoidingView,
    TouchableOpacity
} from "react-native";
import {
    Button, Container, Content, Form, Header, Icon, CardItem, ListItem,
    Input, Item, Label, Text, Spinner, Toast, CheckBox, Body, Left, Title
} from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Counter from "./counter";
import { connect, Provider } from "react-redux";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import { sha256 } from "js-sha256";
import { bindActionCreators } from "redux";
import { getCases } from "../redux/actions";
import signUpStrings from '../localization/signUpStrings';

class ChangePasswordScreen extends React.Component {
    static navigationOptions = {
        title: 'Card Screen',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            formPassword: "",
            formPasswordValid: null,
            newPassword: "",
            newPasswordValid: null,
            reEnterPassword: "",
            reEnterPasswordValid: null,
            formRememberMeCheck: true,
            showCurrenrPassword:true,
            showNewPassword:true,
            showReEnterPassword:true,
            passwordIconState:"eye",
            passwordNewIconState:"eye",
            passwordReEnterIconState:"eye",
        };
    }

    componentDidMount() {
        this.state.pageLoading = false;
        this.forceUpdate();
        this.props.getCases(this.props.userData);
    }

    validate() {
        console.log("validating form..");
        // Name
        console.log(this.state);
        // Email
        if (this.state.formPasswordValid !== null || this.state.formPassword !== "") {
            if (this.state.formPassword && this.state.formPassword.length >= 6) {
                this.state.formPasswordValid = true;
            } else {
                this.state.formPasswordValid = false;
            }
        }
        if (this.state.newPasswordValid !== null || this.state.newPassword !== "") {
            if (this.state.newPassword && this.state.newPassword.length > 6 && this.state.newPassword.length <= 10) {
                this.state.newPasswordValid = true;
            } else {
                this.state.newPasswordValid = false;
            }
        }
        if (this.state.reEnterPasswordValid !== null || this.state.reEnterPassword !== "") {
            if (this.state.reEnterPassword && this.state.reEnterPassword.length > 6
                && this.state.reEnterPassword.length <= 10 && this.state.newPassword == this.state.reEnterPassword) {
                this.state.reEnterPasswordValid = true;
            } else {
                this.state.reEnterPasswordValid = false;
            }
        }

        this.forceUpdate();
    }

    showValidityIcon(value){
        if(value !== null){
            if(value === true){
                return 'checkmark-circle';
            }else{
                return 'close-circle';
            }
        }else{
            return 'create';
        }
    }

    changeIconState(){
        this.setState(pervState =>({
            passwordIconState: pervState.passwordIconState === 'eye' ? 'eye-off' : 'eye',
            showCurrenrPassword : !pervState.showCurrenrPassword
        }))
    }
    changeNewIconState(){
        this.setState(pervState =>({
            passwordNewIconState: pervState.passwordNewIconState === 'eye' ? 'eye-off' : 'eye',
            showNewPassword : !pervState.showNewPassword
        }))
    }
    changeReEnterIconState(){
        this.setState(pervState =>({
            passwordReEnterIconState: pervState.passwordReEnterIconState === 'eye' ? 'eye-off' : 'eye',
            showReEnterPassword : !pervState.showReEnterPassword
        }))
    }

    submitForm() {
        console.log("submitting form..");
        this.validate();


        if (this.state.formPasswordValid === null) {
            this.state.formPasswordValid = false;
        }

        this.forceUpdate();


        if (!this.state.formPassword || this.state.formPassword.length < 3) {
            this.showToast(`${signUpStrings.plzEnterPwd}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
            return;
        }

        if (!this.state.formPasswordValid) {
            this.showToast(`${signUpStrings.inValidPwd}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
            return;
        }

        if (!this.state.newPasswordValid) {
            this.showToast(`${signUpStrings.inValidNewPwd}`,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
            return;
        }

        if (!this.state.reEnterPassword) {
            this.showToast(`${signUpStrings.inValidReEnteredPwd}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
            return;
        }

        if (this.state.newPassword != this.state.reEnterPassword) {
            this.showToast(`${signUpStrings.pwdDoesntMatch}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
            return;
        }


        this.state.pageLoading = true;
        //this.forceUpdate();

        const passwordTempHash = sha256(this.state.formPassword);

        let user = {
            userId: this.props.userData.loginData.uid,
            password: passwordTempHash,
            newPassword: this.state.newPassword
        };

        console.log("Ready to call login..");

        axios
            .post(AppURLS.ApiBaseUrl + 'users/changePassword', { user: user })
            .then(response => {
                console.log("backend auth data", response.data);
                if (response.data.success) {
                    console.log("auth success..");
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });
                    this.props.navigation.navigate('SalesScreen')
                    this.showToast(`${signUpStrings.pwdChangedSucessfully}`,  `${signUpStrings.ok}`, `${signUpStrings.success}`);
                    //this.props.navigation.navigate('App');
                } else {
                    this.showToast(response.data.message, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                }
            })
            .catch(error => {
                console.log("auth failed.. catch..");
                this.state.pageLoading = false;
                this.forceUpdate();
                this.showToast(`${signUpStrings.loginFailed}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                return;
            });
    }

    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }

    render() {

        let TouchablePlatformSpecific =
            Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;
        let touchableStyle =
            Platform.OS === "ios" ? "" : "";

        return (
            <Container>
                <Header>
                            <Left style={{ flexDirection: 'row' }}>
                                <Icon onPress={() => this.props.navigation.navigate('SalesScreen')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                            </Left>
                            <Body style={{ flex: 1 }}>
                                <Title>{signUpStrings.change_password}</Title>
                            </Body>
                        </Header>
                <ImageBackground
                    source={require("../assets/img/posBackground.jpg")}
                    style={{ width: wp("100%"), height: hp("110%") }} >
                    {/* Spinner */}
                    {this.state.pageLoading ? <Spinner color='blue' style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                        width: wp('100%'), zIndex: 2000
                    }} /> : null}

                    <Content padder style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        
                        <KeyboardAvoidingView behavior="position" enabled>
                            <View style={{
                                justifyContent: "center", alignItems: "center",
                                marginTop: hp('10%')
                            }}>
                                <Image source={require("../assets/img/logo-syn1.png")}
                                    style={{
                                        height: hp('30%'),
                                        width: wp('70%'), resizeMode: "contain"
                                    }} />
                            </View>
                            <Form>
                                {/* current password */}
                                <Item floatingLabel
                                    success={this.state.formPasswordValid === true ? true : null}
                                    error={this.state.formPasswordValid === false ? true : null}

                                >
                                    <Label style={{ color: 'white' }}>{signUpStrings.currentPwd}</Label>
                                    <Input onChangeText={text => {
                                        this.state.formPassword = text;
                                        this.validate();
                                    }}
                                        style={{ color: 'white' }}
                                        secureTextEntry={this.state.showCurrenrPassword}
                                    />
                                    <Icon name={this.state.passwordIconState} style={{ color: 'white' }} onPress={ ()=>{ this.changeIconState()}} />
                                </Item>

                                {/* new password */}
                                <Item floatingLabel
                                    success={this.state.newPasswordValid === true ? true : null}
                                    error={this.state.newPasswordValid === false ? true : null}

                                >
                                    <Label style={{ color: 'white' }}>{signUpStrings.newPwd}</Label>
                                    <Input onChangeText={text => {
                                        this.state.newPassword = text;
                                        this.validate();
                                    }}
                                        style={{ color: 'white' }}
                                        secureTextEntry={this.state.showNewPassword}
                                    />
                                    <Icon name={this.state.passwordNewIconState} style={{ color: 'white' }} onPress={ ()=>{ this.changeNewIconState()}} />
                                </Item>

                                {/* re-enter new password */}
                                <Item floatingLabel
                                    success={this.state.reEnterPasswordValid === true ? true : null}
                                    error={this.state.reEnterPasswordValid === false ? true : null}

                                >
                                    <Label style={{ color: 'white' }}>{signUpStrings.reEnterNewPwd}</Label>
                                    <Input onChangeText={text => {
                                        this.state.reEnterPassword = text;
                                        this.validate();
                                    }}
                                        style={{ color: 'white' }}
                                        secureTextEntry={this.state.showReEnterPassword}
                                    />
                                     <Icon name={this.state.passwordReEnterIconState} style={{ color: 'white' }} onPress={ ()=>{ this.changeReEnterIconState()}} />
                                </Item>
                                <View style={{ height: wp('7%') }}>

                                </View>

                                <Button block onPress={() => this.submitForm()} style={{ backgroundColor: "rgba(0,0,128,0.6)" }}>
                                    <Text>{signUpStrings.change_password}</Text>
                                </Button>
                            </Form>
                        </KeyboardAvoidingView>
                    </Content>
                </ImageBackground>
            </Container>

        );
    }
}

function mapStateToProps(state) {
    return {
        userData: state.data,
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({ getCases: (data) => getCases(data) }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(ChangePasswordScreen);
