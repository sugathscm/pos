import React from 'react';
import {
    ImageBackground, Platform, StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
} from "react-native-responsive-screen";
import { decrement,updateCurrentTicket, getCases, increment, multiply } from "../redux/actions";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ModalSelector from 'react-native-modal-selector';
import {
    Body, Header, Left, Right, Icon, Content,Item, Container, Button,
    List, ListItem, Toast, Thumbnail, Input
} from "native-base";
import { Circle, Square, Octagon, Hexagon } from 'react-native-shape';
import { SearchBar } from "react-native-elements";
import { Dimensions } from 'react-native';
import signUpStrings from "../localization/signUpStrings";
import Modal from 'react-native-modal';
import { RNCamera } from 'react-native-camera';

class SalesScreen extends React.Component {

    static navigationOptions = {
        title: 'CASES',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            noCases: false,
            userData: null,
            appData: null,
            customerData: null,
            allCategories: [],
            allItems: [],
            selectedItems: [],
            selectedDiscounts: [],
            allDiscounts: [],
            dropdownDetails: [],
            chargeItems: [],
            itemObj: {},
            search: '',
            dropdownLable: 'AllItems',
            dropdownId: '',
            itemId: "",
            itemName: "",
            price: "",
            quantity: 0,
            tktCount: 0,
            TktCount: 0,
            chargeAmount: 0.00,
            totalAmount: 0.00,
            discountedAmount: 0.00,
            appliedDiscounts: [],
            allItemsFroCategory: [],
            selectedItemFroCategory: [],
            isVisibleModal: false,
            showBarcodeReader: false,
            barcode: "",
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false,
            tktCount: this.state.data ? this.state.data.TktCount : this.state.tktCount,
            chargeAmount: this.state.data ? this.state.data.ChargeAmount : this.state.chargeAmount,
            chargeItems: this.state.data ? this.state.data.ChargeItems : this.state.chargeItems,
            discountedAmount: this.state.data ? this.state.data.DiscountedAmount : this.state.discountedAmount,
            totalAmount: this.state.data ? this.state.data.TotalAmount : this.state.totalAmount,
            customerData: this.state.data ? this.state.data.CustomerData : this.state.customerData

        });
        this.props.getCases(this.props.userData);
        lor(this);
        console.log("tktCount", this.state.tktCount);
        console.log("TktCount", this.state.TktCount)
    }


    componentWillUnmount() {
        rol();
    }

    onBarCodeRead = (e) => {

        this.setState({
            barcode: e.data,
            showBarcodeReader: false
        }, () => {
            console.log("Bar code", this.state.barcode);
            //Add to ticket operation
            console.log("All Items", this.state.selectedItems);
            console.log("Charge Items", this.state.chargeItems);

            if (this.state.selectedItems.find(item => item.barcode === e.data)) {
                let barcodeMatchedObj = this.state.selectedItems.find(item => item.barcode === e.data);
                //////////////////////////////////////////////
                barcodeMatchedObj.price !== "" && barcodeMatchedObj.soldBy == "Each"
                ?
                //All Set
                (

                    this.setState({
                        ...this.state,
                        tktCount: this.state.tktCount + 1,
                        totalAmount: this.state.totalAmount + (barcodeMatchedObj.price * 1),


                    }, () => {
                        this.forceUpdate();

                        let itemObj = {};

                        if (this.state.chargeItems.length == 0) {
                            if (this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)) {

                                let discObj = this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)

                                itemObj.itemId = barcodeMatchedObj._id;
                                itemObj.itemName = barcodeMatchedObj.name;
                                itemObj.price = barcodeMatchedObj.price;
                                itemObj.quantity = 1;
                                itemObj.discount = discObj.discount;
                                itemObj.discountType = discObj.discountType;
                                itemObj.discountName = discObj.name;

                                if (discObj.discountType == "Percentage") {
                                    this.state.discountedAmount = this.state.discountedAmount + barcodeMatchedObj.price * (discObj.discount / 100)
                                } else if (discObj.discountType == "Amount") {
                                    this.state.discountedAmount = this.state.discountedAmount + discObj.discount
                                }



                            } else {
                                itemObj.itemId = barcodeMatchedObj._id,
                                    itemObj.itemName = barcodeMatchedObj.name,
                                    itemObj.price = barcodeMatchedObj.price,
                                    itemObj.quantity = 1

                            }
                            this.state.chargeItems.push(itemObj);
                            console.log("first Item", this.state.chargeItems)

                        } else {
                            if (this.state.chargeItems.length !== 0) {
                                if (this.state.chargeItems.find(item => item.itemId === barcodeMatchedObj._id)) {

                                    let selectedItem = this.state.chargeItems.find(item => item.itemId === barcodeMatchedObj._id)
                                    selectedItem.quantity += 1;
                                    console.log("annanna", this.state.chargeItems);
                                    if (selectedItem.discountType == "Percentage") {
                                        this.state.discountedAmount = this.state.discountedAmount + selectedItem.price * (selectedItem.discount / 100)
                                    } else if (selectedItem.discountType == "Amount") {
                                        this.state.discountedAmount = this.state.discountedAmount + selectedItem.discount
                                    }


                                } else {
                                    if (this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)) {
                                        let discObj = this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)
                                        itemObj.itemId = barcodeMatchedObj._id;
                                        itemObj.itemName = barcodeMatchedObj.name;
                                        itemObj.price = barcodeMatchedObj.price;
                                        itemObj.quantity = 1;
                                        itemObj.discount = discObj.discount;
                                        itemObj.discountType = discObj.discountType;
                                        itemObj.discountName = discObj.name;

                                        this.state.chargeItems.push(itemObj);
                                        console.log("first Item", this.state.chargeItems)

                                        if (discObj.discountType == "Percentage") {
                                            this.state.discountedAmount = this.state.discountedAmount + barcodeMatchedObj.price * (discObj.discount / 100)
                                        } else if (discObj.discountType == "Amount") {
                                            this.state.discountedAmount = this.state.discountedAmount + discObj.discount
                                        }


                                    } else {
                                        itemObj.itemId = barcodeMatchedObj._id,
                                            itemObj.itemName = barcodeMatchedObj.name,
                                            itemObj.price = barcodeMatchedObj.price,
                                            itemObj.quantity = 1,

                                            this.state.chargeItems.push(itemObj);
                                        console.log("first Item", this.state.chargeItems)
                                    }
                                }
                            }
                        }
                        console.log("Discount price", this.state.discountedAmount);
                        this.state.chargeAmount = this.state.totalAmount - this.state.discountedAmount

                    })

                ): [barcodeMatchedObj.price == "" && barcodeMatchedObj.soldBy == "Each"
                ?
                //Price Screen
                (

                    this.setState({

                    }, () => {
                        this.forceUpdate()

                        let itemObj = {};

                        if (this.state.chargeItems.length == 0) {
                            if (this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)) {

                                let discObj = this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)

                                itemObj.itemId = barcodeMatchedObj._id;
                                itemObj.itemName = barcodeMatchedObj.name;
                                itemObj.discount = discObj.discount;
                                itemObj.discountType = discObj.discountType;
                                itemObj.discountName = discObj.name;




                            } else {
                                itemObj.itemId = barcodeMatchedObj._id,
                                    itemObj.itemName = barcodeMatchedObj.name

                            }


                            this.state.chargeItems.push(itemObj);
                            console.log("first Item", this.state.chargeItems)

                        } else {
                            if (this.state.chargeItems.length !== 0) {
                                if (this.state.chargeItems.find(item => item.itemId === barcodeMatchedObj._id)) {

                                    let selectedItem = this.state.chargeItems.find(item => item.itemId === barcodeMatchedObj._id)
                                    console.log("annanna", this.state.chargeItems);


                                } else {
                                    if (this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)) {
                                        let discObj = this.state.allDiscounts.find(disc => disc.itemId ==barcodeMatchedObj._id)
                                        itemObj.itemId = barcodeMatchedObj._id;
                                        itemObj.itemName = barcodeMatchedObj.name;
                                        itemObj.discount = discObj.discount;
                                        itemObj.discountType = discObj.discountType;
                                        itemObj.discountName = discObj.name;

                                        this.state.chargeItems.push(itemObj);
                                        console.log("first Item", this.state.chargeItems)

                                    } else {
                                        itemObj.itemId = barcodeMatchedObj._id,
                                            itemObj.itemName = barcodeMatchedObj.name,

                                            this.state.chargeItems.push(itemObj);
                                        console.log("first Item", this.state.chargeItems)
                                    }
                                }
                            }
                        }
                        this.state.chargeAmount = this.state.totalAmount - this.state.discountedAmount
                        this.props.navigation.navigate('ItemPriceScreen', {
                            Item: barcodeMatchedObj, data: {
                                ChargeAmount: this.state.chargeAmount,
                                ChargeItems: this.state.chargeItems,
                                DiscountedAmount: this.state.discountedAmount,
                                TotalAmount: this.state.totalAmount,
                                CustomerData: this.state.customerData,
                                TktCount: this.state.tktCount
                            }
                        })

                    })

                )
                : [barcodeMatchedObj.soldBy !== "Each" && barcodeMatchedObj.price !== ""
                    ?
                    //Weight Screen
                    (
                        this.setState({

                        }, () => {
                            this.forceUpdate()

                            let itemObj = {};

                            if (this.state.chargeItems.length == 0) {
                                if (this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)) {

                                    let discObj = this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)

                                    itemObj.itemId = barcodeMatchedObj._id;
                                    itemObj.itemName = barcodeMatchedObj.name;
                                    itemObj.price = barcodeMatchedObj.price;
                                    itemObj.discount = discObj.discount;
                                    itemObj.discountType = discObj.discountType;
                                    itemObj.discountName = discObj.name;




                                } else {
                                    itemObj.itemId = barcodeMatchedObj._id,
                                        itemObj.itemName = barcodeMatchedObj.name,
                                        itemObj.price = barcodeMatchedObj.price

                                }


                                this.state.chargeItems.push(itemObj);
                                console.log("first Item", this.state.chargeItems)

                            } else {
                                if (this.state.chargeItems.length !== 0) {
                                    if (this.state.chargeItems.find(item => item.itemId === barcodeMatchedObj._id)) {

                                        let selectedItem = this.state.chargeItems.find(item => item.itemId === barcodeMatchedObj._id)

                                        console.log("annanna", this.state.chargeItems);



                                    } else {
                                        if (this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)) {
                                            let discObj = this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)
                                            itemObj.itemId = barcodeMatchedObj._id;
                                            itemObj.itemName = barcodeMatchedObj.name;
                                            itemObj.price = barcodeMatchedObj.price;
                                            itemObj.discount = discObj.discount;
                                            itemObj.discountType = discObj.discountType;
                                            itemObj.discountName = discObj.name;

                                            this.state.chargeItems.push(itemObj);
                                            console.log("first Item", this.state.chargeItems)



                                        } else {
                                            itemObj.itemId = barcodeMatchedObj._id,
                                                itemObj.itemName = barcodeMatchedObj.name,
                                                itemObj.price = barcodeMatchedObj.price,

                                                this.state.chargeItems.push(itemObj);
                                            console.log("first Item", this.state.chargeItems)
                                        }
                                    }
                                }
                            }

                            this.props.navigation.navigate('SoldByScreen', {
                                Item: barcodeMatchedObj, data: {
                                    ChargeAmount: this.state.chargeAmount,
                                    ChargeItems: this.state.chargeItems,
                                    DiscountedAmount: this.state.discountedAmount,
                                    TotalAmount: this.state.totalAmount,
                                    CustomerData: this.state.customerData,
                                    TktCount: this.state.tktCount
                                }
                            })
                        })



                    )
                    : [barcodeMatchedObj.price == "" && barcodeMatchedObj.soldBy !== "Each"
                        ?
                        //Price Then Weight
                        (

                            this.setState({

                            }, () => {
                                this.forceUpdate()

                                let itemObj = {};

                                if (this.state.chargeItems.length == 0) {
                                    if (this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)) {

                                        let discObj = this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)

                                        itemObj.itemId = barcodeMatchedObj._id;
                                        itemObj.itemName = barcodeMatchedObj.name;
                                        itemObj.discount = discObj.discount;
                                        itemObj.discountType = discObj.discountType;
                                        itemObj.discountName = discObj.name;




                                    } else {
                                        itemObj.itemId = barcodeMatchedObj._id,
                                            itemObj.itemName = barcodeMatchedObj.name

                                    }


                                    this.state.chargeItems.push(itemObj);
                                    console.log("first Item", this.state.chargeItems)

                                } else {
                                    if (this.state.chargeItems.length !== 0) {
                                        if (this.state.chargeItems.find(item => item.itemId === barcodeMatchedObj._id)) {

                                            let selectedItem = this.state.chargeItems.find(item => item.itemId === barcodeMatchedObj._id)
                                            console.log("annanna", this.state.chargeItems);


                                        } else {
                                            if (this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)) {
                                                let discObj = this.state.allDiscounts.find(disc => disc.itemId == barcodeMatchedObj._id)
                                                itemObj.itemId = barcodeMatchedObj._id;
                                                itemObj.itemName = barcodeMatchedObj.name;
                                                itemObj.discount = discObj.discount;
                                                itemObj.discountType = discObj.discountType;
                                                itemObj.discountName = discObj.name;

                                                this.state.chargeItems.push(itemObj);
                                                console.log("first Item", this.state.chargeItems)

                                            } else {
                                                itemObj.itemId = barcodeMatchedObj._id,
                                                    itemObj.itemName = barcodeMatchedObj.name,

                                                    this.state.chargeItems.push(itemObj);
                                                console.log("first Item", this.state.chargeItems)
                                            }
                                        }
                                    }
                                }
                                this.state.chargeAmount = this.state.totalAmount - this.state.discountedAmount
                                this.props.navigation.navigate('ItemPriceScreen', {
                                    Item: barcodeMatchedObj, data: {
                                        ChargeAmount: this.state.chargeAmount,
                                        ChargeItems: this.state.chargeItems,
                                        DiscountedAmount: this.state.discountedAmount,
                                        TotalAmount: this.state.totalAmount,
                                        CustomerData: this.state.customerData,
                                        TktCount: this.state.tktCount
                                    }
                                })

                            })

                        )
                        : null]]]
                ///////////////////////////////////////////////

            }else{
                this.showToast("Barcode mismatch", "ok", "warning");
            }
        })

    }

    handleBarcode() {
        this.setState({
            ...this.state,
            showBarcodeReader: !this.state.showBarcodeReader,
        })
    }


    componentWillReceiveProps(nextProps) {
        console.log("aaaaaaaaaaaaaa", this.state.allDiscounts, "ggggggggggggggggggggggggggg")

        this.state.dropdownDetails = [];
        let index = 0;
        let itemObj = {};
        itemObj.label = "AllItems";
        itemObj.key = index++;
        this.state.dropdownDetails.push(itemObj);

        let discountObj = {};
        discountObj.label = "Discount";
        discountObj.key = index++;
        this.state.dropdownDetails.push(discountObj);

        Object.keys(nextProps.userData.allCategories).forEach(function (key, index) {

            let categoryPopUpObj = {};
            categoryPopUpObj.label = nextProps.userData.allCategories[key].name;
            categoryPopUpObj.key = nextProps.userData.allCategories[key]._id;

            let objAvailable = false;
            for (let i = 0; i < this.state.dropdownDetails.length; i++) {
                if (this.state.dropdownDetails[i].key === categoryPopUpObj.key) {
                    objAvailable = true;
                    break;
                }
            }
            if (!objAvailable) {
                this.state.dropdownDetails.push(categoryPopUpObj);
            }
        }.bind(this));


        //get all items
        if (!nextProps.userData.allItems) {
            this.setState({
                ...this.state,
                isVisible: false
            });
            return;
        }
        this.state.allItems = [];
        this.state.selectedItems = [];
        Object.keys(nextProps.userData.allItems).forEach(function (key, index) {
            let obj = nextProps.userData.allItems[key];
            obj._id = key;

            let itemId = obj._id;
            obj.itemDetails = nextProps.userData.allItems[itemId];
            this.state.allItems[this.state.allItems.length] = obj;
            this.state.selectedItems[this.state.selectedItems.length] = obj;
        }.bind(this));

        //get all discounts
        if (!nextProps.userData.allDiscounts) {
            this.setState({
                ...this.state,
                isVisible: false
            });
            return;
        }
        this.state.allDiscounts = [];
        this.state.selectedDiscounts = [];
        Object.keys(nextProps.userData.allDiscounts).forEach(function (key, index) {
            let obj = nextProps.userData.allDiscounts[key];
            obj._id = key;
            let discountId = obj._id;
            obj.discountDetails = nextProps.userData.allDiscounts[discountId];
            this.state.allDiscounts[this.state.allDiscounts.length] = obj;
            this.state.selectedDiscounts[this.state.selectedDiscounts.length] = obj;
        }.bind(this));
        console.log("ffffffffffffffffffffffffff", this.state.dropdownDetails)
        console.log("ssssssssssssssssssssssssss", this.state.allDiscounts);


    }

    getSWD() {
        const windowWidth = Dimensions.get('window').width;
        return windowWidth;
    }



    updateSearch = search => {
        this.setState({ search });
        //console.log("filtering dates..", this.state.allCases);
        this.state.selectedItems = [];
        this.state.selectedDiscounts = [];
        if (this.state.allItems) {
            this.state.selectedItems = this.state.allItems.filter((res, index) => {
                return (res.name.toLowerCase().includes(search.toLowerCase()));
            });
        }
        if (this.state.allDiscounts) {
            this.state.selectedDiscounts = this.state.allDiscounts.filter((res, index) => {
                return (res.name.toLowerCase().includes(search.toLowerCase()));
            });
        }
        this.forceUpdate();
    };
    clearTicket() {
        Alert.alert(
            `${signUpStrings.youAreAboutToClearTheTicket}`,
            '',
            [
                {
                    text: `${signUpStrings.clearTicket}`, onPress: () => {
                        this.setState({
                            ...this.state,
                            chargeAmount: 0,
                            chargeItems: [],
                            totalAmount: 0,
                            discountedAmount: 0,
                            tktCount: 0
                        })
                    }
                },
                {
                    text: `${signUpStrings.cancel}`,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    }

    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }

    itemList() {
        return this.state.chargeItems.map((item) => {
            return (
                <View style={{
                    flexDirection: 'row', flex: 1, paddingVertical: wp('3%'),
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
        return this.state.chargeItems.map((item) => {
            return (
                <View>
                    {item.discountName ? <View style={{
                        flexDirection: 'row', flex: 1, paddingVertical: wp('3%'),
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

    render() {
        const { search } = this.state;
        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity :
            TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;
        let index = 0;

        const { navigation } = this.props;
        const data = navigation.getParam('data');
        const customerData = navigation.getParam('customerData');
        const tktCount = navigation.getParam('tktCount');
        this.state.customerData = customerData;
        this.state.data = data;
        if (tktCount !== undefined) {
            this.state.TktCount = tktCount
        }

        console.log("RECIEVED :", data);
        console.log("RECIEVED :", customerData);
        console.log("RECIEVED :", tktCount);

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left style={{ flexDirection: 'row', width: wp('4%') }}>
                        <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{
                            color: 'white',
                            marginRight: 3,
                            marginTop: (this.getSWD() < 500) ? wp('3.5%') : (this.getSWD() > 1000) ? wp('1%') : wp('1.5%'),
                        }} />

                        <TouchableOpacity style={{
                            marginLeft: (this.getSWD() < 500) ? wp('3%') : (this.getSWD() > 1000) ? wp('1.5%') : wp('2.5%'),
                        }} onPress={() => this.props.navigation.navigate('TicketViewScreen', {
                            data: {
                                ChargeAmount: this.state.chargeAmount,
                                ChargeItems: this.state.chargeItems,
                                DiscountedAmount: this.state.discountedAmount,
                                TotalAmount: this.state.totalAmount,
                                CustomerData: this.state.customerData,
                                tktCount: this.state.tktCount
                            }
                        })}>
                            <Body style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{
                                    fontSize: (this.getSWD() < 500) ? wp('5%') : (this.getSWD() > 1000) ? wp('2.5%') : wp('3.5%'),
                                    marginTop: (this.getSWD() < 500) ? wp('0%') : (this.getSWD() > 1000) ? wp('0%') : wp('0%'),
                                    color: 'white'
                                }}>
                                    {/*{this.getSWD()}*/}
                                    {signUpStrings.ticket}
                                </Text>
                                <ImageBackground source={require('../assets/img/ticketWhite.png')}
                                    style={{
                                        width: (this.getSWD() < 500) ? wp('8.5%') : (this.getSWD() > 1000) ? wp('3%') : wp('4.5%'),
                                        height: (this.getSWD() < 500) ? wp('8.5%') : (this.getSWD() > 1000) ? wp('3.5%') : wp('5%'),
                                        marginLeft: wp('2%'),
                                        marginTop: (this.getSWD() < 500) ? wp('1.5%') : (this.getSWD() > 1000) ? wp('0%') : wp('0%'),
                                        justifyContent: 'center', alignItems: 'center'
                                    }} >
                                    <View>
                                        {this.state.tktCount == 0 ? <Text style={{ color: 'white', fontSize: wp('2%') }}>0</Text>
                                            : <Text style={{ color: 'white', fontSize: wp('2%') }}>{this.state.tktCount ? this.state.tktCount : this.state.TktCount}</Text>
                                        }
                                    </View>

                                </ImageBackground>
                            </Body>
                        </TouchableOpacity>


                    </Left>

                    <Right>
                        {this.state.customerData ?
                            <Icon active name="md-person-add"
                                onPress={() =>
                                    Alert.alert(
                                        `${signUpStrings.customerAlreadyAdded}`,
                                        '',
                                        [
                                            {
                                                text: `${signUpStrings.ok}`, onPress: () => {
                                                    this.state.customerData = null;
                                                    this.forceUpdate();
                                                }
                                            },
                                            {
                                                text: `${signUpStrings.cancel}`,
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                        ],
                                        { cancelable: false },
                                    )
                                }
                                style={{ color: 'white', marginRight: wp('8%') }} />
                            :
                            <Icon active name="md-person"
                                onPress={() => this.props.navigation.navigate('CustomerToTicketScreen', {
                                    data: {
                                        ChargeAmount: this.state.chargeAmount,
                                        ChargeItems: this.state.chargeItems,
                                        DiscountedAmount: this.state.discountedAmount,
                                        TotalAmount: this.state.totalAmount,
                                        CustomerData: this.state.customerData,
                                        tktCount: this.state.tktCount
                                    },
                                    tktCount: this.state.tktCount
                                })}
                                style={{ color: 'white', marginRight: wp('8%') }} />
                        }

                        <Icon active name="md-more"
                            onPress={() => this.clearTicket()}
                            style={{ color: 'white', marginRight: wp('3%') }} />
                    </Right>
                </Header>


                {/* Main Charge button*/}
                <View style={{
                    justifyContent: "flex-start", alignItems: "center",
                    marginBottom: 12, backgroundColor: 'rgb(237,237,237)'
                }}>
                    <Button
                        style={{
                            marginVertical: wp('4.5%'),
                            height: (this.getSWD()<500 ? hp('12%'): (this.getSWD()>1000 ? hp('14%'):hp('12%'))),
                            marginTop: (this.getSWD()<500 ? hp('3%'): (this.getSWD()>1000 ? hp('5%'):hp('3%'))),
                            marginRight: (this.getSWD()<500 ? hp('4%'): (this.getSWD()>1000 ? hp('6%'):hp('4%'))),
                            marginLeft: (this.getSWD()<500 ? hp('4%'): (this.getSWD()>1000 ? hp('6%'):hp('4%'))),
                            marginBottom: (this.getSWD()<500 ? hp('4%'): (this.getSWD()>1000 ? hp('6%'):hp('4%'))),
                            // marginVertical: wp('4.5%'), height: wp('12%'),
                            // marginLeft: wp('5%'), marginRight: wp('5%'),
                            padding: (this.getSWD()<500 ? hp('12%'): (this.getSWD()>1000 ? hp('14%'):hp('12%'))),
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            if (this.state.chargeItems.length != 0) {
                                this.setState({
                                    isVisibleModal: true
                                })

                            } else {
                                this.showToast("No items to charge", "Ok", "warning");
                            }

                        }}>
                        <Body style={{}}>
                            <Text style={{
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: (this.getSWD() < 500) ? wp('3.5%')&& hp('3%') : (this.getSWD() > 1000) ? wp('3%')&& hp('3%') : wp('3.5%')&& hp('3%'),
                            }}> {signUpStrings.charge} </Text>
                            {/* <Text style={{
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('3%') : wp('3.5%'), */}
                            {/* <Text style={{ color: 'rgba(255,255,255,0.4)',
                                fontSize: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('3%') && hp('3%') : wp('3.5%') && hp('3%'),
                            }}> {signUpStrings.charge} </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.4)',
                                fontSize: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('3%') && hp('3%') : wp('3.5%') && hp('3%'),
                            }}> {signUpStrings.charge} </Text> */}
                            <Text style={{ color: 'rgba(255,255,255,0.4)',
                                fontSize: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('3%') && hp('2%'): wp('3.5%') && hp('2%'),
                            }}>{this.state.chargeAmount === 0 ? "0.00" : this.state.chargeAmount.toFixed(2)}</Text>
                        </Body>
                    </Button>
                </View>

                <Modal isVisible={this.state.isVisibleModal}>
                    <View style={{ width: wp('90%'), backgroundColor: 'white', borderRadius: 10 }}>

                        <View style={{ flex: 1, marginVertical: hp('4%') }}>
                            <Text style={{ marginStart: wp('4%'), fontWeight: 'bold', textAlign: 'center' }}>
                                {signUpStrings.ticketSummary}
                            </Text>
                        </View>

                        <ScrollView>
                            <View>
                                {this.itemList()}
                            </View>
                            <View>
                                {this.discountList()}
                            </View>
                            <View style={{
                                flexDirection: 'row', flex: 1, paddingVertical: wp('5%')
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ marginStart: wp('4%'), fontWeight: 'bold' }}>{signUpStrings.total}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ textAlign: 'right', marginRight: wp('4%'), fontWeight: 'bold' }}>{this.state.chargeAmount}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', marginVertical: wp('4%') }}>
                                <Button style={{
                                    width: wp('40%'), alignContent: 'center', marginHorizontal: wp('3%'),
                                    justifyContent: 'center', borderRadius: 8
                                }}
                                    onPress={() => { this.setState({ isVisibleModal: false }) }}>
                                    <Text style={{color:'white'}}>{signUpStrings.cancel}</Text>
                                </Button>
                                <Button style={{  width: wp('40%'), alignContent: 'center', marginHorizontal: wp('3%'),
                                    justifyContent: 'center', borderRadius: 8}}
                                    onPress={() => {
                                        this.props.navigation.navigate('ChargeScreen',
                                            {
                                                data: {
                                                    ChargeAmount: this.state.chargeAmount,
                                                    ChargeItems: this.state.chargeItems,
                                                    DiscountedAmount: this.state.discountedAmount,
                                                    TotalAmount: this.state.totalAmount,
                                                    CustomerData: this.state.customerData
                                                }
                                            })
                                    }}>
                                    <Text style={{ color: 'white' }}>Continue</Text>
                                </Button>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>



                {/* Search bar */}
                <View style={{
                    flexDirection: 'row', marginTop: 0, paddingTop : 0, borderBottomWidth: wp('0.25%'),
                    borderColor: '#d6d7da', position:'relative',
                    padding:(this.getSWD()<500) ? hp('1%') : (this.getSWD()>1000) ? hp('1%'):hp('1%'),

                }}>

                    <View style={{ marginRight: wp('0%'), borderBottomWidth: 0, width: wp('70%') ,

                    }}>
                        <View searchBar rounded style={{ width: wp('70%'), marginLeft: wp('4%')}}>
                            <SearchBar
                                searchIcon={{
                                    size: (this.getSWD() < 500) ? wp('5%') : (this.getSWD() > 1000) ? wp('5%') : wp('5%'),
                                }}
                                placeholder={signUpStrings.search}
                                onChangeText={this.updateSearch}
                                value={search}
                                containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
                                inputContainerStyle={{ backgroundColor: 'rgba(0,0,0,0)', width: wp('90%'), height: wp('6%') }}
                                inputStyle={{
                                    fontSize: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('3%') : wp('3%'),
                                }}
                            />
                        </View>
                    </View>
                    <View style={{
                        width: wp('15%'), borderWidth: wp('0%'),
                        borderLeftWidth: 1, borderColor: '#d6d7da'
                    }}>
                        <Content>
                            <Item style={{ marginRight: wp('0%'), borderBottomWidth: 0 }}>
                                <ModalSelector
                                    data={this.state.dropdownDetails}
                                    initValue=""
                                    supportedOrientations={['landscape']}
                                    accessible={true}
                                    backdropPressToClose={true}
                                    scrollViewAccessibilityLabel={'Scrollable options'}
                                    cancelButtonAccessibilityLabel={'Cancel Button'}
                                    onChange={(option) => {
                                        this.state.selectedItemFroCategory = [];
                                        //filter function
                                        this.state.selectedItemFroCategory = this.state.allItems.filter((res, index) => {
                                            return res.categoryId == option.key
                                        });
                                        this.setState({
                                            ...this.state,
                                            dropdownLable: option.label,
                                            dropdownId: option.key,
                                        }, () => {


                                        })

                                    }}>
                                    <Icon style={{
                                        width: wp('15%'),
                                        fontSize: (this.getSWD() < 500) ? wp('9%') : (this.getSWD() > 1000) ? wp('5%') : wp('7%'),
                                        marginLeft: (this.getSWD() < 500) ? wp('5%') : (this.getSWD() > 1000) ? wp('6%') : wp('5%'),
                                        marginTop: (this.getSWD() < 500) ? wp('1.2%') : (this.getSWD() > 1000) ? wp('1.5%') : wp('1.5%'),
                                    }}
                                        name='arrow-dropdown' />
                                    <Input
                                        style={{ padding: 0, height: hp('8%') }}
                                        editable={false}
                                        placeholder="Category"
                                        value={this.state.dropdownLable} />
                                </ModalSelector>
                            </Item>
                        </Content>
                    </View>

                    {/* Scan item Btn */}
                    <View style={{
                        width: wp('15%'), borderWidth: wp('0%'),
                        borderLeftWidth: 1, borderColor: '#d6d7da'
                    }}>
                        <Content>
                            <Item style={{ marginRight: wp('0%'), borderBottomWidth: 0 }}>
                                <Item style={{ marginRight: wp('0%'), borderBottomWidth: 0 }}>
                                    {/* {scan} */}
                                    <Icon style={{
                                        width: wp('15%'),
                                        fontSize: (this.getSWD() < 500) ? wp('9%') : (this.getSWD() > 1000) ? wp('5%') : wp('7%'),
                                        marginLeft: (this.getSWD() < 500) ? wp('2%') : (this.getSWD() > 1000) ? wp('4.5%') : wp('4%'),
                                        marginTop: (this.getSWD() < 500) ? wp('0.4%') : (this.getSWD() > 1000) ? wp('0.5%') : wp('0.5%'),
                                    }}
                                        onPress={() => {
                                            this.handleBarcode();
                                        }}
                                        name='barcode' />
                                </Item>
                            </Item>
                        </Content>
                    </View>

                </View>

                <View>
                    {this.state.showBarcodeReader ?
                        <View style={styles.container}>
                            <RNCamera
                                style={styles.preview}
                                flashMode={this.state.torchOn
                                    ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                                onBarCodeRead={this.onBarCodeRead}
                                ref={cam => this.camera = cam}
                                androidCameraPermissionOptions={{
                                    title: "Permission to use camera",
                                    message: "We need your permission to use your camera",
                                    buttonPositive: "ok",
                                    buttonNegative: "cancel",
                                }}
                            >
                                <Text style={{

                                }}></Text>
                            </RNCamera>
                        </View> : null}
                </View>


                <Container style={{ flexDirection: 'row', marginTop: wp('3%') }}>
                    <Content style={{ flex: 1 }}>
                        {this.state.dropdownLable == `${signUpStrings.dropDownAllItems}`
                            ? this.state.selectedItems ? (
                                this.state.selectedItems.length !== 0 ? (
                                    this.state.selectedItems.map((res, index) => (
                                        <List>
                                            {/* this.props.navigation.navigate('ItemPriceScreen') */}
                                            <ListItem thumbnail onPress={() =>

                                                res.itemDetails.price !== "" && res.itemDetails.soldBy == "Each"
                                                    ?
                                                    //All Set
                                                    (

                                                        this.setState({
                                                            ...this.state,
                                                            tktCount: this.state.tktCount + 1,
                                                            totalAmount: this.state.totalAmount + (res.itemDetails.price * 1),


                                                        }, () => {
                                                            this.forceUpdate();

                                                            let itemObj = {};

                                                            if (this.state.chargeItems.length == 0) {
                                                                if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {

                                                                    let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)

                                                                    itemObj.itemId = res.itemDetails._id;
                                                                    itemObj.itemName = res.itemDetails.name;
                                                                    itemObj.price = res.itemDetails.price;
                                                                    itemObj.quantity = 1;
                                                                    itemObj.discount = discObj.discount;
                                                                    itemObj.discountType = discObj.discountType;
                                                                    itemObj.discountName = discObj.name;

                                                                    if (discObj.discountType == "Percentage") {
                                                                        this.state.discountedAmount = this.state.discountedAmount + res.itemDetails.price * (discObj.discount / 100)
                                                                    } else if (discObj.discountType == "Amount") {
                                                                        this.state.discountedAmount = this.state.discountedAmount + discObj.discount
                                                                    }



                                                                } else {
                                                                    itemObj.itemId = res.itemDetails._id,
                                                                        itemObj.itemName = res.itemDetails.name,
                                                                        itemObj.price = res.itemDetails.price,
                                                                        itemObj.quantity = 1

                                                                }
                                                                this.state.chargeItems.push(itemObj);
                                                                console.log("first Item", this.state.chargeItems)

                                                            } else {
                                                                if (this.state.chargeItems.length !== 0) {
                                                                    if (this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)) {

                                                                        let selectedItem = this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)
                                                                        selectedItem.quantity += 1;
                                                                        console.log("annanna", this.state.chargeItems);
                                                                        if (selectedItem.discountType == "Percentage") {
                                                                            this.state.discountedAmount = this.state.discountedAmount + selectedItem.price * (selectedItem.discount / 100)
                                                                        } else if (selectedItem.discountType == "Amount") {
                                                                            this.state.discountedAmount = this.state.discountedAmount + selectedItem.discount
                                                                        }


                                                                    } else {
                                                                        if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {
                                                                            let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)
                                                                            itemObj.itemId = res.itemDetails._id;
                                                                            itemObj.itemName = res.itemDetails.name;
                                                                            itemObj.price = res.itemDetails.price;
                                                                            itemObj.quantity = 1;
                                                                            itemObj.discount = discObj.discount;
                                                                            itemObj.discountType = discObj.discountType;
                                                                            itemObj.discountName = discObj.name;

                                                                            this.state.chargeItems.push(itemObj);
                                                                            console.log("first Item", this.state.chargeItems)

                                                                            if (discObj.discountType == "Percentage") {
                                                                                this.state.discountedAmount = this.state.discountedAmount + res.itemDetails.price * (discObj.discount / 100)
                                                                            } else if (discObj.discountType == "Amount") {
                                                                                this.state.discountedAmount = this.state.discountedAmount + discObj.discount
                                                                            }


                                                                        } else {
                                                                            itemObj.itemId = res.itemDetails._id,
                                                                                itemObj.itemName = res.itemDetails.name,
                                                                                itemObj.price = res.itemDetails.price,
                                                                                itemObj.quantity = 1,

                                                                                this.state.chargeItems.push(itemObj);
                                                                            console.log("first Item", this.state.chargeItems)
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            console.log("Discount price", this.state.discountedAmount);
                                                            this.state.chargeAmount = this.state.totalAmount - this.state.discountedAmount

                                                        })

                                                    )
                                                    : [res.itemDetails.price == "" && res.itemDetails.soldBy == "Each"
                                                        ?
                                                        //Price Screen
                                                        (

                                                            this.setState({

                                                            }, () => {
                                                                this.forceUpdate()

                                                                let itemObj = {};

                                                                if (this.state.chargeItems.length == 0) {
                                                                    if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {

                                                                        let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)

                                                                        itemObj.itemId = res.itemDetails._id;
                                                                        itemObj.itemName = res.itemDetails.name;
                                                                        itemObj.discount = discObj.discount;
                                                                        itemObj.discountType = discObj.discountType;
                                                                        itemObj.discountName = discObj.name;




                                                                    } else {
                                                                        itemObj.itemId = res.itemDetails._id,
                                                                            itemObj.itemName = res.itemDetails.name

                                                                    }


                                                                    this.state.chargeItems.push(itemObj);
                                                                    console.log("first Item", this.state.chargeItems)

                                                                } else {
                                                                    if (this.state.chargeItems.length !== 0) {
                                                                        if (this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)) {

                                                                            let selectedItem = this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)
                                                                            console.log("annanna", this.state.chargeItems);


                                                                        } else {
                                                                            if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {
                                                                                let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)
                                                                                itemObj.itemId = res.itemDetails._id;
                                                                                itemObj.itemName = res.itemDetails.name;
                                                                                itemObj.discount = discObj.discount;
                                                                                itemObj.discountType = discObj.discountType;
                                                                                itemObj.discountName = discObj.name;

                                                                                this.state.chargeItems.push(itemObj);
                                                                                console.log("first Item", this.state.chargeItems)

                                                                            } else {
                                                                                itemObj.itemId = res.itemDetails._id,
                                                                                    itemObj.itemName = res.itemDetails.name,

                                                                                    this.state.chargeItems.push(itemObj);
                                                                                console.log("first Item", this.state.chargeItems)
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                this.state.chargeAmount = this.state.totalAmount - this.state.discountedAmount
                                                                this.props.navigation.navigate('ItemPriceScreen', {
                                                                    Item: res, data: {
                                                                        ChargeAmount: this.state.chargeAmount,
                                                                        ChargeItems: this.state.chargeItems,
                                                                        DiscountedAmount: this.state.discountedAmount,
                                                                        TotalAmount: this.state.totalAmount,
                                                                        CustomerData: this.state.customerData,
                                                                        TktCount: this.state.tktCount
                                                                    }
                                                                })

                                                            })

                                                        )
                                                        : [res.itemDetails.soldBy !== "Each" && res.itemDetails.price !== ""
                                                            ?
                                                            //Weight Screen
                                                            (
                                                                this.setState({

                                                                }, () => {
                                                                    this.forceUpdate()

                                                                    let itemObj = {};

                                                                    if (this.state.chargeItems.length == 0) {
                                                                        if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {

                                                                            let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)

                                                                            itemObj.itemId = res.itemDetails._id;
                                                                            itemObj.itemName = res.itemDetails.name;
                                                                            itemObj.price = res.itemDetails.price;
                                                                            itemObj.discount = discObj.discount;
                                                                            itemObj.discountType = discObj.discountType;
                                                                            itemObj.discountName = discObj.name;




                                                                        } else {
                                                                            itemObj.itemId = res.itemDetails._id,
                                                                                itemObj.itemName = res.itemDetails.name,
                                                                                itemObj.price = res.itemDetails.price

                                                                        }


                                                                        this.state.chargeItems.push(itemObj);
                                                                        console.log("first Item", this.state.chargeItems)

                                                                    } else {
                                                                        if (this.state.chargeItems.length !== 0) {
                                                                            if (this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)) {

                                                                                let selectedItem = this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)

                                                                                console.log("annanna", this.state.chargeItems);



                                                                            } else {
                                                                                if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {
                                                                                    let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)
                                                                                    itemObj.itemId = res.itemDetails._id;
                                                                                    itemObj.itemName = res.itemDetails.name;
                                                                                    itemObj.price = res.itemDetails.price;
                                                                                    itemObj.discount = discObj.discount;
                                                                                    itemObj.discountType = discObj.discountType;
                                                                                    itemObj.discountName = discObj.name;

                                                                                    this.state.chargeItems.push(itemObj);
                                                                                    console.log("first Item", this.state.chargeItems)



                                                                                } else {
                                                                                    itemObj.itemId = res.itemDetails._id,
                                                                                        itemObj.itemName = res.itemDetails.name,
                                                                                        itemObj.price = res.itemDetails.price,

                                                                                        this.state.chargeItems.push(itemObj);
                                                                                    console.log("first Item", this.state.chargeItems)
                                                                                }
                                                                            }
                                                                        }
                                                                    }

                                                                    this.props.navigation.navigate('SoldByScreen', {
                                                                        Item: res, data: {
                                                                            ChargeAmount: this.state.chargeAmount,
                                                                            ChargeItems: this.state.chargeItems,
                                                                            DiscountedAmount: this.state.discountedAmount,
                                                                            TotalAmount: this.state.totalAmount,
                                                                            CustomerData: this.state.customerData,
                                                                            TktCount: this.state.tktCount
                                                                        }
                                                                    })
                                                                })



                                                            )
                                                            : [res.itemDetails.price == "" && res.itemDetails.soldBy !== "Each"
                                                                ?
                                                                //Price Then Weight
                                                                (

                                                                    this.setState({

                                                                    }, () => {
                                                                        this.forceUpdate()

                                                                        let itemObj = {};

                                                                        if (this.state.chargeItems.length == 0) {
                                                                            if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {

                                                                                let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)

                                                                                itemObj.itemId = res.itemDetails._id;
                                                                                itemObj.itemName = res.itemDetails.name;
                                                                                itemObj.discount = discObj.discount;
                                                                                itemObj.discountType = discObj.discountType;
                                                                                itemObj.discountName = discObj.name;




                                                                            } else {
                                                                                itemObj.itemId = res.itemDetails._id,
                                                                                    itemObj.itemName = res.itemDetails.name

                                                                            }


                                                                            this.state.chargeItems.push(itemObj);
                                                                            console.log("first Item", this.state.chargeItems)

                                                                        } else {
                                                                            if (this.state.chargeItems.length !== 0) {
                                                                                if (this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)) {

                                                                                    let selectedItem = this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)
                                                                                    console.log("annanna", this.state.chargeItems);


                                                                                } else {
                                                                                    if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {
                                                                                        let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)
                                                                                        itemObj.itemId = res.itemDetails._id;
                                                                                        itemObj.itemName = res.itemDetails.name;
                                                                                        itemObj.discount = discObj.discount;
                                                                                        itemObj.discountType = discObj.discountType;
                                                                                        itemObj.discountName = discObj.name;

                                                                                        this.state.chargeItems.push(itemObj);
                                                                                        console.log("first Item", this.state.chargeItems)

                                                                                    } else {
                                                                                        itemObj.itemId = res.itemDetails._id,
                                                                                            itemObj.itemName = res.itemDetails.name,

                                                                                            this.state.chargeItems.push(itemObj);
                                                                                        console.log("first Item", this.state.chargeItems)
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        this.state.chargeAmount = this.state.totalAmount - this.state.discountedAmount
                                                                        this.props.navigation.navigate('ItemPriceScreen', {
                                                                            Item: res, data: {
                                                                                ChargeAmount: this.state.chargeAmount,
                                                                                ChargeItems: this.state.chargeItems,
                                                                                DiscountedAmount: this.state.discountedAmount,
                                                                                TotalAmount: this.state.totalAmount,
                                                                                CustomerData: this.state.customerData,
                                                                                TktCount: this.state.tktCount
                                                                            }
                                                                        })

                                                                    })

                                                                )
                                                                : null]]]


                                            }>
                                                <Left>
                                                    {res.itemDetails.image ?
                                                        <Thumbnail source={{ uri: res.itemDetails.image }} />
                                                        :
                                                        <View style={{ justifyContent: 'center', alignItems: 'center', width: wp('17%') }}>
                                                            {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="gray" rotate={45}></Hexagon> : null}
                                                            {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="red" rotate={45}></Hexagon> : null}
                                                            {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="pink" rotate={45}></Hexagon> : null}
                                                            {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="orange" rotate={45}></Hexagon> : null}
                                                            {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="yellow" rotate={45}></Hexagon> : null}
                                                            {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="green" rotate={45}></Hexagon> : null}
                                                            {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="blue" rotate={45}></Hexagon> : null}
                                                            {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="purple" rotate={45}></Hexagon> : null}

                                                            {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Octagon' ? <Octagon color="gray" ></Octagon> : null}
                                                            {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Octagon' ? <Octagon color="red" ></Octagon> : null}
                                                            {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Octagon' ? <Octagon color="pink" ></Octagon> : null}
                                                            {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Octagon' ? <Octagon color="orange" ></Octagon> : null}
                                                            {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Octagon' ? <Octagon color="yellow" ></Octagon> : null}
                                                            {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Octagon' ? <Octagon color="green" ></Octagon> : null}
                                                            {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Octagon' ? <Octagon color="blue" ></Octagon> : null}
                                                            {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Octagon' ? <Octagon color="purple" ></Octagon> : null}

                                                            {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Square' ? <Square color="gray" ></Square> : null}
                                                            {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Square' ? <Square color="red" ></Square> : null}
                                                            {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Square' ? <Square color="pink" ></Square> : null}
                                                            {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Square' ? <Square color="orange"></Square> : null}
                                                            {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Square' ? <Square color="yellow" ></Square> : null}
                                                            {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Square' ? <Square color="green" ></Square> : null}
                                                            {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Square' ? <Square color="blue" ></Square> : null}
                                                            {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Square' ? <Square color="purple"></Square> : null}

                                                            {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Circle' ? <Circle color="gray"></Circle> : null}
                                                            {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Circle' ? <Circle color="red" ></Circle> : null}
                                                            {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Circle' ? <Circle color="pink"></Circle> : null}
                                                            {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Circle' ? <Circle color="orange"></Circle> : null}
                                                            {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Circle' ? <Circle color="yellow" ></Circle> : null}
                                                            {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Circle' ? <Circle color="green" ></Circle> : null}
                                                            {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Circle' ? <Circle color="blue" ></Circle> : null}
                                                            {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Circle' ? <Circle color="purple" ></Circle> : null}
                                                        </View>


                                                    }

                                                </Left>
                                                <Body>
                                                    <Text>{res.itemDetails ? res.itemDetails.name : ""}</Text>
                                                </Body>
                                                <Right style={{
                                                    marginRight: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('8%') : wp('7%'),
                                                }}>
                                                    <Text>{res.itemDetails ? res.itemDetails.price : ""}</Text>
                                                </Right>
                                            </ListItem>
                                        </List>
                                    ))
                                ) : (
                                        <View style={{
                                            width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                            alignItems: "center"
                                        }}>
                                            <Text>{signUpStrings.noite}</Text>
                                        </View>
                                    )
                            ) : (
                                    <View style={{
                                        width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                        alignItems: "center"
                                    }}>
                                        <Text>{signUpStrings.noItems}</Text>
                                    </View>
                                )
                            : [
                                (this.state.dropdownLable == "{signUpStrings.dropDownDiscount}"
                                    ? this.state.selectedDiscounts ? (
                                        this.state.selectedDiscounts.length !== 0 ? (
                                            this.state.selectedDiscounts.map((res, index) => (
                                                <List>
                                                    <ListItem thumbnail>
                                                        <Left>
                                                            <Icon active name="pricetag" />
                                                        </Left>
                                                        <Body>
                                                            <Text>{res.discountDetails ? res.discountDetails.name : ""}</Text>
                                                        </Body>
                                                        <Right>
                                                            <Text>{res.discountDetails ? res.discountDetails.discount : ""}</Text>
                                                        </Right>
                                                    </ListItem>

                                                </List>
                                            ))
                                        ) : (
                                                <View style={{
                                                    width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                                    alignItems: "center"
                                                }}>
                                                    <Text>{signUpStrings.noDiscount}</Text>
                                                </View>
                                            )
                                    ) : (
                                            <View style={{
                                                width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                                alignItems: "center"
                                            }}>
                                                <Text>{signUpStrings.noDiscount}</Text>
                                            </View>
                                        )
                                    : this.state.selectedItemFroCategory ? (
                                        this.state.selectedItemFroCategory.length !== 0 ? (
                                            this.state.selectedItemFroCategory.map((res, index) => (
                                                <List>
                                                    {/* this.props.navigation.navigate('ItemPriceScreen') */}
                                                    <ListItem thumbnail onPress={() =>
                                                        res.itemDetails.price !== "" && res.itemDetails.soldBy == "Each"
                                                            ?
                                                            //All Set
                                                            (

                                                                this.setState({
                                                                    tktCount: this.state.tktCount + 1,
                                                                    totalAmount: this.state.totalAmount + (res.itemDetails.price * 1),



                                                                }, () => {
                                                                    this.forceUpdate()

                                                                    let itemObj = {};

                                                                    if (this.state.chargeItems.length == 0) {
                                                                        if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {

                                                                            let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)

                                                                            itemObj.itemId = res.itemDetails._id;
                                                                            itemObj.itemName = res.itemDetails.name;
                                                                            itemObj.price = res.itemDetails.price;
                                                                            itemObj.quantity = 1;
                                                                            itemObj.discount = discObj.discount;
                                                                            itemObj.discountType = discObj.discountType;
                                                                            itemObj.discountName = discObj.name;

                                                                            if (discObj.discountType == "Percentage") {
                                                                                this.state.discountedAmount = this.state.discountedAmount + res.itemDetails.price * (discObj.discount / 100)
                                                                            } else if (discObj.discountType == "Amount") {
                                                                                this.state.discountedAmount = this.state.discountedAmount + discObj.discount
                                                                            }



                                                                        } else {
                                                                            itemObj.itemId = res.itemDetails._id,
                                                                                itemObj.itemName = res.itemDetails.name,
                                                                                itemObj.price = res.itemDetails.price,
                                                                                itemObj.quantity = 1

                                                                        }


                                                                        this.state.chargeItems.push(itemObj);
                                                                        console.log("first Item", this.state.chargeItems)

                                                                    } else {
                                                                        if (this.state.chargeItems.length !== 0) {
                                                                            if (this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)) {

                                                                                let selectedItem = this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)
                                                                                selectedItem.quantity += 1;
                                                                                console.log("annanna", this.state.chargeItems);
                                                                                if (selectedItem.discountType == "Percentage") {
                                                                                    this.state.discountedAmount = this.state.discountedAmount + selectedItem.price * (selectedItem.discount / 100)
                                                                                } else if (selectedItem.discountType == "Amount") {
                                                                                    this.state.discountedAmount = this.state.discountedAmount + selectedItem.discount
                                                                                }


                                                                            } else {
                                                                                if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {
                                                                                    let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)
                                                                                    itemObj.itemId = res.itemDetails._id;
                                                                                    itemObj.itemName = res.itemDetails.name;
                                                                                    itemObj.price = res.itemDetails.price;
                                                                                    itemObj.quantity = 1;
                                                                                    itemObj.discount = discObj.discount;
                                                                                    itemObj.discountType = discObj.discountType;
                                                                                    itemObj.discountName = discObj.name;

                                                                                    this.state.chargeItems.push(itemObj);
                                                                                    console.log("first Item", this.state.chargeItems)

                                                                                    if (discObj.discountType == "Percentage") {
                                                                                        this.state.discountedAmount = this.state.discountedAmount + res.itemDetails.price * (discObj.discount / 100)
                                                                                    } else if (discObj.discountType == "Amount") {
                                                                                        this.state.discountedAmount = this.state.discountedAmount + discObj.discount
                                                                                    }


                                                                                } else {
                                                                                    itemObj.itemId = res.itemDetails._id,
                                                                                        itemObj.itemName = res.itemDetails.name,
                                                                                        itemObj.price = res.itemDetails.price,
                                                                                        itemObj.quantity = 1,

                                                                                        this.state.chargeItems.push(itemObj);
                                                                                    console.log("first Item", this.state.chargeItems)
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    console.log("Discount price", this.state.discountedAmount);
                                                                    this.state.chargeAmount = this.state.totalAmount - this.state.discountedAmount

                                                                })

                                                            )
                                                            : [res.itemDetails.price == "" && res.itemDetails.soldBy == "Each"
                                                                ?
                                                                //Price Screen
                                                                (

                                                                    this.setState({

                                                                    }, () => {
                                                                        this.forceUpdate()

                                                                        let itemObj = {};

                                                                        if (this.state.chargeItems.length == 0) {
                                                                            if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {

                                                                                let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)

                                                                                itemObj.itemId = res.itemDetails._id;
                                                                                itemObj.itemName = res.itemDetails.name;
                                                                                itemObj.discount = discObj.discount;
                                                                                itemObj.discountType = discObj.discountType;
                                                                                itemObj.discountName = discObj.name;




                                                                            } else {
                                                                                itemObj.itemId = res.itemDetails._id,
                                                                                    itemObj.itemName = res.itemDetails.name

                                                                            }


                                                                            this.state.chargeItems.push(itemObj);
                                                                            console.log("first Item", this.state.chargeItems)

                                                                        } else {
                                                                            if (this.state.chargeItems.length !== 0) {
                                                                                if (this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)) {

                                                                                    let selectedItem = this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)
                                                                                    console.log("annanna", this.state.chargeItems);


                                                                                } else {
                                                                                    if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {
                                                                                        let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)
                                                                                        itemObj.itemId = res.itemDetails._id;
                                                                                        itemObj.itemName = res.itemDetails.name;
                                                                                        itemObj.discount = discObj.discount;
                                                                                        itemObj.discountType = discObj.discountType;
                                                                                        itemObj.discountName = discObj.name;

                                                                                        this.state.chargeItems.push(itemObj);
                                                                                        console.log("first Item", this.state.chargeItems)

                                                                                    } else {
                                                                                        itemObj.itemId = res.itemDetails._id,
                                                                                            itemObj.itemName = res.itemDetails.name,

                                                                                            this.state.chargeItems.push(itemObj);
                                                                                        console.log("first Item", this.state.chargeItems)
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        this.state.chargeAmount = this.state.totalAmount - this.state.discountedAmount
                                                                        this.props.navigation.navigate('ItemPriceScreen', {
                                                                            Item: res, data: {
                                                                                ChargeAmount: this.state.chargeAmount,
                                                                                ChargeItems: this.state.chargeItems,
                                                                                DiscountedAmount: this.state.discountedAmount,
                                                                                TotalAmount: this.state.totalAmount,
                                                                                CustomerData: this.state.customerData,
                                                                                TktCount: this.state.tktCount
                                                                            }
                                                                        })

                                                                    })

                                                                )
                                                                : [res.itemDetails.soldBy == "Weight" && res.itemDetails.price !== ""
                                                                    ?
                                                                    //Weight Screen
                                                                    (
                                                                        this.setState({

                                                                        }, () => {
                                                                            this.forceUpdate()

                                                                            let itemObj = {};

                                                                            if (this.state.chargeItems.length == 0) {
                                                                                if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {

                                                                                    let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)

                                                                                    itemObj.itemId = res.itemDetails._id;
                                                                                    itemObj.itemName = res.itemDetails.name;
                                                                                    itemObj.price = res.itemDetails.price;
                                                                                    itemObj.discount = discObj.discount;
                                                                                    itemObj.discountType = discObj.discountType;
                                                                                    itemObj.discountName = discObj.name;




                                                                                } else {
                                                                                    itemObj.itemId = res.itemDetails._id,
                                                                                        itemObj.itemName = res.itemDetails.name,
                                                                                        itemObj.price = res.itemDetails.price

                                                                                }


                                                                                this.state.chargeItems.push(itemObj);
                                                                                console.log("first Item", this.state.chargeItems)

                                                                            } else {
                                                                                if (this.state.chargeItems.length !== 0) {
                                                                                    if (this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)) {

                                                                                        let selectedItem = this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)

                                                                                        console.log("annanna", this.state.chargeItems);



                                                                                    } else {
                                                                                        if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {
                                                                                            let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)
                                                                                            itemObj.itemId = res.itemDetails._id;
                                                                                            itemObj.itemName = res.itemDetails.name;
                                                                                            itemObj.price = res.itemDetails.price;
                                                                                            itemObj.discount = discObj.discount;
                                                                                            itemObj.discountType = discObj.discountType;
                                                                                            itemObj.discountName = discObj.name;

                                                                                            this.state.chargeItems.push(itemObj);
                                                                                            console.log("first Item", this.state.chargeItems)



                                                                                        } else {
                                                                                            itemObj.itemId = res.itemDetails._id,
                                                                                                itemObj.itemName = res.itemDetails.name,
                                                                                                itemObj.price = res.itemDetails.price,

                                                                                                this.state.chargeItems.push(itemObj);
                                                                                            console.log("first Item", this.state.chargeItems)
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }

                                                                            this.props.navigation.navigate('SoldByScreen', {
                                                                                Item: res, data: {
                                                                                    ChargeAmount: this.state.chargeAmount,
                                                                                    ChargeItems: this.state.chargeItems,
                                                                                    DiscountedAmount: this.state.discountedAmount,
                                                                                    TotalAmount: this.state.totalAmount,
                                                                                    CustomerData: this.state.customerData,
                                                                                    TktCount: this.state.tktCount
                                                                                }
                                                                            })
                                                                        })



                                                                    )
                                                                    : [res.itemDetails.price == "" && res.itemDetails.soldBy !== "Each"
                                                                        ?
                                                                        //Price Then Weight
                                                                        (

                                                                            this.setState({

                                                                            }, () => {
                                                                                this.forceUpdate()

                                                                                let itemObj = {};

                                                                                if (this.state.chargeItems.length == 0) {
                                                                                    if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {

                                                                                        let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)

                                                                                        itemObj.itemId = res.itemDetails._id;
                                                                                        itemObj.itemName = res.itemDetails.name;
                                                                                        itemObj.discount = discObj.discount;
                                                                                        itemObj.discountType = discObj.discountType;
                                                                                        itemObj.discountName = discObj.name;




                                                                                    } else {
                                                                                        itemObj.itemId = res.itemDetails._id,
                                                                                            itemObj.itemName = res.itemDetails.name

                                                                                    }


                                                                                    this.state.chargeItems.push(itemObj);
                                                                                    console.log("first Item", this.state.chargeItems)

                                                                                } else {
                                                                                    if (this.state.chargeItems.length !== 0) {
                                                                                        if (this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)) {

                                                                                            let selectedItem = this.state.chargeItems.find(item => item.itemId === res.itemDetails._id)
                                                                                            console.log("annanna", this.state.chargeItems);


                                                                                        } else {
                                                                                            if (this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)) {
                                                                                                let discObj = this.state.allDiscounts.find(disc => disc.itemId == res.itemDetails._id)
                                                                                                itemObj.itemId = res.itemDetails._id;
                                                                                                itemObj.itemName = res.itemDetails.name;
                                                                                                itemObj.discount = discObj.discount;
                                                                                                itemObj.discountType = discObj.discountType;
                                                                                                itemObj.discountName = discObj.name;

                                                                                                this.state.chargeItems.push(itemObj);
                                                                                                console.log("first Item", this.state.chargeItems)

                                                                                            } else {
                                                                                                itemObj.itemId = res.itemDetails._id,
                                                                                                    itemObj.itemName = res.itemDetails.name,

                                                                                                    this.state.chargeItems.push(itemObj);
                                                                                                console.log("first Item", this.state.chargeItems)
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                                this.state.chargeAmount = this.state.totalAmount - this.state.discountedAmount
                                                                                this.props.navigation.navigate('ItemPriceScreen', {
                                                                                    Item: res, data: {
                                                                                        ChargeAmount: this.state.chargeAmount,
                                                                                        ChargeItems: this.state.chargeItems,
                                                                                        DiscountedAmount: this.state.discountedAmount,
                                                                                        TotalAmount: this.state.totalAmount,
                                                                                        CustomerData: this.state.customerData,
                                                                                        TktCount: this.state.tktCount
                                                                                    }
                                                                                })

                                                                            })

                                                                        )
                                                                        : null]]]
                                                    }>
                                                        <Left>
                                                            {res.itemDetails.image ?
                                                                <Thumbnail source={{ uri: res.itemDetails.image }} />
                                                                :
                                                                <View style={{ justifyContent: 'center', alignItems: 'center', width: wp('17%') }}>
                                                                    {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="gray" rotate={45}></Hexagon> : null}
                                                                    {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="red" rotate={45}></Hexagon> : null}
                                                                    {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="pink" rotate={45}></Hexagon> : null}
                                                                    {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="orange" rotate={45}></Hexagon> : null}
                                                                    {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="yellow" rotate={45}></Hexagon> : null}
                                                                    {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="green" rotate={45}></Hexagon> : null}
                                                                    {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="blue" rotate={45}></Hexagon> : null}
                                                                    {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="purple" rotate={45}></Hexagon> : null}

                                                                    {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Octagon' ? <Octagon color="gray" ></Octagon> : null}
                                                                    {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Octagon' ? <Octagon color="red" ></Octagon> : null}
                                                                    {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Octagon' ? <Octagon color="pink" ></Octagon> : null}
                                                                    {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Octagon' ? <Octagon color="orange" ></Octagon> : null}
                                                                    {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Octagon' ? <Octagon color="yellow" ></Octagon> : null}
                                                                    {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Octagon' ? <Octagon color="green" ></Octagon> : null}
                                                                    {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Octagon' ? <Octagon color="blue" ></Octagon> : null}
                                                                    {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Octagon' ? <Octagon color="purple" ></Octagon> : null}

                                                                    {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Square' ? <Square color="gray" ></Square> : null}
                                                                    {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Square' ? <Square color="red" ></Square> : null}
                                                                    {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Square' ? <Square color="pink" ></Square> : null}
                                                                    {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Square' ? <Square color="orange"></Square> : null}
                                                                    {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Square' ? <Square color="yellow" ></Square> : null}
                                                                    {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Square' ? <Square color="green" ></Square> : null}
                                                                    {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Square' ? <Square color="blue" ></Square> : null}
                                                                    {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Square' ? <Square color="purple"></Square> : null}

                                                                    {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Circle' ? <Circle color="gray"></Circle> : null}
                                                                    {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Circle' ? <Circle color="red" ></Circle> : null}
                                                                    {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Circle' ? <Circle color="pink"></Circle> : null}
                                                                    {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Circle' ? <Circle color="orange"></Circle> : null}
                                                                    {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Circle' ? <Circle color="yellow" ></Circle> : null}
                                                                    {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Circle' ? <Circle color="green" ></Circle> : null}
                                                                    {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Circle' ? <Circle color="blue" ></Circle> : null}
                                                                    {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Circle' ? <Circle color="purple" ></Circle> : null}
                                                                </View>


                                                            }

                                                        </Left>
                                                        <Body>
                                                            <Text>{res.itemDetails ? res.itemDetails.name : ""}</Text>
                                                        </Body>
                                                        <Right>
                                                            <Text>{res.itemDetails ? res.itemDetails.price : ""}</Text>
                                                        </Right>
                                                    </ListItem>
                                                </List>
                                            ))
                                        ) : (
                                                <View style={{
                                                    width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                                    alignItems: "center"
                                                }}>
                                                    <Text>{signUpStrings.noItemsForCategory}</Text>
                                                </View>
                                            )
                                    ) : (
                                            <View style={{
                                                width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                                alignItems: "center"
                                            }}>
                                                <Text>No Items For Category</Text>
                                            </View>
                                        )
                                )
                            ]

                        }
                    </Content>
                </Container>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('80%'),
        alignSelf: 'center',
        justifyContent: 'center'
    },
    preview: {
        flex: 1,
        height: hp('80%'),
        alignItems: 'center'
    },
    cameraIcon: {
        margin: 5,
        height: 40,
        width: 40
    },
    bottomOverlay: {
        position: "absolute",
        width: "100%",
        flex: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
});

function mapStateToProps(state) {
    return {
        count: state.multy,
        userData: state.data,
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getCases: (data) => getCases(data),
        decrement: decrement,
        multiply: multiply ,
        updateCurrentTicket : (ticketData) => updateCurrentTicket(ticketData),

    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(SalesScreen);
