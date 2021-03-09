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
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { decrement, getCases, increment, multiply } from "../redux/actions";
import { bindActionCreators } from 'redux';
import { Switch } from 'react-native-base-switch';
import { connect } from 'react-redux';
import moment from "./homeScreen";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import { SearchBar } from "react-native-elements";
import signUpStrings from "../localization/signUpStrings";


class CustomerToTicketScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            search: '',
            allCustomers: [],
            selectedCustomers : [],
            tktCount : 0
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false
        });
        this.props.getCases(this.props.userData);
    }

    componentWillReceiveProps(nextProps) {
        console.log("aaaaaaaaaaaaaa", nextProps.userData.allCustomers)
        if (!nextProps.userData.allCustomers) {
            this.setState({
                ...this.state,
                isVisible: false
            });
            return;
        }
        this.state.allCustomers = [];
        Object.keys(nextProps.userData.allCustomers).forEach(function (key, index) {
            let obj = nextProps.userData.allCustomers[key];
            obj._id = key;
            let customerId = obj._id;
            obj.customerDetails = nextProps.userData.allCustomers[customerId];
            this.state.allCustomers[this.state.allCustomers.length] = obj;
            this.state.selectedCustomers[this.state.selectedCustomers.length] = obj;
        }.bind(this));
        this.forceUpdate();

    };


    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }

    updateSearch = search => {
        this.setState({ search });
        //console.log("filtering dates..", this.state.allCases);
        this.state.selectedCustomers = [];
        if (this.state.allCustomers) {
            this.state.selectedCustomers = this.state.allCustomers.filter((res, index) => {
                return (res.name.toLowerCase().includes(search.toLowerCase()));
            });
        }
        this.forceUpdate();
    };


    render() {
        const { navigation } = this.props;
        const data = navigation.getParam('data');
        //const tktCount = navigation.getParam('tktCount');

        this.state.data = data;
        this.state.tktCount = data.tktCount;
        const { search } = this.state;

        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity :
            TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;

        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row', width: wp('15%') }}>
                        <Icon onPress={() =>
                            this.props.navigation.navigate('SalesScreen',
                                {
                                    data: this.state.data,
                                    tktCount : this.state.tktCount
                                })}
                            name="md-close" style={{ color: 'white', marginRight: wp('4%') }} />
                    </Left>
                    <Body style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{  color: 'white',textAlign:'center' }}>
                            {signUpStrings.AddCustomerToTicket}
                        </Text>
                    </Body>

                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content>
                    <View>
                    <View searchBar style={{ width: wp('94%'), marginStart: wp('3%') , borderBottomWidth:wp('0.5%') }}>
                                    <SearchBar
                                        searchIcon={{ size: hp('3%') }}
                                        placeholder={signUpStrings.searchInAddCustomer}
                                        onChangeText={this.updateSearch}
                                        value={search}
                                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
                                        inputContainerStyle={{ backgroundColor: 'rgba(0,0,0,0)', width: wp('90%') }}
                                        inputStyle={{ fontSize: hp('2.4%') }}
                                    />
                                </View>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", }}>
                        <Button full light style={{ height: wp('14%') }}
                            onPress={() => this.props.navigation.navigate('CreateCustomer')}>
                            <Text style={{ color: 'blue' }}>{signUpStrings.AddNewCustomer}</Text>
                        </Button>
                        <Text style={{ color: 'gray', marginTop: wp('3%') }}>{signUpStrings.YourMostRecentCustomerShowUpHere}</Text>
                    </View>
                    {/* Recent customer section */}

                    <View style={{ height: hp('60%'), marginTop: hp('3%') }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {
                                this.state.selectedCustomers ? (
                                    this.state.selectedCustomers.length !== 0 ? (
                                        this.state.selectedCustomers.map((res, index) => (
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CustomerProfileScreen' , {
                                                data: this.state.data,
                                                tktCount: this.state.tktCount,
                                                customer:res
                                            })}>
                                                <View style={{ flex: 1, flexDirection: 'row', marginVertical: wp('4%') }}>
                                                    <View style={{ width: wp('20%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                        <View style={{ width: wp('17%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                            <Icon
                                                                style={{ marginStart: wp('3%'), color: 'gray', fontWeight: 'bold', fontSize: hp('7%') }}
                                                                name='md-person' />
                                                        </View>
                                                    </View>
                                                    <View style={{
                                                        borderBottomWidth: 1, borderColor: '#d6d7da', width: wp('80%'), flexDirection: 'row',
                                                        paddingBottom: wp('3%')
                                                    }}>
                                                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0)' }}>
                                                            <View style={{ width: wp('70%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                                <Text style={{ fontSize: hp('2.6%'), color: 'black' }}>
                                                                    {res.customerDetails ? res.customerDetails.name : ""}
                                                                </Text>
                                                                <Text style={{ fontSize: hp('2.4%'), color: 'gray'}}>
                                                                   {res.customerDetails ? res.customerDetails.email : ""} , {res.customerDetails ? res.customerDetails.mobileNumber :""}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                            <View style={{
                                                width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                                alignItems: "center"
                                            }}>
                                                <Text>
                                                    {signUpStrings.NoCustomer}
                                                </Text>

                                            </View>
                                        )
                                ) : (
                                        <View style={{
                                            width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                            alignItems: "center"
                                        }}>
                                           <Text>
                                           {signUpStrings.NoCustomer}
                                                </Text>
                                        </View>
                                    )}
                        </ScrollView>
                    </View>



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
export default connect(mapStateToProps, matchDispatchToProps)(CustomerToTicketScreen);

