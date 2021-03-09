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
import signUpStrings from '../localization/signUpStrings';

const soldBy = [
    { label: 'Other', value: 'Other' },
    { label: 'Master', value: 'Master' },
    { label: 'VISA', value: 'VISA' },
    { label: 'Amex', value: 'Amex' },
];


class SplitCardScreen extends React.Component {

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
            cardType: "Other",
            cardNumber: "",
            cardNumberValid: ""
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false,
            change: this.state.data.PriceReceived - this.state.data.ChargeAmount,
        });
        console.log("data", this.state.data)

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            changeRem: this.state.change
        })


    };

    validate() {

        // Email
        if (this.state.emailValid !== null || this.state.email !== "") {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(this.state.email).toLowerCase())) {
                this.state.emailValid = true;
            } else {
                this.state.emailValid = false;
            }
        }

        // Card Number
        if (this.state.cardNumberValid !== null || this.state.cardNumber !== "") {
            var re = /^[0-9]{4}$/;

            if (re.test(String(this.state.cardNumber))) {
                this.state.cardNumberValid = true;
            } else {
                this.state.cardNumberValid = false;
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
            paymentType: "Card"
        }
        axios
            .post(AppURLS.ApiBaseUrl + 'charge/sendReceipt', data)
            .then(response => {
                console.log("backend data", JSON.stringify(response));
                if (response.data.success) {
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    console.log("data =========>", response);
                    this.showToast("Email sent successfully!", "ok", "success");
                } else {
                    this.showToast("Error Occured", "Ok", "warning");
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

    submitCash() {
        let newChrageAmount = this.state.data.TotalChargeAmount - this.state.data.ChargeAmount

        if (this.state.cardNumberValid === true) {
            if (this.state.data.data) {
                this.state.data.data[0].paid = true;
                this.state.data.data[0].price = this.state.data.ChargeAmount;
                this.state.data.data[0].paymentType = "Card";
                this.state.data.data[0].cardType = this.state.cardType;
                this.state.data.data[0].cardNumber = this.state.cardNumber;
            }
            var res = this.state.data.splitArray.map(obj => this.state.data.data.find(o => o.count === obj.count) || obj);
            let count = 0
            this.state.data.splitArray.map(item => {
                if (!item.paid) {
                    count++
                }
            })

            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa", res)
            console.log('ssssssssss', count)


            this.props.navigation.navigate('SplitScreen', {
                data: {
                    ChargeAmount: newChrageAmount,
                    ChargeItems: this.state.data.ChargeItems,
                    TotalAmount: this.state.data.TotalAmount,
                    DiscountedAmount: this.state.data.DiscountedAmount,
                    CustomerData: this.state.data.CustomerData,
                    splitArray: res,
                    success: true,
                    remCount: count,
                    count: this.state.data.count,
                }
            })


        } else {
            this.showToast("Please Enter last 4 digits", "Ok", "warning");
        }


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
                        <Icon onPress={() => {
                        let count = 0
                        this.state.data.splitArray.map(item => {
                            if (!item.paid) {
                                count++
                            }
                        })

                        this.props.navigation.navigate('SplitScreen', {
                            data: {
                                ChargeAmount: this.state.data.TotalChargeAmount,
                                ChargeItems: this.state.data.ChargeItems,
                                TotalAmount: this.state.data.TotalAmount,
                                DiscountedAmount: this.state.data.DiscountedAmount,
                                CustomerData: this.state.data.CustomerData,
                                splitArray: this.state.data.splitArray,
                                success: true,
                                remCount: this.state.data.splitArray.length,
                                count: count,
                            }
                        })}}
                            name="arrow-back" style={{ color: 'white', marginStart: wp('3%') }} />
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
                                <Text>{signUpStrings.splitAmount}</Text>
                            </View>
                        </View>

                    </View>

                    <Form>
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: wp('6%') }}>
                            <View style={{ width: wp('40%'), marginTop: wp('4%'), marginLeft: wp('5%') }}>
                                <Text>
                                    Select Card Type :
                                </Text>
                            </View>
                            <View style={{ width: wp('50%') }}>
                                {
                                    soldBy.map((data, key) => {
                                        return (
                                            <ListItem key={key} noBorder>

                                                <Left>
                                                    <Radio
                                                        color={'blue'}
                                                        selectedColor={"blue"}
                                                        onPress={() => this.setState({ cardType: data.value })}
                                                        selected={data.value === this.state.cardType}
                                                    />

                                                    <Text style={{ marginLeft: wp('4%') }}>{data.label}</Text>
                                                </Left>
                                            </ListItem>
                                        )
                                    })
                                }
                            </View>
                        </View>


                        <Item floatingLabel
                            success={this.state.cardNumberValid === true ? true : null}
                            error={this.state.cardNumberValid === false ? true : null}>
                            <Label>Enter Last 4 Digits</Label>
                            <Input onChangeText={text => {
                                this.state.cardNumber = text;
                                this.validate();
                            }}
                                value={this.state.cardNumber}
                                style={{ color: 'black' }}
                                keyboardType="phone-pad"
                            />
                            <Icon name={this.showValidityIcon(this.state.cardNumberValid)} />
                        </Item>
                        {/* Email */}
                        {/*<View style={{ flex: 1, flexDirection: 'row' }}>*/}
                        {/*    <View style={{ width: wp('80%'), justifyContent: 'flex-end' }}>*/}
                        {/*        <Item floatingLabel*/}
                        {/*            success={this.state.emailValid === true ? true : null}*/}
                        {/*            error={this.state.emailValid === false ? true : null}>*/}
                        {/*            <Icon name='md-mail' style={{ color: 'gray' }} />*/}
                        {/*            <Label style={{ color: 'gray', marginStart: wp('3%') }}>{signUpStrings.enterEmail}</Label>*/}
                        {/*            <Input onChangeText={text => {*/}
                        {/*                this.state.email = text;*/}
                        {/*                this.validate();*/}

                        {/*            }}*/}
                        {/*                value={this.state.email}*/}
                        {/*            />*/}

                        {/*        </Item>*/}
                        {/*    </View>*/}

                        {/*    /!*<View style={{ width: wp('20%'), justifyContent: 'flex-end', marginLeft: wp('3%') }}>*!/*/}
                        {/*    /!*    <Icon name="md-send" onPress={() => this.sendEmail()} />*!/*/}
                        {/*    /!*</View>*!/*/}

                        {/*</View>*/}

                    </Form>
                    <Text></Text>

                    <View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: wp('95%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                <Button style={{ width: wp('95%'), backgroundColor: "gray", alignSelf: 'center' }} onPress={() => {
                                    this.submitCash()
                                }} >
                                    <Text style={{}}>{signUpStrings.pay}</Text>
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
export default connect(mapStateToProps, matchDispatchToProps)(SplitCardScreen);

