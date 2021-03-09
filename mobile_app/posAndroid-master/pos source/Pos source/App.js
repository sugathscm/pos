import React from 'react';
import { View, ImageBackground, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, createAppContainer, createStackNavigator, createSwitchNavigator, DrawerItems } from 'react-navigation'
import {
    Container,
    Text,
    Root,
    Icon
} from 'native-base';

import { Provider } from 'react-redux';
import allReducers from './src/redux/reducers/index.js';
import { applyMiddleware, createStore } from 'redux';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
} from "react-native-responsive-screen";
import thunkMiddleware from "redux-thunk";

//Screens

import ItemsMain from "./src/screens/itemsMain";
import AllItems from "./src/screens/allitems";
import EditItem from "./src/screens/editItem";
import AllCategories from "./src/screens/allcategories";
import AllDiscounts from "./src/screens/alldiscounts";
import NewItem from "./src/screens/newItem";
import NewCategory from "./src/screens/newCategory";
import NewDiscount from "./src/screens/newDiscount";
import SalesScreen from "./src/screens/salesScreen";
import ChargeScreen from "./src/screens/chargeScreen";
import CustomerToTicketScreen from "./src/screens/customerToTicketScreen";
import AllReceipts from "./src/screens/allreceipts";
import ReceiptDetailsScreen from "./src/screens/receiptDetailsScreen";
import CashScreen from "./src/screens/cashScreen";
import CreateCustomer from "./src/screens/createCustomer";
import RefundScreen from "./src/screens/refundScreen";
import EmailReceiptScreen from "./src/screens/emailReceiptScreen";
import Settings from "./src/screens/settings";
import ItemPriceScreen from "./src/screens/itemPriceScreen";
import HelpScreen from "./src/screens/helpScreen";
import ItemQuantityScreen from "./src/screens/itemQuantityScreen";
import TicketViewScreen from "./src/screens/ticketViewScreen";
import CretePrnterScreen from "./src/screens/createPrinterScreen";
import PrintersScreen from "./src/screens/printersScreen";
import ViewSingleItemScreen from "./src/screens/viewSingleItemScreen";
import SignInScreen from "./src/screens/signInScreen";
import SignUpScreen from "./src/screens/signUpScreen";
import AuthLoadingScreen from "./src/screens/authLoadingScreen";
import AssignItemsToCategoryScreen from "./src/screens/assignItemsToCategoryScreen";
import CustomerProfileScreen from "./src/screens/customerProfileScreen";
import SplitScreen from "./src/screens/splitScreen";
import LoginHelpScreen from "./src/screens/loginHelpScreen";
import SplitCashScreen from "./src/screens/splitCashScreen";
import SplitCardScreen from "./src/screens/splitCardScreen";
import CardScreen from "./src/screens/cardScreen";
import EditDiscount from "./src/screens/editDiscount";
import EditCategory from "./src/screens/editCategoryScreen";
import AssignItemsEditScreen from "./src/screens/assignItemsEditScreen";
import BarcodeScreen from "./src/screens/barcodeScreen";
import BarcodeEditScreen from "./src/screens/barcodeEditScreen";
import ChangePasswordScreen from "./src/screens/changePasswordScreen";
import SoldByScreen from "./src/screens/soldByScreen";
import ViewPdfScreen from "./src/screens/viewPdfScreen";
import signUpStrings from "./src/localization/signUpStrings";
import {Dimensions} from 'react-native';
// import getSWD from "./src/screens/salesScreen";

// const getSWD=()=> {
//     const windowWidth = Dimensions.get('window').width;
//     return windowWidth;
// }
let newProps = {};
const MyDrawerNavigator = createDrawerNavigator({

    SalesScreen: {
        screen: SalesScreen,
        navigationOptions: {
            drawerLabel: () => null
        },
    },

    AllReceipts: {
        screen: AllReceipts,
        navigationOptions: {
            drawerLabel: () => null
        },
    },
    ItemsMain: {
        screen: ItemsMain,
        navigationOptions: {
            drawerLabel: () => null
        },
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            drawerLabel: () => null
        },
    },
    HelpScreen: {
        screen: HelpScreen,
        navigationOptions: {
            drawerLabel: () => null
        },
    },


    CustomerProfileScreen: {
        screen: CustomerProfileScreen
    },
    ItemPriceScreen: {
        screen: ItemPriceScreen
    },
    AllItems: {
        screen: AllItems
    },
    NewItem: {
        screen: NewItem
    },
    ItemQuantityScreen: {
        screen: ItemQuantityScreen
    },
    SplitScreen: {
        screen: SplitScreen
    },
    LoginHelpScreen: {
        screen: LoginHelpScreen
    },
    ViewSingleItemScreen: {
        screen: ViewSingleItemScreen
    },
    AssignItemsToCategoryScreen: {
        screen: AssignItemsToCategoryScreen
    },
    TicketViewScreen: {
        screen: TicketViewScreen
    },
    CretePrnterScreen: {
        screen: CretePrnterScreen
    },
    EmailReceiptScreen: {
        screen: EmailReceiptScreen
    },
    PrintersScreen: {
        screen: PrintersScreen
    },
    RefundScreen: {
        screen: RefundScreen
    },
    EditItem:{
        screen: EditItem
    },
    CreateCustomer: {
        screen: CreateCustomer
    },
    CashScreen: {
        screen: CashScreen
    },
    ReceiptDetailsScreen: {
        screen: ReceiptDetailsScreen
    },
    CustomerToTicketScreen: {
        screen: CustomerToTicketScreen
    },
    ChargeScreen: {
        screen: ChargeScreen
    },
    AllCategories: {
        screen: AllCategories
    },
    NewCategory: {
        screen: NewCategory
    },
    AllDiscounts: {
        screen: AllDiscounts
    },
    SplitCashScreen:{
        screen:SplitCashScreen
    },
    NewDiscount: {
        screen: NewDiscount
    },
    CardScreen: {
        screen: CardScreen
    },
    SplitCardScreen: {
        screen: SplitCardScreen
    },
    EditDiscount: {
        screen: EditDiscount
    },
    EditCategory: {
        screen: EditCategory
    },
    AssignItemsEditScreen: {
        screen: AssignItemsEditScreen
    },
    ChangePasswordScreen: {
        screen : ChangePasswordScreen
    },
    BarcodeScreen: {
        screen: BarcodeScreen
    },
    BarcodeEditScreen: {
        screen: BarcodeEditScreen
    },

    SoldByScreen: {
        screen: SoldByScreen
    },
    ViewPdfScreen: {
        screen : ViewPdfScreen
    }



},
    {
        backBehavior: 'initialRoute',
        unmountInactiveRoutes: true,
        contentComponent: (props) => (
            <SafeAreaView style={{}}>
                <View style={{ height: hp("30%")}}>
                    <ImageBackground
                        source={require("./src/assets/img/posBackground.jpg")}
                        style={{ height: hp("30%") }} >
                        <Text style={{ marginTop: hp('20%'), marginStart: wp('5%') }}>
                            Welcome back</Text>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: hp('0.2%'), marginStart: wp('5%') }}>
                            {store.getState().data.userData.name}
                        </Text>

                    </ImageBackground>
                </View>
                <ScrollView>
                    <DrawerItems {...props} />
                    <TouchableOpacity style={{height : 40}}
                        onPress={() => props.navigation.navigate('SalesScreen')}>
                        <View style={{
                            width: wp('60%'), flexDirection: 'row',
                            alignItems: 'center', marginTop: hp('1%'),
                            paddingTop:'2%',
                            paddingLeft:'2%',
                            // paddingLeft:(this.getSWD() < 500) ? wp('1%') : (getSWD() > 1000) ? wp('1.5%') : wp('1%'),
                            // paddingRight:(this.getSWD() < 500) ? wp('1%') : (getSWD() > 1000) ? wp('1.5%') : wp('1%'),
                        }}>
                            <View style={{width:(this.getSWD() < 500) ? wp('9%') : (getSWD() > 1000) ? wp('6%') : wp('7%')}}>
                                <Icon name={'basket'} size={25} style={{ marginStart: wp('2%'), color: '#4e4e4e'}} />
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginStart: wp('4%'), color: '#4e4e4e'
                                                ,paddingLeft:(this.getSWD() < 500) ? wp('1%') : (getSWD() > 1000) ? wp('1.5%') : wp('1%')
                                            }}>{signUpStrings.sales}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* sales ends */}

                    <TouchableOpacity style={{height : 40}}
                        onPress={() => props.navigation.navigate('AllReceipts')}>
                        <View style={{
                            width: wp('68%'), flexDirection: 'row',
                            alignItems: 'center', marginTop: hp('1%'),
                            padding:'2%',
                            paddingLeft:'2%',
                        }}>
                            <View style={{width:(this.getSWD() < 500) ? wp('9%') : (getSWD() > 1000) ? wp('6%') : wp('7%')}}>
                                <Icon name={'copy'} size={26} style={{ marginStart: wp('2%'), color: '#4e4e4e' ,paddingLeft:'2%'}} />
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginStart: wp('4%'), color: '#4e4e4e',paddingLeft:(this.getSWD() < 500) ? wp('1%') : (getSWD() > 1000) ? wp('1.5%') : wp('1%') }}>{signUpStrings.receipts}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* receipts ends */}

                    <TouchableOpacity style={{height : 40}}
                        onPress={() => props.navigation.navigate('ItemsMain')}>
                        <View style={{
                            width: wp('68%'), flexDirection: 'row',
                            alignItems: 'center', marginTop: hp('1%'),
                            padding:'2%',
                            paddingLeft:'2%',
                        }}>
                            <View style={{width:(this.getSWD() < 500) ? wp('9%') : (getSWD() > 1000) ? wp('6%') : wp('7%')}}>
                                <Icon name={'list'} size={26} style={{ marginStart: wp('2%'), color: '#4e4e4e' ,paddingLeft:'2%'}} />
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginStart: wp('4%'), color: '#4e4e4e',paddingLeft:(this.getSWD() < 500) ? wp('1%') : (getSWD() > 1000) ? wp('1.5%') : wp('1%') }}>{signUpStrings.items}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* items ends */}

                    <TouchableOpacity style={{height : 40}}
                        onPress={() => props.navigation.navigate('Settings')}>
                        <View style={{
                            width: wp('68%'), flexDirection: 'row',
                            alignItems: 'center', marginTop: hp('1%'),
                            padding:'2%',
                            paddingLeft:'2%',
                        }}>
                            <View style={{width:(this.getSWD() < 500) ? wp('9%') : (getSWD() > 1000) ? wp('6%') : wp('7%')}}>
                                <Icon name={'settings'} size={25} style={{ marginStart: wp('2%'), color: '#4e4e4e' ,paddingLeft:'2%'}} />
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginStart: wp('4%'), color: '#4e4e4e',paddingLeft:(this.getSWD() < 500) ? wp('1%') : (getSWD() > 1000) ? wp('1.5%') : wp('1%') }}>{signUpStrings.settings}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* settings ends */}

                    <TouchableOpacity style={{height : 40}}
                        onPress={() => props.navigation.navigate('HelpScreen')}>
                        <View style={{
                            width: wp('68%'), flexDirection: 'row',
                            alignItems: 'center', marginTop: hp('1%'),
                            padding:'2%',
                            paddingLeft:'2%',
                        }}>
                            <View style={{width:(this.getSWD() < 500) ? wp('9%') : (getSWD() > 1000) ? wp('6%') : wp('7%')}}>
                                <Icon name={'help-circle'} size={25} style={{ marginStart: wp('2%'), color: '#4e4e4e' ,paddingLeft:'2%'}} />
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginStart: wp('4%'), color: '#4e4e4e',paddingLeft:(this.getSWD() < 500) ? wp('1%') : (getSWD() > 1000) ? wp('1.5%') : wp('1%') }}>{signUpStrings.help}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* \help ends */}

                    <TouchableOpacity style={{height : 45}}
                        onPress={() => props.navigation.navigate('SignIn')}>
                        <View style={{
                            width: wp('68%'), flexDirection: 'row',
                            alignItems: 'center', marginTop: hp('1%'),
                            padding:'2%',
                            paddingLeft:'2%',
                        }}>
                            <View style={{width:(this.getSWD() < 500) ? wp('9%') : (getSWD() > 1000) ? wp('6%') : wp('7%')}}>
                                <Icon name={'power'} size={25} style={{ marginStart: wp('2%'), color: '#4e4e4e' ,paddingLeft:'2%'}} />
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginStart: wp('4%'), color: '#4e4e4e',paddingLeft:(this.getSWD() < 500) ? wp('1%') : (getSWD() > 1000) ? wp('1.5%') : wp('1%') }}>{signUpStrings.logout}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* \logout ends */}
                </ScrollView>
            </SafeAreaView>
        )
    });




//Default shows the 1st route defined here..
const AuthStack = createStackNavigator(
    {
        SignIn: SignInScreen,
        SignUp: SignUpScreen
    });



const switchNavigator = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        //AuthLoading:SplitScreen,
        MainUser: MyDrawerNavigator,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));

const MyApp = createAppContainer(switchNavigator);

const store = createStore(allReducers, applyMiddleware(thunkMiddleware));


class App extends React.Component {

    render() {
        getSWD=()=> {
            const windowWidth = Dimensions.get('window').width;
            return windowWidth;
        }
        return (
            <Provider store={store}>
                <Container>
                    <Root>
                        <MyApp >
                        </MyApp>
                    </Root>
                </Container>
            </Provider>
        );
    }
}

export default App;
