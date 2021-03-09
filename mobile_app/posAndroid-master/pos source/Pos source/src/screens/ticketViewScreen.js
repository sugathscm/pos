import React, {Component} from 'react';
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
    Spinner,Radio, Button,Thumbnail
} from "native-base";
import {
    Image, ImageBackground, Platform, StyleSheet, View, ScrollView, TouchableOpacity,
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
import { Switch } from 'react-native-base-switch';
import {connect} from 'react-redux';
import moment from "./homeScreen";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import signUpStrings from '../localization/signUpStrings';


class TicketViewScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading : true,
            totalAmount:0,
            chargeItems:[],
            tktCount:0


        };
    }

    componentDidMount(){
        this.setState({
            ...this.state,
            pageLoading : false,

        });
        this.calculateTotal();
        lor(this);
    }

    componentWillUnmount() {
        rol();
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

    calculateTotal(){
        let totAmount=0;
        this.state.chargeItems.forEach(element => {
            totAmount = ( totAmount + (element.quantity * element.price))
        });
        this.setState({
            totalAmount:totAmount
        })
    }

    itemList(){

        return this.state.data.ChargeItems.map( (item)=>{
            let itemPrice
            if(item.discount && item.discountType === "Percentage"){
                itemPrice = ((item.price * item.quantity)- (parseFloat(item.price)* (item.quantity * (item.discount /100))));
            }else if( item.discount && item.discountType === "Amount" ){
             itemPrice= (item.price  - item.discount) * item.quantity
            }else{
                itemPrice = item.price * item.quantity;
            }

            //let itemPrice = item.discountType == "Percentage" ? item.price * item.quantity *  : console.log("ssssssssssss")
            console.log("sasasasas" , itemPrice)
            return (
                <ListItem
                onPress={() => this.props.navigation.navigate('ViewSingleItemScreen' ,
                    {
                                Item:item,
                                data: this.state.data,
                                tktCount : this.state.tktCount
                    })}
                >
                        <Body>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{width: wp('68.4%'),  backgroundColor: 'rgba(0,0,0,0)'}}>
                                    <Text style={{textAlign: 'left'}}>{item.itemName} * {item.quantity}</Text>
                                </View>
                                <View style={{width: wp('25%'), backgroundColor: 'rgba(0,0,0,0)'}}>
                                    <Text>{itemPrice}</Text>
                                </View>
                            </View>
                        </Body>
                </ListItem>

            )
        })
    }


    render() {
        const { navigation } = this.props;
        const data = navigation.getParam('data');
        //const tktCount = navigation.getParam('tktCount')
        this.state.data = data;
        this.state.tktCount = data.tktCount;
        if(isNaN(this.state.tktCount)){
            this.state.tktCount = 0
        }

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
                        <Icon onPress={() => this.props.navigation.navigate('SalesScreen' , { data:this.state.data , tktCount:this.state.tktCount})} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{flex:1 ,flexDirection:'row'}}>
                        <Text style={{fontSize:hp('3.5%') , color:'white'}}>
                            {signUpStrings.ticket}
                        </Text>
                        <ImageBackground source={require('../assets/img/ticketWhite.png')}
                            style={{
                                width: wp('6%'),
                                height: wp('6%'), marginLeft: wp('2%'), marginTop: wp('1.5%'), justifyContent: 'center', alignItems: 'center'
                            }} >
                            <Text style={{ color: 'white', fontSize: wp('2%') }}>{this.state.tktCount}</Text>
                        </ImageBackground>

                    </Body>
                    <Right>
                    {/*<Icon active name="md-person-add"*/}
                    {/*    onPress={() => this.props.navigation.navigate('CustomerToTicketScreen')}*/}
                    {/*    style={{ color: 'white', marginRight: wp('8%')}} />*/}

                    </Right>
                </Header>
            {/* Spinner */}
            { this.state.pageLoading ? <Spinner color='blue' style={{position: 'absolute',
                backgroundColor : 'rgba(0,0,0,0.4)', height : hp('100%'),
                width : wp('100%'), zIndex:2000}} /> : null}
            <Content>
                <ScrollView>
                <View style={{}}>
                   <View>
                    {this.itemList()}
                    </View>
                    <View>
                    <ListItem style={{borderBottomWidth : 0}}>
                        <Text style={{fontWeight:'bold'}}>{signUpStrings.totalAmount}</Text>
                        <Body>
                        <Text style={{fontWeight:'bold', textAlign : 'right'}}>{this.state.data.ChargeAmount}</Text>
                        </Body>
                    </ListItem>
                    </View>
                </View>


                <View style={{flex : 1 , marginTop:hp('6%')}}>
                    <Button full style={{width : wp('90%'), marginStart : wp('5%'),
                        height : wp('20%'), borderRadius : 5}}
                        onPress={() => this.props.navigation.navigate('ChargeScreen' , {data: {
                            ChargeAmount: this.state.data.ChargeAmount,
                            ChargeItems: this.state.data.ChargeItems,
                            DiscountedAmount: this.state.data.DiscountedAmount,
                            TotalAmount: this.state.data.TotalAmount,
                            CustomerData: this.state.data.CustomerData
                        }})}>
                        <Body>
                        <Text style={{color : 'white'}}>{signUpStrings.charge}</Text>
                        <Text style={{color : 'white'}}>{this.state.data.ChargeAmount}</Text>

                        </Body>

                    </Button>
                </View>
                </ScrollView>
            </Content>
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
export default connect(mapStateToProps, matchDispatchToProps)(TicketViewScreen);

