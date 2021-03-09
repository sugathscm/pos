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
    Card,
    Picker,
    Spinner, Radio, Segment, Thumbnail
} from "native-base";
import ModalSelector from 'react-native-modal-selector';
import {
    Image, ImageBackground, Platform, StyleSheet, View, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';
import { ButtonGroup } from "react-native-elements";
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
import signInScreen from './signInScreen';
import signUpStrings from '../localization/signUpStrings';


class NewDiscount extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            name: "",
            formNameValid: null,
            formDiscountValid: null,
            discount: "",
            allItems: [],
            selectedItem: "",
            selectedItemId: "",
            discTypePer: "Percentage",
            discTypeAmo: "",
            checkDiscPer: true,
            checkDiscAmo: false
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false
        });
        this.props.getCases(this.props.userData);
    }

    getCases() {
        this.props.getCases(this.props.userData);
    }
    validate() {
        console.log("validating form..");
        // Name
        if (this.state.formNameValid !== null || this.state.name !== "") {
            if (this.state.name && this.state.name.length >= 3) {
                this.state.formNameValid = true;
            } else {
                this.state.formNameValid = false;
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
            return 'create';
        }
    }

    componentWillReceiveProps(nextProps) {

        this.state.allItems = [];

        Object.keys(nextProps.userData.allItems).forEach(function (key, index) {

            let itemObj = {};
            console.log("ssssssss", nextProps.userData.allItems)
            itemObj.label = nextProps.userData.allItems[key].name;
            itemObj.key = nextProps.userData.allItems[key]._id;

            let objAvailable = false;
            for (let i = 0; i < this.state.allItems.length; i++) {
                if (this.state.allItems[i].key === itemObj.key) {
                    objAvailable = true;
                    break;
                }
            }
            if (!objAvailable) {
                this.state.allItems.push(itemObj);
            }
        }.bind(this));
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
        console.log("submitting form..");

        this.setState({
            ...this.state,
            pageLoading: true
        });

        let discount = {
            name: this.state.name,
            discount: this.state.discount,
            companyId: this.props.userData.userData.companyId,
            itemId: this.state.selectedItemId,
            itemName:this.state.selectedItem,
            discountType : this.state.discTypePer + this.state.discTypeAmo
        }

        console.log("aaaaaaaa", discount)
        axios
            .post(AppURLS.ApiBaseUrl + 'discounts/addDiscount', discount)
            .then(response => {
                console.log("backend data", response);

                if (response.data.success) {
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    this.showToast(`${signUpStrings.discountAddedSuccessfully}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                    this.props.navigation.navigate('AllDiscounts')

                } else {
                    this.showToast(`${signUpStrings.invalidDetails}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });
                }
            })
            .catch(error => {
                console.log("error", error);
                this.showToast(`${signUpStrings.pleaseFillTheNecessaryDetails}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                this.setState({
                    ...this.state,
                    pageLoading: false
                });
            });
    }


    render() {
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
                        <Icon onPress={() => this.props.navigation.navigate('AllDiscounts')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body >
                        <Title>{signUpStrings.createDiscount}</Title>
                    </Body>
                    <Right>
                        <Button transparent color="white" onPress={() => this.submitForm()}>
                            <Text>{signUpStrings.save}</Text>
                        </Button>
                        {/* <Icon active name="search" onPress={() => this.props.navigation.navigate('NewItem')}
                              style={{ color: 'white', marginRight: 15 }} /> */}
                    </Right>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content>
                    <Form>

                        <Card style={{ marginLeft: wp('0%'), marginRight: wp('0%'), width: wp('100%') }}>
                            <Content padder>
                                {/* Name */}
                                <Item floatingLabel>
                                    <Label>{signUpStrings.discountRef}</Label>
                                    <Input onChangeText={text => {
                                        this.state.name = text;
                                        this.validate();
                                    }}
                                        value={this.state.name}

                                    />
                                    {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                                </Item>



                                <Item style={{ borderBottomWidth: 0 }}>

                                    {/* Name */}
                                    <Item floatingLabel style={{ width: wp('50%') }}>
                                        <Label>{signUpStrings.value}</Label>
                                        <Input onChangeText={text => {
                                            this.state.discount = text;
                                            this.validate();
                                        }}
                                            value={this.state.discount}
                                            keyboardType="phone-pad"
                                        />
                                        {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                                    </Item>

                                    <Item style={{ borderBottomWidth: 0, marginTop: hp('2%'), marginLeft: wp('2%') }}>
                                    <Button bordered style={{ backgroundColor: '' }} onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            checkDiscPer: !this.state.checkDiscPer,
                                            checkDiscAmo: false
                                        });
                                        if (!this.state.checkDiscPer) {
                                            this.setState({
                                                discTypePer: "Percentage",
                                                discTypeAmo: ""
                                            })
                                        } else {
                                            this.setState({
                                                discTypePer: ""
                                            })
                                        }
                                        console.log("Perc", this.state.checkDiscPer, this.state.discTypePer)
                                    }}>{this.state.checkDiscPer ? <Text style={{backgroundColor:'gray' , color:'white'}}>%</Text> : <Text>%</Text>}
                                      
                                    </Button>
                                    <Button bordered style={{ backgroundColor: '' }} onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            checkDiscAmo: !this.state.checkDiscAmo,
                                            checkDiscPer: false
                                        });
                                        if (!this.state.checkDiscAmo) {
                                            this.setState({
                                                discTypeAmo: "Amount",
                                                discTypePer: ""
                                            })
                                        } else {
                                            this.setState({
                                                discTypeAmo: ""
                                            })
                                        }
                                        console.log("Amount", this.state.checkDiscAmo, this.state.discTypeAmo)
                                    }} >{this.state.checkDiscAmo ? <Text style={{backgroundColor:'gray' , color:'white'}}>Σ</Text> : <Text>Σ</Text>}
                                       
                                    </Button>
                                       
                                    
                                    </Item>

                                </Item>

                                <Item style={{ borderBottomWidth: 0, marginTop: hp('4%') }}>
                                    <Text>{signUpStrings.allItems}s</Text>
                                </Item>

                                <Item style={{ marginBottom: wp('5%') }}>
                                    <ModalSelector
                                        style={{ width: wp('85%') }}
                                        data={this.state.allItems}
                                        supportedOrientations={['landscape']}
                                        accessible={true}
                                        scrollViewAccessibilityLabel={'Scrollable options'}
                                        cancelButtonAccessibilityLabel={'Cancel Button'}
                                        onChange={(option) => {
                                            console.log("aaaaaaaaaaaaaaa", option.key)

                                            this.setState({
                                                ...this.state,
                                                selectedItem: option.label,
                                                selectedItemId: option.key
                                            })
                                        }}>

                                        <Input
                                            style={{ padding: 0, height: hp('8%') }}
                                            editable={false}
                                            placeholder="Select an item"
                                            value={this.state.selectedItem} />

                                    </ModalSelector>
                                </Item>

                    

                            </Content>

                        </Card>
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
export default connect(mapStateToProps, matchDispatchToProps)(NewDiscount);

