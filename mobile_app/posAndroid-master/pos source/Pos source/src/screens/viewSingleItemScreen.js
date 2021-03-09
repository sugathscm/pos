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
import moment from "./homeScreen";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import alldiscounts from './alldiscounts';
import signUpStrings from '../localization/signUpStrings';


class ViewSingleItemScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            formEmail: "",
            formEmailValid: null,
            quantity: 0,
            discounts: [],
            isChecked: false,
            initialQuantity:0,
            tktCount : 0
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false,
            quantity: this.state.itemData.quantity,
            initialQuantity:this.state.itemData.quantity
        });
        console.log("Item Data", this.state.itemData);
        console.log("Whole Data", this.state.data)
        this.getDiscount(this.state.data.itemId)
    }
    discountUI() {
        let appliedDiscounts = []
        if (this.state.discounts) {
            return this.state.discounts.map((discount) => {
                return (
                    <Item style={{ marginTop: hp('2%'), marginBottom: hp('3%'), borderBottomWidth: 0, }}>
                        <Left>
                            <Label>{discount.name} {discount.discountType == "Percentage" ? discount.discount + "%" : discount.discount + "/="} off</Label>
                        </Left>

                        <Right>
                            <Switch
                                customStyles={{
                                    activeBackgroundColor: "black",
                                    inactiveBackgroundColor: "red",
                                    activeButtonColor: "red",
                                    inactiveButtonColor: "blue"
                                }}
                                onChangeState={() => {
                                    this.setState({
                                        isChecked: !this.state.isChecked
                                    }),
                                        console.log("IsChecked", this.state.isChecked)
                                }} />
                        </Right>
                    </Item>
                )
            })
        } else {
            return (
                <Item style={{ marginTop: hp('2%'), marginBottom: hp('3%'), borderBottomWidth: 0, }}>
                    <Text>{signUpStrings.noDiscount}</Text>
                </Item>
            )
        }
    }

    async getDiscount(itemId) {
        console.log("item Id", itemId)
        await axios
            .get(AppURLS.ApiBaseUrl + 'discounts/discounts', { params: { itemId: itemId } })
            .then(response => {
                console.log("discounts by itemID", JSON.stringify(response.data));
                if (response.data.success) {
                    this.setState({
                        discounts: response.data.document
                    })
                } else {
                    console.log("auth failed..");

                }
            })
            .catch(error => {
                console.log("errorr", error)
            });
    }


    componentWillReceiveProps(nextProps) {
    };

    showValidityIcon(value) {
        if (value !== null) {
            if (value === true) {
                return 'checkmark-circle';
            } else {
                return 'close-circle';
            }
        } else {
            return 'create';
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


    increaseQuantity() {
        console.log("Inc", this.state.quantity);
        this.setState({
            quantity: this.state.quantity + 1
        })


    }
    decreaseQuantity() {
        console.log("Dec", this.state.quantity)
        if (this.state.quantity !== 0) {
            this.setState({
                quantity: this.state.quantity - 1
            })
        }

    }

    removeItem(){
        const ItemRemovedArray = this.state.data.ChargeItems.filter(item => {
            return item.itemId !== this.state.itemData.itemId;
        })
        this.state.data.ChargeItems = ItemRemovedArray;
        this.state.tktCount = this.state.tktCount - this.state.itemData.quantity;
        if(this.state.itemData.discount && this.state.itemData.discountType === "Percentage"){
            this.state.data.DiscountedAmount = this.state.data.DiscountedAmount -(this.state.itemData.price* (this.state.itemData.quantity * (this.state.itemData.discount /100)));
        }else if( this.state.itemData.discount && this.state.itemData.discountType === "Amount" ){
            this.state.data.DiscountedAmount=this.state.data.DiscountedAmount - ((this.state.itemData.price * this.state.itemData.quantity) - this.state.itemData.discount)
        }
        this.state.data.TotalAmount = this.state.data.TotalAmount - (this.state.itemData.price * (this.state.itemData.quantity - this.state.initialQuantity ));
        this.state.data.ChargeAmount = this.state.data.TotalAmount - this.state.data.DiscountedAmount;
        console.log("ItemRemovedArray" , this.state.tktCount);
        console.log("sasasasass" , this.state.data);

        this.props.navigation.navigate('TicketViewScreen', {data: this.state.data , tktCount : this.state.tktCount})
    }

    updateItem(){
        if(this.state.data.ChargeItems.find( item => item.itemId === this.state.itemData.itemId)){
            console.log("true")
            let item = this.state.data.ChargeItems.find( item => item.itemId === this.state.itemData.itemId);
            item.quantity = this.state.quantity;

            //calculate discounted amount
            if(item.discount && item.discountType === "Percentage"){
                this.state.data.DiscountedAmount = this.state.data.DiscountedAmount + (item.price* ((item.quantity - this.state.initialQuantity ) * (item.discount /100)));
            }else if( item.discount && item.discountType === "Amount" ){
                this.state.data.DiscountedAmount= this.state.data.DiscountedAmount + (item.discount * (item.quantity - this.state.initialQuantity ));
            }
            this.state.data.TotalAmount = this.state.data.TotalAmount + (item.price * (item.quantity - this.state.initialQuantity ));
            this.state.data.ChargeAmount = this.state.data.TotalAmount - this.state.data.DiscountedAmount;
            this.state.tktCount = this.state.tktCount + (item.quantity - this.state.initialQuantity );


            this.state.data.tktCount = this.state.tktCount;
            this.props.navigation.navigate('TicketViewScreen',
                {data: this.state.data})
        }
    }


    render() {
        const { navigation } = this.props;
        const itemData = navigation.getParam('Item');
        const data = navigation.getParam('data')
        const tktCount = navigation.getParam('tktCount');
        this.state.data = data;
        this.state.itemData = itemData;
        this.state.tktCount = tktCount;

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
                        <Icon

                            onPress={() => this.props.navigation.navigate('TicketViewScreen', {data: this.state.data , tktCount : this.state.tktCount})}
                            name="md-close" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }} >
                        <Title>{this.state.itemData.itemName}</Title>
                    </Body>
                    <Right>
                    <Button transparent color="white" onPress={() => this.removeItem()}>
                            <Text>Remove Item</Text>
                        </Button>
                        <Button transparent color="white" onPress={() => this.updateItem()}>
                            <Text>{signUpStrings.save}</Text>
                        </Button>
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
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{
                                width: wp('70%'), height: wp('16%'),
                                backgroundColor: 'rgba(0,0,0,0)'
                            }}>
                                <View style={{
                                    width: wp('62%'), paddingBottom: wp('4%'),
                                    marginLeft: wp('0%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)'
                                }}>
                                    <Text style={{ color: 'green' }}>{signUpStrings.quantity}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: wp('-1%') }}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.decreaseQuantity()
                                }>
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
                                    , justifyContent: 'center', alignItems: 'center', borderBottomWidth: wp('0.5%')
                                }}>
                                    <Text>{this.state.quantity != -1 ? this.state.quantity : this.state.itemData.quantity}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={
                                () => {
                                    this.increaseQuantity()
                                }
                            }>
                                <View style={{ width: wp('20%'), height: wp('25%'),
                                    backgroundColor: 'rgba(0,0,0,0)' }}
                                >
                                    <View style={{ width: wp('16%'), height: wp('17%'),
                                        marginLeft: wp('0%'), marginTop: wp('4%'),
                                        marginBottom: wp('4%'), marginRight: wp('4%'),
                                        backgroundColor: 'rgba(238, 236, 235, 1)', justifyContent: 'center',
                                        alignItems: 'center' }}>
                                        <Text style={{ fontSize: hp('5.5%') }}>+</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: wp('70%'), height: wp('16%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{ width: wp('62%'), paddingBottom: wp('4%'), marginLeft: wp('0%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Text style={{ color: 'green' }}>{signUpStrings.comment}</Text>
                                </View>
                            </View>
                        </View>

                        <Form>
                            <Item style={{ marginBottom: wp('3%') }}>

                                <Item stackedLabel>
                                    <Input />
                                </Item>
                            </Item>
                        </Form>

                        {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: wp('70%'), height: wp('16%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{ width: wp('62%'), paddingBottom: wp('4%'), marginLeft: wp('0%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Text style={{ color: 'green' }}>{signUpStrings.discount}</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            {this.discountUI()}
                        </View> */}



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
export default connect(mapStateToProps, matchDispatchToProps)(ViewSingleItemScreen);

