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
    Card,
    Text,
    Left, Right,
    Body,
    Title,
    Toast,
    Picker,
    Spinner, Radio, Button
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
import moment from "./homeScreen";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import signUpStrings from '../localization/signUpStrings'


class CashScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            email: "",
            emailValid: null,
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false,
            change: this.state.data.PriceReceived - this.state.data.ChargeAmount,
        });
        console.log("Data" , this.state.data);

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            changeRem: this.state.change
        })


    };

    validate() {
        console.log("validating form..");
        console.log(this.props.userData, "sssssssssssss")

        // Email
        if (this.state.emailValid !== null || this.state.email !== "") {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(this.state.email).toLowerCase())) {
                this.state.emailValid = true;
            } else {
                this.state.emailValid = false;
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
            return 'send';
        }
    }


    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }

    sendEmail() {
        console.log("Start")
        this.state.pageLoading = true;

        let data = {
            items: this.state.data.ChargeItems,
            email: this.state.email,
            chargeAmount: this.state.data.ChargeAmount,
            discountedAmount: this.state.data.discountedAmount,
            userName: this.props.userData.userData.name,
            companyId: this.props.userData.userData.companyId,
            paymentType: "Cash"
        }
        axios
            .post(AppURLS.ApiBaseUrl + 'charge/sendReceipt', data)
            .then(response => {
                console.log("backend data", JSON.stringify(response));
                if (response.data.success) {
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    console.log("data =========>", response);
                    this.showToast(`${signUpStrings.emailSentSuccessfully}`,`${signUpStrings.ok}`, `${signUpStrings.success}`);
                } else {
                    this.showToast(`${signUpStrings.errorOccured}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                }
            })
            .catch(error => {
                console.log("error", error);
                this.state.pageLoading = false;
                this.forceUpdate();

                if (error.response.data.dialogMessage) {
                    //alert(error.response.data.dialogMessage + " Please try again");
                    this.state.dialogMessage = "Please enter valid details, and try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                } else {
                    this.state.dialogMessage = "Failed adding new charge. Please try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                }

            });

    }

    submitForm() {
        console.log("submitting form..", this.props.userData.userData.companyId);
        this.state.pageLoading = true;
        this.forceUpdate();
        let Items = {
            userId: this.props.userData.loginData.uid,
            userName: this.props.userData.userData.name,
            companyId: this.props.userData.userData.companyId,
            items: this.state.data.ChargeItems,
            totalPaid: this.state.data.PriceReceived,
            totalAmount: this.state.data.TotalAmount,
            discountedAmount: this.state.data.DiscountedAmount,
            discountNameTotBill: this.state.data.DiscountName,
            discountTypeTotBill: this.state.data.DiscountType,
            chargeAmount: this.state.data.ChargeAmount,
            change: JSON.stringify(this.state.change),
            email: this.state.email,
            paymentType: "Cash",

        };

        let cusObj = {
            customerId: this.state.data.CustomerData ? this.state.data.CustomerData._id : null,
        }
        axios
            .post(AppURLS.ApiBaseUrl + 'charge/addCharge', Items)
            .then(response => {
                console.log("backend data", JSON.stringify(response));
                if (response.data.success) {
                    //let newChrageAmount = this.state.totalChargeAmount - this.state.ChargeAmount
                    this.state.pageLoading = false;
                    this.forceUpdate();

                    if(this.state.data.CustomerData){
                        axios.post(AppURLS.ApiBaseUrl + 'customers/visits', cusObj)
                        .then(res => {
                            console.log("data =========>", response);
                            this.showToast(`${signUpStrings.chargeAddedSuccessfully}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                            this.props.navigation.navigate('SalesScreen')


                        })
                        .catch(error => {
                            console.log("error", error);
                            this.state.pageLoading = false;
                            this.forceUpdate();

                            if (error.response.data.dialogMessage) {
                                //alert(error.response.data.dialogMessage + " Please try again");
                                this.state.dialogMessage = "Please enter valid details, and try again";
                                this.setState({
                                    defaultAnimationDialog: true,
                                });
                            } else {
                                this.state.dialogMessage = "Failed adding new charge. Please try again";
                                this.setState({
                                    defaultAnimationDialog: true,
                                });
                            }

                        })
                    }else{
                        this.showToast(`${signUpStrings.chargeAddedSuccessfully}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                        this.props.navigation.navigate('SalesScreen')
                    }
                } else {
                    this.showToast(`${signUpStrings.errorOccured}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                }
            })
            .catch(error => {
                console.log("error", error);
                this.state.pageLoading = false;
                this.forceUpdate();

                if (error.response.data.dialogMessage) {
                    //alert(error.response.data.dialogMessage + " Please try again");
                    this.state.dialogMessage = "Please enter valid details, and try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                } else {
                    this.state.dialogMessage = "Failed adding new charge. Please try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                }

            });

    }


    render() {
        const { navigation } = this.props;
        const data = navigation.getParam('data');
        this.state.data = data;

        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity :
            TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;

        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon onPress={() => this.props.navigation.navigate('SalesScreen')}
                           name="md-close" style={{ color: 'white', marginStart: wp('3%') }} />
                    </Left>
                    <Body style={{ flex: 1 }} >

                    </Body>
                    <Right>

                    </Right>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content padder>
                    <View>
                        <View style={{
                            flex: 1, flexDirection: 'row', justifyContent: "center", marginTop: wp('4%'),
                            alignItems: "center",
                        }}>
                            <View style={{
                                width: wp('48%'), backgroundColor: 'rgba(0,0,0,0)',
                                justifyContent: "center", alignItems: "center"
                            }}>
                                <Text style={{ fontSize: hp('4%') }}>{this.state.data.ChargeAmount}</Text>
                                <Text>Total Amount</Text>
                            </View>
                            <View style={{
                                width: wp('4%'), backgroundColor: 'rgba(0,0,0,0)',
                                justifyContent: "center", alignItems: "center"
                            }}>
                                <View
                                    style={{
                                        height: wp('15%'),
                                        width: 1,
                                        backgroundColor: "gray"
                                    }}
                                />
                            </View>
                            <View style={{
                                width: wp('48%'), backgroundColor: 'rgba(0,0,0,0)',
                                justifyContent: "center", alignItems: "center"
                            }}>
                                <Text style={{ fontSize: hp('5.5%') }}>{this.state.change}</Text>
                                <Text>Change</Text>
                            </View>
                        </View>

                    </View>

                    <Form>
                        {/* Email */}
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: wp('80%'), justifyContent: 'flex-end' }}>
                                <Item floatingLabel
                                    success={this.state.emailValid === true ? true : null}
                                    error={this.state.emailValid === false ? true : null}>
                                    <Icon name='md-mail' style={{ color: 'gray' }} />
                                    <Label style={{ color: 'gray', marginStart: wp('3%') }}>Enter Email</Label>
                                    <Input onChangeText={text => {
                                        this.state.email = text;
                                        this.validate();

                                    }}
                                        value={this.state.data.CustomerData ? this.state.data.CustomerData.email : this.state.email}
                                    />

                                </Item>
                            </View>

                            <View style={{ width: wp('20%'), justifyContent: 'flex-end', marginLeft: wp('3%') }}>
                                <Icon name="md-send" onPress={() => this.sendEmail()} />
                            </View>
                        </View>

                    </Form>
                    <Text></Text>

                    <View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: wp('95%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                <Button style={{ width: wp('95%'), backgroundColor: "gray", alignSelf: 'center' }} onPress={() => {
                                    this.submitForm()
                                }} >
                                    <Text style={{textAlign : 'center', width: wp('95%')}}>NEW SALE</Text>
                                </Button>
                            </View>
                        </View>
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
export default connect(mapStateToProps, matchDispatchToProps)(CashScreen);

