import React, { Component } from 'react';
import {ImageBackground, View,TouchableNativeFeedback,StyleSheet, ScrollView,
    TouchableOpacity, Image} from "react-native";
import {Body, Button, Container, Header, Icon, Left, Right, Spinner,CardItem, Text, Title} from "native-base";
import SignInScreen from "./signInScreen";
import CalendarStrip from "react-native-calendar-strip";
import Counter from "./counter";
import {decrement, getCases, increment, multiply} from "../redux/actions";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from "moment";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";


class UnderConstruction extends React.Component {
    render() {
        let TouchablePlatformSpecific =
            Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;
        let touchableStyle =
            Platform.OS === "ios" ? styles.iosTouchable : styles.androidTouchable;
        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row'}}>
                        <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{flex:1}}>
                        <Title>Home</Title>
                    </Body>
                </Header>
                    <View style={{flex: 1,
                        alignItems: 'stretch',
                        justifyContent: 'center'}}>

                        <Image source={require("../assets/img/deebits-logo.png")}
                               style={{width: wp('100%'), height: hp("15%")}}
                               resizeMode="contain"/>

                        <Text style={{textAlign: "center", fontSize : wp('5%'), marginVertical : hp('5%')}}>
                            We are busy making the best for you!
                        </Text>

                    <Image source={require("../assets/img/under-construction.png")}
                           style={{width: wp('100%'), height: hp("25%")}}
                           resizeMode="contain"/>

                    </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
});


function mapStateToProps(state){
    console.log("State ::: ",state);
    return{
        count : state.multy,
        userData : state.data,
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getCases: (data) => getCases(data), decrement: decrement, multiply: multiply},dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(UnderConstruction);

