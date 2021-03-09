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

class LogoutScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        console.log("logging out...");
        this.props.navigation.navigate('SignIn');
        this.forceUpdate();
        console.log("AFTER...");
    }


    // Render any loading content that you like here
    render() {
        return (
            <Container>
                <ImageBackground
                    source={require("../assets/img/lawyerdesk.jpg")}
                    style={{ height: hp("100%")}} >
                    {/* Spinner */}
                    { true ? <Spinner color='blue' style={{position: 'absolute',
                        backgroundColor : 'rgba(0,0,0,0.1)', height : hp('100%'),
                        width : wp('100%'), zIndex:2000}} /> : null}
                    <Content padder>
                        <KeyboardAvoidingView behavior="position" enabled>
                            <View style={{justifyContent: "center", alignItems: "center",
                                marginTop : hp('10%')}}>
                                <Image source={require("../assets/img/scalepic.png")}
                                       style={{height: hp('30%'),
                                           width: wp('70%'), resizeMode: "contain"}}/>
                            </View>
                            <View style={{justifyContent: "center", alignItems: "center",
                                marginTop : hp('20%')}}>
                                <H1 style={{color  :'white'}}>{signUpStrings.logOut}</H1>
                                <H3 style={{color  :'white'}}>{signUpStrings.logginOut}</H3>
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
export default connect(mapStateToProps, matchDispatchToProps)(LogoutScreen);
