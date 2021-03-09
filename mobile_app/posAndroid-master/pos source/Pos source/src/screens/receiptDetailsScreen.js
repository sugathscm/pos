import React, { Component } from 'react';
import {
    Container,
    Content,
    Header,
    Icon,
    Button,
    Text,
    Left, Right,
    Body,
    Title,
    Toast,
    Spinner,
} from "native-base";
import {
    Platform, StyleSheet, View, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert, PermissionsAndroid,Dimensions
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getCases} from "../redux/actions";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from "moment";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';
import signUpStrings from "../localization/signUpStrings";


class ReceiptDetailsScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            items: [],
            filePath: '',
            responseObj:{}
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

    itemList() {
        return this.state.data.items.map((item) => {
            return (
                <View style={{
                    flexDirection: 'row', flex: 1, paddingVertical: wp('4%'),
                    borderBottomWidth: 1, borderBottomColor: '#d6d7da'
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginStart: wp('4%') }}>{item.itemName}</Text>
                        <Text style={{ marginStart: wp('4%') }}>{item.quantity} * {item.price}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'right', marginRight: wp('4%') }}>{item.quantity * item.price}</Text>
                    </View>
                </View>

            )
        })
    }

    discountList() {
        return this.state.data.items.map((item) => {
            return (
                <View>
                    {item.discountName ? <View style={{
                    flexDirection: 'row', flex: 1, paddingVertical: wp('4%'),
                    borderBottomWidth: 1, borderBottomColor: '#d6d7da'
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginStart: wp('4%') }}>{item.discountName}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'right', marginRight: wp('4%') }}>-{item.discountType == "Amount" ?
                            item.discount * item.quantity : item.price * (item.discount / 100)}
                        </Text>
                    </View>
                </View> : null}
                </View>
                

            )
        })
    }

    askPermission() {
        var that = this;
        async function requestExternalWritePermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'CameraExample App External Storage Write Permission',
                        message:
                            'CameraExample App needs access to Storage data in your SD Card ',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //If WRITE_EXTERNAL_STORAGE Permission is granted
                    //changing the state to show Create PDF option
                    that.createPDF();
                } else {
                    alert('WRITE_EXTERNAL_STORAGE permission denied');
                }
            } catch (err) {
                alert('Write permission err', err);
                console.warn(err);
            }
        }
        //Calling the External Write permission function
        if (Platform.OS === 'android') {
            requestExternalWritePermission();
        } else {
            this.createPDF();
        }
    }
     createPDF() {

        this.setState({
            ...this.state,
            pageLoading: true
        });

        let charge = {
            chargeId: this.state.data._id,
        }

        console.log("dddddddddddddd", this.state.data)

        axios
            .post(AppURLS.ApiBaseUrl + 'charge/generatePDF', charge)
            .then(response => {
                console.log("backend data", response);

                if (response.data.success) {
                    this.state.pageLoading = false;
                    this.forceUpdate();

                    this.pdfPath(response)

                } else {
                    this.showToast("invalid details", "Ok", "warning");
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });
                }
            })
            .catch(error => {
                console.log("error", error);
                this.showToast("Please fill all the necessary details.", "Ok", "warning");
                this.setState({
                    ...this.state,
                    pageLoading: false
                });
            });

            console.log("daaaaa" , this.state.responseObj);
    }


     async pdfPath(response){
         let items = '';
                    let discounts = '';
                    let discArr = [];
                    let timestamp = moment().utc(false).format('MMMM Do YYYY, h:mm:ss a');

                    console.log("Step 1")

                    for (let i = 0; i < response.data.document.items.length; i++) {
                        if (response.data.document.items[i].discount) {
                            let totalDiscount;
                            response.data.document.items[i].discountType == "Percentage" ? totalDiscount = ((response.data.document.items[i].price * response.data.document.items[i].quantity) * (response.data.document.items[i].discount / 100)) : totalDiscount = (response.data.document.items[i].discount * response.data.document.items[i].quantity);
                            console.log("Discount", totalDiscount)
                            let discObj = {
                                discountName: response.data.document.items[i].discountName,
                                totDiscount: totalDiscount,
                                discountType: response.data.document.items[i].discountType
                            }
                            discArr.push(discObj)
                        }
                    }
                    console.log("Array", discArr)
                    console.log("Step 2")

                    for (let i = 0; i < response.data.document.items.length; i++) {
                        items += `
                        <ul>
                        <p><font size="5">
                        <span style="display: inline-block;
                     width: 75%;">` + response.data.document.items[i].itemName + `</span>
                     ` + (response.data.document.items[i].quantity * response.data.document.items[i].price) + `
                     </font>
                    </p>
                    <p> <font size="5">` + response.data.document.items[i].quantity + "*" + response.data.document.items[i].price + `
                    </font>        
                    </p>
                        </ul>`
                    }

                    console.log("Step 3")

                    for (let i = 0; i < discArr.length; i++) {
                        discounts +=
                            `<ul>
                        <p><font size="5">
                        <span style="display: inline-block;
                     width: 75%;">` + discArr[i].discountName + `</span>
                     `+ "-" + discArr[i].totDiscount + `
                     </font>
                    </p>
                        </ul>`
                    }

                    console.log("Step 4")
                    let options = {
                        //Content to print
                        html:
                            `<div >
                                <p style="text-align:center ;"> 
                                    <font size="5"> 
                                    `+ response.data.document.userName + `
                                     </font>
                                </p>
                                <p style="text-align:center">
                                    <font size="5">
                                    `+ response.data.document.chargeAmount + `
                                    </font>
                                </p>
                        
                                <p style="text-align:center"> <font size="5">Total</font>
                                </p>
                                <p> <font size="5">Name:`+ response.data.document.userName + ` </font>
                                </p>
                                <p> <font size="5">POS:`+ response.data.document.companyId + ` </font>
                                </p>
                                    ` + items + `
                
                                    ` + discounts + `
                                <ul>
                                <p> <font size="5">
                                    <span style="display: inline-block;width: 75%;">Total Bill Discount
                                    </span>
                                ` + "-" +response.data.document.discountedAmount + `
                                </font>
                                </p>
                    
                                <p>
                                <font size="5">
                                    <span style="display: inline-block;width: 75%;">Total
                                    </span>
                                ` + response.data.document.chargeAmount + `
                                </font>
                                </p>
                                <p>
                                <font size="5">
                                    <span style="display: inline-block;width:75%">` + response.data.document.paymentType + `</span>
                                ` + response.data.document.chargeAmount + `
                                </font>
                                </p>
                                </ul>
                
                                <p><font size="5">`+ timestamp + `</font>
                    </div>`,
                        //File Name
                        fileName: this.state.data.receiptId,
                        //File directory
                        directory: 'docs',
                    };

                    console.log("Step 5")
                    let file = await RNHTMLtoPDF.convert(options);
                    console.log("aaaaaaaaaaaaaaaaaa" , file);
                    this.setState({ filePath: file.filePath });
                    this.showToast("PDF generated successfully!", "ok", "success");
                    this.props.navigation.navigate('ViewPdfScreen' , {filePath:file.filePath , data:this.state.data})
                

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
                        <Icon onPress={() => this.props.navigation.navigate('AllReceipts')}
                            name="arrow-back" style={{ color: 'white' }} />
                    </Left>
                    <Body style={{ flex: 1 }} >
                        <Title>{this.state.data ? this.state.data.receiptId : "#-*****"}</Title>
                    </Body>
                    <Right>
                        <Button transparent color="white" style={{ marginRight: wp('3%') }}
                            onPress={() => this.props.navigation.navigate('RefundScreen', { data: this.state.data })}>
                            <Text>{this.state.data.refunded ? "" : `${signUpStrings.refundInReceipt}`}</Text>
                        </Button>
                        <Icon active name="md-more" onPress={() => this.props.navigation.navigate(
                            'EmailReceiptScreen' , { data: this.state.data})}
                            style={{ color: 'white', marginRight: 15, marginBottom: 8 }} />
                    </Right>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content>
                    <ScrollView>
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{
                                width: wp('90%'), alignItems: 'flex-end', justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0)', marginRight: wp('8%')
                            }}>
                                <Text style={{ fontSize: hp('2.4%'), marginTop: wp('4%'), color: 'red' }}>
                                    {this.state.data.refunded ? "Refund " + this.state.data.refundId : ""}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{
                                width: wp('100%'), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0)'
                            }}>
                                <Text style={{ fontSize: hp('7%'), marginTop: wp('4%') }}>
                                    {this.state.data ? this.state.data.chargeAmount : ""}
                                </Text>
                                <Text style={{ fontSize: hp('3.4%') }}>
                                {signUpStrings.total}
                           </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        flex: 1, flexDirection: 'row', borderWidth: 1, borderColor: '#d6d7da',
                        paddingVertical: wp('4%')
                    }}>
                        <View style={{
                            width: wp('100%'),
                            marginStart: wp('4%'), backgroundColor: 'rgba(0,0,0,0)'
                        }}>
                            <Text>{signUpStrings.cashier}: {this.state.data ? this.state.data.userName : ""}</Text>
                            <Text>POS: {this.state.data ? this.state.data.companyId : ""}</Text>
                        </View>
                    </View>
                    <View>
                        {this.itemList()}
                    </View>
                    <View>
                        {this.discountList()}
                    </View>
                    {this.state.data.discountedAmount == 0 ? null
                        :
                        <View style={{
                            flexDirection: 'row', flex: 1, paddingVertical: wp('4%'),
                            borderBottomWidth: 1, borderBottomColor: '#d6d7da'
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ marginStart: wp('4%') }}>{signUpStrings.totalDiscount}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ textAlign: 'right', marginRight: wp('4%') }}>-{this.state.data.discountedAmount ? this.state.data.discountedAmount : 0}
                                </Text>
                            </View>
                        </View>}


                    <View style={{
                        flexDirection: 'row', flex: 1, paddingVertical: wp('4%'),
                        borderBottomWidth: 1, borderBottomColor: '#d6d7da'
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginStart: wp('4%'), fontWeight: 'bold' }}>{signUpStrings.total}</Text>
                            <Text style={{ marginStart: wp('4%') }}>{this.state.data ? this.state.data.paymentType : ""}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ textAlign: 'right', marginRight: wp('4%'), fontWeight: 'bold' }}>{this.state.data ? this.state.data.chargeAmount : ""}</Text>
                            <Text style={{ textAlign: 'right', marginRight: wp('4%') }}>{this.state.data ? this.state.data.chargeAmount : ""}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', flex: 1, paddingVertical: wp('4%') }}>
                        <View style={{ flex: 2 }}>
                            <Text style={{ marginStart: wp('4%') }}> {this.state.data ? moment(this.state.data.timestamp).format('MMMM Do YYYY, h:mm:ss a') : ""}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ textAlign: 'right', marginRight: wp('4%') }}>{this.state.data ? this.state.data.receiptId : "#-*****"}</Text>
                        </View>
                    </View>

                    <Button style={{ margin: wp('3%') , justifyContent:'center' }}
                        onPress={this.askPermission.bind(this)}>
                        <Text> {signUpStrings.generatePdf}</Text>
                    </Button>
                    <View style={{zIndex:100 , height:wp('10%')}}>
                        <ScrollView>

                        </ScrollView>
                    </View>
                    </ScrollView>
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
export default connect(mapStateToProps, matchDispatchToProps)(ReceiptDetailsScreen);

