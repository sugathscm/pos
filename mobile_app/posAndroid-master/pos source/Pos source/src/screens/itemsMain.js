import React, {Component} from 'react';
import {
    Image, ImageBackground, Platform, StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
} from "react-native-responsive-screen";
import {decrement, getCases, increment, multiply} from "../redux/actions";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from "./homeScreen";
import {Body, Header, Left, Right, Title, Icon, Fab, Container, Toast, Spinner, ListItem} from "native-base";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import signUpStrings from "../localization/signUpStrings";


class AllItems extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageLoading : true
        };
    }

    componentDidMount(){
        this.setState({
            ...this.state,
            pageLoading : false
        });
    }

    componentWillReceiveProps(nextProps) {

    };


    showToast(message,text, type){
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }


    render() {
        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity :
            TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;

        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row'}}>
                        <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: 'white', marginRight: 15 }} />
                        <Title>{signUpStrings.items}</Title>
                    </Left>
                    {/* (this.getSWD() < 500) ? wp('9%') : (this.getSWD() > 1000) ? wp('5%') : wp('7%'),  */}
                    <Body style={{flex:1}}>

                    </Body>
                    <Right>
                    <Icon onPress={() => this.props.navigation.navigate("SalesScreen")} name="md-home" style={{ color: 'white', marginRight: 15 }} />
                    </Right>
                </Header>

                <ListItem thumbnail onPress={() => this.props.navigation.navigate('AllItems')}>
                    <Left>
                            <Icon active name="list" />
                    </Left>
                    <Body>
                        <Text>{signUpStrings.items}</Text>
                    </Body>
                    <Right>
                        <Icon active name="add-circle" onPress={() => this.props.navigation.navigate('NewItem')} />
                    </Right>
                </ListItem>

                <ListItem thumbnail onPress={() => this.props.navigation.navigate('AllCategories')}>
                    <Left>
                            <Icon active name="paper" />
                    </Left>
                    <Body>
                        <Text>{signUpStrings.categories}</Text>
                    </Body>
                    <Right>
                        <Icon active name="add-circle" />
                    </Right>
                </ListItem>

                <ListItem thumbnail onPress={() => this.props.navigation.navigate('AllDiscounts')}>
                    <Left>
                            <Icon active name="pricetags" />
                    </Left>
                    <Body>
                        <Text>{signUpStrings.discounts}</Text>
                    </Body>
                    <Right>
                        <Icon active name="add-circle" />
                    </Right>
                </ListItem>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
});

function mapStateToProps(state){
    return{
        userData : state.data,
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getCases: (data) => getCases(data)}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(AllItems);

