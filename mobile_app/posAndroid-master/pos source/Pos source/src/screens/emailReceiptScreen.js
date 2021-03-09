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
    Button ,
    Text,
    Left, Right,
    Body,
    Title,
    Toast,
    Picker,
    Spinner,Radio
} from "native-base";
import {
    Image, ImageBackground, Platform, StyleSheet, View, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';
import { SearchBar} from "react-native-elements";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {decrement, getCases, increment, multiply} from "../redux/actions";
import {bindActionCreators} from 'redux';
import { Switch } from 'react-native-base-switch';
import {connect} from 'react-redux';
import moment from "./homeScreen";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import signUpStrings from '../localization/signUpStrings';


class EmailReceiptScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading : true,
            formEmail : "",
            formEmailValid : null,
        };
    }

    componentDidMount(){
        this.setState({
            ...this.state,
            pageLoading : false
        });
        console.log("Dataaaaa" , this.state.data)
    }

    componentWillReceiveProps(nextProps) {

    };

    validate() {
        console.log("validating form..");
        console.log(this.props.userData, "sssssssssssss")

        // Email
        if (this.state.formEmailValid !== null || this.state.formEmail !== "") {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(this.state.formEmail).toLowerCase())) {
                this.state.formEmailValid = true;
            } else {
                this.state.formEmailValid = false;
            }
        }

        this.forceUpdate();
    }

    showValidityIcon(value){
        if(value !== null){
            if(value === true){
                return 'checkmark-circle';
            }else{
                return 'close-circle';
            }
        }else{
            return 'create';
        }
    }

    showToast(message,text, type){
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }

    sendEmail() {
        console.log("Start")
        this.state.pageLoading = true;

        let data = {
            items: this.state.data.items,
            email: this.state.formEmail,
            chargeAmount: this.state.data.chargeAmount,
            discountedAmount: this.state.data.discountedAmount,
            userName: this.props.userData.userData.name,
            companyId: this.props.userData.userData.companyId,
            paymentType: this.state.data.paymentType
        }
        axios
            .post(AppURLS.ApiBaseUrl + 'charge/sendReceipt', data)
            .then(response => {
                console.log("backend data", JSON.stringify(response));
                if (response.data.success) {
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    console.log("data =========>", response);
                    this.showToast(`${signUpStrings.emailSentSuccessfully}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                } else {
                    this.showToast(`${signUpStrings.errorOccured}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
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

        return (
            <Container>
            <Header>
                    <Left style={{ flexDirection: 'row'}}>
                        <Icon  onPress={() => this.props.navigation.navigate('ReceiptDetailsScreen' , { data: this.state.data})} name="md-close" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{flex:1}} >
                        <Title>{signUpStrings.enterEmail}</Title>
                    </Body>
                    <Right>
                    <Button transparent color="white" onPress={()=>{
                        if(this.state.formEmailValid){
                            this.sendEmail();
                        }else{
                            this.showToast(`${signUpStrings.pleaseValidEmail}`, `${signUpStrings.ok}`, `${signUpStrings.ok}`);
                        }
                    }}>
                        <Text>{signUpStrings.send}</Text>
                    </Button>
                    </Right>
                </Header>
            {/* Spinner */}
            { this.state.pageLoading ? <Spinner color='blue' style={{position: 'absolute',
                backgroundColor : 'rgba(0,0,0,0.4)', height : hp('100%'),
                width : wp('100%'), zIndex:2000}} /> : null}
            <Content padder>
                <Form>

                    {/* Email */}
                    <Item floatingLabel
                          success={this.state.formEmailValid === true ? true : null}
                          error={this.state.formEmailValid === false ? true : null}>
                        <Label>{signUpStrings.email}</Label>
                        <Input onChangeText={text => {
                            this.state.formEmail = text;
                            this.validate();
                        }}
                               value={this.state.formEmail}
                               keyboardType="email-address"
                        />
                        <Icon name={this.showValidityIcon(this.state.formEmailValid)} />
                    </Item>

                </Form>
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
export default connect(mapStateToProps, matchDispatchToProps)(EmailReceiptScreen);

