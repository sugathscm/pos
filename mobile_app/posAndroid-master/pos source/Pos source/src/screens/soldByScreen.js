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
    Card,
    CardItem,
    Spinner, Radio, Separator, Thumbnail
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


class SoldByScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            quantity: "",
            loadingQty: "0",
            chargeAmount: 0,
            chargeItems: [],
            discountedAmount: 0,
            totalAmount: 0
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false,

        });
        console.log("Dataaaaaa", this.state.data)
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
        const item = navigation.getParam('Item')
        this.state.data = data;
        this.state.item = item;

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
                        <Icon onPress={() =>   this.props.navigation.navigate('SalesScreen', { data:{
                                            ChargeAmount: this.state.data.ChargeAmount, 
                                            ChargeItems: this.state.data.ChargeItems ,
                                            DiscountedAmount : this.state.data.DiscountedAmount,
                                            TotalAmount : this.state.data.TotalAmount,
                                            CustomerData : this.state.data.CustomerData ,
                                            TktCount : this.state.data.TktCount
                                        }   })} 
                        name="arrow-back" 
                        style={{ color: 'black', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ color: 'black' }}>{this.state.item.name}</Title>
                    </Body>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content>
                    <Form>

                        <View>

                            <View style={{ flex: 1, flexDirection: 'row', marginTop: hp('8.7%') }}>
                                <View style={{ width: wp('77%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <View style={{
                                        width: wp('62%'), height: wp('17%'), margin: wp('4%'),
                                        backgroundColor: 'rgba(0,0,0,0)'
                                    }}>
                                        <Text>Quantity</Text>
                                        <Text style={{ fontSize: hp('5.5%') }}>{this.state.quantity !== "" ? this.state.quantity : this.state.loadingQty}</Text>
                                    </View>
                                </View>
                                <View style={{ width: wp('23%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <TouchablePlatformSpecific onPress={() =>
                                        this.setState({
                                            quantity: this.state.quantity.substring(0, this.state.quantity.length - 1),
                                        })}>
                                        <View style={{
                                            width: wp('22%'), height: wp('17%'), margin: wp('4%'),
                                            marginRight: 0,
                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Icon name="md-backspace" style={{ color: 'black', marginRight: 5 }} />
                                        </View>
                                    </TouchablePlatformSpecific>
                                </View>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', borderTopWidth: wp('0.5%'), borderColor: '#d6d7da' }}>
                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "1"
                                    })

                                }>
                                    <View style={{
                                        width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)',
                                        borderRightWidth: wp('0.5%'), borderColor: '#d6d7da'
                                    }}>
                                        <View style={{
                                            width: wp('25%'), height: wp('17%'), margin: wp('4%'),
                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>1</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>

                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "2"
                                    })}>
                                    <View style={{
                                        width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)',
                                        borderRightWidth: wp('0.5%'), borderColor: '#d6d7da'
                                    }}>
                                        <View style={{
                                            width: wp('25%'), height: wp('17%'), margin: wp('4%'),
                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>2</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>

                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "3"
                                    })}>
                                    <View style={{ width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{
                                            width: wp('25%'), height: wp('17%'), margin: wp('4%'),
                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>3</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', borderTopWidth: wp('0.5%'), borderColor: '#d6d7da' }}>
                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "4"
                                    })}>
                                    <View style={{
                                        width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)',
                                        borderRightWidth: wp('0.5%'), borderColor: '#d6d7da'
                                    }}>
                                        <View style={{
                                            width: wp('25%'), height: wp('17%'), margin: wp('4%'),
                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>4</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>

                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "5"
                                    })}>
                                    <View style={{
                                        width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)',
                                        borderRightWidth: wp('0.5%'), borderColor: '#d6d7da'
                                    }}>
                                        <View style={{ width: wp('25%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>5</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>

                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "6"
                                    })}>
                                    <View style={{ width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{
                                            width: wp('25%'), height: wp('17%'), margin: wp('4%'),
                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>6</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', borderTopWidth: wp('0.5%'), borderColor: '#d6d7da' }}>

                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "7"
                                    })}>
                                    <View style={{
                                        width: wp('33%'), height: wp('25%'),
                                        backgroundColor: 'rgba(0,0,0,0)', borderRightWidth: wp('0.5%'), borderColor: '#d6d7da'
                                    }}>
                                        <View style={{
                                            width: wp('25%'), height: wp('17%'), margin: wp('4%'),
                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>7</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>

                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "8"
                                    })}>
                                    <View style={{
                                        width: wp('33%'), height: wp('25%'),
                                        backgroundColor: 'rgba(0,0,0,0)', borderRightWidth: wp('0.5%'), borderColor: '#d6d7da'
                                    }}>
                                        <View style={{
                                            width: wp('25%'), height: wp('17%'), margin: wp('4%'),
                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>8</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>

                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "9"
                                    })}>
                                    <View style={{ width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{
                                            width: wp('25%'), height: wp('17%'), margin: wp('4%'),
                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>9</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>
                            </View>
                            <View style={{
                                flex: 1, flexDirection: 'row', borderTopWidth: wp('0.5%'),
                                borderBottomWidth: wp('0.5%'), borderColor: '#d6d7da'
                            }}>
                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "0"
                                    })}>
                                    <View style={{
                                        width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)',
                                        borderRightWidth: wp('0.5%'), borderColor: '#d6d7da'
                                    }}>
                                        <View style={{ width: wp('25%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>0</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>

                                <TouchablePlatformSpecific onPress={() =>
                                    this.setState({
                                        quantity: this.state.quantity + "."
                                    })}>
                                    <View style={{
                                        width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)',
                                        borderRightWidth: wp('0.5%'), borderColor: '#d6d7da'
                                    }}>
                                        <View style={{ width: wp('25%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: hp('4.5%') }}>.</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>
                                

                                <TouchablePlatformSpecific onPress={() => {
                                    if(this.state.quantity !==""){
                                    if (this.state.data.ChargeItems.find(item => item.itemId === this.state.item._id)) {
                                        let selectedItem = this.state.data.ChargeItems.find(item => item.itemId === this.state.item._id)
                                        selectedItem.quantity =  selectedItem.quantity && selectedItem.quantity !== 0 ? selectedItem.quantity + parseFloat(this.state.quantity)  :parseFloat(this.state.quantity);
                                        let discount = 0

                                        if ( selectedItem.discountType!=="" && selectedItem.discountType == "Percentage") {
                                            this.state.discountedAmount = this.state.data.DiscountedAmount + ((selectedItem.price * (selectedItem.discount / 100)) * parseInt(this.state.quantity)),
                                            discount = ((selectedItem.price * (selectedItem.discount / 100)) * parseFloat(this.state.quantity))
                                        } else if ( selectedItem.discountType!=="" && selectedItem.discountType == "Amount") {
                                            this.state.discountedAmount = this.state.discountedAmount + selectedItem.discount * parseFloat(this.state.quantity)
                                            discount = selectedItem.discount * parseFloat(this.state.quantity)
                                        }
                                       
                                            this.state.chargeAmount = this.state.data.ChargeAmount + ((selectedItem.price * this.state.quantity) - discount);
                                        
                                       
                                        this.state.totalAmount = this.state.data.TotalAmount + (selectedItem.price * this.state.quantity)

                                        console.log("After" , this.state.data ,  this.state.discountedAmount , this.state.chargeAmount , this.state.totalAmount )

                                        this.props.navigation.navigate('SalesScreen', { data:{
                                            ChargeAmount: this.state.chargeAmount, 
                                            ChargeItems: this.state.data.ChargeItems ,
                                            DiscountedAmount : this.state.discountedAmount,
                                            TotalAmount : this.state.totalAmount,
                                            CustomerData : this.state.customerData,
                                            TktCount: this.state.data.TktCount + parseFloat(this.state.quantity)
                                        }   })

                                    } 
                                    }else{
                                        this.showToast("Please enter quantity to continue", "Ok", "warning");
                                        //Toast
                                    }
                                    
                                }}>
                                    <View style={{ width: wp('33%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{ width: wp('25%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: hp('4.5%'), color: 'green' }}>OK</Text>
                                        </View>
                                    </View>
                                </TouchablePlatformSpecific>
                            </View>

                        </View>
                    </Form>
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
export default connect(mapStateToProps, matchDispatchToProps)(SoldByScreen);

