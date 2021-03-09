import React, { Component } from 'react';
import {ImageBackground, View, KeyboardAvoidingView, TouchableOpacity, Image} from "react-native";
import {
    Container,
    Content,
    Form,
    Header,
    Icon,
    Input,
    Item,
    Label,
    InputGroup,
    Button,
    Text,
    Spinner,
    Toast
} from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import SignInScreen from "./signInScreen";
import axios from "axios";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as AppURLS from './../redux/urls';

class SignUpScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            pageLoading : true,
            showToast: false,
            formName : "",
            formNameValid : null,
            formEmail : "",
            formEmailValid : null,
            formMobile : "",
            formMobileValid : null,
            formAddress : "",
            formAddressValid : null,
            formCompanyId : "",
            formCompanyIdValid : null
        };
    }

    componentDidMount(){
        this.state.pageLoading = false;
        this.forceUpdate();
    }

    validate(){
        console.log("validating form..");
        // Name
        if(this.state.formNameValid !== null || this.state.formName !== ""){
            if(this.state.formName && this.state.formName.length >= 3){
                this.state.formNameValid = true;
            }else{
                this.state.formNameValid = false;
            }
        }
        // Email
        if(this.state.formEmailValid !== null || this.state.formEmail !== ""){
            //var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var re = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
            if(re.test(String(this.state.formEmail).toLowerCase())){
                this.state.formEmailValid = true;
            }else{
                this.state.formEmailValid = false;
            }
        }
        //Mobile Number
        if(this.state.formMobileValid !==null || this.state.formMobile!== ""){
            var re = /^[0-9]{10}$/;

            if(re.test(String(this.state.formMobile))){
                this.state.formMobileValid = true;
            }else{
                this.state.formMobileValid = false;
            }
        }
        //Address
        if(this.state.formAddressValid !==null || this.state.formAddress !==""){
            if(this.state.formAddress && this.state.formAddress.length >= 3){
                this.state.formAddressValid = true;
            }else{
                this.state.formAddressValid = false;
            }
        }

        //Company ID
        if(this.state.formCompanyIdValid !==null || this.state.formCompanyId !==""){
            if(this.state.formCompanyId && this.state.formCompanyId.length >= 3){
                this.state.formCompanyIdValid = true;
            }else{
                this.state.formCompanyIdValid = false;
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

    resetState(){
        this.setState({
            formName:"",
            formNameValid :null,
            formEmail:"",
            formEmailValid:null,
            formMobile:"",
            formMobileValid:null,
            formAddress:"",
            formAddressValid:null,
            formCompanyId:"",
            formCompanyIdValid:null
        })
        this.forceUpdate();
    };

    submitForm(){
        console.log("submitting form..");

        // invalidating untouched field
        if(this.state.formNameValid === null){
            this.state.formNameValid = false;
        }
        if(this.state.formEmailValid === null){
            this.state.formEmailValid = false;
        }
        if(this.state.formMobileValid === null){
            this.state.formMobileValid = false
        }
        if(this.state.formAddressValid === null){
            this.state.formAddressValid = false
        }

        if(!this.state.formName || this.state.formName.length < 3){
            this.showToast("Please enter your name","Ok","warning");
            return;
        }
        if(!this.state.formNameValid){
            this.showToast("invalid name","Ok","warning");
            return;
        }
        if(!this.state.formEmail || this.state.formEmail.length < 5){
            this.showToast("Please enter your email","Ok","warning");
            return;
        }
        if(!this.state.formEmailValid){
            this.showToast("invalid email","Ok","warning");
            return;
        }
        if(!this.state.formMobile || this.state.formMobile.length < 10){
            this.showToast("Please enter your mobile number","Ok","warning");
            return;
        }
        if(!this.state.formMobileValid){
            this.showToast("invalid mobile number","Ok","warning");
            return;
        }
        if(!this.state.formAddress || this.state.formAddress.length < 3){
            this.showToast("Please enter your address","Ok","warning");
            return;
        }
        if(!this.state.formAddressValid){
            this.showToast("invalid address","Ok","warning");
            return;
        }


        this.state.pageLoading = true;
        this.forceUpdate();

        let newUser = {
            name: this.state.formName,
            email : this.state.formEmail.toLocaleLowerCase().trim(),
            mobile : this.state.formMobile,
            address : this.state.formAddress
        };
        axios
            .post(AppURLS.ApiBaseUrl + 'users/user', newUser)
            .then(response => {
                console.log("backend data", JSON.stringify(response));
                if(response.data.success){
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    this.resetState();
                    console.log("data =========>", response);

                    // this.state.defaultAnimationDialog = true;
                    // this.state.goBack = true;
                    // this.setState({ ...this.state,
                    //     isVisible  :false
                    //});

                    this.showToast("Sign up is successfull. Please check your email for login information" ,"ok" ,"success");
                    this.props.navigation.navigate('SignIn');
                }else{
                    this.showToast(response.data.message,"Ok","warning");
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    this.props.navigation.navigate('SignIn');
                }
            })
            .catch(error => {
                console.log("error",error);
                this.state.pageLoading = false;
                this.forceUpdate();

                if(error.response.data.dialogMessage){
                    //alert(error.response.data.dialogMessage + " Please try again");
                    this.state.dialogMessage = "Please enter valid details, and try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                }else{
                    this.state.dialogMessage = "Failed adding new client. Please try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                }

            });

    }
    showToast(message,text,type){
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }



    render() {
        return (
            <ImageBackground
                source={require("../assets/img/posBackground.jpg")}
                style={{width: wp("100%"), height: hp("100%")}} >
                { this.state.pageLoading ? <Spinner color='blue' style={{position: 'absolute',
                    backgroundColor : 'rgba(0,0,0,0.4)', height : hp('100%'),
                    width : wp('100%')}} /> : null}
                <Container style={{backgroundColor: "rgba(0,0,0,0.5)"}}>

                    <Content padder>
                    <KeyboardAvoidingView behavior="position" enabled>
                        <View style={{justifyContent: "center", alignItems: "center",
                            marginTop : hp('10%')}}>
                            <Image source={require("../assets/img/logo-syn1.png")}
                                   style={{height: hp('30%'),
                                       width: wp('70%'), resizeMode: "contain"}}/>
                        </View>
                        <Form>
                            {/*<Item floatingLabel>
                            <Label>SomeLabel</Label>
                            <Input
                                getRef={(input) => { this.textInput = input; }}
                                keyboardType="numeric"
                                onChangeText={text => this.setState({ inputState: false })}
                                value={this.state.inputValue}
                            />   error={!this.state.formNameValid ? true : false}
                        </Item>*/}

                            {/* Name */}
                            <Item floatingLabel
                                  success={this.state.formNameValid === true ? true : null}
                                  error={this.state.formNameValid === false ? true : null}>
                                <Label style={{color : 'white'}}>Name</Label>
                                <Input onChangeText={text => {
                                    this.state.formName = text;
                                    this.validate();
                                }}
                                       value={this.state.formName}
                                       style={{color : 'white'}}
                                />
                                <Icon name={this.showValidityIcon(this.state.formNameValid)}  style={{color : 'white'}}/>
                            </Item>

                            {/* Email */}
                            <Item floatingLabel
                                  success={this.state.formEmailValid === true ? true : null}
                                  error={this.state.formEmailValid === false ? true : null}>
                                <Label style={{color : 'white'}}>Email</Label>
                                <Input onChangeText={text => {
                                    this.state.formEmail = text;
                                    this.validate();
                                }}
                                       value={this.state.formEmail.toLocaleLowerCase()}
                                       style={{color : 'white'}}
                                       keyboardType="email-address"
                                />
                                <Icon name={this.showValidityIcon(this.state.formEmailValid)} style={{color : 'white'}} />
                            </Item>

                             {/* Mobile */}
                             <Item floatingLabel
                                  success={this.state.formMobileValid === true ? true : null}
                                  error={this.state.formMobileValid === false ? true : null}>
                                <Label style={{color : 'white'}}>Mobile Number</Label>
                                <Input onChangeText={text => {
                                    this.state.formMobile = text;
                                    this.validate();
                                }}
                                       value={this.state.formMobile}
                                       style={{color : 'white'}}
                                       keyboardType="phone-pad"
                                />
                                <Icon name={this.showValidityIcon(this.state.formMobileValid)} style={{color : 'white'}} />
                            </Item>

                            {/* Address */}
                            <Item floatingLabel
                                  success={this.state.formAddressValid === true ? true : null}
                                  error={this.state.formAddressValid === false ? true : null}>
                                <Label style={{color : 'white'}} >Address</Label>
                                <Input style={{color : 'white'}} onChangeText={text => {
                                    this.state.formAddress = text;
                                    this.validate();
                                }}
                                value={this.state.formAddress}
                                />
                                <Icon name={this.showValidityIcon(this.state.formAddressValid)} style={{color : 'white'}} />
                            </Item>

                            <Text></Text>

                            <Button block primary onPress={ () => this.submitForm()}>
                                <Text>Submit</Text>
                            </Button>

                        </Form>
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')}>
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
                                        Login
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
                    </KeyboardAvoidingView>
                    </Content>

                    {/* <Content>
                    <Item>
                        <Icon active name='home' />
                        <Input placeholder='Icon Textbox'/>
                    </Item>
                    <Item>
                        <Input placeholder='Icon Alignment in Textbox'/>
                        <Icon active name='swap' />
                    </Item>
                </Content>*/}

                </Container>
            </ImageBackground>
        );
    }
}

export default SignUpScreen;
