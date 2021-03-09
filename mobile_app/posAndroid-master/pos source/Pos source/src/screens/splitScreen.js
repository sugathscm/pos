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
    Spinner, Radio, Card
} from "native-base";
import {
    Image, ImageBackground, Platform, StyleSheet, View, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert, TextInput
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
import ModalSelector from 'react-native-modal-selector';
import signUpStrings from '../localization/signUpStrings';


class SplitScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            dropdown: {},
            paymentType: "Cash",
            splitCount: [],
            price: "",
            count: 1,
        };
    }
    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false,
            price: this.state.data.ChargeAmount.toFixed(2),
            splitCount: [{ count: 1, paid: false }]
        });
        console.log("Charge", this.state.data)
    }

    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }
    submitForm() {
        console.log("submitting form..", this.props.userData.userData.companyId);
        this.state.pageLoading = true;
        this.forceUpdate();
        console.log(this.state.calculatedTotalDue, "sssssssssss")
        let Items = {
            userId: this.props.userData.loginData.uid,
            userName: this.props.userData.userData.name,
            companyId: this.props.userData.userData.companyId,
            items: this.state.data.ChargeItems,
            totalPaid: JSON.stringify(this.state.data.TotalAmount),
            totalAmount: this.state.data.TotalAmount,
            splitArray: this.state.data.splitArray,
            discountedAmount: this.state.data.DiscountedAmount,
            discountNameTotBill: this.state.data.DiscountName,
            discountTypeTotBill: this.state.data.DiscountType,
            chargeAmount: this.state.data.TotalAmount,
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

                    if (this.state.data.CustomerData) {
                        axios.post(AppURLS.ApiBaseUrl + 'customers/visits', cusObj)
                            .then(res => {
                                console.log("data =========>", response);
                                this.showToast("Charge added successfully!", "ok", "success");
                                this.props.navigation.navigate('SalesScreen');

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
                    } else {
                        this.showToast("Charge added successfully!", "ok", "success");
                        this.props.navigation.navigate('SalesScreen')

                    }
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

        let index = 0;
        const paymentMethods = [
            { key: index++, label: `${signUpStrings.cash}` },
            { key: index++, label: `${signUpStrings.card}` },
        ];
        var k = 'value';

        return (

            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon onPress={() =>
                            Alert.alert(
                                'Cancel payment',
                                'Are you sure you want to cancel all payments?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Continue', onPress: () => {
                                            this.props.navigation.navigate('SalesScreen')
                                        }
                                    },
                                ],
                                { cancelable: false },
                            )

                        }
                            name="md-close" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }} >
                        <Title></Title>
                    </Body>
                    <Right>
                        {this.state.data.remCount == 0 ? <Button transparent color="white"
                            onPress={() =>
                                this.submitForm()
                            }>
                            <Text>{signUpStrings.done}</Text>
                        </Button> : <Button transparent color="white">
                                <Text style={{ color: 'gray' }}>{signUpStrings.done}</Text>
                            </Button>}
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

                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: wp('-1%') }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        count: this.state.data.count? --this.state.data.count : --this.state.count,
                                        price: (this.state.data.ChargeAmount / this.state.count).toFixed(2),
                                    })
                                    this.state.data.remCount ? this.state.data.remCount = this.state.data.remCount - 1 : null
                                    this.state.splitCount.pop();
                                    this.state.splitArray ? this.state.splitArray.pop() : null
                                    console.log("aaaaa", this.state.price)
                                }}>
                                <View style={{ width: wp('20%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}
                                >
                                    <View style={{
                                        width: wp('16%'), height: wp('17%'), marginLeft: wp('0%'), marginRight: wp('0%'), marginBottom: wp('4%'), marginTop: wp('4%'),
                                        backgroundColor: 'rgba(238, 236, 235, 1)', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <Text style={{ fontSize: hp('7.5%') }}>-</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: wp('60%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{
                                    width: wp('56%'), height: wp('17%'), marginLeft: wp('0%'), marginRight: wp('0%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)'
                                    , justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Text>{this.state.data.count? this.state.data.count : this.state.count}</Text>
                                    <Text>{signUpStrings.payments}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={
                                () => {
                                    this.setState({
                                        count: this.state.data.count? ++this.state.data.count : ++this.state.count,
                                        price: (this.state.data.ChargeAmount / this.state.count).toFixed(2),
                                    })
                                    console.log("sssssssss", this.state.count)
                                    obj = {
                                        count: this.state.data.count? this.state.data.count : this.state.count,
                                        paid: false
                                    }
                                    this.state.data.remCount ? this.state.data.remCount = this.state.data.remCount + 1 : null
                                    console.log(this.state.data.ChargeAmount / this.state.count)
                                    this.state.splitCount.push(obj)
                                    this.state.data.splitArray ? this.state.data.splitArray.push(obj) : null

                                    console.log("Array", this.state.splitCount)
                                }
                            }>
                                <View style={{ width: wp('20%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <View style={{ width: wp('16%'), height: wp('17%'), marginLeft: wp('0%'), marginTop: wp('4%'), marginBottom: wp('4%'), marginRight: wp('4%'), backgroundColor: 'rgba(238, 236, 235, 1)', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: hp('5.5%') }}>+</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {this.state.data.success ? this.state.data.splitArray.map((item, index) => {
                            let objArr = [];
                            objArr.push(item);
                            const uniqueKey = "index" + index;
                            //success
                            return (
                                <Card style={{ borderRadius: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View style={{ width: wp('20%'), height: wp('16%'), justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon onPress={() =>
                                                console.log("aaaaaaaa")}
                                                name="md-trash" style={{ color: 'black', marginRight: 15, fontSize: hp('5%') }} />
                                        </View>
                                        <View style={{ width: wp('70%') }}>

                                            <Form>
                                                <ModalSelector
                                                    data={paymentMethods}
                                                    initValue="Cash"
                                                    supportedOrientations={['landscape']}
                                                    accessible={true}
                                                    scrollViewAccessibilityLabel={'Scrollable options'}
                                                    cancelButtonAccessibilityLabel={'Cancel Button'}
                                                    onChange={(option) => { 
                                                        const newCheckboxValues = this.state.dropdown;
                                                        newCheckboxValues[uniqueKey] = option.label
                                                        this.setState({
                                                            dropdown: newCheckboxValues,
                                                            paymentType : newCheckboxValues[uniqueKey]
                                                        })
                                                     }}>
                                                    <Input
                                                        color="red"
                                                        editable={false}
                                                        placeholder={signUpStrings.Cash}
                                                        value={this.state.dropdown[uniqueKey]}key={item.count} />
                                                </ModalSelector>
                                            </Form>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View style={{ width: wp('10%'), justifyContent: 'center', alignItems: 'center' }}>
                                        </View>
                                        <View style={{ width: wp('50%'), justifyContent: 'center', alignItems: 'center' }}>
                                            <Item floatingLabel style={{ marginLeft: wp('4%') }}
                                            >
                                                <Label>Price</Label>
                                                <Input disabled
                                                    onChangeText={text => {
                                                        this.state.price = text;
                                                        this.forceUpdate()
                                                    }}
                                                    value={item.paid ? item.price : (this.state.data.ChargeAmount / this.state.data.remCount).toFixed(2)}
                                                    keyboardType="phone-pad"
                                                    style={{ color: "black" }}
                                                />
                                                {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                                            </Item>
                                        </View>
                                        <View style={{ width: wp('30%') }}>
                                            {this.state.paymentType == "Cash" ? <Button
                                                onPress={() =>
                                                    this.props.navigation.navigate('SplitCashScreen',
                                                        {
                                                            data: {
                                                                TotalChargeAmount: this.state.data.ChargeAmount,
                                                                ChargeAmount: item.paid ? item.price : (this.state.data.ChargeAmount / this.state.data.remCount).toFixed(2),
                                                                ChargeItems: this.state.data.ChargeItems,
                                                                PriceReceived: this.state.PriceReceived,
                                                                TotalAmount: this.state.data.TotalAmount,
                                                                DiscountedAmount: this.state.data.DiscountedAmount,
                                                                DiscountName: this.state.data.DiscountName,
                                                                DiscountType: this.state.data.DiscountType,
                                                                CustomerData: this.state.data.CustomerData,
                                                                splitArray: this.state.data.splitArray,
                                                                data: objArr,
                                                                From: "split",
                                                                paymentType: this.state.paymentType,
                                                                count: this.state.data.count
                                                            }
                                                        })}
                                                style={{
                                                    marginVertical: wp('2.5%'), borderRadius: 6,
                                                    marginLeft: wp('5%'), justifyContent: 'center'
                                                }}>
                                                <Body>{item.paid ? <Icon onPress={() =>
                                                    console.log("aaaaaaaa")}
                                                    name="checkmark-circle" style={{ color: 'white' }} /> :
                                                    <Text style={{ color: 'white', fontSize: wp('4.5%') }}>{signUpStrings.charge}</Text>
                                                }

                                                </Body>
                                            </Button> : <Button
                                                onPress={() =>
                                                    this.props.navigation.navigate('SplitCardScreen',
                                                        {
                                                            data: {
                                                                TotalChargeAmount: this.state.data.ChargeAmount,
                                                                ChargeAmount: item.paid ? item.price : (this.state.data.ChargeAmount / this.state.data.remCount).toFixed(2),
                                                                ChargeItems: this.state.data.ChargeItems,
                                                                PriceReceived: this.state.PriceReceived,
                                                                TotalAmount: this.state.data.TotalAmount,
                                                                DiscountedAmount: this.state.data.DiscountedAmount,
                                                                DiscountName: this.state.data.DiscountName,
                                                                DiscountType: this.state.data.DiscountType,
                                                                CustomerData: this.state.data.CustomerData,
                                                                splitArray: this.state.data.splitArray,
                                                                count: this.state.data.count,
                                                                data: objArr,
                                                                From: "split",
                                                                paymentType: this.state.paymentType
                                                            }
                                                        })}
                                                style={{
                                                    marginVertical: wp('2.5%'), borderRadius: 6,
                                                    marginLeft: wp('5%'), justifyContent: 'center'
                                                }}>
                                                    <Body>{item.paid ? <Icon onPress={() =>
                                                        console.log("aaaaaaaa")}
                                                        name="checkmark-circle" style={{ color: 'white' }} /> :
                                                        <Text style={{ color: 'white', fontSize: wp('4.5%') }}>{signUpStrings.charge}</Text>
                                                    }

                                                    </Body>
                                                </Button>}

                                        </View>
                                    </View>
                                </Card>

                            )
                        }) :
                            //success false
                            this.state.splitCount.map((item, index) => {
                                let objArr = []
                                objArr.push(item);
                                const uniqueKey = "index" + index;

                                return (
                                    <Card style={{ borderRadius: 10 }} key={index}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ width: wp('20%'), height: wp('16%'), justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon onPress={() =>
                                                    console.log("aaaaaaaa")}
                                                    name="md-trash" style={{ color: 'black', marginRight: 15, fontSize: hp('5%') }} />
                                            </View>
                                            <View style={{ width: wp('70%') }}>

                                                <Form>
                                                    <ModalSelector
                                                        data={paymentMethods}
                                                        initValue="Cash"
                                                        supportedOrientations={['landscape']}
                                                        accessible={true}
                                                        scrollViewAccessibilityLabel={'Scrollable options'}
                                                        cancelButtonAccessibilityLabel={'Cancel Button'}
                                                        onChange={(option) => {
                                                            const newCheckboxValues = this.state.dropdown;
                                                            newCheckboxValues[uniqueKey] = option.label
                                                            this.setState({
                                                                dropdown: newCheckboxValues,
                                                                paymentType : newCheckboxValues[uniqueKey]
                                                            })
                                                        }}
                                                        >
                                                        <Input
                                                            color="red"
                                                            editable={false}
                                                            placeholder={signUpStrings.cash}
                                                            value={this.state.dropdown[uniqueKey]}key={item.count} />
                                                            
                                                    </ModalSelector>
                                                </Form>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ width: wp('10%'), justifyContent: 'center', alignItems: 'center' }}>
                                            </View>
                                            <View style={{ width: wp('50%'), justifyContent: 'center', alignItems: 'center' }}>
                                                <Item floatingLabel style={{ marginLeft: wp('4%') }}
                                                >
                                                    <Label>Price</Label>
                                                    <Input disabled
                                                        onChangeText={text => {
                                                            this.state.price = text;
                                                            this.forceUpdate()
                                                        }}
                                                        value={this.state.price ? this.state.price : ''}
                                                        keyboardType="phone-pad"
                                                        style={{ color: "black" }}
                                                    />
                                                    {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                                                </Item>
                                            </View>
                                            <View style={{ width: wp('30%') }}>
                                                {this.state.paymentType == "Cash" ? <Button
                                                    onPress={() =>
                                                        this.props.navigation.navigate('SplitCashScreen',
                                                            {
                                                                data: {
                                                                    TotalChargeAmount: this.state.data.ChargeAmount,
                                                                    ChargeAmount: this.state.price,
                                                                    ChargeItems: this.state.data.ChargeItems,
                                                                    PriceReceived: this.state.PriceReceived,
                                                                    TotalAmount: this.state.data.TotalAmount,
                                                                    DiscountedAmount: this.state.data.DiscountedAmount,
                                                                    DiscountName: this.state.data.DiscountName,
                                                                    DiscountType: this.state.data.DiscountType,
                                                                    CustomerData: this.state.data.CustomerData,
                                                                    splitArray: this.state.splitCount,
                                                                    count: this.state.count,
                                                                    data: objArr,
                                                                    From: "split",
                                                                    paymentType: this.state.paymentType
                                                                }

                                                            })}
                                                    style={{
                                                        marginVertical: wp('2.5%'), borderRadius: 6,
                                                        marginLeft: wp('5%'), justifyContent: 'center'
                                                    }}>
                                                    <Body>{item.paid ? <Icon onPress={() =>
                                                        console.log("aaaaaaaa")}
                                                        name="checkmark-circle" style={{ color: 'black' }} /> :
                                                        <Text style={{ color: 'white', fontSize: wp('4.5%') }}>{signUpStrings.charge}</Text>
                                                    }

                                                    </Body>
                                                </Button> : <Button
                                                    onPress={() =>
                                                        this.props.navigation.navigate('SplitCardScreen',
                                                            {
                                                                data: {
                                                                    TotalChargeAmount: this.state.data.ChargeAmount,
                                                                    ChargeAmount: this.state.price,
                                                                    ChargeItems: this.state.data.ChargeItems,
                                                                    PriceReceived: this.state.PriceReceived,
                                                                    TotalAmount: this.state.data.TotalAmount,
                                                                    DiscountedAmount: this.state.data.DiscountedAmount,
                                                                    DiscountName: this.state.data.DiscountName,
                                                                    DiscountType: this.state.data.DiscountType,
                                                                    CustomerData: this.state.data.CustomerData,
                                                                    splitArray: this.state.splitCount,
                                                                    count: this.state.count,
                                                                    data: objArr,
                                                                    From: "split",
                                                                    paymentType: this.state.paymentType
                                                                }

                                                            })}
                                                    style={{
                                                        marginVertical: wp('2.5%'), borderRadius: 6,
                                                        marginLeft: wp('5%'), justifyContent: 'center'
                                                    }}>
                                                        <Body>{item.paid ? <Icon onPress={() =>
                                                            console.log("aaaaaaaa")}
                                                            name="checkmark-circle" style={{ color: 'black' }} /> :
                                                            <Text style={{ color: 'white', fontSize: wp('4.5%') }}>{signUpStrings.charge}</Text>
                                                        }

                                                        </Body>
                                                    </Button>}

                                            </View>
                                        </View>
                                    </Card>
                                )
                            })}
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
export default connect(mapStateToProps, matchDispatchToProps)(SplitScreen);

