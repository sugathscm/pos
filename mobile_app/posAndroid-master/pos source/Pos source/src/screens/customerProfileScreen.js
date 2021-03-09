import React, { Component } from 'react';
import {
    Container,
    Content,
    Form,
    Header,
    Icon,
    Input,
    Item,
    ListItem,
    Label,
    InputGroup,
    Button,
    Text,
    Left, Right,
    Body,
    Title,
    Toast,
    Picker,
    Spinner, Radio
} from "native-base";
import {
    Image, ImageBackground, Platform, StyleSheet, View, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';
import { SearchBar } from "react-native-elements";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { decrement, getCases, increment, multiply } from "../redux/actions";
import { bindActionCreators } from 'redux';
import { Switch } from 'react-native-base-switch';
import { connect } from 'react-redux';
import moment from "moment";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import signUpStrings from '../localization/signUpStrings';


class CustomerProfileScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            items: [],
            tktCount: 0
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false
        });
        console.log("component did ", this.state.data);
    }

    componentWillReceiveProps(nextProps) {

    };


    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }


    render() {
        const { navigation } = this.props;
        const data = navigation.getParam('data');
        //const tktCount = navigation.getParam('tktCount');

        this.state.data = data;
        this.state.tktCount = data.tktCount;
        const customer = navigation.getParam('customer');
        this.state.customer = customer;

        console.log("CUS PAGE DATA V:", data);

        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity :
            TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;


        return (
            <Container>
                <Header style={{ backgroundColor: 'white' }}>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon onPress={() => this.props.navigation.navigate('SalesScreen', {
                            customerData : null,
                            data: this.state.data,
                            tktCount: this.state.tktCount,
                        })}
                            name="arrow-back" style={{ color: 'black' }} />
                    </Left>
                    <Body style={{ flex: 1 }} >
                        <Title style={{ color: 'black' }}>{signUpStrings.customerProfile}</Title>
                    </Body>
                    <Right style={{ flex: 1 }} >
                        <Button transparent color="white" style={{flex: 1 , marginRight: wp('3%') }}
                            onPress={() => this.props.navigation.navigate('SalesScreen' , {
                                customerData : this.state.customer,
                                data: this.state.data,
                                tktCount: this.state.tktCount,

                                })}>
                            <Text style={{ color: 'green' }}>{signUpStrings.addToTicket}</Text>
                            {/*<Text style={{ color: 'green' }}>{signUpStrings.addToTicket}</Text>*/}
                        </Button>
                    </Right>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content showsVerticalScrollIndicator={false}>

                    <View>
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: wp('8%') }}>
                            <View style={{
                                width: wp('100%'), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0)'
                            }}>
                                <Icon
                                    style={{ color: 'gray', fontWeight: 'bold', fontSize: hp('10%') }}
                                    name='md-person' />
                                <Text style={{ fontSize: hp('3.4%') }}>
                                    {this.state.customer ? this.state.customer.name : ""}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        flex: 1, flexDirection: 'row', paddingVertical: wp('4%')
                    }}>
                        <View style={{
                            width: wp('15%'),
                            marginStart: wp('4%')
                        }}>
                            <Icon
                                style={{ color: 'gray', fontWeight: 'bold', }}
                                name='md-mail' />
                        </View>
                        <View style={{
                            width: wp('80%')
                        }}>
                            <Text> {this.state.customer ? this.state.customer.email : ""}</Text>
                        </View>
                    </View>

                    <View style={{
                        flex: 1, flexDirection: 'row', paddingVertical: wp('4%')
                    }}>
                        <View style={{
                            width: wp('15%'),
                            marginStart: wp('4%')
                        }}>
                            <Icon
                                style={{ color: 'gray', fontWeight: 'bold', }}
                                name='md-call' />
                        </View>
                        <View style={{
                            width: wp('80%')
                        }}>
                            <Text> {this.state.customer ? this.state.customer.mobileNumber : ""}</Text>
                        </View>
                    </View>

                    <View style={{
                        flex: 1, flexDirection: 'row', paddingVertical: wp('4%'), borderBottomWidth: 1, borderColor: '#d6d7da',
                    }}>
                        <View style={{
                            width: wp('15%'),
                            marginStart: wp('4%')
                        }}>
                            <Icon
                                style={{ color: 'gray', fontWeight: 'bold', }}
                                name='md-paper' />
                        </View>
                        <View style={{
                            width: wp('80%')
                        }}>
                            <Text> {this.state.customer ? this.state.customer.note : ""}</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1, flexDirection: 'row', paddingVertical: wp('4%')
                    }}>
                        <View style={{
                            width: wp('15%'),
                            marginStart: wp('4%')
                        }}>
                            <Icon
                                style={{ color: 'gray', fontWeight: 'bold', }}
                                name='md-star' />
                        </View>
                        <View style={{
                            width: wp('80%')
                        }}>
                            <Text>0.00 </Text>
                            <Text>{signUpStrings.points}</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1, flexDirection: 'row', paddingVertical: wp('4%')
                    }}>
                        <View style={{
                            width: wp('15%'),
                            marginStart: wp('4%')
                        }}>
                            <Icon
                                style={{ color: 'gray', fontWeight: 'bold', }}
                                name='md-basket' />
                        </View>
                        <View style={{
                            width: wp('80%')
                        }}>
                            <Text>{this.state.customer ? this.state.customer.visits : 0}</Text>
                            <Text>{signUpStrings.visits} </Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1, flexDirection: 'row', paddingVertical: wp('4%')
                    }}>
                        <View style={{
                            width: wp('15%'),
                            marginStart: wp('4%')
                        }}>
                            <Icon
                                style={{ color: 'gray', fontWeight: 'bold', }}
                                name='md-calendar' />
                        </View>
                        <View style={{
                            width: wp('80%')
                        }}>
                            <Text>{this.state.customer ? moment(this.state.customer.timestamp).format('MMMM Do YYYY, h:mm:ss a') : ""}</Text>
                            <Text>{signUpStrings.lastVisit}</Text>
                        </View>
                    </View>
                    {/*<View style={{flex: 1, flexDirection: 'row', paddingVertical: wp('4%')}}>*/}
                    {/*    <View style={{marginStart: wp('4%')}}>*/}
                    {/*        <Text style={{color:'green'}}>{signUpStrings.editProfile}</Text>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
                    {/*<View style={{flex: 1, flexDirection: 'row', paddingVertical: wp('4%')}}>*/}
                    {/*    <View style={{marginStart: wp('4%')}}>*/}
                    {/*        <Text style={{color:'gray'}}>{signUpStrings.redeemPoints}</Text>*/}
                    {/*    </View>*/}
                    {/*</View>*/}

                </Content>



            </Container>

        );
    }
}

const styles = StyleSheet.create({
});

function mapStateToProps(state) {
    return {
        userData: state.data,
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({ getCases: (data) => getCases(data) }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(CustomerProfileScreen);

