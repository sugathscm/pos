import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import {Container, Content, H1, H3, Spinner} from "native-base";
import {Image, ImageBackground, KeyboardAvoidingView, View} from "react-native";
import {setLoginData} from "../redux/actions";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import signUpStrings from "../localization/signUpStrings";

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        //const allTokens = await AsyncStorage.getAllKeys();
        //console.log("all saved tokens : ", allTokens);
        let userToken = await AsyncStorage.getItem('userData');
        userToken = JSON.parse(userToken);
        //console.log("user token", userToken);

        if(userToken && userToken.email && userToken.email.length > 5 && userToken.password && userToken.password.length  > 5){
            axios
                .post(AppURLS.ApiBaseUrl + 'users/login', { user : {
                        email : userToken.email.toLocaleLowerCase().trim(),
                        password : userToken.password
                    }})
                .then(response => {
                    console.log("API User Login Res : ", response.data);
                    //console.log("User Type", response.data.document.userObject.userType == "main_user");
                    if(response.data.success){
                        this.props.setLoginData(response.data);
                            this.props.navigation.navigate('SalesScreen');
                    }else{
                        console.log("auth failed due to backend false");
                        this.props.navigation.navigate('Auth');
                    }
                })
                .catch(error => {
                    console.log("auth failed api call error..");
                    console.log( "ERROR fetchUser : ", JSON.stringify(error.request._response));
                    this.props.navigation.navigate('Auth');
                });
        }else{
            this.props.navigation.navigate('Auth');
        }


    };

    // Render any loading content that you like here
    render() {
        return (
            <Container>
                <ImageBackground
                    source={require("../assets/img/posBackground.jpg")}
                    style={{width: wp("100%"), height: hp("110%")}} >
                    {/* Spinner */}
                    { true ? <Spinner color='blue' style={{position: 'absolute',
                        backgroundColor : 'rgba(0,0,0,0)', height : hp('100%'),
                        width : wp('100%'), zIndex:2000}} /> : null}
                    <Content padder style={{backgroundColor : 'rgba(0,0,0,0.6)',}}>
                        <KeyboardAvoidingView behavior="position" enabled>
                            <View style={{justifyContent: "center", alignItems: "center",
                                marginTop : hp('10%')}}>
                                <Image source={require("../assets/img/logo-syn1.png")}
                                       style={{
                                           zIndex : 0,
                                           height: hp('30%'),
                                           width: wp('70%'),
                                           resizeMode: "contain"}}/>
                            </View>
                            <View style={{
                                zIndex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop : hp('40%')}}>
                                <H1 style={{}}>{signUpStrings.welcomeToPOS}</H1>
                                <H3 style={{}}>securely logging you in..</H3>
                            </View>
                        </KeyboardAvoidingView>
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}


function mapStateToProps(state){
    return{
        count : state.multy
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({setLoginData : (data) => setLoginData(data)}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(AuthLoadingScreen);
