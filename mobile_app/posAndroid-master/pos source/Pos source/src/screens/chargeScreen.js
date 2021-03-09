import React, { Component } from 'react';
import {
    Container,
    Content,
    Form,
    Header,
    Icon,
    Input,
    Item,
    Label,
    Button,
    Text,
    Left, Right,
    Body,
    Card,
    Title,
    Toast,
    Spinner,
} from "native-base";
import {
    Platform, StyleSheet, View, TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';
import { SearchBar } from "react-native-elements";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
} from "react-native-responsive-screen";
import { getCases, } from "../redux/actions";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import signUpStrings from '../localization/signUpStrings';


class ChargeScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            priceReceived: "",
            name: '',
            discount: "",
            calculatedDiscount: 0,
            changeRem: "",
            email: "",
            emailValid: null,
            discTypePer: "Percentage",
            discTypeAmo: "",
            checkDiscPer: true,
            checkDiscAmo: false,
            calculatedTotalDue: 0,
            finalAmount : 0
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false,
            finalAmount:this.state.data.ChargeAmount

        });
        console.log("Customer Data", this.state.data);
        lor(this);
    }

    componentWillUnmount() {
        rol();
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
                        <Icon onPress={() => this.props.navigation.navigate('SalesScreen')}
                              name="md-close"
                              style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }} >
                        <Title></Title>
                    </Body>
                    <Right>
                        <Button transparent color="white"
                            onPress={() =>
                                this.props.navigation.navigate('SplitScreen',
                                    {
                                        data: {
                                            ChargeAmount: this.state.discount != "" ? this.state.calculatedTotalDue : this.state.data.ChargeAmount,
                                            ChargeItems: this.state.data.ChargeItems,
                                            TotalAmount: this.state.data.TotalAmount,
                                            DiscountedAmount: this.state.discount != "" ? this.state.calculatedDiscount : this.state.data.DiscountedAmount,
                                            DiscountName: this.state.name,
                                            DiscountType: this.state.name == "" ? "" : this.state.discTypePer + this.state.discTypeAmo,
                                            CustomerData: this.state.data.CustomerData
                                        }
                                    })}>
                            <Text>{signUpStrings.split}</Text>
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
                    {/* Discount Section */}
                    <Card style={{ marginLeft: wp('0%'), marginRight: wp('0%'), width: wp('95%') }}>
                        <Content padder>
                            {/* Name */}
                            <Item floatingLabel>
                                <Label>{signUpStrings.discountReference}</Label>
                                <Input onChangeText={text => {
                                    this.state.name = text;
                                    this.forceUpdate();
                                }}
                                    value={this.state.name}

                                />
                                {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>

                                {/* Name */}
                                <Item floatingLabel style={{ width: wp('50%') }}>
                                    <Label>{signUpStrings.discount}</Label>
                                    <Input onChangeText={text => {
                                        this.state.discount = text;
                                        this.forceUpdate();
                                        if (this.state.checkDiscPer) {
                                            this.setState({
                                                calculatedDiscount: this.state.data.DiscountedAmount + ((this.state.data.ChargeAmount * this.state.discount) / 100),
                                                calculatedTotalDue: this.state.data.TotalAmount - (this.state.data.DiscountedAmount + ((this.state.data.ChargeAmount * this.state.discount) / 100)),


                                            }, ()=>{
                                               this.state.finalAmount = this.state.calculatedTotalDue !=0 ? this.state.calculatedTotalDue : this.state.ChargeAmount
                                            })
                                        } else if (this.state.checkDiscAmo) {
                                            this.setState({
                                                calculatedDiscount: parseInt(this.state.data.DiscountedAmount) + parseInt(this.state.discount),
                                                calculatedTotalDue: this.state.data.TotalAmount - (parseInt(this.state.data.DiscountedAmount) + parseInt(this.state.discount)),
                                                finalAmount : this.state.calculatedTotalDue !=0 ? this.state.calculatedTotalDue : this.state.ChargeAmount
                                            }, ()=>{
                                                this.state.finalAmount = this.state.calculatedTotalDue !=0 ? this.state.calculatedTotalDue : this.state.ChargeAmount
                                            })
                                        }
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
                                            checkDiscAmo: false,
                                            calculatedDiscount: this.state.data.DiscountedAmount + ((this.state.data.ChargeAmount * this.state.discount) / 100),
                                            calculatedTotalDue: this.state.data.TotalAmount - (this.state.data.DiscountedAmount + ((this.state.data.ChargeAmount * this.state.discount) / 100)),
                                        },()=>{
                                            this.state.finalAmount = this.state.calculatedTotalDue !=0 ? this.state.calculatedTotalDue : this.state.ChargeAmount
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
                                    }}>{this.state.checkDiscPer ? <Text style={{ backgroundColor: 'gray', color: 'white' }}>%</Text> : <Text>%</Text>}

                                    </Button>
                                    <Button bordered style={{ backgroundColor: '' }} onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            checkDiscAmo: !this.state.checkDiscAmo,
                                            checkDiscPer: false,
                                            calculatedDiscount: parseInt(this.state.data.DiscountedAmount) + parseInt(this.state.discount),
                                            calculatedTotalDue: this.state.data.TotalAmount - (parseInt(this.state.data.DiscountedAmount) + parseInt(this.state.discount)),
                                        },()=>{
                                            this.state.finalAmount = this.state.calculatedTotalDue !=0 ? this.state.calculatedTotalDue : this.state.ChargeAmount
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
                                    }} >{this.state.checkDiscAmo ? <Text style={{ backgroundColor: 'gray', color: 'white' }}>Σ</Text> : <Text>Σ</Text>}

                                    </Button>


                                </Item>
                            </Item>
                        </Content>
                    </Card>

                    <View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: wp('45%'), height: wp('25%'), marginTop: wp('4%'), backgroundColor: 'rgba(0,0,0,0)', alignItems: 'center' }}>
                                <Text style={{ fontSize: hp('4%') }}>
                                    {this.state.data.TotalAmount}
                                </Text>
                                <Text style={{ fontSize: hp('3%') }}>
                                    {signUpStrings.totatlAmount}
                                </Text>
                            </View>
                            <View style={{ width: wp('45%'), height: wp('25%'), marginTop: wp('4%'), backgroundColor: 'rgba(0,0,0,0)', alignItems: 'center' }}>
                                <Text style={{ fontSize: hp('4%') }}>
                                    {this.state.discount != "" ? this.state.calculatedDiscount.toFixed(2) : this.state.data.DiscountedAmount.toFixed(2)}
                                </Text>
                                <Text style={{ fontSize: hp('3%') }}>
                                    {signUpStrings.discountedAmount}
                                </Text>
                            </View>

                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: wp('90%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)', alignItems: 'center' }}>
                                <Text style={{ fontSize: hp('8.4%') }}>
                                    {this.state.discount != "" ? this.state.calculatedTotalDue.toFixed(2) : this.state.data.ChargeAmount.toFixed(2)}
                                </Text>
                                <Text style={{ fontSize: hp('3.4%') }}>
                                    {signUpStrings.totalAmountDue}
                           </Text>
                            </View>
                        </View>
                    </View>
                    <Form>

                        {/* Charge Amount */}
                        <Item floatingLabel>
                            <Label>{signUpStrings.cashReceived}</Label>
                            <Input onChangeText={text => {
                                this.state.priceReceived = text;
                                this.forceUpdate();
                                this.setState({
                                    price: this.state.priceReceived
                                })

                            }}
                                value={this.state.priceReceived}
                                keyboardType="phone-pad"
                            />
                        </Item>
                        <Text></Text>
                        {/* CASH */}
                        {this.state.finalAmount > parseFloat(this.state.priceReceived) || this.state.priceReceived == "" ?
                            <Button bordered
                                style={{ width: wp('95%'), borderColor: 'gray', justifyContent: 'center' }}
                                onPress={()=> {
                                    this.showToast(`${signUpStrings.receivedAmountNtEnough}`,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                                }}
                            >
                                <Item style={{ borderBottomWidth: wp('0%') }}>
                                    <Icon style={{ color: 'gray', fontWeight: 'bold' }}
                                        name='ios-cash'
                                        size={hp('2.4%')}>
                                    </Icon>
                                    <Text style={{ color: 'gray' }}>{signUpStrings.cash}</Text>
                                </Item>
                            </Button>
                            :
                            <Button bordered
                                style={{ width: wp('95%'), borderColor: 'gray', justifyContent: 'center' }}
                                onPress={() => {
                                    this.setState({
                                        ...this.state,
                                        pageLoading:true
                                    });
                                    this.forceUpdate();
                                    this.props.navigation.navigate('CashScreen',
                                        {
                                            data: {
                                                ChargeAmount: this.state.discount != "" ? this.state.calculatedTotalDue : this.state.data.ChargeAmount,
                                                PriceReceived: this.state.priceReceived,
                                                ChargeItems: this.state.data.ChargeItems,
                                                TotalAmount: this.state.data.TotalAmount,
                                                DiscountedAmount: this.state.discount != "" ? this.state.calculatedDiscount : this.state.data.DiscountedAmount,
                                                DiscountName: this.state.name,
                                                DiscountType: this.state.name == "" ? "" : this.state.discTypePer + this.state.discTypeAmo,
                                                CustomerData: this.state.data.CustomerData
                                            }
                                        })
                                }}>
                                <Item style={{ borderBottomWidth: wp('0%') }}>
                                    <Icon style={{ color: 'gray', fontWeight: 'bold' }}
                                        name='ios-cash'
                                        size={hp('2.4%')}>
                                    </Icon>
                                    <Text style={{ color: 'gray' }}>{signUpStrings.cash}</Text>
                                </Item>
                            </Button>
                        }

                        <Text></Text>

                        {/* CARD */}
                        {this.state.finalAmount > parseFloat(this.state.priceReceived) || this.state.priceReceived == "" ?
                            <Button bordered
                                style={{ width: wp('95%'), borderColor: 'gray', justifyContent: 'center' }}
                                onPress={()=> {
                                    this.showToast(`${signUpStrings.receivedAmountNtEnough}`,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                                }}
                            >
                                <Item style={{ borderBottomWidth: wp('0%') }}>
                                    <Icon style={{ color: 'gray', fontWeight: 'bold' }}
                                        name='ios-cash'
                                        size={hp('2.4%')}>
                                    </Icon>
                                    <Text style={{ color: 'gray' }}>{signUpStrings.card}</Text>
                                </Item>
                            </Button>
                            :
                            <Button bordered
                            style={{ width: wp('95%'), borderColor: 'gray', justifyContent: 'center' }}
                            onPress={() => {
                                this.setState({
                                    ...this.state,
                                    pageLoading: true
                                }, ()=>{
                                    this.props.navigation.navigate('CardScreen',{
                                        data: {
                                            ChargeAmount: this.state.discount != "" ? this.state.calculatedTotalDue : this.state.data.ChargeAmount,
                                            PriceReceived: this.state.priceReceived,
                                            ChargeItems: this.state.data.ChargeItems,
                                            TotalAmount: this.state.data.TotalAmount,
                                            DiscountedAmount: this.state.discount != "" ? this.state.calculatedDiscount : this.state.data.DiscountedAmount,
                                            DiscountName: this.state.name,
                                            DiscountType: this.state.name == "" ? "" : this.state.discTypePer + this.state.discTypeAmo,
                                            CustomerData: this.state.data.CustomerData
                                        }
                                    })
                                });

                            }}
                        >
                            <Item style={{ borderBottomWidth: wp('0%') }}>
                                <Icon
                                    style={{ color: 'gray', fontWeight: 'bold' }}
                                    name='ios-card'
                                    size={hp('2.4%')} />
                                <Text style={{ color: 'gray' }}>CARD</Text>
                            </Item>
                        </Button>
                        }


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
export default connect(mapStateToProps, matchDispatchToProps)(ChargeScreen);

