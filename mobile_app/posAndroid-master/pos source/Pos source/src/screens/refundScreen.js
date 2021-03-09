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
    CheckBox,
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


class RefundScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            assignedItems: [],
            checkboxValues : {},
            refundedPrice:0,
            availableToRefund:true
        };
    }

    componentDidMount() {
        if(this.state.data.items.find(item => !item.refunded)){
            console.log("Available")
            this.setState({
                ...this.state,
                pageLoading: false
            });
        }else{
            console.log('Not Available')
            this.setState({
                ...this.state,
                availableToRefund:false,
                pageLoading: false
            });
        }
        
        console.log("Data" ,  this.state.data);
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
    submitForm() {
        console.log("submitting form..", this.props.userData.userData.companyId);
        this.state.pageLoading = true;
        this.forceUpdate();
        console.log(this.state.calculatedTotalDue, "sssssssssss")

        let Items = {
            receiptId: this.state.data.receiptId,
            userId: this.props.userData.loginData.uid,
            userName: this.props.userData.userData.name,
            companyId: this.props.userData.userData.companyId,
            chargeId:this.state.data._id,
            items: this.state.assignedItems,
            totalPaid: this.state.data.totalPaid,
            totalAmount: this.state.data.totalAmount,
            discountedAmount: this.state.data.discountedAmount,
            discountNameTotBill: this.state.data.discountNameTotBill,
            discountTypeTotBill: this.state.data.discountTypeTotBill,
            chargeAmount: this.state.refundedPrice ,
            change: this.state.data.change,
            email: this.state.data.email,
            paymentType: this.state.data.paymentType,

        };

        let cusObj = {
            customerId: this.state.customerData ? this.state.customerData._id : null,
        }
        axios
            .post(AppURLS.ApiBaseUrl + 'charge/refund', Items)
            .then(response => {
                console.log("backend data", JSON.stringify(response));
                if (response.data.success) {
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    this.props.navigation.navigate('AllReceipts')
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
    calculateRefundedPrice(){
        console.log("Array" , this.state.assignedItems)
        this.state.assignedItems.forEach((item)=>{
            this.setState({}, ()=>{
                if(item.discount){
                    if(item.discountType == "Amount"){
                        this.state.refundedPrice = this.state.refundedPrice + ((item.price - item.discount) * item.quantity)
                    }else{
                        this.state.refundedPrice = this.state.refundedPrice +  ((item.price * (item.discount / 100)) * item.quantity)
                    }
                }else{
                    this.state.refundedPrice = this.state.refundedPrice + item.price * item.quantity
                }
            })
        })
        console.log("Refunded Price" , this.state.refundedPrice)
    }


    render() {
        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity :
            TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;

        const { navigation } = this.props;
        const data = navigation.getParam('data');
        this.state.data = data;

        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon onPress={() => this.props.navigation.navigate('ReceiptDetailsScreen' , {data: this.state.data})}
                            name="arrow-back" style={{ color: 'white', }} />
                    </Left>
                    <Body style={{ flex: 1 }} >
                        <Title>{signUpStrings.refund}</Title>
                    </Body>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content>

                    <View style={{}}>
                        {this.state.data.items.map((item, index) => {
                            const uniqueKey = item.itemName + index;
                            //console.log("Item" , this.state.data)
                            return (
                                <View>
                                    {item.refunded 
                                    ? 
                                    <View key={index} style={{ flexDirection: 'row', width: wp('100%'), borderBottomWidth: 1, borderColor: '#d6d7da', }}>
                                    <View style={{ width: wp('15%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{
                                            width: wp('17%'),
                                            margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)'
                                        }}>
                                            <CheckBox
                                                color="green"
                                                style={{ marginRight: 20, }}
                                                checked={true}
                                                key={item._id}
                                            />
                                        </View>
                                    </View>
                                    
                                    <View style={{ width: wp('60%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{
                                            width: wp('42%'),
                                            margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)'
                                        }}>
                                            <Text>{item.itemName} * {item.quantity}</Text>
                                            <Text>{signUpStrings.refundedInRefundScreen}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{
                                            width: wp('17%'),
                                            margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)'
                                        }}>
                                            <Text>{item.discount !==0 && item.discountType=="Amount" ? ((item.price - item.discount) * item.quantity) : [ item.discount !==0 && item.discountType=="Percentage" ? ((item.price * item.quantity)-(item.price * (item.discount / 100)) * item.quantity) : item.price * item.quantity]}</Text>
                                        </View>
                                    </View>

                                </View>
                                    :
                                     <View key={index} style={{ flexDirection: 'row', width: wp('100%'), borderBottomWidth: 1, borderColor: '#d6d7da', }}>
                                    <View style={{ width: wp('15%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{
                                            width: wp('17%'),
                                            margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)'
                                        }}>
                                            <CheckBox
                                                color="green"
                                                style={{ marginRight: 20, }}
                                                checked={this.state.checkboxValues[uniqueKey]}

                                                onPress={() => {
                                                    // assign a new checked state based on the unique id. You'll also need to do some error/undefined checking here.
                                                    const newCheckboxValues = this.state.checkboxValues;
                                                    newCheckboxValues[uniqueKey] = !newCheckboxValues[uniqueKey]

                                                    
                                                    {
                                                        
                                                        if (this.state.assignedItems.find(disc => disc.itemName == item.itemName)) {
                                                            
                                                            let itemObj = this.state.assignedItems.find(disc => disc.itemName == item.itemName)
                                                            let updatedArr = this.state.assignedItems.filter(function (item) {
                                                                return item.itemName != itemObj.itemName
                                                            });
                                                            this.state.assignedItems = updatedArr;
                                                            if(item.discount){
                                                                if(item.discountType == "Amount"){
                                                                    this.state.refundedPrice = this.state.refundedPrice - ((item.price - item.discount) * item.quantity)
                                                                }else{
                                                                    this.state.refundedPrice = this.state.refundedPrice -  ((item.price * item.quantity)-(item.price * (item.discount / 100)) * item.quantity)
                                                                }
                                                            }else{
                                                                this.state.refundedPrice = this.state.refundedPrice - item.price * item.quantity
                                                            }

                                                        } else {
                                                            
                                                            this.state.assignedItems.push(item)
                                                            if(item.discount){
                                                                if(item.discountType == "Amount"){
                                                                    this.state.refundedPrice = this.state.refundedPrice + ((item.price - item.discount) * item.quantity)
                                                                }else{
                                                                    this.state.refundedPrice = this.state.refundedPrice +  ((item.price * item.quantity)-(item.price * (item.discount / 100)) * item.quantity)
                                                                }
                                                            }else{
                                                                this.state.refundedPrice = this.state.refundedPrice + item.price * item.quantity
                                                            }

                                                        }
                                                        
                                                    }
                                                    this.setState({
                                                        ...this.state,
                                                        checkboxValues: newCheckboxValues,
                                                        //refundedPrice: this.state.refundedPrice,
                                                        assignedItems : this.state.assignedItems
                                                    })
                                                    console.log("Tot Value" , this.state.refundedPrice)
                                                    
                                                    console.log("Array", this.state.assignedItems)
                                                }}
                                                key={item._id}
                                            />
                                        </View>
                                    </View>
                                    
                                    <View style={{ width: wp('60%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{
                                            width: wp('42%'),
                                            margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)'
                                        }}>
                                            <Text>{item.itemName} * {item.quantity}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <View style={{
                                            width: wp('17%'),
                                            margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)'
                                        }}>
                                            <Text>{item.discount !==0 && item.discountType=="Amount" ? ((item.price - item.discount) * item.quantity) : [ item.discount !==0 && item.discountType=="Percentage" ? ((item.price * item.quantity)-(item.price * (item.discount / 100)) * item.quantity) : item.price * item.quantity]}</Text>
                                        </View>
                                    </View>

                                </View> }
                                
                                </View>

                            )
                        })

                        }


                        <View style={{ flexDirection: 'row', width: wp('100%') }}>
                            <View style={{ width: wp('75%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{ width: wp('67%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{signUpStrings.totalInRefundScreen}</Text>
                                </View>
                            </View>
                            <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{this.state.data.chargeAmount}</Text>
                                </View>
                            </View>

                        </View>
                    </View>

                    <View>
                        {this.state.availableToRefund 
                        ?
                        <View style={{ flex: 1, marginBottom:wp('8%') }}>
                        <Button 
                        onPress={()=> this.submitForm()}
                        full style={{
                            width: wp('90%'), marginStart: wp('5%'),
                            height: wp('15%'), borderRadius: 5
                        }}>
                            <Text style={{}}>{signUpStrings.refund} {this.state.refundedPrice}</Text>
                        </Button>
                    </View>
                    :
                    <View style={{ flex: 1, marginBottom:wp('8%') }}>
                        <Button 
                        full style={{
                            width: wp('90%'), marginStart: wp('5%'),
                            height: wp('15%'), borderRadius: 5
                        }}>
                            <Text style={{}}>{signUpStrings.noItemsToRefund}</Text>
                        </Button>
                    </View>
                     }

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
export default connect(mapStateToProps, matchDispatchToProps)(RefundScreen);

