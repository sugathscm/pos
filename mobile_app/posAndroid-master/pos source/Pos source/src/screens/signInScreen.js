import React, { Component } from 'react';
import {
    ImageBackground, View, Image, TouchableNativeFeedback, KeyboardAvoidingView,
    TouchableOpacity
} from "react-native";
import {
    Button, Container, Content, Form, Header, Icon, CardItem, ListItem,
    Input, Item, Label, Text, Spinner, Toast, CheckBox, Body
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
import { setLoginData } from "../redux/actions";

class SignInScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            formUsername: "",
            formUsernameValid: null,
            formPassword: "",
            formPasswordValid: null,
            formRememberMeCheck: true,
            hidePassword:true,
            passwordIcon:"eye"
        };
    }

    componentDidMount() {
        this.state.pageLoading = false;
        this.forceUpdate();
    }

    validate() {
        console.log("validating form..");
        // Name
        if (this.state.formUsernameValid !== null || this.state.formUsername !== "") {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(this.state.formUsername).toLowerCase())) {
                this.state.formUsernameValid = true;
            } else {
                this.state.formUsernameValid = false;
            }
        }
        console.log(this.state);
        // Email
        if (this.state.formPasswordValid !== null || this.state.formPassword !== "") {
            if (this.state.formPassword && this.state.formPassword.length > 3) {
                this.state.formPasswordValid = true;
            } else {
                this.state.formPasswordValid = false;
            }
        }

        this.forceUpdate();
    }


    showValidityIcon(value) {
        if (value !== null) {
            if (value === true) {
                return 'checkmark-circle';
            } else {
                return 'close-circle';
            }
        } else {
            return 'create';
        }
    }
    changeIconState(){
        this.setState(pervState =>({
            passwordIcon: pervState.passwordIcon === 'eye' ? 'eye-off' : 'eye',
            hidePassword : !pervState.hidePassword
        }))
    }

    submitForm() {
        console.log("submitting form..");
        this.validate();

        // invalidating untouched field
        if (this.state.formUsernameValid === null) {
            this.state.formUsernameValid = false;
        }
        if (this.state.formPasswordValid === null) {
            this.state.formPasswordValid = false;
        }

        this.forceUpdate();

        if (!this.state.formUsername || this.state.formUsername.length < 5) {
            this.showToast("Please enter your username", "Ok", "warning");
            return;
        }

        if (!this.state.formUsernameValid) {
            this.showToast("invalid username", "Ok", "warning");
            return;
        }

        if (!this.state.formPassword || this.state.formPassword.length < 3) {
            this.showToast("Please enter your password", "Ok", "warning");
            return;
        }

        if (!this.state.formPasswordValid) {
            this.showToast("invalid password", "Ok", "warning");
            return;
        }

        this.state.pageLoading = true;
        //this.forceUpdate();

        const passwordTempHash = sha256(this.state.formPassword);

        let user = {
            email: this.state.formUsername.toLocaleLowerCase().trim(),
            password: passwordTempHash
        };

        console.log("Ready to call login..");

        axios
            .post(AppURLS.ApiBaseUrl + 'users/login', { user: user })
            .then(response => {
                console.log("backend auth data", response.data);
                if (response.data.success) {
                    console.log("auth success..");
                    this.props.setLoginData(response.data);
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });

                    if (this.state.formRememberMeCheck) {
                        let userData = { email: this.state.formUsername, password: passwordTempHash };
                        this._signInAsync(userData)
                            .then(() => {
                                this.props.navigation.navigate('SalesScreen');
                            })
                    } else {
                        this._signInAsyncRemoveData()
                            .then(() => {

                                this.props.navigation.navigate('SalesScreen')

                            })
                    }
                    //this.props.navigation.navigate('App');
                } else {
                    if (response.data.message === 'INACTIVE_USER') {
                        this.props.navigation.navigate('Activate')
                    } else {
                        console.log("auth failed..");
                        this.state.pageLoading = false;
                        this.forceUpdate();
                        this.showToast(response.data.message, "Ok", "warning");
                        return;
                    }
                }
            })
            .catch(error => {
                console.log("auth failed.. catch..");
                this.state.pageLoading = false;
                this.forceUpdate();
                this.showToast("Login failed, Please contact system administration", "Ok", "warning");
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

    _signInAsync = async (userData) => {
        console.log("saving user data in local..", userData);
        AsyncStorage.setItem('userData', JSON.stringify(userData));
    };

    _signInAsyncRemoveData = async () => {
        console.log("removing user data in local..");
        AsyncStorage.setItem('userData', JSON.stringify({}));
    };

    render() {

        let TouchablePlatformSpecific =
            Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;
        let touchableStyle =
            Platform.OS === "ios" ? "" : "";

        return (
            <Container>
                <ImageBackground
                    source={require("../assets/img/posBackground.jpg")}
                    style={{ width: wp("100%"), height: hp("100%") }} >
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
                                {/* Username */}
                                <Item floatingLabel
                                    success={this.state.formUsernameValid === true ? true : null}
                                    error={this.state.formUsernameValid === false ? true : null}>
                                    <Label style={{ color: 'white' }}>Username</Label>
                                    <Input onChangeText={text => {
                                        this.state.formUsername = text;
                                        this.validate();
                                    }}
                                        value={this.state.formUsername}
                                        style={{ color: 'white' }}
                                    />
                                    <Icon name={this.showValidityIcon(this.state.formUsernameValid)} style={{ color: 'white' }} />
                                </Item>

                                {/* password */}
                                <Item floatingLabel
                                    success={this.state.formPasswordValid === true ? true : null}
                                    error={this.state.formPasswordValid === false ? true : null}

                                >
                                    <Label style={{ color: 'white' }}>Password</Label>
                                    <Input onChangeText={text => {
                                        this.state.formPassword = text;
                                        this.validate();
                                    }}
                                        style={{ color: 'white' }}
                                        secureTextEntry = {this.state.hidePassword}
                                    />
                                     <Icon name={this.state.passwordIcon} style={{ color: 'white' }} onPress={ ()=>{ this.changeIconState()}} />
                                </Item>
                                <View style={{ height: wp('7%') }}>

                                </View>

                                <Button block onPress={() => this.submitForm()} style={{ backgroundColor: "rgba(0,0,128,0.6)" }}>
                                    <Text>Login</Text>
                                </Button>

                                <View
                                    style={{
                                        flex: 1,
                                        height: hp("5%"),
                                        marginLeft: wp("15%"),
                                        marginRight: wp("15%"),
                                        marginTop: hp("1%"),
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        width: wp("70%")
                                    }}
                                >
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "rgba(0,0,128,0.6)",
                                                borderBottomLeftRadius: 3,
                                                borderTopLeftRadius: 3,
                                                borderRightColor: "white",
                                                borderRightWidth: 1,
                                                width: wp("35%")
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    // width: "100%",
                                                    // textAlign: "center",
                                                    // fontSize: wp("3.7%"),
                                                    // margin: wp("0.5%"),
                                                    // paddingHorizontal: wp("1.5%"),
                                                    color: "white",
                                                    // fontWeight: "600"
                                                }}
                                            >
                                                Sign Up
                                        </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginHelpScreen')}>
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "rgba(0,0,128,0.6)",
                                                borderTopRightRadius: 3,
                                                borderBottomRightRadius: 3,
                                                width: wp("35%")
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    // width: "100%",
                                                    // textAlign: "center",
                                                    // fontSize: wp("3.7%"),
                                                    // margin: wp("0.5%"),
                                                    // paddingHorizontal: wp("1.5%"),
                                                    color: "white",
                                                    // fontWeight: "600"
                                                }}
                                            >
                                                Help
                                        </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
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
        count: state.multy
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({ setLoginData: (data) => setLoginData(data) }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(SignInScreen);
