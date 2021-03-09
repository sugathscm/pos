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


class CreateCustomer extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading : true,
            name:"",
            email:"",
            number:"",
            note:"",
            nameValid:null,
            emailValid:null,
            numberValid:null
        };
    }

    componentDidMount(){
        this.setState({
            ...this.state,
            pageLoading : false
        });
    }

    validate(){
        console.log("validating form..");
        // Name
        if(this.state.nameValid !== null || this.state.name !== ""){
            if(this.state.name && this.state.name.length >= 3){
                this.state.nameValid = true;
            }else{
                this.state.nameValid = false;
            }
        }
        // Email
        if(this.state.emailValid !== null || this.state.email !== ""){
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(re.test(String(this.state.email).toLowerCase())){
                this.state.emailValid = true;
            }else{
                this.state.emailValid = false;
            }
        }
        //Mobile Number
        if(this.state.numberValid !==null || this.state.number!== ""){
            var re = /^[0-9]{10}$/;

            if(re.test(String(this.state.number))){
                this.state.numberValid = true;
            }else{
                this.state.numberValid = false;
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

    resetState(){
        this.setState({
            name:"",
            nameValid :null,
            email:"",
            emailValid:null,
            number:"",
            numberValid:null,
            note:"",
        })
        this.forceUpdate();
    };

    submitForm(){
        console.log("submitting form..");
        this.state.pageLoading = true;
        this.forceUpdate();

        let customer = {
            name: this.state.name,
            email : this.state.email,
            mobileNumber : this.state.number,
            note : this.state.note,
            companyId : this.props.userData.userData.companyId
        };

        if(customer.name === ""){
            this.showToast(`${signUpStrings.pleaseFillAll}` ,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
            this.state.pageLoading = false;
            return;
        }

        if(customer.email === ""){
            this.showToast(`${signUpStrings.pleaseFillAll}` ,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
            this.state.pageLoading = false;
            return;
        }

        if(customer.mobileNumber === ""){
            this.showToast(`${signUpStrings.pleaseFillAll}` ,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
            this.state.pageLoading = false;
            return;
        }

        if(customer.note === ""){
            this.showToast(`${signUpStrings.pleaseFillAll}` ,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
            this.state.pageLoading = false;
            return;
        }

        axios
            .post(AppURLS.ApiBaseUrl + 'customers/addCustomer', customer)
            .then(response => {
                console.log("backend data", JSON.stringify(response));
                if(response.data.success){
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    this.resetState();
                    this.showToast(`${signUpStrings.cstmrCreatedSuccessfully}` ,`${signUpStrings.ok}`, `${signUpStrings.success}`);
                }else{
                    this.showToast(`${signUpStrings.invalidDetails}` ,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                }
            })
            .catch(error => {
                console.log("error",error);
                this.state.pageLoading = false;
                this.forceUpdate();

                if(error.response.data.dialogMessage){
                    //alert(error.response.data.dialogMessage + " Please try again");
                    this.state.dialogMessage = "Please enter valid details, and try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                }else{
                    this.state.dialogMessage = "Failed adding new customer. Please try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                }

            });

    }




    showToast(message,text, type){
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
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
                    <Left style={{ flexDirection: 'row'}}>
                        {/*<Icon onPress={() => this.props.navigation.navigate('CustomerToTicketScreen')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />*/}
                    </Left>
                    <Body style={{flex:1}} >
                        <Title>{signUpStrings.createCustomer}</Title>
                    </Body>
                    <Right>
                    <Button transparent color="white" onPress={() => this.submitForm()}>
                    <Text>{signUpStrings.saveInCreateCustomer}</Text>
                    </Button>
                    </Right>
                </Header>
            {/* Spinner */}
            { this.state.pageLoading ? <Spinner color='blue' style={{position: 'absolute',
                backgroundColor : 'rgba(0,0,0,0.4)', height : hp('100%'),
                width : wp('100%'), zIndex:2000}} /> : null}
            <Content padder>

                <Form>
                     {/* Name */}
                     <Item floatingLabel
                        success={this.state.nameValid === true ? true : null}
                        error={this.state.nameValid === false ? true : null}>
                        <Icon name='md-person' style={{color : 'gray'}} />
                        <Label style={{color : 'gray', marginStart : wp('3%')}}>{signUpStrings.Name}</Label>
                        <Input onChangeText={text => {
                            this.state.name = text;
                            this.validate();

                            }}
                               value={this.state.name}
                        />
                         <Icon name={this.showValidityIcon(this.state.nameValid)}/>
                    </Item>

                    {/* Email */}
                    <Item floatingLabel
                    success={this.state.emailValid === true ? true : null}
                    error={this.state.emailValid === false ? true : null}>
                        <Icon name='md-mail' style={{color : 'gray'}} />
                        <Label style={{color : 'gray', marginStart : wp('3%')}}>{signUpStrings.Email}</Label>
                        <Input onChangeText={text => {
                            this.state.email = text;
                            this.validate();

                            }}
                               value={this.state.email}
                        />
                        <Icon name={this.showValidityIcon(this.state.emailValid)}/>
                    </Item>

                    {/* Number */}
                    <Item floatingLabel
                    success={this.state.numberValid === true ? true : null}
                    error={this.state.numberValid === false ? true : null}>
                        <Icon name='md-call' style={{color : 'gray'}} />
                        <Label style={{color : 'gray', marginStart : wp('3%')}}>{signUpStrings.MobileNumber}</Label>
                        <Input onChangeText={text => {
                            this.state.number = text;
                            this.validate();

                            }}
                               value={this.state.number}
                               keyboardType="phone-pad"
                        />
                        <Icon name={this.showValidityIcon(this.state.numberValid)}/>
                    </Item>

                    {/* Note */}
                    <Item floatingLabel>
                        <Icon name='md-paper' style={{color : 'gray'}} />
                        <Label style={{color : 'gray', marginStart : wp('3%')}}>{signUpStrings.Note}</Label>
                        <Input onChangeText={text => {
                            this.state.note = text;
                            this.validate();

                            }}
                               value={this.state.note}
                        />
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
export default connect(mapStateToProps, matchDispatchToProps)(CreateCustomer);

